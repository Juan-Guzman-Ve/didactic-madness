import { AuditableEntity } from './base';

export class CartItem extends AuditableEntity {
  cartId!: number;
  productId!: number;
  quantity!: number;
}
