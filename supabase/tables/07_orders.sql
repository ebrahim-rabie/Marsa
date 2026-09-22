-- ==============================================================================
-- Marsa (مرسى) Database Schema — Table 07: orders
-- File: supabase/tables/07_orders.sql
-- ==============================================================================

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
    -- Egyptian Customs & Logistics Enrichment (Nafeza / ACID)
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

-- Triggers
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_order_number 
    BEFORE INSERT ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION generate_order_number();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_acid_number ON orders(acid_number);

-- Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their orders" 
    ON orders FOR SELECT 
    USING (
        buyer_id = (SELECT auth.uid())
        OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id())
        OR is_admin()
    );
