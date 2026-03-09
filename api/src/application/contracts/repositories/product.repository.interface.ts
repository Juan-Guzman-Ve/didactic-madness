import { IRepository } from './base/repository.interface';
import { Product } from '../../../domain/entities';

/**
 * Product-specific repository interface
 */
export interface IProductRepository extends IRepository<Product> {
  /**
   * Find product by SKU
   */
  findBySku(sku: string): Promise<Product | null>;

  /**
   * Find products by category
   */
  findByCategory(categoryId: string): Promise<Product[]>;

  /**
   * Find products in stock
   */
  findInStock(): Promise<Product[]>;

  /**
   * Find products by brand
   */
  findByBrand(brand: string): Promise<Product[]>;

  /**
   * Search products by name or description
   */
  search(query: string): Promise<Product[]>;
}
