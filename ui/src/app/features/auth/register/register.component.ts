import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { UiInputComponent } from '@shared/components/input/ui-input.component';
import { UiButtonComponent } from '@shared/components/button/ui-button.component';
import { AuthService, RegisterRequest } from '@app/core/services/auth.service';
import { AppRoutes } from '@app/app.routes.constants';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly routes = AppRoutes;
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly form = new FormGroup({
    firstName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl<string>('', { nonNullable: true }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.register(this.form.getRawValue());
      this.router.navigate([AppRoutes.AUTH_LOGIN], { queryParams: { registered: 'true' } });
    } catch {
      this.errorMessage.set('Registration failed. The email may already be in use.');
    } finally {
      this.loading.set(false);
    }
  }
}
