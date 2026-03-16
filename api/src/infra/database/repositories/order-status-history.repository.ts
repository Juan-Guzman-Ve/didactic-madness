import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatusHistory } from '@app/domain';
import { IOrderStatusHistoryRepository } from '@app/application';
import { BaseRepository } from '@app/infra/database/repositories/base/base.repository';
import { OrderStatusHistoryEntity } from '@app/infra/database/entities';

@Injectable()
export class OrderStatusHistoryRepository
  extends BaseRepository<OrderStatusHistory, OrderStatusHistoryEntity>
  implements IOrderStatusHistoryRepository
{
  constructor(
    @InjectRepository(OrderStatusHistoryEntity)
    repository: Repository<OrderStatusHistoryEntity>,
  ) {
    super(repository);
  }

  async findByOrderId(orderId: number): Promise<OrderStatusHistory[]> {
    const entities = await this.repository.find({ where: { orderId } });
    return this.toDomainMany(entities);
  }

  protected toDomain(entity: OrderStatusHistoryEntity): OrderStatusHistory {
    return Object.assign(new OrderStatusHistory(), {
      id: entity.id,
      orderId: entity.orderId,
      status: entity.status,
      changedByUserId: entity.changedByUserId ?? undefined,
      notes: entity.notes,
      changedAt: entity.changedAt,
    });
  }

  protected toEntity(domain: Partial<OrderStatusHistory>): Partial<OrderStatusHistoryEntity> {
    const entity: Partial<OrderStatusHistoryEntity> = {};
    if (domain.id !== undefined) entity.id = domain.id;
    if (domain.orderId !== undefined) entity.orderId = domain.orderId;
    if (domain.status !== undefined) entity.status = domain.status;
    if (domain.changedByUserId !== undefined) entity.changedByUserId = domain.changedByUserId;
    if (domain.notes !== undefined) entity.notes = domain.notes;
    if (domain.changedAt !== undefined) entity.changedAt = domain.changedAt;
    return entity;
  }
}
