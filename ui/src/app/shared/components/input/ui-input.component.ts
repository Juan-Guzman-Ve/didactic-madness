import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * UiInputComponent — Generic text input wrapper.
 *
 * Works with Angular reactive forms. Pass a `FormControl` as [control].
 *
 * Usage:
 *   <ui-input
 *     label="Product Name"
 *     [control]="nameControl"
 *     type="text"
 *     placeholder="Enter product name" />
 */
@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './ui-input.component.html',
  styleUrl: './ui-input.component.scss',
})
export class UiInputComponent {
  // ── Inputs ──────────────────────────────────────────────────────────────────
  control     = input.required<FormControl<string | number | null>>();
  label       = input<string>('');
  placeholder = input<string>('');
  type        = input<'text' | 'email' | 'password' | 'number' | 'tel'>('text');
  icon        = input<string>('');
  required    = input<boolean>(false);

  // ── Error message mapping ───────────────────────────────────────────────────
  getErrorMessage(): string {
    const ctrl = this.control();
    if (ctrl.hasError('required')) return `${this.label() || 'This field'} is required.`;
    if (ctrl.hasError('email'))    return 'Invalid email address.';
    if (ctrl.hasError('min'))      return `Value must be at least ${ctrl.getError('min').min}.`;
    if (ctrl.hasError('max'))      return `Value must be at most ${ctrl.getError('max').max}.`;
    return 'Invalid value.';
  }
}
