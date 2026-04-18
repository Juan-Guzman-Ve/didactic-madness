import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartItem } from './cart.service';
import { Address } from './addresses.service';

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  addressId: number;
  status: string;
  totalAmount: number; // cents
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderWithItems {
  order: Order;
  items: CartItem[];
  address: Address | null;
}

interface ApiListResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private ordersSignal = signal<Order[]>([]);
  private lastOrderSignal = signal<OrderWithItems | null>(null);

  readonly orders = this.ordersSignal.asReadonly();
  readonly lastOrder = this.lastOrderSignal.asReadonly();

  async loadOrders(): Promise<void> {
    const response = await firstValueFrom(
      this.http.get<ApiListResponse<Order>>(`${this.apiUrl}/orders`, {
        params: { limit: '50', sort: 'createdAt:desc' },
      })
    );
    this.ordersSignal.set(response.data);
  }

  async getOrder(id: number): Promise<Order> {
    return firstValueFrom(
      this.http.get<Order>(`${this.apiUrl}/orders/${id}`)
    );
  }

  async checkout(addressId: number, cartItems: CartItem[], address: Address | null = null): Promise<Order> {
    const order = await firstValueFrom(
      this.http.post<Order>(`${this.apiUrl}/checkout`, { addressId })
    );
    this.lastOrderSignal.set({ order, items: cartItems, address });
    return order;
  }

  clearLastOrder(): void {
    this.lastOrderSignal.set(null);
  }
}
