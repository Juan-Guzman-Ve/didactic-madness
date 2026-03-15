import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from './base';
import { OrderEntity } from './order.entity';

@Entity('order_items')
export class OrderItemEntity extends AuditableEntity {
  @Column({ name: 'order_id', type: 'integer' })
  orderId!: number;

  @Column({ name: 'product_id', type: 'integer' })
  productId!: number;

  @Column('integer')
  quantity!: number;

  @Column('integer', { name: 'price_at_purchase' })
  priceAtPurchase!: number;

  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;
}
