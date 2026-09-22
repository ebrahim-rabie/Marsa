-- ==============================================================================
-- Marsa (مرسى) Database Schema — Table 02: users
-- File: supabase/tables/02_users.sql
-- ==============================================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY, -- References auth.users(id) in Supabase
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    full_name TEXT NOT NULL,
    full_name_ar TEXT,
    role user_role NOT NULL DEFAULT 'buyer',
    avatar_url TEXT,
    locale TEXT DEFAULT 'ar',
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
    ON users FOR SELECT 
    USING (id = (SELECT auth.uid()) OR is_admin());

CREATE POLICY "Users can update their own profile" 
    ON users FOR UPDATE 
    USING (id = (SELECT auth.uid()) OR is_admin());
