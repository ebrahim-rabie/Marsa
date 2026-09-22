-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Functions for auto-incrementing RFQ and ORD numbers
CREATE SEQUENCE IF NOT EXISTS buy_request_seq;
CREATE OR REPLACE FUNCTION generate_request_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.request_number IS NULL THEN
        NEW.request_number := 'RFQ-' || LPAD(nextval('buy_request_seq')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SEQUENCE IF NOT EXISTS order_seq;
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := 'ORD-' || LPAD(nextval('order_seq')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';


-- 2. companies
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_ar TEXT,
    type TEXT NOT NULL CHECK (type IN ('buyer', 'supplier_eg', 'supplier_cn', 'partner')),
    country TEXT DEFAULT 'EG',
    city TEXT,
    phone TEXT,
    whatsapp TEXT,
    commercial_reg TEXT,
    tax_card TEXT,
    industrial_reg TEXT,
    business_license TEXT,
    website TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1. users
CREATE TABLE users (
    id UUID PRIMARY KEY, -- References auth.users(id) in Supabase
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    full_name TEXT NOT NULL,
    full_name_ar TEXT,
    role TEXT NOT NULL CHECK (role IN ('buyer', 'supplier', 'admin', 'agent')),
    avatar_url TEXT,
    locale TEXT DEFAULT 'ar',
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. suppliers
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    categories TEXT[],
    verification_level INT DEFAULT 0 CHECK (verification_level >= 0 AND verification_level <= 3),
    is_middleman BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    total_deals INT DEFAULT 0,
    avg_rating NUMERIC(3,2) DEFAULT 0.0,
    profile_bio TEXT,
    profile_bio_ar TEXT,
    min_order_value NUMERIC,
    lead_time_days INT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. supplier_verifications
CREATE TABLE supplier_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    level INT CHECK (level >= 1 AND level <= 3),
    method TEXT CHECK (method IN ('documents', 'video_call', 'on_site_audit')),
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    evidence_urls TEXT[],
    notes TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. buy_requests
CREATE TABLE buy_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number TEXT UNIQUE,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_name_ar TEXT,
    category TEXT,
    specifications JSONB,
    quantity INT NOT NULL,
    unit TEXT,
    budget_min NUMERIC,
    budget_max NUMERIC,
    budget_currency TEXT,
    supplier_pref TEXT CHECK (supplier_pref IN ('egyptian', 'chinese', 'both')),
    delivery_date DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sourcing', 'quotes_ready', 'buyer_reviewing', 'accepted', 'expired', 'cancelled')),
    notes TEXT,
    attachments TEXT[],
    source TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. quotes
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buy_request_id UUID NOT NULL REFERENCES buy_requests(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    unit_price NUMERIC NOT NULL,
    currency TEXT NOT NULL,
    moq INT,
    total_price NUMERIC NOT NULL,
    lead_time_days INT,
    shipping_method TEXT,
    shipping_cost NUMERIC,
    estimated_customs NUMERIC,
    estimated_total NUMERIC,
    incoterm TEXT,
    payment_terms TEXT,
    sample_available BOOLEAN DEFAULT false,
    sample_cost NUMERIC,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired', 'cancelled')),
    notes TEXT,
    attachments TEXT[],
    submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE,
    buy_request_id UUID NOT NULL REFERENCES buy_requests(id) ON DELETE RESTRICT,
    quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE RESTRICT,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    total_value NUMERIC NOT NULL,
    currency TEXT NOT NULL,
    commission_rate NUMERIC,
    commission_amount NUMERIC,
    inspection_fee NUMERIC,
    coordination_fee NUMERIC,
    current_stage INT CHECK (current_stage >= 1 AND current_stage <= 7),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'disputed', 'cancelled')),
    deposit_amount NUMERIC,
    deposit_paid BOOLEAN DEFAULT false,
    balance_amount NUMERIC,
    balance_released BOOLEAN DEFAULT false,
    estimated_delivery DATE,
    actual_delivery DATE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. order_stages
CREATE TABLE order_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    stage INT CHECK (stage >= 1 AND stage <= 7),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'skipped')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. inspection_reports
CREATE TABLE inspection_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    inspector TEXT,
    inspection_date DATE,
    result TEXT CHECK (result IN ('passed', 'failed', 'conditional')),
    total_units INT,
    defective_units INT,
    photo_urls TEXT[],
    report_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    quality_rating INT CHECK (quality_rating >= 1 AND quality_rating <= 5),
    communication_rating INT CHECK (communication_rating >= 1 AND communication_rating <= 5),
    delivery_rating INT CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
    comment TEXT,
    comment_ar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. disputes
CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    raised_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('quality', 'quantity', 'delay', 'wrong_item', 'other')),
    description TEXT,
    evidence_urls TEXT[],
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'escalated')),
    resolution TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('contract', 'invoice', 'packing_list', 'bill_of_lading', 'acid_cert', 'customs_form', 'inspection_report', 'commercial_reg', 'tax_card', 'business_license', 'other')),
    name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('deposit', 'balance', 'commission', 'inspection_fee', 'refund')),
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    method TEXT,
    reference TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    title_ar TEXT,
    body TEXT,
    body_ar TEXT,
    link TEXT,
    read BOOLEAN DEFAULT false,
    channel TEXT DEFAULT 'in_app',
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_buy_requests_updated_at BEFORE UPDATE ON buy_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_stages_updated_at BEFORE UPDATE ON order_stages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for auto-incrementing numbers
CREATE TRIGGER set_request_number BEFORE INSERT ON buy_requests FOR EACH ROW EXECUTE FUNCTION generate_request_number();
CREATE TRIGGER set_order_number BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();


-- Functions (optimized with STABLE + search_path for security)

CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT company_id FROM users WHERE id = (SELECT auth.uid());
$$;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users WHERE id = (SELECT auth.uid()) AND role = 'admin'
  );
$$;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE buy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;


-- RLS Policies (using (select auth.uid()) for query plan caching)

-- users
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (id = (SELECT auth.uid()) OR is_admin());
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (id = (SELECT auth.uid()) OR is_admin());

-- companies
CREATE POLICY "Users can view their own company" ON companies FOR SELECT USING (id = get_user_company_id() OR is_admin());
CREATE POLICY "Users can update their own company" ON companies FOR UPDATE USING (id = get_user_company_id() OR is_admin());
CREATE POLICY "Admins can insert companies" ON companies FOR INSERT WITH CHECK (is_admin());

-- suppliers
CREATE POLICY "Anyone can view active suppliers" ON suppliers FOR SELECT USING (active = true OR is_admin() OR company_id = get_user_company_id());
CREATE POLICY "Suppliers can update their own profile" ON suppliers FOR UPDATE USING (company_id = get_user_company_id() OR is_admin());

-- supplier_verifications
CREATE POLICY "Suppliers can view their verifications" ON supplier_verifications FOR SELECT USING (supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id()) OR is_admin());

-- buy_requests
CREATE POLICY "Buyers can view their own requests" ON buy_requests FOR SELECT USING (buyer_id = (SELECT auth.uid()) OR is_admin());
CREATE POLICY "Buyers can insert their own requests" ON buy_requests FOR INSERT WITH CHECK (buyer_id = (SELECT auth.uid()) OR is_admin());
CREATE POLICY "Buyers can update their own requests" ON buy_requests FOR UPDATE USING (buyer_id = (SELECT auth.uid()) OR is_admin());

-- quotes
CREATE POLICY "Users can view quotes related to them" ON quotes FOR SELECT USING (
    submitted_by = (SELECT auth.uid())
    OR buy_request_id IN (SELECT id FROM buy_requests WHERE buyer_id = (SELECT auth.uid()))
    OR is_admin()
);
CREATE POLICY "Suppliers can insert quotes" ON quotes FOR INSERT WITH CHECK (submitted_by = (SELECT auth.uid()) OR is_admin());
CREATE POLICY "Suppliers can update their quotes" ON quotes FOR UPDATE USING (submitted_by = (SELECT auth.uid()) OR is_admin());

-- orders
CREATE POLICY "Users can view their orders" ON orders FOR SELECT USING (
    buyer_id = (SELECT auth.uid())
    OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id())
    OR is_admin()
);

-- order_stages
CREATE POLICY "Users can view order stages" ON order_stages FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE buyer_id = (SELECT auth.uid()) OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id()))
    OR is_admin()
);

-- inspection_reports
CREATE POLICY "Users can view inspection reports" ON inspection_reports FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE buyer_id = (SELECT auth.uid()) OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id()))
    OR is_admin()
);

-- reviews
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Buyers can insert reviews" ON reviews FOR INSERT WITH CHECK (reviewer_id = (SELECT auth.uid()) OR is_admin());

-- disputes
CREATE POLICY "Users can view their disputes" ON disputes FOR SELECT USING (
    raised_by = (SELECT auth.uid())
    OR order_id IN (SELECT id FROM orders WHERE buyer_id = (SELECT auth.uid()) OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id()))
    OR is_admin()
);
CREATE POLICY "Users can insert disputes" ON disputes FOR INSERT WITH CHECK (raised_by = (SELECT auth.uid()) OR is_admin());

-- documents
CREATE POLICY "Users can view their documents" ON documents FOR SELECT USING (
    company_id = get_user_company_id()
    OR order_id IN (SELECT id FROM orders WHERE buyer_id = (SELECT auth.uid()) OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id()))
    OR is_admin()
);

-- payments
CREATE POLICY "Users can view their payments" ON payments FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE buyer_id = (SELECT auth.uid()) OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id()))
    OR is_admin()
);

-- notifications
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (user_id = (SELECT auth.uid()) OR is_admin());
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (user_id = (SELECT auth.uid()) OR is_admin());


-- Performance Indexes
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_suppliers_company_id ON suppliers(company_id);
CREATE INDEX idx_buy_requests_buyer_id ON buy_requests(buyer_id);
CREATE INDEX idx_buy_requests_company_id ON buy_requests(company_id);
CREATE INDEX idx_quotes_buy_request_id ON quotes(buy_request_id);
CREATE INDEX idx_quotes_supplier_id ON quotes(supplier_id);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX idx_order_stages_order_id ON order_stages(order_id);
CREATE INDEX idx_inspection_reports_order_id ON inspection_reports(order_id);
CREATE INDEX idx_reviews_supplier_id ON reviews(supplier_id);
CREATE INDEX idx_disputes_order_id ON disputes(order_id);
CREATE INDEX idx_documents_order_id ON documents(order_id);
CREATE INDEX idx_documents_company_id ON documents(company_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
