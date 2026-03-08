import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@app/common/base';
import { CategoryEntity } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesService extends BaseService<
  CategoryEntity,
  CreateCategoryDto,
  UpdateCategoryDto
> {
  constructor(
    @InjectRepository(CategoryEntity)
    repository: Repository<CategoryEntity>,
  ) {
    super(repository, 'Category');
  }

  protected mapCreateDtoToEntity(dto: CreateCategoryDto): CategoryEntity {
    const entity = new CategoryEntity();
    entity.name = dto.name;
    entity.description = dto.description;
    entity.slug = dto.slug;
    return entity;
  }

  protected mapUpdateDtoToEntity(
    dto: UpdateCategoryDto,
    entity: CategoryEntity,
  ): CategoryEntity {
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.slug !== undefined) entity.slug = dto.slug;
    return entity;
  }

  // Add custom methods here if needed
  // Example:
  // async findBySlug(slug: string): Promise<CategoryEntity | null> {
  //   return this.repository.findOne({ where: { slug } });
  // }
}
