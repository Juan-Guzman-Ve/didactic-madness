import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger';
import {
  CategoryResponse,
  CreateCategoryCommand,
  CreateCategoryCommandHandler,
  DeleteCategoryCommand,
  DeleteCategoryCommandHandler,
  GetCategoryByIdQuery,
  GetCategoryByIdQueryHandler,
  ListCategoriesQuery,
  ListCategoriesQueryHandler,
  ListCategoriesResponse,
  UpdateCategoryCommand,
  UpdateCategoryCommandHandler,
} from '@app/application/features/category';
import { BaseController } from '@app/presentation/base';
import { Public } from '@app/presentation/decorators/public.decorator';

@ApiTags('categories')
@ApiExtraModels(ListCategoriesQuery)
@Controller('categories')
export class CategoryController extends BaseController<
  CreateCategoryCommand,
  UpdateCategoryCommand,
  DeleteCategoryCommand,
  GetCategoryByIdQuery,
  CategoryResponse
> {
  constructor(
    createHandler: CreateCategoryCommandHandler,
    updateHandler: UpdateCategoryCommandHandler,
    deleteHandler: DeleteCategoryCommandHandler,
    getByIdHandler: GetCategoryByIdQueryHandler,
    private readonly listHandler: ListCategoriesQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler);
  }

  @Public()
  @Get(':id')
  override getById(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponse> {
    return super.getById(id);
  }

  @Public()
  @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sort', required: false, type: String })
    list(@Query() query: ListCategoriesQuery): Promise<ListCategoriesResponse> {
      return this.listHandler.execute(query);
    }
}
