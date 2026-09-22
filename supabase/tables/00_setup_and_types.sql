-- ==============================================================================
-- Marsa (مرسى) Database Schema — Module 00: Extensions, Utilities & ENUMs
-- File: supabase/tables/00_setup_and_types.sql
-- ==============================================================================

-- 1. PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Timestamp Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Sequences & Generators for Human-Readable Identifiers
CREATE SEQUENCE IF NOT EXISTS buy_request_seq START WITH 1001;
CREATE OR REPLACE FUNCTION generate_request_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.request_number IS NULL THEN
        NEW.request_number := 'RFQ-' || nextval('buy_request_seq')::TEXT;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS order_seq START WITH 1001;
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := 'ORD-' || LPAD(nextval('order_seq')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Helper Security Functions (Used by RLS Policies across tables)
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT company_id FROM users WHERE id = (SELECT auth.uid());
$$;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users WHERE id = (SELECT auth.uid()) AND role = 'admin'
  );
$$;

-- 5. Native PostgreSQL ENUM Types
DO $$ BEGIN
    CREATE TYPE company_type AS ENUM ('buyer', 'supplier_eg', 'supplier_cn', 'partner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('buyer', 'supplier', 'admin', 'agent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_method AS ENUM ('documents', 'video_call', 'on_site_audit');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE supplier_preference AS ENUM ('egyptian', 'chinese', 'both');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE buy_request_status AS ENUM (
        'pending', 
        'sourcing', 
        'quotes_ready', 
        'buyer_reviewing', 
        'accepted', 
        'expired', 
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE quote_status AS ENUM (
        'pending', 
        'accepted', 
        'rejected', 
        'expired', 
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'active', 
        'completed', 
        'disputed', 
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_stage_status AS ENUM (
        'pending', 
        'active', 
        'completed', 
        'skipped'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE customs_status AS ENUM (
        'acid_issued', 
        'in_transit', 
        'arrived_port', 
        'under_inspection', 
        'cleared'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inspection_result AS ENUM (
        'passed', 
        'failed', 
        'conditional'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE dispute_type AS ENUM (
        'quality', 
        'quantity', 
        'delay', 
        'wrong_item', 
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE dispute_status AS ENUM (
        'open', 
        'investigating', 
        'resolved', 
        'escalated'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_type AS ENUM (
        'deposit', 
        'balance', 
        'commission', 
        'inspection_fee', 
        'refund'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM (
        'pending', 
        'completed', 
        'failed', 
        'refunded'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_type AS ENUM (
        'contract', 
        'invoice', 
        'packing_list', 
        'bill_of_lading', 
        'acid_cert', 
        'customs_form', 
        'inspection_report', 
        'commercial_reg', 
        'tax_card', 
        'business_license', 
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
