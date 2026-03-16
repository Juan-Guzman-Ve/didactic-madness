import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '@app/domain';
import { IOrderItemRepository } from '@app/application';
import { BaseRepository } from '@app/infra/database/repositories/base/base.repository';
import { OrderItemEntity } from '@app/infra/database/entities';

@Injectable()
export class OrderItemRepository extends BaseRepository<OrderItem, OrderItemEntity> implements IOrderItemRepository {
  constructor(
    @InjectRepository(OrderItemEntity)
    repository: Repository<OrderItemEntity>,
  ) {
    super(repository);
  }

  async findByOrderId(orderId: number): Promise<OrderItem[]> {
    const entities = await this.repository.find({ where: { orderId } });
    return this.toDomainMany(entities);
  }

  protected toDomain(entity: OrderItemEntity): OrderItem {
    return Object.assign(new OrderItem(), {
      id: entity.id,
      orderId: entity.orderId,
      productId: entity.productId,
      quantity: entity.quantity,
      priceAtPurchase: entity.priceAtPurchase,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    });
  }

  protected toEntity(domain: Partial<OrderItem>): Partial<OrderItemEntity> {
    const entity: Partial<OrderItemEntity> = {};
    if (domain.id !== undefined) entity.id = domain.id;
    if (domain.orderId !== undefined) entity.orderId = domain.orderId;
    if (domain.productId !== undefined) entity.productId = domain.productId;
    if (domain.quantity !== undefined) entity.quantity = domain.quantity;
    if (domain.priceAtPurchase !== undefined) entity.priceAtPurchase = domain.priceAtPurchase;
    if (domain.createdBy !== undefined) entity.createdBy = domain.createdBy;
    if (domain.updatedBy !== undefined) entity.updatedBy = domain.updatedBy;
    return entity;
  }
}
