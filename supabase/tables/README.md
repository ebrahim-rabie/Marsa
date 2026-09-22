# Marsa (مرسى) Database Schema — Modular Tables Architecture

This directory contains the modular SQL schema definition for the Marsa platform, where **each table has its own dedicated, self-contained SQL file** with its triggers, indexes, and Row Level Security (RLS) policies.

---

## 📁 Directory Structure & Execution Order

Execute files in sequence to respect foreign-key dependencies:

| File | Table / Purpose | Key Features |
| :--- | :--- | :--- |
| [`00_setup_and_types.sql`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/supabase/tables/00_setup_and_types.sql) | **Extensions & Types** | `uuid-ossp`, auto `updated_at`, RFQ/Order sequences, helper RLS functions, 15 native ENUMs |
| [`01_companies.sql`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/supabase/tables/01_companies.sql) | `companies` | Buyer / EG Supplier / CN Supplier company profiles, tax & commercial registrations |
| [`02_users.sql`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/supabase/tables/02_users.sql) | `users` | Auth mapping (`auth.users`), roles (`buyer`, `supplier`, `admin`, `agent`), locale |
| [`03_suppliers.sql`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/supabase/tables/03_suppliers.sql) | `suppliers` | Verified factories profile, verification levels (0-3), factory address (ZH/EN), lead time |
| [`04_supplier_verifications.sql`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/supabase/tables/04_supplier_verifications.sql) | `supplier_verifications` | Audit records (document check, live video call, on-site audit by SGS/TÜV) |
| [`05_buy_requests.sql`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/supabase/tables/05_buy_requests.sql) | `buy_requests` | RFQ engine, automated `RFQ-XXXX` numbering, target budget, specs JSONB |
| [`06_quotes.sql`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/supabase/tables/06_quotes.sql) | `quotes` | Factory bids, unit prices, MOQ, lead time, Incoterms (FOB/CIF/EXW), samples |
| [`07_orders.sql`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/supabase/tables/07_orders.sql) | `orders` | Contracted orders, automated `ORD-XXXX`, ACID number (19-digit), customs status, FX snapshot |
| [`08_order_stages.sql`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/supabase/tables/08_order_stages.sql) | `order_stages` | 7-stage escrow workflow tracking (Deposit -> Manufacturing -> Inspection -> Port -> Customs -> Delivery) |
| [`09_inspection_reports.sql`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/supabase/tables/09_inspection_reports.sql) | `inspection_reports` | Field QC inspection results (`passed`, `failed`, `conditional`), defect count, photos |
| [`10_order_messages.sql`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/supabase/tables/10_order_messages.sql) | `order_messages` | Live cross-border negotiation chat with auto translation (Arabic ⟷ Mandarin Chinese) |
| [`11_reviews.sql`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/supabase/tables/11_reviews.sql) | `reviews` | Verified buyer reviews, ratings (quality, communication, delivery) |
| [`12_disputes.sql`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/supabase/tables/12_disputes.sql) | `disputes` | Escrow dispute arbitration, evidence urls, admin resolution |
| [`13_documents.sql`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/supabase/tables/13_documents.sql) | `documents` | POs, Proforma Invoices, B/L, ACID certificates, Commercial registers |
| [`14_payments.sql`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/supabase/tables/14_payments.sql) | `payments` | Paymob Egypt & Escrow deposit/balance records, transaction references |
| [`15_notifications.sql`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/supabase/tables/15_notifications.sql) | `notifications` | Multilingual in-app and email notifications |

---

## ⚡ How to Run

### Option 1: Execute all modules in order (Single Script)
Run [`apply_all.sql`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/supabase/tables/apply_all.sql) in your Supabase SQL Editor.

### Option 2: Execute tables individually
You can copy and run any specific table SQL file into the Supabase SQL editor as long as its prerequisite parent tables have been created.
