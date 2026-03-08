-- ============================================================================
-- Maintenance Queries
-- ============================================================================

-- Table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Database size
SELECT 
    pg_database.datname,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
WHERE datname = current_database();

-- Find orphaned records
-- Products without images
SELECT 
    p.id,
    p.name,
    p.sku
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE pi.id IS NULL;

-- Carts with no items
SELECT 
    c.id,
    u.email,
    c.created_at
FROM carts c
LEFT JOIN cart_items ci ON c.id = ci.cart_id
JOIN users u ON c.user_id = u.id
WHERE ci.id IS NULL;

-- Users with no addresses
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name
FROM users u
LEFT JOIN addresses a ON u.id = a.user_id
WHERE a.id IS NULL AND u.role_id = 'role-customer';

-- Clean up old carts (cart items created more than 30 days ago with no order)
-- This is a SELECT query. Convert to DELETE when ready.
SELECT 
    ci.id,
    u.email,
    ci.created_at,
    AGE(NOW(), ci.created_at) as age
FROM cart_items ci
JOIN carts c ON ci.cart_id = c.id
JOIN users u ON c.user_id = u.id
WHERE ci.created_at < NOW() - INTERVAL '30 days';
