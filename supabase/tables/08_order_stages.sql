-- ==============================================================================
-- Marsa (مرسى) Database Schema — Table 08: order_stages (Escrow 7-Stage Pipeline)
-- File: supabase/tables/08_order_stages.sql
-- ==============================================================================

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

-- Triggers
CREATE TRIGGER update_order_stages_updated_at 
    BEFORE UPDATE ON order_stages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_order_stages_order_id ON order_stages(order_id);

-- Row Level Security (RLS)
ALTER TABLE order_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view order stages" 
    ON order_stages FOR SELECT 
    USING (
        order_id IN (
            SELECT id FROM orders 
            WHERE buyer_id = (SELECT auth.uid()) 
               OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id())
        )
        OR is_admin()
    );
