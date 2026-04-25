import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery } from '@nestjs/swagger';
import {
  CategoryResponse,
  GetCategoryByIdQuery,
  GetCategoryByIdQueryHandler,
  ListCategoriesQuery,
  ListCategoriesQueryHandler,
  ListCategoriesResponse,
} from '@app/application/features/category';
import { Public } from '@app/presentation/decorators/public.decorator';

@ApiTags('categories')
@ApiExtraModels(ListCategoriesQuery)
@Controller('categories')
export class StorefrontCategoriesController {
  constructor(
    private readonly listHandler: ListCategoriesQueryHandler,
    private readonly getByIdHandler: GetCategoryByIdQueryHandler,
  ) {}

  @Public()
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  list(@Query() query: ListCategoriesQuery): Promise<ListCategoriesResponse> {
    return this.listHandler.execute(query);
  }

  @Public()
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponse> {
    return this.getByIdHandler.execute({ id } as GetCategoryByIdQuery);
  }
}
