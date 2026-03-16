import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IProductImageRepository, PRODUCT_IMAGE_REPOSITORY, IQueryHandler } from '@app/application';
import { GetProductImageByIdQuery, ListProductImagesQuery } from './product-image.queries';
import { ProductImageResponse, ListProductImagesResponse } from './product-image.responses';
import { ProductImageMapper } from './product-image.mapper';

@Injectable()
export class GetProductImageByIdQueryHandler implements IQueryHandler<GetProductImageByIdQuery, ProductImageResponse> {
  constructor(
    @Inject(PRODUCT_IMAGE_REPOSITORY) private readonly productImageRepository: IProductImageRepository,
  ) {}

  async execute(query: GetProductImageByIdQuery): Promise<ProductImageResponse> {
    const productImage = await this.productImageRepository.findById(query.id);
    if (!productImage) throw new NotFoundException(`ProductImage with ID ${query.id} not found`);
    return ProductImageMapper.toResponse(productImage);
  }
}

@Injectable()
export class ListProductImagesQueryHandler implements IQueryHandler<ListProductImagesQuery, ListProductImagesResponse> {
  constructor(
    @Inject(PRODUCT_IMAGE_REPOSITORY) private readonly productImageRepository: IProductImageRepository,
  ) {}

  async execute(query: ListProductImagesQuery): Promise<ListProductImagesResponse> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 20, 100);
    const result = await this.productImageRepository.findPaginated({ page, limit });

    return {
      data: result.data.map(ProductImageMapper.toResponse),
      meta: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
    };
  }
}
