import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '@app/core/services/auth.service';
import { CartService } from '@app/core/services/cart.service';
import { AppRoutes } from '@app/app.routes.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly authService = inject(AuthService);
  protected readonly cartService = inject(CartService);
  protected readonly routes = AppRoutes;

  async ngOnInit(): Promise<void> {
    if (this.authService.isAuthenticated()) {
      await this.cartService.loadCart();
    }
  }

  logout(): void {
    this.cartService.clearLocalCart();
    this.authService.logout();
  }
}
