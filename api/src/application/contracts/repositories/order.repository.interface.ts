import { Order } from '@app/domain';
import { IRepository } from '@app/application';

export interface IOrderRepository extends IRepository<Order> {
  findByUserId(userId: number): Promise<Order[]>;
  findByOrderNumber(orderNumber: string): Promise<Order | null>;
}
