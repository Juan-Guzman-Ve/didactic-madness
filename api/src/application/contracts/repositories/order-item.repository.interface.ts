import { OrderItem } from '@app/domain';
import { IRepository } from '@app/application';

export interface IOrderItemRepository extends IRepository<OrderItem> {
  findByOrderId(orderId: number): Promise<OrderItem[]>;
}
