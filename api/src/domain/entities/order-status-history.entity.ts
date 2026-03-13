import { BaseEntity } from './base';

export class OrderStatusHistory implements BaseEntity {
  id!: string;
  orderId!: string;
  status!: string;
  changedByUserId?: string;
  notes?: string;
  changedAt!: Date;
}
