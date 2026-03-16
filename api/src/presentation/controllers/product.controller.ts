import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateProductCommand,
  CreateProductCommandHandler,
  DeleteProductCommand,
  DeleteProductCommandHandler,
  GetProductByIdQuery,
  GetProductByIdQueryHandler,
  ListProductsQuery,
  ListProductsQueryHandler,
  ListProductsResponse,
  ProductResponse,
  UpdateProductCommand,
  UpdateProductCommandHandler,
} from '@app/application/features/product';
import { BaseController } from '@app/presentation/base';

@ApiTags('products')
@Controller('products')
export class ProductController extends BaseController<
  CreateProductCommand,
  UpdateProductCommand,
  DeleteProductCommand,
  GetProductByIdQuery,
  ListProductsQuery,
  ProductResponse,
  ListProductsResponse
> {
  constructor(
    createHandler: CreateProductCommandHandler,
    updateHandler: UpdateProductCommandHandler,
    deleteHandler: DeleteProductCommandHandler,
    getByIdHandler: GetProductByIdQueryHandler,
    listHandler: ListProductsQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler, listHandler);
  }
}
