# Technical Architecture — Custom PC Parts E-Commerce Platform

**Version:** 1.0  
**Last Updated:** March 4, 2026  
**Related Documents:**  
- [Business Requirements](./OVERVIEW.md) — What we're building
- [Coding Standards](../.github/copilot-instructions.md) — How we write code

---

## Table of Contents

1. [Overview](#overview)
2. [Academic Deliverables](#academic-deliverables)
3. [Technology Stack & Justifications](#technology-stack--justifications)
4. [.NET → NestJS Concept Map](#net--nestjs-concept-map)
5. [Repository Structure](#repository-structure)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Implementation Phases](#implementation-phases)
9. [Key Dependencies](#key-dependencies)
10. [Generic UI Components](#generic-ui-components)
11. [Environment Variables](#environment-variables)
12. [Testing Strategy](#testing-strategy)
13. [Technical Decisions & Status](#technical-decisions--status)
14. [Project Structure Summary](#project-structure-summary)
15. [Next Steps](#next-steps)

---

## Overview

This document defines the **technical architecture, stack decisions, and implementation patterns** for the custom PC parts e-commerce platform. For business requirements, user stories, and feature specifications, see [OVERVIEW.md](./OVERVIEW.md).

**Development Philosophy:** Leverage .NET/C# experience to transition smoothly to Node.js/TypeScript by mapping familiar patterns (DI, ORM, controllers, middleware) to their NestJS/TypeORM equivalents.

---

## Academic Deliverables

### 1st Delivery
- [ ] REST API endpoints implemented and functional
- [ ] Swagger documentation (hosted at `/api/docs`)
- [ ] Backend code pushed to repository
- [ ] Integration tests passing (test through service layer with real DB)
- [ ] Bruno API collection for all endpoints
- [ ] Test data seeded in database
- [ ] Demonstrative video of endpoints using Bruno/Postman

### 2nd Delivery
- [ ] Frontend Angular application complete
- [ ] All features from OVERVIEW.md implemented
- [ ] Frontend code pushed to repository
- [ ] E2E user flows functional
- [ ] Oral defense with architecture explanation and demo

---

## Technology Stack & Justifications

| Layer | Technology | Why |
|---|---|---|
| **API Framework** | NestJS (TypeScript) | Closest Node.js equivalent to ASP.NET Core — built-in DI container, decorators, modules, controllers, guards, interceptors, middleware. Maps 1:1 to the developer's existing mental model. |
| **ORM** | TypeORM | Closest equivalent to Entity Framework — entity class decorators, `Repository<T>`, generic repository pattern, migrations. Supports `column`, `relation`, and lifecycle hooks similar to `OnModelCreating`. |
| **Database** | Supabase (hosted PostgreSQL) | Managed Postgres with a free tier. The API connects via TypeORM using a direct connection string — no Supabase client SDK needed for data access. |
| **UI Framework** | Angular | The most structured and opinionated frontend framework; matches the developer's preference for organized, OOP-style code with DI, modules, and services — similar to how .NET structures application layers. |
| **Language** | TypeScript (both API and UI) | Provides type safety, interfaces, abstract classes, and decorator support — all familiar from C# and required by NestJS and Angular. |
| **Repo Structure** | Single repo, two top-level folders (`api/`, `ui/`) | Equivalent to a .NET solution file with multiple projects. No monorepo tooling (Nx) to keep initial complexity low. |
| **Auth** | NestJS-only JWT (`@nestjs/jwt` + `passport-jwt` + `bcrypt`) | Full auth implemented in the API: register, login, password hashing, JWT issuance and validation. Supabase is purely the database host. Keeps the auth flow fully under our control, identical to how you would build it in ASP.NET Core with `[Authorize]`. |
| **Image Storage** | Supabase Storage (primary) | Product images uploaded via API to a Supabase Storage bucket; the resulting public URL is stored on the `Product` entity. Simple, free tier included, no extra infra. |
| **Image Storage (optional)** | Azure Blob Storage | If time allows: replace or extend the storage service to upload to Azure Blob. The service is abstracted behind an `IStorageService` interface so the implementation can be swapped without touching controllers or business logic. |
| **UI Library** | Angular Material | Official Google component library. Strict design system, well-documented, large community. Appropriate for a structured data-driven store UI. |
| **Pagination** | `page` + `limit` query params | Offset-based pagination (`?page=1&limit=20`). Standard, simple to implement and test. Sufficient for this project's data volume. |
| **Testing (API)** | Jest + `@nestjs/testing` + real TypeORM DataSource | Two-level strategy: unit tests (mocked repos) and integration tests (real DB). See Testing Strategy section below. |
| **Validation** | `class-validator` + `class-transformer` + global `ValidationPipe` | Equivalent to Data Annotations + `ModelState` validation in ASP.NET. Applied globally in `main.ts`. |
| **API Docs** | `@nestjs/swagger` | Equivalent to Swashbuckle. Decorator-driven on controllers and DTOs (`@ApiProperty()`, `@ApiTags()`, etc.). |
| **Config** | `@nestjs/config` (`ConfigService`) | Equivalent to `IConfiguration` / `appsettings.json`. Reads `.env` and provides a typed config service via DI. |

---

## Optional Cloud Extensions (Azure)

These are **not required** for academic delivery but are planned if time allows, and reflect real-world production patterns.

| Feature | Service | Notes |
|---|---|---|
| **Secrets management** | Azure Key Vault | Replace `.env` secrets (DB password, JWT secret) with Key Vault references. Retrieved at startup via `@azure/keyvault-secrets` + managed identity or a service principal. Equivalent to ASP.NET Core's `AddAzureKeyVault()`. |
| **API hosting** | Azure App Service or Azure Container Apps | Deploy the NestJS API as a Docker container. `Dockerfile` added to `api/`. |
| **UI hosting** | Azure Static Web Apps | Deploy the built Angular app. Built-in CDN and custom domain support. |
| **CI/CD** | GitHub Actions | Workflows in `github/` — build, test, and deploy on push to `main`. |
| **Image Storage (alt)** | Azure Blob Storage | Alternative to Supabase Storage. Abstracted behind `IStorageService` so the swap is isolated to one file. |

---

## .NET → NestJS / TypeORM Concept Map

| .NET / Clean Architecture | Node.js Equivalent |
|---|---|
| `Program.cs` / `Startup.cs` | `main.ts` + `AppModule` |
| `IServiceCollection` + `.AddScoped()` | NestJS Module `providers: []` + `@Injectable()` |
| `appsettings.json` | `.env` + `ConfigService` |
| `DbContext` | TypeORM `DataSource` |
| EF Entity class + `IEntityTypeConfiguration` | `@Entity()` decorated class with column/relation decorators |
| `DbContext.OnModelCreating()` | TypeORM decorators on entity properties (`@Column`, `@ManyToOne`, etc.) |
| Generic `Repository<T>` | TypeORM built-in `Repository<T>` wrapped in a custom `BaseRepository<T>` |
| `dotnet ef migrations add` | `typeorm migration:generate` |
| `dotnet ef database update` | `typeorm migration:run` |
| Controller + Route attributes | `@Controller('route')` + `@Get()`, `@Post()`, `@Put()`, `@Delete()` |
| `IActionResult` / `ActionResult<T>` | Controller method return type / NestJS serialization via interceptor |
| `ActionFilter` / global exception handler | `ExceptionFilter` + `@Catch()` registered globally |
| Middleware | `NestMiddleware` implementing `use()` |
| `[Authorize]` / Policy | `@UseGuards(JwtAuthGuard)` or global guard |
| `[AllowAnonymous]` | `@Public()` custom decorator |
| DTO + Data Annotations | TS class + `class-validator` decorators (`@IsString()`, `@IsNumber()`, etc.) |
| AutoMapper | `class-transformer` (`plainToInstance()`, `@Expose()`, `@Exclude()`) |
| Application Layer Feature class / Handler | NestJS `Service` (`@Injectable()`) — one service per feature module |
| xUnit `[Fact]` + Moq `Mock<T>` | Jest `it()` + `jest.fn()` / `jest-mock-extended` |
| Swashbuckle / Swagger annotations | `@nestjs/swagger` decorators (`@ApiTags`, `@ApiProperty`, `@ApiBearerAuth`) |
| `FluentValidation` | `class-validator` + `ValidationPipe` |

---

## Repository Structure

```
didactic-madness/
├── api/                                  # NestJS application
│   ├── src/
│   │   ├── main.ts                       # Bootstrap: global pipes, filters, swagger, CORS
│   │   ├── app.module.ts                 # Root module — imports all feature modules
│   │   │
│   │   ├── config/                       # Typed config (wraps @nestjs/config)
│   │   │   └── database.config.ts
│   │   │
│   │   ├── database/                     # TypeORM setup + base classes
│   │   │   ├── database.module.ts        # TypeORM forRoot() wired to ConfigService
│   │   │   ├── base.entity.ts            # Abstract: id (uuid), createdAt, updatedAt
│   │   │   └── base.repository.ts        # Generic BaseRepository<T extends BaseEntity>
│   │   │
│   │   ├── common/                       # Cross-cutting concerns (no business logic)
│   │   │   ├── filters/
│   │   │   │   └── http-exception.filter.ts    # Global exception handler
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts           # Global JWT guard
│   │   │   ├── interceptors/
│   │   │   │   └── response-transform.interceptor.ts
│   │   │   ├── decorators/
│   │   │   │   ├── public.decorator.ts         # @Public() — skip auth
│   │   │   │   └── current-user.decorator.ts   # @CurrentUser()
│   │   │   └── pipes/
│   │   │       └── parse-uuid.pipe.ts
│   │   │
│   │   └── modules/                      # Feature modules (one per domain entity)
│   │       ├── auth/
│   │       │   ├── auth.module.ts
│   │       │   ├── auth.controller.ts    # POST /auth/login, POST /auth/register
│   │       │   ├── auth.service.ts
│   │       │   └── dto/
│   │       │       ├── login.dto.ts
│   │       │       └── register.dto.ts
│   │       │
│   │       ├── users/
│   │       │   ├── entities/user.entity.ts
│   │       │   ├── users.repository.ts
│   │       │   ├── users.service.ts
│   │       │   ├── users.controller.ts
│   │       │   ├── users.module.ts
│   │       │   └── dto/
│   │       │
│   │       ├── categories/
│   │       │   ├── entities/category.entity.ts
│   │       │   ├── categories.repository.ts
│   │       │   ├── categories.service.ts
│   │       │   ├── categories.controller.ts
│   │       │   ├── categories.module.ts
│   │       │   └── dto/
│   │       │
│   │       ├── products/
│   │       │   ├── entities/product.entity.ts
│   │       │   ├── products.repository.ts
│   │       │   ├── products.service.ts
│   │       │   ├── products.controller.ts
│   │       │   ├── products.module.ts
│   │       │   └── dto/
│   │       │       ├── create-product.dto.ts
│   │       │       └── update-product.dto.ts
│   │       │
│   │       ├── cart/
│   │       │   ├── entities/
│   │       │   │   ├── cart.entity.ts
│   │       │   │   └── cart-item.entity.ts
│   │       │   ├── cart.repository.ts
│   │       │   ├── cart.service.ts
│   │       │   ├── cart.controller.ts
│   │       │   ├── cart.module.ts
│   │       │   └── dto/
│   │       │
│   │       └── orders/
│   │           ├── entities/
│   │           │   ├── order.entity.ts
│   │           │   └── order-item.entity.ts
│   │           ├── orders.repository.ts
│   │           ├── orders.service.ts
│   │           ├── orders.controller.ts
│   │           ├── orders.module.ts
│   │           └── dto/
│   │
│   ├── migrations/                       # TypeORM generated migration files
│   ├── test/
│   │   ├── jest-integration.json         # Separate Jest config for integration tests
│   │   ├── setup.ts                      # Global test setup: spin up NestJS app module with real DB
│   │   └── modules/
│   │       ├── products.integration.spec.ts
│   │       ├── cart.integration.spec.ts
│   │       └── orders.integration.spec.ts
│   ├── .env                              # Local env vars (gitignored)
│   ├── .env.example                      # Committed env template
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── nest-cli.json
│   └── package.json
│
├── ui/                                   # Angular 17+ standalone application
│   ├── src/
│   │   ├── main.ts
│   │   ├── index.html
│   │   ├── styles.scss                   # Global Material 3 theme + layout utilities
│   │   │
│   │   └── app/
│   │       ├── app.ts                    # Root component with sidenav shell
│   │       ├── app.html                  # Material sidenav + toolbar layout
│   │       ├── app.scss                  # App shell styles
│   │       ├── app.config.ts             # Providers: router, animations, HTTP
│   │       ├── app.routes.ts             # Lazy-loaded routes
│   │       │
│   │       ├── shared/                   # Generic reusable UI components
│   │       │   └── components/
│   │       │       ├── button/
│   │       │       │   └── ui-button.component.ts        # UiButtonComponent: variant, loading, icon
│   │       │       ├── table/
│   │       │       │   └── ui-table.component.ts         # UiTableComponent<T>: sortable, paginated, generic columns
│   │       │       ├── input/
│   │       │       │   └── ui-input.component.ts         # UiInputComponent: works with FormControl, validation
│   │       │       ├── select/
│   │       │       │   └── ui-select.component.ts        # UiSelectComponent: typed options, binds to FormControl
│   │       │       ├── card/
│   │       │       │   └── ui-card.component.ts          # UiCardComponent: title, subtitle, image, actions slot
│   │       │       ├── dialog/
│   │       │       │   └── ui-dialog.component.ts        # UiDialogComponent: modal overlay with actions
│   │       │       ├── checkbox/
│   │       │       │   └── ui-checkbox.component.ts      # UiCheckboxComponent
│   │       │       ├── chip/
│   │       │       │   └── ui-chip.component.ts          # UiChipComponent: tags / badges
│   │       │       ├── spinner/
│   │       │       │   └── ui-spinner.component.ts       # UiSpinnerComponent: loading overlay
│   │       │       └── empty-state/
│   │       │           └── ui-empty-state.component.ts   # UiEmptyStateComponent: icon + message placeholder
│   │       │
│   │       ├── showcase/                 # Component showcase (visual testing during build phase)
│   │       │   ├── showcase.component.ts
│   │       │   ├── showcase.component.html
│   │       │   └── showcase.component.scss
│   │       │
│   │       └── features/                 # Feature modules (to be built in later phases)
│   │           ├── products/             # Browse & product detail
│   │           ├── cart/                 # Shopping cart
│   │           ├── orders/               # Order history & confirmation
│   │           └── auth/                 # Login / Register
│   │
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   └── .prettierrc
│
├── database/                             # SQL seed scripts, ERD, migration notes
├── tests/                                # Cross-cutting / integration test assets
├── github/                               # GitHub Actions workflows (CI/CD)
├── docs/
│   └── PLAN.md                           # This file
└── README.md
```

---

## Database Schema

**Note:** For business entity definitions and constraints, see [OVERVIEW.md](./OVERVIEW.md). This section focuses on technical implementation.

### Core Tables

```sql
-- users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'Customer',
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  account_status VARCHAR(50) NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  brand VARCHAR(100),
  specifications JSONB,
  active BOOLEAN DEFAULT true,
  category_id UUID NOT NULL REFERENCES categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- product_images table (1-5 per product)
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- carts table
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- cart_items table
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'Pending Payment',
  total DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- order_items table (snapshot prices)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- order_status_history table (audit trail)
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status VARCHAR(50),
  to_status VARCHAR(50) NOT NULL,
  changed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
```

---

## API Endpoints

**Note:** For feature requirements and acceptance criteria, see [OVERVIEW.md](./OVERVIEW.md). This section lists the technical API contract.

**Base URL:** `http://localhost:3000/api`  
**Documentation:** Swagger UI at `/api/docs`

### Authentication
| Method | Route | Description | Auth | Request | Response |
|---|---|---|---|---|---|
| POST | `/auth/register` | Create account | Public | `CreateUserDto` | `{ data: UserResponseDto }` |
| POST | `/auth/login` | Login, returns JWT | Public | `LoginDto` | `{ data: { token: string, user: UserResponseDto } }` |
| POST | `/auth/refresh` | Refresh JWT token | Public | `{ refreshToken: string }` | `{ data: { token: string } }` |
| POST | `/auth/forgot-password` | Request password reset | Public | `{ email: string }` | `{ data: { message: string } }` |
| POST | `/auth/reset-password` | Reset password | Public | `ResetPasswordDto` | `{ data: { message: string } }` |

### Categories
| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/categories` | List all categories | Public |
| GET | `/categories/:id` | Get one category | Public |
| POST | `/categories` | Create category | Manager+ |
| PUT | `/categories/:id` | Update category | Manager+ |
| DELETE | `/categories/:id` | Delete category | Super Admin |

### Products
| Method | Route | Description | Auth | Query Params |
|---|---|---|---|---|
| GET | `/products` | List products with filters | Public | `?page=1&limit=20&category=uuid&search=text&minPrice=0&maxPrice=999&brand=text&inStock=true&sort=price:asc` |
| GET | `/products/:id` | Get product details | Public | — |
| POST | `/products` | Create product | Manager+ | — |
| PUT | `/products/:id` | Update product | Manager+ | — |
| PATCH | `/products/:id/stock` | Update stock quantity | Manager+ | — |
| DELETE | `/products/:id` | Delete product (w/ safeguards) | Super Admin | — |
| POST | `/products/:id/images` | Upload product image | Manager+ | Multipart form |
| DELETE | `/products/:id/images/:imageId` **Cart**
| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/cart` | Get current user's cart | Customer |
| POST | `/cart/items` | Add item to cart | Customer |
| PUT | `/cart/items/:itemId` | Update quantity | Customer |
| DELETE | `/cart/items/:itemId` | Remove item | Customer |
| DELETE | `/cart` | Clear cart | Customer |

### Orders
| Method | Route | Description | Auth | Query Params |
|---|---|---|---|---|
| POST | `/orders` | Place order from cart | Customer | — |
| GET | `/orders` | List user's orders | Customer | `?page=1&limit=20` |
| GET | `/orders/:id` | Get order details | Customer/Staff+ | — |
| PATCH | `/orders/:id/status` | Update order status | Staff+ | — |
| DELETE | `/orders/:id` | Cancel order | Customer (unpaid), Manager+ (any) | — |
| GET | `/orders/:id/history` | Get status history | Customer/Staff+ | — |

### Admin - Orders
| Method | Route | Description | Auth | Query Params |
|---|---|---|---|---|
| GET | `/admin/orders` | List all orders | Staff+ | `?page=1&limit=20&status=Shipped&userId=uuid&dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD` |
| PATCH | `/admin/orders/:id/assign` | Assign order to staff | Manager+ | — |

### Admin - Users
| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/admin/users` | List all users | Manager+ |
| GET | `/admin/users/:id` | Get user details | Manager+ |
| PUT | `/admin/users/:id` | Update user | Super Admin |
| PATCH | `/admin/users/:id/role` | Change user role | Super Admin |
| PATCH | `/admin/users/:id/status` | Suspend/activate account | Super Admin |
| DELETE | `/admin/users/:id` | Delete user (w/ safeguards) | Super Admin |

### Admin - Advanced Search Tools
| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/products/compare` | Compare 2-4 products | Public |
| POST | `/products/compatibility-check` | Check component compatibility | Public |
| GET | `/users/:id/filters` | Get saved filters | Customer |
| POST | `/users/:id/filters` | Save filter | Customer |
| DELETE | `/users/:id/filters/:filterId` | Delete saved filter | Customer |

---

## Implementation Phases

**Note:** For feature-level acceptance criteria, see [OVERVIEW.md](./OVERVIEW.md). This plan focuses on technical buildout.

### Phase 1 — Project Bootstrap & Infrastructure
**Goal:** Establish foundation for both API and UI

**API:**
- Initialize NestJS project in `api/`
- Install dependencies (see Dependencies section)
- Configure TypeORM `DataSource` with Supabase connection
- Register global `ValidationPipe`, `HttpExceptionFilter`, Swagger
- Verify DB connection and create initial migration

**UI:**
- Initialize Angular 17+ standalone project in `ui/`
- Configure Angular Material 3
- Setup path aliases in `tsconfig.json`
- Create generic UI component library (see Generic Components section)
- Create showcase route for component testing

**Database:**
- Create `database/` folder for hand-written SQL migrations
- Write first migration with all tables (see Database Schema)
- Apply to Supabase via SQL editor
- Create TypeORM migration wrappers for local dev

---

### Phase 2 — Base Classes & Patterns (DDD Foundation)
**Goal:** Establish reusable patterns following DDD principles

**API:**
- `BaseEntity` abstract class (id, createdAt, updatedAt)
- `BaseRepository<T>` generic wrapper with common methods
- Domain entity example (User) with:
  - Private fields + public getters
  - Factory methods (`create`, `fromPersistence`)
  - Business logic methods
  - Mapping methods (`toPersistence`, `toResponseDto`)
- DTO mapping patterns established
- Custom error classes (`NotFoundError`, etc.)
- Global exception filter mapping domain errors to HTTP

**Testing Setup:**
- Jest configuration for unit tests
- Jest integration config with `.env.test`
- Example integration test following service → domain → repository → DB flow

---

### Phase 3 — Authentication & Authorization
**Goal:** Secure API with JWT and role-based access control

**Implementation Order:**
1. **Users Module** (domain entity, repository, service)
2. **Auth Module** (login, register, JWT strategy)
3. **JWT Guards** (`JwtAuthGuard` global, `RolesGuard`)
4. **Decorators** (`@Public()`, `@Roles()`, `@CurrentUser()`)
5. **Password Management** (forgot password, reset)
6. **Integration Tests** for auth flows

**Deliverables:**
- All routes protected by default (JWT required)
- Public routes marked with `@Public()`
- Role-based access: Customer, Staff, Manager, Super Admin
- Swagger shows lock icons on protected endpoints

---

### Phase 4 — Core Feature Modules
**Implementation Order:** Categories → Products → Cart → Orders

**Each Module Follows DDD Pattern:**
1. **Domain Entity** with business logic
2. **DTOs** (create, update, response) with validation
3. **Repository** extending `BaseRepository<T>`
4. **Service** with business logic, uses domain entities
5. **Controller** delegates to service, Swagger decorated
6. **Module** wires everything together
7. **Integration Tests** for complete flows
8. **Bruno Collection** entries for all endpoints

**Module-Specific Notes:**

**Categories:**
- System-defined categories (seeded via migration)
- CRUD operations for admins
- Public read access

**Products:**
- Multiple images (1-5 per product)
- JSONB specifications field (category-specific)
- Stock management methods
- Advanced search/filter endpoints
- Image upload to Supabase Storage

**Cart:**
- One cart per authenticated user
- Cart items with quantity
- Real-time stock availability checks (warning, not blocking)
- Cart persists in database

**Orders:**
- Order placement reserves stock after payment
- Capture product prices at purchase time
- Order status management with history tracking
- Email notifications (order placed, shipped)
- Complex order lifecycle (10 statuses)

---

### Phase 5 — Advanced Features
**Goal:** Implement sophisticated user-facing tools

**Product Comparison:**
- Select 2-4 products from same category
- Side-by-side comparison view
- Highlight differences

**Compatibility Checker:**
- CPU + Motherboard socket matching
- PSU wattage calculator
- RAM compatibility validation
- Warning system for incompatible selections

**Saved Filters:**
- Authenticated users save filter combinations
- Quick-apply saved filters
- CRUD operations on saved filters

---

### Phase 6 — Admin Features
**Goal:** Management interfaces for all admin roles

**Product Management:**
- Full CRUD with role checks
- Image upload/management
- Bulk operations (stock updates, price changes)
- Active/inactive toggle

**Order Management:**
- View all orders with filters
- Status update workflow
- Order assignment to staff
- Cancellation with stock restoration

**User Management:**
- View all users
- Role management (Super Admin only)
- Account suspension
- Delete with safeguards

---

### Phase 7 — Email & Background Processing
**Goal:** Automated notifications (v1: synchronous, v2: queue-based)

**v1.0 (Synchronous):**
- Email service using Supabase Auth or external provider
- Send emails directly in service methods
- Order confirmation email
- Order shipped email
- Error logging if email fails

**v2.0 (Queue-based - Future):**
- BullMQ or similar job queue
- Publish events on status changes
- Background worker consumes events
- Automatic retry on failure
- Email notification triggered by queue

---

### Phase 8 — Frontend Implementation
**Goal:** Complete Angular app with all features

**Core Features:**
- Product catalog with advanced search
- Product detail pages
- Shopping cart
- Checkout with mock payment
- Order history and tracking
- User authentication (login/register)

**Admin Features:**
- Product management interface
- Order management dashboard
- User management (Super Admin)
- Role-specific views

**Technical Implementation:**
- Feature modules for each domain
- Services for API communication
- Guards for route protection
- Interceptors for JWT attachment
- Signals for state management
- Generic components composed in features

---

### Phase 9 — Testing & Documentation
**Goal:** Comprehensive test coverage and API documentation

**Testing:**
- Integration tests for all critical flows
- Unit tests for complex business logic
- Manual testing via Bruno collections
- E2E smoke tests for frontend

**Documentation:**
- Complete Swagger documentation
- Bruno collections committed
- README with setup instructions
- Architecture diagrams (optional)

---

### Phase 10 — Academic Delivery Prep
**Goal:** Finalize for submission

**1st Delivery:**
- All API endpoints functional
- Swagger docs complete
- Integration tests passing
- Bruno collections
- Seed data in database
- Video demonstration

**2nd Delivery:**
- Frontend complete
- All features working end-to-end
- Oral defense preparation
- Architecture explanation slides
- Demo script

---

## Key npm Dependencies (API)

```bash
# Core
npm install @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata rxjs

# TypeORM + Postgres
npm install @nestjs/typeorm typeorm pg

# Config / Env
npm install @nestjs/config

# Validation
npm install class-validator class-transformer

# Auth
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt

# Swagger
npm install @nestjs/swagger swagger-ui-express

# Image upload (Supabase Storage)
npm install @supabase/supabase-js

# Testing (dev)
npm install -D jest @nestjs/testing ts-jest @types/jest jest-mock-extended supertest @types/supertest dotenv-cli

# Optional — Azure
npm install @azure/keyvault-secrets @azure/identity   # Key Vault
npm install @azure/storage-blob                       # Blob Storage (image alt)
```

---

## Generic UI Components (Angular Material 3)

All components are **generic** and **reusable**. Feature-specific components (e.g., `ProductCardComponent`, `ProductsTableComponent`) import and compose these generic ones with typed data.

### Component Library

| Component | File | Purpose | Key Inputs | Key Outputs |
|---|---|---|---|---|
| **UiButtonComponent** | `button/ui-button.component.ts` | Generic button with variants (primary, accent, warn, icon, stroked), loading states, and icon support | `variant`, `label`, `icon`, `loading`, `disabled`, `type` | `clicked` |
| **UiTableComponent<T>** | `table/ui-table.component.ts` | Generic data table with sortable columns, pagination, row click, and custom actions template slot | `data: T[]`, `columns: ColumnDef<T>[]`, `loading`, `paginated`, `totalItems`, `pageSize`, `rowClickable`, `actionsTemplate` | `pageChange`, `sortChange`, `rowClick` |
| **UiInputComponent** | `input/ui-input.component.ts` | Text/number/email input bound to a `FormControl`, with validation error display | `control: FormControl`, `label`, `placeholder`, `type`, `icon`, `required` | — |
| **UiSelectComponent** | `select/ui-select.component.ts` | Dropdown bound to a `FormControl`, supports typed options array | `control: FormControl`, `options: SelectOption[]`, `optionLabel`, `optionValue`, `label`, `placeholder` | — |
| **UiCardComponent** | `card/ui-card.component.ts` | Material card with optional image, title, subtitle, and actions slot | `title`, `subtitle`, `imageUrl`, `hasActions` | — |
| **UiDialogComponent** | `dialog/ui-dialog.component.ts` | Modal dialog overlay with title, content slot, and actions slot | `title`, `visible` | `close` |
| **UiCheckboxComponent** | `checkbox/ui-checkbox.component.ts` | Checkbox bound to a `FormControl<boolean>` | `control`, `label`, `color` | — |
| **UiChipComponent** | `chip/ui-chip.component.ts` | Material chip / badge for tags and statuses | `label`, `color` | — |
| **UiSpinnerComponent** | `spinner/ui-spinner.component.ts` | Loading spinner overlay with optional message | `show`, `diameter`, `message`, `color` | — |
| **UiEmptyStateComponent** | `empty-state/ui-empty-state.component.ts` | Placeholder for empty lists / tables with icon, title, message, and optional CTA slot | `icon`, `title`, `message` | — |

### Scoped Component Pattern

Instead of duplicating logic, **feature components import and configure the generic components** with domain-specific data.

**Example** — Products table in a feature module:

```typescript
// products/products-table.component.ts
import { Component, input, output } from '@angular/core';
import { UiTableComponent, ColumnDef } from '@shared/components/table/ui-table.component';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'products-table',
  imports: [UiTableComponent],
  template: `
    <ui-table
      [data]="products()"
      [columns]="columns"
      [loading]="loading()"
      (rowClick)="rowClick.emit($event)" />
  `,
})
export class ProductsTableComponent {
  products = input.required<Product[]>();
  loading  = input<boolean>(false);
  rowClick = output<Product>();

  readonly columns: ColumnDef<Product>[] = [
    { key: 'name',  header: 'Product',  sortable: true },
    { key: 'price', header: 'Price',    sortable: true, formatter: (v) => `$${v}` },
    { key: 'stock', header: 'In Stock', sortable: true },
  ];
}
```

This approach keeps the generic component logic **centralized** and **testable**, while feature modules remain **organized** and **typed**.

### Showcase Page

The `/showcase` route (`showcase.component.ts`) renders every generic component with example data. This page is used during the **UI build phase** to:
- Visually verify all components
- Test styling and responsive behavior
- Document component usage for the team

Access it by running `npm start` in the `ui/` folder and navigating to `http://localhost:4200/showcase`.

---

## Environment Variables (`.env.example`)

```env
# Database — get from Supabase project Settings > Database > Connection string
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres

# JWT
JWT_SECRET=change_me_to_a_strong_random_secret
JWT_EXPIRES_IN=7d

# Supabase Storage (for image uploads)
SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_STORAGE_BUCKET=product-images

# App
PORT=3000
NODE_ENV=development

# --- Optional: Azure ---
# AZURE_KEYVAULT_URL=https://[VAULT_NAME].vault.azure.net
# AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
# AZURE_STORAGE_CONTAINER=product-images
```

> `.env.test` mirrors this file but points `DATABASE_URL` to the test schema in Supabase.

---

## Testing Strategy

### Two-Level Approach

#### Level 1 — Unit Tests (fast, fully isolated)
- **Tool**: Jest + `jest-mock-extended`
- **What**: Test service logic in complete isolation. Repositories are mocked — no DB connection needed.
- **When**: Run on every save (`jest --watch`). Always fast.
- **.NET equivalent**: xUnit + `Mock<IRepository>()`

```typescript
// products.service.spec.ts — no database, no network
const module = await Test.createTestingModule({
  providers: [
    ProductsService,
    { provide: ProductsRepository, useValue: mock<ProductsRepository>() },
  ],
}).compile();
```

#### Level 2 — Integration Tests (real DB, full flow, debuggable)
- **Tool**: Jest + `@nestjs/testing` with a real TypeORM `DataSource` + `.env.test`
- **What**: Boots the actual NestJS module (real DI, real TypeORM, real Supabase test schema). You call services directly — no HTTP involved — and can set breakpoints and step through the code exactly as if the API is running.
- **When**: Run explicitly (`npm run test:integration`) before commits or when testing business flows.
- **.NET equivalent**: xUnit with `WebApplicationFactory<Program>` pointed at a test DB, calling services via DI directly.

```typescript
// orders.integration.spec.ts — real database, full flow
beforeAll(async () => {
  app = await Test.createTestingModule({
    imports: [AppModule],  // real module — same as production
  }).compile();

  ordersService = app.get(OrdersService);
  // ^ set a breakpoint inside OrdersService — it will hit
});

it('should create an order and reduce stock', async () => {
  const order = await ordersService.placeOrder(userId, cartId);
  expect(order.status).toBe('pending');
  // verify DB state directly
  const product = await productsRepository.findById(productId);
  expect(product.stock).toBe(originalStock - quantity);
});
```

**Test database setup**:
- Create a separate schema (`test`) in the same Supabase project, OR use a separate Supabase project.
- `.env.test` file with `DATABASE_URL` pointing to the test schema.
- Jest config loads `.env.test` automatically via `dotenv`.
- Each test suite cleans up its own data in `afterEach` / `afterAll`.

#### Level 3 — Manual / Exploratory
- Postman collection committed to `tests/` — covers all API endpoints with example requests and expected responses.
- Swagger UI at `/api/docs` for quick ad-hoc calls.

### Summary Table

| Level | Type | DB | Debuggable | Run frequency | .NET equivalent |
|---|---|---|---|---|---|
| 1 | Unit (service) | No (mocked) | Yes | Every save | xUnit + Moq |
| 2 | Integration (full flow) | Yes (test schema) | Yes | Before commit | xUnit + WebApplicationFactory + test DB |
| 3 | Manual | Yes (dev/staging) | Via Postman | On demand | Postman / Swagger UI |

### npm Scripts
```json
"test": "jest",
"test:watch": "jest --watch",
"test:integration": "dotenv -e .env.test -- jest --config test/jest-integration.json",
"test:cov": "jest --coverage"
```

---

## Technical Decisions & Status

### Resolved
- [x] Auth: NestJS-only JWT (bcrypt + `@nestjs/jwt`)
- [x] Image storage: Supabase Storage (primary), Azure Blob (optional extension)
- [x] Pagination: `?page=1&limit=20` offset-based
- [x] Angular UI library: Angular Material 3
- [x] Testing strategy: integration tests (real DB, debuggable) > unit tests (mocked)
- [x] Repo structure: single repo, `api/` + `ui/` folders, no monorepo tooling
- [x] ORM: TypeORM connected directly to Supabase Postgres
- [x] Stock reservation: After payment confirmation (see OVERVIEW.md)
- [x] Cart persistence: Database-backed for authenticated users, session for anonymous
- [x] Order statuses: 10 detailed statuses (see OVERVIEW.md)
- [x] Admin roles: Super Admin, Manager, Staff (see OVERVIEW.md)
- [x] Email notifications: Order placed + Shipped (see OVERVIEW.md)
- [x] Payment: Mock payment system for v1.0
- [x] Background processing: Synchronous for v1.0, queue-based in v2.0

### Technical Backlog (Post-Academic Delivery)
- [ ] **Background Job Queue**: Implement BullMQ or Kafka for async event processing
- [ ] **Analytics Dashboard**: Admin reporting and metrics (deferred per OVERVIEW.md)
- [ ] **Azure Integration**: Key Vault, Blob Storage, App Service deployment
- [ ] **Real Payment Gateway**: Stripe or PayPal integration
- [ ] **Email Queue with Retry**: Move email sending to background queue
- [ ] **Advanced Caching**: Redis for product catalog and cart
- [ ] **Rate Limiting**: Prevent API abuse
- [ ] **Logging & Monitoring**: Structured logging with Winston, APM integration

### Implementation Notes

**Admin User Seeding:**
- First Super Admin created via database seed script in `database/seeds/`
- Seed runs automatically on first migration
- Additional admins created via Super Admin UI

**Image Upload Flow:**
- Admin uploads image via API endpoint (`POST /products/:id/images`)
- API validates file (size, format)
- API uploads to Supabase Storage
- API stores public URL in `product_images` table
- Frontend displays images via URL

**Stock Management:**
- Cart does NOT reserve stock (allows browsing without blocking)
- Stock reserved only after payment confirmation
- Atomic stock updates using database transactions
- Concurrent purchase race condition handled by DB constraints

---

## Project Structure Summary

```
didactic-madness/
├── .github/
│   ├── agents/
│   │   └── product-owner.agent.md
│   ├── copilot-instructions.md          # Coding standards
│   └── workflows/
│       └── ci-develop.yml               # CI pipeline
│
├── api/                                  # NestJS backend
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── common/                      # Cross-cutting (guards, filters, decorators)
│   │   ├── config/                      # Configuration
│   │   ├── database/                    # TypeORM base classes
│   │   └── modules/                     # Feature modules (DDD)
│   │       ├── auth/
│   │       ├── users/
│   │       ├── categories/
│   │       ├── products/
│   │       ├── cart/
│   │       └── orders/
│   ├── migrations/                      # TypeORM migrations
│   ├── test/                            # Integration tests
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── ui/                                   # Angular standalone app
│   ├── src/
│   │   ├── main.ts
│   │   ├── app/
│   │   │   ├── app.ts
│   │   │   ├── app.routes.ts
│   │   │   ├── shared/                  # Generic components
│   │   │   ├── showcase/                # Component testing page
│   │   │   └── features/                # Feature modules
│   │   │       ├── auth/
│   │   │       ├── products/
│   │   │       ├── cart/
│   │   │       └── orders/
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
├── database/                             # Source of truth
│   ├── migrations/                      # Hand-written SQL
│   ├── seeds/                           # Seed data scripts
│   └── README.md
│
├── bruno/                                # API collections
│   └── api/
│       ├── auth/
│       ├── products/
│       ├── cart/
│       └── orders/
│
├── docs/
│   ├── OVERVIEW.md                      # Business requirements
│   └── PLAN.md                          # This file (technical)
│
└── README.md
```

---

## Next Steps

1. **Review OVERVIEW.md** — Ensure all business requirements are clear
2. **Setup Supabase Project** — Create database, get connection string
3. **Initialize Projects** — Bootstrap NestJS and Angular
4. **Create Database Schema** — Write and apply first migration
5. **Implement Base Classes** — Establish DDD patterns
6. **Begin Feature Development** — Follow phased implementation plan

---

**For business requirements, user stories, and acceptance criteria, see [OVERVIEW.md](./OVERVIEW.md).**  
**For coding standards and patterns, see [../.github/copilot-instructions.md](../.github/copilot-instructions.md).**

**Last Updated:** March 4, 2026  
**Version:** 1.0 - Technical Architecture
