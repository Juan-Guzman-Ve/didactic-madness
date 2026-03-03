import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

/**
 * UiCardComponent — Generic Material card wrapper with optional image, title, subtitle.
 *
 * Usage:
 *   <ui-card title="Intel i9-13900K" subtitle="$589.99" imageUrl="...">
 *     <ng-content /> <!-- card body -->
 *   </ui-card>
 */
@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [MatCardModule, MatDividerModule],
  templateUrl: './ui-card.component.html',
  styleUrl: './ui-card.component.scss',
})
export class UiCardComponent {
  title    = input<string>('');
  subtitle = input<string>('');
  imageUrl = input<string>('');
  hasActions = input<boolean>(false);
}
