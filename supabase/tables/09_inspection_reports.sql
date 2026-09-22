-- ==============================================================================
-- Marsa (مرسى) Database Schema — Table 09: inspection_reports
-- File: supabase/tables/09_inspection_reports.sql
-- ==============================================================================

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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_inspection_reports_order_id ON inspection_reports(order_id);

-- Row Level Security (RLS)
ALTER TABLE inspection_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view inspection reports" 
    ON inspection_reports FOR SELECT 
    USING (
        order_id IN (
            SELECT id FROM orders 
            WHERE buyer_id = (SELECT auth.uid()) 
               OR supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id())
        )
        OR is_admin()
    );
