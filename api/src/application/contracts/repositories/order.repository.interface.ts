import { IRepository } from './base/repository.interface';
import { Order } from '../../../domain/entities';

/**
 * Order-specific repository interface
 */
export interface IOrderRepository extends IRepository<Order> {
  /**
   * Find order by order number
   */
  findByOrderNumber(orderNumber: string): Promise<Order | null>;

  /**
   * Find orders by user
   */
  findByUser(userId: string): Promise<Order[]>;

  /**
   * Find orders by status
   */
  findByStatus(status: string): Promise<Order[]>;
}
