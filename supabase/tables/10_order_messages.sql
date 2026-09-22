-- ==============================================================================
-- Marsa (مرسى) Database Schema — Table 10: order_messages (Cross-Border Chat)
-- File: supabase/tables/10_order_messages.sql
-- ==============================================================================

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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_order_messages_order_created 
    ON order_messages(order_id, created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE order_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for their orders" 
    ON order_messages FOR SELECT 
    USING (
        order_id IN (
            SELECT id FROM orders 
            WHERE buyer_id = (SELECT auth.uid()) 
               OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id())
        )
        OR is_admin()
    );

CREATE POLICY "Users can insert messages into their orders" 
    ON order_messages FOR INSERT 
    WITH CHECK (
        order_id IN (
            SELECT id FROM orders 
            WHERE buyer_id = (SELECT auth.uid()) 
               OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id())
        )
        OR is_admin()
    );
