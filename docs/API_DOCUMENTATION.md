# Marsa (مرسى) — API & Backend Endpoints Documentation

**Platform:** Marsa B2B Cross-Border Sourcing Platform (Egypt 🇪🇬 / China 🇨🇳)  
**Version:** 1.0.0  
**Base URL (Local):** `http://localhost:3001` (or `http://localhost:3000`)  
**Base URL (Production):** `https://marsa.trade`  
**Protocol:** HTTPS / REST / JSON  

---

## 1. Authentication & Security Architecture

Marsa employs three distinct authentication schemes depending on the endpoint type:

| Scheme | Target Endpoints | Header / Format | Description |
| :--- | :--- | :--- | :--- |
| **Supabase JWT** | Authenticated User Routes / RLS | `Authorization: Bearer <access_token>` | Issued upon user login via Supabase Auth (`users` table). |
| **Paymob HMAC-SHA512** | Payment Webhooks | URL Query: `?hmac=<hex_signature>` | Cryptographic hash validating transaction authenticity. |
| **Cron Secret Token** | Automated Background Tasks | `Authorization: Bearer <CRON_SECRET>` | Prevents unauthorized triggers of platform keepalive tasks. |
| **Demo Session Cookie** | Local Testing & Sandbox Previews | Cookie: `marsa_demo_user=buyer\|supplier\|admin` | Enables 1-click sandbox testing without live credentials. |

---

## 2. Payment & Escrow Endpoints

### 2.1 Create Payment Intention (Paymob Egypt)
Initializes an escrow payment transaction using Paymob's modern Intention API. Converts EGP into Egyptian piasters (1 EGP = 100 piasters) and generates unified checkout keys supporting Credit/Debit Cards (Visa, Mastercard, Meeza) and Mobile Wallets (Vodafone Cash, Orange Cash, Etisalat Cash, WE Pay).

* **Endpoint:** `POST /api/payments/paymob/create-intention`
* **Content-Type:** `application/json`
* **Authentication:** Public / Session

#### Request Body Schema:
```json
{
  "orderNumber": "string (required, e.g. ORD-0042)",
  "amountEgp": "number (required, amount in EGP, e.g. 150000)",
  "customer": {
    "firstName": "string (optional, default: Buyer)",
    "lastName": "string (optional, default: Marsa)",
    "email": "string (optional, e.g. buyer@company.com)",
    "phone": "string (required, Egyptian phone, e.g. +201001234567)"
  },
  "items": [
    {
      "name": "string (optional)",
      "amountEgp": "number (optional)",
      "quantity": "integer (optional)"
    }
  ]
}
```

#### Response (200 OK — Production with Live Credentials):
```json
{
  "success": true,
  "clientSecret": "cs_live_9f82a17b...",
  "id": "18492041",
  "checkoutUrl": "https://accept.paymob.com/unifiedcheckout/?publicKey=pk_test_...&clientSecret=cs_live_9f82a17b..."
}
```

#### Response (200 OK — Sandbox / Demo Fallback):
```json
{
  "mock": true,
  "message": "Paymob credentials not configured in sandbox. Simulated checkout successful.",
  "checkoutUrl": "/ar/dashboard/orders/ORD-0042?payment=simulated_success"
}
```

#### Error Responses:
* `400 Bad Request`:
  ```json
  {
    "error": "Missing required fields: orderNumber, amountEgp, customer.phone"
  }
  ```
* `500 Internal Server Error`:
  ```json
  {
    "error": "Paymob Intention creation failed: 401 Unauthorized"
  }
  ```

#### Example cURL Request:
```bash
curl -X POST "http://localhost:3001/api/payments/paymob/create-intention" \
  -H "Content-Type: application/json" \
  -d '{
    "orderNumber": "ORD-0042",
    "amountEgp": 225000,
    "customer": {
      "firstName": "Ahmed",
      "lastName": "Hassan",
      "email": "ahmed@cairoimports.eg",
      "phone": "+201012345678"
    }
  }'
```

---

### 2.2 Paymob Transaction Webhook & Stage Advancement
Receives server-to-server transaction notifications from Paymob Egypt upon payment execution. Validates HMAC-SHA512 authenticity, updates order escrow state to `deposit_paid = true`, advances the order pipeline to Stage 4 (In-Production), and logs payment records.

* **Endpoint:** `POST /api/webhooks/paymob?hmac={signature}`
* **Content-Type:** `application/json`
* **Authentication:** HMAC Query Parameter (`hmac`)

#### HMAC Calculation Algorithm:
Paymob concatenates 20 specific fields in strict alphabetical order:
```typescript
const fields = [
  obj.amount_cents,
  obj.created_at,
  obj.currency,
  obj.error_occured,
  obj.has_parent_transaction,
  obj.id,
  obj.integration_id,
  obj.is_3d_secure,
  obj.is_auth,
  obj.is_capture,
  obj.is_refunded,
  obj.is_standalone_payment,
  obj.is_voided,
  obj.order.id,
  obj.owner,
  obj.pending,
  obj.source_data.pan,
  obj.source_data.sub_type,
  obj.source_data.type,
  obj.success
];
// Hash with HMAC SHA512 using PAYMOB_HMAC_SECRET
```

#### Request Payload Structure:
```json
{
  "type": "TRANSACTION",
  "obj": {
    "id": 19482014,
    "pending": false,
    "amount_cents": 15000000,
    "success": true,
    "is_auth": false,
    "is_capture": false,
    "is_standalone_payment": true,
    "is_voided": false,
    "is_refunded": false,
    "is_3d_secure": true,
    "integration_id": 482019,
    "currency": "EGP",
    "order": {
      "id": 8920194,
      "merchant_order_id": "ORD-0042"
    },
    "created_at": "2026-09-22T21:40:00.000Z",
    "source_data": {
      "type": "card",
      "pan": "2346",
      "sub_type": "MasterCard"
    }
  }
}
```

#### Response (200 OK):
```json
{
  "status": "received",
  "verified": true
}
```

#### Error Responses:
* `400 Bad Request` (Missing transaction payload `obj`):
  ```json
  {
    "error": "Invalid callback payload"
  }
  ```
* `401 Unauthorized` (Invalid HMAC signature):
  ```json
  {
    "error": "HMAC verification failed"
  }
  ```

---

## 3. Maintenance & Automation Endpoints

### 3.1 Supabase Free-Tier Auto-Pause Keepalive
Designed to run automatically via GitHub Actions or Vercel Cron every 5 days. Executes a lightweight database query against the `companies` table to prevent free-tier project dormancy.

* **Endpoint:** `GET /api/cron/keepalive`
* **Authentication:** `Authorization: Bearer <CRON_SECRET>`

#### Response (200 OK — Active):
```json
{
  "status": "ok",
  "message": "Supabase keepalive ping successful",
  "timestamp": "2026-09-22T22:15:00.000Z",
  "rowsChecked": 1
}
```

#### Response (200 OK — Skipped in Sandbox without Credentials):
```json
{
  "status": "skipped",
  "message": "Supabase credentials not configured yet"
}
```

#### Error Responses:
* `401 Unauthorized` (Invalid or missing Bearer token when `CRON_SECRET` is set):
  ```json
  {
    "error": "Unauthorized"
  }
  ```
* `500 Internal Server Error` (Database connection failure):
  ```json
  {
    "status": "error",
    "message": "Connection terminated unexpectedly"
  }
  ```

#### Example cURL:
```bash
curl -X GET "http://localhost:3001/api/cron/keepalive" \
  -H "Authorization: Bearer your-secret-cron-token"
```

---

## 4. Next.js Server Actions & Internal RPCs

Next.js Server Actions provide direct, type-safe Remote Procedure Calls between client components and the server runtime:

### 4.1 `insertBuyRequest(formData)`
* **File:** [`src/app/[locale]/request/new/actions.ts`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/src/app/[locale]/request/new/actions.ts)
* **Description:** Creates a new Buyer RFQ. Automatically assigns a unique request number (`RFQ-XXXX`), sets status to `'new'`, and stores technical specs and quantities.
* **Input Parameters:**
  ```typescript
  {
    productName: string;
    category: string; // 'packaging' | 'lighting' | 'spare_parts' | ...
    specifications: string;
    quantity: string;
    unit: string; // 'units' | 'kg' | 'meters' | 'boxes' | ...
    budgetMin?: string;
    budgetMax?: string;
    currency: string; // 'USD' | 'EGP' | 'CNY'
    supplierPreference: 'both' | 'egyptian' | 'chinese';
    deliveryDate?: string;
    notes?: string;
    fullName: string;
    companyName: string;
    phone: string;
    email: string;
    source?: string;
  }
  ```
* **Return Value:**
  ```typescript
  { success: true, requestNumber: "RFQ-4821" }
  // or
  { success: false, error: "Validation message" }
  ```

---

### 4.2 `loginAction(formData)`
* **File:** [`src/app/[locale]/auth/actions.ts`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/src/app/[locale]/auth/actions.ts)
* **Description:** Authenticates users via Supabase Auth email/password or handles 1-Click Demo role assignments (`buyer`, `supplier`, `admin`). Sets the session cookie `marsa_demo_user` for sandbox persistence.

---

### 4.3 `registerAction(formData)`
* **File:** [`src/app/[locale]/auth/actions.ts`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/src/app/[locale]/auth/actions.ts)
* **Description:** Registers new companies and users. Automatically provisions:
  1. Supabase Auth credentials.
  2. Record in `companies` table (with Egypt or China origin).
  3. Record in `users` table linked by foreign key.
  4. If role is `'supplier'`, initializes record in `suppliers` table with `verification_level = 0`.

---

### 4.4 `switchRoleAction(role, locale)`
* **File:** [`src/app/[locale]/auth/actions.ts`](file:///d:/Startsup%20Ideas/marsa/marsa-platform/src/app/[locale]/auth/actions.ts)
* **Description:** Updates `marsa_demo_user` cookie to switch seamlessly between `buyer`, `supplier`, and `admin` view modes, redirecting immediately to the target dashboard.

---

## 5. PWA, SEO & Discovery Endpoints

| Endpoint | Method | Format | Content / Purpose |
| :--- | :---: | :---: | :--- |
| `/manifest.webmanifest` | `GET` | `application/manifest+json` | PWA manifest defining application title, standalone display mode, colors, and maritime branding icons. |
| `/robots.txt` | `GET` | `text/plain` | Crawler directives allowing public landing, directory, and terms while blocking `/admin` and `/api/webhooks`. |
| `/sitemap.xml` | `GET` | `application/xml` | Dynamic bilingual sitemap linking `/ar` and `/en` variations of all public pages with `xhtml:link` hreflang alternates. |
| `/icon` | `GET` | `image/png` | Dynamic App Favicon with teal harbor backdrop and golden cargo container emblem. |

---

## 6. Supabase Database REST APIs (PostgREST)

When connecting direct database clients or mobile applications, the following tables are exposed through Supabase's automatic PostgREST layer:

* `GET /rest/v1/suppliers?select=*&active=eq.true` — Active suppliers feed with verification badges.
* `GET /rest/v1/buy_requests?select=*&status=eq.new` — RFQ board for suppliers.
* `GET /rest/v1/orders?order_number=eq.ORD-0042&select=*,inspection_reports(*)` — Order tracking and inspection reports.
* `POST /rest/v1/reviews` — Submitting verified reviews locked to completed orders.
