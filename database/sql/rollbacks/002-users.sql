-- ============================================================================
-- Rollback: 002 - Users and Addresses
-- ============================================================================

DROP TRIGGER IF EXISTS trg_addresses_updated_at ON addresses;
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;

DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS users CASCADE;
