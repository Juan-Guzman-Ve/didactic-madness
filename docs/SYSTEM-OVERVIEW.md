# System Overview — PC Parts E-Commerce Platform

**Version:** 1.0  
**Last Updated:** March 6, 2026  
**Status:** In Development

---

## Overview

E-commerce platform for purchasing PC hardware components. Customers can browse products, manage a shopping cart, place orders, and track order status. Administration features include product management, order processing, and user management with role-based access control.

---

## System Goals

1. Product catalog with search and filtering
2. Order processing with status tracking
3. Role-based access control (RBAC) for administration
4. Inventory management with stock tracking
5. Email notifications for order updates

---

## User Roles

### Customer
- Browse and search products
- Manage shopping cart
- Place and track orders
- Manage profile and addresses
- Cancel unpaid orders

### Staff
- View assigned orders
- Update order status (limited scope)
- View product inventory

### Manager
- All Staff capabilities
- Create and update products
- Manage inventory
- View and manage all orders

### SuperAdmin
- Full system access
- Manage users and accounts
- Manage roles and policies
- System configuration

**Authorization:** See [DATABASE-DESIGN.md](./DATABASE-DESIGN.md) for RBAC implementation details.

---

## Core Entities

### Product
- SKU, name, description
- Category, brand, model
- Price (stored in cents)
- Stock quantity
- Images (1-5 per product)
- Technical specifications (JSON)
- Status (Active/Inactive)

### Category
System-defined product categories:
- CPUs, GPUs, RAM, Storage, Motherboards, PSUs
- Cases, Coolers, Fans
- Monitors, Keyboards, Mice, Headsets
- Cables, RGB Lighting, Accessories

### Cart
- One cart per authenticated user
- Line items with quantities
- Session-based for anonymous users
- Does not reserve stock

### Order
- Unique order number
- User and shipping address references
- Order items with price snapshots
- Status and payment status
- Status change history

### User
- Email (unique), password (hashed)
- Name, phone
- Multiple shipping addresses
- Role assignment
- Status (Active/Suspended)

---

## Order Lifecycle

**Statuses:**
1. `PendingPayment` — Order created, awaiting payment
2. `PaymentConfirmed` — Payment successful, stock reserved
3. `Processing` — Order being prepared
4. `Preparing` — Items being packaged
5. `Shipped` — Order dispatched
6. `Delivered` — Order received by customer
7. `Cancelled` — Order cancelled (stock restored if reserved)

**Status Flow:**
```
PendingPayment → PaymentConfirmed → Processing → Preparing → Shipped → Delivered
                      ↓
                  Cancelled
```

---

## Features

### Product Browsing
- Browse by category
- Search by name, SKU, brand
- Filter by category, price range, brand, stock status
- Sort by price, name, date
- Pagination (20 items per page)

### Product Details
- Full specifications
- Image gallery
- Price and stock availability
- Add to cart

### Shopping Cart
- Add/update/remove items
- View cart summary with totals
- Stock availability warnings
- Persistent cart for authenticated users

### Checkout
- Review order items
- Select shipping address
- Mock payment processing
- Order confirmation with email

### Order Tracking
- View all orders
- Order details with status history
- Cancel unpaid orders

### Email Notifications
- Order confirmation (payment confirmed)
- Order shipped notification

### Admin - Product Management
- Create/update/delete products
- Upload product images
- Manage stock levels
- Set product status

### Admin - Order Management
- View all orders
- Update order status
- Filter by status, date, customer
- View order details and history

### Admin - User Management (SuperAdmin)
- Create/update/delete users
- Assign roles
- Suspend/activate accounts

---

## Out of Scope / Optional Features

The following features may be implemented after completing the mandatory requirements:

1. **Product Reviews and Ratings** — Customer product reviews with star ratings
2. **Wishlists** — Save products for later purchase
3. **Discounts / Promotions** — Coupon codes, percentage discounts, promotional pricing
4. **Low Stock Alerts** — Email notifications when inventory falls below threshold
5. **AI Product Recommendations** — Gemini API integration for personalized product suggestions based on customer selections, budget, and available inventory

---

## Technical Stack

See [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md) for implementation details.

**Backend:** NestJS + TypeORM + PostgreSQL (Supabase)  
**Frontend:** Angular 17+ + Angular Material  
**Auth:** JWT with RBAC  
**Storage:** Supabase Storage (product images)