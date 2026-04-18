import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id: number;
  sku: string;
  categoryId: number;
  name: string;
  description: string;
  brand: string;
  model?: string;
  price: number; // stored in cents
  stock: number;
  specifications?: Record<string, unknown>;
  status: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  sort?: string;
  search?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiListResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export function productImageUrl(sku: string): string {
  return `https://picsum.photos/seed/${sku}/800/800`;
}

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private productsSignal = signal<Product[]>([]);
  private metaSignal = signal<PaginationMeta | null>(null);
  private loadingSignal = signal(false);
  private categoriesSignal = signal<Category[]>([]);

  readonly products = this.productsSignal.asReadonly();
  readonly meta = this.metaSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly categories = this.categoriesSignal.asReadonly();

  async loadProducts(filters: ProductFilters = {}): Promise<void> {
    this.loadingSignal.set(true);
    try {
      const params = this.buildParams(filters);
      const response = await firstValueFrom(
        this.http.get<ApiListResponse<Product>>(`${this.apiUrl}/products`, { params })
      );
      this.productsSignal.set(response.data);
      this.metaSignal.set(response.meta);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async getProduct(id: number): Promise<Product> {
    return firstValueFrom(
      this.http.get<Product>(`${this.apiUrl}/products/${id}`)
    );
  }

  async loadCategories(): Promise<void> {
    if (this.categoriesSignal().length > 0) return;
    const response = await firstValueFrom(
      this.http.get<ApiListResponse<Category>>(`${this.apiUrl}/categories`, {
        params: { limit: '50' },
      })
    );
    this.categoriesSignal.set(response.data);
  }

  private buildParams(filters: ProductFilters): Record<string, string> {
    const params: Record<string, string> = {};
    if (filters.page) params['page'] = String(filters.page);
    if (filters.limit) params['limit'] = String(filters.limit);
    if (filters.categoryId) params['categoryId'] = String(filters.categoryId);
    if (filters.minPrice !== undefined) params['minPrice'] = String(filters.minPrice);
    if (filters.maxPrice !== undefined) params['maxPrice'] = String(filters.maxPrice);
    if (filters.brand) params['brand'] = filters.brand;
    if (filters.inStock !== undefined) params['inStock'] = String(filters.inStock);
    if (filters.sort) params['sort'] = filters.sort;
    if (filters.search) params['search'] = filters.search;
    return params;
  }
}
