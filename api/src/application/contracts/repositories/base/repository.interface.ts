import { PaginationParams, PaginatedResult } from '../../common/pagination.types';

/**
 * Base repository interface with generic CRUD operations
 * Similar to .NET's IRepository<T>
 */
export interface IRepository<T> {
  /**
   * Get entity by ID
   */
  findById(id: string): Promise<T | null>;

  /**
   * Get all entities matching a filter expression
   * Similar to LINQ: x => x.status === 'active'
   */
  findMany(expression?: (entity: T) => boolean): Promise<T[]>;

  /**
   * Get paginated results
   */
  findPaginated(params: PaginationParams, expression?: (entity: T) => boolean): Promise<PaginatedResult<T>>;

  /**
   * Get first entity matching expression or null
   */
  findOne(expression: (entity: T) => boolean): Promise<T | null>;

  /**
   * Create a new entity
   */
  create(entity: T): Promise<T>;

  /**
   * Create multiple entities
   */
  createMany(entities: T[]): Promise<T[]>;

  /**
   * Update entity by ID
   */
  updateById(id: string, entity: Partial<T>): Promise<T>;

  /**
   * Update multiple entities by IDs
   */
  updateByIds(ids: string[], entity: Partial<T>): Promise<T[]>;

  /**
   * Update entities matching expression
   * Similar to LINQ: x => x.status === 'pending'
   */
  updateByExpression(expression: (entity: T) => boolean, entity: Partial<T>): Promise<T[]>;

  /**
   * Delete entity by ID
   */
  deleteById(id: string): Promise<void>;

  /**
   * Delete multiple entities by IDs
   */
  deleteByIds(ids: string[]): Promise<void>;

  /**
   * Delete entities matching expression
   * Similar to LINQ: x => x.createdAt < someDate
   */
  deleteByExpression(expression: (entity: T) => boolean): Promise<void>;

  /**
   * Check if entity exists by ID
   */
  exists(id: string): Promise<boolean>;

  /**
   * Count entities matching expression
   */
  count(expression?: (entity: T) => boolean): Promise<number>;

  /**
   * Save changes (some ORMs need explicit save)
   */
  saveChanges(): Promise<void>;
}
