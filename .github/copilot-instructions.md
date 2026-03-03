# GitHub Copilot Instructions — Tienda de Armado de PCs

## Project Overview

A full-stack TypeScript application for a custom PC parts e-commerce store. Backend is NestJS + TypeORM + Supabase Postgres. Frontend is Angular 17+ (standalone) + Angular Material 3.

---

## Core Development Principles

### SOLID, DRY, KISS

- **Single Responsibility**: Each class/function does one thing well
- **DRY**: Extract code on 2nd use (no earlier, no later)
- **KISS**: Simple solutions over clever ones. I'm not a frontend expert — keep UI code straightforward

### Code Readability

Code must read like a story. If you need to backtrack to understand logic, refactor it.

**Good:**
```typescript
async getProduct(id: string): Promise<Product> {
  const product = await this.repository.findById(id);
  if (!product) throw new ProductNotFoundError(id);
  
  return product;
}
```

**Bad:**
```typescript
async getProduct(id: string): Promise<Product> {
  const product = await this.repository.findById(id);
  if (product) {
    return product;
  } else {
    throw new ProductNotFoundError(id);
  }
}
```

---

## Repository Structure

```
├── ui/         # Angular 17+ standalone app
├── api/        # NestJS backend
├── database/   # Source of truth: hand-written SQL migrations, seed scripts, ERD
└── bruno/      # API collections (folder per module: auth/, products/, cart/, orders/)
```

**The `database/` folder is the source of truth.** All schema changes are hand-written SQL migrations committed here, then wrapped in TypeORM migration files.

---

## Code Organization

### File Structure

- **Every component/feature:** separate `.ts`, `.html`, `.scss` files
- **NO inline templates or styles**
- **Naming:** `kebab-case` for files and folders
  - ✅ `product-card.component.ts`, `user-profile.service.ts`
  - ❌ `ProductCard.component.ts`, `UserProfileService.ts`

### Folder Depth

**Max 3-4 levels.** If deeper, rethink the structure.

```
✅ api/src/modules/products/services/
✅ ui/src/app/features/products/components/
❌ api/src/modules/products/services/queries/filters/
```

### Function Length

**Max 20-30 lines.** If longer, break into private helper methods.

---

## TypeScript Standards

### Strictness

- **`strict: true`** in both `ui/` and `api/`
- **Avoid `any`** — use `unknown` when type is unclear
- **`any` allowed ONLY with a justification comment:**

```typescript
// Using 'any' here because Supabase Storage returns an untyped response
// TODO: Create a proper type in v2
const uploadResult: any = await storage.upload(...);
```

### Import Paths

**Always use path aliases** (defined in `tsconfig.json`):

```typescript
✅ import { UiTableComponent } from '@shared/components/table';
✅ import { ProductsService } from '@app/modules/products';
❌ import { UiTableComponent } from '../../../shared/components/table';
```

---

## Validation Strategy

### Guard Clauses (Simple Checks)

Use early returns for simple validation:

```typescript
async updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
  if (!id) throw new InvalidIdError();
  if (dto.stock < 0) throw new InvalidStockError();
  
  // Happy path continues without nesting
  const product = await this.repository.findById(id);
  if (!product) throw new ProductNotFoundError(id);
  
  return this.repository.save({ ...product, ...dto });
}
```

### Dedicated Validators (Complex Logic)

For complex validation (cross-field, async checks, business rules), extract into validator classes:

```typescript
// validators/create-order.validator.ts
export class CreateOrderValidator {
  async validate(dto: CreateOrderDto): Promise<void> {
    await this.validateStock(dto.items);
    await this.validateUserBalance(dto.userId, dto.total);
    this.validateItemPrices(dto.items);
  }
  
  private async validateStock(items: OrderItemDto[]): Promise<void> {
    // Complex stock check logic
  }
}
```

---

## Error Handling

### Domain-Specific Error Classes

Create custom error classes for each domain error:

```typescript
// errors/product-not-found.error.ts
export class ProductNotFoundError extends Error {
  constructor(productId: string) {
    super(`Product with ID ${productId} not found`);
    this.name = 'ProductNotFoundError';
  }
}

// errors/insufficient-stock.error.ts
export class InsufficientStockError extends Error {
  constructor(productId: string, requested: number, available: number) {
    super(`Insufficient stock for product ${productId}. Requested: ${requested}, Available: ${available}`);
    this.name = 'InsufficientStockError';
  }
}
```

### Global Exception Filter

Let NestJS's global exception filter catch and format errors centrally:

```typescript
// common/filters/http-exception.filter.ts
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Map domain errors to HTTP responses
    if (exception instanceof ProductNotFoundError) {
      return new NotFoundException(exception.message);
    }
    // ...
  }
}
```

**Don't wrap every method in try-catch.** Let errors bubble up to the filter.

---

## API Response Format

All successful responses wrapped in an envelope:

```typescript
// Success
{
  "data": Product | Product[] | { /* complex object */ },
  "meta": {           // Optional, for paginated responses
    "page": 1,
    "limit": 20,
    "total": 150
  }
}

// Error (handled by exception filter)
{
  "statusCode": 404,
  "message": "Product with ID abc123 not found",
  "error": "Not Found"
}
```

Implement a `ResponseInterceptor` to wrap all controller responses automatically.

---

## Testing Strategy

### Integration Tests First

**Priority: integration tests with real database** (`.env.test` pointing to a test schema in Supabase).

Why:
- Can set breakpoints and debug full flows
- Mirrors real-world usage
- Catches integration issues early

```typescript
// test/modules/products.integration.spec.ts
describe('Products Integration', () => {
  let app: INestApplication;
  let productsService: ProductsService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule], // Real module, real DB
    }).compile();

    productsService = app.get(ProductsService);
  });

  it('should create a product and retrieve it', async () => {
    const created = await productsService.create(mockProductDto);
    expect(created.id).toBeDefined();

    const retrieved = await productsService.findById(created.id);
    expect(retrieved.name).toBe(mockProductDto.name);
  });
});
```

### Unit Tests (Secondary)

Use for isolated logic only (e.g., utility functions, validators):

```typescript
// validators/email.validator.spec.ts
describe('EmailValidator', () => {
  it('should reject invalid email', () => {
    expect(() => validator.validate('not-an-email')).toThrow();
  });
});
```

---

## Database Migrations

### Hand-Written SQL Only

**No auto-generated migrations.** The `database/` folder is the source of truth.

#### Process:

1. **Write SQL migration** in `database/migrations/YYYYMMDD_description.sql`:

```sql
-- database/migrations/20260303_add_products_table.sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_sku ON products(sku);
```

2. **Apply to Supabase** via the SQL editor or CLI

3. **Create TypeORM wrapper** for local dev consistency:

```typescript
// api/migrations/20260303_add_products_table.ts
export class AddProductsTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Paste the same SQL here
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE products`);
  }
}
```

---

## Frontend Architecture (Angular)

### Component Structure

**Standalone components only.** No `NgModule` boilerplate.

```typescript
// product-card.component.ts
import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UiButtonComponent } from '@shared/components/button';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [MatCardModule, UiButtonComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  product = input.required<Product>();
  addToCart = output<Product>();
}
```

### State Management

- **Signals** for local component state
- **Services** for shared state
- **Minimal RxJS** (only where Angular Material or HttpClient requires it)

```typescript
// products.service.ts (shared state)
@Injectable({ providedIn: 'root' })
export class ProductsService {
  private productsSignal = signal<Product[]>([]);
  readonly products = this.productsSignal.asReadonly();

  async loadProducts(): Promise<void> {
    const data = await this.http.get<ApiResponse<Product[]>>('/api/products');
    this.productsSignal.set(data.data);
  }
}
```

### Dependency Injection

Use `inject()` function (modern Angular):

```typescript
export class ProductsComponent {
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);
  
  async ngOnInit() {
    await this.productsService.loadProducts();
  }
}
```

### Generic Components

Shared components in `ui/src/app/shared/components/` are **generic and reusable**. Feature components **compose** them:

```typescript
// shared/components/table/ui-table.component.ts
export class UiTableComponent<T> {
  data = input.required<T[]>();
  columns = input.required<ColumnDef<T>[]>();
}

// features/products/products-table.component.ts
export class ProductsTableComponent {
  products = input.required<Product[]>();
  
  columns: ColumnDef<Product>[] = [
    { key: 'name', header: 'Product', sortable: true },
    { key: 'price', header: 'Price', formatter: (v) => `$${v}` },
  ];
}
```

**Use generics where they add value without sacrificing readability.**

---

## Git Workflow

### Conventional Commits

```
feat: add product filtering by category
fix: correct cart total calculation
chore: update dependencies
docs: add API endpoint documentation
test: add integration tests for orders
refactor: simplify product service logic
```

### Branch Strategy

- `main` — production-ready code
- `develop` — integration branch
- `feature/description` — feature branches
- `fix/description` — bugfix branches

---

## API Documentation (Bruno)

Every endpoint must have a corresponding `.bru` file in `bruno/api/<module>/`.

### Organization

```
bruno/
└── api/
    ├── auth/
    │   ├── login.bru
    │   └── register.bru
    ├── products/
    │   ├── list-products.bru
    │   ├── get-product.bru
    │   ├── create-product.bru
    │   └── update-product.bru
    ├── cart/
    └── orders/
```

### Example `.bru` File

```
meta {
  name: List Products
  type: http
  seq: 1
}

get {
  url: {{baseUrl}}/products?page=1&limit=20&category=cpu
  body: none
}

params:query {
  page: 1
  limit: 20
  category: cpu
}

tests {
  test("Status is 200", function() {
    expect(res.status).to.equal(200);
  });
  
  test("Response has data array", function() {
    expect(res.body.data).to.be.an('array');
  });
}
```

---

## Spec-Driven Development

For every new feature/requirement:

### 1. Plan
- What problem are we solving?
- What's the expected behavior?
- What are the edge cases?

### 2. Analysis
- What entities/tables are affected?
- What's the data flow?
- What are the dependencies?

### 3. Specify
- Write acceptance criteria
- Define API contract (request/response)
- List database schema changes

### 4. Break Into Tasks
- Database migration
- Entity creation
- Repository methods
- Service logic
- Controller endpoint
- DTO validation
- Integration tests
- Bruno collection entry
- Frontend component (if applicable)

### 5. Implementation
- Write failing tests first (TDD for complex logic)
- Implement tasks one by one
- Verify each task with a meaningful test case
- Update Bruno collection
- Manual test via Bruno

---

## Comments and Documentation

**Minimal comments. Code should be self-explanatory.**

### When to Comment:

✅ **Complex business logic**
```typescript
// Stock reservation expires after 15 minutes to prevent deadlocks
// during high-traffic checkout flows
const RESERVATION_TTL_MS = 15 * 60 * 1000;
```

✅ **Non-obvious workarounds**
```typescript
// Supabase Storage doesn't support atomic operations,
// so we manually handle cleanup if the DB transaction fails
```

✅ **TODOs with context**
```typescript
// TODO: Replace with Azure Blob Storage once Key Vault is configured
```

❌ **Don't comment the obvious**
```typescript
// Get product by ID
async getProduct(id: string): Promise<Product> { ... }
```

---

## Anti-Patterns to Avoid

### ❌ Nested Ifs (Spaghetti Code)

```typescript
// BAD
if (user) {
  if (user.isActive) {
    if (user.hasPermission('admin')) {
      // do something
    }
  }
}
```

```typescript
// GOOD - Guard clauses
if (!user) throw new UserNotFoundError();
if (!user.isActive) throw new InactiveUserError();
if (!user.hasPermission('admin')) throw new ForbiddenError();

// Happy path — no nesting
```

### ❌ Magic Numbers

```typescript
// BAD
if (stock < 5) { ... }

// GOOD
const LOW_STOCK_THRESHOLD = 5;
if (stock < LOW_STOCK_THRESHOLD) { ... }
```

### ❌ God Classes

If a service has >10 methods or >200 lines, split it.

```typescript
// BAD: ProductsService doing too much
class ProductsService {
  create() { ... }
  update() { ... }
  delete() { ... }
  findById() { ... }
  search() { ... }
  exportToCsv() { ... }
  importFromCsv() { ... }
  generateReport() { ... }
  sendEmailNotification() { ... }
}

// GOOD: Split responsibilities
class ProductsService {
  create() { ... }
  update() { ... }
  findById() { ... }
}

class ProductsSearchService { ... }
class ProductsExportService { ... }
class ProductsReportService { ... }
```

### ❌ Boilerplate

Don't add code that doesn't solve a problem. If a class/function/abstraction isn't pulling its weight, delete it.

---

## Final Reminders

1. **Keep frontend simple** — I'm not a frontend dev. Prefer straightforward Angular patterns over clever hacks.
2. **Database is source of truth** — All schema changes start in `database/`, not in TypeORM entities.
3. **Integration tests > unit tests** — I want to debug real flows.
4. **Bruno first** — Every endpoint needs a `.bru` file before it's considered "done".
5. **Extract on 2nd use** — Not before, not after.
6. **Max 20-30 lines per function.**
7. **Code reads like a story** — No backtracking to understand logic.

---

When in doubt, ask: **"Is this simple, readable, and testable?"** If no, refactor.
