-- ============================================================================
-- Seed: 002 - Test Users and Addresses
-- ============================================================================
-- Password for all users: Password123!
-- Bcrypt hash: $2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G
-- ============================================================================

-- Insert test users
INSERT INTO users (email, password_hash, first_name, last_name, phone, role_id, status) VALUES
    ('admin@techstore.com',     '$2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G', 'Admin', 'User',    '+1-555-0001', (SELECT id FROM roles WHERE name = 'SuperAdmin'), 'Active'),
    ('manager@techstore.com',   '$2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G', 'Jane',  'Manager', '+1-555-0002', (SELECT id FROM roles WHERE name = 'Manager'),    'Active'),
    ('staff@techstore.com',     '$2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G', 'Bob',   'Staff',   '+1-555-0003', (SELECT id FROM roles WHERE name = 'Staff'),      'Active'),
    ('john.doe@example.com',    '$2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G', 'John',  'Doe',     '+1-555-1001', (SELECT id FROM roles WHERE name = 'Customer'),   'Active'),
    ('jane.smith@example.com',  '$2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G', 'Jane',  'Smith',   '+1-555-1002', (SELECT id FROM roles WHERE name = 'Customer'),   'Active'),
    ('mike.wilson@example.com', '$2a$10$X5YqHJz6.vZLqF9qMJ5PQe9xB5rP0YF8Zq7rXM5YkN7pZ8wJ9qF8G', 'Mike',  'Wilson',  '+1-555-1003', (SELECT id FROM roles WHERE name = 'Customer'),   'Active');

-- Insert test addresses
INSERT INTO addresses (user_id, address_line_1, address_line_2, city, state, postal_code, country, is_default) VALUES
    ((SELECT id FROM users WHERE email = 'john.doe@example.com'),    '123 Main Street', 'Apt 4B', 'New York',    'NY', '10001', 'USA', true),
    ((SELECT id FROM users WHERE email = 'jane.smith@example.com'),  '456 Oak Avenue',  NULL,     'Los Angeles', 'CA', '90001', 'USA', true),
    ((SELECT id FROM users WHERE email = 'mike.wilson@example.com'), '789 Pine Road',   NULL,     'Chicago',     'IL', '60601', 'USA', true);
