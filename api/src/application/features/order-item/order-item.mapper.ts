import { OrderItem } from '@app/domain';
import { OrderItemResponse } from './order-item.responses';

export class OrderItemMapper {
  static toResponse(orderItem: OrderItem): OrderItemResponse {
    return {
      id: orderItem.id,
      orderId: orderItem.orderId,
      productId: orderItem.productId,
      quantity: orderItem.quantity,
      priceAtPurchase: orderItem.priceAtPurchase,
      createdAt: orderItem.createdAt,
      updatedAt: orderItem.updatedAt,
    };
  }
}
