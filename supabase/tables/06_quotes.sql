-- ==============================================================================
-- Marsa (مرسى) Database Schema — Table 06: quotes
-- File: supabase/tables/06_quotes.sql
-- ==============================================================================

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

-- Triggers
CREATE TRIGGER update_quotes_updated_at 
    BEFORE UPDATE ON quotes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_quotes_buy_request_id ON quotes(buy_request_id);
CREATE INDEX IF NOT EXISTS idx_quotes_supplier_id ON quotes(supplier_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);

-- Row Level Security (RLS)
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view quotes related to them" 
    ON quotes FOR SELECT 
    USING (
        submitted_by = (SELECT auth.uid())
        OR buy_request_id IN (SELECT id FROM buy_requests WHERE buyer_id = (SELECT auth.uid()))
        OR is_admin()
    );

CREATE POLICY "Suppliers can insert quotes" 
    ON quotes FOR INSERT 
    WITH CHECK (submitted_by = (SELECT auth.uid()) OR is_admin());

CREATE POLICY "Suppliers can update their quotes" 
    ON quotes FOR UPDATE 
    USING (submitted_by = (SELECT auth.uid()) OR is_admin());
