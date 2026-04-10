import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
  BulkCreateProductsCommand,
  BulkCreateProductsCommandHandler,
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
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';

@ApiTags('admin / products')
@ApiBearerAuth()
@ApiExtraModels(ListProductsQuery)
@Controller('admin/products')
export class AdminProductsController {
  constructor(
    private readonly bulkCreateHandler: BulkCreateProductsCommandHandler,
    private readonly updateHandler: UpdateProductCommandHandler,
    private readonly deleteHandler: DeleteProductCommandHandler,
    private readonly getByIdHandler: GetProductByIdQueryHandler,
    private readonly listHandler: ListProductsQueryHandler,
  ) {}

  @RequirePolicies('products:read')
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'brand', required: false, type: String })
  list(@Query() query: ListProductsQuery): Promise<ListProductsResponse> {
    return this.listHandler.execute(query);
  }

  @RequirePolicies('products:read')
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<ProductResponse> {
    return this.getByIdHandler.execute({ id } as GetProductByIdQuery);
  }

  @RequirePolicies('products:create')
  @ApiBody({ type: BulkCreateProductsCommand })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  bulkCreate(@Body() command: BulkCreateProductsCommand): Promise<ProductResponse[]> {
    return this.bulkCreateHandler.execute(command);
  }

  @RequirePolicies('products:update')
  @ApiBody({ type: UpdateProductCommand })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductCommand,
  ): Promise<ProductResponse> {
    return this.updateHandler.execute({ ...body, id } as UpdateProductCommand);
  }

  @RequirePolicies('products:delete')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.deleteHandler.execute({ id } as DeleteProductCommand);
  }
}
