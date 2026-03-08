/**
 * QUICK REFERENCE: Creating New Integration Tests
 * 
 * Follow these 5 simple steps to create any integration test.
 */

// ============================================================================
// STEP 1: Import base class
// ============================================================================
import { BaseIntegrationTest } from '@test/setup/base-integration.test';

// ============================================================================
// STEP 2: Create test class extending BaseIntegrationTest
// ============================================================================
class MyServiceTest extends BaseIntegrationTest {
  private myService: MyService; // Your service
  private myRepository: MyRepository; // Optional: direct repo access

  protected async beforeTestSetup() {
    // Create NestJS module with your dependencies
    const module = await this.createTestingModule({
      providers: [MyService, MyRepository],
    });

    // Get instances
    this.myService = module.get(MyService);
    this.myRepository = module.get(MyRepository);
  }
}

// ============================================================================
// STEP 3: Create instance and wire hooks (COPY-PASTE THIS)
// ============================================================================
const test = new MyServiceTest();

beforeAll(async () => await test.beforeAll());
beforeEach(async () => await test.beforeEach());
afterEach(async () => await test.afterEach());
afterAll(async () => await test.afterAll());

// ============================================================================
// STEP 4: Write tests using builders
// ============================================================================
describe('myMethod', () => {
  it('should do something', async () => {
    // ARRANGE: Create test data using fluent builders
    const user = await test['builder'].user()
      .withEmail('test@example.com')
      .withRole('customer')
      .create();

    const product = await test['builder'].product()
      .withName('Test Product')
      .withPrice(99.99)
      .withStock(50)
      .create();

    // ACT: Call your service method
    const result = await test['myService'].doSomething(user.id, product.id);

    // ASSERT: Verify response
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();

    // ASSERT: Verify database state
    const exists = await test['assertExists']('my_table', result.id);
    expect(exists).toBe(true);

    // Query database directly if needed
    const [record] = await test['query'](
      'SELECT * FROM my_table WHERE id = $1',
      [result.id]
    );
    expect(record.field).toBe('expected_value');

    // CLEANUP: Automatic! No manual cleanup needed.
  });
});

// ============================================================================
// AVAILABLE BUILDERS
// ============================================================================

// User Builder
const user = await builder.user()
  .withEmail('user@example.com')
  .withPassword('password123')
  .withRole('role-customer')
  .withStatus('Active')
  .create();

// Product Builder
const product = await builder.product()
  .withName('RTX 4090')
  .withSku('GPU-4090-001')
  .withPrice(1599.99)
  .withStock(100)
  .inCategory(categoryId)
  .withStatus('Active')
  .create();

// Category Builder
const category = await builder.category()
  .withName('Graphics Cards')
  .withSlug('graphics-cards')
  .create();

// Order Builder
const order = await builder.order()
  .forUser(userId)
  .withStatus('Pending')
  .withTotal(1599.99)
  .create();

// Cart Builder
const cart = await builder.cart()
  .forUser(userId)
  .create();

// Role Builder
const role = await builder.role()
  .withName('Test Role')
  .create();

// Create Multiple
const users = await builder.user().createMany(10);
const products = await builder.product().createMany(5);

// ============================================================================
// HELPER METHODS
// ============================================================================

// Check if entity exists
const exists = await test['assertExists']('table_name', id);
expect(exists).toBe(true);

// Check if entity doesn't exist
const notExists = await test['assertNotExists']('table_name', id);
expect(notExists).toBe(true);

// Run raw SQL query
const results = await test['query']<MyType>(
  'SELECT * FROM products WHERE price > $1',
  [1000]
);

// Get repository
const repo = test['getRepository'](MyEntity);

// Get service
const service = test['getService'](MyService);

// ============================================================================
// TESTING PATTERNS
// ============================================================================

// Pattern 1: Test Create Operation
it('should create entity and persist to database', async () => {
  const dto = { name: 'Test', value: 100 };
  
  const result = await service.create(dto);
  
  expect(result.id).toBeDefined();
  expect(await test['assertExists']('table', result.id)).toBe(true);
});

// Pattern 2: Test Update Operation
it('should update entity', async () => {
  const entity = await builder.entity().create();
  
  const result = await service.update(entity.id, { name: 'Updated' });
  
  const [updated] = await test['query'](
    'SELECT * FROM table WHERE id = $1',
    [entity.id]
  );
  expect(updated.name).toBe('Updated');
});

// Pattern 3: Test Delete Operation
it('should delete entity', async () => {
  const entity = await builder.entity().create();
  
  await service.delete(entity.id);
  
  expect(await test['assertNotExists']('table', entity.id)).toBe(true);
});

// Pattern 4: Test Error Cases
it('should throw error when entity not found', async () => {
  await expect(
    service.findById('non-existent-id')
  ).rejects.toThrow('Not found');
});

// Pattern 5: Test Complex Flows (Multiple Entities)
it('should create order and update product stock', async () => {
  const user = await builder.user().create();
  const product = await builder.product().withStock(100).create();
  
  await service.createOrder({
    userId: user.id,
    items: [{ productId: product.id, quantity: 5 }]
  });
  
  const [updated] = await test['query'](
    'SELECT stock FROM products WHERE id = $1',
    [product.id]
  );
  expect(updated.stock).toBe(95);
});

// Pattern 6: Test Transactions/Rollbacks
it('should rollback on error', async () => {
  const user = await builder.user().create();
  const product = await builder.product().withStock(5).create();
  
  await expect(
    service.createOrder({
      userId: user.id,
      items: [{ productId: product.id, quantity: 10 }] // More than available
    })
  ).rejects.toThrow('Insufficient stock');
  
  // Verify no order created (rollback)
  const orders = await test['query'](
    'SELECT * FROM orders WHERE user_id = $1',
    [user.id]
  );
  expect(orders).toHaveLength(0);
  
  // Verify stock unchanged
  const [unchanged] = await test['query'](
    'SELECT stock FROM products WHERE id = $1',
    [product.id]
  );
  expect(unchanged.stock).toBe(5);
});

// Pattern 7: Test Queries/Filters
it('should filter entities by criteria', async () => {
  await builder.product().withPrice(100).createMany(3);
  await builder.product().withPrice(200).createMany(2);
  
  const results = await service.findByPrice({ min: 150 });
  
  expect(results).toHaveLength(2);
  results.forEach(r => expect(r.price).toBeGreaterThan(150));
});

// ============================================================================
// COMMON MISTAKES TO AVOID
// ============================================================================

// ❌ DON'T: Manually insert test data
await test['query'](`INSERT INTO users ...`);

// ✅ DO: Use builders
const user = await test['builder'].user().create();

// ❌ DON'T: Manually clean up
afterEach(async () => {
  await test['query']('DELETE FROM users WHERE id = $1', [userId]);
});

// ✅ DO: Let base class handle cleanup automatically
// Cleanup happens automatically in BaseIntegrationTest.afterEach()

// ❌ DON'T: Only test return values
expect(result.name).toBe('Test');

// ✅ DO: Verify database state too
expect(result.name).toBe('Test');
const [persisted] = await test['query']('SELECT * FROM table WHERE id = $1', [result.id]);
expect(persisted.name).toBe('Test');

// ❌ DON'T: Skip error cases
it('should create entity', async () => { /* only happy path */ });

// ✅ DO: Test both happy and error paths
it('should create entity', async () => { /* happy path */ });
it('should throw error when invalid', async () => { /* error path */ });

// ============================================================================
// THAT'S IT!
// ============================================================================
// 1. Extend BaseIntegrationTest
// 2. Wire up hooks (copy-paste)
// 3. Use builders for test data
// 4. Write tests
// 5. Cleanup automatic
