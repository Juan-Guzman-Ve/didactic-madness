import { ProductImage } from '@app/domain';
import { ProductImageResponse } from './product-image.responses';

export class ProductImageMapper {
  static toResponse(productImage: ProductImage): ProductImageResponse {
    return {
      id: productImage.id,
      productId: productImage.productId,
      url: productImage.url,
      displayOrder: productImage.displayOrder,
      createdAt: productImage.createdAt,
      updatedAt: productImage.updatedAt,
    };
  }
}
