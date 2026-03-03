import { Component, input, output } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

/**
 * UiDialogComponent — Generic reusable dialog wrapper.
 *
 * Usage:
 *   <ui-dialog title="Confirm Delete" [visible]="showDialog" (close)="onClose()">
 *     <p>Are you sure you want to delete this product?</p>
 *     <div actions>
 *       <ui-button variant="stroked" label="Cancel" (clicked)="onClose()" />
 *       <ui-button variant="warn" label="Delete" (clicked)="onConfirm()" />
 *     </div>
 *   </ui-dialog>
 */
@Component({
  selector: 'ui-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIconModule],
  templateUrl: './ui-dialog.component.html',
  styleUrl: './ui-dialog.component.scss',
})
export class UiDialogComponent {
  title   = input<string>('');
  visible = input<boolean>(false);
  close   = output<void>();
}
