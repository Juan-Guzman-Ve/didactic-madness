-- ============================================================================
-- Main Seed File
-- Usage: psql -U <user> -d <database> -f database/sql/seed.sql
-- ============================================================================

\set ON_ERROR_STOP on

BEGIN;

\echo '--- Running seed 001: RBAC ---'
\ir seeds/001-rbac.sql

\echo '--- Running seed 002: Test Users ---'
\ir seeds/002-test-users.sql

\echo '--- Running seed 003: Test Products & Orders ---'
\ir seeds/003-test-products.sql

COMMIT;

\echo '--- All seeds applied successfully ---'
