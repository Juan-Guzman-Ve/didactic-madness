import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base/base.repository';
import { ICategoryRepository } from '../../../application/contracts/repositories';
import { Category } from '../../../domain/entities';
import { CategoryEntity } from '../entities/category.entity';


@Injectable()
export class CategoryRepository extends BaseRepository<Category, CategoryEntity> implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    repository: Repository<CategoryEntity>,
  ) {
    super(repository);
  }

  protected toDomain(entity: CategoryEntity): Category {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    };
  }

  protected toEntity(domain: Partial<Category>): Partial<CategoryEntity> {
    const entity: Partial<CategoryEntity> = {};

    if (domain.id !== undefined) entity.id = domain.id;
    if (domain.name !== undefined) entity.name = domain.name;
    if (domain.description !== undefined) entity.description = domain.description;
    if (domain.slug !== undefined) entity.slug = domain.slug;
    if (domain.createdBy !== undefined) entity.createdBy = domain.createdBy;
    if (domain.updatedBy !== undefined) entity.updatedBy = domain.updatedBy;

    return entity;
  }

  // ─── Custom Methods ────────────────────────────────────────────────────────

  async findBySlug(slug: string): Promise<Category | null> {
    const entity = await this.repository.findOne({ where: { slug } });
    return entity ? this.toDomain(entity) : null;
  }

  async slugExists(slug: string): Promise<boolean> {
    const count = await this.repository.count({ where: { slug } });
    return count > 0;
  }
}
