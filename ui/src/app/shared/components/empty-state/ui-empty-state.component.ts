import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/**
 * UiEmptyStateComponent — Generic placeholder for empty lists / tables.
 *
 * Usage:
 *   <ui-empty-state icon="inbox" title="No products" message="Start by adding your first product." />
 */
@Component({
  selector: 'ui-empty-state',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './ui-empty-state.component.html',
  styleUrl: './ui-empty-state.component.scss',
})
export class UiEmptyStateComponent {
  icon    = input<string>('inbox');
  title   = input<string>('No data');
  message = input<string>('');
}
