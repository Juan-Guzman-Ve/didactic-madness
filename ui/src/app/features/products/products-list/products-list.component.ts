import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  ProductsService,
  Product,
  Category,
  formatPrice,
  productImageUrl,
} from '@app/core/services/products.service';
import { CartService } from '@app/core/services/cart.service';
import { AppRoutes } from '@app/app.routes.constants';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly routes = AppRoutes;
  readonly formatPrice = formatPrice;
  readonly productImageUrl = productImageUrl;

  readonly products = this.productsService.products;
  readonly meta = this.productsService.meta;
  readonly loading = this.productsService.loading;
  readonly categories = signal<Category[]>([]);

  readonly addedProductId = signal<number | null>(null);

  readonly searchControl = new FormControl('');
  readonly selectedCategoryId = signal<number | null>(null);
  readonly selectedSort = signal('createdAt:desc');
  readonly inStockOnly = signal(false);
  readonly currentPage = signal(1);

  readonly sortOptions = [
    { value: 'createdAt:desc', label: 'Newest' },
    { value: 'price:asc', label: 'Price: Low to High' },
    { value: 'price:desc', label: 'Price: High to Low' },
    { value: 'name:asc', label: 'Name A–Z' },
  ];

  readonly selectedCategoryName = computed(() => {
    const id = this.selectedCategoryId();
    if (!id) return 'All Products';
    return this.categories().find((c) => c.id === id)?.name ?? 'Products';
  });

  async ngOnInit(): Promise<void> {
    await this.productsService.loadCategories();
    this.categories.set(this.productsService.categories());

    const params = this.route.snapshot.queryParamMap;
    const categoryId = params.get('categoryId');
    if (categoryId) this.selectedCategoryId.set(Number(categoryId));

    const search = params.get('search');
    if (search) this.searchControl.setValue(search);

    await this.loadProducts();
  }

  async filterByCategory(categoryId: number | null): Promise<void> {
    this.selectedCategoryId.set(categoryId);
    this.currentPage.set(1);
    await this.loadProducts();
  }

  async onSortChange(sort: string): Promise<void> {
    this.selectedSort.set(sort);
    this.currentPage.set(1);
    await this.loadProducts();
  }

  async onInStockToggle(checked: boolean): Promise<void> {
    this.inStockOnly.set(checked);
    this.currentPage.set(1);
    await this.loadProducts();
  }

  async onSearchSubmit(): Promise<void> {
    this.currentPage.set(1);
    await this.loadProducts();
  }

  async loadMore(): Promise<void> {
    this.currentPage.set(this.currentPage() + 1);
    await this.loadProducts();
  }

  async addToCart(product: Product): Promise<void> {
    try {
      await this.cartService.addToCart(product, 1);
      this.addedProductId.set(product.id);
      setTimeout(() => this.addedProductId.set(null), 2000);
    } catch {
      this.router.navigate(['/' + this.routes.AUTH_LOGIN]);
    }
  }

  private async loadProducts(): Promise<void> {
    const search = this.searchControl.value ?? undefined;
    await this.productsService.loadProducts({
      page: this.currentPage(),
      limit: 12,
      categoryId: this.selectedCategoryId() ?? undefined,
      inStock: this.inStockOnly() || undefined,
      sort: this.selectedSort(),
      search: search || undefined,
    });
  }
}
