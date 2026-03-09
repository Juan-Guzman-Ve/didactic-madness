import { BaseEntity } from './base';

export interface OrderStatusHistory extends BaseEntity {
  orderId: string;
  status: string;
  changedByUserId?: string;
  notes?: string;
  changedAt: Date;
}
