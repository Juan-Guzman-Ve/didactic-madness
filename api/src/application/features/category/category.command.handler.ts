import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICategoryRepository, CATEGORY_REPOSITORY, ICommandHandler } from '@app/application';
import { Category } from '@app/domain';
import { CreateCategoryCommand, UpdateCategoryCommand, DeleteCategoryCommand } from './category.commands';
import { CategoryResponse } from './category.responses';
import { CategoryMapper } from './category.mapper';

@Injectable()
export class CreateCategoryCommandHandler implements ICommandHandler<CreateCategoryCommand, CategoryResponse> {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(command: CreateCategoryCommand): Promise<CategoryResponse> {
    const category = Object.assign(new Category(), {
      name: command.name,
      description: command.description,
      slug: command.slug,
    });
    const saved = await this.categoryRepository.create(category);
    return CategoryMapper.toResponse(saved);
  }
}

@Injectable()
export class UpdateCategoryCommandHandler implements ICommandHandler<UpdateCategoryCommand, CategoryResponse> {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(command: UpdateCategoryCommand): Promise<CategoryResponse> {
    const existing = await this.categoryRepository.findById(command.id);
    if (!existing) throw new NotFoundException(`Category with ID ${command.id} not found`);

    const updated = await this.categoryRepository.updateById(command.id, {
      name: command.name,
      description: command.description,
      slug: command.slug,
    });
    return CategoryMapper.toResponse(updated);
  }
}

@Injectable()
export class DeleteCategoryCommandHandler implements ICommandHandler<DeleteCategoryCommand, void> {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(command: DeleteCategoryCommand): Promise<void> {
    const exists = await this.categoryRepository.exists(command.id);
    if (!exists) throw new NotFoundException(`Category with ID ${command.id} not found`);
    await this.categoryRepository.deleteById(command.id);
  }
}
