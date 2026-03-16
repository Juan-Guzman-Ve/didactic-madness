import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICategoryRepository, CATEGORY_REPOSITORY, IQueryHandler } from '@app/application';
import { GetCategoryByIdQuery, ListCategoriesQuery } from './category.queries';
import { CategoryResponse, ListCategoriesResponse } from './category.responses';
import { CategoryMapper } from './category.mapper';

@Injectable()
export class GetCategoryByIdQueryHandler implements IQueryHandler<GetCategoryByIdQuery, CategoryResponse> {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(query: GetCategoryByIdQuery): Promise<CategoryResponse> {
    const category = await this.categoryRepository.findById(query.id);
    if (!category) throw new NotFoundException(`Category with ID ${query.id} not found`);
    return CategoryMapper.toResponse(category);
  }
}

@Injectable()
export class ListCategoriesQueryHandler implements IQueryHandler<ListCategoriesQuery, ListCategoriesResponse> {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(query: ListCategoriesQuery): Promise<ListCategoriesResponse> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 20, 100);
    const result = await this.categoryRepository.findPaginated({ page, limit });

    return {
      data: result.data.map(CategoryMapper.toResponse),
      meta: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
    };
  }
}
