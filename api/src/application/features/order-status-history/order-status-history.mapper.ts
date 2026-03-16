import { OrderStatusHistory } from '@app/domain';
import { OrderStatusHistoryResponse } from './order-status-history.responses';

export class OrderStatusHistoryMapper {
  static toResponse(history: OrderStatusHistory): OrderStatusHistoryResponse {
    return {
      id: history.id,
      orderId: history.orderId,
      status: history.status,
      changedByUserId: history.changedByUserId,
      notes: history.notes,
      changedAt: history.changedAt,
    };
  }
}
