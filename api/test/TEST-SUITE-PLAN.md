# Test Suite Plan - Complete Guide

## Overview

This test suite infrastructure eliminates 90% of testing boilerplate, making it incredibly simple to create comprehensive integration tests.

## Key Benefits

✅ **No Boilerplate** - Extend one class, write tests
✅ **Automatic Cleanup** - All test data cleaned up automatically
✅ **Fluent Builders** - Create test data with readable, chainable API
✅ **Type-Safe** - Full TypeScript support
✅ **Real Database** - Test actual persistence, not mocks
✅ **Debuggable** - Set breakpoints, step through code

## Architecture

### 1. Base Infrastructure (`test/setup/`)

**BaseIntegrationTest** - Abstract base class all tests extend
- Handles database setup/teardown
- Creates NestJS testing modules
- Tracks and cleans up all test data
- Provides helper methods

**TestDatabaseSetup** - Singleton database connection manager
- Reads from `.env.test`
- Shares connection across all tests
- Handles initialization and cleanup

**TestDataBuilder** - Fluent API for creating test data
- Chainable builder methods
- Sensible defaults
- Automatic tracking for cleanup

**CleanupHelper** - Automatic cleanup management
- Deletes all created test data
- Handles foreign key constraints correctly
- Runs after each test automatically

### 2. Test Files (`test/integration/`)

**TEMPLATE.spec.ts** - Copy this to create new tests
- Shows minimal setup required
- Demonstrates all patterns

**Example Tests:**
- `products/products.service.spec.ts` - Product CRUD operations
- `orders/orders.service.spec.ts` - Complex multi-entity flows

## Creating a New Test - 3 Steps

### Step 1: Copy Template

```bash
cp test/integration/TEMPLATE.spec.ts test/integration/my-module/my-service.spec.ts
```

### Step 2: Extend BaseIntegrationTest

```typescript
import { BaseIntegrationTest } from '@test/setup/base-integration.test';

describe('MyService Integration Tests', () => {
  class MyServiceTest extends BaseIntegrationTest {
    private myService: MyService;

    protected async beforeTestSetup() {
      const module = await this.createTestingModule({
        providers: [MyService, MyRepository],
      });
      this.myService = module.get(MyService);
    }
  }

  const test = new MyServiceTest();

  // Wire hooks (copy-paste these)
  beforeAll(async () => await test.beforeAll());
  beforeEach(async () => await test.beforeEach());
  afterEach(async () => await test.afterEach());
  afterAll(async () => await test.afterAll());

  // Write tests...
});
```

### Step 3: Write Tests with Builders

```typescript
it('should create entity', async () => {
  // Arrange - Use builders
  const user = await test['builder'].user().create();
  
  // Act - Call service
  const result = await test['myService'].doSomething(user.id);
  
  // Assert - Verify response and database
  expect(result.id).toBeDefined();
  expect(await test['assertExists']('table', result.id)).toBe(true);
});
```

## Fluent Builders

All builders follow the same pattern:

```typescript
const entity = await builder.entityType()
  .withProperty(value)
  .withAnotherProperty(value)
  .create();
```

### Available Builders

**User:**
```typescript
const user = await builder.user()
  .withEmail('test@example.com')
  .withPassword('password123')
  .withRole('role-customer')
  .withStatus('Active')
  .create();
```

**Product:**
```typescript
const product = await builder.product()
  .withName('RTX 4090')
  .withSku('GPU-4090-001')
  .withPrice(1599.99)
  .withStock(100)
  .inCategory(categoryId)
  .withStatus('Active')
  .create();
```

**Category:**
```typescript
const category = await builder.category()
  .withName('Graphics Cards')
  .withSlug('graphics-cards')
  .create();
```

**Order:**
```typescript
const order = await builder.order()
  .forUser(userId)
  .withStatus('Pending')
  .withTotal(1599.99)
  .create();
```

**Cart:**
```typescript
const cart = await builder.cart()
  .forUser(userId)
  .create();
```

**Role:**
```typescript
const role = await builder.role()
  .withName('Test Role')
  .create();
```

**Multiple Entities:**
```typescript
const users = await builder.user().createMany(10);
const products = await builder.product().createMany(5);
```

## Helper Methods

### Assertions

```typescript
// Verify entity exists in database
const exists = await test['assertExists']('products', productId);
expect(exists).toBe(true);

// Verify entity doesn't exist
const notExists = await test['assertNotExists']('products', productId);
expect(notExists).toBe(true);
```

### Direct Database Access

```typescript
// Run raw SQL query
const results = await test['query']<Product[]>(
  'SELECT * FROM products WHERE price > $1',
  [1000]
);

// With parameterized queries
const [user] = await test['query'](
  'SELECT * FROM users WHERE email = $1',
  ['test@example.com']
);
```

### Get Instances

```typescript
// Get repository
const productsRepo = test['getRepository'](Product);

// Get service
const authService = test['getService'](AuthService);
```

## Testing Patterns

### Pattern 1: Create Operation

```typescript
it('should create entity and persist to database', async () => {
  const dto = { name: 'Test', price: 99.99 };
  
  const result = await service.create(dto);
  
  // Verify response
  expect(result.id).toBeDefined();
  expect(result.name).toBe('Test');
  
  // Verify persisted
  expect(await test['assertExists']('products', result.id)).toBe(true);
  
  // Verify data correct in database
  const [persisted] = await test['query'](
    'SELECT * FROM products WHERE id = $1',
    [result.id]
  );
  expect(persisted.name).toBe('Test');
  expect(persisted.price).toBe('99.99');
});
```

### Pattern 2: Update Operation

```typescript
it('should update entity and persist changes', async () => {
  // Arrange - Create entity
  const product = await test['builder'].product()
    .withName('Original')
    .withPrice(100)
    .create();
  
  // Act - Update
  const result = await service.update(product.id, {
    name: 'Updated',
    price: 150
  });
  
  // Assert - Response
  expect(result.name).toBe('Updated');
  
  // Assert - Database
  const [updated] = await test['query'](
    'SELECT * FROM products WHERE id = $1',
    [product.id]
  );
  expect(updated.name).toBe('Updated');
  expect(updated.price).toBe('150');
});
```

### Pattern 3: Delete Operation

```typescript
it('should delete entity from database', async () => {
  const product = await test['builder'].product().create();
  
  await service.delete(product.id);
  
  expect(await test['assertNotExists']('products', product.id)).toBe(true);
});
```

### Pattern 4: Error Handling

```typescript
it('should throw error when entity not found', async () => {
  await expect(
    service.findById('non-existent-id')
  ).rejects.toThrow('Product with ID non-existent-id not found');
});

it('should throw error when validation fails', async () => {
  const dto = { name: '', price: -10 }; // Invalid
  
  await expect(
    service.create(dto)
  ).rejects.toThrow('Validation failed');
});
```

### Pattern 5: Complex Multi-Entity Flows

```typescript
it('should create order and decrease product stock', async () => {
  // Arrange - Create user and products
  const user = await test['builder'].user().create();
  const product1 = await test['builder'].product()
    .withPrice(100)
    .withStock(50)
    .create();
  const product2 = await test['builder'].product()
    .withPrice(200)
    .withStock(30)
    .create();
  
  // Act - Create order
  const result = await orderService.createOrder({
    userId: user.id,
    items: [
      { productId: product1.id, quantity: 2 },
      { productId: product2.id, quantity: 1 }
    ]
  });
  
  // Assert - Order created
  expect(result.id).toBeDefined();
  expect(result.totalAmount).toBe(400); // 2*100 + 1*200
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
  
  const [p2] = await test['query'](
    'SELECT stock FROM products WHERE id = $1',
    [product2.id]
  );
  expect(p2.stock).toBe(29); // 30 - 1
});
```

### Pattern 6: Transaction Rollback

```typescript
it('should rollback when operation fails', async () => {
  const user = await test['builder'].user().create();
  const product = await test['builder'].product()
    .withStock(5)
    .create();
  
  // Attempt to order more than available
  await expect(
    orderService.createOrder({
      userId: user.id,
      items: [{ productId: product.id, quantity: 10 }]
    })
  ).rejects.toThrow('Insufficient stock');
  
  // Verify NO order created (rollback)
  const orders = await test['query'](
    'SELECT * FROM orders WHERE user_id = $1',
    [user.id]
  );
  expect(orders).toHaveLength(0);
  
  // Verify stock unchanged (rollback)
  const [unchanged] = await test['query'](
    'SELECT stock FROM products WHERE id = $1',
    [product.id]
  );
  expect(unchanged.stock).toBe(5);
});
```

### Pattern 7: Queries and Filters

```typescript
it('should filter products by price range', async () => {
  // Create test data
  await test['builder'].product().withPrice(50).createMany(2);
  await test['builder'].product().withPrice(150).createMany(3);
  await test['builder'].product().withPrice(250).createMany(2);
  
  // Query with filter
  const results = await service.findByPriceRange(100, 200);
  
  // Assert
  expect(results).toHaveLength(3);
  results.forEach(p => {
    expect(p.price).toBeGreaterThanOrEqual(100);
    expect(p.price).toBeLessThanOrEqual(200);
  });
});
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install --save-dev jest @types/jest ts-jest @nestjs/testing dotenv tsconfig-paths
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.test.example .env.test

# Edit with your Supabase test credentials
# IMPORTANT: Use separate test database!
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# Debug mode
npm run test:debug
```

## Adding New Builders

When you add a new entity, add a builder:

### 1. Add method to TestDataBuilder

```typescript
// test/setup/test-data-builder.ts
address(): AddressBuilder {
  return new AddressBuilder(this.dataSource, this.createdEntities);
}
```

### 2. Create builder class

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

  withCity(city: string): this {
    this.data.city = city;
    return this;
  }

  protected async build(): Promise<any> {
    return {
      user_id: this.data.user_id,
      street_address: this.data.street_address || '123 Test St',
      city: this.data.city || 'Test City',
      state: this.data.state || 'TS',
      postal_code: this.data.postal_code || '12345',
      country: this.data.country || 'Test Country',
      is_default: this.data.is_default || false,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  protected getTableName(): string {
    return 'addresses';
  }
}
```

### 3. Use it

```typescript
const address = await builder.address()
  .forUser(userId)
  .withStreet('456 Main St')
  .withCity('New York')
  .create();
```

## Best Practices

### ✅ DO

- **Test through service layer** (full DTO → Domain → Repository → DB flow)
- **Use builders for all test data** (never manual SQL inserts)
- **Verify database state** after operations
- **Test both happy path AND error cases**
- **Test complex multi-entity flows**
- **Keep tests focused** (one concept per test)

### ❌ DON'T

- **Don't manually insert test data** (use builders)
- **Don't manually clean up** (automatic)
- **Don't only test return values** (verify database too)
- **Don't use mocks for database** (use real database)
- **Don't skip error cases**
- **Don't create god tests** (testing too much in one test)

## File Structure

```
api/
├── test/
│   ├── setup/
│   │   ├── base-integration.test.ts      # Base class - extend this
│   │   ├── test-database.setup.ts        # Database connection
│   │   ├── test-data-builder.ts          # Fluent builders
│   │   ├── cleanup.helper.ts             # Automatic cleanup
│   │   └── jest-setup.ts                 # Global setup
│   ├── integration/
│   │   ├── TEMPLATE.spec.ts              # Copy for new tests
│   │   ├── products/
│   │   │   └── products.service.spec.ts
│   │   ├── orders/
│   │   │   └── orders.service.spec.ts
│   │   └── [your-module]/
│   │       └── [your-service].spec.ts
│   ├── README.md                          # Full documentation
│   └── QUICK-REFERENCE.ts                 # All patterns
├── .env.test.example                      # Environment template
└── jest.config.ts                         # Jest configuration
```

## Troubleshooting

### Tests hang or timeout

- Check `.env.test` database credentials
- Verify test database is accessible
- Ensure `testTimeout: 30000` in `jest.config.ts`

### Cleanup fails

- Check foreign key constraints
- Verify tables exist in test database
- Check cleanup order in `cleanup.helper.ts`

### Cannot find modules

- Check path aliases in `tsconfig.json`
- Ensure `@test` and `@app` aliases are configured
- Restart TypeScript server (`Ctrl+Shift+P` > "Restart TS Server")

### Tests interfere with each other

- Ensure `maxWorkers: 1` in `jest.config.ts`
- Verify cleanup is working (check `afterEach`)
- Use separate test database

## Summary

This test suite infrastructure makes integration testing **simple and fast**:

1. **Extend `BaseIntegrationTest`** - Handles all setup/teardown
2. **Use fluent builders** - Create test data easily
3. **Write tests** - Test through service layer
4. **Automatic cleanup** - No manual cleanup needed

That's it! You can now write comprehensive integration tests with minimal boilerplate.

## Next Steps

1. Copy `.env.test.example` to `.env.test` and configure
2. Install dependencies: `npm install`
3. Copy `TEMPLATE.spec.ts` for your first test
4. Run tests: `npm test`
5. Start testing your services!

## Reference Files

- **Full Documentation:** [test/README.md](./README.md)
- **Quick Reference:** [test/QUICK-REFERENCE.ts](./QUICK-REFERENCE.ts)
- **Template:** [test/integration/TEMPLATE.spec.ts](./integration/TEMPLATE.spec.ts)
- **Examples:** 
  - [test/integration/products/products.service.spec.ts](./integration/products/products.service.spec.ts)
  - [test/integration/orders/orders.service.spec.ts](./integration/orders/orders.service.spec.ts)
