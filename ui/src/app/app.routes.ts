import { Routes } from '@angular/router';
import { AuthGuard } from '@app/core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products-list/products-list.component').then(
        (m) => m.ProductsListComponent
      ),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
  {
    path: 'cart',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'checkout',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
  },
  {
    path: 'orders',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/orders/orders-list/orders-list.component').then(
        (m) => m.OrdersListComponent
      ),
  },
  {
    path: 'orders/:id/confirmation',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/orders/order-confirmation/order-confirmation.component').then(
        (m) => m.OrderConfirmationComponent
      ),
  },
  {
    path: 'orders/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/orders/order-detail/order-detail.component').then(
        (m) => m.OrderDetailComponent
      ),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/admin/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
