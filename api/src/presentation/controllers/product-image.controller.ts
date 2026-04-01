import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
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
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';

@ApiTags('product-images')
@ApiBearerAuth()
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

  @RequirePolicies('products:read')
  @Get(':id')
  override getById(@Param('id', ParseIntPipe) id: number): Promise<ProductImageResponse> {
    return super.getById(id);
  }

  @RequirePolicies('products:create')
  @ApiBody({ type: CreateProductImageCommand })
  @Post()
  override create(@Body() command: CreateProductImageCommand): Promise<ProductImageResponse> {
    return super.create(command);
  }

  @RequirePolicies('products:update')
  @ApiBody({ type: UpdateProductImageCommand })
  @Put(':id')
  override update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductImageCommand,
  ): Promise<ProductImageResponse> {
    return super.update(id, body);
  }

  @RequirePolicies('products:delete')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  override delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return super.delete(id);
  }

  @RequirePolicies('products:read')
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(@Query() query: ListProductImagesQuery): Promise<ListProductImagesResponse> {
    return this.listHandler.execute(query);
  }
}
