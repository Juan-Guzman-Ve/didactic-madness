import { PaginationParams, PaginatedResult } from '@app/application';

export interface IRepository<T> {

  findById(id: string): Promise<T | null>;
  findMany(expression?: (entity: T) => boolean): Promise<T[]>;
  findPaginated(params: PaginationParams, expression?: (entity: T) => boolean): Promise<PaginatedResult<T>>;
  findOne(expression: (entity: T) => boolean): Promise<T | null>;
  create(entity: T): Promise<T>;
  createMany(entities: T[]): Promise<T[]>;
  updateById(id: string, entity: Partial<T>): Promise<T>;
  updateByIds(ids: string[], entity: Partial<T>): Promise<T[]>;
  updateByExpression(expression: (entity: T) => boolean, entity: Partial<T>): Promise<T[]>;
  deleteById(id: string): Promise<void>;
  deleteByIds(ids: string[]): Promise<void>;
  deleteByExpression(expression: (entity: T) => boolean): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(expression?: (entity: T) => boolean): Promise<number>;
  saveChanges(): Promise<void>;
}
