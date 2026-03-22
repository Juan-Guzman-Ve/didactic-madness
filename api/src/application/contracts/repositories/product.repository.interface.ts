import { Product } from '@app/domain';
import { IRepository, PaginationParams, PaginatedResult } from '@app/application';

export interface ProductFilterParams extends PaginationParams {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  sort?: string;
}

export interface IProductRepository extends IRepository<Product> {
  findBySku(sku: string): Promise<Product | null>;
  findByCategoryId(categoryId: number): Promise<Product[]>;
  findWithFilters(params: ProductFilterParams): Promise<PaginatedResult<Product>>;
}
