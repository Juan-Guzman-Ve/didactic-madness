import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
@Controller('product-images')
export class ProductImageController extends BaseController<
  CreateProductImageCommand,
  UpdateProductImageCommand,
  DeleteProductImageCommand,
  GetProductImageByIdQuery,
  ListProductImagesQuery,
  ProductImageResponse,
  ListProductImagesResponse
> {
  constructor(
    createHandler: CreateProductImageCommandHandler,
    updateHandler: UpdateProductImageCommandHandler,
    deleteHandler: DeleteProductImageCommandHandler,
    getByIdHandler: GetProductImageByIdQueryHandler,
    listHandler: ListProductImagesQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler, listHandler);
  }
}
