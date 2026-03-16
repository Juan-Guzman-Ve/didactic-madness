-- ============================================================================
-- Main Migrations File
-- Usage: psql -U <user> -d <database> -f database/sql/migrate.sql
-- ============================================================================

\set ON_ERROR_STOP on

BEGIN;

\echo '--- Running migration 001: RBAC ---'
\ir migrations/001-rbac.sql

\echo '--- Running migration 002: Users ---'
\ir migrations/002-users.sql

\echo '--- Running migration 003: Products ---'
\ir migrations/003-products.sql

\echo '--- Running migration 004: Cart ---'
\ir migrations/004-cart.sql

\echo '--- Running migration 005: Orders ---'
\ir migrations/005-orders.sql

COMMIT;

\echo '--- All migrations applied successfully ---'
