# Project Overview — Custom PC Parts E-Commerce Platform

**Version:** 1.0  
**Last Updated:** March 3, 2026  
**Status:** In Development

---

## What We're Building

An advanced e-commerce platform for purchasing computer hardware components for custom PC builds. Users can browse an extensive catalog of PC parts, use advanced search and compatibility tools, add items to a persistent cart, place orders with mock payment, and track order status. The platform supports multiple admin roles for managing products, orders, users, and provides automated email notifications.

---

## Business Goals

1. **Enable Informed PC Building:** Provide advanced tools (comparison, compatibility checking) to help users select the right components
2. **Streamline Order Management:** Clear order tracking with detailed status updates
3. **Flexible Administration:** Support multiple admin roles with different permission levels
4. **Inventory Control:** Maintain accurate stock levels with payment-based reservation
5. **Customer Communication:** Automated email notifications for key order milestones

---

## User Types & Access

### Anonymous Users (Guests)
- Browse all products freely
- Use search, filters, and advanced tools
- View product details and specifications
- **Cannot:** Add to cart or place orders

### Authenticated Customers
- All guest capabilities
- Persistent shopping cart across sessions
- Place and track orders
- View order history
- Manage profile and shipping addresses
- Cancel unpaid orders

### Staff
**Limited admin access for operational tasks**
- View orders assigned to them
- Update order status (within their scope)
- View product inventory
- **Cannot:** Create/delete products, manage users, access analytics

### Manager
**Elevated permissions for day-to-day management**
- All Staff capabilities
- Create and update products
- Manage inventory
- View all orders and update any order status
- Assign orders to staff
- **Cannot:** Delete products with order history, manage admin users, configure system settings

### Super Admin
**Full system access**
- All Manager capabilities
- Delete products (with safeguards)
- Manage all users (create/edit/delete admin accounts)
- Configure system settings
- Access to all future analytics features

---

## Core Business Entities

### Product
A computer hardware component available for purchase.

**Key Attributes:**
- Name and description
- SKU (Stock Keeping Unit) - unique identifier
- Category (see categories list below)
- Price (stored in smallest currency unit)
- Stock quantity
- Brand and model
- Multiple images (3-5 per product)
- Detailed specifications (technical details vary by category)
- Active/Inactive status

**Business Rules:**
- Products cannot be purchased if out of stock
- Price must be non-negative
- SKU must be unique across all products
- At least one image required
- Stock reserved only after payment confirmation
- Inactive products not shown to customers but remain in system

---

### Category

**Full PC Component Catalog:**

**Core Components:**
- Processors (CPUs)
- Graphics Cards (GPUs)
- Memory (RAM)
- Storage (SSDs, HDDs, M.2 Drives)
- Motherboards
- Power Supplies (PSUs)

**Cooling & Cases:**
- PC Cases
- CPU Coolers (Air & Liquid)
- Case Fans
- Thermal Paste

**Peripherals:**
- Monitors
- Keyboards
- Mice
- Headsets
- Webcams

**Accessories & Parts:**
- Cables (SATA, PCIe, Power, etc.)
- RGB Lighting
- Fan Controllers
- Tools & Kits
- Cable Management

**Business Rules:**
- Products must belong to one category
- Categories are system-defined (not user-created)
- Each category may have specific specification fields

---

### Cart (Shopping Cart)
A temporary collection of products a user intends to purchase.

**Key Attributes:**
- List of items (product + quantity)
- Cart total (calculated)
- Owner (authenticated user or anonymous session)

**Business Rules:**
- **Authenticated users:** Cart persists in database across sessions
- **Anonymous users:** Cart stored in session (cleared on browser close)
- Cart shows real-time stock availability warnings
- Cart does NOT reserve stock (stock reserved on payment)
- Cart can contain items from any category

---

### Order
A customer's purchase request containing one or more products.

**Key Attributes:**
- Order number (unique, auto-generated)
- Customer information (user reference)
- Order date
- Status (see order lifecycle below)
- Order items (products + quantities + prices at purchase time)
- Total amount (calculated)
- Shipping address
- Payment status
- Status transition history (timestamp each change)

**Business Rules:**
- Orders can only be placed by authenticated users
- Stock is reserved AFTER payment confirmation
- Order captures product prices at time of purchase (price changes don't affect existing orders)
- Order cannot be modified after placement (only cancelled)
- Cancelled orders restore stock if it was reserved

---

### User
A person who can browse products, make purchases, or administer the platform.

**Key Attributes:**
- Email (unique identifier)
- Password (hashed)
- Profile information (name, phone)
- Shipping addresses (multiple allowed, one default)
- Role (Customer, Staff, Manager, Super Admin)
- Registration date
- Account status (Active, Suspended)

**Business Rules:**
- Email must be unique and valid format
- Password minimum 8 characters
- Customers can view only their own orders
- Admins can view orders based on role permissions
- Users can have multiple saved shipping addresses

---

## Order Lifecycle & Status Management

### Order Statuses (Detailed)

1. **Pending Payment** → Order created, awaiting payment confirmation
2. **Payment Confirmed** → Payment successful, stock now reserved
3. **Processing** → Order being prepared for shipment
4. **Preparing** → Items being picked and packaged
5. **Ready to Ship** → Package ready, awaiting carrier pickup
6. **Shipped** → Order dispatched with carrier
7. **In Transit** → Package in delivery network
8. **Out for Delivery** → Package on delivery vehicle
9. **Delivered** → Customer received package
10. **Cancelled** → Order cancelled (stock restored if payment was confirmed)

### Status Transitions

**Automatic Transitions (v1.0 - Synchronous):**
- Mock payment success → Pending Payment to Payment Confirmed (stock reserved here)
- Mock payment failure → Order cancelled

**Manual Transitions (Admin-initiated):**
- All other status changes updated by admin staff

**Future (v2.0 - Queue-based Async):**
- Status changes published as events to message queue
- Background workers process status transitions
- Email notifications triggered by queue events
- Failed transitions automatically retried

---

## Core Features & User Stories

### 1. Product Browsing & Search
**As a customer, I want to easily find products that match my needs.**

**Acceptance Criteria:**
- Browse products by category
- Paginated product lists (20 items per page)
- Search by product name, SKU, or brand
- Filter by:
  - Category
  - Price range (min/max)
  - Brand
  - In stock / Out of stock
  - Specifications (varies by category)
- Sort by:
  - Price (low to high, high to low)
  - Name (A-Z, Z-A)
  - Newest first
  - Most popular
- Display shows: image, name, price, stock status
- "Out of Stock" badge visible on unavailable items

---

### 2. Advanced Product Tools
**As a customer, I want tools to help me make informed decisions.**

**Acceptance Criteria:**

**Product Comparison:**
- Select 2-4 products from same category
- View side-by-side comparison table
- Highlight differences in specifications
- Compare prices
- Show stock availability for each

**Compatibility Checker:**
- For key components (CPU + Motherboard, PSU wattage calculator, RAM compatibility)
- Warn user if selected items may not be compatible
- Suggest compatible alternatives
- Check if PSU wattage is sufficient for selected components

**Saved Filters:**
- Authenticated users can save commonly-used filter combinations
- Quick-apply saved filters
- Name and manage saved filters

---

### 3. Product Details
**As a customer, I want to view comprehensive product information.**

**Acceptance Criteria:**
- Display full product specifications (category-specific fields)
- Image gallery (3-5 images, click to enlarge)
- Brand and model information
- Current price prominently displayed
- Stock availability indicator
- "Add to Cart" button (disabled if out of stock)
- Product category breadcrumb
- Related products suggestions (same category)

---

### 4. Shopping Cart
**As a customer, I want to collect items before purchasing.**

**Acceptance Criteria:**
- Add items to cart from product detail page
- Update item quantities in cart
- Remove items from cart
- View cart summary:
  - Item thumbnails
  - Quantities
  - Individual prices
  - Subtotal
  - Estimated total
- Real-time stock warnings if item becomes unavailable
- Cart persists for authenticated users (database-backed)
- Cart is session-based for anonymous users
- "Proceed to Checkout" disabled if any item out of stock

---

### 5. Checkout & Order Placement
**As a customer, I want to complete my purchase securely.**

**Acceptance Criteria:**
- Review order summary (all items, quantities, prices)
- Select or enter shipping address
- Mock payment interface:
  - Test card numbers for success/failure scenarios
  - Simulate payment processing (2-3 second delay)
  - Show success/failure feedback
- On payment success:
  - Order created with "Payment Confirmed" status
  - Stock reserved immediately
  - Order confirmation email sent
  - Redirect to order confirmation page with order number
- On payment failure:
  - Show error message
  - Allow retry or return to cart
  - No stock reserved
- Cannot place order if:
  - Cart is empty
  - Any item out of stock
  - No shipping address provided

---

### 6. Order Tracking
**As a customer, I want to track my orders.**

**Acceptance Criteria:**
- View list of all my orders (most recent first)
- See order summary for each:
  - Order number
  - Order date
  - Current status
  - Total amount
  - Quick view of items (count + thumbnails)
- Click order to view full details:
  - Complete item list with quantities and prices
  - Shipping address
  - Status history (all transitions with timestamps)
  - Order total breakdown
- Cancel button shown only for "Pending Payment" orders
- Order cancellation:
  - Confirmation dialog required
  - Order status → Cancelled
  - Stock restored (if payment was confirmed)
  - User sees cancellation confirmation

---

### 7. Email Notifications
**As a customer, I want to be informed about my orders.**

**Email Triggers (v1.0):**

**Order Confirmation Email** (sent immediately after payment confirmed):
- Order number
- Order items with quantities and prices
- Shipping address
- Order total
- Estimated delivery timeframe
- Link to track order

**Order Shipped Email** (sent when status → Shipped):
- Order number
- Shipping date
- Carrier name (if available)
- Tracking number (mock/placeholder for v1)
- Estimated delivery date
- Link to track order

**Email Content Format:**
- HTML email with branding
- Clear, readable layout
- Mobile-responsive
- Unsubscribe option (for marketing, not transactional emails)

---

### 8. Product Management (Admin)
**As an admin, I want to manage the product catalog.**

**Acceptance Criteria:**

**Manager & Super Admin Capabilities:**
- Create new products:
  - Enter all required fields
  - Upload 3-5 images
  - Set category and specifications
  - Set initial stock quantity
  - Set active/inactive status
- Update existing products:
  - Edit any field
  - Add/remove/reorder images
  - Update stock quantity
  - Toggle active/inactive
- Search and filter products:
  - Same filters as customer view
  - Additional filter: Active/Inactive
  - View all products including inactive
- Bulk operations:
  - Bulk price updates
  - Bulk stock updates
  - Bulk active/inactive toggle

**Super Admin Only:**
- Delete products (with safeguards):
  - Cannot delete if product has order history
  - Confirmation dialog with warning
  - Permanently removes from system

---

### 9. Order Management (Admin)
**As an admin, I want to manage customer orders.**

**Acceptance Criteria:**

**Staff Capabilities:**
- View orders assigned to them
- Update status of assigned orders (within allowed transitions)
- View customer shipping address
- Cannot reassign or cancel orders

**Manager Capabilities:**
- View all orders
- Filter orders by:
  - Status
  - Date range
  - Customer email
  - Order number
- Update any order status (manual transitions)
- Assign orders to staff members
- Cancel orders (with confirmation):
  - Stock restored if payment confirmed
  - Customer notified
  - Cannot cancel if already shipped
- View complete order details:
  - All items with prices at purchase time
  - Customer information
  - Status history
  - Payment status

**Super Admin Capabilities:**
- All Manager capabilities
- Override status restrictions (emergency use only)
- View order statistics

---

### 10. User Management (Admin)
**As a Super Admin, I want to manage system users.**

**Acceptance Criteria:**
- View all users (customers and admins)
- Filter/search users:
  - By email
  - By role
  - By registration date
  - By account status
- View user details:
  - Profile information
  - Order history
  - Account status
  - Role
- Edit user information:
  - Update profile fields
  - Change role
  - Suspend/activate account
- Create admin accounts:
  - Set role (Staff, Manager, Super Admin)
  - Send activation email
- Delete users (with safeguards):
  - Cannot delete users with order history
  - Confirmation required

**Managers:**
- Can view customer information
- Cannot create/edit/delete admin accounts

---

### 11. User Authentication & Registration
**As a user, I want secure account management.**

**Acceptance Criteria:**

**Registration:**
- Email and password required
- Password requirements: min 8 characters
- Email uniqueness validation
- Secure password hashing
- Welcome email sent
- Automatically logged in after registration

**Login:**
- Email + password authentication
- JWT token issued on success
- Token expires after 24 hours
- "Remember me" extends token to 30 days
- Failed login attempts tracked (rate limiting)

**Password Reset:**
- "Forgot Password" link on login
- Enter email, receive reset link
- Token expires after 1 hour
- Set new password
- All sessions invalidated after password change

---

## Business Rules Summary

### Stock Management
- Stock is **reserved ONLY after payment confirmation**
- Cart does NOT reserve stock (allows browsing without blocking inventory)
- Stock reservations are **immediately deducted** from available inventory
- Cancelled orders **restore** reserved stock
- Products with zero stock **cannot be added to orders** (cart allows it with warning)
- Stock levels **visible** to customers before purchase

### Order Processing
- Orders can only be placed by **authenticated users**
- Order total calculated at **order placement time** using current product prices
- Orders cannot be **modified** after placement (only cancelled)
- Order status transitions follow **defined sequence**
- Status changes are **logged** with timestamps
- Customers can cancel only **unpaid orders**
- Admins can cancel orders up to **"Ready to Ship"** status
- Orders cannot be cancelled once **shipped**

### Pricing
- Prices stored in **smallest currency unit** (cents)
- Order totals calculated from **current product prices at order time**
- Price changes to products **do not affect existing orders**
- Order items store **snapshot of price at purchase**

### User Permissions

**Anonymous Users:**
- Browse all products
- Use search and advanced tools
- View product details
- **Cannot** add to cart or checkout

**Authenticated Customers:**
- All anonymous capabilities
- Persistent cart
- Place orders
- View own order history
- Cancel own unpaid orders

**Staff:**
- View assigned orders
- Update status on assigned orders
- No product management
- No user management

**Manager:**
- All Staff capabilities
- Full product management (create, update)
- View and manage all orders
- Assign orders to staff
- Cannot delete products with history
- Cannot manage admin users

**Super Admin:**
- All Manager capabilities
- Delete products (with safeguards)
- Manage all users including admins
- System configuration access

---

## Data Constraints

### Product
- SKU: Required, unique, max 100 characters, alphanumeric
- Name: Required, max 255 characters
- Description: Optional, max 2000 characters
- Price: Required, non-negative decimal (2 decimal places)
- Stock: Required, non-negative integer
- Category: Required, must exist in predefined categories
- Images: 1-5 images required, max 5MB per image, formats: JPG, PNG, WebP
- Brand: Required, max 100 characters
- Active: Boolean, default true

### Order
- Order number: Auto-generated, unique, format: ORD-YYYYMMDD-XXXXX
- Status: Must be one of the defined statuses
- Items: At least one item required
- Total: Calculated, must match sum of (item.price × item.quantity)
- Shipping address: Required
- Customer: Required, must reference existing user

### User
- Email: Required, unique, valid email format, max 255 characters
- Password: Required when stored, min 8 characters (hashed in DB)
- Name: Required, max 255 characters
- Phone: Optional, valid phone number format
- Role: Required, one of: Customer, Staff, Manager, SuperAdmin
- Account Status: Active or Suspended

### Cart
- Item quantity: Must be positive integer
- Cannot exceed available stock (warning shown, not blocked)
- Cart total recalculated on any change

---

## Edge Cases & Error Scenarios

### Stock Management
- **Concurrent purchases:** Two users try to buy the last item simultaneously
  - **Resolution:** Both can add to cart, first to complete payment wins, second payment fails with "out of stock" error

- **Stock depleted between cart and checkout:** Item in stock when added to cart, sold out before payment
  - **Resolution:** Payment fails with specific error, item removed from cart, user notified

### Order Placement
- **Price changed between cart and checkout:** Product price increased while in cart
  - **Resolution:** Show updated cart total before payment, require user confirmation

- **Payment timeout:** User abandons checkout mid-payment
  - **Resolution:** Order not created, no stock reserved, cart remains intact

- **Payment gateway error:** Mock payment service fails
  - **Resolution:** Show error message, allow retry, order not created

### Order Cancellation
- **Customer tries to cancel shipped order:** Order status already "Shipped"
  - **Resolution:** Cancel button not shown, error if attempted via API

- **Admin cancels order with confirmed payment:** Need to restore stock
  - **Resolution:** Stock automatically restored, customer notified via email

### Email Notifications
- **Email send failure:** Order placed successfully but email service unavailable
  - **Resolution (v1):** Log error, show warning to admin, manual notification required
  - **Resolution (v2 with queue):** Email queued for retry, automatic retry up to 3 times

### Admin Role Conflicts
- **Manager tries to delete product with order history**
  - **Resolution:** Action blocked, error message explaining reason

- **Staff tries to update order not assigned to them**
  - **Resolution:** 403 Forbidden, error message

### Product Management
- **Admin updates stock to negative value**
  - **Resolution:** Validation error, minimum value is 0

- **Admin deactivates product that's in active carts**
  - **Resolution:** Product hidden from browse/search, but remains in carts with warning

---

## Success Metrics (Academic Delivery)

### Functional Completeness
- ✅ All product catalog features working
- ✅ Advanced search tools functional
- ✅ Cart persistence for authenticated users
- ✅ Complete order placement flow
- ✅ Mock payment integration working
- ✅ Email notifications delivered
- ✅ Admin product management
- ✅ Admin order management
- ✅ Role-based access control
- ✅ All API endpoints documented (Swagger)
- ✅ Integration tests cover main flows

### Customer Experience
- User can browse and find products
- Advanced tools assist decision-making
- Cart persists across sessions
- Order confirmation immediate
- Email notifications received

### Admin Experience
- Admins can manage products efficiently
- Order status updates are clear
- Role permissions properly enforced
- User management tools available

---

## Out of Scope (v1.0)

The following features are **explicitly NOT included** in v1.0:

### Not in Academic Delivery:
- ❌ Real payment processing (Stripe, PayPal)
- ❌ Analytics dashboard and reports
- ❌ Background job queue system (BullMQ/Kafka)
- ❌ Product reviews and ratings
- ❌ Wishlists / favorites
- ❌ Discount codes / promotions
- ❌ Shipping cost calculation
- ❌ Real carrier integration / tracking APIs
- ❌ Returns / refunds management
- ❌ Multi-currency support
- ❌ Internationalization (i18n)
- ❌ Advanced analytics
- ❌ Product recommendations engine
- ❌ Inventory low-stock alerts
- ❌ Mobile apps (iOS/Android)
- ❌ Real-time chat support
- ❌ Product bundles / packages
- ❌ Pre-order functionality
- ❌ Gift cards / store credit
- ❌ Social media integration

---

## Future Enhancements (v2.0+)

### High Priority (After Academic Delivery)
1. **Real Payment Gateway** - Stripe or PayPal integration
2. **Background Job Queue** - BullMQ or Kafka for async processing
3. **Analytics Dashboard** - Sales trends, popular products, revenue reports
4. **Inventory Alerts** - Low stock notifications for admins
5. **Real Shipping Integration** - Carrier APIs, real tracking numbers

### Medium Priority
6. **Product Reviews & Ratings** - Customer feedback system
7. **Wishlist** - Save items for later
8. **Advanced Search Improvements** - AI-powered suggestions, natural language search
9. **Email Campaign System** - Marketing emails, abandoned cart recovery
10. **Returns Management** - Process returns and refunds

### Lower Priority
11. **Discount System** - Coupon codes, promotions, sales
12. **Loyalty Program** - Reward points, member tiers
13. **Product Bundles** - Pre-configured PC builds
14. **Live Chat Support** - Customer service integration
15. **Mobile Apps** - Native iOS/Android experience

---

## Technical Contract

This overview defines **WHAT** the system does, not **HOW** it's built. Implementation details (technology stack, architecture, database schema, coding standards) are documented separately in technical specifications.

### Implementation Requirements

All features must comply with:
- ✅ API endpoints fully documented (Swagger/OpenAPI)
- ✅ Integration tests cover complete user flows (DTO → Service → Domain → Repository → DB)
- ✅ All edge cases handled with appropriate error messages
- ✅ User-facing errors provide clear, actionable guidance
- ✅ Data constraints enforced at application level
- ✅ Role-based access control on all admin endpoints
- ✅ All database changes tracked via migrations
- ✅ Bruno API collection entries for all endpoints
- ✅ DDD patterns followed (domain entities, explicit mapping)
- ✅ Stock reservation logic atomic and consistent

---

## Academic Deliverables Checklist

### 1st Delivery
- [ ] REST API implemented with all core endpoints
- [ ] Swagger documentation complete and hosted
- [ ] Backend code pushed to repository
- [ ] Test data seeded in database
- [ ] Video demonstration of API using Postman/Bruno
- [ ] All integration tests passing

### 2nd Delivery  
- [ ] Frontend Angular application complete
- [ ] All user stories implemented
- [ ] Role-based UI (customer vs admin views)
- [ ] Frontend code pushed to repository
- [ ] Oral defense prepared with:
  - Architecture explanation
  - Demo of complete user flows
  - Technology justification
  - Challenges and solutions

---

**This document serves as the contract between business requirements and technical implementation. Any changes to these requirements should be documented here first, before implementation begins.**

**Last Updated:** March 3, 2026  
**Approved By:** [Your Name]  
**Version:** 1.0 - Academic Delivery Specification