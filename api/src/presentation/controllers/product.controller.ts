import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateProductCommandHandler,
  DeleteProductCommandHandler,
  GetProductByIdQueryHandler,
  ListProductsQuery,
  ListProductsQueryHandler,
  ListProductsResponse,
  UpdateProductCommandHandler,
} from '@app/application/features/product';
import { Public } from '@app/presentation/decorators/public.decorator';

@ApiTags('products')
@ApiBearerAuth()
@ApiExtraModels(ListProductsQuery)
@Controller('products')
export class ProductController
{
  constructor(
    private readonly listHandler: ListProductsQueryHandler,
  ) {}

  @Public()
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(@Query() query: ListProductsQuery): Promise<ListProductsResponse> {
    return this.listHandler.execute(query);
  }
}
