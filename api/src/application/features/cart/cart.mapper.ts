import { Cart } from '@app/domain';
import { CartResponse } from './cart.responses';

export class CartMapper {
  static toResponse(cart: Cart): CartResponse {
    return {
      id: cart.id,
      userId: cart.userId,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }
}
