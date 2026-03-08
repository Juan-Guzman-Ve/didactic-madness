import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { TestDatabaseSetup } from './test-database.setup';
import { TestDataBuilder } from './test-data-builder';
import { CleanupHelper } from './cleanup.helper';

/**
 * Base class for all integration tests.
 * Handles database setup, cleanup, and provides test utilities.
 * 
 * Usage:
 * ```typescript
 * class MyServiceTest extends BaseIntegrationTest {
 *   private service: MyService;
 * 
 *   async beforeTestSetup() {
 *     const module = await this.createTestingModule({
 *       providers: [MyService, MyRepository],
 *     });
 *     this.service = module.get(MyService);
 *   }
 * 
 *   @Test()
 *   async shouldDoSomething() {
 *     const user = await this.builder.user().create();
 *     const result = await this.service.doSomething(user.id);
 *     expect(result).toBeDefined();
 *   }
 * }
 * ```
 */
export abstract class BaseIntegrationTest {
  protected dataSource: DataSource;
  protected builder: TestDataBuilder;
  protected cleanup: CleanupHelper;
  protected testModule: TestingModule;

  /**
   * Override this method to set up your test-specific dependencies.
   * Called automatically before each test.
   */
  protected abstract beforeTestSetup(): Promise<void>;

  /**
   * Creates a NestJS testing module with common providers.
   * Override to customize the module for your tests.
   */
  protected async createTestingModule(metadata: {
    imports?: any[];
    providers?: any[];
    controllers?: any[];
  }): Promise<TestingModule> {
    const module = await Test.createTestingModule({
      imports: metadata.imports || [],
      providers: [
        ...(metadata.providers || []),
        {
          provide: DataSource,
          useValue: this.dataSource,
        },
      ],
      controllers: metadata.controllers || [],
    }).compile();

    this.testModule = module;
    return module;
  }

  /**
   * Jest beforeAll hook - sets up database connection
   */
  async beforeAll(): Promise<void> {
    this.dataSource = await TestDatabaseSetup.setupTestDatabase();
    this.builder = new TestDataBuilder(this.dataSource);
    this.cleanup = new CleanupHelper(this.dataSource);
  }

  /**
   * Jest beforeEach hook - sets up test-specific dependencies
   */
  async beforeEach(): Promise<void> {
    await this.beforeTestSetup();
  }

  /**
   * Jest afterEach hook - cleans up test data automatically
   */
  async afterEach(): Promise<void> {
    await this.cleanup.cleanupAll();
    
    if (this.testModule) {
      await this.testModule.close();
    }
  }

  /**
   * Jest afterAll hook - closes database connection
   */
  async afterAll(): Promise<void> {
    await TestDatabaseSetup.closeTestDatabase();
  }

  /**
   * Helper to get a service from the testing module
   */
  protected getService<T>(type: new (...args: any[]) => T): T {
    return this.testModule.get<T>(type);
  }

  /**
   * Helper to get a repository from the testing module
   */
  protected getRepository<T>(entity: any): any {
    return this.dataSource.getRepository(entity);
  }

  /**
   * Execute raw SQL query (useful for verification)
   */
  protected async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    return this.dataSource.query(sql, params);
  }

  /**
   * Verify a record exists in the database
   */
  protected async assertExists(
    tableName: string,
    id: string,
  ): Promise<boolean> {
    const result = await this.query(
      `SELECT EXISTS(SELECT 1 FROM ${tableName} WHERE id = $1)`,
      [id],
    );
    return result[0].exists;
  }

  /**
   * Verify a record does NOT exist in the database
   */
  protected async assertNotExists(
    tableName: string,
    id: string,
  ): Promise<boolean> {
    return !(await this.assertExists(tableName, id));
  }
}
