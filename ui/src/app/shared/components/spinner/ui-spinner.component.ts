import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * UiSpinnerComponent — Generic loading spinner.
 *
 * Usage:
 *   <ui-spinner [show]="isLoading" />
 */
@Component({
  selector: 'ui-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './ui-spinner.component.html',
  styleUrl: './ui-spinner.component.scss',
})
export class UiSpinnerComponent {
  show     = input<boolean>(false);
  diameter = input<number>(48);
  message  = input<string>('');
  color    = input<'primary' | 'accent' | 'warn'>('primary');
}
