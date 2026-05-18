import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrdersService, Order } from '@app/core/services/orders.service';
import { formatPrice } from '@app/core/services/products.service';
import { AppRoutes } from '@app/app.routes.constants';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss',
})
export class OrdersListComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);

  readonly routes = AppRoutes;
  readonly orders = this.ordersService.orders;
  readonly formatPrice = formatPrice;

  loading = signal(false);

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      await this.ordersService.loadOrders();
    } finally {
      this.loading.set(false);
    }
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      PendingPayment: 'Pending Payment',
      Pending: 'Pending',
      Paid: 'Paid',
      Processing: 'Processing',
      Preparing: 'Preparing',
      Shipped: 'Shipped',
      Delivered: 'Delivered',
      Cancelled: 'Cancelled',
    };
    return labels[status] ?? status;
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      PendingPayment: 'pending-payment',
      Pending: 'pending',
      Paid: 'paid',
      Processing: 'processing',
      Preparing: 'processing',
      Shipped: 'shipped',
      Delivered: 'delivered',
      Cancelled: 'cancelled',
    };
    return map[status] ?? 'pending';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
