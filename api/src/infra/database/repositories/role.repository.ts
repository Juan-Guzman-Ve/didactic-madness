import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base/base.repository';
import { IRoleRepository } from '../../../application/contracts/repositories';
import { Role, Policy } from '../../../domain/entities';
import { RoleEntity } from '../entities/role.entity';
import { RolePolicyEntity } from '../entities/role-policy.entity';
import { PolicyEntity } from '../entities/policy.entity';

/**
 * Role repository implementation
 */
@Injectable()
export class RoleRepository extends BaseRepository<Role, RoleEntity> implements IRoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    repository: Repository<RoleEntity>,
    @InjectRepository(RolePolicyEntity)
    private readonly rolePolicyRepository: Repository<RolePolicyEntity>,
    @InjectRepository(PolicyEntity)
    private readonly policyRepository: Repository<PolicyEntity>,
  ) {
    super(repository);
  }

  protected toDomain(entity: RoleEntity): Role {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    };
  }

  protected toEntity(domain: Partial<Role>): Partial<RoleEntity> {
    const entity: Partial<RoleEntity> = {};

    if (domain.id !== undefined) entity.id = domain.id;
    if (domain.name !== undefined) entity.name = domain.name;
    if (domain.description !== undefined) entity.description = domain.description;
    if (domain.createdBy !== undefined) entity.createdBy = domain.createdBy;
    if (domain.updatedBy !== undefined) entity.updatedBy = domain.updatedBy;

    return entity;
  }

  private policyToDomain(entity: PolicyEntity): Policy {
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

  // ─── Custom Methods ────────────────────────────────────────────────────────

  async findByName(name: string): Promise<Role | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? this.toDomain(entity) : null;
  }

  async getPoliciesForRole(roleId: string): Promise<Policy[]> {
    const rolePolicies = await this.rolePolicyRepository.find({
      where: { roleId },
    });

    const policyIds = rolePolicies.map((rp) => rp.policyId);

    if (policyIds.length === 0) return [];

    const policies = await this.policyRepository.findByIds(policyIds);
    return policies.map((p) => this.policyToDomain(p));
  }

  async assignPolicy(roleId: string, policyId: string): Promise<void> {
    const exists = await this.hasPolicy(roleId, policyId);
    if (exists) return;

    const rolePolicy = this.rolePolicyRepository.create({ roleId, policyId });
    await this.rolePolicyRepository.save(rolePolicy);
  }

  async removePolicy(roleId: string, policyId: string): Promise<void> {
    await this.rolePolicyRepository.delete({ roleId, policyId });
  }

  async hasPolicy(roleId: string, policyId: string): Promise<boolean> {
    const count = await this.rolePolicyRepository.count({
      where: { roleId, policyId },
    });
    return count > 0;
  }
}
