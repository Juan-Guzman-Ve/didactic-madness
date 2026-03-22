import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IProductRepository, PRODUCT_REPOSITORY, IQueryHandler } from '@app/application';
import { GetProductByIdQuery, ListProductsQuery } from './product.queries';
import { ProductResponse, ListProductsResponse } from './product.responses';
import { ProductMapper } from './product.mapper';

@Injectable()
export class GetProductByIdQueryHandler implements IQueryHandler<GetProductByIdQuery, ProductResponse> {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
  ) {}

  async execute(query: GetProductByIdQuery): Promise<ProductResponse> {
    const product = await this.productRepository.findById(query.id);
    if (!product) throw new NotFoundException(`Product with ID ${query.id} not found`);
    return ProductMapper.toResponse(product);
  }
}

@Injectable()
export class ListProductsQueryHandler implements IQueryHandler<ListProductsQuery, ListProductsResponse> {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
  ) {}

  async execute(query: ListProductsQuery): Promise<ListProductsResponse> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 20, 100);
    
    const result = await this.productRepository.findWithFilters({
      page,
      limit,
      search: query.search,
      categoryId: query.categoryId,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      brand: query.brand,
      inStock: query.inStock,
      sort: query.sort,
    });

    return {
      data: result.data.map(ProductMapper.toResponse),
      meta: result.meta,
    };
  }
}
