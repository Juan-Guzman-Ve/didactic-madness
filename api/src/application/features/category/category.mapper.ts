import { Category } from '@app/domain';
import { CategoryResponse } from './category.responses';

export class CategoryMapper {
  static toResponse(category: Category): CategoryResponse {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      slug: category.slug,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
