import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger';
import {
  CreateProductImageCommand,
  CreateProductImageCommandHandler,
  DeleteProductImageCommand,
  DeleteProductImageCommandHandler,
  GetProductImageByIdQuery,
  GetProductImageByIdQueryHandler,
  ListProductImagesQuery,
  ListProductImagesQueryHandler,
  ListProductImagesResponse,
  ProductImageResponse,
  UpdateProductImageCommand,
  UpdateProductImageCommandHandler,
} from '@app/application/features/product-image';
import { BaseController } from '@app/presentation/base';

@ApiTags('product-images')
@ApiExtraModels(ListProductImagesQuery)
@Controller('product-images')
export class ProductImageController extends BaseController<
  CreateProductImageCommand,
  UpdateProductImageCommand,
  DeleteProductImageCommand,
  GetProductImageByIdQuery,
  ProductImageResponse
> {
  constructor(
    createHandler: CreateProductImageCommandHandler,
    updateHandler: UpdateProductImageCommandHandler,
    deleteHandler: DeleteProductImageCommandHandler,
    getByIdHandler: GetProductImageByIdQueryHandler,
    private readonly listHandler: ListProductImagesQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler);
  }

  @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sort', required: false, type: String })
    list(@Query() query: ListProductImagesQuery): Promise<ListProductImagesResponse> {
      return this.listHandler.execute(query);
    }
}
