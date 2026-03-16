import { Order } from '@app/domain';
import { OrderResponse } from './order.responses';

export class OrderMapper {
  static toResponse(order: Order): OrderResponse {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      addressId: order.addressId,
      status: order.status,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
