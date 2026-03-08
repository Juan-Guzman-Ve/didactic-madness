-- ============================================================================
-- Migration: 005 - Order Management
-- Description: Orders, order items, and status history
-- ============================================================================

-- Orders table
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id VARCHAR(50) NOT NULL,
    address_id VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PendingPayment',
    total_amount INTEGER NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    created_by VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by VARCHAR(50),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_orders_address FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE RESTRICT,
    CONSTRAINT chk_orders_total_amount CHECK (total_amount >= 0),
    CONSTRAINT chk_orders_status CHECK (status IN (
        'PendingPayment', 'PaymentConfirmed', 'Processing', 
        'Preparing', 'Shipped', 'Delivered', 'Cancelled'
    )),
    CONSTRAINT chk_orders_payment_status CHECK (payment_status IN (
        'Pending', 'Confirmed', 'Failed', 'Refunded'
    ))
);

COMMENT ON TABLE orders IS 'Customer orders';
COMMENT ON COLUMN orders.order_number IS 'Unique human-readable order identifier';
COMMENT ON COLUMN orders.total_amount IS 'Total price in cents';
COMMENT ON COLUMN orders.status IS 'Order fulfillment status';
COMMENT ON COLUMN orders.payment_status IS 'Payment processing status';

CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);

-- Order items table
CREATE TABLE order_items (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_purchase INTEGER NOT NULL,
    created_by VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by VARCHAR(50),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    CONSTRAINT chk_order_items_quantity CHECK (quantity > 0),
    CONSTRAINT chk_order_items_price CHECK (price_at_purchase >= 0)
);

COMMENT ON TABLE order_items IS 'Items in orders with price snapshot at purchase time';
COMMENT ON COLUMN order_items.price_at_purchase IS 'Price in cents at the time of order (immutable)';

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Order status history table
CREATE TABLE order_status_history (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    changed_by_user_id VARCHAR(50),
    notes TEXT,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_order_status_history_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_status_history_user FOREIGN KEY (changed_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_order_status_history_status CHECK (status IN (
        'PendingPayment', 'PaymentConfirmed', 'Processing', 
        'Preparing', 'Shipped', 'Delivered', 'Cancelled'
    ))
);

COMMENT ON TABLE order_status_history IS 'Audit trail of order status changes';
COMMENT ON COLUMN order_status_history.changed_by_user_id IS 'User who changed the status (nullable for system changes)';

CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);

-- Apply triggers
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_order_items_updated_at BEFORE UPDATE ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
