import { Repository, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { IRepository, PaginationParams, PaginatedResult } from '@app/application';

export abstract class BaseRepository<
  TDomain extends { id: number },
  TEntity extends ObjectLiteral
> implements IRepository<TDomain> {
  constructor(protected readonly repository: Repository<TEntity>) {}

  protected abstract toDomain(entity: TEntity): TDomain;
  protected abstract toEntity(domain: Partial<TDomain>): Partial<TEntity>;

  protected toDomainMany(entities: TEntity[]): TDomain[] {
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: number): Promise<TDomain | null> {
    const entity = await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<TEntity>,
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<TDomain[]> {
    const entities = await this.repository.find();
    return this.toDomainMany(entities);
  }

  async findPaginated(params: PaginationParams): Promise<PaginatedResult<TDomain>> {
    const { page, limit, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const [entities, total] = await this.repository.findAndCount({
      skip,
      take: limit,
      order: sortBy ? ({ [sortBy]: sortOrder ?? 'ASC' } as any) : undefined,
    });

    const totalPages = Math.ceil(total / limit);
    return {
      data: this.toDomainMany(entities),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async create(domain: TDomain): Promise<TDomain> {
    const entity = this.toEntity(domain);
    const saved = await this.repository.save(entity as any);
    return this.toDomain(saved);
  }

  async createMany(domains: TDomain[]): Promise<TDomain[]> {
    const entities = domains.map((domain) => this.toEntity(domain));
    const saved = await this.repository.save(entities as any);
    return this.toDomainMany(saved);
  }

  async updateById(id: number, domain: Partial<TDomain>): Promise<TDomain> {
    await this.repository.update(id, this.toEntity(domain) as any);
    const updated = await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<TEntity>,
    });
    if (!updated) throw new Error(`Entity with ID ${id} not found after update`);
    return this.toDomain(updated);
  }

  async updateByIds(ids: number[], domain: Partial<TDomain>): Promise<TDomain[]> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set(this.toEntity(domain) as any)
      .whereInIds(ids)
      .execute();

    const updated = await this.repository.findByIds(ids);
    return this.toDomainMany(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByIds(ids: number[]): Promise<void> {
    await this.repository.delete(ids);
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.repository.count({
      where: { id } as unknown as FindOptionsWhere<TEntity>,
    });
    return count > 0;
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
