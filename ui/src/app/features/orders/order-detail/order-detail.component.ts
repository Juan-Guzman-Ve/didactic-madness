import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrdersService, Order, OrderItem } from '@app/core/services/orders.service';
import { AddressesService, Address } from '@app/core/services/addresses.service';
import { formatPrice, productImageUrl } from '@app/core/services/products.service';
import { AppRoutes } from '@app/app.routes.constants';
import { orderStatusLabel, orderStatusClass } from '../order-status.utils';

const ORDER_STATUSES = [
  'PendingPayment', 'Paid', 'Processing', 'Preparing', 'Shipped', 'Delivered',
];

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatDividerModule, MatDialogModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
})
export class OrderDetailComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly addressesService = inject(AddressesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  readonly routes = AppRoutes;
  readonly formatPrice = formatPrice;
  readonly productImageUrl = productImageUrl;
  readonly statuses = ORDER_STATUSES;
  readonly statusLabel = orderStatusLabel;
  readonly statusClass = orderStatusClass;

  readonly order = signal<Order | null>(null);
  readonly orderItems = signal<OrderItem[]>([]);
  readonly address = signal<Address | null>(null);
  readonly loading = signal(false);
  readonly cancelling = signal(false);

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/' + this.routes.ORDERS]);
      return;
    }

    this.loading.set(true);
    try {
      const [order, items] = await Promise.all([
        this.ordersService.getOrder(id),
        this.ordersService.getOrderItems(id),
      ]);
      this.order.set(order);
      this.orderItems.set(items);
      await this.loadAddress(order.addressId);
    } finally {
      this.loading.set(false);
    }
  }

  private async loadAddress(addressId: number): Promise<void> {
    await this.addressesService.loadAddresses();
    const found = this.addressesService.addresses().find((a) => a.id === addressId);
    this.address.set(found ?? null);
  }

  currentStatusIndex(status: string): number {
    if (status === 'Cancelled') return -1;
    return ORDER_STATUSES.indexOf(status);
  }

  stepIsDone(stepIndex: number, status: string): boolean {
    return stepIndex <= this.currentStatusIndex(status);
  }

  stepIsActive(stepIndex: number, status: string): boolean {
    return stepIndex === this.currentStatusIndex(status);
  }

  isTimelineLineDone(lineIndex: number, status: string): boolean {
    return lineIndex < this.currentStatusIndex(status);
  }

  get isOrderActive(): boolean {
    return this.order()?.status !== 'Cancelled';
  }

  get hasOrderItems(): boolean {
    return this.orderItems().length > 0;
  }

  paymentStatusClass(paymentStatus: string): string {
    return paymentStatus === 'Paid' ? 'paid' : 'pending-pay';
  }

  itemTotal(priceAtPurchase: number, quantity: number): string {
    return this.formatPrice(priceAtPurchase * quantity);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  get canCancel(): boolean {
    return this.order()?.status === 'PendingPayment';
  }

  async cancelOrder(): Promise<void> {
    const id = this.order()?.id;
    if (!id) return;
    this.cancelling.set(true);
    try {
      await this.ordersService.cancelOrder(id);
      const updated = await this.ordersService.getOrder(id);
      this.order.set(updated);
    } finally {
      this.cancelling.set(false);
    }
  }
}
