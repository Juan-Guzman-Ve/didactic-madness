import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  stock: number;
}

export interface CartResponse {
  items: CartItem[];
}

export interface ApiResponse<T> {
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly apiUrl = environment.apiUrl;
  private cartItemsSignal = signal<CartItem[]>([]);
  
  readonly cartItems = this.cartItemsSignal.asReadonly();
  readonly cartCount = computed(() => this.cartItemsSignal().reduce((sum, item) => sum + item.quantity, 0));
  readonly cartTotal = computed(() => 
    this.cartItemsSignal().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  constructor(private http: HttpClient) {}

  async loadCart(): Promise<void> {
    // TODO: Implement load cart from API
    // const response = await firstValueFrom(
    //   this.http.get<ApiResponse<CartResponse>>(`${this.apiUrl}/cart`)
    // );
    // this.cartItemsSignal.set(response.data.items);
    throw new Error('Not implemented');
  }

  async addToCart(productId: string, quantity: number): Promise<void> {
    // TODO: Implement add to cart
    // await firstValueFrom(
    //   this.http.post<ApiResponse<void>>(`${this.apiUrl}/cart/items`, { productId, quantity })
    // );
    // await this.loadCart();
    throw new Error('Not implemented');
  }

  async updateQuantity(itemId: string, quantity: number): Promise<void> {
    // TODO: Implement update quantity
    // await firstValueFrom(
    //   this.http.put<ApiResponse<void>>(`${this.apiUrl}/cart/items/${itemId}`, { quantity })
    // );
    // await this.loadCart();
    throw new Error('Not implemented');
  }

  async removeItem(itemId: string): Promise<void> {
    // TODO: Implement remove item
    // await firstValueFrom(
    //   this.http.delete(`${this.apiUrl}/cart/items/${itemId}`)
    // );
    // await this.loadCart();
    throw new Error('Not implemented');
  }

  async clearCart(): Promise<void> {
    // TODO: Implement clear cart
    // await firstValueFrom(
    //   this.http.delete(`${this.apiUrl}/cart`)
    // );
    // this.cartItemsSignal.set([]);
    throw new Error('Not implemented');
  }
}
