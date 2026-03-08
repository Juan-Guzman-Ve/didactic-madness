-- ============================================================================
-- Seed: 002 - Test Users and Addresses
-- ============================================================================
-- Password for all users: Password123!
-- Bcrypt hash: $2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G
-- ============================================================================

-- Insert test users
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role_id, status) VALUES
    ('user-admin', 'admin@techstore.com', '$2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G', 'Admin', 'User', '+1-555-0001', 'role-superadmin', 'Active'),
    ('user-manager', 'manager@techstore.com', '$2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G', 'Jane', 'Manager', '+1-555-0002', 'role-manager', 'Active'),
    ('user-staff', 'staff@techstore.com', '$2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G', 'Bob', 'Staff', '+1-555-0003', 'role-staff', 'Active'),
    ('user-john', 'john.doe@example.com', '$2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G', 'John', 'Doe', '+1-555-1001', 'role-customer', 'Active'),
    ('user-jane', 'jane.smith@example.com', '$2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G', 'Jane', 'Smith', '+1-555-1002', 'role-customer', 'Active'),
    ('user-mike', 'mike.wilson@example.com', '$2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G', 'Mike', 'Wilson', '+1-555-1003', 'role-customer', 'Active');

-- Insert test addresses
INSERT INTO addresses (id, user_id, address_line_1, address_line_2, city, state, postal_code, country, is_default) VALUES
    ('addr-john-1', 'user-john', '123 Main Street', 'Apt 4B', 'New York', 'NY', '10001', 'USA', true),
    ('addr-jane-1', 'user-jane', '456 Oak Avenue', NULL, 'Los Angeles', 'CA', '90001', 'USA', true),
    ('addr-mike-1', 'user-mike', '789 Pine Road', NULL, 'Chicago', 'IL', '60601', 'USA', true);
