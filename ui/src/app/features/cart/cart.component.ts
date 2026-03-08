import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '@app/core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  cartItems = this.cartService.cartItems;
  cartTotal = this.cartService.cartTotal;

  async updateQuantity(itemId: string, quantity: number) {
    // TODO: Update cart item quantity
    // await this.cartService.updateQuantity(itemId, quantity);
    throw new Error('Not implemented');
  }

  async removeItem(itemId: string) {
    // TODO: Remove item from cart
    // await this.cartService.removeItem(itemId);
    throw new Error('Not implemented');
  }

  async clearCart() {
    // TODO: Clear entire cart
    // await this.cartService.clearCart();
    throw new Error('Not implemented');
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
