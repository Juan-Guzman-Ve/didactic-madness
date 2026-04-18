import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, productImageUrl } from './products.service';

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  name: string;
  sku: string;
  imageUrl: string;
  price: number; // cents
  stock: number;
}

interface RawCartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
}

interface ApiListResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private cartIdSignal = signal<number | null>(null);
  private cartItemsSignal = signal<CartItem[]>([]);

  readonly cartId = this.cartIdSignal.asReadonly();
  readonly cartItems = this.cartItemsSignal.asReadonly();
  readonly cartCount = computed(() =>
    this.cartItemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly cartTotal = computed(() =>
    this.cartItemsSignal().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  async loadCart(): Promise<void> {
    const response = await firstValueFrom(
      this.http.get<ApiListResponse<RawCartItem>>(`${this.apiUrl}/cart`, {
        params: { limit: '50' },
      })
    );
    const rawItems = response.data;

    if (rawItems.length === 0) {
      this.cartItemsSignal.set([]);
      return;
    }

    this.cartIdSignal.set(rawItems[0].cartId);
    this.cartItemsSignal.set(await this.enrichItems(rawItems));
  }

  async addToCart(product: Product, quantity: number = 1): Promise<void> {
    const cartId = this.cartIdSignal();
    if (!cartId) throw new Error('Cart not available for this account.');

    const currentItems = this.cartItemsSignal();
    const existing = currentItems.find((i) => i.productId === product.id);

    const syncItems = existing
      ? currentItems.map((i) =>
          i.productId === product.id
            ? { productId: i.productId, quantity: i.quantity + quantity }
            : { productId: i.productId, quantity: i.quantity }
        )
      : [
          ...currentItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          { productId: product.id, quantity },
        ];

    const synced = await this.syncCart(cartId, syncItems);
    this.cartItemsSignal.set(await this.enrichItems(synced));
  }

  async updateQuantity(cartItemId: number, quantity: number): Promise<void> {
    const cartId = this.cartIdSignal();
    if (!cartId) return;

    const syncItems = this.cartItemsSignal()
      .filter((i) => i.id !== cartItemId || quantity > 0)
      .map((i) => ({
        productId: i.productId,
        quantity: i.id === cartItemId ? quantity : i.quantity,
      }));

    if (syncItems.length === 0) {
      // API rejects empty sync -- clear locally only
      this.cartItemsSignal.set([]);
      return;
    }

    const synced = await this.syncCart(cartId, syncItems);
    this.cartItemsSignal.set(await this.enrichItems(synced));
  }

  async removeItem(cartItemId: number): Promise<void> {
    const cartId = this.cartIdSignal();
    if (!cartId) return;

    const remaining = this.cartItemsSignal().filter((i) => i.id !== cartItemId);

    if (remaining.length === 0) {
      // API rejects empty sync -- clear locally only
      this.cartItemsSignal.set([]);
      return;
    }

    const synced = await this.syncCart(
      cartId,
      remaining.map((i) => ({ productId: i.productId, quantity: i.quantity }))
    );
    this.cartItemsSignal.set(await this.enrichItems(synced));
  }

  clearLocalCart(): void {
    this.cartItemsSignal.set([]);
  }

  private async syncCart(
    cartId: number,
    items: { productId: number; quantity: number }[]
  ): Promise<RawCartItem[]> {
    return firstValueFrom(
      this.http.put<RawCartItem[]>(`${this.apiUrl}/cart`, { cartId, items })
    );
  }

  private async enrichItems(rawItems: RawCartItem[]): Promise<CartItem[]> {
    return Promise.all(
      rawItems.map(async (raw) => {
        const product = await firstValueFrom(
          this.http.get<Product>(`${this.apiUrl}/products/${raw.productId}`)
        );
        return {
          id: raw.id,
          cartId: raw.cartId,
          productId: raw.productId,
          quantity: raw.quantity,
          name: product.name,
          sku: product.sku,
          imageUrl: productImageUrl(product.sku),
          price: product.price,
          stock: product.stock,
        };
      })
    );
  }
}
