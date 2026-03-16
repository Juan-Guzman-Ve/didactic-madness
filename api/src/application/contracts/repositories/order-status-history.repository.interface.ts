import { OrderStatusHistory } from '@app/domain';
import { IRepository } from '@app/application';

export interface IOrderStatusHistoryRepository extends IRepository<OrderStatusHistory> {
  findByOrderId(orderId: number): Promise<OrderStatusHistory[]>;
}
