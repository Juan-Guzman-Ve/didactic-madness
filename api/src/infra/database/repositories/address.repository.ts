import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '@app/domain';
import { IAddressRepository, PaginationParams, PaginatedResult } from '@app/application';
import { BaseRepository } from '@app/infra/database/repositories/base/base.repository';
import { AddressEntity } from '@app/infra/database/entities';

@Injectable()
export class AddressRepository extends BaseRepository<Address, AddressEntity> implements IAddressRepository {
  constructor(
    @InjectRepository(AddressEntity)
    repository: Repository<AddressEntity>,
  ) {
    super(repository);
  }

  async findByUserId(userId: number): Promise<Address[]> {
    const entities = await this.repository.find({ where: { userId } as any });
    return this.toDomainMany(entities);
  }

  async findPaginatedByUserId(userId: number, params: PaginationParams): Promise<PaginatedResult<Address>> {
    const { page, limit, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const [entities, total] = await this.repository.findAndCount({
      where: { userId } as any,
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

  protected toDomain(entity: AddressEntity): Address {
    return Object.assign(new Address(), {
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
    });
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
}
