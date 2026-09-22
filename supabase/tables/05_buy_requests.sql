-- ==============================================================================
-- Marsa (مرسى) Database Schema — Table 05: buy_requests (RFQs)
-- File: supabase/tables/05_buy_requests.sql
-- ==============================================================================

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

-- Triggers
CREATE TRIGGER update_buy_requests_updated_at 
    BEFORE UPDATE ON buy_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_request_number 
    BEFORE INSERT ON buy_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION generate_request_number();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_buy_requests_buyer_id ON buy_requests(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buy_requests_status ON buy_requests(status);
CREATE INDEX IF NOT EXISTS idx_buy_requests_request_number ON buy_requests(request_number);

-- Row Level Security (RLS)
ALTER TABLE buy_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view their own requests" 
    ON buy_requests FOR SELECT 
    USING (buyer_id = (SELECT auth.uid()) OR is_admin());

CREATE POLICY "Buyers can insert their own requests" 
    ON buy_requests FOR INSERT 
    WITH CHECK (buyer_id = (SELECT auth.uid()) OR is_admin());

CREATE POLICY "Buyers can update their own requests" 
    ON buy_requests FOR UPDATE 
    USING (buyer_id = (SELECT auth.uid()) OR is_admin());
