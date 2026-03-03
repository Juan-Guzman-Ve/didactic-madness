# Project Plan — Tienda de Armado de PCs (Custom PC Parts Store)

## Academic Deliverables

### 1st Delivery
- [ ] REST API endpoints implemented and functional
- [ ] Endpoint documentation (Swagger in-repo or hosted)
- [ ] Backend code pushed to repository
- [ ] Test data summary
- [ ] Demonstrative video of endpoints using Postman or similar

### 2nd Delivery
- [ ] Frontend module code pushed to repository
- [ ] Oral defense (date TBD per academic calendar)

---

## Project Description

An e-commerce store for purchasing computer hardware components oriented toward custom PC builds. Users can browse products by category (CPU, GPU, RAM, Storage, PSU, Case, Motherboard, Cooling), add them to a cart, and place orders.

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

## Domain Model

```
Category
  id          uuid PK
  name        string
  slug        string (unique)  — cpu | gpu | ram | storage | psu | case | motherboard | cooling

Product
  id          uuid PK
  name        string
  sku         string (unique)
  price       decimal
  stock       int
  description string
  imageUrl    string           — public URL returned by Supabase Storage after upload
  specs       jsonb            — flexible key/value for hardware specs
  categoryId  uuid FK → Category

User
  id          uuid PK
  email       string (unique)
  passwordHash string
  role        enum             — customer | admin
  createdAt   timestamp
  updatedAt   timestamp

Cart
  id          uuid PK
  userId      uuid FK → User (unique — one cart per user)
  items       CartItem[]

CartItem
  id          uuid PK
  cartId      uuid FK → Cart
  productId   uuid FK → Product
  quantity    int

Order
  id          uuid PK
  userId      uuid FK → User
  status      enum             — pending | confirmed | shipped | delivered | cancelled
  total       decimal
  createdAt   timestamp
  items       OrderItem[]

OrderItem
  id          uuid PK
  orderId     uuid FK → Order
  productId   uuid FK → Product
  quantity    int
  unitPrice   decimal          — snapshot of price at time of purchase
```

---

## API Endpoints (1st Delivery Target)

### Auth
| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Create account | Public |
| POST | `/auth/login` | Login, returns JWT | Public |

### Categories
| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/categories` | List all categories | Public |
| GET | `/categories/:id` | Get one category | Public |
| POST | `/categories` | Create category | Admin |
| PUT | `/categories/:id` | Update category | Admin |
| DELETE | `/categories/:id` | Delete category | Admin |

### Products
| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/products` | List all products (filter by category) | Public |
| GET | `/products/:id` | Get one product | Public |
| POST | `/products` | Create product | Admin |
| PUT | `/products/:id` | Update product | Admin |
| DELETE | `/products/:id` | Delete product | Admin |

### Cart
| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/cart` | Get current user's cart | Customer |
| POST | `/cart/items` | Add item to cart | Customer |
| PUT | `/cart/items/:itemId` | Update item quantity | Customer |
| DELETE | `/cart/items/:itemId` | Remove item from cart | Customer |
| DELETE | `/cart` | Clear cart | Customer |

### Orders
| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/orders` | Place order from cart | Customer |
| GET | `/orders` | List user's orders | Customer |
| GET | `/orders/:id` | Get order detail | Customer |
| PUT | `/orders/:id/status` | Update order status | Admin |

---

## Phased Implementation Plan

### Phase 1 — Project Bootstrap
- Initialize NestJS in `api/`
- Install all dependencies (see below)
- Configure TypeORM `DataSource` pointing to Supabase via `DATABASE_URL`
- Register global `ValidationPipe`, `HttpExceptionFilter`, Swagger in `main.ts`
- Confirm DB connection

### Phase 2 — Base Classes (Generic Infrastructure)
- `BaseEntity` — abstract entity with `id`, `createdAt`, `updatedAt`
- `BaseRepository<T>` — generic wrapper around TypeORM `Repository<T>` with `findById`, `findAll`, `save`, `remove`
- All feature repositories extend `BaseRepository<T>` (mirrors the generic EF repository pattern)

### Phase 3 — Entities & Migrations
- Define all entities with TypeORM decorators
- Generate and run first migration against Supabase Postgres
- Seed data script in `database/`

### Phase 4 — Feature Modules (per domain entity)
Order: `categories` → `products` → `auth` + `users` → `cart` → `orders`

Each module follows the same pattern:
1. Entity
2. DTO (create + update) with `class-validator`
3. Repository (extends `BaseRepository`)
4. Service (business logic, injected repository)
5. Controller (HTTP layer, delegates to service, Swagger decorated)
6. Module (wires everything, registers TypeORM entity)
7. Unit tests for service (mocked repository)
8. Integration test for the key business flow (real DB — see Testing Strategy)

### Phase 5 — Auth
- JWT strategy with `passport-jwt`
- Global `JwtAuthGuard` — all routes protected by default
- `@Public()` decorator for open routes
- `@Roles('admin')` decorator for admin-only routes

### Phase 6 — Swagger Documentation
- Decorators on all controllers and DTOs
- `@ApiBearerAuth()` on protected routes
- Accessible at `/api/docs`

### Phase 7 — Angular UI (2nd Delivery)
- `ng new ui` inside `ui/`
- Feature modules: `ProductsModule`, `CartModule`, `OrdersModule`, `AuthModule`
- `CoreModule`: `AuthGuard`, `HttpInterceptor` (attaches JWT), `AuthService`
- `SharedModule`: reusable UI components
- `HttpClient` services map directly to the API endpoints above

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

## Open Decisions / TBD

### Resolved
- [x] Auth: NestJS-only JWT (bcrypt + `@nestjs/jwt`)
- [x] Image storage: Supabase Storage (primary), Azure Blob (optional extension)
- [x] Pagination: `?page=1&limit=20` offset-based
- [x] Angular UI library: Angular Material
- [x] Testing strategy: unit tests (mocked) + integration tests (real DB, debuggable)
- [x] Repo structure: single repo, `api/` + `ui/` folders, no Nx
- [x] ORM: TypeORM connected directly to Supabase Postgres via connection string

### Still TBD
- [ ] **Order flow — stock check**: Should placing an order fail if a product has insufficient stock? If yes, does adding to cart also check stock, or only at checkout?
- [ ] **Admin seeding**: How is the first admin user created? (DB seed script, a one-off migration, or a hidden endpoint that self-destructs after first use?)
- [ ] **Azure timeline**: At what point in the delivery schedule do we tackle the optional Azure extensions? After 1st delivery or in parallel?
- [ ] **Image upload endpoint**: Does the API expose a `POST /products/:id/image` upload endpoint, or does the frontend upload directly to Supabase Storage and pass the URL?
