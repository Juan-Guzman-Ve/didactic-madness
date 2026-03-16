import { ProductImage } from '@app/domain';
import { IRepository } from '@app/application';

export interface IProductImageRepository extends IRepository<ProductImage> {
  findByProductId(productId: number): Promise<ProductImage[]>;
}
