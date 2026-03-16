import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Policy } from '@app/domain';
import { IPolicyRepository } from '@app/application';
import { BaseRepository } from '@app/infra/database/repositories/base/base.repository';
import { PolicyEntity } from '@app/infra/database/entities';

@Injectable()
export class PolicyRepository extends BaseRepository<Policy, PolicyEntity> implements IPolicyRepository {
  constructor(
    @InjectRepository(PolicyEntity)
    repository: Repository<PolicyEntity>,
  ) {
    super(repository);
  }

  protected toDomain(entity: PolicyEntity): Policy {
    return Object.assign(new Policy(), {
      id: entity.id,
      name: entity.name,
      resource: entity.resource,
      action: entity.action,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    });
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
}
