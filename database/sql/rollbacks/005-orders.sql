-- ============================================================================
-- Rollback: 005 - Order Management
-- ============================================================================

DROP TRIGGER IF EXISTS trg_order_items_updated_at ON order_items;
DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;

DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
