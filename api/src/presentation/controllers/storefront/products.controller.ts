import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery } from '@nestjs/swagger';
import {
  GetProductByIdQuery,
  GetProductByIdQueryHandler,
  ListProductsQuery,
  ListProductsQueryHandler,
  ListProductsResponse,
  ProductResponse,
} from '@app/application/features/product';
import { Public } from '@app/presentation/decorators/public.decorator';

@ApiTags('products')
@ApiExtraModels(ListProductsQuery)
@Controller('products')
export class StorefrontProductsController {
  constructor(
    private readonly listHandler: ListProductsQueryHandler,
    private readonly getByIdHandler: GetProductByIdQueryHandler,
  ) {}

  @Public()
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'brand', required: false, type: String })
  @ApiQuery({ name: 'inStock', required: false, type: Boolean })
  list(@Query() query: ListProductsQuery): Promise<ListProductsResponse> {
    return this.listHandler.execute(query);
  }

  @Public()
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<ProductResponse> {
    return this.getByIdHandler.execute({ id } as GetProductByIdQuery);
  }
}
