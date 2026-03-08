import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {
  async getCart(userId: string) {
    // TODO: Implement get cart
    throw new Error('Not implemented');
  }

  async addItem(userId: string, productId: string, quantity: number) {
    // TODO: Implement add to cart
    throw new Error('Not implemented');
  }

  async updateItem(itemId: string, quantity: number) {
    // TODO: Implement update cart item
    throw new Error('Not implemented');
  }

  async removeItem(itemId: string) {
    // TODO: Implement remove cart item
    throw new Error('Not implemented');
  }

  async clearCart(userId: string) {
    // TODO: Implement clear cart
    throw new Error('Not implemented');
  }
}
