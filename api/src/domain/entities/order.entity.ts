import { AuditableEntity } from './base';

export class Order implements AuditableEntity {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  createdBy!: string;
  updatedBy!: string;
  orderNumber!: string;
  userId!: string;
  addressId!: string;
  status!: string;
  totalAmount!: number;
  paymentStatus!: string;
}
