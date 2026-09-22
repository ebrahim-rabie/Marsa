-- ==============================================================================
-- Marsa (مرسى) Database Schema — Table 13: documents
-- File: supabase/tables/13_documents.sql
-- ==============================================================================

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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_documents_order_id ON documents(order_id);
CREATE INDEX IF NOT EXISTS idx_documents_company_id ON documents(company_id);

-- Row Level Security (RLS)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their documents" 
    ON documents FOR SELECT 
    USING (
        company_id = get_user_company_id()
        OR order_id IN (
            SELECT id FROM orders 
            WHERE buyer_id = (SELECT auth.uid()) 
               OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id())
        )
        OR is_admin()
    );
