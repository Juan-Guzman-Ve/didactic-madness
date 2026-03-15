import { Entity, Column, OneToMany } from 'typeorm';
import { AuditableEntity } from './base';
import { OrderItemEntity } from './order-item.entity';
import { OrderStatusHistoryEntity } from './order-status-history.entity';

@Entity('orders')
export class OrderEntity extends AuditableEntity {
  @Column({ name: 'order_number', unique: true })
  orderNumber!: string;

  @Column({ name: 'user_id', type: 'integer' })
  userId!: number;

  @Column({ name: 'address_id', type: 'integer' })
  addressId!: number;

  @Column()
  status!: string;

  @Column('integer', { name: 'total_amount' })
  totalAmount!: number;

  @Column({ name: 'payment_status', default: 'Pending' })
  paymentStatus!: string;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items!: OrderItemEntity[];

  @OneToMany(() => OrderStatusHistoryEntity, (history) => history.order)
  statusHistory!: OrderStatusHistoryEntity[];
}
