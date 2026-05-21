import { OrderItem } from '@app/domain';
import { OrderItemResponse } from './order-item.responses';

export class OrderItemMapper {
  static toResponse(orderItem: OrderItem, productName = '', productSku = ''): OrderItemResponse {
    return {
      id: orderItem.id,
      orderId: orderItem.orderId,
      productId: orderItem.productId,
      productName,
      productSku,
      quantity: orderItem.quantity,
      priceAtPurchase: orderItem.priceAtPurchase,
      createdAt: orderItem.createdAt,
      updatedAt: orderItem.updatedAt,
    };
  }
}
