-- ==============================================================================
-- Marsa (مرسى) Database Schema — Table 03: suppliers
-- File: supabase/tables/03_suppliers.sql
-- ==============================================================================

CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    categories TEXT[] DEFAULT '{}',
    verification_level INT DEFAULT 0 CHECK (verification_level >= 0 AND verification_level <= 3),
    is_middleman BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    total_deals INT DEFAULT 0,
    avg_rating NUMERIC(3,2) DEFAULT 0.00,
    profile_bio TEXT,
    profile_bio_ar TEXT,
    min_order_value NUMERIC DEFAULT 0,
    lead_time_days INT,
    factory_address TEXT,
    factory_address_zh TEXT,
    production_capacity TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers
CREATE TRIGGER update_suppliers_updated_at 
    BEFORE UPDATE ON suppliers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_company_id ON suppliers(company_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_active_level ON suppliers(active, verification_level DESC);

-- Row Level Security (RLS)
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active suppliers" 
    ON suppliers FOR SELECT 
    USING (active = true OR is_admin() OR company_id = get_user_company_id());

CREATE POLICY "Suppliers can update their own profile" 
    ON suppliers FOR UPDATE 
    USING (company_id = get_user_company_id() OR is_admin());
