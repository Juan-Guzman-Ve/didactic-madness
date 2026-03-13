import { AuditableEntity } from './base';

export class OrderItem implements AuditableEntity {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  createdBy!: string;
  updatedBy!: string;
  orderId!: string;
  productId!: string;
  quantity!: number;
  priceAtPurchase!: number;
}
