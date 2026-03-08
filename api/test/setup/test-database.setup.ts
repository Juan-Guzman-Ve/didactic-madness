import { DataSource } from 'typeorm';

/**
 * Manages test database connections.
 * Implements singleton pattern to share connection across all tests.
 */
export class TestDatabaseSetup {
  private static dataSource: DataSource;

  /**
   * Set up test database connection.
   * Reads from .env.test file.
   */
  static async setupTestDatabase(): Promise<DataSource> {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    // Load test environment variables
    require('dotenv').config({ path: '.env.test' });

    this.dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      schema: process.env.DB_SCHEMA || 'public',
      synchronize: false, // Never auto-sync in tests
      logging: process.env.DB_LOGGING === 'true',
      entities: ['src/**/*.entity.ts'],
      migrations: [],
    });

    await this.dataSource.initialize();

    console.log(`✅ Test database connected: ${process.env.DB_DATABASE}`);

    return this.dataSource;
  }

  /**
   * Close test database connection.
   * Call in global afterAll.
   */
  static async closeTestDatabase(): Promise<void> {
    if (this.dataSource?.isInitialized) {
      await this.dataSource.destroy();
      console.log('✅ Test database connection closed');
    }
  }

  /**
   * Get the current data source instance.
   */
  static getDataSource(): DataSource {
    if (!this.dataSource?.isInitialized) {
      throw new Error(
        'DataSource not initialized. Call setupTestDatabase() first.',
      );
    }
    return this.dataSource;
  }
}
