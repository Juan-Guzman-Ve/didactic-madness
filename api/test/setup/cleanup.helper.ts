import { DataSource } from 'typeorm';

/**
 * Handles automatic cleanup of test data.
 * Tracks all created entities and removes them after each test.
 */
export class CleanupHelper {
  constructor(private dataSource: DataSource) {}

  /**
   * Clean up all test data created by builders.
   * Called automatically by BaseIntegrationTest.
   */
  async cleanupAll(): Promise<void> {
    // Get tracking from test data builder
    const createdEntities = (global as any).__testDataBuilder?.getCreatedEntities();
    
    if (!createdEntities) {
      return;
    }

    // Delete in reverse order to handle foreign keys
    const tables = [
      'order_status_history',
      'order_items',
      'orders',
      'cart_items',
      'carts',
      'product_images',
      'products',
      'categories',
      'addresses',
      'users',
      'role_policies',
      'policies',
      'roles',
    ];

    for (const table of tables) {
      const ids = createdEntities.get(table);
      if (ids && ids.size > 0) {
        await this.cleanupByIds(table, Array.from(ids));
      }
    }

    // Clear tracking
    createdEntities.clear();
  }

  /**
   * Clean up specific entities by ID
   */
  async cleanupByIds(tableName: string, ids: string[]): Promise<void> {
    if (ids.length === 0) return;

    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
    await this.dataSource.query(
      `DELETE FROM ${tableName} WHERE id IN (${placeholders})`,
      ids,
    );
  }

  /**
   * Clean up all records with IDs starting with 'test-'
   * Useful for manual cleanup or test setup.
   */
  async cleanupAllTestRecords(): Promise<void> {
    const tables = [
      'order_status_history',
      'order_items',
      'orders',
      'cart_items',
      'carts',
      'product_images',
      'products',
      'categories',
      'addresses',
      'users',
      'role_policies',
      'policies',
      'roles',
    ];

    for (const table of tables) {
      await this.dataSource.query(
        `DELETE FROM ${table} WHERE id LIKE 'test-%'`,
      );
    }
  }

  /**
   * Clean up a single entity by ID
   */
  async cleanupEntity(tableName: string, id: string): Promise<void> {
    await this.dataSource.query(`DELETE FROM ${tableName} WHERE id = $1`, [
      id,
    ]);
  }

  /**
   * Truncate all tables (use with caution!)
   * Useful for cleaning up before/after test suite.
   */
  async truncateAllTables(): Promise<void> {
    const tables = [
      'order_status_history',
      'order_items',
      'orders',
      'cart_items',
      'carts',
      'product_images',
      'products',
      'categories',
      'addresses',
      'users',
      'role_policies',
      'policies',
      'roles',
    ];

    // Disable triggers temporarily
    await this.dataSource.query('SET session_replication_role = replica;');

    for (const table of tables) {
      await this.dataSource.query(`TRUNCATE TABLE ${table} CASCADE`);
    }

    // Re-enable triggers
    await this.dataSource.query('SET session_replication_role = DEFAULT;');
  }
}
