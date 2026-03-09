import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base/base.repository';
import { IOrderRepository } from '../../../application/contracts/repositories';
import { Order } from '../../../domain/entities';
import { OrderEntity } from '../entities/order.entity';

/**
 * Order repository implementation
 */
@Injectable()
export class OrderRepository extends BaseRepository<Order, OrderEntity> implements IOrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    repository: Repository<OrderEntity>,
  ) {
    super(repository);
  }

  protected toDomain(entity: OrderEntity): Order {
    return {
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
    };
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

  // ─── Custom Methods ────────────────────────────────────────────────────────

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const entity = await this.repository.findOne({ where: { orderNumber } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByUser(userId: string): Promise<Order[]> {
    const entities = await this.repository.find({ 
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return this.toDomainMany(entities);
  }

  async findByStatus(status: string): Promise<Order[]> {
    const entities = await this.repository.find({ where: { status } });
    return this.toDomainMany(entities);
  }
}
