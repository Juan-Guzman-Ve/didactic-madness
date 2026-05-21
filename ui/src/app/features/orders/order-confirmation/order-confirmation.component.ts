import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { OrdersService, OrderWithItems } from '@app/core/services/orders.service';
import { formatPrice, productImageUrl } from '@app/core/services/products.service';
import { AppRoutes } from '@app/app.routes.constants';

const ESTIMATED_DELIVERY_DAYS = 7;

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss',
})
export class OrderConfirmationComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly routes = AppRoutes;
  readonly formatPrice = formatPrice;
  readonly productImageUrl = productImageUrl;

  orderData: OrderWithItems | null = null;

  ngOnInit(): void {
    const lastOrder = this.ordersService.lastOrder();
    const routeId = Number(this.route.snapshot.paramMap.get('id'));

    if (lastOrder && lastOrder.order.id === routeId) {
      this.orderData = lastOrder;
      return;
    }

    this.router.navigate(['/' + this.routes.ORDER_DETAIL(routeId)]);
  }

  estimatedDeliveryDate(orderPlacedAt: string): string {
    const delivery = new Date(orderPlacedAt);
    delivery.setDate(delivery.getDate() + ESTIMATED_DELIVERY_DAYS);
    return delivery.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  orderPlacedDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
