import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base/base.repository';
import { IAddressRepository } from '../../../application/contracts/repositories';
import { Address } from '../../../domain/entities';
import { AddressEntity } from '../entities/address.entity';

/**
 * Address repository implementation
 */
@Injectable()
export class AddressRepository extends BaseRepository<Address, AddressEntity> implements IAddressRepository {
  constructor(
    @InjectRepository(AddressEntity)
    repository: Repository<AddressEntity>,
  ) {
    super(repository);
  }

  protected toDomain(entity: AddressEntity): Address {
    return {
      id: entity.id,
      userId: entity.userId,
      addressLine1: entity.addressLine1,
      addressLine2: entity.addressLine2,
      city: entity.city,
      state: entity.state,
      postalCode: entity.postalCode,
      country: entity.country,
      isDefault: entity.isDefault,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    };
  }

  protected toEntity(domain: Partial<Address>): Partial<AddressEntity> {
    const entity: Partial<AddressEntity> = {};

    if (domain.id !== undefined) entity.id = domain.id;
    if (domain.userId !== undefined) entity.userId = domain.userId;
    if (domain.addressLine1 !== undefined) entity.addressLine1 = domain.addressLine1;
    if (domain.addressLine2 !== undefined) entity.addressLine2 = domain.addressLine2;
    if (domain.city !== undefined) entity.city = domain.city;
    if (domain.state !== undefined) entity.state = domain.state;
    if (domain.postalCode !== undefined) entity.postalCode = domain.postalCode;
    if (domain.country !== undefined) entity.country = domain.country;
    if (domain.isDefault !== undefined) entity.isDefault = domain.isDefault;
    if (domain.createdBy !== undefined) entity.createdBy = domain.createdBy;
    if (domain.updatedBy !== undefined) entity.updatedBy = domain.updatedBy;

    return entity;
  }

  // ─── Custom Methods ────────────────────────────────────────────────────────

  async findByUserId(userId: string): Promise<Address[]> {
    const entities = await this.repository.find({ where: { userId } });
    return this.toDomainMany(entities);
  }

  async findDefaultByUserId(userId: string): Promise<Address | null> {
    const entity = await this.repository.findOne({
      where: { userId, isDefault: true },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async setAsDefault(addressId: string, userId: string): Promise<void> {
    // Start transaction to ensure atomicity
    await this.repository.manager.transaction(async (transactionalEntityManager) => {
      // Unset all defaults for this user
      await transactionalEntityManager.update(
        AddressEntity,
        { userId },
        { isDefault: false },
      );

      // Set the specified address as default
      await transactionalEntityManager.update(
        AddressEntity,
        { id: addressId },
        { isDefault: true },
      );
    });
  }
}
