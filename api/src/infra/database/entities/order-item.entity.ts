import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from './base';
import { OrderEntity } from './order.entity';

@Entity('order_items')
export class OrderItemEntity extends AuditableEntity {
  @Column({ name: 'order_id' })
  orderId!: string;

  @Column({ name: 'product_id' })
  productId!: string;

  @Column('integer')
  quantity!: number;

  @Column('integer', { name: 'price_at_purchase' })
  priceAtPurchase!: number;

  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;
}
