-- ============================================================================
-- Seed: 003 - Test Products and Orders
-- ============================================================================

-- Insert categories
INSERT INTO categories (id, name, description, slug) VALUES
    ('cat-gpu', 'Graphics Cards', 'High-performance GPUs for gaming and professional workloads', 'graphics-cards'),
    ('cat-cpu', 'Processors', 'CPUs from Intel and AMD for all computing needs', 'processors'),
    ('cat-mobo', 'Motherboards', 'Mainboards with various chipsets and form factors', 'motherboards'),
    ('cat-ram', 'Memory (RAM)', 'DDR4 and DDR5 memory modules', 'memory'),
    ('cat-storage', 'Storage', 'SSDs, HDDs, and NVMe drives for data storage', 'storage'),
    ('cat-psu', 'Power Supplies', 'PSUs with various wattage and efficiency ratings', 'power-supplies'),
    ('cat-case', 'Cases', 'PC cases in different sizes and styles', 'cases'),
    ('cat-cooling', 'Cooling', 'Air and liquid cooling solutions', 'cooling');

-- Insert products
INSERT INTO products (id, sku, category_id, name, description, brand, model, price, stock, specifications, status) VALUES
    ('prod-gpu-4090', 'GPU-NVIDIA-4090', 'cat-gpu',
    'NVIDIA GeForce RTX 4090',
    'The ultimate gaming GPU with 24GB GDDR6X memory and ray tracing capabilities',
    'NVIDIA', 'RTX 4090', 159999, 15,
    '{"memory": "24GB GDDR6X", "cores": "16384", "boost_clock": "2.52 GHz", "tdp": "450W", "ports": ["3x DisplayPort 1.4a", "1x HDMI 2.1"]}'::jsonb,
    'Active'),

    ('prod-gpu-7900xtx', 'GPU-AMD-7900XTX', 'cat-gpu',
    'AMD Radeon RX 7900 XTX',
    'High-end RDNA 3 architecture GPU with 24GB memory',
    'AMD', '7900 XTX', 99999, 20,
    '{"memory": "24GB GDDR6", "cores": "6144", "boost_clock": "2.5 GHz", "tdp": "355W", "ports": ["2x DisplayPort 2.1", "1x HDMI 2.1"]}'::jsonb,
    'Active'),

    ('prod-cpu-13900k', 'CPU-INTEL-13900K', 'cat-cpu',
    'Intel Core i9-13900K',
    '24-core processor with hybrid architecture',
    'Intel', 'Core i9-13900K', 58999, 30,
    '{"cores": "24", "threads": "32", "base_clock": "3.0 GHz", "boost_clock": "5.8 GHz", "socket": "LGA 1700", "tdp": "125W"}'::jsonb,
    'Active'),

    ('prod-cpu-7950x', 'CPU-AMD-7950X', 'cat-cpu',
    'AMD Ryzen 9 7950X',
    '16-core Zen 4 processor for high-performance computing',
    'AMD', 'Ryzen 9 7950X', 57999, 25,
    '{"cores": "16", "threads": "32", "base_clock": "4.5 GHz", "boost_clock": "5.7 GHz", "socket": "AM5", "tdp": "170W"}'::jsonb,
    'Active'),

    ('prod-mobo-z790', 'MB-ASUS-Z790', 'cat-mobo',
    'ASUS ROG Maximus Z790 Hero',
    'Premium Z790 motherboard with PCIe 5.0 and DDR5 support',
    'ASUS', 'ROG Maximus Z790 Hero', 62999, 12,
    '{"socket": "LGA 1700", "chipset": "Z790", "memory": "DDR5", "form_factor": "ATX", "pcie_slots": "4", "m2_slots": "5"}'::jsonb,
    'Active'),

    ('prod-ram-gskill', 'RAM-GSKILL-6000', 'cat-ram',
    'G.Skill Trident Z5 RGB 32GB (2x16GB)',
    'High-speed DDR5 memory kit with RGB lighting',
    'G.Skill', 'Trident Z5 RGB', 17999, 50,
    '{"capacity": "32GB", "type": "DDR5", "speed": "6000 MHz", "cas_latency": "CL30", "modules": "2x16GB", "voltage": "1.35V"}'::jsonb,
    'Active'),

    ('prod-ssd-990pro', 'SSD-SAMSUNG-990PRO', 'cat-storage',
    'Samsung 990 PRO 2TB NVMe SSD',
    'PCIe 4.0 NVMe SSD with exceptional read/write speeds',
    'Samsung', '990 PRO', 21999, 40,
    '{"capacity": "2TB", "interface": "NVMe PCIe 4.0 x4", "form_factor": "M.2 2280", "read_speed": "7450 MB/s", "write_speed": "6900 MB/s", "warranty": "5 years"}'::jsonb,
    'Active'),

    ('prod-psu-rm1000x', 'PSU-CORSAIR-RM1000X', 'cat-psu',
    'Corsair RM1000x 1000W 80+ Gold',
    'Fully modular ATX power supply with 80+ Gold efficiency',
    'Corsair', 'RM1000x', 18999, 35,
    '{"wattage": "1000W", "efficiency": "80+ Gold", "modular": "Fully Modular", "form_factor": "ATX", "warranty": "10 years"}'::jsonb,
    'Active'),

    ('prod-case-h9', 'CASE-NZXT-H9', 'cat-case',
    'NZXT H9 Flow Mid-Tower',
    'Modern mid-tower case with excellent airflow',
    'NZXT', 'H9 Flow', 14999, 25,
    '{"form_factor": "Mid-Tower", "max_gpu_length": "400mm", "max_cooler_height": "185mm", "drive_bays": "2x 3.5\", 4x 2.5\"", "front_io": "USB 3.2 Gen 2, USB-C", "tempered_glass": "Yes"}'::jsonb,
    'Active'),

    ('prod-cool-kraken', 'COOL-NZXT-KRAKEN', 'cat-cooling',
    'NZXT Kraken X63 280mm AIO',
    'All-in-one liquid cooler with RGB lighting',
    'NZXT', 'Kraken X63', 14999, 30,
    '{"radiator_size": "280mm", "fan_size": "2x 140mm", "pump_speed": "800-2800 RPM", "socket_support": "Intel: LGA 1700/1200, AMD: AM4/AM5", "rgb": "Yes"}'::jsonb,
    'Active');

-- Insert product images
INSERT INTO product_images (id, product_id, url, display_order) VALUES
    ('img-gpu-4090-1', 'prod-gpu-4090', 'https://picsum.photos/seed/GPU-NVIDIA-4090/800/800', 0),
    ('img-gpu-4090-2', 'prod-gpu-4090', 'https://picsum.photos/seed/GPU-NVIDIA-4090-2/800/800', 1),
    ('img-gpu-7900xtx-1', 'prod-gpu-7900xtx', 'https://picsum.photos/seed/GPU-AMD-7900XTX/800/800', 0),
    ('img-gpu-7900xtx-2', 'prod-gpu-7900xtx', 'https://picsum.photos/seed/GPU-AMD-7900XTX-2/800/800', 1),
    ('img-cpu-13900k-1', 'prod-cpu-13900k', 'https://picsum.photos/seed/CPU-INTEL-13900K/800/800', 0),
    ('img-cpu-13900k-2', 'prod-cpu-13900k', 'https://picsum.photos/seed/CPU-INTEL-13900K-2/800/800', 1),
    ('img-cpu-7950x-1', 'prod-cpu-7950x', 'https://picsum.photos/seed/CPU-AMD-7950X/800/800', 0),
    ('img-cpu-7950x-2', 'prod-cpu-7950x', 'https://picsum.photos/seed/CPU-AMD-7950X-2/800/800', 1),
    ('img-mobo-1', 'prod-mobo-z790', 'https://picsum.photos/seed/MB-ASUS-Z790/800/800', 0),
    ('img-ram-1', 'prod-ram-gskill', 'https://picsum.photos/seed/RAM-GSKILL-6000/800/800', 0),
    ('img-ssd-1', 'prod-ssd-990pro', 'https://picsum.photos/seed/SSD-SAMSUNG-990PRO/800/800', 0),
    ('img-psu-1', 'prod-psu-rm1000x', 'https://picsum.photos/seed/PSU-CORSAIR-RM1000X/800/800', 0),
    ('img-case-1', 'prod-case-h9', 'https://picsum.photos/seed/CASE-NZXT-H9/800/800', 0),
    ('img-cool-1', 'prod-cool-kraken', 'https://picsum.photos/seed/COOL-NZXT-KRAKEN/800/800', 0);

-- Insert test cart
INSERT INTO carts (id, user_id) VALUES
    ('cart-john', 'user-john');

INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES
    ('cartitem-john-1', 'cart-john', 'prod-gpu-4090', 2),
    ('cartitem-john-2', 'cart-john', 'prod-cpu-13900k', 1);

-- Insert test order
INSERT INTO orders (id, order_number, user_id, address_id, status, total_amount, payment_status) VALUES
    ('order-jane-1', 'ORD-2026-00001', 'user-jane', 'addr-jane-1', 'Delivered', 279998, 'Confirmed');

INSERT INTO order_items (id, order_id, product_id, quantity, price_at_purchase) VALUES
    ('orderitem-1', 'order-jane-1', 'prod-gpu-7900xtx', 1, 99999),
    ('orderitem-2', 'order-jane-1', 'prod-cpu-7950x', 1, 57999),
    ('orderitem-3', 'order-jane-1', 'prod-ram-gskill', 1, 17999),
    ('orderitem-4', 'order-jane-1', 'prod-ssd-990pro', 2, 21999);

INSERT INTO order_status_history (id, order_id, status, changed_by_user_id, notes, changed_at) VALUES
    ('history-1', 'order-jane-1', 'PendingPayment', 'user-staff', 'Order placed', NOW() - INTERVAL '7 days'),
    ('history-2', 'order-jane-1', 'PaymentConfirmed', 'user-staff', 'Payment confirmed via credit card', NOW() - INTERVAL '7 days' + INTERVAL '10 minutes'),
    ('history-3', 'order-jane-1', 'Processing', 'user-staff', 'Order being prepared', NOW() - INTERVAL '6 days'),
    ('history-4', 'order-jane-1', 'Preparing', 'user-staff', 'Items packed', NOW() - INTERVAL '5 days'),
    ('history-5', 'order-jane-1', 'Shipped', 'user-staff', 'Shipped via FedEx, tracking: FX123456789', NOW() - INTERVAL '4 days'),
    ('history-6', 'order-jane-1', 'Delivered', 'user-staff', 'Delivered successfully', NOW() - INTERVAL '1 day');
