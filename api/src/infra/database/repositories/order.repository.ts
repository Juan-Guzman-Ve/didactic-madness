import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@app/domain';
import { IOrderRepository } from '@app/application';
import { BaseRepository } from '@app/infra/database/repositories/base/base.repository';
import { OrderEntity } from '@app/infra/database/entities';

@Injectable()
export class OrderRepository extends BaseRepository<Order, OrderEntity> implements IOrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    repository: Repository<OrderEntity>,
  ) {
    super(repository);
  }

  async findByUserId(userId: number): Promise<Order[]> {
    const entities = await this.repository.find({ where: { userId } });
    return this.toDomainMany(entities);
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const entity = await this.repository.findOne({ where: { orderNumber } });
    return entity ? this.toDomain(entity) : null;
  }

  protected toDomain(entity: OrderEntity): Order {
    return Object.assign(new Order(), {
      id: entity.id,
      orderNumber: entity.orderNumber,
      userId: entity.userId,
      addressId: entity.addressId,
      status: entity.status,
      totalAmount: entity.totalAmount,
      paymentStatus: entity.paymentStatus,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
    });
  }

  protected toEntity(domain: Partial<Order>): Partial<OrderEntity> {
    const entity: Partial<OrderEntity> = {};
    if (domain.id !== undefined) entity.id = domain.id;
    if (domain.orderNumber !== undefined) entity.orderNumber = domain.orderNumber;
    if (domain.userId !== undefined) entity.userId = domain.userId;
    if (domain.addressId !== undefined) entity.addressId = domain.addressId;
    if (domain.status !== undefined) entity.status = domain.status;
    if (domain.totalAmount !== undefined) entity.totalAmount = domain.totalAmount;
    if (domain.paymentStatus !== undefined) entity.paymentStatus = domain.paymentStatus;
    if (domain.createdBy !== undefined) entity.createdBy = domain.createdBy;
    if (domain.updatedBy !== undefined) entity.updatedBy = domain.updatedBy;
    return entity;
  }
}
