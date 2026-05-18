import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { UiInputComponent } from '@shared/components/input/ui-input.component';
import { AddressesService, Address } from '@app/core/services/addresses.service';
import { CartService } from '@app/core/services/cart.service';
import { OrdersService } from '@app/core/services/orders.service';
import { formatPrice } from '@app/core/services/products.service';
import { AppRoutes } from '@app/app.routes.constants';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    UiInputComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  private readonly addressesService = inject(AddressesService);
  private readonly cartService = inject(CartService);
  private readonly ordersService = inject(OrdersService);
  private readonly router = inject(Router);

  readonly routes = AppRoutes;
  readonly formatPrice = formatPrice;

  readonly cartItems = this.cartService.cartItems;
  readonly cartTotal = this.cartService.cartTotal;
  readonly addresses = this.addressesService.addresses;

  readonly selectedAddressId = signal<number | null>(null);
  readonly showAddressForm = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal('');

  readonly addressForm = new FormGroup({
    addressLine1: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    addressLine2: new FormControl<string>('', { nonNullable: true }),
    city: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    state: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    postalCode: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    country: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  async ngOnInit(): Promise<void> {
    if (this.cartItems().length === 0) {
      this.router.navigate(['/' + this.routes.CART]);
      return;
    }
    await this.addressesService.loadAddresses();
    const defaultAddress = this.addresses().find((a) => a.isDefault) ?? this.addresses()[0];
    if (defaultAddress) this.selectedAddressId.set(defaultAddress.id);
  }

  get addAddressLabel(): string {
    return this.showAddressForm() ? 'Cancel' : '+ Add New Address';
  }

  get addAddressIcon(): string {
    return this.showAddressForm() ? 'expand_less' : 'add';
  }

  itemTotal(price: number, quantity: number): string {
    return this.formatPrice(price * quantity);
  }

  selectAddress(address: Address): void {
    this.selectedAddressId.set(address.id);
    this.showAddressForm.set(false);
  }

  toggleAddressForm(): void {
    this.showAddressForm.update((v) => !v);
  }

  async saveAddress(): Promise<void> {
    if (this.addressForm.invalid) return;
    const data = this.addressForm.getRawValue();
    const newAddress = await this.addressesService.createAddress(data);
    this.selectedAddressId.set(newAddress.id);
    this.showAddressForm.set(false);
    this.addressForm.reset();
  }

  async placeOrder(): Promise<void> {
    const addressId = this.selectedAddressId();
    if (!addressId) return;

    this.submitting.set(true);
    this.errorMessage.set('');
    try {
      const items = this.cartItems();
      const address = this.addresses().find((a) => a.id === addressId) ?? null;
      const order = await this.ordersService.checkout(addressId, items, address);
      this.cartService.clearLocalCart();
      this.router.navigate(['/' + this.routes.ORDER_CONFIRMATION(order.id)]);
    } catch {
      this.errorMessage.set('Failed to place order. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }

  formatAddress(address: Address): string {
    const parts = [address.addressLine1];
    if (address.addressLine2) parts.push(address.addressLine2);
    parts.push(`${address.city}, ${address.state} ${address.postalCode}`);
    parts.push(address.country);
    return parts.join(', ');
  }

  get canPlaceOrder(): boolean {
    return this.selectedAddressId() !== null && this.cartItems().length > 0 && !this.submitting();
  }
}
