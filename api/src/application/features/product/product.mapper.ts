import { Product } from '@app/domain';
import { ProductResponse } from './product.responses';

export class ProductMapper {
  static toResponse(product: Product): ProductResponse {
    return {
      id: product.id,
      sku: product.sku,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description,
      brand: product.brand,
      model: product.model,
      price: product.price,
      stock: product.stock,
      specifications: product.specifications,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
