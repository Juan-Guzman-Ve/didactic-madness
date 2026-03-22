import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger';
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
import { Public } from '@app/presentation/decorators/public.decorator';

@ApiTags('products')
@ApiExtraModels(ListProductsQuery)
@Controller('products')
export class ProductController extends BaseController<
  CreateProductCommand,
  UpdateProductCommand,
  DeleteProductCommand,
  GetProductByIdQuery,
  ProductResponse
> {
  constructor(
    createHandler: CreateProductCommandHandler,
    updateHandler: UpdateProductCommandHandler,
    deleteHandler: DeleteProductCommandHandler,
    getByIdHandler: GetProductByIdQueryHandler,
    private readonly listHandler: ListProductsQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler);
  }

  @Public()
  @Get(':id')
  override getById(@Param('id', ParseIntPipe) id: number): Promise<ProductResponse> {
    return super.getById(id);
  }

  @Public()
  @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sort', required: false, type: String })
    list(@Query() query: ListProductsQuery): Promise<ListProductsResponse> {
      return this.listHandler.execute(query);
    }
}
