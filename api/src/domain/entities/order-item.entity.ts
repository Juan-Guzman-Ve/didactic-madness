import { AuditableEntity } from './base';

export interface OrderItem extends AuditableEntity {
  orderId: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}
