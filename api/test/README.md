# Test Suite Infrastructure

## Quick Start

### 1. Set up test database

```bash
# Copy environment template
cp .env.test.example .env.test

# Edit .env.test with your Supabase test credentials
# IMPORTANT: Use a separate test database/schema!
```

### 2. Install dependencies

```bash
npm install --save-dev jest @types/jest ts-jest @nestjs/testing dotenv
```

### 3. Create your first test

Copy `TEMPLATE.spec.ts` and customize:

```typescript
import { BaseIntegrationTest } from '@test/setup/base-integration.test';

describe('ProductsService Integration Tests', () => {
  class ProductsServiceTest extends BaseIntegrationTest {
    private productsService: ProductsService;

    protected async beforeTestSetup() {
      const module = await this.createTestingModule({
        providers: [ProductsService, ProductsRepository],
      });
      this.productsService = module.get(ProductsService);
    }
  }

  const test = new ProductsServiceTest();

  beforeAll(async () => await test.beforeAll());
  beforeEach(async () => await test.beforeEach());
  afterEach(async () => await test.afterEach());
  afterAll(async () => await test.afterAll());

  it('should create product', async () => {
    // Arrange
    const category = await test['builder'].category().create();
    
    // Act
    const result = await test['productsService'].createProduct({
      name: 'RTX 4090',
      categoryId: category.id,
      price: 1599.99,
    });
    
    // Assert
    expect(result.id).toBeDefined();
    const exists = await test['assertExists']('products', result.id);
    expect(exists).toBe(true);
    
    // Cleanup automatic!
  });
});
```

### 4. Run tests

```bash
npm test
```

## Architecture

### Base Classes

**BaseIntegrationTest** - Handles all boilerplate:
- Database connection setup/teardown
- Test module creation
- Automatic cleanup after each test
- Helper methods for assertions

### Builders (Fluent API)

Create test data easily:

```typescript
// User
const user = await builder.user()
  .withEmail('test@example.com')
  .withRole('customer')
  .create();

// Product  
const product = await builder.product()
  .withName('RTX 4090')
  .withPrice(1599.99)
  .withStock(100)
  .inCategory(categoryId)
  .create();

// Category
const category = await builder.category()
  .withName('Graphics Cards')
  .withSlug('graphics-cards')
  .create();

// Order
const order = await builder.order()
  .forUser(userId)
  .withStatus('Pending')
  .withTotal(1599.99)
  .create();

// Multiple entities
const users = await builder.user().createMany(10);
```

### Automatic Cleanup

All entities created by builders are automatically cleaned up after each test. No manual cleanup needed!

### Helper Methods

```typescript
// Verify entity exists
await test['assertExists']('products', productId);

// Verify entity doesn't exist
await test['assertNotExists']('products', productId);

// Run raw SQL
const results = await test['query'](
  'SELECT * FROM products WHERE price > $1',
  [1000]
);

// Get repository
const repo = test['getRepository'](Product);

// Get service
const service = test['getService'](ProductsService);
```

## File Structure

```
api/
├── test/
│   ├── setup/
│   │   ├── base-integration.test.ts    # Base class (extend this)
│   │   ├── test-database.setup.ts      # Database connection
│   │   ├── test-data-builder.ts        # Fluent builders
│   │   ├── cleanup.helper.ts           # Automatic cleanup
│   │   └── jest-setup.ts               # Global setup
│   ├── integration/
│   │   ├── TEMPLATE.spec.ts            # Copy for new tests
│   │   ├── products/
│   │   │   └── products.service.spec.ts
│   │   └── orders/
│   │       └── orders.service.spec.ts
│   └── e2e/
│       └── (HTTP endpoint tests)
├── .env.test.example
└── jest.config.ts
```

## Best Practices

### 1. Test Through Service Layer

Test full flow: DTO → Domain → Repository → Database

```typescript
it('should create and persist entity', async () => {
  // Call service (not repository directly)
  const result = await service.create(dto);
  
  // Verify response
  expect(result).toBeDefined();
  
  // Verify actually in database
  const exists = await test['assertExists']('table', result.id);
  expect(exists).toBe(true);
});
```

### 2. Use Builders for Test Data

Don't manually insert data - use builders:

```typescript
// ✅ GOOD
const user = await builder.user()
  .withEmail('test@example.com')
  .create();

// ❌ BAD
await query(`INSERT INTO users ...`);
```

### 3. Test Happy Path AND Error Cases

```typescript
describe('createProduct', () => {
  it('should create product successfully', async () => {
    // Happy path test
  });
  
  it('should throw error when SKU exists', async () => {
    // Error case test
    await expect(service.create(dto)).rejects.toThrow();
  });
});
```

### 4. Verify Database State

Don't just test the return value - verify persistence:

```typescript
it('should update product', async () => {
  const result = await service.update(id, dto);
  
  // Verify in database
  const [updated] = await test['query'](
    'SELECT * FROM products WHERE id = $1',
    [id]
  );
  expect(updated.name).toBe(dto.name);
});
```

### 5. Test Complex Flows

Integration tests shine with multi-step operations:

```typescript
it('should create order and decrease stock', async () => {
  const product = await builder.product().withStock(100).create();
  
  await orderService.createOrder({
    items: [{ productId: product.id, quantity: 5 }]
  });
  
  // Verify stock decreased
  const [updated] = await query(
    'SELECT stock FROM products WHERE id = $1',
    [product.id]
  );
  expect(updated.stock).toBe(95);
});
```

## Adding New Builders

To add a builder for a new entity:

1. Add method to `TestDataBuilder`:

```typescript
address(): AddressBuilder {
  return new AddressBuilder(this.dataSource, this.createdEntities);
}
```

2. Create builder class:

```typescript
class AddressBuilder extends BaseBuilder<any> {
  forUser(userId: string): this {
    this.data.user_id = userId;
    return this;
  }

  withStreet(street: string): this {
    this.data.street_address = street;
    return this;
  }

  protected async build(): Promise<any> {
    return {
      user_id: this.data.user_id,
      street_address: this.data.street_address || '123 Test St',
      city: this.data.city || 'Test City',
      // ...defaults
    };
  }

  protected getTableName(): string {
    return 'addresses';
  }
}
```

## Troubleshooting

**Tests hang:**
- Check database connection in `.env.test`
- Ensure test database is accessible

**Cleanup fails:**
- Check foreign key constraints
- Verify tables exist in test database

**Cannot find modules:**
- Check path aliases in `tsconfig.json`
- Restart TypeScript server

**Tests interfere with each other:**
- Ensure `maxWorkers: 1` in `jest.config.ts`
- Check cleanup is working

## Example: Complete Test

```typescript
describe('OrdersService', () => {
  class OrdersTest extends BaseIntegrationTest {
    private ordersService: OrdersService;

    protected async beforeTestSetup() {
      const module = await this.createTestingModule({
        providers: [OrdersService, OrdersRepository, ProductsService],
      });
      this.ordersService = module.get(OrdersService);
    }
  }

  const test = new OrdersTest();

  beforeAll(async () => await test.beforeAll());
  beforeEach(async () => await test.beforeEach());
  afterEach(async () => await test.afterEach());
  afterAll(async () => await test.afterAll());

  it('should create order with multiple items', async () => {
    // Arrange
    const user = await test['builder'].user().create();
    const product1 = await test['builder'].product()
      .withPrice(100)
      .withStock(50)
      .create();
    const product2 = await test['builder'].product()
      .withPrice(200)
      .withStock(30)
      .create();

    // Act
    const result = await test['ordersService'].createOrder({
      userId: user.id,
      items: [
        { productId: product1.id, quantity: 2 },
        { productId: product2.id, quantity: 1 },
      ],
    });

    // Assert - Response
    expect(result.id).toBeDefined();
    expect(result.totalAmount).toBe(400); // 2*100 + 1*200

    // Assert - Order persisted
    expect(await test['assertExists']('orders', result.id)).toBe(true);

    // Assert - Order items created
    const items = await test['query'](
      'SELECT * FROM order_items WHERE order_id = $1',
      [result.id]
    );
    expect(items).toHaveLength(2);

    // Assert - Stock decreased
    const [p1] = await test['query'](
      'SELECT stock FROM products WHERE id = $1',
      [product1.id]
    );
    expect(p1.stock).toBe(48); // 50 - 2
  });
});
```

That's it! Extend `BaseIntegrationTest`, use builders, write tests. Cleanup happens automatically.
