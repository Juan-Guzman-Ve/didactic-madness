import { NotFoundException } from '@nestjs/common';
import {
  PaginationQuery,
  PaginatedResponse,
  PaginationMeta,
  IRepository,
  PaginationParams,
} from '@app/application';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export abstract class BaseService<TDomain, TCreateDto, TUpdateDto> {
  constructor(
    protected readonly repository: IRepository<TDomain>,
    protected readonly entityName: string,
  ) {}

  protected abstract mapCreateDtoToEntity(dto: TCreateDto): TDomain;
  protected abstract mapUpdateDtoToEntity(dto: TUpdateDto, entity: TDomain): TDomain;

  async findById(id: number): Promise<TDomain | null> {
    return this.repository.findById(id);
  }

  async findAll(query: PaginationQuery): Promise<PaginatedResponse<TDomain>> {
    const page = Math.max(query.page ?? DEFAULT_PAGE, 1);
    const limit = Math.min(query.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const { sortBy, sortOrder } = this.parseSort(query.sort);

    const params: PaginationParams = { page, limit, sortBy, sortOrder };
    const result = await this.repository.findPaginated(params);

    const meta: PaginationMeta = {
      page: result.meta.page,
      limit: result.meta.limit,
      total: result.meta.total,
      totalPages: result.meta.totalPages,
    };

    return { data: result.data, meta };
  }

  async create(dto: TCreateDto): Promise<TDomain> {
    const entity = this.mapCreateDtoToEntity(dto);
    return this.repository.create(entity);
  }

  async update(id: number, dto: TUpdateDto): Promise<TDomain> {
    const entity = await this.findById(id);
    if (!entity) throw new NotFoundException(`${this.entityName} with ID ${id} not found`);

    const updatedEntity = this.mapUpdateDtoToEntity(dto, entity);
    return this.repository.updateById(id, updatedEntity);
  }

  async delete(id: number): Promise<void> {
    const exists = await this.repository.exists(id);
    if (!exists) throw new NotFoundException(`${this.entityName} with ID ${id} not found`);

    await this.repository.deleteById(id);
  }

  async deleteMany(ids: number[]): Promise<void> {
    if (ids.length === 0) return;
    await this.repository.deleteByIds(ids);
  }

  async createMany(dtos: TCreateDto[]): Promise<TDomain[]> {
    if (dtos.length === 0) return [];
    const entities = dtos.map((dto) => this.mapCreateDtoToEntity(dto));
    return this.repository.createMany(entities);
  }

  async updateMany(updates: Array<{ id: number; dto: TUpdateDto }>): Promise<TDomain[]> {
    if (updates.length === 0) return [];

    return Promise.all(
      updates.map(async ({ id, dto }) => {
        const entity = await this.findById(id);
        if (!entity) throw new NotFoundException(`${this.entityName} with ID ${id} not found`);

        const updatedEntity = this.mapUpdateDtoToEntity(dto, entity);
        return this.repository.updateById(id, updatedEntity);
      }),
    );
  }

  private parseSort(sort?: string): { sortBy?: string; sortOrder?: 'ASC' | 'DESC' } {
    if (!sort) return {};

    const parts = sort.split(':');
    const sortBy = parts[0];
    const sortOrder = parts[1]?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    return { sortBy, sortOrder };
  }
}
