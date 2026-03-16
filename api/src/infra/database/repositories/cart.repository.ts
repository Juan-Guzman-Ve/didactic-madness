import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '@app/domain';
import { ICartRepository } from '@app/application';
import { BaseRepository } from '@app/infra/database/repositories/base/base.repository';
import { CartEntity } from '@app/infra/database/entities';

@Injectable()
export class CartRepository extends BaseRepository<Cart, CartEntity> implements ICartRepository {
  constructor(
    @InjectRepository(CartEntity)
    repository: Repository<CartEntity>,
  ) {
    super(repository);
  }

  async findByUserId(userId: number): Promise<Cart | null> {
    const entity = await this.repository.findOne({ where: { userId } });
    return entity ? this.toDomain(entity) : null;
  }

  protected toDomain(entity: CartEntity): Cart {
    return Object.assign(new Cart(), {
      id: entity.id,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    });
  }

  protected toEntity(domain: Partial<Cart>): Partial<CartEntity> {
    const entity: Partial<CartEntity> = {};
    if (domain.id !== undefined) entity.id = domain.id;
    if (domain.userId !== undefined) entity.userId = domain.userId;
    if (domain.createdBy !== undefined) entity.createdBy = domain.createdBy;
    if (domain.updatedBy !== undefined) entity.updatedBy = domain.updatedBy;
    return entity;
  }
}
