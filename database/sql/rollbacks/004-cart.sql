-- ============================================================================
-- Rollback: 004 - Shopping Cart
-- ============================================================================

DROP TRIGGER IF EXISTS trg_cart_items_updated_at ON cart_items;
DROP TRIGGER IF EXISTS trg_carts_updated_at ON carts;

DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
