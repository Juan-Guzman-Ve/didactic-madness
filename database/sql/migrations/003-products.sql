-- ============================================================================
-- Migration: 003 - Product Catalog
-- Description: Categories, products, and product images
-- ============================================================================

-- Categories table
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_by VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by VARCHAR(50),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE categories IS 'Product categories';
COMMENT ON COLUMN categories.slug IS 'URL-friendly identifier';

-- Products table
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    sku VARCHAR(100) NOT NULL UNIQUE,
    category_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    specifications JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    created_by VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by VARCHAR(50),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    CONSTRAINT chk_products_price CHECK (price >= 0),
    CONSTRAINT chk_products_stock CHECK (stock >= 0),
    CONSTRAINT chk_products_status CHECK (status IN ('Active', 'Inactive'))
);

COMMENT ON TABLE products IS 'Product catalog';
COMMENT ON COLUMN products.sku IS 'Unique stock-keeping unit';
COMMENT ON COLUMN products.price IS 'Price in cents (e.g., 199999 = $1999.99)';
COMMENT ON COLUMN products.stock IS 'Current inventory quantity';
COMMENT ON COLUMN products.specifications IS 'Category-specific technical specs in JSON format';

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category_status ON products(category_id, status);

-- Product images table
CREATE TABLE product_images (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    url VARCHAR(500) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_by VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by VARCHAR(50),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

COMMENT ON TABLE product_images IS 'Product images with display ordering';
COMMENT ON COLUMN product_images.url IS 'Image URL from storage service';
COMMENT ON COLUMN product_images.display_order IS 'Sort order for display (0 = primary image)';

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
