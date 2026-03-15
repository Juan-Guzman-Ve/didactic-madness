import { AuditableEntity } from './base';

export class Order extends AuditableEntity {
  orderNumber!: string;
  userId!: number;
  addressId!: number;
  status!: string;
  totalAmount!: number;
  paymentStatus!: string;
}
