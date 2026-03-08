import { BaseIntegrationTest } from '@test/setup/base-integration.test';

/**
 * Example integration test for an Orders service.
 * Demonstrates testing complex business logic with multiple entities.
 */
describe('OrdersService Integration Tests', () => {
  class OrdersServiceTest extends BaseIntegrationTest {
    private ordersService: any; // Replace with actual OrdersService

    protected async beforeTestSetup() {
      const module = await this.createTestingModule({
        providers: [
          // OrdersService,
          // OrdersRepository,
          // ProductsService,
        ],
      });

      // this.ordersService = module.get(OrdersService);
    }
  }

  const test = new OrdersServiceTest();

  beforeAll(async () => await test.beforeAll());
  beforeEach(async () => await test.beforeEach());
  afterEach(async () => await test.afterEach());
  afterAll(async () => await test.afterAll());

  describe('createOrder', () => {
    it('should create order and decrease product stock', async () => {
      // Arrange - Set up test data using builders
      const user = await test['builder'].user()
        .withEmail('customer@example.com')
        .create();

      const product1 = await test['builder'].product()
        .withName('RTX 4090')
        .withPrice(1599.99)
        .withStock(100)
        .create();

      const product2 = await test['builder'].product()
        .withName('Intel i9')
        .withPrice(599.99)
        .withStock(50)
        .create();

      // Act - Create order
      const orderDto = {
        userId: user.id,
        items: [
          { productId: product1.id, quantity: 2 },
          { productId: product2.id, quantity: 1 },
        ],
      };

      // const result = await test['ordersService'].createOrder(orderDto);

      // Assert - Verify order created
      // expect(result.id).toBeDefined();
      // expect(result.totalAmount).toBe(3799.97); // 2*1599.99 + 1*599.99

      // Assert - Verify order persisted
      // const orderExists = await test['assertExists']('orders', result.id);
      // expect(orderExists).toBe(true);

      // Assert - Verify order items persisted
      // const orderItems = await test['query'](
      //   'SELECT * FROM order_items WHERE order_id = $1',
      //   [result.id],
      // );
      // expect(orderItems).toHaveLength(2);

      // Assert - Verify stock decreased
      // const [updatedProduct1] = await test['query'](
      //   'SELECT stock FROM products WHERE id = $1',
      //   [product1.id],
      // );
      // expect(updatedProduct1.stock).toBe(98); // 100 - 2

      // const [updatedProduct2] = await test['query'](
      //   'SELECT stock FROM products WHERE id = $1',
      //   [product2.id],
      // );
      // expect(updatedProduct2.stock).toBe(49); // 50 - 1

      // Cleanup happens automatically!
    });

    it('should rollback if any product has insufficient stock', async () => {
      // Arrange
      const user = await test['builder'].user().create();
      
      const inStock = await test['builder'].product()
        .withStock(100)
        .create();
      
      const outOfStock = await test['builder'].product()
        .withStock(5)
        .create();

      // Act & Assert - Should fail
      const orderDto = {
        userId: user.id,
        items: [
          { productId: inStock.id, quantity: 2 },
          { productId: outOfStock.id, quantity: 10 }, // More than available
        ],
      };

      // await expect(
      //   test['ordersService'].createOrder(orderDto),
      // ).rejects.toThrow('Insufficient stock');

      // Assert - Verify NO order was created
      // const orders = await test['query'](
      //   'SELECT * FROM orders WHERE user_id = $1',
      //   [user.id],
      // );
      // expect(orders).toHaveLength(0);

      // Assert - Verify stock NOT decreased (rollback)
      // const [product1] = await test['query'](
      //   'SELECT stock FROM products WHERE id = $1',
      //   [inStock.id],
      // );
      // expect(product1.stock).toBe(100); // Unchanged
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order and restore product stock', async () => {
      // Arrange - Create order first
      const user = await test['builder'].user().create();
      const product = await test['builder'].product()
        .withStock(100)
        .create();

      const order = await test['builder'].order()
        .forUser(user.id)
        .withStatus('Pending')
        .create();

      // Manually create order item for this test
      await test['query'](
        `INSERT INTO order_items (id, order_id, product_id, quantity, price_at_purchase, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [`test-oi-${Date.now()}`, order.id, product.id, 5, 1599.99],
      );

      // Decrease stock manually to simulate order creation
      await test['query'](
        'UPDATE products SET stock = stock - 5 WHERE id = $1',
        [product.id],
      );

      // Act - Cancel order
      // await test['ordersService'].cancelOrder(order.id);

      // Assert - Verify order status changed
      // const [updated] = await test['query'](
      //   'SELECT status FROM orders WHERE id = $1',
      //   [order.id],
      // );
      // expect(updated.status).toBe('Cancelled');

      // Assert - Verify stock restored
      // const [restoredProduct] = await test['query'](
      //   'SELECT stock FROM products WHERE id = $1',
      //   [product.id],
      // );
      // expect(restoredProduct.stock).toBe(100); // Back to original
    });
  });
});
