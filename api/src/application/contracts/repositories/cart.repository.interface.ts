import { IRepository } from './base/repository.interface';
import { Cart, CartItem } from '../../../domain/entities';

/**
 * Cart-specific repository interface
 * Extends base repository with cart-specific operations
 */
export interface ICartRepository extends IRepository<Cart> {
  /**
   * Find cart by user ID (one cart per user)
   */
  findByUserId(userId: string): Promise<Cart | null>;

  /**
   * Get cart with all items populated
   */
  getCartWithItems(userId: string): Promise<CartWithItems | null>;

  /**
   * Add item to cart or update quantity if exists
   */
  addItem(cartId: string, productId: string, quantity: number): Promise<void>;

  /**
   * Update item quantity in cart
   */
  updateItemQuantity(cartId: string, productId: string, quantity: number): Promise<void>;

  /**
   * Remove item from cart
   */
  removeItem(cartId: string, productId: string): Promise<void>;

  /**
   * Clear all items from cart
   */
  clearCart(cartId: string): Promise<void>;

  /**
   * Get cart item by cart and product
   */
  findCartItem(cartId: string, productId: string): Promise<CartItem | null>;
}

/**
 * Cart with populated items
 */
export interface CartWithItems extends Cart {
  items: CartItem[];
}
