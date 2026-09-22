-- ==============================================================================
-- Marsa (مرسى) Database Schema — Table 12: disputes
-- File: supabase/tables/12_disputes.sql
-- ==============================================================================

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

-- Triggers
CREATE TRIGGER update_disputes_updated_at 
    BEFORE UPDATE ON disputes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_disputes_order_id ON disputes(order_id);

-- Row Level Security (RLS)
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their disputes" 
    ON disputes FOR SELECT 
    USING (
        raised_by = (SELECT auth.uid())
        OR order_id IN (SELECT id FROM orders WHERE buyer_id = (SELECT auth.uid()) OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id()))
        OR is_admin()
    );

CREATE POLICY "Users can insert disputes" 
    ON disputes FOR INSERT 
    WITH CHECK (raised_by = (SELECT auth.uid()) OR is_admin());
