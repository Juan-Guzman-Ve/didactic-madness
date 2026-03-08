-- ============================================================================
-- Rollback: 003 - Product Catalog
-- ============================================================================

DROP TRIGGER IF EXISTS trg_product_images_updated_at ON product_images;
DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;

DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
