import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
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
@ApiBearerAuth()
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

  @RequirePolicies('products:create')
  @ApiBody({ type: CreateProductCommand })
  @Post()
  override create(@Body() command: CreateProductCommand): Promise<ProductResponse> {
    return super.create(command);
  }

  @RequirePolicies('products:update')
  @ApiBody({ type: UpdateProductCommand })
  @Put(':id')
  override update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductCommand,
  ): Promise<ProductResponse> {
    return super.update(id, body);
  }

  @RequirePolicies('products:delete')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  override delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return super.delete(id);
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
