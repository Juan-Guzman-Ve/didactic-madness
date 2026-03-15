-- ============================================================================
-- Maintenance: Drop All Tables
-- Description: Drops all tables in the public schema.
-- NOTE: This is a destructive operation and will delete all data.
-- ============================================================================

-- Disable all triggers to avoid unintended side effects
SET session_replication_role = 'replica';

-- Drop all tables. The CASCADE option will handle dependent objects.
-- The order is from most dependent to least dependent to be safe.
DROP TABLE IF EXISTS "order_status_history" CASCADE;
DROP TABLE IF EXISTS "order_items" CASCADE;
DROP TABLE IF EXISTS "cart_items" CASCADE;
DROP TABLE IF EXISTS "product_images" CASCADE;
DROP TABLE IF EXISTS "role_policies" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "carts" CASCADE;
DROP TABLE IF EXISTS "addresses" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;
DROP TABLE IF EXISTS "policies" CASCADE;
DROP TABLE IF EXISTS "roles" CASCADE;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Optional: Vacuum and analyze the database after dropping tables
-- VACUUM FULL;
-- ANALYZE;

-- ============================================================================
-- Verification
-- ============================================================================
-- To verify that all tables have been dropped, you can run the following query
-- in your database client. It should return an empty result set.
--
-- SELECT table_name
-- FROM information_schema.tables
-- WHERE table_schema = 'public'
--   AND table_type = 'BASE TABLE';
-- ============================================================================
