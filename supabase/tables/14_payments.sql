-- ==============================================================================
-- Marsa (مرسى) Database Schema — Table 14: payments (Paymob Egypt & Escrow)
-- File: supabase/tables/14_payments.sql
-- ==============================================================================

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

-- Triggers
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);

-- Row Level Security (RLS)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their payments" 
    ON payments FOR SELECT 
    USING (
        order_id IN (
            SELECT id FROM orders 
            WHERE buyer_id = (SELECT auth.uid()) 
               OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id())
        )
        OR is_admin()
    );
