import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from './base';
import { CartEntity } from './cart.entity';

@Entity('cart_items')
export class CartItemEntity extends AuditableEntity {
  @Column({ name: 'cart_id' })
  cartId!: string;

  @Column({ name: 'product_id' })
  productId!: string;

  @Column('integer')
  quantity!: number;

  @ManyToOne(() => CartEntity, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart!: CartEntity;
}
