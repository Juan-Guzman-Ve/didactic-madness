-- ============================================================================
-- Migration: 001 - RBAC Tables
-- Description: Role-Based Access Control with Policies
-- ============================================================================

-- Roles table
CREATE TABLE roles (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by VARCHAR(100),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE roles IS 'User roles for RBAC system';
COMMENT ON COLUMN roles.name IS 'Unique role name (e.g., Customer, Manager, SuperAdmin)';

-- Policies table
CREATE TABLE policies (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by VARCHAR(100),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE policies IS 'Authorization policies for RBAC (format: resource:action)';
COMMENT ON COLUMN policies.resource IS 'Resource type (e.g., products, orders)';
COMMENT ON COLUMN policies.action IS 'Action type (e.g., create, read, update, delete)';

CREATE INDEX idx_policies_resource ON policies(resource);

-- Role-Policy junction table (many-to-many)
CREATE TABLE role_policies (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_id INTEGER NOT NULL,
    policy_id INTEGER NOT NULL,
    created_by VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by VARCHAR(100),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_role_policies_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_policies_policy FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE RESTRICT,
    CONSTRAINT uq_role_policies_role_policy UNIQUE (role_id, policy_id)
);

COMMENT ON TABLE role_policies IS 'Maps policies to roles (many-to-many relationship)';

CREATE INDEX idx_role_policies_role_id ON role_policies(role_id);
CREATE INDEX idx_role_policies_policy_id ON role_policies(policy_id);
