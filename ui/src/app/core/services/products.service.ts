import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  price: number;
  stock: number;
  specifications: Record<string, unknown>;
  images: ProductImage[];
  categoryId: string;
}

export interface ProductImage {
  id: string;
  url: string;
  displayOrder: number;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  sort?: string;
  search?: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly apiUrl = environment.apiUrl;
  private productsSignal = signal<Product[]>([]);
  private loadingSignal = signal(false);

  readonly products = this.productsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  constructor(private http: HttpClient) {}

  async loadProducts(filters?: ProductFilters): Promise<void> {
    // TODO: Implement products loading
    // this.loadingSignal.set(true);
    // try {
    //   const response = await firstValueFrom(
    //     this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/products`, { params: filters as any })
    //   );
    //   this.productsSignal.set(response.data);
    // } finally {
    //   this.loadingSignal.set(false);
    // }
    throw new Error('Not implemented');
  }

  async getProduct(id: string): Promise<Product> {
    // TODO: Implement get product by ID
    // const response = await firstValueFrom(
    //   this.http.get<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`)
    // );
    // return response.data;
    throw new Error('Not implemented');
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    // TODO: Implement create product (admin only)
    // const response = await firstValueFrom(
    //   this.http.post<ApiResponse<Product>>(`${this.apiUrl}/products`, data)
    // );
    // return response.data;
    throw new Error('Not implemented');
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    // TODO: Implement update product (admin only)
    // const response = await firstValueFrom(
    //   this.http.put<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`, data)
    // );
    // return response.data;
    throw new Error('Not implemented');
  }

  async deleteProduct(id: string): Promise<void> {
    // TODO: Implement delete product (admin only)
    // await firstValueFrom(
    //   this.http.delete(`${this.apiUrl}/products/${id}`)
    // );
    throw new Error('Not implemented');
  }
}
