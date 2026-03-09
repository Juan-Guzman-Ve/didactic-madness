import { NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import {
  IBaseService,
  PaginationQuery,
  PaginatedResponse,
  PaginationMeta,
} from '../contracts/base/base-service.interface';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Base service implementation using TypeORM Repository
 * 
 * NOTE: This is a legacy implementation that directly uses TypeORM Repository.
 * In Clean Architecture, services should use IRepository interfaces instead.
 * 
 * TODO: Refactor to use IRepository pattern for better separation of concerns
 */
export abstract class BaseService<
  TEntity extends ObjectLiteral,
  TCreateDto,
  TUpdateDto,
> implements IBaseService<TEntity, TCreateDto, TUpdateDto>
{
  constructor(
    protected readonly repository: Repository<TEntity>,
    protected readonly entityName: string,
  ) {}

  protected abstract mapCreateDtoToEntity(dto: TCreateDto): TEntity;
  protected abstract mapUpdateDtoToEntity(dto: TUpdateDto, entity: TEntity): TEntity;

  async findById(id: string): Promise<TEntity | null> {
    return this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<TEntity>,
    });
  }

  async findAll(query: PaginationQuery): Promise<PaginatedResponse<TEntity>> {
    const page = Math.max(query.page || DEFAULT_PAGE, 1);
    const limit = Math.min(query.limit || DEFAULT_LIMIT, MAX_LIMIT);
    const skip = (page - 1) * limit;

    const sortOrder = this.parseSort(query.sort);

    const [data, total] = await this.repository.findAndCount({
      skip,
      take: limit,
      ...(Object.keys(sortOrder).length > 0 && { order: sortOrder as unknown as any }),
    });

    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    return { data, meta };
  }

  async create(dto: TCreateDto): Promise<TEntity> {
    const entity = this.mapCreateDtoToEntity(dto);
    return this.repository.save(entity);
  }

  async update(id: string, dto: TUpdateDto): Promise<TEntity> {
    const entity = await this.findById(id);

    if (!entity) {
      throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
    }

    const updatedEntity = this.mapUpdateDtoToEntity(dto, entity);
    return this.repository.save(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);

    if (!entity) {
      throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
    }

    await this.repository.remove(entity);
  }

  async deleteMany(ids: string[]): Promise<void> {
    if (ids.length === 0) {
      return;
    }

    await this.repository.delete(ids);
  }

  async createMany(dtos: TCreateDto[]): Promise<TEntity[]> {
    if (dtos.length === 0) {
      return [];
    }

    const entities = dtos.map((dto) => this.mapCreateDtoToEntity(dto));
    return this.repository.save(entities);
  }

  async updateMany(
    updates: Array<{ id: string; dto: TUpdateDto }>,
  ): Promise<TEntity[]> {
    if (updates.length === 0) {
      return [];
    }

    const entities = await Promise.all(
      updates.map(async ({ id, dto }) => {
        const entity = await this.findById(id);

        if (!entity) {
          throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
        }

        return this.mapUpdateDtoToEntity(dto, entity);
      }),
    );

    return this.repository.save(entities);
  }

  private parseSort(sort?: string): Record<string, 'ASC' | 'DESC'> {
    if (!sort) {
      return {};
    }

    const parts = sort.split(':');
    const field = parts[0];
    const order = parts[1]?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    return { [field]: order };
  }
}
