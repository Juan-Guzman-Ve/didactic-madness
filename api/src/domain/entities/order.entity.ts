import { AuditableEntity } from './base';

export interface Order extends AuditableEntity {
  orderNumber: string;
  userId: string;
  addressId: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
}
