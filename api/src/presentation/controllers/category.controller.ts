import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';
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
@ApiBearerAuth()
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

  @RequirePolicies('categories:create')
  @ApiBody({ type: CreateCategoryCommand })
  @Post()
  override create(@Body() command: CreateCategoryCommand): Promise<CategoryResponse> {
    return super.create(command);
  }

  @RequirePolicies('categories:update')
  @ApiBody({ type: UpdateCategoryCommand })
  @Put(':id')
  override update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCategoryCommand,
  ): Promise<CategoryResponse> {
    return super.update(id, body);
  }

  @RequirePolicies('categories:delete')
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
  list(@Query() query: ListCategoriesQuery): Promise<ListCategoriesResponse> {
    return this.listHandler.execute(query);
  }
}
