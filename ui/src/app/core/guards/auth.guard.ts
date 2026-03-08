import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
    // Guard clause: Not authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Guard clause: Check required policies
    const routeData = route.data as RouteData;
    const requiredPolicies = routeData.policies;
    
    if (!requiredPolicies || requiredPolicies.length === 0) {
      return true;
    }

    // TODO: Implement policy checking
    // const userPolicies = this.authService.currentUser()?.policies || [];
    // if (!requiredPolicies.every(p => userPolicies.includes(p))) {
    //   this.router.navigate(['/unauthorized']);
    //   return false;
    // }

    return true;
  }
}
