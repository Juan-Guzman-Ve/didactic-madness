import { DataSource } from 'typeorm';

/**
 * Fluent API for building test data.
 * Automatically tracks created entities for cleanup.
 * 
 * Usage:
 * ```typescript
 * const user = await builder.user()
 *   .withEmail('test@example.com')
 *   .withRole('customer')
 *   .create();
 * 
 * const product = await builder.product()
 *   .withName('RTX 4090')
 *   .withPrice(1599.99)
 *   .inCategory(categoryId)
 *   .create();
 * ```
 */
export class TestDataBuilder {
  private createdEntities: Map<string, Set<string>> = new Map();

  constructor(private dataSource: DataSource) {}

  /**
   * User builder
   */
  user(): UserBuilder {
    return new UserBuilder(this.dataSource, this.createdEntities);
  }

  /**
   * Product builder
   */
  product(): ProductBuilder {
    return new ProductBuilder(this.dataSource, this.createdEntities);
  }

  /**
   * Category builder
   */
  category(): CategoryBuilder {
    return new CategoryBuilder(this.dataSource, this.createdEntities);
  }

  /**
   * Order builder
   */
  order(): OrderBuilder {
    return new OrderBuilder(this.dataSource, this.createdEntities);
  }

  /**
   * Cart builder
   */
  cart(): CartBuilder {
    return new CartBuilder(this.dataSource, this.createdEntities);
  }

  /**
   * Role builder
   */
  role(): RoleBuilder {
    return new RoleBuilder(this.dataSource, this.createdEntities);
  }

  /**
   * Get all created entity IDs for cleanup
   */
  getCreatedEntities(): Map<string, Set<string>> {
    return this.createdEntities;
  }

  /**
   * Clear tracking (called by cleanup helper)
   */
  clear(): void {
    this.createdEntities.clear();
  }
}

/**
 * Base builder with common functionality
 */
abstract class BaseBuilder<T> {
  protected data: Partial<T> = {};

  constructor(
    protected dataSource: DataSource,
    protected createdEntities: Map<string, Set<string>>,
  ) {}

  /**
   * Create the entity in the database
   */
  async create(): Promise<T> {
    const entity = await this.build();
    const tableName = this.getTableName();
    const id = this.generateId();

    await this.insert(tableName, { ...entity, id });

    // Track for cleanup
    if (!this.createdEntities.has(tableName)) {
      this.createdEntities.set(tableName, new Set());
    }
    this.createdEntities.get(tableName)!.add(id);

    return { ...entity, id } as T;
  }

  /**
   * Create multiple entities at once
   */
  async createMany(count: number): Promise<T[]> {
    const entities: T[] = [];
    for (let i = 0; i < count; i++) {
      entities.push(await this.create());
    }
    return entities;
  }

  /**
   * Build entity data without persisting
   */
  protected abstract build(): Promise<Partial<T>>;

  /**
   * Get table name for this entity
   */
  protected abstract getTableName(): string;

  /**
   * Generate unique test ID
   */
  protected generateId(): string {
    return `test-${this.getTableName()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Insert entity into database
   */
  protected async insert(tableName: string, data: any): Promise<void> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const columns = keys.join(', ');

    await this.dataSource.query(
      `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`,
      values,
    );
  }
}

/**
 * User builder implementation
 */
class UserBuilder extends BaseBuilder<any> {
  withEmail(email: string): this {
    this.data.email = email;
    return this;
  }

  withPassword(password: string): this {
    // In tests, you may want pre-hashed or just use a test hash
    this.data.password_hash =
      '$2a$10$X5YqHJz9vB8cZ2F3KpL7QO9k.Vf8xW3nR5tY7uI9oP1aS2dF4gH6j';
    return this;
  }

  withRole(roleId: string): this {
    this.data.role_id = roleId;
    return this;
  }

  withStatus(status: string): this {
    this.data.status = status;
    return this;
  }

  protected async build(): Promise<any> {
    return {
      email: this.data.email || `test-${Date.now()}@example.com`,
      password_hash:
        this.data.password_hash ||
        '$2a$10$X5YqHJz9vB8cZ2F3KpL7QO9k.Vf8xW3nR5tY7uI9oP1aS2dF4gH6j',
      first_name: this.data.first_name || 'Test',
      last_name: this.data.last_name || 'User',
      role_id: this.data.role_id || 'role-customer',
      status: this.data.status || 'Active',
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  protected getTableName(): string {
    return 'users';
  }
}

/**
 * Product builder implementation
 */
class ProductBuilder extends BaseBuilder<any> {
  withName(name: string): this {
    this.data.name = name;
    return this;
  }

  withSku(sku: string): this {
    this.data.sku = sku;
    return this;
  }

  withPrice(price: number): this {
    this.data.price = price;
    return this;
  }

  withStock(stock: number): this {
    this.data.stock = stock;
    return this;
  }

  inCategory(categoryId: string): this {
    this.data.category_id = categoryId;
    return this;
  }

  withStatus(status: string): this {
    this.data.status = status;
    return this;
  }

  protected async build(): Promise<any> {
    return {
      name: this.data.name || `Test Product ${Date.now()}`,
      sku: this.data.sku || `SKU-${Date.now()}`,
      description: this.data.description || 'Test product description',
      price: this.data.price || 99.99,
      stock: this.data.stock || 100,
      category_id: this.data.category_id || 'cat-gpu',
      status: this.data.status || 'Active',
      specifications: this.data.specifications || {},
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  protected getTableName(): string {
    return 'products';
  }
}

/**
 * Category builder implementation
 */
class CategoryBuilder extends BaseBuilder<any> {
  withName(name: string): this {
    this.data.name = name;
    return this;
  }

  withSlug(slug: string): this {
    this.data.slug = slug;
    return this;
  }

  protected async build(): Promise<any> {
    const name = this.data.name || `Test Category ${Date.now()}`;
    return {
      name,
      slug: this.data.slug || name.toLowerCase().replace(/\s+/g, '-'),
      description: this.data.description || 'Test category description',
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  protected getTableName(): string {
    return 'categories';
  }
}

/**
 * Order builder implementation
 */
class OrderBuilder extends BaseBuilder<any> {
  forUser(userId: string): this {
    this.data.user_id = userId;
    return this;
  }

  withStatus(status: string): this {
    this.data.status = status;
    return this;
  }

  withTotal(total: number): this {
    this.data.total_amount = total;
    return this;
  }

  protected async build(): Promise<any> {
    return {
      order_number: this.data.order_number || `ORD-${Date.now()}`,
      user_id: this.data.user_id,
      status: this.data.status || 'Pending',
      payment_status: this.data.payment_status || 'Pending',
      total_amount: this.data.total_amount || 0,
      shipping_address_id: this.data.shipping_address_id,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  protected getTableName(): string {
    return 'orders';
  }
}

/**
 * Cart builder implementation
 */
class CartBuilder extends BaseBuilder<any> {
  forUser(userId: string): this {
    this.data.user_id = userId;
    return this;
  }

  protected async build(): Promise<any> {
    return {
      user_id: this.data.user_id,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  protected getTableName(): string {
    return 'carts';
  }
}

/**
 * Role builder implementation
 */
class RoleBuilder extends BaseBuilder<any> {
  withName(name: string): this {
    this.data.name = name;
    return this;
  }

  protected async build(): Promise<any> {
    return {
      name: this.data.name || `Test Role ${Date.now()}`,
      description: this.data.description || 'Test role description',
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  protected getTableName(): string {
    return 'roles';
  }
}
