import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base/base.repository';
import { IUserRepository } from '../../../application/contracts/repositories';
import { User } from '../../../domain/entities';
import { UserEntity } from '../entities/user.entity';

/**
 * User repository implementation
 * Extends BaseRepository and implements IUserRepository
 */
@Injectable()
export class UserRepository extends BaseRepository<User, UserEntity> implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    repository: Repository<UserEntity>,
  ) {
    super(repository);
  }

  /**
   * Map TypeORM entity to domain entity
   */
  protected toDomain(entity: UserEntity): User {
    return {
      id: entity.id,
      email: entity.email,
      passwordHash: entity.passwordHash,
      firstName: entity.firstName,
      lastName: entity.lastName,
      phone: entity.phone,
      roleId: entity.roleId,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    };
  }

  /**
   * Map domain entity to TypeORM entity
   */
  protected toEntity(domain: Partial<User>): Partial<UserEntity> {
    const entity: Partial<UserEntity> = {};

    if (domain.id !== undefined) entity.id = domain.id;
    if (domain.email !== undefined) entity.email = domain.email;
    if (domain.passwordHash !== undefined) entity.passwordHash = domain.passwordHash;
    if (domain.firstName !== undefined) entity.firstName = domain.firstName;
    if (domain.lastName !== undefined) entity.lastName = domain.lastName;
    if (domain.phone !== undefined) entity.phone = domain.phone;
    if (domain.roleId !== undefined) entity.roleId = domain.roleId;
    if (domain.status !== undefined) entity.status = domain.status;
    if (domain.createdBy !== undefined) entity.createdBy = domain.createdBy;
    if (domain.updatedBy !== undefined) entity.updatedBy = domain.updatedBy;

    return entity;
  }

  // ─── Custom Methods ────────────────────────────────────────────────────────

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByRole(roleId: string): Promise<User[]> {
    const entities = await this.repository.find({ where: { roleId } });
    return this.toDomainMany(entities);
  }

  async findActiveUsers(): Promise<User[]> {
    const entities = await this.repository.find({ where: { status: 'Active' } });
    return this.toDomainMany(entities);
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }
}
