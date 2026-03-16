import { Category } from '@app/domain';
import { IRepository } from '@app/application';

export interface ICategoryRepository extends IRepository<Category> {
  findBySlug(slug: string): Promise<Category | null>;
}
