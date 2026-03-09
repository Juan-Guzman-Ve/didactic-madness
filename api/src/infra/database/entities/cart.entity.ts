import { Entity, Column, OneToMany } from 'typeorm';
import { AuditableEntity } from './base';
import { CartItemEntity } from './cart-item.entity';

@Entity('carts')
export class CartEntity extends AuditableEntity {
  @Column({ name: 'user_id', unique: true })
  userId!: string;

  @OneToMany(() => CartItemEntity, (item) => item.cart)
  items!: CartItemEntity[];
}
