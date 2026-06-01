import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { UiInputComponent } from '@shared/components/input/ui-input.component';
import { UiButtonComponent } from '@shared/components/button/ui-button.component';
import { AuthService } from '@app/core/services/auth.service';
import { CartService } from '@app/core/services/cart.service';
import { AppRoutes } from '@app/app.routes.constants';
  
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    UiInputComponent,
    UiButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly routes = AppRoutes;
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly justRegistered = signal(this.route.snapshot.queryParamMap.get('registered') === 'true');

  readonly form = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;  
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const { email, password } = this.form.getRawValue();
      await this.authService.login(email, password);
      await this.cartService.loadCart();
      this.router.navigate([AppRoutes.HOME]);
    } catch {
      this.errorMessage.set('Invalid email or password. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
