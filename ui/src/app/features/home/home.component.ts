import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductsService, Category, Product, formatPrice, productImageUrl, categoryImageUrl } from '@app/core/services/products.service';
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
  protected readonly categories = signal<Category[]>([]);
  protected readonly featuredProducts = signal<Product[]>([]);
  protected readonly loading = signal(false);
  protected readonly addedProductId = signal<number | null>(null);

  protected formatPrice = formatPrice;
  protected productImageUrl = productImageUrl;
  protected categoryImageUrl = categoryImageUrl;

  readonly categorySkeleton = [1, 2, 3, 4, 5, 6];
  readonly productSkeleton = [1, 2, 3, 4];

  isAdded(productId: number): boolean {
    return this.addedProductId() === productId;
  }

  isOutOfStock(stock: number): boolean {
    return stock === 0;
  }

  isLowStock(stock: number): boolean {
    return stock > 0 && stock < 5;
  }

  stockLabel(stock: number): string {
    if (stock === 0) return 'Out of Stock';
    if (stock < 5) return 'Low Stock';
    return 'In Stock';
  }

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      await Promise.all([
        this.productsService.loadCategories(),
        this.productsService.loadProducts({ limit: 8, sort: 'createdAt:desc' }),
      ]);
      this.categories.set(this.productsService.categories());
      this.featuredProducts.set(this.productsService.products());
    } finally {
      this.loading.set(false);
    }
  }

  addToCartLabel(productId: number): string {
    return this.addedProductId() === productId ? 'Added!' : 'Add to Cart';
  }

  async addToCart(product: Product): Promise<void> {
    try {
      await this.cartService.addToCart(product, 1);
      this.addedProductId.set(product.id);
      setTimeout(() => this.addedProductId.set(null), 2000);
    } catch {
      // Cart not available - user needs to log in or cart is not initialized
    }
  }
}
