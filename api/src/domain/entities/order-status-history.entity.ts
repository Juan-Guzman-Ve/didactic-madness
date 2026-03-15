import { BaseEntity } from './base';

export class OrderStatusHistory extends BaseEntity {
  orderId!: number;
  status!: string;
  changedByUserId?: number;
  notes?: string;
  changedAt!: Date;
}
