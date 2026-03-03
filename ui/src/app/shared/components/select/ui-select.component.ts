import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

/**
 * UiSelectComponent — Generic dropdown wrapper.
 *
 * Usage:
 *   <ui-select
 *     label="Category"
 *     [control]="categoryControl"
 *     [options]="categories"
 *     optionLabel="name"
 *     optionValue="id" />
 */
export interface SelectOption {
  [key: string]: unknown;
}

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './ui-select.component.html',
  styleUrl: './ui-select.component.scss',
})
export class UiSelectComponent {
  // ── Inputs ──────────────────────────────────────────────────────────────────
  control      = input.required<FormControl<unknown>>();
  options      = input.required<SelectOption[]>();
  optionLabel  = input<string>('label');
  optionValue  = input<string>('value');
  label        = input<string>('');
  placeholder  = input<string>('Select an option');
}
