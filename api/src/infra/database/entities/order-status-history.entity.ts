import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base';
import { OrderEntity } from './order.entity';

@Entity('order_status_history')
export class OrderStatusHistoryEntity extends BaseEntity {
  @Column({ name: 'order_id' })
  orderId!: string;

  @Column()
  status!: string;

  @Column({ name: 'changed_by_user_id', nullable: true })
  changedByUserId!: string;

  @Column('text', { nullable: true })
  notes!: string;

  @Column({ name: 'changed_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  changedAt!: Date;

  @ManyToOne(() => OrderEntity, (order) => order.statusHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;
}
