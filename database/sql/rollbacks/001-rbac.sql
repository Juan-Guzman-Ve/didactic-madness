-- ============================================================================
-- Rollback: 001 - RBAC Tables
-- ============================================================================

DROP TRIGGER IF EXISTS trg_role_policies_updated_at ON role_policies;
DROP TRIGGER IF EXISTS trg_policies_updated_at ON policies;
DROP TRIGGER IF EXISTS trg_roles_updated_at ON roles;

DROP TABLE IF EXISTS role_policies CASCADE;
DROP TABLE IF EXISTS policies CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

DROP FUNCTION IF EXISTS update_updated_at_column();
