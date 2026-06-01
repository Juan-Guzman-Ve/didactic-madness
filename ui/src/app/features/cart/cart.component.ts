import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CartService, CartItem } from '@app/core/services/cart.service';
import { formatPrice, productImageUrl } from '@app/core/services/products.service';
import { getApiErrorMessage } from '@app/core/utils/http-error.utils';
import { AppRoutes } from '@app/app.routes.constants';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  private readonly cartService = inject(CartService);

  readonly cartItems = this.cartService.cartItems;
  readonly cartTotal = this.cartService.cartTotal;
  readonly routes = AppRoutes;
  readonly updating = signal(false);
  readonly errorMessage = signal('');
  readonly formatPrice = formatPrice;
  readonly productImageUrl = productImageUrl;

  async updateQuantity(itemId: number, quantity: number): Promise<void> {
    if (quantity < 1) return;

    this.errorMessage.set('');
    this.updating.set(true);
    try {
      await this.cartService.updateQuantity(itemId, quantity);
    } catch (error) {
      this.errorMessage.set(getApiErrorMessage(error, 'Failed to update cart item. Please try again.'));
    } finally {
      this.updating.set(false);
    }
  }

  async removeItem(itemId: number): Promise<void> {
    this.errorMessage.set('');
    this.updating.set(true);
    try {
      await this.cartService.removeItem(itemId);
    } catch (error) {
      this.errorMessage.set(getApiErrorMessage(error, 'Failed to remove item from cart. Please try again.'));
    } finally {
      this.updating.set(false);
    }
  }

  get isCartEmpty(): boolean {
    return this.cartItems().length === 0;
  }

  get isCartNotEmpty(): boolean {
    return this.cartItems().length > 0;
  }

  cannotDecreaseQty(item: CartItem): boolean {
    return item.quantity <= 1 || this.updating();
  }

  cannotIncreaseQty(item: CartItem): boolean {
    return item.quantity >= item.stock || this.updating();
  }

  get itemCountLabel(): string {
    const count = this.cartItems().length;
    return `${count} item${count !== 1 ? 's' : ''}`;
  }

  itemTotal(price: number, quantity: number): string {
    return this.formatPrice(price * quantity);
  }
}
