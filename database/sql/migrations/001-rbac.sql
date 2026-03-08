-- ============================================================================
-- Migration: 001 - RBAC Tables
-- Description: Role-Based Access Control with Policies
-- ============================================================================

-- Roles table
CREATE TABLE roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_by VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by VARCHAR(50),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE roles IS 'User roles for RBAC system';
COMMENT ON COLUMN roles.name IS 'Unique role name (e.g., Customer, Manager, SuperAdmin)';

-- Policies table
CREATE TABLE policies (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_by VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by VARCHAR(50),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE policies IS 'Authorization policies for RBAC (format: resource:action)';
COMMENT ON COLUMN policies.resource IS 'Resource type (e.g., products, orders)';
COMMENT ON COLUMN policies.action IS 'Action type (e.g., create, read, update, delete)';

CREATE INDEX idx_policies_resource ON policies(resource);

-- Role-Policy junction table (many-to-many)
CREATE TABLE role_policies (
    id VARCHAR(50) PRIMARY KEY,
    role_id VARCHAR(50) NOT NULL,
    policy_id VARCHAR(50) NOT NULL,
    created_by VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by VARCHAR(50),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_role_policies_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_policies_policy FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE RESTRICT,
    CONSTRAINT uq_role_policies_role_policy UNIQUE (role_id, policy_id)
);

COMMENT ON TABLE role_policies IS 'Maps policies to roles (many-to-many relationship)';

CREATE INDEX idx_role_policies_role_id ON role_policies(role_id);
CREATE INDEX idx_role_policies_policy_id ON role_policies(policy_id);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER trg_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_policies_updated_at BEFORE UPDATE ON policies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_role_policies_updated_at BEFORE UPDATE ON role_policies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
