import { Product } from '@app/domain';
import { IRepository } from '@app/application';

export interface IProductRepository extends IRepository<Product> {
  findBySku(sku: string): Promise<Product | null>;
  findByCategoryId(categoryId: number): Promise<Product[]>;
}
