-- ============================================================================
-- Seed: 002 - Test Users and Addresses
-- ============================================================================
-- Password for all users: Password123!
-- Bcrypt hash: $2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G
-- UUID key:
--   0001 = roles   0004 = users   0005 = addresses
-- ============================================================================

-- Insert test users
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role_id, status) VALUES
    ('00000000-0000-0000-0004-000000000001', 'admin@techstore.com',       '$2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G', 'Admin', 'User',    '+1-555-0001', '00000000-0000-0000-0001-000000000004', 'Active'),
    ('00000000-0000-0000-0004-000000000002', 'manager@techstore.com',     '$2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G', 'Jane',  'Manager', '+1-555-0002', '00000000-0000-0000-0001-000000000003', 'Active'),
    ('00000000-0000-0000-0004-000000000003', 'staff@techstore.com',       '$2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G', 'Bob',   'Staff',   '+1-555-0003', '00000000-0000-0000-0001-000000000002', 'Active'),
    ('00000000-0000-0000-0004-000000000004', 'john.doe@example.com',      '$2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G', 'John',  'Doe',     '+1-555-1001', '00000000-0000-0000-0001-000000000001', 'Active'),
    ('00000000-0000-0000-0004-000000000005', 'jane.smith@example.com',    '$2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G', 'Jane',  'Smith',   '+1-555-1002', '00000000-0000-0000-0001-000000000001', 'Active'),
    ('00000000-0000-0000-0004-000000000006', 'mike.wilson@example.com',   '$2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G', 'Mike',  'Wilson',  '+1-555-1003', '00000000-0000-0000-0001-000000000001', 'Active');

-- Insert test addresses
INSERT INTO addresses (id, user_id, address_line_1, address_line_2, city, state, postal_code, country, is_default) VALUES
    ('00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0004-000000000004', '123 Main Street', 'Apt 4B', 'New York',    'NY', '10001', 'USA', true),
    ('00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0004-000000000005', '456 Oak Avenue',  NULL,     'Los Angeles', 'CA', '90001', 'USA', true),
    ('00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0004-000000000006', '789 Pine Road',   NULL,     'Chicago',     'IL', '60601', 'USA', true);
