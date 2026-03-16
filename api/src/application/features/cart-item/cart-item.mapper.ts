import { CartItem } from '@app/domain';
import { CartItemResponse } from './cart-item.responses';

export class CartItemMapper {
  static toResponse(cartItem: CartItem): CartItemResponse {
    return {
      id: cartItem.id,
      cartId: cartItem.cartId,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      createdAt: cartItem.createdAt,
      updatedAt: cartItem.updatedAt,
    };
  }
}
