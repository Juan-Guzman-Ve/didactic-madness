-- ============================================================================
-- Seed: 003 - Test Products and Orders
-- ============================================================================
-- UUID key:
--   0006 = categories   0007 = products       0008 = product_images
--   0009 = carts        0010 = cart_items      0011 = orders
--   0012 = order_items  0013 = order_status_history
-- Cross-seed references:
--   0004 = users        0005 = addresses
-- ============================================================================

-- Insert categories
INSERT INTO categories (id, name, description, slug) VALUES
    ('00000000-0000-0000-0006-000000000001', 'Graphics Cards',  'High-performance GPUs for gaming and professional workloads', 'graphics-cards'),
    ('00000000-0000-0000-0006-000000000002', 'Processors',      'CPUs from Intel and AMD for all computing needs',             'processors'),
    ('00000000-0000-0000-0006-000000000003', 'Motherboards',    'Mainboards with various chipsets and form factors',           'motherboards'),
    ('00000000-0000-0000-0006-000000000004', 'Memory (RAM)',    'DDR4 and DDR5 memory modules',                                'memory'),
    ('00000000-0000-0000-0006-000000000005', 'Storage',         'SSDs, HDDs, and NVMe drives for data storage',               'storage'),
    ('00000000-0000-0000-0006-000000000006', 'Power Supplies',  'PSUs with various wattage and efficiency ratings',            'power-supplies'),
    ('00000000-0000-0000-0006-000000000007', 'Cases',           'PC cases in different sizes and styles',                     'cases'),
    ('00000000-0000-0000-0006-000000000008', 'Cooling',         'Air and liquid cooling solutions',                           'cooling');

-- Insert products
INSERT INTO products (id, sku, category_id, name, description, brand, model, price, stock, specifications, status) VALUES
    ('00000000-0000-0000-0007-000000000001', 'GPU-NVIDIA-4090', '00000000-0000-0000-0006-000000000001',
    'NVIDIA GeForce RTX 4090',
    'The ultimate gaming GPU with 24GB GDDR6X memory and ray tracing capabilities',
    'NVIDIA', 'RTX 4090', 159999, 15,
    '{"memory": "24GB GDDR6X", "cores": "16384", "boost_clock": "2.52 GHz", "tdp": "450W", "ports": ["3x DisplayPort 1.4a", "1x HDMI 2.1"]}'::jsonb,
    'Active'),

    ('00000000-0000-0000-0007-000000000002', 'GPU-AMD-7900XTX', '00000000-0000-0000-0006-000000000001',
    'AMD Radeon RX 7900 XTX',
    'High-end RDNA 3 architecture GPU with 24GB memory',
    'AMD', '7900 XTX', 99999, 20,
    '{"memory": "24GB GDDR6", "cores": "6144", "boost_clock": "2.5 GHz", "tdp": "355W", "ports": ["2x DisplayPort 2.1", "1x HDMI 2.1"]}'::jsonb,
    'Active'),

    ('00000000-0000-0000-0007-000000000003', 'CPU-INTEL-13900K', '00000000-0000-0000-0006-000000000002',
    'Intel Core i9-13900K',
    '24-core processor with hybrid architecture',
    'Intel', 'Core i9-13900K', 58999, 30,
    '{"cores": "24", "threads": "32", "base_clock": "3.0 GHz", "boost_clock": "5.8 GHz", "socket": "LGA 1700", "tdp": "125W"}'::jsonb,
    'Active'),

    ('00000000-0000-0000-0007-000000000004', 'CPU-AMD-7950X', '00000000-0000-0000-0006-000000000002',
    'AMD Ryzen 9 7950X',
    '16-core Zen 4 processor for high-performance computing',
    'AMD', 'Ryzen 9 7950X', 57999, 25,
    '{"cores": "16", "threads": "32", "base_clock": "4.5 GHz", "boost_clock": "5.7 GHz", "socket": "AM5", "tdp": "170W"}'::jsonb,
    'Active'),

    ('00000000-0000-0000-0007-000000000005', 'MB-ASUS-Z790', '00000000-0000-0000-0006-000000000003',
    'ASUS ROG Maximus Z790 Hero',
    'Premium Z790 motherboard with PCIe 5.0 and DDR5 support',
    'ASUS', 'ROG Maximus Z790 Hero', 62999, 12,
    '{"socket": "LGA 1700", "chipset": "Z790", "memory": "DDR5", "form_factor": "ATX", "pcie_slots": "4", "m2_slots": "5"}'::jsonb,
    'Active'),

    ('00000000-0000-0000-0007-000000000006', 'RAM-GSKILL-6000', '00000000-0000-0000-0006-000000000004',
    'G.Skill Trident Z5 RGB 32GB (2x16GB)',
    'High-speed DDR5 memory kit with RGB lighting',
    'G.Skill', 'Trident Z5 RGB', 17999, 50,
    '{"capacity": "32GB", "type": "DDR5", "speed": "6000 MHz", "cas_latency": "CL30", "modules": "2x16GB", "voltage": "1.35V"}'::jsonb,
    'Active'),

    ('00000000-0000-0000-0007-000000000007', 'SSD-SAMSUNG-990PRO', '00000000-0000-0000-0006-000000000005',
    'Samsung 990 PRO 2TB NVMe SSD',
    'PCIe 4.0 NVMe SSD with exceptional read/write speeds',
    'Samsung', '990 PRO', 21999, 40,
    '{"capacity": "2TB", "interface": "NVMe PCIe 4.0 x4", "form_factor": "M.2 2280", "read_speed": "7450 MB/s", "write_speed": "6900 MB/s", "warranty": "5 years"}'::jsonb,
    'Active'),

    ('00000000-0000-0000-0007-000000000008', 'PSU-CORSAIR-RM1000X', '00000000-0000-0000-0006-000000000006',
    'Corsair RM1000x 1000W 80+ Gold',
    'Fully modular ATX power supply with 80+ Gold efficiency',
    'Corsair', 'RM1000x', 18999, 35,
    '{"wattage": "1000W", "efficiency": "80+ Gold", "modular": "Fully Modular", "form_factor": "ATX", "warranty": "10 years"}'::jsonb,
    'Active'),

    ('00000000-0000-0000-0007-000000000009', 'CASE-NZXT-H9', '00000000-0000-0000-0006-000000000007',
    'NZXT H9 Flow Mid-Tower',
    'Modern mid-tower case with excellent airflow',
    'NZXT', 'H9 Flow', 14999, 25,
    '{"form_factor": "Mid-Tower", "max_gpu_length": "400mm", "max_cooler_height": "185mm", "drive_bays": "2x 3.5\", 4x 2.5\"", "front_io": "USB 3.2 Gen 2, USB-C", "tempered_glass": "Yes"}'::jsonb,
    'Active'),

    ('00000000-0000-0000-0007-000000000010', 'COOL-NZXT-KRAKEN', '00000000-0000-0000-0006-000000000008',
    'NZXT Kraken X63 280mm AIO',
    'All-in-one liquid cooler with RGB lighting',
    'NZXT', 'Kraken X63', 14999, 30,
    '{"radiator_size": "280mm", "fan_size": "2x 140mm", "pump_speed": "800-2800 RPM", "socket_support": "Intel: LGA 1700/1200, AMD: AM4/AM5", "rgb": "Yes"}'::jsonb,
    'Active');

-- Insert product images
INSERT INTO product_images (id, product_id, url, display_order) VALUES
    ('00000000-0000-0000-0008-000000000001', '00000000-0000-0000-0007-000000000001', 'https://picsum.photos/seed/GPU-NVIDIA-4090/800/800',    0),
    ('00000000-0000-0000-0008-000000000002', '00000000-0000-0000-0007-000000000001', 'https://picsum.photos/seed/GPU-NVIDIA-4090-2/800/800',  1),
    ('00000000-0000-0000-0008-000000000003', '00000000-0000-0000-0007-000000000002', 'https://picsum.photos/seed/GPU-AMD-7900XTX/800/800',    0),
    ('00000000-0000-0000-0008-000000000004', '00000000-0000-0000-0007-000000000002', 'https://picsum.photos/seed/GPU-AMD-7900XTX-2/800/800',  1),
    ('00000000-0000-0000-0008-000000000005', '00000000-0000-0000-0007-000000000003', 'https://picsum.photos/seed/CPU-INTEL-13900K/800/800',   0),
    ('00000000-0000-0000-0008-000000000006', '00000000-0000-0000-0007-000000000003', 'https://picsum.photos/seed/CPU-INTEL-13900K-2/800/800', 1),
    ('00000000-0000-0000-0008-000000000007', '00000000-0000-0000-0007-000000000004', 'https://picsum.photos/seed/CPU-AMD-7950X/800/800',      0),
    ('00000000-0000-0000-0008-000000000008', '00000000-0000-0000-0007-000000000004', 'https://picsum.photos/seed/CPU-AMD-7950X-2/800/800',    1),
    ('00000000-0000-0000-0008-000000000009', '00000000-0000-0000-0007-000000000005', 'https://picsum.photos/seed/MB-ASUS-Z790/800/800',       0),
    ('00000000-0000-0000-0008-000000000010', '00000000-0000-0000-0007-000000000006', 'https://picsum.photos/seed/RAM-GSKILL-6000/800/800',    0),
    ('00000000-0000-0000-0008-000000000011', '00000000-0000-0000-0007-000000000007', 'https://picsum.photos/seed/SSD-SAMSUNG-990PRO/800/800', 0),
    ('00000000-0000-0000-0008-000000000012', '00000000-0000-0000-0007-000000000008', 'https://picsum.photos/seed/PSU-CORSAIR-RM1000X/800/800',0),
    ('00000000-0000-0000-0008-000000000013', '00000000-0000-0000-0007-000000000009', 'https://picsum.photos/seed/CASE-NZXT-H9/800/800',       0),
    ('00000000-0000-0000-0008-000000000014', '00000000-0000-0000-0007-000000000010', 'https://picsum.photos/seed/COOL-NZXT-KRAKEN/800/800',   0);

-- Insert test cart
INSERT INTO carts (id, user_id) VALUES
    ('00000000-0000-0000-0009-000000000001', '00000000-0000-0000-0004-000000000004');

INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES
    ('00000000-0000-0000-0010-000000000001', '00000000-0000-0000-0009-000000000001', '00000000-0000-0000-0007-000000000001', 2),
    ('00000000-0000-0000-0010-000000000002', '00000000-0000-0000-0009-000000000001', '00000000-0000-0000-0007-000000000003', 1);

-- Insert test order
INSERT INTO orders (id, order_number, user_id, address_id, status, total_amount, payment_status) VALUES
    ('00000000-0000-0000-0011-000000000001', 'ORD-2026-00001', '00000000-0000-0000-0004-000000000005', '00000000-0000-0000-0005-000000000002', 'Delivered', 279998, 'Confirmed');

INSERT INTO order_items (id, order_id, product_id, quantity, price_at_purchase) VALUES
    ('00000000-0000-0000-0012-000000000001', '00000000-0000-0000-0011-000000000001', '00000000-0000-0000-0007-000000000002', 1, 99999),
    ('00000000-0000-0000-0012-000000000002', '00000000-0000-0000-0011-000000000001', '00000000-0000-0000-0007-000000000004', 1, 57999),
    ('00000000-0000-0000-0012-000000000003', '00000000-0000-0000-0011-000000000001', '00000000-0000-0000-0007-000000000006', 1, 17999),
    ('00000000-0000-0000-0012-000000000004', '00000000-0000-0000-0011-000000000001', '00000000-0000-0000-0007-000000000007', 2, 21999);

INSERT INTO order_status_history (id, order_id, status, changed_by_user_id, notes, changed_at) VALUES
    ('00000000-0000-0000-0013-000000000001', '00000000-0000-0000-0011-000000000001', 'PendingPayment',   '00000000-0000-0000-0004-000000000003', 'Order placed',                               NOW() - INTERVAL '7 days'),
    ('00000000-0000-0000-0013-000000000002', '00000000-0000-0000-0011-000000000001', 'PaymentConfirmed', '00000000-0000-0000-0004-000000000003', 'Payment confirmed via credit card',          NOW() - INTERVAL '7 days' + INTERVAL '10 minutes'),
    ('00000000-0000-0000-0013-000000000003', '00000000-0000-0000-0011-000000000001', 'Processing',       '00000000-0000-0000-0004-000000000003', 'Order being prepared',                       NOW() - INTERVAL '6 days'),
    ('00000000-0000-0000-0013-000000000004', '00000000-0000-0000-0011-000000000001', 'Preparing',        '00000000-0000-0000-0004-000000000003', 'Items packed',                               NOW() - INTERVAL '5 days'),
    ('00000000-0000-0000-0013-000000000005', '00000000-0000-0000-0011-000000000001', 'Shipped',          '00000000-0000-0000-0004-000000000003', 'Shipped via FedEx, tracking: FX123456789',  NOW() - INTERVAL '4 days'),
    ('00000000-0000-0000-0013-000000000006', '00000000-0000-0000-0011-000000000001', 'Delivered',        '00000000-0000-0000-0004-000000000003', 'Delivered successfully',                     NOW() - INTERVAL '1 day');
