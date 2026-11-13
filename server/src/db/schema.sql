-- =========================================================================
-- DROPYHUB PARTNERS PLATFORM - DATABASE SCHEMA
-- Target Database: PostgreSQL / Supabase
-- =========================================================================

-- Enable pgcrypto / uuid extension if not present
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------------------------
-- 1. ADMIN USERS TABLE (Internal DropyHub Staff Only)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'OPERATIONS_MANAGER', -- 'SUPER_ADMIN', 'OPERATIONS_MANAGER', 'KYC_VERIFIER', 'SUPPORT'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for instant lookup on admin login
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- -------------------------------------------------------------------------
-- 2. PARTNER APPLICATIONS TABLE (Inbound Leads & Delivery Associates)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS partner_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_reference TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL DEFAULT 'DELIVERY_PAGE', -- 'DELIVERY_PAGE', 'WAREHOUSE_PAGE', 'DIRECT'
    full_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    email TEXT,
    age INTEGER,
    city TEXT NOT NULL,
    area TEXT,
    has_bike TEXT DEFAULT 'No', -- 'Yes', 'No', 'Rental Needed'
    has_license TEXT DEFAULT 'No', -- 'Yes', 'No'
    preferred_companies TEXT[] DEFAULT '{}', -- e.g. ['Swiggy', 'Zepto', 'Amazon', 'Blinkit']
    job_types TEXT[] DEFAULT '{}', -- e.g. ['Delivery Executive', 'Warehouse Associate']
    experience TEXT,
    employment_status TEXT,
    message TEXT,
    application_status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'UNDER_REVIEW', 'VERIFIED', 'ACTIVE', 'REJECTED'
    internal_notes TEXT DEFAULT '',
    rejection_reason TEXT DEFAULT '',
    assigned_staff_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Search and filter indexes
CREATE INDEX IF NOT EXISTS idx_partner_apps_mobile ON partner_applications(mobile_number);
CREATE INDEX IF NOT EXISTS idx_partner_apps_city ON partner_applications(city);
CREATE INDEX IF NOT EXISTS idx_partner_apps_status ON partner_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_partner_apps_created ON partner_applications(created_at DESC);

-- -------------------------------------------------------------------------
-- 3. PARTNER DOCUMENTS TABLE (KYC & Identification Files)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS partner_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES partner_applications(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- 'AADHAAR_FRONT', 'AADHAAR_BACK', 'PAN', 'DRIVING_LICENSE', 'RC'
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size_bytes INTEGER DEFAULT 0,
    mime_type TEXT DEFAULT 'image/jpeg',
    verification_status TEXT NOT NULL DEFAULT 'UNVERIFIED', -- 'UNVERIFIED', 'APPROVED', 'REJECTED'
    rejection_reason TEXT DEFAULT '',
    verified_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partner_docs_app_id ON partner_documents(application_id);

-- -------------------------------------------------------------------------
-- 4. STATUS TRANSITION HISTORY TABLE (Complete Audit Trail)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS application_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES partner_applications(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    changed_by_name TEXT NOT NULL,
    changed_by_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    note TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_status_history_app_id ON application_status_history(application_id);

-- -------------------------------------------------------------------------
-- 5. ADMIN AUDIT LOGS (Security & Compliance)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL, -- 'LOGIN', 'LOGOUT', 'STATUS_CHANGE', 'NOTE_UPDATE', 'EXPORT_CSV', 'VIEW_PII'
    entity_type TEXT NOT NULL, -- 'APPLICATION', 'STAFF', 'DOCUMENT'
    entity_id TEXT,
    details JSONB DEFAULT '{}',
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON admin_audit_logs(created_at DESC);
