import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppRoutes } from '@app/app.routes.constants';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
  status: string;
}

interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

const STORAGE_TOKEN_KEY = 'access_token';
const STORAGE_USER_KEY = 'current_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private currentUserSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = signal(false);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadUserFromStorage();
  }

  async login(email: string, password: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password }),
    );
    this.setSession(response);
  }

  async register(data: RegisterRequest): Promise<void> {
    await firstValueFrom(
      this.http.post<User>(`${this.apiUrl}/auth/register`, data),
    );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    this.currentUserSignal.set(null);
    this.tokenSignal.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/' + AppRoutes.AUTH_LOGIN]);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private setSession(authResult: LoginResponse): void {
    localStorage.setItem(STORAGE_TOKEN_KEY, authResult.access_token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(authResult.user));
    this.currentUserSignal.set(authResult.user);
    this.tokenSignal.set(authResult.access_token);
    this.isAuthenticated.set(true);
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    const userJson = localStorage.getItem(STORAGE_USER_KEY);
    
    if (!token || !userJson) {
      return;
    }

    try {
      const user = JSON.parse(userJson) as User;
      this.tokenSignal.set(token);
      this.currentUserSignal.set(user);
      this.isAuthenticated.set(true);
    } catch {
      // Invalid JSON, clear storage
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }
}
