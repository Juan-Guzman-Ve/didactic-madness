import { AuditableEntity } from './base';

export interface CartItem extends AuditableEntity {
  cartId: string;
  productId: string;
  quantity: number;
}
