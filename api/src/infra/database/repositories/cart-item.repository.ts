import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '@app/domain';
import { ICartItemRepository } from '@app/application';
import { BaseRepository } from '@app/infra/database/repositories/base/base.repository';
import { CartItemEntity } from '@app/infra/database/entities';

@Injectable()
export class CartItemRepository extends BaseRepository<CartItem, CartItemEntity> implements ICartItemRepository {
  constructor(
    @InjectRepository(CartItemEntity)
    repository: Repository<CartItemEntity>,
  ) {
    super(repository);
  }

  async findByCartId(cartId: number): Promise<CartItem[]> {
    const entities = await this.repository.find({ where: { cartId } });
    return this.toDomainMany(entities);
  }

  protected toDomain(entity: CartItemEntity): CartItem {
    return Object.assign(new CartItem(), {
      id: entity.id,
      cartId: entity.cartId,
      productId: entity.productId,
      quantity: entity.quantity,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    });
  }

  protected toEntity(domain: Partial<CartItem>): Partial<CartItemEntity> {
    const entity: Partial<CartItemEntity> = {};
    if (domain.id !== undefined) entity.id = domain.id;
    if (domain.cartId !== undefined) entity.cartId = domain.cartId;
    if (domain.productId !== undefined) entity.productId = domain.productId;
    if (domain.quantity !== undefined) entity.quantity = domain.quantity;
    if (domain.createdBy !== undefined) entity.createdBy = domain.createdBy;
    if (domain.updatedBy !== undefined) entity.updatedBy = domain.updatedBy;
    return entity;
  }
}
