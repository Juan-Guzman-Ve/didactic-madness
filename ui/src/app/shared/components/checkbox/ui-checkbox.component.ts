import { Component, input, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

/**
 * Ui CheckboxComponent — Generic checkbox wrapper.
 *
 * Usage:
 *   <ui-checkbox label="Accept terms" [control]="termsControl" />
 */
@Component({
  selector: 'ui-checkbox',
  standalone: true,
  imports: [ReactiveFormsModule, MatCheckboxModule],
  templateUrl: './ui-checkbox.component.html',
  styleUrl: './ui-checkbox.component.scss',
})
export class UiCheckboxComponent {
  control = input.required<FormControl<boolean | null>>();
  label   = input<string>('');
  color   = input<'primary' | 'accent' | 'warn'>('primary');
}
