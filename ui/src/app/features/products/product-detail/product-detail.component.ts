import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductsService, Product, Category, formatPrice, productImageUrl } from '@app/core/services/products.service';
import { CartService } from '@app/core/services/cart.service';
import { AppRoutes } from '@app/app.routes.constants';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NgClass, RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly routes = AppRoutes;
  readonly formatPrice = formatPrice;
  readonly productImageUrl = productImageUrl;

  readonly product = signal<Product | null>(null);
  readonly category = signal<Category | null>(null);
  readonly relatedProducts = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly quantity = signal(1);
  readonly addedToCart = signal(false);
  readonly cartLoading = signal(false);

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loading.set(true);
    try {
      await this.productsService.loadCategories();
      const product = await this.productsService.getProduct(Number(id));
      this.product.set(product);

      const categories = this.productsService.categories();
      const cat = categories.find((c) => c.id === product.categoryId) ?? null;
      this.category.set(cat);

      await this.productsService.loadProducts({
        categoryId: product.categoryId,
        limit: 4,
        inStock: true,
      });
      this.relatedProducts.set(
        this.productsService.products().filter((p) => p.id !== product.id).slice(0, 3)
      );
    } finally {
      this.loading.set(false);
    }
  }

  decreaseQty(): void {
    if (this.quantity() > 1) this.quantity.update((q) => q - 1);
  }

  increaseQty(): void {
    const product = this.product();
    if (product && this.quantity() < product.stock) this.quantity.update((q) => q + 1);
  }

  async addToCart(): Promise<void> {
    const product = this.product();
    if (!product) return;

    this.cartLoading.set(true);
    try {
      await this.cartService.addToCart(product, this.quantity());
      this.addedToCart.set(true);
      setTimeout(() => this.addedToCart.set(false), 2500);
    } catch {
      this.router.navigate(['/' + this.routes.AUTH_LOGIN]);
    } finally {
      this.cartLoading.set(false);
    }
  }

  get specEntries(): { key: string; value: string }[] {
    const specs = this.product()?.specifications;
    if (!specs) return [];
    return Object.entries(specs).map(([key, value]) => ({ key, value: String(value) }));
  }

  get hasSpecs(): boolean {
    return this.specEntries.length > 0;
  }

  get hasCategory(): boolean {
    return this.category() !== null;
  }

  get categoryQueryParams(): { categoryId: number } | null {
    const cat = this.category();
    return cat ? { categoryId: cat.id } : null;
  }

  get canDecreaseQty(): boolean {
    return this.quantity() > 1;
  }

  get isQtyAtMax(): boolean {
    const p = this.product();
    return p ? this.quantity() >= p.stock : true;
  }

  get isAddToCartDisabled(): boolean {
    const p = this.product();
    return !p || p.stock === 0 || this.cartLoading();
  }

  stockLabel(stock: number): string {
    if (stock === 0) return 'Out of Stock';
    if (stock < 5) return `Low Stock (${stock} left)`;
    return 'In Stock';
  }

  stockBadgeClass(stock: number): Record<string, boolean> {
    return { out: stock === 0, low: stock > 0 && stock < 5 };
  }
}
