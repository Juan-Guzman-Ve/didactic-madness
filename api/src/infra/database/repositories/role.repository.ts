import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base/base.repository';
import { Role } from '@app/domain/entities';
import { RoleEntity } from '../entities/role.entity';

@Injectable()
export class RoleRepository extends BaseRepository<Role, RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity)
    repository: Repository<RoleEntity>,
  ) {
    super(repository);
  }

  protected toDomain(entity: RoleEntity): Role {
    return Object.assign(new Role(), {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    });
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
}