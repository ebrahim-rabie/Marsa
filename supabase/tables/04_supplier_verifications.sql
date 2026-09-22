-- ==============================================================================
-- Marsa (مرسى) Database Schema — Table 04: supplier_verifications
-- File: supabase/tables/04_supplier_verifications.sql
-- ==============================================================================

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

-- Row Level Security (RLS)
ALTER TABLE supplier_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Suppliers can view their verifications" 
    ON supplier_verifications FOR SELECT 
    USING (
        supplier_id IN (SELECT id FROM suppliers WHERE company_id = get_user_company_id()) 
        OR is_admin()
    );
