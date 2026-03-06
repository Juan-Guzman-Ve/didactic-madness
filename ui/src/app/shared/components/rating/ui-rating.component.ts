import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

/**
 * UiRatingComponent — Star rating display (NZXT-style)
 *
 * Usage:
 *   <ui-rating [rating]="4.5" [maxRating]="5" />
 *   <ui-rating [rating]="3" [interactive]="true" (ratingChange)="onRate($event)" />
 */
@Component({
  selector: 'ui-rating',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './ui-rating.component.html',
  styleUrl: './ui-rating.component.scss',
})
export class UiRatingComponent {
  // ── Inputs ──────────────────────────────────────────────────────────────────
  rating = input<number>(0);
  maxRating = input<number>(5);
  interactive = input<boolean>(false);
  showCount = input<boolean>(false);
  reviewCount = input<number>(0);
  size = input<'small' | 'medium' | 'large'>('medium');

  // ── Outputs ─────────────────────────────────────────────────────────────────
  ratingChange = output<number>();

  // ── Methods ─────────────────────────────────────────────────────────────────
  get stars(): Array<'full' | 'half' | 'empty'> {
    const stars: Array<'full' | 'half' | 'empty'> = [];
    const fullStars = Math.floor(this.rating());
    const hasHalfStar = this.rating() % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }

    if (hasHalfStar) {
      stars.push('half');
    }

    while (stars.length < this.maxRating()) {
      stars.push('empty');
    }

    return stars;
  }

  onStarClick(index: number): void {
    if (this.interactive()) {
      this.ratingChange.emit(index + 1);
    }
  }
}
