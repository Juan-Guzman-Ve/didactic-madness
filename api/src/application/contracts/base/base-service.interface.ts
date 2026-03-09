import { ObjectLiteral } from 'typeorm';

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface IBaseService<
  TEntity extends ObjectLiteral,
  TCreateDto,
  TUpdateDto,
> {
  findById(id: string): Promise<TEntity | null>;
  
  findAll(query: PaginationQuery): Promise<PaginatedResponse<TEntity>>;
  
  create(dto: TCreateDto): Promise<TEntity>;
  
  update(id: string, dto: TUpdateDto): Promise<TEntity>;
  
  delete(id: string): Promise<void>;
  
  deleteMany(ids: string[]): Promise<void>;
  
  createMany(dtos: TCreateDto[]): Promise<TEntity[]>;
  
  updateMany(updates: Array<{ id: string; dto: TUpdateDto }>): Promise<TEntity[]>;
}
