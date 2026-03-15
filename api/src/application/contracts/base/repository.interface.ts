import { PaginationParams, PaginatedResult } from '@app/application';

export interface IRepository<T> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  findPaginated(params: PaginationParams): Promise<PaginatedResult<T>>;
  create(entity: T): Promise<T>;
  createMany(entities: T[]): Promise<T[]>;
  updateById(id: number, entity: Partial<T>): Promise<T>;
  updateByIds(ids: number[], entity: Partial<T>): Promise<T[]>;
  deleteById(id: number): Promise<void>;
  deleteByIds(ids: number[]): Promise<void>;
  exists(id: number): Promise<boolean>;
  count(): Promise<number>;
}
