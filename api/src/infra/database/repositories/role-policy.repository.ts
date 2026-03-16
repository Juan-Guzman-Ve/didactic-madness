import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePolicy } from '@app/domain';
import { IRolePolicyRepository } from '@app/application';
import { BaseRepository } from '@app/infra/database/repositories/base/base.repository';
import { RolePolicyEntity } from '@app/infra/database/entities';

@Injectable()
export class RolePolicyRepository extends BaseRepository<RolePolicy, RolePolicyEntity> implements IRolePolicyRepository {
  constructor(
    @InjectRepository(RolePolicyEntity)
    repository: Repository<RolePolicyEntity>,
  ) {
    super(repository);
  }

  async findByRoleId(roleId: number): Promise<RolePolicy[]> {
    const entities = await this.repository.find({ where: { roleId } });
    return this.toDomainMany(entities);
  }

  async findByPolicyId(policyId: number): Promise<RolePolicy[]> {
    const entities = await this.repository.find({ where: { policyId } });
    return this.toDomainMany(entities);
  }

  protected toDomain(entity: RolePolicyEntity): RolePolicy {
    return Object.assign(new RolePolicy(), {
      id: entity.id,
      roleId: entity.roleId,
      policyId: entity.policyId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    });
  }

  protected toEntity(domain: Partial<RolePolicy>): Partial<RolePolicyEntity> {
    const entity: Partial<RolePolicyEntity> = {};
    if (domain.id !== undefined) entity.id = domain.id;
    if (domain.roleId !== undefined) entity.roleId = domain.roleId;
    if (domain.policyId !== undefined) entity.policyId = domain.policyId;
    if (domain.createdBy !== undefined) entity.createdBy = domain.createdBy;
    if (domain.updatedBy !== undefined) entity.updatedBy = domain.updatedBy;
    return entity;
  }
}
