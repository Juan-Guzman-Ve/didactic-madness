import { IRepository } from './base/repository.interface';
import { Category } from '../../../domain/entities';

/**
 * Category-specific repository interface
 */
export interface ICategoryRepository extends IRepository<Category> {
  /**
   * Find category by slug
   */
  findBySlug(slug: string): Promise<Category | null>;

  /**
   * Check if slug exists
   */
  slugExists(slug: string): Promise<boolean>;
}
