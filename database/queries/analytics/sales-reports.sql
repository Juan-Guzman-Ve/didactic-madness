-- ============================================================================
-- Analytics Queries
-- ============================================================================

-- Top selling products
SELECT 
    p.id,
    p.name,
    p.sku,
    SUM(oi.quantity) as total_sold,
    SUM(oi.quantity * oi.price_at_purchase) / 100.0 as total_revenue
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'Delivered'
GROUP BY p.id, p.name, p.sku
ORDER BY total_sold DESC
LIMIT 10;

-- Order statistics by status
SELECT 
    status,
    COUNT(*) as order_count,
    SUM(total_amount) / 100.0 as total_value
FROM orders
GROUP BY status
ORDER BY order_count DESC;

-- Revenue by date
SELECT 
    DATE(created_at) as order_date,
    COUNT(*) as order_count,
    SUM(total_amount) / 100.0 as daily_revenue
FROM orders
WHERE status IN ('Delivered', 'Shipped')
GROUP BY DATE(created_at)
ORDER BY order_date DESC
LIMIT 30;

-- Customer order summary
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    COUNT(o.id) as total_orders,
    SUM(o.total_amount) / 100.0 as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.role_id = 'role-customer'
GROUP BY u.id, u.email, u.first_name, u.last_name
ORDER BY total_spent DESC;

-- Products by category
SELECT 
    c.name as category,
    COUNT(p.id) as product_count,
    AVG(p.price) / 100.0 as avg_price,
    SUM(p.stock) as total_stock
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY product_count DESC;

-- Low stock alert
SELECT 
    p.id,
    p.name,
    p.sku,
    p.stock,
    c.name as category
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.stock < 10 AND p.status = 'Active'
ORDER BY p.stock ASC;
