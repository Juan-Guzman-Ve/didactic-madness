-- ============================================================================
-- All Seeds (combined)
-- Generated: 2026-04-25
-- Includes: reset + 001-rbac, 002-test-users, 003-test-products
-- ============================================================================


-- ============================================================================
-- Reset data before seeding
-- ============================================================================
-- Keeps table structure, removes all data, and resets identity/serial counters.
TRUNCATE TABLE
  order_status_history,
  order_items,
  cart_items,
  product_images,
  role_policies,
  orders,
  carts,
  addresses,
  users,
  products,
  categories,
  policies,
  roles
RESTART IDENTITY CASCADE;


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
    ('orders:list',       'orders', 'list',       'View order list (admin)'),
    ('orders:read',       'orders', 'read',       'View order details (admin)'),
    ('orders:create',     'orders', 'create',     'Place new orders'),
    ('orders:update',     'orders', 'update',     'Update order status'),
    ('orders:cancel',     'orders', 'cancel',     'Cancel orders'),
    ('orders:read_own',   'orders', 'read_own',   'View own orders'),
    ('orders:cancel_own', 'orders', 'cancel_own', 'Cancel own orders'),

    -- Users
    ('users:read',   'users', 'read',   'View user details'),
    ('users:create', 'users', 'create', 'Create new users'),
    ('users:update', 'users', 'update', 'Update user information'),
    ('users:delete', 'users', 'delete', 'Delete users'),

    -- Cart
    ('cart:manage',   'cart', 'manage',   'Add/remove/update cart items'),
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
    'product-images:read',
    'orders:create',
    'orders:read_own',
    'orders:cancel_own',
    'order-items:read',
    'cart:manage',
    'addresses:read',
    'addresses:create',
    'addresses:update',
    'addresses:delete'
  );

-- Assign policies to Staff role
INSERT INTO role_policies (role_id, policy_id)
SELECT r.id, p.id FROM roles r, policies p
WHERE r.name = 'Staff'
  AND p.name IN (
    'products:list',
    'products:read',
    'product-images:read',
    'orders:list',
    'orders:read',
    'orders:update',
    'order-items:read',
    'addresses:read'
  );

-- Assign policies to Manager role
INSERT INTO role_policies (role_id, policy_id)
SELECT r.id, p.id FROM roles r, policies p
WHERE r.name = 'Manager'
  AND p.name IN (
    'products:list',
    'products:read',
    'products:create',
    'products:update',
    'products:delete',
    'product-images:read',
    'product-images:create',
    'product-images:update',
    'product-images:delete',
    'orders:list',
    'orders:read',
    'orders:update',
    'orders:cancel',
    'order-items:read',
    'order-items:create',
    'order-items:update',
    'order-items:delete',
    'users:read',
    'users:update',
    'categories:list',
    'categories:read',
    'categories:create',
    'categories:update',
    'categories:delete',
    'cart:read_all',
    'addresses:read'
  );

-- Assign all policies to SuperAdmin role
INSERT INTO role_policies (role_id, policy_id)
SELECT (SELECT id FROM roles WHERE name = 'SuperAdmin'), id
FROM policies;


-- ============================================================================
-- Seed: 002 - Test Users and Addresses
-- ============================================================================
-- Password for all users: Password123!
-- Bcrypt hash: $2b$10$swiT62ZPAw/Fw9sGLUuFneCbpWCdlm/ltTtCLhfGK9w0K80r5lsfS
-- ============================================================================

-- Insert test users
INSERT INTO users (email, password_hash, first_name, last_name, phone, role_id, status) VALUES
    ('admin@techstore.com',     '$2b$10$swiT62ZPAw/Fw9sGLUuFneCbpWCdlm/ltTtCLhfGK9w0K80r5lsfS', 'Admin', 'User',    '+1-555-0001', (SELECT id FROM roles WHERE name = 'SuperAdmin'), 'Active'),
    ('manager@techstore.com',   '$2b$10$swiT62ZPAw/Fw9sGLUuFneCbpWCdlm/ltTtCLhfGK9w0K80r5lsfS', 'Jane',  'Manager', '+1-555-0002', (SELECT id FROM roles WHERE name = 'Manager'),    'Active'),
    ('staff@techstore.com',     '$2b$10$swiT62ZPAw/Fw9sGLUuFneCbpWCdlm/ltTtCLhfGK9w0K80r5lsfS', 'Bob',   'Staff',   '+1-555-0003', (SELECT id FROM roles WHERE name = 'Staff'),      'Active'),
    ('john.doe@example.com',    '$2b$10$swiT62ZPAw/Fw9sGLUuFneCbpWCdlm/ltTtCLhfGK9w0K80r5lsfS', 'John',  'Doe',     '+1-555-1001', (SELECT id FROM roles WHERE name = 'Customer'),   'Active'),
    ('jane.smith@example.com',  '$2b$10$swiT62ZPAw/Fw9sGLUuFneCbpWCdlm/ltTtCLhfGK9w0K80r5lsfS', 'Jane',  'Smith',   '+1-555-1002', (SELECT id FROM roles WHERE name = 'Customer'),   'Active'),
    ('mike.wilson@example.com', '$2b$10$swiT62ZPAw/Fw9sGLUuFneCbpWCdlm/ltTtCLhfGK9w0K80r5lsfS', 'Mike',  'Wilson',  '+1-555-1003', (SELECT id FROM roles WHERE name = 'Customer'),   'Active');

-- Insert test addresses
INSERT INTO addresses (user_id, address_line_1, address_line_2, city, state, postal_code, country, is_default) VALUES
    ((SELECT id FROM users WHERE email = 'john.doe@example.com'),    '123 Main Street', 'Apt 4B', 'New York',    'NY', '10001', 'USA', true),
    ((SELECT id FROM users WHERE email = 'jane.smith@example.com'),  '456 Oak Avenue',  NULL,     'Los Angeles', 'CA', '90001', 'USA', true),
    ((SELECT id FROM users WHERE email = 'mike.wilson@example.com'), '789 Pine Road',   NULL,     'Chicago',     'IL', '60601', 'USA', true);

-- Create one cart per user
INSERT INTO carts (user_id)
SELECT id FROM users;


-- ============================================================================
-- Seed: 003 - Test Products and Orders
-- ============================================================================

-- Insert categories
INSERT INTO categories (name, description, slug) VALUES
    ('Graphics Cards',  'High-performance GPUs for gaming and professional workloads', 'graphics-cards'),
    ('Processors',      'CPUs from Intel and AMD for all computing needs',             'processors'),
    ('Motherboards',    'Mainboards with various chipsets and form factors',           'motherboards'),
    ('Memory (RAM)',    'DDR4 and DDR5 memory modules',                                'memory'),
    ('Storage',         'SSDs, HDDs, and NVMe drives for data storage',               'storage'),
    ('Power Supplies',  'PSUs with various wattage and efficiency ratings',            'power-supplies'),
    ('Cases',           'PC cases in different sizes and styles',                     'cases'),
    ('Cooling',         'Air and liquid cooling solutions',                           'cooling');

-- Insert products
INSERT INTO products (sku, category_id, name, description, brand, model, price, stock, specifications, status) VALUES
    ('GPU-NVIDIA-4090', (SELECT id FROM categories WHERE slug = 'graphics-cards'),
    'NVIDIA GeForce RTX 4090',
    'The ultimate gaming GPU with 24GB GDDR6X memory and ray tracing capabilities',
    'NVIDIA', 'RTX 4090', 159999, 15,
    '{"memory": "24GB GDDR6X", "cores": "16384", "boost_clock": "2.52 GHz", "tdp": "450W", "ports": ["3x DisplayPort 1.4a", "1x HDMI 2.1"]}'::jsonb,
    'Active'),

    ('GPU-AMD-7900XTX', (SELECT id FROM categories WHERE slug = 'graphics-cards'),
    'AMD Radeon RX 7900 XTX',
    'High-end RDNA 3 architecture GPU with 24GB memory',
    'AMD', '7900 XTX', 99999, 20,
    '{"memory": "24GB GDDR6", "cores": "6144", "boost_clock": "2.5 GHz", "tdp": "355W", "ports": ["2x DisplayPort 2.1", "1x HDMI 2.1"]}'::jsonb,
    'Active'),

    ('CPU-INTEL-13900K', (SELECT id FROM categories WHERE slug = 'processors'),
    'Intel Core i9-13900K',
    '24-core processor with hybrid architecture',
    'Intel', 'Core i9-13900K', 58999, 30,
    '{"cores": "24", "threads": "32", "base_clock": "3.0 GHz", "boost_clock": "5.8 GHz", "socket": "LGA 1700", "tdp": "125W"}'::jsonb,
    'Active'),

    ('CPU-AMD-7950X', (SELECT id FROM categories WHERE slug = 'processors'),
    'AMD Ryzen 9 7950X',
    '16-core Zen 4 processor for high-performance computing',
    'AMD', 'Ryzen 9 7950X', 57999, 25,
    '{"cores": "16", "threads": "32", "base_clock": "4.5 GHz", "boost_clock": "5.7 GHz", "socket": "AM5", "tdp": "170W"}'::jsonb,
    'Active'),

    ('MB-ASUS-Z790', (SELECT id FROM categories WHERE slug = 'motherboards'),
    'ASUS ROG Maximus Z790 Hero',
    'Premium Z790 motherboard with PCIe 5.0 and DDR5 support',
    'ASUS', 'ROG Maximus Z790 Hero', 62999, 12,
    '{"socket": "LGA 1700", "chipset": "Z790", "memory": "DDR5", "form_factor": "ATX", "pcie_slots": "4", "m2_slots": "5"}'::jsonb,
    'Active'),

    ('RAM-GSKILL-6000', (SELECT id FROM categories WHERE slug = 'memory'),
    'G.Skill Trident Z5 RGB 32GB (2x16GB)',
    'High-speed DDR5 memory kit with RGB lighting',
    'G.Skill', 'Trident Z5 RGB', 17999, 50,
    '{"capacity": "32GB", "type": "DDR5", "speed": "6000 MHz", "cas_latency": "CL30", "modules": "2x16GB", "voltage": "1.35V"}'::jsonb,
    'Active'),

    ('SSD-SAMSUNG-990PRO', (SELECT id FROM categories WHERE slug = 'storage'),
    'Samsung 990 PRO 2TB NVMe SSD',
    'PCIe 4.0 NVMe SSD with exceptional read/write speeds',
    'Samsung', '990 PRO', 21999, 40,
    '{"capacity": "2TB", "interface": "NVMe PCIe 4.0 x4", "form_factor": "M.2 2280", "read_speed": "7450 MB/s", "write_speed": "6900 MB/s", "warranty": "5 years"}'::jsonb,
    'Active'),

    ('PSU-CORSAIR-RM1000X', (SELECT id FROM categories WHERE slug = 'power-supplies'),
    'Corsair RM1000x 1000W 80+ Gold',
    'Fully modular ATX power supply with 80+ Gold efficiency',
    'Corsair', 'RM1000x', 18999, 35,
    '{"wattage": "1000W", "efficiency": "80+ Gold", "modular": "Fully Modular", "form_factor": "ATX", "warranty": "10 years"}'::jsonb,
    'Active'),

    ('CASE-NZXT-H9', (SELECT id FROM categories WHERE slug = 'cases'),
    'NZXT H9 Flow Mid-Tower',
    'Modern mid-tower case with excellent airflow',
    'NZXT', 'H9 Flow', 14999, 25,
    '{"form_factor": "Mid-Tower", "max_gpu_length": "400mm", "max_cooler_height": "185mm", "drive_bays": "2x 3.5\", 4x 2.5\"", "front_io": "USB 3.2 Gen 2, USB-C", "tempered_glass": "Yes"}'::jsonb,
    'Active'),

    ('COOL-NZXT-KRAKEN', (SELECT id FROM categories WHERE slug = 'cooling'),
    'NZXT Kraken X63 280mm AIO',
    'All-in-one liquid cooler with RGB lighting',
    'NZXT', 'Kraken X63', 14999, 30,
    '{"radiator_size": "280mm", "fan_size": "2x 140mm", "pump_speed": "800-2800 RPM", "socket_support": "Intel: LGA 1700/1200, AMD: AM4/AM5", "rgb": "Yes"}'::jsonb,
    'Active');

-- Insert product images
INSERT INTO product_images (product_id, url, display_order) VALUES
    ((SELECT id FROM products WHERE sku = 'GPU-NVIDIA-4090'),    'https://picsum.photos/seed/GPU-NVIDIA-4090/800/800',     0),
    ((SELECT id FROM products WHERE sku = 'GPU-NVIDIA-4090'),    'https://picsum.photos/seed/GPU-NVIDIA-4090-2/800/800',   1),
    ((SELECT id FROM products WHERE sku = 'GPU-AMD-7900XTX'),    'https://picsum.photos/seed/GPU-AMD-7900XTX/800/800',     0),
    ((SELECT id FROM products WHERE sku = 'GPU-AMD-7900XTX'),    'https://picsum.photos/seed/GPU-AMD-7900XTX-2/800/800',   1),
    ((SELECT id FROM products WHERE sku = 'CPU-INTEL-13900K'),   'https://picsum.photos/seed/CPU-INTEL-13900K/800/800',    0),
    ((SELECT id FROM products WHERE sku = 'CPU-INTEL-13900K'),   'https://picsum.photos/seed/CPU-INTEL-13900K-2/800/800',  1),
    ((SELECT id FROM products WHERE sku = 'CPU-AMD-7950X'),      'https://picsum.photos/seed/CPU-AMD-7950X/800/800',       0),
    ((SELECT id FROM products WHERE sku = 'CPU-AMD-7950X'),      'https://picsum.photos/seed/CPU-AMD-7950X-2/800/800',     1),
    ((SELECT id FROM products WHERE sku = 'MB-ASUS-Z790'),       'https://picsum.photos/seed/MB-ASUS-Z790/800/800',        0),
    ((SELECT id FROM products WHERE sku = 'RAM-GSKILL-6000'),    'https://picsum.photos/seed/RAM-GSKILL-6000/800/800',     0),
    ((SELECT id FROM products WHERE sku = 'SSD-SAMSUNG-990PRO'), 'https://picsum.photos/seed/SSD-SAMSUNG-990PRO/800/800',  0),
    ((SELECT id FROM products WHERE sku = 'PSU-CORSAIR-RM1000X'),'https://picsum.photos/seed/PSU-CORSAIR-RM1000X/800/800', 0),
    ((SELECT id FROM products WHERE sku = 'CASE-NZXT-H9'),       'https://picsum.photos/seed/CASE-NZXT-H9/800/800',        0),
    ((SELECT id FROM products WHERE sku = 'COOL-NZXT-KRAKEN'),   'https://picsum.photos/seed/COOL-NZXT-KRAKEN/800/800',    0);

-- Insert cart items for john.doe (cart already created in seed 002)
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
    ((SELECT id FROM carts WHERE user_id = (SELECT id FROM users WHERE email = 'john.doe@example.com')), (SELECT id FROM products WHERE sku = 'GPU-NVIDIA-4090'),   2),
    ((SELECT id FROM carts WHERE user_id = (SELECT id FROM users WHERE email = 'john.doe@example.com')), (SELECT id FROM products WHERE sku = 'CPU-INTEL-13900K'), 1);

-- Insert test order
INSERT INTO orders (order_number, user_id, address_id, status, total_amount, payment_status) VALUES
    ('ORD-2026-00001',
     (SELECT id FROM users    WHERE email           = 'jane.smith@example.com'),
     (SELECT id FROM addresses WHERE address_line_1 = '456 Oak Avenue'),
     'Delivered', 279998, 'Confirmed');

INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES
    ((SELECT id FROM orders WHERE order_number = 'ORD-2026-00001'), (SELECT id FROM products WHERE sku = 'GPU-AMD-7900XTX'),    1, 99999),
    ((SELECT id FROM orders WHERE order_number = 'ORD-2026-00001'), (SELECT id FROM products WHERE sku = 'CPU-AMD-7950X'),      1, 57999),
    ((SELECT id FROM orders WHERE order_number = 'ORD-2026-00001'), (SELECT id FROM products WHERE sku = 'RAM-GSKILL-6000'),    1, 17999),
    ((SELECT id FROM orders WHERE order_number = 'ORD-2026-00001'), (SELECT id FROM products WHERE sku = 'SSD-SAMSUNG-990PRO'), 2, 21999);

INSERT INTO order_status_history (order_id, status, changed_by_user_id, notes, changed_at) VALUES
    ((SELECT id FROM orders WHERE order_number = 'ORD-2026-00001'), 'PendingPayment',   (SELECT id FROM users WHERE email = 'staff@techstore.com'), 'Order placed',                              NOW() - INTERVAL '7 days'),
    ((SELECT id FROM orders WHERE order_number = 'ORD-2026-00001'), 'PaymentConfirmed', (SELECT id FROM users WHERE email = 'staff@techstore.com'), 'Payment confirmed via credit card',         NOW() - INTERVAL '7 days' + INTERVAL '10 minutes'),
    ((SELECT id FROM orders WHERE order_number = 'ORD-2026-00001'), 'Processing',       (SELECT id FROM users WHERE email = 'staff@techstore.com'), 'Order being prepared',                      NOW() - INTERVAL '6 days'),
    ((SELECT id FROM orders WHERE order_number = 'ORD-2026-00001'), 'Preparing',        (SELECT id FROM users WHERE email = 'staff@techstore.com'), 'Items packed',                              NOW() - INTERVAL '5 days'),
    ((SELECT id FROM orders WHERE order_number = 'ORD-2026-00001'), 'Shipped',          (SELECT id FROM users WHERE email = 'staff@techstore.com'), 'Shipped via FedEx, tracking: FX123456789', NOW() - INTERVAL '4 days'),
    ((SELECT id FROM orders WHERE order_number = 'ORD-2026-00001'), 'Delivered',        (SELECT id FROM users WHERE email = 'staff@techstore.com'), 'Delivered successfully',                    NOW() - INTERVAL '1 day');
