import { Repository, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { IRepository } from '@app/application/contracts/repositories';
import { PaginationParams, PaginatedResult } from '@app/application/contracts/common/pagination.types';
import { AuditableEntity } from '@app/infra/database';

/**
 * Base repository implementation using TypeORM
 * Provides generic CRUD operations for all entities
 * 
 * Similar to .NET's Repository<T> base class
 * 
 * @typeParam TDomain - Domain entity interface
 * @typeParam TEntity - TypeORM entity class
 */
export abstract class BaseRepository
<
  TDomain extends AuditableEntity, 
  TEntity extends ObjectLiteral
>   
  implements IRepository<TDomain> 
{
  constructor(protected readonly repository: Repository<TEntity>) {}

  protected abstract toDomain(entity: TEntity): TDomain;
  protected abstract toEntity(domain: Partial<TDomain>): Partial<TEntity>;
  
  protected toDomainMany(entities: TEntity[]): TDomain[] {
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<TDomain | null> {
    const entity = await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<TEntity>,
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findMany(expression?: (entity: TDomain) => boolean): Promise<TDomain[]> {
    const entities = await this.repository.find();
    const domainEntities = this.toDomainMany(entities);

    if (expression) {
      return domainEntities.filter(expression);
    }

    return domainEntities;
  }

  async findPaginated(
    params: PaginationParams,
    expression?: (entity: TDomain) => boolean,
  ): Promise<PaginatedResult<TDomain>> {
    const { page, limit, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    let entities: TEntity[];
    let total: number;

    if (expression) {
      // If expression is provided, fetch all and filter in memory
      const allEntities = await this.repository.find();
      const allDomainEntities = this.toDomainMany(allEntities);
      const filtered = allDomainEntities.filter(expression);
      
      total = filtered.length;
      entities = filtered
        .slice(skip, skip + limit)
        .map((domain) => this.toEntity(domain) as TEntity);
    } else {
      // Otherwise, use database-level pagination
      [entities, total] = await this.repository.findAndCount({
        skip,
        take: limit,
        order: sortBy ? { [sortBy]: sortOrder || 'ASC' } : undefined,
      } as any);
    }

    const data = this.toDomainMany(entities);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
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

  async findOne(expression: (entity: TDomain) => boolean): Promise<TDomain | null> {
    const entities = await this.repository.find();
    const domainEntities = this.toDomainMany(entities);
    const found = domainEntities.find(expression);

    return found || null;
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

  async updateById(id: string, domain: Partial<TDomain>): Promise<TDomain> {
    const entity = this.toEntity(domain);
    await this.repository.update(id, entity as any);
    
    const updated = await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<TEntity>,
    });

    if (!updated) {
      throw new Error(`Entity with ID ${id} not found after update`);
    }

    return this.toDomain(updated);
  }

  async updateByIds(ids: string[], domain: Partial<TDomain>): Promise<TDomain[]> {
    const entity = this.toEntity(domain);
    
    // Update all entities with given IDs
    await this.repository
      .createQueryBuilder()
      .update()
      .set(entity as any)
      .whereInIds(ids)
      .execute();

    // Fetch updated entities
    const updated = await this.repository.findByIds(ids);
    return this.toDomainMany(updated);
  }

  async updateByExpression(
    expression: (entity: TDomain) => boolean,
    domain: Partial<TDomain>,
  ): Promise<TDomain[]> {
    // Find entities matching expression
    const entities = await this.repository.find();
    const domainEntities = this.toDomainMany(entities);
    const matched = domainEntities.filter(expression);

    if (matched.length === 0) {
      return [];
    }

    // Extract IDs and update
    const ids = matched.map((entity: any) => entity.id);
    return this.updateByIds(ids, domain);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByIds(ids: string[]): Promise<void> {
    await this.repository.delete(ids);
  }

  async deleteByExpression(expression: (entity: TDomain) => boolean): Promise<void> {
    // Find entities matching expression
    const entities = await this.repository.find();
    const domainEntities = this.toDomainMany(entities);
    const matched = domainEntities.filter(expression);

    if (matched.length === 0) {
      return;
    }

    // Extract IDs and delete
    const ids = matched.map((entity: any) => entity.id);
    await this.deleteByIds(ids);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { id } as unknown as FindOptionsWhere<TEntity>,
    });

    return count > 0;
  }

  async count(expression?: (entity: TDomain) => boolean): Promise<number> {
    if (expression) {
      const entities = await this.repository.find();
      const domainEntities = this.toDomainMany(entities);
      return domainEntities.filter(expression).length;
    }

    return this.repository.count();
  }

  async saveChanges(): Promise<void> {
    await this.repository.manager.connection.synchronize();
  }
}
