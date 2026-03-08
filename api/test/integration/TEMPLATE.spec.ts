import { BaseIntegrationTest } from '@test/setup/base-integration.test';

/**
 * Simple template for creating new integration tests.
 * Copy this file and customize for your service.
 */
describe('MyService Integration Tests', () => {
  // 1. Create test class extending BaseIntegrationTest
  class MyServiceTest extends BaseIntegrationTest {
    private myService: any; // Replace with your service type

    // 2. Set up your module dependencies
    protected async beforeTestSetup() {
      const module = await this.createTestingModule({
        providers: [
          // Add your service and its dependencies here
          // MyService,
          // MyRepository,
        ],
      });

      // Get service instance
      // this.myService = module.get(MyService);
    }
  }

  // 3. Create test instance
  const test = new MyServiceTest();

  // 4. Wire up Jest lifecycle hooks (copy-paste these)
  beforeAll(async () => await test.beforeAll());
  beforeEach(async () => await test.beforeEach());
  afterEach(async () => await test.afterEach());
  afterAll(async () => await test.afterAll());

  // 5. Write your tests
  describe('methodName', () => {
    it('should do something', async () => {
      // Arrange - Create test data using builders
      const user = await test['builder'].user().create();
      const product = await test['builder'].product()
        .withName('Test Product')
        .withPrice(99.99)
        .create();

      // Act - Call your service method
      // const result = await test['myService'].doSomething(user.id, product.id);

      // Assert - Verify the result
      // expect(result).toBeDefined();
      // expect(result.id).toBeDefined();

      // Assert - Verify database state
      // const exists = await test['assertExists']('my_table', result.id);
      // expect(exists).toBe(true);

      // Cleanup happens automatically! No need to manually delete.
    });

    it('should handle error case', async () => {
      // Arrange
      const user = await test['builder'].user().create();

      // Act & Assert - Expect error
      // await expect(
      //   test['myService'].doSomething(user.id, 'invalid-id'),
      // ).rejects.toThrow('Expected error message');
    });
  });
});
