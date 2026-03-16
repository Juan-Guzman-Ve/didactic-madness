import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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

@ApiTags('categories')
@Controller('categories')
export class CategoryController extends BaseController<
  CreateCategoryCommand,
  UpdateCategoryCommand,
  DeleteCategoryCommand,
  GetCategoryByIdQuery,
  ListCategoriesQuery,
  CategoryResponse,
  ListCategoriesResponse
> {
  constructor(
    createHandler: CreateCategoryCommandHandler,
    updateHandler: UpdateCategoryCommandHandler,
    deleteHandler: DeleteCategoryCommandHandler,
    getByIdHandler: GetCategoryByIdQueryHandler,
    listHandler: ListCategoriesQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler, listHandler);
  }
}
