-- ============================================================================
-- Seed: 001 - RBAC Default Roles and Policies
-- ============================================================================

-- Insert default roles
INSERT INTO roles (id, name, description) VALUES
    ('role-customer', 'Customer', 'Standard customer with basic shopping privileges'),
    ('role-staff', 'Staff', 'Staff member with order management access'),
    ('role-manager', 'Manager', 'Manager with product and category management'),
    ('role-superadmin', 'SuperAdmin', 'Full system administrator access');

-- Insert policies
INSERT INTO policies (id, name, resource, action, description) VALUES
    -- Products
    ('policy-products-list', 'products:list', 'products', 'list', 'View product catalog'),
    ('policy-products-read', 'products:read', 'products', 'read', 'View product details'),
    ('policy-products-create', 'products:create', 'products', 'create', 'Create new products'),
    ('policy-products-update', 'products:update', 'products', 'update', 'Update existing products'),
    ('policy-products-delete', 'products:delete', 'products', 'delete', 'Delete products'),
    
    -- Orders
    ('policy-orders-list', 'orders:list', 'orders', 'list', 'View order list'),
    ('policy-orders-read', 'orders:read', 'orders', 'read', 'View order details'),
    ('policy-orders-create', 'orders:create', 'orders', 'create', 'Place new orders'),
    ('policy-orders-update', 'orders:update', 'orders', 'update', 'Update order status'),
    ('policy-orders-cancel', 'orders:cancel', 'orders', 'cancel', 'Cancel orders'),
    
    -- Users
    ('policy-users-read', 'users:read', 'users', 'read', 'View user details'),
    ('policy-users-create', 'users:create', 'users', 'create', 'Create new users'),
    ('policy-users-update', 'users:update', 'users', 'update', 'Update user information'),
    ('policy-users-delete', 'users:delete', 'users', 'delete', 'Delete users'),
    
    -- Cart
    ('policy-cart-manage', 'cart:manage', 'cart', 'manage', 'Add/remove/update cart items'),
    
    -- Categories
    ('policy-categories-list', 'categories:list', 'categories', 'list', 'View categories'),
    ('policy-categories-read', 'categories:read', 'categories', 'read', 'View category details'),
    ('policy-categories-create', 'categories:create', 'categories', 'create', 'Create categories'),
    ('policy-categories-update', 'categories:update', 'categories', 'update', 'Update categories'),
    ('policy-categories-delete', 'categories:delete', 'categories', 'delete', 'Delete categories'),
    
    -- Roles & Policies
    ('policy-roles-manage', 'roles:manage', 'roles', 'manage', 'Manage roles and role-policy assignments'),
    ('policy-policies-manage', 'policies:manage', 'policies', 'manage', 'Manage policies');

-- Assign policies to Customer role
INSERT INTO role_policies (id, role_id, policy_id) VALUES
    ('rp-customer-1', 'role-customer', 'policy-products-list'),
    ('rp-customer-2', 'role-customer', 'policy-products-read'),
    ('rp-customer-3', 'role-customer', 'policy-orders-create'),
    ('rp-customer-4', 'role-customer', 'policy-orders-read'),
    ('rp-customer-5', 'role-customer', 'policy-cart-manage');

-- Assign policies to Staff role
INSERT INTO role_policies (id, role_id, policy_id) VALUES
    ('rp-staff-1', 'role-staff', 'policy-products-list'),
    ('rp-staff-2', 'role-staff', 'policy-products-read'),
    ('rp-staff-3', 'role-staff', 'policy-orders-list'),
    ('rp-staff-4', 'role-staff', 'policy-orders-read'),
    ('rp-staff-5', 'role-staff', 'policy-orders-update');

-- Assign policies to Manager role
INSERT INTO role_policies (id, role_id, policy_id) VALUES
    ('rp-manager-1', 'role-manager', 'policy-products-list'),
    ('rp-manager-2', 'role-manager', 'policy-products-read'),
    ('rp-manager-3', 'role-manager', 'policy-products-create'),
    ('rp-manager-4', 'role-manager', 'policy-products-update'),
    ('rp-manager-5', 'role-manager', 'policy-products-delete'),
    ('rp-manager-6', 'role-manager', 'policy-orders-list'),
    ('rp-manager-7', 'role-manager', 'policy-orders-read'),
    ('rp-manager-8', 'role-manager', 'policy-orders-update'),
    ('rp-manager-9', 'role-manager', 'policy-orders-cancel'),
    ('rp-manager-10', 'role-manager', 'policy-users-read'),
    ('rp-manager-11', 'role-manager', 'policy-categories-create'),
    ('rp-manager-12', 'role-manager', 'policy-categories-update');

-- Assign all policies to SuperAdmin role
INSERT INTO role_policies (id, role_id, policy_id)
SELECT 
    'rp-superadmin-' || ROW_NUMBER() OVER (ORDER BY id),
    'role-superadmin',
    id
FROM policies;
