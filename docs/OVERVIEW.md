# Business Requirements — Custom PC Parts E-Commerce Platform

**Version:** 1.0  
**Last Updated:** March 4, 2026  
**Related Documents:**  
- [Technical Architecture](./PLAN.md) — How we'll build it
- [Agent for Requirements](../.github/agents/product-owner.agent.md) — Use @product-owner for new features

---

## Table of Contents

1. [Product Vision](#product-vision)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Core Features](#core-features)
   - [Product Catalog](#product-catalog)
   - [Shopping Cart](#shopping-cart)
   - [Checkout & Orders](#checkout--orders)
   - [Admin Panel](#admin-panel)
   - [Search & Filters](#search--filters)
4. [User Flows](#user-flows)
5. [Business Rules](#business-rules)
6. [Acceptance Criteria](#acceptance-criteria)
7. [Edge Cases & Error Handling](#edge-cases--error-handling)
8. [MVP vs Nice-to-Have](#mvp-vs-nice-to-have)
9. [Assumptions & Constraints](#assumptions--constraints)

---

## Product Vision

**What we're building:**  
A web-based e-commerce platform for selling custom PC parts. Users can browse products by category, add them to a cart, and place orders. Staff manage inventory, process orders, and handle customer support.

**Who it's for:**  
- **Anonymous Users:** Browse products, view details, search
- **Customers:** All of the above + add to cart, checkout, view order history
- **Staff:** Manage inventory, fulfill orders
- **Managers:** Approve price changes, manage staff accounts
- **Super Admins:** Full system access, role management

**Key Differentiator:**  
Stock is reserved when payment is received (not when added to cart), preventing overselling while allowing multiple users to add the same item to their cart.

---

## User Roles & Permissions

| Role | Capabilities |
|------|-------------|
| **Anonymous** | Browse products, view details, search, filter by category |
| **Customer** | All anonymous + Add to cart, place orders, view order history, cancel orders (if pending) |
| **Staff** | All customer + Update product stock, mark orders as "Processing"/"Shipped" |
| **Manager** | All staff + Create/edit products, manage categories, update prices, manage staff accounts |
| **Super Admin** | All manager + Manage admin accounts, assign roles |

**Authentication:**  
- JWT-based authentication
- Role-based authorization on API endpoints
- Password hashing with bcrypt

---

## Core Features

### Product Catalog

**Requirements:**
- Products belong to a single category (e.g., CPU, GPU, RAM, Storage, Motherboard, PSU, Case)
- Each product has:
  - Name
  - Description (rich text or markdown)
  - Price (stored in cents to avoid floating-point errors)
  - Stock quantity (integer)
  - Category
  - Multiple images (at least 2, up to 5)
  - Status (active/inactive)
  - Timestamps (created, updated)

**Display:**
- Product list page (filterable by category, searchable)
- Product detail page (images, description, price, stock status, add to cart button)
- Stock indicator: "In Stock (X units)" or "Out of Stock"

**Admin Capabilities:**
- Create new products
- Edit product details
- Upload/manage product images (Supabase Storage → public URLs stored in DB)
- Activate/deactivate products (inactive = hidden from customers)
- Bulk update stock (CSV import if time allows)

**Acceptance Criteria:**
- Anonymous users can browse all active products
- Products with stock = 0 show "Out of Stock" (no add to cart button)
- Product images load from Supabase Storage URLs
- Managers can create/edit products via admin panel

---

### Shopping Cart

**Requirements:**
- Customers can add products to a cart
- Cart persists for authenticated users (stored in DB)
- Anonymous users see "Sign in to add to cart" message
- Cart items show: product name, price, quantity, subtotal
- Users can update quantity or remove items
- Cart displays total price

**Stock Reservation:**
- Stock is NOT reserved when added to cart
- Stock is reserved when payment is received (order status = "Payment Received")
- If stock insufficient at checkout, user sees error: "Product X only has Y units available"

**Acceptance Criteria:**
- Authenticated users can add products to cart
- Cart updates in real-time (quantity changes, removal)
- Cart persists across sessions
- Total price calculated correctly
- Anonymous users redirected to login when attempting to add to cart

---

### Checkout & Orders

**Requirements:**
- Customers proceed from cart to checkout
- Checkout collects:
  - Shipping address (single address for MVP)
  - Optional notes
- Mock payment: customer clicks "Pay" button → instant success
  - Payment gateway integration (Stripe/PayPal) is nice-to-have for v2
- Order created with status: "Payment Received"
- Stock decremented atomically (database transaction)
- Confirmation email sent to customer

**Order Status Flow:**
1. **Payment Received** (initial)
2. **Processing** (staff preparing shipment)
3. **Shipped** (order dispatched)
4. **Delivered** (optional tracking update)
5. **Cancelled** (if cancelled before shipment)

**Cancellation:**
- Customers can cancel orders if status = "Payment Received"
- Cancelling restores stock
- Staff/Managers can cancel at any status

**Order Management (Staff):**
- View all orders
- Filter by status
- Mark orders as "Processing" or "Shipped"
- View order details (items, quantities, customer info, shipping address)

**Acceptance Criteria:**
- Customers can complete checkout with mock payment
- Order status updates correctly
- Stock is decremented atomically on payment
- Customers receive confirmation email (order placed + order shipped)
- Customers can view order history
- Customers can cancel orders if status = "Payment Received"
- Staff can mark orders as "Processing"/"Shipped"

---

### Admin Panel

**Requirements:**
- Separate admin UI section (e.g., `/admin` route)
- Role-based access control (Staff, Manager, Super Admin)
- Manage products (CRUD)
- Manage categories (CRUD, Manager+)
- Manage orders (view, update status)
- Manage users (Manager+ can manage staff, Super Admin can manage all admins)

**Admin User Management:**
- Managers can create Staff accounts
- Super Admins can create Manager/Super Admin accounts
- Role assignment restricted by permission level
- Password reset functionality (v2: email-based reset)

**Acceptance Criteria:**
- Staff can access admin panel and manage stock/orders
- Managers can create/edit products and manage staff
- Super Admins can assign all roles
- Non-admin users redirected to login if accessing `/admin`

---

### Search & Filters

**Requirements:**
- **Search:** Text search across product name and description
- **Filters:**
  - Category (checkbox or dropdown)
  - Price range (min/max sliders)
  - Stock availability (In Stock / Out of Stock toggle)
- **Sorting:**
  - Price (low to high, high to low)
  - Name (A-Z, Z-A)
  - Newest first

**Implementation:**
- Full-text search on product name/description (PostgreSQL `ILIKE` or `tsvector`)
- Query params: `?search=gpu&category=Graphics%20Card&minPrice=20000&maxPrice=50000&inStockOnly=true&sortBy=price&order=asc`

**Acceptance Criteria:**
- Search returns relevant products
- Filters work independently and combinable
- Sorting updates product order correctly
- No results shows "No products found" empty state

---

## User Flows

### Anonymous User Flow
1. Visit homepage → see featured/all products
2. Click category → filtered product list
3. Click product → product detail page
4. Attempt to add to cart → redirected to login/register

### Customer Flow
1. Register/login
2. Browse products → add to cart
3. Update cart quantities
4. Proceed to checkout → enter shipping address → mock payment → order placed
5. Receive confirmation email
6. View order history → see order status
7. Cancel order if status = "Payment Received"

### Staff Flow
1. Login to admin panel
2. View orders → filter by status
3. Mark order as "Processing" → prepare shipment
4. Mark order as "Shipped" → customer receives email
5. Update product stock when new inventory arrives

### Manager Flow
1. All staff capabilities +
2. Create new product → upload images → set price/stock
3. Edit existing products
4. Manage categories
5. Create staff accounts

---

## Business Rules

### Stock Management
- Stock is an integer (0 or positive)
- Stock reservation happens on payment, not cart addition
- If stock insufficient at checkout, transaction fails (rollback)
- Cancelling an order restores stock

### Pricing
- Prices stored in cents (integer) to avoid floating-point errors
- Display prices formatted (e.g., $1,234.56)
- Managers can update prices (no approval flow for MVP)

### Orders
- Orders are immutable after creation (except status updates)
- Cancellation deadline: before "Processing" status for customers
- Staff can cancel at any status (with stock restoration)

### Images
- Products must have at least 1 image
- Maximum 5 images per product
- Images stored in Supabase Storage (or Azure Blob if time allows)
- Image URLs stored in `product_images` table

### Categories
- Products must belong to a category
- Deleting a category requires reassigning its products first (or cascade delete if empty)

---

## Acceptance Criteria

### Product Catalog
- ✅ Products display with images, price, stock status
- ✅ Inactive products hidden from customers
- ✅ Managers can create/edit/deactivate products

### Shopping Cart
- ✅ Authenticated users can add products to cart
- ✅ Cart persists across sessions
- ✅ Cart updates in real-time
- ✅ Anonymous users see "Sign in to add to cart"

### Checkout & Orders
- ✅ Customers can complete checkout with mock payment
- ✅ Stock decremented atomically on payment
- ✅ Order status updates correctly
- ✅ Customers receive confirmation email (placed + shipped)
- ✅ Customers can cancel orders if status = "Payment Received"

### Admin Panel
- ✅ Role-based access control enforced
- ✅ Staff can manage orders and stock
- ✅ Managers can manage products and staff accounts
- ✅ Super Admins can assign all roles

### Search & Filters
- ✅ Search returns relevant products
- ✅ Filters and sorting work as expected
- ✅ Empty state for no results

---

## Edge Cases & Error Handling

### Concurrent Cart Additions
- **Scenario:** Two users add the last unit of a product to their cart
- **Behavior:** Both can add to cart (stock not reserved), but first to complete checkout gets it; second sees "Insufficient stock" error at checkout

### Stock Changes During Cart Session
- **Scenario:** Product in cart goes out of stock before checkout
- **Behavior:** Checkout validation fails with "Product X is no longer available"

### Order Cancellation After Shipment
- **Scenario:** Customer tries to cancel "Shipped" order
- **Behavior:** Error: "Cannot cancel order that has been shipped"

### Image Upload Failures
- **Scenario:** Image upload to Supabase Storage fails
- **Behavior:** Product creation rolls back, user sees "Image upload failed"

### Invalid Payment (Future)
- **Scenario:** Payment gateway returns error (v2 with real payments)
- **Behavior:** Order not created, stock not decremented, user sees payment error

### Non-Admin Accessing Admin Panel
- **Scenario:** Customer navigates to `/admin`
- **Behavior:** Redirected to login or 403 Forbidden

---

## MVP vs Nice-to-Have

### MVP (Academic Delivery)
- ✅ Product catalog with categories
- ✅ Shopping cart (authenticated users only)
- ✅ Checkout with mock payment
- ✅ Order management (customer + staff)
- ✅ Admin panel (product/order/user CRUD)
- ✅ Search and filters (text search, category filter, price range)
- ✅ Emails: Order placed + Order shipped
- ✅ Role-based access control (4 roles)
- ✅ Product images (Supabase Storage)

### Nice-to-Have (Post-MVP)
- 🔲 Real payment gateway (Stripe/PayPal)
- 🔲 Email-based password reset
- 🔲 Order tracking (shipment carrier integration)
- 🔲 Product reviews and ratings
- 🔲 Wishlist functionality
- 🔲 Advanced analytics (sales reports, inventory reports)
- 🔲 Queue-based email processing (Bull + Redis)
- 🔲 Azure Key Vault for secrets
- 🔲 Azure Blob Storage for images (alternative to Supabase)
- 🔲 Multi-address support (shipping to different addresses)
- 🔲 Discount codes / promotions

---

## Assumptions & Constraints

### Assumptions
- Single currency (USD)
- Mexican Spanish language for frontend (if time allows, else English)
- Free shipping (no shipping cost calculation)
- No tax calculation (prices are final)
- Mock payment sufficient for academic delivery

### Constraints
- Academic deadline: Two deliveries (1st: API, 2nd: Frontend)
- Free tier: Supabase (PostgreSQL + Storage)
- Developer experience: Strong backend (.NET), less experience with frontend (Angular)
- Repository: Single repo, no monorepo tooling (Nx)

---

## Next Steps

1. **Review with Product Owner Agent** — Use `@product-owner` to clarify any ambiguous requirements
2. **Cross-reference Technical Plan** — Ensure all features have corresponding API endpoints and database schema in [PLAN.md](./PLAN.md)
3. **Create User Stories** — Break down features into implementable tasks (if using Agile workflow)
4. **Design Mockups** — Low-fidelity wireframes for key pages (optional but helpful)
5. **Begin Implementation** — Follow phased approach in PLAN.md

---

**For technical architecture and implementation details, see [PLAN.md](./PLAN.md).**  
**For coding standards and patterns, see [../.github/copilot-instructions.md](../.github/copilot-instructions.md).**

**Last Updated:** March 4, 2026  
**Version:** 1.0 - Business Requirements
