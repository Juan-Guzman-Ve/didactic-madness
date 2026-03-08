import { BaseIntegrationTest } from '@test/setup/base-integration.test';

/**
 * Example integration test for a Products service.
 * Shows how simple it is to write tests with the base infrastructure.
 */
describe('ProductsService Integration Tests', () => {
  class ProductsServiceTest extends BaseIntegrationTest {
    private productsService: any; // Replace with actual ProductsService type

    protected async beforeTestSetup() {
      // Set up your module with required providers
      const module = await this.createTestingModule({
        providers: [
          // ProductsService,
          // ProductsRepository,
          // Any other dependencies
        ],
      });

      // Get service instance
      // this.productsService = module.get(ProductsService);
    }
  }

  const test = new ProductsServiceTest();

  beforeAll(async () => {
    await test.beforeAll();
  });

  beforeEach(async () => {
    await test.beforeEach();
  });

  afterEach(async () => {
    await test.afterEach();
  });

  afterAll(async () => {
    await test.afterAll();
  });

  describe('createProduct', () => {
    it('should create a product and persist to database', async () => {
      // Arrange - Create test category using builder
      const category = await test['builder'].category()
        .withName('Graphics Cards')
        .withSlug('graphics-cards')
        .create();

      // Act - Create product
      const productDto = {
        name: 'RTX 4090',
        sku: 'GPU-4090-001',
        price: 1599.99,
        stock: 50,
        categoryId: category.id,
      };

      // const result = await test['productsService'].createProduct(productDto);

      // Assert - Verify response
      // expect(result.id).toBeDefined();
      // expect(result.name).toBe('RTX 4090');

      // Assert - Verify actually persisted to database
      // const exists = await test['assertExists']('products', result.id);
      // expect(exists).toBe(true);

      // Cleanup happens automatically!
    });

    it('should throw error when SKU already exists', async () => {
      // Arrange - Create existing product
      const existing = await test['builder'].product()
        .withSku('DUPLICATE-SKU')
        .create();

      // Act & Assert - Expect error
      const dto = {
        name: 'Another Product',
        sku: 'DUPLICATE-SKU',
        price: 99.99,
      };

      // await expect(test['productsService'].createProduct(dto))
      //   .rejects.toThrow('SKU already exists');
    });
  });

  describe('updateProduct', () => {
    it('should update product and persist changes', async () => {
      // Arrange - Create test product
      const product = await test['builder'].product()
        .withName('Original Name')
        .withPrice(99.99)
        .create();

      // Act - Update
      const updateDto = {
        name: 'Updated Name',
        price: 149.99,
      };

      // const result = await test['productsService'].updateProduct(
      //   product.id,
      //   updateDto,
      // );

      // Assert - Verify response
      // expect(result.name).toBe('Updated Name');
      // expect(result.price).toBe(149.99);

      // Assert - Verify in database
      // const [updated] = await test['query'](
      //   'SELECT * FROM products WHERE id = $1',
      //   [product.id],
      // );
      // expect(updated.name).toBe('Updated Name');
      // expect(updated.price).toBe('149.99');
    });
  });

  describe('decreaseStock', () => {
    it('should decrease stock when sufficient quantity available', async () => {
      // Arrange
      const product = await test['builder'].product()
        .withStock(100)
        .create();

      // Act
      // await test['productsService'].decreaseStock(product.id, 25);

      // Assert - Verify stock decreased
      // const [updated] = await test['query'](
      //   'SELECT stock FROM products WHERE id = $1',
      //   [product.id],
      // );
      // expect(updated.stock).toBe(75);
    });

    it('should throw error when insufficient stock', async () => {
      // Arrange
      const product = await test['builder'].product()
        .withStock(10)
        .create();

      // Act & Assert
      // await expect(
      //   test['productsService'].decreaseStock(product.id, 25),
      // ).rejects.toThrow('Insufficient stock');
    });
  });

  describe('findByCategory', () => {
    it('should return all products in category', async () => {
      // Arrange - Create category with multiple products
      const category = await test['builder'].category()
        .withName('CPUs')
        .create();

      const product1 = await test['builder'].product()
        .withName('Intel i9')
        .inCategory(category.id)
        .create();

      const product2 = await test['builder'].product()
        .withName('AMD Ryzen')
        .inCategory(category.id)
        .create();

      // Create product in different category
      const otherCategory = await test['builder'].category().create();
      await test['builder'].product()
        .inCategory(otherCategory.id)
        .create();

      // Act
      // const results = await test['productsService'].findByCategory(
      //   category.id,
      // );

      // Assert - Should only return products from this category
      // expect(results).toHaveLength(2);
      // expect(results.map(p => p.id)).toContain(product1.id);
      // expect(results.map(p => p.id)).toContain(product2.id);
    });
  });
});
