import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductsService, Category, Product, formatPrice, productImageUrl } from '@app/core/services/products.service';
import { CartService } from '@app/core/services/cart.service';
import { AppRoutes } from '@app/app.routes.constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);

  protected readonly routes = AppRoutes;
  protected categories: Category[] = [];
  protected featuredProducts: Product[] = [];
  protected loading = false;
  protected addedProductId: number | null = null;

  protected formatPrice = formatPrice;
  protected productImageUrl = productImageUrl;

  async ngOnInit(): Promise<void> {
    this.loading = true;
    try {
      await Promise.all([
        this.productsService.loadCategories(),
        this.productsService.loadProducts({ limit: 8, sort: 'createdAt:desc' }),
      ]);
      this.categories = this.productsService.categories();
      this.featuredProducts = this.productsService.products();
    } finally {
      this.loading = false;
    }
  }

  async addToCart(product: Product): Promise<void> {
    try {
      await this.cartService.addToCart(product, 1);
      this.addedProductId = product.id;
      setTimeout(() => (this.addedProductId = null), 2000);
    } catch {
      // Cart not available
    }
  }
}
