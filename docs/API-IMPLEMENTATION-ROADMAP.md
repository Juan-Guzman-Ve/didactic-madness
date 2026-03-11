# API Implementation Roadmap

**Project:** PC Parts E-Commerce Platform  
**Focus:** Backend API (NestJS + TypeORM + Supabase)  
**Last Updated:** March 9, 2026  
**Status:** Planning Phase

---

## Table of Contents

1. [Current Status](#current-status)
2. [Phase 1: Foundation & Infrastructure](#phase-1-foundation--infrastructure)
3. [Phase 2: Authentication & Authorization (RBAC)](#phase-2-authentication--authorization-rbac)
4. [Phase 3: Core Modules - Categories & Products](#phase-3-core-modules---categories--products)
5. [Phase 4: Shopping Cart](#phase-4-shopping-cart)
6. [Phase 5: Orders & Checkout](#phase-5-orders--checkout)
7. [Phase 6: Admin Features](#phase-6-admin-features)
8. [Phase 7: Testing & Documentation](#phase-7-testing--documentation)
9. [Phase 8: Deployment](#phase-8-deployment)

---

## Current Status

### ✅ Completed
- [x] Repository structure established
- [x] Database schema designed (migrations written in `/database/sql/migrations/`)
- [x] All domain entities created (`domain/entities/`)
- [x] All TypeORM entities created (`infra/database/entities/`)
- [x] All repositories created (User, Product, Category, Cart, Order, Address, Role, Policy)
- [x] BaseRepository pattern implemented with Clean Architecture
- [x] BaseService refactored to use `IRepository` interface
- [x] Database triggers removed (application-level timestamps via TypeORM)
- [x] Configuration centralized (`infra/config/schemas/`)

### 🚧 In Progress
- [ ] Service implementations (all show TODO comments)
- [ ] Controller implementations (exist but not wired to services)
- [ ] DTOs need to be created for most modules

### ❌ Not Started
- [ ] Authentication & JWT implementation
- [ ] Authorization guards & policy enforcement
- [ ] Business logic in domain entities
- [ ] Integration tests
- [ ] Bruno API collection
- [ ] Swagger documentation setup

---

## Phase 1: Foundation & Infrastructure

### 1.1 Database Setup ✅
**Priority:** 🔴 Critical  
**Estimated Time:** 2 hours

- [x] **1.1.1** Apply all migration files to Supabase
  - [x] Run `001-rbac.sql`
  - [x] Run `002-users.sql`
  - [x] Run `003-products.sql`
  - [x] Run `004-cart.sql`
  - [x] Run `005-orders.sql`
  - [x] Verify all tables created correctly
  
- [x] **1.1.2** Apply seed data
  - [x] Run `001-rbac.sql` (seed roles: Customer, Staff, Manager, SuperAdmin)
  - [x] Run `002-test-users.sql` (create test users for each role)
  - [x] Run `003-test-products.sql` (seed 20-30 products across categories)
  - [x] Verify seed data via Supabase dashboard

**Acceptance Criteria:** ✅ COMPLETE
- All 13 tables exist in Supabase
- Roles, policies, and role_policies tables populated
- 4 test users created (one per role)
- 20+ test products with images
- Categories table fully populated

---

### 1.2 Application Configuration
**Priority:** 🔴 Critical  
**Estimated Time:** 1 hour

- [x] **1.2.1** Configure TypeORM DataSource ✅
  - [x] Verify connection to Supabase in `infra/database/database.config.ts`
  - [x] Add all entity paths to DataSource
  - [x] Register `AuditSubscriber` in DatabaseModule
  - [x] Test connection on application startup
  - [x] **Created 33 functional tests - all passing**

**Acceptance Criteria:** ✅ COMPLETE
- Application starts without errors
- Database connection verified on startup
- All 13 entities registered with TypeORM
- AuditSubscriber registered and active
- Test suite validates all configuration (33 passing tests)

- [ ] **1.2.2** Setup global middleware & interceptors
  - [ ] Create `ResponseInterceptor` for Result pattern
  - [ ] Create global exception filter
  - [ ] Register `ValidationPipe` globally
  - [ ] Configure CORS for local development

- [ ] **1.2.3** Configure Swagger
  - [ ] Install `@nestjs/swagger`
  - [ ] Configure Swagger in `main.ts`
  - [ ] Add API metadata (title, description, version)
  - [ ] Verify Swagger UI at `/api/docs`

**Acceptance Criteria:**
- Application starts without errors
- Swagger UI accessible at `http://localhost:3000/api/docs`
- Database connection verified on startup
- CORS enabled for `http://localhost:4200`

---

### 1.3 DTO Creation
**Priority:** 🟡 High  
**Estimated Time:** 3 hours

Create DTOs for all modules with `class-validator` decorators:

- [ ] **1.3.1** Auth DTOs
  - [ ] `LoginDto` (email, password)
  - [ ] `RegisterDto` (email, password, firstName, lastName, phone?)
  - [ ] `AuthResponseDto` (token, user)
  
- [ ] **1.3.2** Category DTOs
  - [ ] `CreateCategoryDto` (name, description, slug)
  - [ ] `UpdateCategoryDto` (partial of CreateCategoryDto)
  - [ ] `CategoryResponseDto`
  
- [ ] **1.3.3** Product DTOs
  - [ ] `CreateProductDto` (sku, categoryId, name, description, brand, model?, price, stock, specifications?, status)
  - [ ] `UpdateProductDto` (partial of CreateProductDto)
  - [ ] `ProductResponseDto`
  - [ ] `ProductFilterDto` (search, categoryId, minPrice, maxPrice, brand, inStock, sort)
  
- [ ] **1.3.4** Cart DTOs
  - [ ] `AddToCartDto` (productId, quantity)
  - [ ] `UpdateCartItemDto` (quantity)
  - [ ] `CartResponseDto`
  
- [ ] **1.3.5** Order DTOs
  - [ ] `CreateOrderDto` (addressId)
  - [ ] `UpdateOrderStatusDto` (status, notes?)
  - [ ] `OrderResponseDto`
  - [ ] `OrderFilterDto` (status, dateFrom, dateTo, page, limit)

**Acceptance Criteria:**
- All DTOs have validation decorators (`@IsString()`, `@IsNumber()`, etc.)
- All DTOs have Swagger decorators (`@ApiProperty()`)
- Response DTOs match domain entity structure
- Filter DTOs have optional parameters

---

## Phase 2: Authentication & Authorization (RBAC)

### 2.1 JWT Setup
**Priority:** 🔴 Critical  
**Estimated Time:** 3 hours

- [ ] **2.1.1** Install dependencies
  ```bash
  npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
  npm install -D @types/passport-jwt @types/bcrypt
  ```

- [ ] **2.1.2** Create JWT configuration
  - [ ] Add JWT secrets to `.env` (`JWT_SECRET`, `JWT_EXPIRES_IN`)
  - [ ] Create `JwtConfigService` in `infra/config/schemas/jwt.config.ts`
  - [ ] Register in ConfigModule

- [ ] **2.1.3** Create JWT Strategy
  - [ ] Create `JwtStrategy` in `presentation/guards/jwt.strategy.ts`
  - [ ] Extract user from JWT payload
  - [ ] Validate user exists in database
  - [ ] Return user object for request

**Acceptance Criteria:**
- JWT secret loaded from environment
- Strategy validates JWT and attaches user to request
- Invalid tokens return 401 Unauthorized

---

### 2.2 Auth Service Implementation
**Priority:** 🔴 Critical  
**Estimated Time:** 4 hours

- [ ] **2.2.1** Implement `AuthService`
  - [ ] `register(dto: RegisterDto)` - hash password, create user, assign Customer role
  - [ ] `login(dto: LoginDto)` - validate credentials, generate JWT with user_id + role_id
  - [ ] `validateUser(email, password)` - check user exists, compare password hash
  - [ ] `hashPassword(password)` - bcrypt with salt rounds
  - [ ] `comparePasswords(plain, hash)` - bcrypt compare

- [ ] **2.2.2** Implement `AuthController`
  - [ ] `POST /auth/register` - calls `authService.register()`
  - [ ] `POST /auth/login` - calls `authService.login()`
  - [ ] Add `@Public()` decorator to both endpoints
  - [ ] Add Swagger documentation

**Acceptance Criteria:**
- Register creates user with hashed password
- Login returns JWT token
- Invalid credentials return 401
- Token includes user_id and role_id in payload

---

### 2.3 Authorization Guards
**Priority:** 🔴 Critical  
**Estimated Time:** 3 hours

- [ ] **2.3.1** Create `JwtAuthGuard`
  - [ ] Extend `AuthGuard('jwt')`
  - [ ] Check for `@Public()` metadata
  - [ ] Skip auth for public routes
  - [ ] Apply guard globally in `AppModule`

- [ ] **2.3.2** Create `PolicyGuard`
  - [ ] Extract `@RequirePolicy()` metadata
  - [ ] Get user's role from request
  - [ ] Query role's policies from `RoleRepository.getPoliciesForRole()`
  - [ ] Check if required policy exists
  - [ ] Return 403 Forbidden if missing

- [ ] **2.3.3** Create decorators
  - [ ] `@Public()` - mark routes as public
  - [ ] `@CurrentUser()` - extract user from request
  - [ ] `@RequirePolicy(resource:action)` - mark required policy

**Acceptance Criteria:**
- All routes require authentication by default
- Public routes skip authentication
- Policy-protected routes check user permissions
- 403 Forbidden for missing policies

---

### 2.4 Role & Policy Services
**Priority:** 🟡 High  
**Estimated Time:** 2 hours

- [ ] **2.4.1** Implement `RoleService` (admin only)
  - [ ] `findAll()` - list all roles
  - [ ] `findById(id)` - get single role
  - [ ] `create(dto)` - create new role
  - [ ] `update(id, dto)` - update role
  - [ ] `delete(id)` - delete role (check no users assigned)
  - [ ] `assignPolicy(roleId, policyId)` - add policy to role
  - [ ] `removePolicy(roleId, policyId)` - remove policy from role

- [ ] **2.4.2** Implement `PolicyService` (admin only)
  - [ ] `findAll()` - list all policies
  - [ ] `create(dto)` - create new policy
  - [ ] `update(id, dto)` - update policy
  - [ ] `delete(id)` - delete policy (check not assigned to roles)

**Acceptance Criteria:**
- SuperAdmin can manage roles and policies
- Roles can have multiple policies
- Cannot delete role with assigned users
- Cannot delete policy assigned to roles

---

## Phase 3: Core Modules - Categories & Products

### 3.1 Categories Module
**Priority:** 🟡 High  
**Estimated Time:** 2 hours

- [ ] **3.1.1** Implement `CategoriesService`
  - [ ] `findAll()` - list all categories
  - [ ] `findById(id)` - get single category
  - [ ] `findBySlug(slug)` - get by URL-friendly slug
  - [ ] `create(dto)` - Manager+ only
  - [ ] `update(id, dto)` - Manager+ only
  - [ ] `delete(id)` - SuperAdmin only, check for products

- [ ] **3.1.2** Implement `CategoriesController`
  - [ ] `GET /categories` - public
  - [ ] `GET /categories/:id` - public
  - [ ] `POST /categories` - requires `categories:create`
  - [ ] `PUT /categories/:id` - requires `categories:update`
  - [ ] `DELETE /categories/:id` - requires `categories:delete`
  - [ ] Add Swagger documentation

**Acceptance Criteria:**
- Public can view all categories
- Managers can create/update categories
- Cannot delete category with products
- Slug is unique and URL-safe

---

### 3.2 Products Module
**Priority:** 🔴 Critical  
**Estimated Time:** 6 hours

- [ ] **3.2.1** Product Domain Entity Business Logic
  - [ ] Add domain methods to `Product` entity:
    - [ ] `deactivate()` - set status to Inactive
    - [ ] `activate()` - set status to Active
    - [ ] `updateStock(quantity)` - set stock quantity
    - [ ] `reduceStock(quantity)` - decrease stock, throw if insufficient
    - [ ] `restoreStock(quantity)` - increase stock (for cancellations)
    - [ ] `isAvailable()` - check if Active and stock > 0

- [ ] **3.2.2** Implement `ProductsService`
  - [ ] `findAll(filterDto)` - paginated list with filters (search, category, price range, brand, stock)
  - [ ] `findById(id)` - get product with images
  - [ ] `findBySku(sku)` - get by SKU
  - [ ] `create(dto)` - Manager+ only, validate category exists
  - [ ] `update(id, dto)` - Manager+ only
  - [ ] `updateStock(id, quantity)` - Manager+ only, use domain method
  - [ ] `delete(id)` - SuperAdmin only, check not in orders
  - [ ] `search(query)` - full-text search on name, description, brand

- [ ] **3.2.3** Implement `ProductsController`
  - [ ] `GET /products` - public, with filters
  - [ ] `GET /products/:id` - public
  - [ ] `POST /products` - requires `products:create`
  - [ ] `PUT /products/:id` - requires `products:update`
  - [ ] `PATCH /products/:id/stock` - requires `products:update`
  - [ ] `DELETE /products/:id` - requires `products:delete`
  - [ ] Add Swagger documentation with filter examples

**Acceptance Criteria:**
- Products paginated (20 per page)
- Filters work: search, category, price range, brand, inStock
- Sort by: price, name, createdAt
- Stock validation prevents negative values
- Cannot delete products in orders

---

### 3.3 Product Images (Optional - Phase 6)
**Priority:** 🟢 Low  
**Estimated Time:** 3 hours

- [ ] **3.3.1** Setup Supabase Storage
  - [ ] Create `product-images` bucket in Supabase
  - [ ] Configure public access
  - [ ] Add bucket URL to environment config

- [ ] **3.3.2** Image upload endpoint
  - [ ] `POST /products/:id/images` - upload image, store URL in DB
  - [ ] `DELETE /products/:id/images/:imageId` - delete image
  - [ ] Validate: max 5 images per product, file type (jpg, png), size < 5MB

**Acceptance Criteria:**
- Managers can upload product images
- Images stored in Supabase Storage
- Public URLs saved in `product_images` table
- Max 5 images per product enforced

---

## Phase 4: Shopping Cart

### 4.1 Cart Module
**Priority:** 🔴 Critical  
**Estimated Time:** 4 hours

- [ ] **4.1.1** Cart Domain Entity Business Logic
  - [ ] Add methods to `Cart` entity:
    - [ ] `addItem(productId, quantity)` - add or increment
    - [ ] `updateItemQuantity(productId, quantity)` - update quantity
    - [ ] `removeItem(productId)` - remove item
    - [ ] `clear()` - remove all items
    - [ ] `calculateTotal()` - sum all items (price × quantity)

- [ ] **4.1.2** Implement `CartService`
  - [ ] `getOrCreateCart(userId)` - get user's cart or create new one
  - [ ] `addItem(userId, dto)` - add product to cart, validate stock
  - [ ] `updateItemQuantity(userId, itemId, quantity)` - update quantity, validate stock
  - [ ] `removeItem(userId, itemId)` - remove item
  - [ ] `clearCart(userId)` - clear all items
  - [ ] `getCartWithDetails(userId)` - cart with products populated

- [ ] **4.1.3** Implement `CartController`
  - [ ] `GET /cart` - requires `cart:manage`
  - [ ] `POST /cart/items` - requires `cart:manage`
  - [ ] `PUT /cart/items/:itemId` - requires `cart:manage`
  - [ ] `DELETE /cart/items/:itemId` - requires `cart:manage`
  - [ ] `DELETE /cart` - requires `cart:manage`
  - [ ] Add Swagger documentation

**Acceptance Criteria:**
- One cart per authenticated user
- Cannot add more than available stock
- Cart persists across sessions
- Cart items auto-created/updated
- Out-of-stock warnings

---

## Phase 5: Orders & Checkout

### 5.1 Order Domain Logic
**Priority:** 🔴 Critical  
**Estimated Time:** 3 hours

- [ ] **5.1.1** Order Domain Entity Business Logic
  - [ ] Add methods to `Order` entity:
    - [ ] `create(userId, addressId, items, totalAmount)` - factory method
    - [ ] `confirmPayment()` - change status to PaymentConfirmed
    - [ ] `startProcessing()` - change to Processing
    - [ ] `markAsPreparing()` - change to Preparing
    - [ ] `markAsShipped()` - change to Shipped
    - [ ] `markAsDelivered()` - change to Delivered
    - [ ] `cancel(reason)` - change to Cancelled, restore stock
    - [ ] `canBeCancelled()` - check if status allows cancellation
    - [ ] `recordStatusChange(status, userId, notes)` - add to history

**Acceptance Criteria:**
- Order status transitions follow defined flow
- Status history tracked for audit
- Business rules enforced (e.g., can't ship cancelled order)

---

### 5.2 Orders Service
**Priority:** 🔴 Critical  
**Estimated Time:** 5 hours

- [ ] **5.2.1** Implement `OrdersService`
  - [ ] `createOrder(userId, addressId)` - convert cart to order
    - [ ] Validate cart not empty
    - [ ] Validate address belongs to user
    - [ ] Check product stock availability
    - [ ] Reserve stock (reduce product quantities)
    - [ ] Copy cart items to order_items with current prices
    - [ ] Calculate total
    - [ ] Generate unique order number
    - [ ] Clear cart after order creation
    - [ ] Create initial status history entry
  
  - [ ] `findUserOrders(userId, filterDto)` - paginated user orders
  - [ ] `findById(id)` - order details with items and history
  - [ ] `updateStatus(id, status, userId, notes)` - change order status
  - [ ] `cancelOrder(userId, orderId)` - cancel if PendingPayment
  - [ ] `confirmPayment(orderId)` - mock payment confirmation

- [ ] **5.2.2** Implement `OrdersController`
  - [ ] `POST /orders` - requires `orders:create`, creates from cart
  - [ ] `GET /orders` - requires `orders:read`, user's orders
  - [ ] `GET /orders/:id` - requires `orders:read`
  - [ ] `PATCH /orders/:id/status` - requires `orders:update`
  - [ ] `DELETE /orders/:id` - requires `orders:cancel`
  - [ ] `GET /orders/:id/history` - requires `orders:read`
  - [ ] Add Swagger documentation

**Acceptance Criteria:**
- Order created from cart
- Stock reserved on order creation
- Stock restored on cancellation
- Order number unique and human-readable (e.g., `ORD-2026-0001`)
- Cannot cancel orders beyond PendingPayment
- Price snapshot preserved in order_items

---

## Phase 6: Admin Features

### 6.1 Admin Orders Management
**Priority:** 🟡 High  
**Estimated Time:** 3 hours

- [ ] **6.1.1** Admin-specific order endpoints
  - [ ] `GET /admin/orders` - list all orders with filters (Staff+)
  - [ ] `PATCH /admin/orders/:id/assign` - assign to staff (Manager+)
  - [ ] Filter by: status, userId, dateRange
  - [ ] Sort by: createdAt, totalAmount

**Acceptance Criteria:**
- Staff can view all orders
- Managers can assign orders to staff
- Filters work correctly
- Pagination applied

---

### 6.2 Admin User Management
**Priority:** 🟡 High  
**Estimated Time:** 3 hours

- [ ] **6.2.1** Implement User management endpoints
  - [ ] `GET /admin/users` - list all users (Manager+)
  - [ ] `GET /admin/users/:id` - user details (Manager+)
  - [ ] `PATCH /admin/users/:id/role` - change role (SuperAdmin)
  - [ ] `PATCH /admin/users/:id/status` - suspend/activate (SuperAdmin)
  - [ ] `DELETE /admin/users/:id` - delete user (SuperAdmin, cannot delete if has orders)

**Acceptance Criteria:**
- Managers can view all users
- SuperAdmin can change roles
- SuperAdmin can suspend accounts
- Cannot delete users with orders

---

## Phase 7: Testing & Documentation

### 7.1 Integration Tests
**Priority:** 🔴 Critical  
**Estimated Time:** 8 hours

Create integration tests for each module following the service → repository → DB flow:

- [ ] **7.1.1** Auth tests
  - [ ] Register new user
  - [ ] Login with valid credentials
  - [ ] Login with invalid credentials
  - [ ] JWT validation

- [ ] **7.1.2** Product tests
  - [ ] Create product
  - [ ] List products with filters
  - [ ] Update stock
  - [ ] Stock reduction validation

- [ ] **7.1.3** Cart tests
  - [ ] Add item to cart
  - [ ] Update quantity
  - [ ] Remove item
  - [ ] Stock validation

- [ ] **7.1.4** Order tests
  - [ ] Create order from cart
  - [ ] Stock reservation
  - [ ] Cancel order
  - [ ] Stock restoration
  - [ ] Status transitions

**Acceptance Criteria:**
- All tests use `.env.test` database
- Tests clean up after themselves
- Tests follow Given-When-Then pattern
- 80%+ code coverage

---

### 7.2 Bruno API Collection
**Priority:** 🔴 Critical  
**Estimated Time:** 4 hours

Create `.bru` files for all endpoints:

- [ ] **7.2.1** Setup Bruno workspace
  - [ ] Configure environments (local, test, production)
  - [ ] Setup environment variables (baseUrl, token)

- [ ] **7.2.2** Create collections
  - [ ] Auth (register, login)
  - [ ] Categories (CRUD)
  - [ ] Products (CRUD + filters)
  - [ ] Cart (add, update, remove)
  - [ ] Orders (create, list, status update, cancel)
  - [ ] Admin (users, roles, policies, orders management)

**Acceptance Criteria:**
- All endpoints documented
- Examples include request/response
- Authentication flows work
- Variables used for tokens/IDs

---

### 7.3 Swagger Documentation
**Priority:** 🟡 High  
**Estimated Time:** 2 hours

- [ ] **7.3.1** Add Swagger decorators to all DTOs
  - [ ] `@ApiProperty()` on all DTO fields
  - [ ] Add descriptions and examples
  - [ ] Mark optional fields with `required: false`

- [ ] **7.3.2** Add Swagger decorators to controllers
  - [ ] `@ApiTags()` on controller classes
  - [ ] `@ApiBearerAuth()` on protected endpoints
  - [ ] `@ApiOperation()` with summaries
  - [ ] `@ApiResponse()` for success/error cases

**Acceptance Criteria:**
- Swagger UI shows all endpoints
- Lock icons on protected routes
- Request/response examples visible
- Try-it-out works for all endpoints

---

## Phase 8: Deployment

### 8.1 Environment Configuration
**Priority:** 🟡 High  
**Estimated Time:** 1 hour

- [ ] **8.1.1** Production environment setup
  - [ ] Create production `.env` on Vercel
  - [ ] Configure Supabase production connection string
  - [ ] Set JWT secrets
  - [ ] Configure CORS for production frontend URL

**Acceptance Criteria:**
- Environment variables set in Vercel
- Database connection works in production
- CORS allows frontend domain

---

### 8.2 Vercel Deployment
**Priority:** 🟡 High  
**Estimated Time:** 2 hours

- [ ] **8.2.1** Configure Vercel deployment
  - [ ] Create `vercel.json` with build config
  - [ ] Setup GitHub Actions for CI/CD
  - [ ] Deploy to Vercel
  - [ ] Test all endpoints in production

**Acceptance Criteria:**
- API deployed to Vercel
- All endpoints functional
- Swagger accessible
- Database connection works

---

## Next Steps After Completion

Once the API is complete:
1. ✅ **Video Demo** - Record demonstration of all endpoints using Bruno
2. 🎯 **Frontend Development** - Start Angular UI implementation
3. 📝 **Documentation** - Final review of code comments and docs
4. 🎓 **Academic Deliverable** - Prepare for oral defense

---

## Priority Legend

- 🔴 **Critical** - Must be completed for MVP
- 🟡 **High** - Important but not blocking
- 🟢 **Low** - Nice to have, can be deferred

---

## Estimated Total Time

- **Phase 1:** 6 hours
- **Phase 2:** 13 hours
- **Phase 3:** 10 hours
- **Phase 4:** 4 hours
- **Phase 5:** 8 hours
- **Phase 6:** 6 hours
- **Phase 7:** 14 hours
- **Phase 8:** 3 hours

**Total:** ~64 hours (~8 full work days)

---

## Tips for Success

1. **Work in Order** - Each phase builds on the previous
2. **Test Early** - Don't wait until the end to test
3. **Commit Often** - Small, focused commits
4. **Document as You Go** - Update Bruno collection after each endpoint
5. **Ask for Help** - Review technical architecture docs when stuck
6. **Focus on API First** - Frontend can wait until backend is solid
