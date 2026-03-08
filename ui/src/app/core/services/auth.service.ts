import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
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
    // TODO: Implement login
    // const response = await firstValueFrom(
    //   this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
    // );
    // this.setSession(response);
    throw new Error('Not implemented');
  }

  async register(data: RegisterRequest): Promise<void> {
    // TODO: Implement registration
    // const response = await firstValueFrom(
    //   this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data)
    // );
    // this.setSession(response);
    throw new Error('Not implemented');
  }

  logout(): void {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    this.currentUserSignal.set(null);
    this.tokenSignal.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem(STORAGE_TOKEN_KEY, authResult.accessToken);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(authResult.user));
    this.currentUserSignal.set(authResult.user);
    this.tokenSignal.set(authResult.accessToken);
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
