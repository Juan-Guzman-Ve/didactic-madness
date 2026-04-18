import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Address {
  id: number;
  userId: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CreateAddressRequest {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

interface ApiListResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

@Injectable({ providedIn: 'root' })
export class AddressesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private addressesSignal = signal<Address[]>([]);

  readonly addresses = this.addressesSignal.asReadonly();

  async loadAddresses(): Promise<void> {
    const response = await firstValueFrom(
      this.http.get<ApiListResponse<Address>>(`${this.apiUrl}/addresses`, {
        params: { limit: '20' },
      })
    );
    this.addressesSignal.set(response.data);
  }

  async createAddress(data: CreateAddressRequest): Promise<Address> {
    const address = await firstValueFrom(
      this.http.post<Address>(`${this.apiUrl}/addresses`, data)
    );
    this.addressesSignal.update((list) => [...list, address]);
    return address;
  }
}
