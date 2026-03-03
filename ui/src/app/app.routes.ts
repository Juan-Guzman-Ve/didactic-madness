import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'showcase',
    pathMatch: 'full',
  },
  {
    path: 'showcase',
    loadComponent: () =>
      import('./showcase/showcase.component').then((m) => m.ShowcaseComponent),
  },
  // ─── Feature routes (wired in later phases) ────────────────────────────────
  // { path: 'products',  loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent) },
  // { path: 'cart',      loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent) },
  // { path: 'orders',    loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent) },
  // { path: 'auth',      loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent) },
];
