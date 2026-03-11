import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base/base.repository';
import { IPolicyRepository } from '../../../application/contracts/repositories';
import { Policy } from '../../../domain/entities';
import { PolicyEntity } from '../entities/policy.entity';

/**
 * Policy repository implementation
 */
@Injectable()
export class PolicyRepository extends BaseRepository<Policy, PolicyEntity> implements IPolicyRepository {
  constructor(
    @InjectRepository(PolicyEntity)
    repository: Repository<PolicyEntity>,
  ) {
    super(repository);
  }

  protected toDomain(entity: PolicyEntity): Policy {
    return {
      id: entity.id,
      name: entity.name,
      resource: entity.resource,
      action: entity.action,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    };
  }

  protected toEntity(domain: Partial<Policy>): Partial<PolicyEntity> {
    const entity: Partial<PolicyEntity> = {};

    if (domain.id !== undefined) entity.id = domain.id;
    if (domain.name !== undefined) entity.name = domain.name;
    if (domain.resource !== undefined) entity.resource = domain.resource;
    if (domain.action !== undefined) entity.action = domain.action;
    if (domain.description !== undefined) entity.description = domain.description;
    if (domain.createdBy !== undefined) entity.createdBy = domain.createdBy;
    if (domain.updatedBy !== undefined) entity.updatedBy = domain.updatedBy;

    return entity;
  }

  // ─── Custom Methods ────────────────────────────────────────────────────────

  async findByName(name: string): Promise<Policy | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByResource(resource: string): Promise<Policy[]> {
    const entities = await this.repository.find({ where: { resource } });
    return this.toDomainMany(entities);
  }

  async findByResourceAndAction(resource: string, action: string): Promise<Policy | null> {
    const entity = await this.repository.findOne({
      where: { resource, action },
    });
    return entity ? this.toDomain(entity) : null;
  }
}
