-- ============================================================================
-- Seed: 001 - RBAC Default Roles and Policies
-- ============================================================================

-- Insert default roles
INSERT INTO roles (name, description) VALUES
    ('Customer',   'Standard customer with basic shopping privileges'),
    ('Staff',      'Staff member with order management access'),
    ('Manager',    'Manager with product and category management'),
    ('SuperAdmin', 'Full system administrator access');

-- Insert policies
INSERT INTO policies (name, resource, action, description) VALUES

    -- Products
    ('products:list',   'products', 'list',   'View product catalog'),
    ('products:read',   'products', 'read',   'View product details'),
    ('products:create', 'products', 'create', 'Create new products'),
    ('products:update', 'products', 'update', 'Update existing products'),
    ('products:delete', 'products', 'delete', 'Delete products'),

    -- Product Images
    ('product-images:read',   'product-images', 'read',   'View product images'),
    ('product-images:create', 'product-images', 'create', 'Create product images'),
    ('product-images:update', 'product-images', 'update', 'Update product images'),
    ('product-images:delete', 'product-images', 'delete', 'Delete product images'),

    -- Orders
    ('orders:list',   'orders', 'list',   'View order list (admin)'),
    ('orders:read',   'orders', 'read',   'View order details (admin)'),
    ('orders:create', 'orders', 'create', 'Place new orders'),
    ('orders:update', 'orders', 'update', 'Update order status'),
    ('orders:cancel', 'orders', 'cancel', 'Cancel orders'),
    ('orders:read_own', 'orders', 'read_own', 'View own orders'),
    ('orders:cancel_own', 'orders', 'cancel_own', 'Cancel own orders'),

    -- Users
    ('users:read',   'users', 'read',   'View user details'),
    ('users:create', 'users', 'create', 'Create new users'),
    ('users:update', 'users', 'update', 'Update user information'),
    ('users:delete', 'users', 'delete', 'Delete users'),

    -- Cart
    ('cart:manage', 'cart', 'manage', 'Add/remove/update cart items'),
    ('cart:read_all', 'cart', 'read_all', 'View all carts (admin)'),

    -- Order Items
    ('order-items:read',   'order-items', 'read',   'View order item details'),
    ('order-items:create', 'order-items', 'create', 'Create order items'),
    ('order-items:update', 'order-items', 'update', 'Update order items'),
    ('order-items:delete', 'order-items', 'delete', 'Delete order items'),

    -- Addresses
    ('addresses:read',   'addresses', 'read',   'View address details'),
    ('addresses:create', 'addresses', 'create', 'Create addresses'),
    ('addresses:update', 'addresses', 'update', 'Update addresses'),
    ('addresses:delete', 'addresses', 'delete', 'Delete addresses'),

    -- Categories
    ('categories:list',   'categories', 'list',   'View categories'),
    ('categories:read',   'categories', 'read',   'View category details'),
    ('categories:create', 'categories', 'create', 'Create categories'),
    ('categories:update', 'categories', 'update', 'Update categories'),
    ('categories:delete', 'categories', 'delete', 'Delete categories'),

    -- Roles & Policies
    ('roles:manage',    'roles',    'manage', 'Manage roles and role-policy assignments'),
    ('policies:manage', 'policies', 'manage', 'Manage policies');

-- Assign policies to Customer role
INSERT INTO role_policies (role_id, policy_id)
SELECT r.id, p.id FROM roles r, policies p
WHERE r.name = 'Customer'
  AND p.name IN (
    'products:list', 
    'products:read', 
    'orders:create', 
    'orders:read_own', 
    'orders:cancel_own', 
    'cart:manage'
  );

-- Assign policies to Staff role
INSERT INTO role_policies (role_id, policy_id)
SELECT r.id, p.id FROM roles r, policies p
WHERE r.name = 'Staff'
  AND p.name IN ('products:list', 'products:read', 'orders:list', 'orders:read', 'orders:update');

-- Assign policies to Manager role
INSERT INTO role_policies (role_id, policy_id)
SELECT r.id, p.id FROM roles r, policies p
WHERE r.name = 'Manager'
  AND p.name IN (
    'products:list', 'products:read', 'products:create', 'products:update', 'products:delete',
    'orders:list', 'orders:read', 'orders:update', 'orders:cancel',
    'users:read', 'categories:create', 'categories:update'
  );

-- Assign all policies to SuperAdmin role
INSERT INTO role_policies (role_id, policy_id)
SELECT (SELECT id FROM roles WHERE name = 'SuperAdmin'), id
FROM policies;
