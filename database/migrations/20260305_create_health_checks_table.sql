-- ═════════════════════════════════════════════════════════════════════════════
-- Migration: Create health_checks table
-- Date: 2026-03-05
-- Description: POC table to test database connectivity and TypeORM integration
-- ═════════════════════════════════════════════════════════════════════════════

-- ─── Create Extension for UUID ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Create health_checks Table ─────────────────────────────────────────────
CREATE TABLE health_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  message TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── Create Indexes ─────────────────────────────────────────────────────────
CREATE INDEX idx_health_checks_service ON health_checks(service);
CREATE INDEX idx_health_checks_checked_at ON health_checks(checked_at DESC);

-- ─── Add Comments ───────────────────────────────────────────────────────────
COMMENT ON TABLE health_checks IS 'Health check records for monitoring database connectivity';
COMMENT ON COLUMN health_checks.id IS 'Unique identifier for health check record';
COMMENT ON COLUMN health_checks.service IS 'Name of the service being checked (e.g., database, api)';
COMMENT ON COLUMN health_checks.status IS 'Health status: healthy, unhealthy, degraded';
COMMENT ON COLUMN health_checks.message IS 'Optional message describing the health check result';
COMMENT ON COLUMN health_checks.checked_at IS 'Timestamp when the health check was performed';

-- ─── Insert Sample Data ─────────────────────────────────────────────────────
INSERT INTO health_checks (service, status, message) VALUES
  ('database', 'healthy', 'Initial setup complete'),
  ('api', 'healthy', 'Application bootstrapped successfully');
