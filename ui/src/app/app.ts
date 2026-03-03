import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly navItems: NavItem[] = [
    { label: 'Showcase',  icon: 'palette',       route: '/showcase' },
    // Uncomment as features are built:
    // { label: 'Products', icon: 'inventory_2',   route: '/products' },
    // { label: 'Cart',     icon: 'shopping_cart',  route: '/cart'     },
    // { label: 'Orders',   icon: 'receipt_long',   route: '/orders'   },
    // { label: 'Login',    icon: 'login',           route: '/auth'     },
  ];
}
