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

export interface IBaseService<TDomain, TCreateDto, TUpdateDto> {
  findById(id: string): Promise<TDomain | null>;

  findAll(query: PaginationQuery): Promise<PaginatedResponse<TDomain>>;

  create(dto: TCreateDto): Promise<TDomain>;

  update(id: string, dto: TUpdateDto): Promise<TDomain>;

  delete(id: string): Promise<void>;

  deleteMany(ids: string[]): Promise<void>;

  createMany(dtos: TCreateDto[]): Promise<TDomain[]>;

  updateMany(updates: Array<{ id: string; dto: TUpdateDto }>): Promise<TDomain[]>;
}