-- =========================================================================
-- DROPYHUB PARTNERS PLATFORM - SEED DATA
-- Default Super Admin: master@dropyhub.com
-- Initial Password:   masteR&26
-- =========================================================================

INSERT INTO admin_users (
    email,
    password_hash,
    full_name,
    role,
    is_active
) VALUES (
    'master@dropyhub.com',
    '$2a$12$.js/Qj/5.GEO6KAEs0InBOEipTbxDEPfgSYFHASHdL/LD3tj8HIYe',
    'Master Administrator',
    'SUPER_ADMIN',
    TRUE
) ON CONFLICT (email) DO UPDATE SET
    role = 'SUPER_ADMIN',
    is_active = TRUE;
