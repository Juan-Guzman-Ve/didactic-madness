import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppRoutes } from '@app/app.routes.constants';

interface RouteData {
  policies?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/' + AppRoutes.AUTH_LOGIN]);
      return false;
    }

    const requiredPolicies = (route.data as RouteData).policies;
    const hasNoPolicyRequirements = !requiredPolicies || requiredPolicies.length === 0;

    return hasNoPolicyRequirements;
  }
}
