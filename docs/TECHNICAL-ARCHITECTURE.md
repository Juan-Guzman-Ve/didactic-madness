# Technical Architecture — Custom PC Parts E-Commerce Platform

**Version:** 1.0  
**Last Updated:** March 6, 2026  
**Related Documents:**  
- [Business Requirements](./SYSTEM-OVERVIEW.md) — What we're building
- [Database Design](./DATABASE-DESIGN.md) — Database schema and RBAC
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

This document defines the **technical architecture, stack decisions, and implementation patterns** for the custom PC parts e-commerce platform. For business requirements, user stories, and feature specifications, see [SYSTEM-OVERVIEW.md](./SYSTEM-OVERVIEW.md).

**Project Context:** This is a **university class project** designed to demonstrate full-stack development skills with clean architecture principles. The focus is on learning and applying best practices rather than production-scale features.

**Architecture Pattern:** Clean Architecture with Domain-Driven Design (DDD) principles. Business logic lives in domain entities, services orchestrate use cases, and controllers use Result Pattern for consistent response handling.

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
| **Repo Structure** | Monorepo for development | Single repository with `api/` and `ui/` top-level folders. No monorepo tooling. Deployed separately to Vercel. |
| **Auth** | NestJS-only JWT (`@nestjs/jwt` + `passport-jwt` + `bcrypt`) | Full auth implemented in the API: register, login, password hashing, JWT issuance and validation. Supabase is purely the database host. Keeps the auth flow fully under our control, identical to how you would build it in ASP.NET Core with `[Authorize]`. |
| **Image Storage** | Supabase Storage | Product images uploaded via API to a Supabase Storage bucket; the resulting public URL is stored on the `Product` entity. Simple, free tier included, no extra infra. |
| **UI Library** | Angular Material | Official Google component library. Strict design system, well-documented, large community. Appropriate for a structured data-driven store UI. |
| **Response Pattern** | Result Pattern | Controllers return structured responses with metadata and data: `{ data: T, meta?: { ... } }`. Keeps response format consistent across all endpoints. |
| **Deployment** | Vercel | Deploy both API and UI to Vercel. Separate projects for backend and frontend. Simple deployment, free tier, automatic SSL. |
| **CI/CD** | GitHub Actions | Automated testing and deployment pipeline. Build, test, and deploy on push to main branch. |
| **Pagination** | `page` + `limit` query params | Offset-based pagination (`?page=1&limit=20`). Standard, simple to implement and test. Sufficient for this project's data volume. |
| **Testing (API)** | Jest + `@nestjs/testing` + real TypeORM DataSource | Two-level strategy: unit tests (mocked repos) and integration tests (real DB). See Testing Strategy section below. |
| **Validation** | `class-validator` + `class-transformer` + global `ValidationPipe` | Equivalent to Data Annotations + `ModelState` validation in ASP.NET. Applied globally in `main.ts`. |
| **API Docs** | `@nestjs/swagger` | Equivalent to Swashbuckle. Decorator-driven on controllers and DTOs (`@ApiProperty()`, `@ApiTags()`, etc.). |
| **Config** | `@nestjs/config` (`ConfigService`) | Equivalent to `IConfiguration` / `appsettings.json`. Reads `.env` and provides a typed config service via DI. |

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
| `dotnet ef migrations add` | Hand-written SQL scripts in `database/migrations/` |
| `dotnet ef database update` | Apply SQL scripts manually via Supabase SQL editor |
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

**Note:** API and UI are developed in a single monorepo for local development but will be deployed separately to Vercel.

### API Repository Structure (NestJS)

```
api/
├── src/
│   ├── main.ts                           # Bootstrap: global pipes, filters, swagger, CORS
│   ├── app.module.ts                     # Root module — imports all feature modules
│   │
│   ├── config/                           # Typed config (wraps @nestjs/config)
│   │   └── database.config.ts
│   │
│   ├── database/                         # TypeORM setup + base classes
│   │   ├── database.module.ts            # TypeORM forRoot() wired to ConfigService
│   │   ├── base.entity.ts                # Abstract: id (uuid), createdAt, updatedAt
│   │   └── base.repository.ts            # Generic BaseRepository<T extends BaseEntity>
│   │
│   ├── common/                           # Cross-cutting concerns (no business logic)
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts  # Global exception handler
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts         # Global JWT guard
│   │   │   └── policy.guard.ts           # Policy-based authorization guard
│   │   ├── interceptors/
│   │   │   └── response-transform.interceptor.ts  # Result pattern wrapper
│   │   ├── decorators/
│   │   │   ├── public.decorator.ts       # @Public() — skip auth
│   │   │   ├── current-user.decorator.ts # @CurrentUser()
│   │   │   └── require-policy.decorator.ts  # @RequirePolicy('resource:action')
│   │   └── pipes/
│   │       └── parse-uuid.pipe.ts
│   │
│   └── modules/                          # Feature modules (one per domain)
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts        # POST /auth/login, /auth/register
│       │   ├── auth.service.ts
│       │   └── dto/
│       │       ├── login.dto.ts
│       │       └── register.dto.ts
│       │
│       ├── users/
│       │   ├── domain/
│       │   │   └── user.entity.ts        # Domain entity with business logic
│       │   ├── users.repository.ts
│       │   ├── users.service.ts          # Application service (use cases)
│       │   ├── users.controller.ts       # Controller with Result pattern
│       │   ├── users.module.ts
│       │   └── dto/
│       │       ├── create-user.dto.ts
│       │       ├── update-user.dto.ts
│       │       └── user-response.dto.ts
│       │
│       ├── roles/
│       │   ├── domain/role.entity.ts
│       │   ├── roles.repository.ts
│       │   ├── roles.service.ts
│       │   ├── roles.controller.ts
│       │   └── roles.module.ts
│       │
│       ├── policies/
│       │   ├── domain/policy.entity.ts
│       │   ├── policies.repository.ts
│       │   ├── policies.service.ts
│       │   ├── policies.controller.ts
│       │   └── policies.module.ts
│       │
│       ├── categories/
│       │   ├── domain/category.entity.ts
│       │   ├── categories.repository.ts
│       │   ├── categories.service.ts
│       │   ├── categories.controller.ts
│       │   ├── categories.module.ts
│       │   └── dto/
│       │
│       ├── products/
│       │   ├── domain/
│       │   │   ├── product.entity.ts
│       │   │   └── product-image.entity.ts
│       │   ├── products.repository.ts
│       │   ├── products.service.ts
│       │   ├── products.controller.ts
│       │   ├── products.module.ts
│       │   └── dto/
│       │       ├── create-product.dto.ts
│       │       ├── update-product.dto.ts
│       │       └── product-response.dto.ts
│       │
│       ├── cart/
│       │   ├── domain/
│       │   │   ├── cart.entity.ts
│       │   │   └── cart-item.entity.ts
│       │   ├── cart.repository.ts
│       │   ├── cart.service.ts
│       │   ├── cart.controller.ts
│       │   ├── cart.module.ts
│       │   └── dto/
│       │
│       └── orders/
│           ├── domain/
│           │   ├── order.entity.ts
│           │   ├── order-item.entity.ts
│           │   └── order-status-history.entity.ts
│           ├── orders.repository.ts
│           ├── orders.service.ts
│           ├── orders.controller.ts
│           ├── orders.module.ts
│           └── dto/
│
├── test/
│   ├── jest-integration.json             # Integration test config
│   ├── setup.ts                          # Global test setup: NestJS app + real DB
│   └── modules/
│       ├── auth.integration.spec.ts
│       ├── products.integration.spec.ts
│       ├── cart.integration.spec.ts
│       └── orders.integration.spec.ts
│
├── .env                                  # Local env vars (gitignored)
├── .env.example                          # Committed env template
├── .env.test                             # Test database configuration
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── package.json
├── vercel.json                           # Vercel deployment config
└── README.md
```

### UI Repository Structure (Angular)

```
ui/
├── src/
│   ├── main.ts
│   ├── index.html
│   ├── styles.scss                       # Global Material 3 theme + layout utilities
│   │
│   └── app/
│       ├── app.ts                        # Root component with sidenav shell
│       ├── app.html                      # Material sidenav + toolbar layout
│       ├── app.scss                      # App shell styles
│       ├── app.config.ts                 # Providers: router, animations, HTTP
│       ├── app.routes.ts                 # Lazy-loaded routes
│       │
│       ├── core/                         # Singleton services & guards
│       │   ├── services/
│       │   │   ├── auth.service.ts       # Authentication & JWT management
│       │   │   └── api.service.ts        # HTTP client wrapper
│       │   └── guards/
│       │       ├── auth.guard.ts         # Route protection
│       │       └── role.guard.ts         # Role-based route access
│       │
│       ├── shared/                       # Generic reusable UI components
│       │   ├── components/
│       │   │   ├── button/
│       │   │   │   ├── ui-button.component.ts
│       │   │   │   ├── ui-button.component.html
│       │   │   │   └── ui-button.component.scss
│       │   │   ├── table/
│       │   │   │   ├── ui-table.component.ts
│       │   │   │   ├── ui-table.component.html
│       │   │   │   └── ui-table.component.scss
│       │   │   ├── input/
│       │   │   │   ├── ui-input.component.ts
│       │   │   │   ├── ui-input.component.html
│       │   │   │   └── ui-input.component.scss
│       │   │   ├── select/
│       │   │   │   ├── ui-select.component.ts
│       │   │   │   ├── ui-select.component.html
│       │   │   │   └── ui-select.component.scss
│       │   │   ├── card/
│       │   │   │   ├── ui-card.component.ts
│       │   │   │   ├── ui-card.component.html
│       │   │   │   └── ui-card.component.scss
│       │   │   ├── dialog/
│       │   │   │   ├── ui-dialog.component.ts
│       │   │   │   ├── ui-dialog.component.html
│       │   │   │   └── ui-dialog.component.scss
│       │   │   ├── checkbox/
│       │   │   │   └── ui-checkbox.component.ts
│       │   │   ├── chip/
│       │   │   │   └── ui-chip.component.ts
│       │   │   ├── spinner/
│       │   │   │   └── ui-spinner.component.ts
│       │   │   └── empty-state/
│       │   │       └── ui-empty-state.component.ts
│       │   └── models/
│       │       └── api-response.model.ts # Result pattern types
│       │
│       ├── showcase/                     # Component showcase (development only)
│       │   ├── showcase.component.ts
│       │   ├── showcase.component.html
│       │   └── showcase.component.scss
│       │
│       └── features/                     # Feature modules (lazy-loaded)
│           ├── auth/
│           │   ├── login/
│           │   ├── register/
│           │   └── auth.routes.ts
│           │
│           ├── products/
│           │   ├── product-list/
│           │   ├── product-detail/
│           │   ├── product-form/         # Admin only
│           │   ├── services/
│           │   │   └── products.service.ts
│           │   └── products.routes.ts
│           │
│           ├── cart/
│           │   ├── cart-view/
│           │   ├── services/
│           │   │   └── cart.service.ts
│           │   └── cart.routes.ts
│           │
│           ├── orders/
│           │   ├── order-list/
│           │   ├── order-detail/
│           │   ├── checkout/
│           │   ├── services/
│           │   │   └── orders.service.ts
│           │   └── orders.routes.ts
│           │
│           └── admin/
│               ├── dashboard/
│               ├── product-management/
│               ├── order-management/
│               ├── user-management/
│               └── admin.routes.ts
│
├── public/                               # Static assets
│   └── favicon.ico
│
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── vercel.json                           # Vercel deployment config
└── README.md
```

### Shared Resources

```
database/                                 # Source of truth (separate repo or folder)
├── migrations/                           # Hand-written SQL scripts
│   └── 001_initial_schema.sql
├── seeds/                                # Seed data scripts
│   ├── 001_roles.sql
│   ├── 002_policies.sql
│   ├── 003_role_policies.sql
│   ├── 004_categories.sql
│   └── 005_admin_user.sql
└── README.md                             # Migration instructions

bruno/                                    # API testing collections
└── api/
    ├── auth/
    ├── products/
    ├── cart/
    ├── orders/
    └── admin/

docs/
├── SYSTEM-OVERVIEW.md                    # Business requirements
├── DATABASE-DESIGN.md                    # Database schema & RBAC
└── TECHNICAL-ARCHITECTURE.md             # This file

.github/
└── workflows/
    ├── api-ci.yml                        # API: test + deploy
    └── ui-ci.yml                         # UI: build + deploy
```

---

## Database Schema

**Complete database design available in [DATABASE-DESIGN.md](./DATABASE-DESIGN.md)** — including ER diagram, field descriptions, RBAC implementation, constraints, and indexes.

**Migration Strategy:**
- All database changes are hand-written SQL scripts stored in `database/migrations/`
- Scripts are applied manually to Supabase via the SQL editor
- **No TypeORM migrations** — the database schema is the source of truth
- TypeORM entities are mapped to existing tables (decorators match database structure)
- Seed data scripts stored in `database/seeds/` and applied manually

---

## API Endpoints

**Note:** For feature requirements and acceptance criteria, see [SYSTEM-OVERVIEW.md](./SYSTEM-OVERVIEW.md). This section lists the technical API contract.

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
| Method | Route | Description | Auth | Required Policy |
|---|---|---|---|---|
| GET | `/categories` | List all categories | Public | — |
| GET | `/categories/:id` | Get one category | Public | — |
| POST | `/categories` | Create category | Manager+ | `categories:create` |
| PUT | `/categories/:id` | Update category | Manager+ | `categories:update` |
| DELETE | `/categories/:id` | Delete category | Super Admin | `categories:delete` |

### Products
| Method | Route | Description | Auth | Required Policy | Query Params |
|---|---|---|---|---|---|
| GET | `/products` | List products with filters | Public | — | `?page=1&limit=20&category=uuid&search=text&minPrice=0&maxPrice=999&brand=text&inStock=true&sort=price:asc` |
| GET | `/products/:id` | Get product details | Public | — | — |
| POST | `/products` | Create product | Manager+ | `products:create` | — |
| PUT | `/products/:id` | Update product | Manager+ | `products:update` | — |
| PATCH | `/products/:id/stock` | Update stock quantity | Manager+ | `products:update` | — |
| DELETE | `/products/:id` | Delete product (w/ safeguards) | Super Admin | `products:delete` | — |
| POST | `/products/:id/images` | Upload product image | Manager+ | `products:update` | Multipart form |
| DELETE | `/products/:id/images/:imageId` | Delete image | Manager+ | `products:update` | — |### Cart
| Method | Route | Description | Auth | Required Policy |
|---|---|---|---|---|
| GET | `/cart` | Get current user's cart | Customer | `cart:manage` |
| POST | `/cart/items` | Add item to cart | Customer | `cart:manage` |
| PUT | `/cart/items/:itemId` | Update quantity | Customer | `cart:manage` |
| DELETE | `/cart/items/:itemId` | Remove item | Customer | `cart:manage` |
| DELETE | `/cart` | Clear cart | Customer | `cart:manage` |

### Orders
| Method | Route | Description | Auth | Required Policy | Query Params |
|---|---|---|---|---|---|
| POST | `/orders` | Place order from cart | Customer | `orders:create` | — |
| GET | `/orders` | List user's orders | Customer | `orders:read` | `?page=1&limit=20` |
| GET | `/orders/:id` | Get order details | Customer/Staff+ | `orders:read` | — |
| PATCH | `/orders/:id/status` | Update order status | Staff+ | `orders:update` | — |
| DELETE | `/orders/:id` | Cancel order | Customer/Manager+ | `orders:cancel` | — |
| GET | `/orders/:id/history` | Get status history | Customer/Staff+ | `orders:read` | — |

### Admin - Orders
| Method | Route | Description | Auth | Required Policy | Query Params |
|---|---|---|---|---|---|
| GET | `/admin/orders` | List all orders | Staff+ | `orders:list` | `?page=1&limit=20&status=Shipped&userId=uuid&dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD` |
| PATCH | `/admin/orders/:id/assign` | Assign order to staff | Manager+ | `orders:update` | — |

### Admin - Users
| Method | Route | Description | Auth | Required Policy |
|---|---|---|---|---|
| GET | `/admin/users` | List all users | Manager+ | `users:read` |
| GET | `/admin/users/:id` | Get user details | Manager+ | `users:read` |
| PUT | `/admin/users/:id` | Update user | Super Admin | `users:update` |
| PATCH | `/admin/users/:id/role` | Change user role | Super Admin | `users:update` |
| PATCH | `/admin/users/:id/status` | Suspend/activate account | Super Admin | `users:update` |
| DELETE | `/admin/users/:id` | Delete user (w/ safeguards) | Super Admin | `users:delete` |

### Admin - Roles & Policies
| Method | Route | Description | Auth | Required Policy |
|---|---|---|---|---|
| GET | `/admin/roles` | List all roles | Super Admin | `roles:manage` |
| POST | `/admin/roles` | Create role | Super Admin | `roles:manage` |
| PUT | `/admin/roles/:id` | Update role | Super Admin | `roles:manage` |
| DELETE | `/admin/roles/:id` | Delete role | Super Admin | `roles:manage` |
| GET | `/admin/policies` | List all policies | Super Admin | `policies:manage` |
| POST | `/admin/policies` | Create policy | Super Admin | `policies:manage` |
| PUT | `/admin/policies/:id` | Update policy | Super Admin | `policies:manage` |
| DELETE | `/admin/policies/:id` | Delete policy | Super Admin | `policies:manage` |
| POST | `/admin/roles/:id/policies` | Assign policy to role | Super Admin | `roles:manage` |
| DELETE | `/admin/roles/:id/policies/:policyId` | Remove policy from role | Super Admin | `roles:manage` |

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

**Note:** For feature-level acceptance criteria, see [SYSTEM-OVERVIEW.md](./SYSTEM-OVERVIEW.md). This plan focuses on technical buildout. Features marked as optional in SYSTEM-OVERVIEW.md should be implemented only after completing mandatory requirements.

### Phase 1 — Project Bootstrap & Infrastructure
**Goal:** Establish foundation for both API and UI

**API:**
- Initialize NestJS project in `api/`
- Install dependencies (see Dependencies section)
- Configure TypeORM `DataSource` with Supabase connection
- Register global `ValidationPipe`, `HttpExceptionFilter`, Swagger
- Verify DB connection (simple query test)

**UI:**
- Initialize Angular 17+ standalone project in `ui/`
- Configure Angular Material 3
- Setup path aliases in `tsconfig.json`
- Create generic UI component library (see Generic Components section)
- Create showcase route for component testing

**Database:**
- Create `database/` folder for hand-written SQL scripts
- Write SQL schema with all tables (see DATABASE-DESIGN.md)
- Apply schema to Supabase via SQL editor
- Create seed data scripts for roles, policies, categories, test products
- Apply seed scripts manually via SQL editor

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

### Phase 3 — Authentication & Authorization (RBAC)
**Goal:** Secure API with JWT and policy-based access control

**Implementation Order:**
1. **Roles Module** (seed default roles: Customer, Staff, Manager, SuperAdmin)
2. **Policies Module** (seed policies: products:create, orders:update, etc.)
3. **RolePolicy Junction** (seed role-policy mappings)
4. **Users Module** (domain entity with role_id FK, repository, service)
5. **Auth Module** (login, register, JWT strategy with role_id in payload)
6. **JWT Guards** (`JwtAuthGuard` global, `PolicyGuard`)
7. **Decorators** (`@Public()`, `@RequirePolicy()`, `@CurrentUser()`)
8. **Password Management** (forgot password, reset)
9. **Integration Tests** for auth flows and policy enforcement

**Authorization Flow:**
- JWT payload includes `user_id` and `role_id`
- `PolicyGuard` queries user's policies via role
- `@RequirePolicy('products:create')` decorator on endpoints
- Guard checks if user's role has required policy

**Deliverables:**
- All routes protected by default (JWT required)
- Public routes marked with `@Public()`
- Policy-based access: endpoints require specific policies
- Swagger shows lock icons on protected endpoints
- Admin endpoints for managing roles and policies

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
- System-defined categories (seeded via SQL script)
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

### Phase 5 — Optional Features (If Time Permits)
**Goal:** Implement optional features after completing mandatory requirements

**Note:** These features are marked as "Out of Scope / Optional" in [SYSTEM-OVERVIEW.md](./SYSTEM-OVERVIEW.md). Implement only after all mandatory features are complete.

**1. Product Reviews and Ratings:**
- Customer reviews with star ratings
- Review submission form
- Display average rating on product cards
- Filter/sort by rating

**2. Wishlists:**
- Save products for later
- Add/remove from wishlist
- View saved products
- Share wishlist (optional)

**3. Discounts / Promotions:**
- Coupon code system
- Percentage or fixed amount discounts
- Apply at checkout
- Admin management interface

**4. Low Stock Alerts:**
- Email notifications when inventory falls below threshold
- Admin configurable thresholds per product
- Automatic alert system

**5. AI Product Recommendations (Gemini API):**
- Personalized product suggestions
- Based on customer selections and budget
- Uses current inventory data
- Integrated with Gemini API

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

### Phase 7 — Email Notifications
**Goal:** Simple email notifications for order events

**Implementation (Synchronous - Academic Project):**
- Email service using Supabase Auth or simple email provider (e.g., SendGrid free tier)
- Send emails directly in service methods after order events
- Order confirmation email (payment confirmed)
- Order shipped notification
- Simple error logging if email fails
- **Note:** Email queue with retry logic is out of scope for this academic project

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

## Entity Architecture

**Clean Architecture + DDD Pattern:** This project separates concerns across three types of entities:

### 1. Domain Entities (Business Logic)
- **Location:** `src/modules/{module}/domain/`
- **Purpose:** Rich domain models with business logic and invariants
- **Examples:** `User`, `Product`, `Order`
- **Characteristics:**
  - Private fields with public getters (encapsulation)
  - Factory methods: `create()`, `fromPersistence()`
  - Business logic methods: `deactivate()`, `addToCart()`, `cancelOrder()`
  - Validation and business rules enforcement
  - No database/framework dependencies

```typescript
// Example: domain/user.entity.ts
export class User {
  private constructor(
    public readonly id: string,
    private _email: string,
    private _status: UserStatus,
  ) {}

  static create(email: string): User {
    if (!User.isValidEmail(email)) throw new InvalidEmailError();
    return new User(uuid(), email, UserStatus.ACTIVE);
  }

  static fromPersistence(data: UserDbEntity): User {
    return new User(data.id, data.email, data.status);
  }

  deactivate(): void {
    if (this._status === UserStatus.INACTIVE) {
      throw new AlreadyInactiveError();
    }
    this._status = UserStatus.INACTIVE;
  }

  toPersistence(): UserDbEntity {
    return { id: this.id, email: this._email, status: this._status };
  }
}
```

### 2. Database Entities (TypeORM Persistence)
- **Location:** `src/modules/{module}/entities/` or `src/modules/{module}/persistence/`
- **Purpose:** TypeORM entities that map to database tables
- **Examples:** `UserEntity`, `ProductEntity`, `OrderEntity`
- **Characteristics:**
  - Decorated with TypeORM decorators: `@Entity()`, `@Column()`, `@ManyToOne()`
  - Match database schema exactly
  - No business logic (anemic models)
  - Used only by repositories for persistence

```typescript
// Example: entities/user.entity.ts
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'role_id' })
  roleId: string;

  @Column()
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
```

### 3. DTOs (Data Transfer Objects)
- **Location:** `src/modules/{module}/dto/`
- **Purpose:** API request/response contracts
- **Examples:** `CreateUserDto`, `UpdateProductDto`, `UserResponseDto`
- **Characteristics:**
  - Decorated with validation: `@IsEmail()`, `@IsString()`, `@Min()`
  - Used for API inputs and outputs
  - No business logic
  - Swagger documentation: `@ApiProperty()`

```typescript
// Example: dto/create-user.dto.ts
export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ example: 'SecurePass123' })
  password: string;
}

// Example: dto/user-response.dto.ts
export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: string;
}
```

### Data Flow

```
Controller → DTO → Domain Entity → Repository → DB Entity → Database
                ↓                                    ↑
              Service                            TypeORM
```

**Example Flow (Create User):**
1. **Controller** receives `CreateUserDto` from API request
2. **Service** converts DTO to **Domain Entity**: `User.create(dto.email)`
3. **Domain Entity** validates business rules and encapsulates logic
4. **Service** calls **Repository** with domain entity
5. **Repository** converts Domain → **DB Entity** (TypeORM): `entity.toPersistence()`
6. **TypeORM** persists DB Entity to database
7. **Repository** converts DB Entity → Domain Entity
8. **Service** converts Domain → **Response DTO**
9. **Controller** returns DTO wrapped in Result Pattern: `{ data: UserResponseDto }`

**Benefits:**
- **Separation of Concerns:** Business logic isolated from persistence and API
- **Testability:** Domain entities testable without database
- **Flexibility:** Can swap ORM or database without changing business logic
- **Type Safety:** Strong typing across all layers
- **Clean Architecture:** Dependencies point inward (domain has no external dependencies)

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
- [x] **Architecture**: Clean Architecture with DDD — business logic in domain entities
- [x] **Response Pattern**: Result Pattern — consistent `{ data: T, meta?: {...} }` responses
- [x] **Auth**: NestJS-only JWT (bcrypt + `@nestjs/jwt`)
- [x] **Image Storage**: Supabase Storage
- [x] **Deployment**: Vercel for both API and UI (separate projects)
- [x] **CI/CD**: GitHub Actions for automated testing and deployment
- [x] **Migrations**: Manual SQL scripts (no TypeORM migrations)
- [x] **Environment Variables**: Simple `.env` files (no Key Vault)
- [x] **Pagination**: `?page=1&limit=20` offset-based
- [x] **UI Library**: Angular Material 3
- [x] **Testing Strategy**: Integration tests (real DB, debuggable) > unit tests (mocked)
- [x] **Repo Structure**: Monorepo for development (`api/` + `ui/` folders), deploy separately to Vercel
- [x] **ORM**: TypeORM connected directly to Supabase Postgres
- [x] **Stock Reservation**: After payment confirmation
- [x] **Cart Persistence**: Database-backed for authenticated users
- [x] **Order Statuses**: 7 detailed statuses (see DATABASE-DESIGN.md)
- [x] **Admin Roles**: Super Admin, Manager, Staff, Customer (RBAC via policies)
- [x] **Email Notifications**: Order confirmation + Shipped
- [x] **Payment**: Mock payment system for academic project
- [x] **Background Processing**: Synchronous for v1.0

### Optional Features Backlog (Post-Mandatory Requirements)
**Note:** These are marked as optional in [SYSTEM-OVERVIEW.md](./SYSTEM-OVERVIEW.md) and should only be implemented after all mandatory features are complete.

- [ ] **Product Reviews and Ratings**: Customer review system with star ratings
- [ ] **Wishlists**: Save products for later purchase
- [ ] **Discounts / Promotions**: Coupon code system and promotional pricing
- [ ] **Low Stock Alerts**: Email notifications when inventory is low
- [ ] **AI Product Recommendations**: Gemini API integration for personalized suggestions

### Out of Scope (Not Required for Academic Project)
**Note:** This is a university class project. The following production-level features are intentionally excluded to keep the scope manageable:

- ❌ **Background Job Queues** (BullMQ, Kafka) — Synchronous processing is sufficient
- ❌ **Real Payment Gateway** (Stripe, PayPal) — Mock payment for academic purposes
- ❌ **Email Queues with Retry** — Direct email sending is adequate
- ❌ **Advanced Caching** (Redis) — Database performance sufficient for project scale
- ❌ **Rate Limiting** — Not needed for controlled academic environment
- ❌ **Database Connection Pooling** (PgBouncer) — Supabase handles this
- ❌ **Advanced Monitoring/APM** — Simple logging is sufficient

**Focus:** Core e-commerce functionality with clean architecture patterns for learning purposes.

### Implementation Notes

**Admin User Seeding:**
- First Super Admin created via SQL seed script in `database/seeds/`
- Seed script applied manually to Supabase via SQL editor
- Additional admins created via Super Admin UI

**Image Upload Flow:**
- Admin uploads image via API endpoint (`POST /products/:id/images`)
- API validates file (size, format)
- API uploads to Supabase Storage bucket
- API stores public URL in `product_images` table
- Frontend displays images via public URL

**Result Pattern Implementation:**
- All controller methods return structured responses
- Success: `{ data: T }` or `{ data: T, meta: { page, limit, total } }`
- Errors handled by global exception filter
- Consistent response shape across all endpoints
- Simplifies frontend API client implementation

**Stock Management:**
- Cart does NOT reserve stock (allows browsing without blocking)
- Stock reserved only after payment confirmation
- Atomic stock updates using database transactions
- Concurrent purchase race condition handled by DB constraints

---

## Project Structure Summary

**Note:** API and UI can be developed in a monorepo for convenience but will be deployed separately to Vercel.

```
api/                                      # NestJS backend
├── src/
│   ├── main.ts                           # Bootstrap with global config
│   ├── app.module.ts                     # Root module
│   ├── common/                           # Cross-cutting concerns
│   │   ├── filters/                      # Exception handlers
│   │   ├── guards/                       # Auth & policy guards
│   │   ├── interceptors/                 # Result pattern wrapper
│   │   ├── decorators/                   # Custom decorators
│   │   └── pipes/                        # Validation pipes
│   ├── config/                           # Configuration
│   ├── database/                         # TypeORM base classes
│   └── modules/                          # Feature modules (Clean Architecture + DDD)
│       ├── auth/
│       ├── users/                        # domain/, repository, service, controller
│       ├── roles/
│       ├── policies/
│       ├── categories/
│       ├── products/
│       ├── cart/
│       └── orders/
├── test/                                 # Integration tests
├── .env.example
├── vercel.json
└── package.json

ui/                                       # Angular standalone app
├── src/
│   ├── main.ts
│   ├── app/
│   │   ├── app.ts                        # Root component
│   │   ├── app.routes.ts                 # Route configuration
│   │   ├── core/                         # Singleton services
│   │   │   ├── services/                 # Auth, API clients
│   │   │   └── guards/                   # Route guards
│   │   ├── shared/                       # Generic components
│   │   │   ├── components/               # Reusable UI components
│   │   │   └── models/                   # Shared types
│   │   ├── showcase/                     # Component testing page
│   │   └── features/                     # Lazy-loaded feature modules
│   │       ├── auth/
│   │       ├── products/
│   │       ├── cart/
│   │       ├── orders/
│   │       └── admin/
│   └── styles.scss
├── angular.json
├── vercel.json
└── package.json

database/                                 # Source of truth
├── migrations/                           # Hand-written SQL scripts
│   └── 001_initial_schema.sql
├── seeds/                                # Seed data scripts
│   ├── 001_roles.sql
│   ├── 002_policies.sql
│   └── 003_categories.sql
└── README.md

bruno/                                    # API testing collections
└── api/
    ├── auth/
    ├── products/
    ├── cart/
    └── orders/

docs/
├── SYSTEM-OVERVIEW.md                    # Business requirements
├── DATABASE-DESIGN.md                    # Database schema & RBAC
└── TECHNICAL-ARCHITECTURE.md             # This file

.github/
├── copilot-instructions.md               # Coding standards
└── workflows/
    ├── api-ci.yml                        # API deployment
    └── ui-ci.yml                         # UI deployment
```

---

## Next Steps

1. **Review SYSTEM-OVERVIEW.md** — Ensure all business requirements are clear
2. **Review DATABASE-DESIGN.md** — Understand database schema and RBAC
3. **Setup Supabase Project** — Create database, get connection string
4. **Initialize Projects** — Bootstrap NestJS and Angular
5. **Create Database Schema** — Write and apply first migration from DATABASE-DESIGN.md
6. **Implement Base Classes** — Establish DDD patterns
7. **Begin Feature Development** — Follow phased implementation plan (focus on mandatory first)

---

**For business requirements and acceptance criteria, see [SYSTEM-OVERVIEW.md](./SYSTEM-OVERVIEW.md).**  
**For database schema and RBAC design, see [DATABASE-DESIGN.md](./DATABASE-DESIGN.md).**  
**For coding standards and patterns, see [../.github/copilot-instructions.md](../.github/copilot-instructions.md).**

**Last Updated:** March 6, 2026  
**Version:** 1.0 - Technical Architecture
