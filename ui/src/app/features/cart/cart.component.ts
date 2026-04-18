import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CartService } from '@app/core/services/cart.service';
import { formatPrice, productImageUrl } from '@app/core/services/products.service';
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
  readonly formatPrice = formatPrice;
  readonly productImageUrl = productImageUrl;

  async updateQuantity(itemId: number, quantity: number): Promise<void> {
    if (quantity < 1) return;
    this.updating.set(true);
    try {
      await this.cartService.updateQuantity(itemId, quantity);
    } finally {
      this.updating.set(false);
    }
  }

  async removeItem(itemId: number): Promise<void> {
    this.updating.set(true);
    try {
      await this.cartService.removeItem(itemId);
    } finally {
      this.updating.set(false);
    }
  }
}
