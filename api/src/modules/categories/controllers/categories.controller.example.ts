import { Controller } from '@nestjs/common';
import { BaseController } from '@app/common/base';
import { CategoriesService } from '../services/categories.service';
import { CategoryEntity } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';

@Controller('categories')
export class CategoriesController extends BaseController<
  CategoryEntity,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto
> {
  constructor(service: CategoriesService) {
    super(service, 'Category');
  }

  protected toResponseDto(entity: CategoryEntity): CategoryResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      slug: entity.slug,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  protected toResponseDtoList(entities: CategoryEntity[]): CategoryResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }

  // Add custom endpoints here if needed
  // Example:
  // @Get('slug/:slug')
  // async findBySlug(@Param('slug') slug: string): Promise<CategoryResponseDto> {
  //   const entity = await this.service.findBySlug(slug);
  //   if (!entity) {
  //     throw new NotFoundException(`Category with slug ${slug} not found`);
  //   }
  //   return this.toResponseDto(entity);
  // }
}
