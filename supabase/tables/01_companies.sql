-- ==============================================================================
-- Marsa (مرسى) Database Schema — Table 01: companies
-- File: supabase/tables/01_companies.sql
-- ==============================================================================

CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_ar TEXT,
    type company_type NOT NULL,
    country TEXT DEFAULT 'EG',
    city TEXT,
    phone TEXT,
    whatsapp TEXT,
    commercial_reg TEXT,
    tax_card TEXT,
    industrial_reg TEXT,
    business_license TEXT,
    website TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers
CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON companies 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own company" 
    ON companies FOR SELECT 
    USING (id = get_user_company_id() OR is_admin());

CREATE POLICY "Users can update their own company" 
    ON companies FOR UPDATE 
    USING (id = get_user_company_id() OR is_admin());

CREATE POLICY "Admins can insert companies" 
    ON companies FOR INSERT 
    WITH CHECK (is_admin());
