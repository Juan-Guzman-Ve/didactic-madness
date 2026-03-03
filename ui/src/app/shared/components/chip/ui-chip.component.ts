import { Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

/**
 * UiChipComponent — Generic Material chip / tag.
 *
 * Usage:
 *   <ui-chip label="In Stock" color="accent" />
 *   <ui-chip label="Out of Stock" color="warn" />
 */
@Component({
  selector: 'ui-chip',
  standalone: true,
  imports: [MatChipsModule],
  templateUrl: './ui-chip.component.html',
  styleUrl: './ui-chip.component.scss',
})
export class UiChipComponent {
  label = input.required<string>();
  color = input<'primary' | 'accent' | 'warn'>('primary');
}
