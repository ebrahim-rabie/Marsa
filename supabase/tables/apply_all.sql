-- ==============================================================================
-- Marsa (مرسى) Database Schema — Master Aggregation Script
-- File: supabase/tables/apply_all.sql
-- Description: Executes all 15 modular table schemas and setup in sequence.
-- ==============================================================================

-- 00. SETUP, EXTENSIONS & ENUMS
\ir 00_setup_and_types.sql

-- 01-04. CORE ENTITIES
\ir 01_companies.sql
\ir 02_users.sql
\ir 03_suppliers.sql
\ir 04_supplier_verifications.sql

-- 05-06. SOURCING & RFQ
\ir 05_buy_requests.sql
\ir 06_quotes.sql

-- 07-09. ORDERS & ESCROW LIFECYCLE
\ir 07_orders.sql
\ir 08_order_stages.sql
\ir 09_inspection_reports.sql

-- 10-15. COMMUNICATIONS, GOVERNANCE & SETTLEMENT
\ir 10_order_messages.sql
\ir 11_reviews.sql
\ir 12_disputes.sql
\ir 13_documents.sql
\ir 14_payments.sql
\ir 15_notifications.sql
