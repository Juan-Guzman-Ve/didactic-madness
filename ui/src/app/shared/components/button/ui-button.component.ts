import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * UiButtonComponent — Generic button wrapper around Angular Material buttons.
 *
 * Usage (in a scoped component):
 *   <ui-button variant="primary" label="Save" (clicked)="onSave()" />
 *   <ui-button variant="icon" icon="delete" (clicked)="onDelete()" />
 *
 * Scoped extension pattern:
 *   Instead of reimplementing, a scoped component simply sets the inputs:
 *   <ui-button variant="warn" label="Delete Product" [loading]="isSaving" (clicked)="delete()" />
 */
export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'warn' | 'icon' | 'stroked';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.scss',
})
export class UiButtonComponent {
  // ── Inputs ──────────────────────────────────────────────────────────────────
  variant  = input<ButtonVariant>('primary');
  label    = input<string>('');
  icon     = input<string>('');
  disabled = input<boolean>(false);
  loading  = input<boolean>(false);
  type     = input<'button' | 'submit' | 'reset'>('button');

  // ── Outputs ─────────────────────────────────────────────────────────────────
  clicked = output<void>();

  // ── Derived ─────────────────────────────────────────────────────────────────
  matColor(): 'primary' | 'accent' | 'warn' | '' {
    const map: Record<ButtonVariant, 'primary' | 'accent' | 'warn' | ''> = {
      primary:   'primary',
      secondary: '',
      accent:    'accent',
      warn:      'warn',
      icon:      'primary',
      stroked:   'primary',
    };
    return map[this.variant()] ?? 'primary';
  }
}
