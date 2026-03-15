import { AuditableEntity } from './base';

export class OrderItem extends AuditableEntity {
  orderId!: number;
  productId!: number;
  quantity!: number;
  priceAtPurchase!: number;
}
