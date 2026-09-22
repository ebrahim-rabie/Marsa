-- ==============================================================================
-- Marsa (مرسى) B2B Sourcing Platform — Core PostgreSQL Database Schema
-- Version: 2.0.0 (Enterprise Refactored)
-- Database: PostgreSQL 15+ / Supabase
-- Target Corridors: Egypt 🇪🇬 (Import) ⟷ China 🇨🇳 / Egypt 🇪🇬 (Verified Factories)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS & UTILITIES
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Automatic timestamp updating function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sequence & trigger for human-readable RFQ numbers (RFQ-1001, RFQ-1002...)
CREATE SEQUENCE IF NOT EXISTS buy_request_seq START WITH 1001;
CREATE OR REPLACE FUNCTION generate_request_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.request_number IS NULL THEN
        NEW.request_number := 'RFQ-' || nextval('buy_request_seq')::TEXT;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sequence & trigger for human-readable Order numbers (ORD-0042, ORD-1001...)
CREATE SEQUENCE IF NOT EXISTS order_seq START WITH 1001;
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := 'ORD-' || LPAD(nextval('order_seq')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 2. CUSTOM NATIVE ENUM TYPES
-- ------------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE company_type AS ENUM ('buyer', 'supplier_eg', 'supplier_cn', 'partner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('buyer', 'supplier', 'admin', 'agent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_method AS ENUM ('documents', 'video_call', 'on_site_audit');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE supplier_preference AS ENUM ('egyptian', 'chinese', 'both');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE buy_request_status AS ENUM (
        'pending', 
        'sourcing', 
        'quotes_ready', 
        'buyer_reviewing', 
        'accepted', 
        'expired', 
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE quote_status AS ENUM (
        'pending', 
        'accepted', 
        'rejected', 
        'expired', 
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'active', 
        'completed', 
        'disputed', 
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_stage_status AS ENUM (
        'pending', 
        'active', 
        'completed', 
        'skipped'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE customs_status AS ENUM (
        'acid_issued', 
        'in_transit', 
        'arrived_port', 
        'under_inspection', 
        'cleared'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inspection_result AS ENUM (
        'passed', 
        'failed', 
        'conditional'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE dispute_type AS ENUM (
        'quality', 
        'quantity', 
        'delay', 
        'wrong_item', 
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE dispute_status AS ENUM (
        'open', 
        'investigating', 
        'resolved', 
        'escalated'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_type AS ENUM (
        'deposit', 
        'balance', 
        'commission', 
        'inspection_fee', 
        'refund'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM (
        'pending', 
        'completed', 
        'failed', 
        'refunded'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_type AS ENUM (
        'contract', 
        'invoice', 
        'packing_list', 
        'bill_of_lading', 
        'acid_cert', 
        'customs_form', 
        'inspection_report', 
        'commercial_reg', 
        'tax_card', 
        'business_license', 
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 3. CORE ENTITIES (Companies, Users, Suppliers)
-- ------------------------------------------------------------------------------

-- 1. companies
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_ar TEXT,
    type company_type NOT NULL,
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

-- 2. users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY, -- References auth.users(id) in Supabase
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    full_name TEXT NOT NULL,
    full_name_ar TEXT,
    role user_role NOT NULL DEFAULT 'buyer',
    avatar_url TEXT,
    locale TEXT DEFAULT 'ar',
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    categories TEXT[] DEFAULT '{}',
    verification_level INT DEFAULT 0 CHECK (verification_level >= 0 AND verification_level <= 3),
    is_middleman BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    total_deals INT DEFAULT 0,
    avg_rating NUMERIC(3,2) DEFAULT 0.00,
    profile_bio TEXT,
    profile_bio_ar TEXT,
    min_order_value NUMERIC DEFAULT 0,
    lead_time_days INT,
    factory_address TEXT,
    factory_address_zh TEXT,
    production_capacity TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. supplier_verifications
CREATE TABLE IF NOT EXISTS supplier_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    level INT NOT NULL CHECK (level >= 1 AND level <= 3),
    method verification_method NOT NULL,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    evidence_urls TEXT[] DEFAULT '{}',
    notes TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. SOURCING & RFQ ENGINE (Buy Requests, Quotes)
-- ------------------------------------------------------------------------------

-- 5. buy_requests (RFQs)
CREATE TABLE IF NOT EXISTS buy_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number TEXT UNIQUE,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_name_ar TEXT,
    category TEXT,
    specifications JSONB DEFAULT '{}',
    quantity INT NOT NULL CHECK (quantity > 0),
    unit TEXT DEFAULT 'units',
    budget_min NUMERIC,
    budget_max NUMERIC,
    budget_currency TEXT DEFAULT 'USD',
    supplier_pref supplier_preference DEFAULT 'both',
    delivery_date DATE,
    status buy_request_status DEFAULT 'pending',
    notes TEXT,
    attachments TEXT[] DEFAULT '{}',
    source TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. quotes
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buy_request_id UUID NOT NULL REFERENCES buy_requests(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    unit_price NUMERIC NOT NULL CHECK (unit_price >= 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    moq INT DEFAULT 1,
    total_price NUMERIC NOT NULL CHECK (total_price >= 0),
    lead_time_days INT,
    shipping_method TEXT,
    shipping_cost NUMERIC DEFAULT 0,
    estimated_customs NUMERIC DEFAULT 0,
    estimated_total NUMERIC,
    incoterm TEXT DEFAULT 'FOB',
    payment_terms TEXT,
    sample_available BOOLEAN DEFAULT false,
    sample_cost NUMERIC DEFAULT 0,
    status quote_status DEFAULT 'pending',
    notes TEXT,
    attachments TEXT[] DEFAULT '{}',
    submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. ORDERS, LOGISTICS, CUSTOMS & ESCROW
-- ------------------------------------------------------------------------------

-- 7. orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE,
    buy_request_id UUID NOT NULL REFERENCES buy_requests(id) ON DELETE RESTRICT,
    quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE RESTRICT,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    total_value NUMERIC NOT NULL CHECK (total_value > 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    commission_rate NUMERIC DEFAULT 0.02,
    commission_amount NUMERIC DEFAULT 0,
    inspection_fee NUMERIC DEFAULT 0,
    coordination_fee NUMERIC DEFAULT 0,
    current_stage INT DEFAULT 1 CHECK (current_stage >= 1 AND current_stage <= 7),
    status order_status DEFAULT 'active',
    deposit_amount NUMERIC,
    deposit_paid BOOLEAN DEFAULT false,
    balance_amount NUMERIC,
    balance_released BOOLEAN DEFAULT false,
    estimated_delivery DATE,
    actual_delivery DATE,
    -- Egyptian Customs & Logistics Enrichment
    acid_number VARCHAR(25),
    port_of_entry TEXT DEFAULT 'sokhna',
    bl_number TEXT,
    shipping_carrier TEXT,
    customs_status customs_status DEFAULT 'acid_issued',
    -- Multi-Currency Snapshot
    fx_rates_snapshot JSONB DEFAULT '{"USD": 1.0, "EGP": 50.50, "CNY": 7.25}',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. order_stages (Tracks the 7-stage escrow lifecycle)
CREATE TABLE IF NOT EXISTS order_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    stage INT NOT NULL CHECK (stage >= 1 AND stage <= 7),
    status order_stage_status DEFAULT 'pending',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. inspection_reports
CREATE TABLE IF NOT EXISTS inspection_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    inspector TEXT NOT NULL,
    inspection_date DATE NOT NULL,
    result inspection_result NOT NULL,
    total_units INT CHECK (total_units >= 0),
    defective_units INT DEFAULT 0 CHECK (defective_units >= 0),
    photo_urls TEXT[] DEFAULT '{}',
    report_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. CROSS-BORDER CHAT, REVIEWS, DISPUTES & DOCUMENTS
-- ------------------------------------------------------------------------------

-- 10. order_messages (Cross-Border Negotiation Chat with Auto-Translation)
CREATE TABLE IF NOT EXISTS order_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_role user_role NOT NULL,
    original_text TEXT NOT NULL,
    translated_text TEXT,
    source_language VARCHAR(5) NOT NULL DEFAULT 'ar',
    target_language VARCHAR(5) NOT NULL DEFAULT 'zh',
    attachments JSONB DEFAULT '[]',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. reviews (Locked strictly to verified orders)
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    quality_rating INT CHECK (quality_rating >= 1 AND quality_rating <= 5),
    communication_rating INT CHECK (communication_rating >= 1 AND communication_rating <= 5),
    delivery_rating INT CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
    comment TEXT,
    comment_ar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. disputes (Admin Arbitration & Escrow Freezing)
CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    raised_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type dispute_type NOT NULL,
    description TEXT,
    evidence_urls TEXT[] DEFAULT '{}',
    status dispute_status DEFAULT 'open',
    resolution TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. documents (Digital Contracts, POs, Invoices, B/L, ACID, Licenses)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    type document_type NOT NULL,
    name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. payments (Paymob Egypt & Escrow Transactions)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    type payment_type NOT NULL,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'EGP',
    status payment_status DEFAULT 'pending',
    method TEXT,
    reference TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. notifications
CREATE TABLE IF NOT EXISTS notifications (
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

-- ------------------------------------------------------------------------------
-- 7. TRIGGERS
-- ------------------------------------------------------------------------------
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_buy_requests_updated_at BEFORE UPDATE ON buy_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_stages_updated_at BEFORE UPDATE ON order_stages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_request_number BEFORE INSERT ON buy_requests FOR EACH ROW EXECUTE FUNCTION generate_request_number();
CREATE TRIGGER set_order_number BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ------------------------------------------------------------------------------
-- 8. HELPER SECURITY FUNCTIONS
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE buy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- companies policies
CREATE POLICY "Users can view their own company" ON companies FOR SELECT USING (id = get_user_company_id() OR is_admin());
CREATE POLICY "Users can update their own company" ON companies FOR UPDATE USING (id = get_user_company_id() OR is_admin());
CREATE POLICY "Admins can insert companies" ON companies FOR INSERT WITH CHECK (is_admin());

-- users policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (id = (SELECT auth.uid()) OR is_admin());
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (id = (SELECT auth.uid()) OR is_admin());

-- suppliers policies
CREATE POLICY "Anyone can view active suppliers" ON suppliers FOR SELECT USING (active = true OR is_admin() OR company_id = get_user_company_id());
CREATE POLICY "Suppliers can update their own profile" ON suppliers FOR UPDATE USING (company_id = get_user_company_id() OR is_admin());

-- supplier_verifications policies
CREATE POLICY "Suppliers can view their verifications" ON supplier_verifications FOR SELECT USING (supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id()) OR is_admin());

-- buy_requests policies
CREATE POLICY "Buyers can view their own requests" ON buy_requests FOR SELECT USING (buyer_id = (SELECT auth.uid()) OR is_admin());
CREATE POLICY "Buyers can insert their own requests" ON buy_requests FOR INSERT WITH CHECK (buyer_id = (SELECT auth.uid()) OR is_admin());
CREATE POLICY "Buyers can update their own requests" ON buy_requests FOR UPDATE USING (buyer_id = (SELECT auth.uid()) OR is_admin());

-- quotes policies
CREATE POLICY "Users can view quotes related to them" ON quotes FOR SELECT USING (
    submitted_by = (SELECT auth.uid())
    OR buy_request_id IN (SELECT id FROM buy_requests WHERE buyer_id = (SELECT auth.uid()))
    OR is_admin()
);
CREATE POLICY "Suppliers can insert quotes" ON quotes FOR INSERT WITH CHECK (submitted_by = (SELECT auth.uid()) OR is_admin());
CREATE POLICY "Suppliers can update their quotes" ON quotes FOR UPDATE USING (submitted_by = (SELECT auth.uid()) OR is_admin());

-- orders policies
CREATE POLICY "Users can view their orders" ON orders FOR SELECT USING (
    buyer_id = (SELECT auth.uid())
    OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id())
    OR is_admin()
);

-- order_stages policies
CREATE POLICY "Users can view order stages" ON order_stages FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE buyer_id = (SELECT auth.uid()) OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id()))
    OR is_admin()
);

-- inspection_reports policies
CREATE POLICY "Users can view inspection reports" ON inspection_reports FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE buyer_id = (SELECT auth.uid()) OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id()))
    OR is_admin()
);

-- order_messages policies (Cross-Border Negotiation Chat)
CREATE POLICY "Users can view messages for their orders" ON order_messages FOR SELECT USING (
    order_id IN (
        SELECT id FROM orders 
        WHERE buyer_id = (SELECT auth.uid()) 
           OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id())
    )
    OR is_admin()
);
CREATE POLICY "Users can insert messages into their orders" ON order_messages FOR INSERT WITH CHECK (
    order_id IN (
        SELECT id FROM orders 
        WHERE buyer_id = (SELECT auth.uid()) 
           OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id())
    )
    OR is_admin()
);

-- reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Buyers can insert reviews" ON reviews FOR INSERT WITH CHECK (reviewer_id = (SELECT auth.uid()) OR is_admin());

-- disputes policies
CREATE POLICY "Users can view their disputes" ON disputes FOR SELECT USING (
    raised_by = (SELECT auth.uid())
    OR order_id IN (SELECT id FROM orders WHERE buyer_id = (SELECT auth.uid()) OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id()))
    OR is_admin()
);
CREATE POLICY "Users can insert disputes" ON disputes FOR INSERT WITH CHECK (raised_by = (SELECT auth.uid()) OR is_admin());

-- documents policies
CREATE POLICY "Users can view their documents" ON documents FOR SELECT USING (
    company_id = get_user_company_id()
    OR order_id IN (SELECT id FROM orders WHERE buyer_id = (SELECT auth.uid()) OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id()))
    OR is_admin()
);

-- payments policies
CREATE POLICY "Users can view their payments" ON payments FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE buyer_id = (SELECT auth.uid()) OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id()))
    OR is_admin()
);

-- notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (user_id = (SELECT auth.uid()) OR is_admin());
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (user_id = (SELECT auth.uid()) OR is_admin());

-- ------------------------------------------------------------------------------
-- 10. COMPOSITE PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_company_id ON suppliers(company_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_active_level ON suppliers(active, verification_level DESC);
CREATE INDEX IF NOT EXISTS idx_buy_requests_buyer_id ON buy_requests(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buy_requests_status ON buy_requests(status);
CREATE INDEX IF NOT EXISTS idx_buy_requests_request_number ON buy_requests(request_number);
CREATE INDEX IF NOT EXISTS idx_quotes_buy_request_id ON quotes(buy_request_id);
CREATE INDEX IF NOT EXISTS idx_quotes_supplier_id ON quotes(supplier_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_acid_number ON orders(acid_number);
CREATE INDEX IF NOT EXISTS idx_order_stages_order_id ON order_stages(order_id);
CREATE INDEX IF NOT EXISTS idx_inspection_reports_order_id ON inspection_reports(order_id);
CREATE INDEX IF NOT EXISTS idx_order_messages_order_created ON order_messages(order_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_supplier_id ON reviews(supplier_id);
CREATE INDEX IF NOT EXISTS idx_disputes_order_id ON disputes(order_id);
CREATE INDEX IF NOT EXISTS idx_documents_order_id ON documents(order_id);
CREATE INDEX IF NOT EXISTS idx_documents_company_id ON documents(company_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
