import { Component, signal, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Title } from '@angular/platform-browser';

// Import all generic components
import { UiButtonComponent } from '@shared/components/button/ui-button.component';
import { UiTableComponent, ColumnDef } from '@shared/components/table/ui-table.component';
import { UiEmptyStateComponent } from '@shared/components/empty-state/ui-empty-state.component';
import { UiInputComponent } from '@shared/components/input/ui-input.component';
import { UiSelectComponent, SelectOption } from '@shared/components/select/ui-select.component';
import { UiCardComponent } from '@shared/components/card/ui-card.component';
import { UiDialogComponent } from '@shared/components/dialog/ui-dialog.component';
import { UiCheckboxComponent } from '@shared/components/checkbox/ui-checkbox.component';
import { UiChipComponent } from '@shared/components/chip/ui-chip.component';
import { UiSpinnerComponent } from '@shared/components/spinner/ui-spinner.component';
import { UiRatingComponent } from '@shared/components/rating/ui-rating.component';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    UiButtonComponent,
    UiTableComponent,
    UiEmptyStateComponent,
    UiInputComponent,
    UiSelectComponent,
    UiCardComponent,
    UiDialogComponent,
    UiCheckboxComponent,
    UiChipComponent,
    UiSpinnerComponent,
    UiRatingComponent,
  ],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss',
})
export class ShowcaseComponent {
  private readonly title = inject(Title);

  constructor() {
    this.title.setTitle('Component Showcase — PC Store');
  }

  // ─── Button examples ────────────────────────────────────────────────────────
  btnLoading = signal(false);
  onButtonClick(variant: string) {
    console.log(`Button clicked: ${variant}`);
    this.btnLoading.set(true);
    setTimeout(() => this.btnLoading.set(false), 1500);
  }

  // ─── Form examples ──────────────────────────────────────────────────────────
  nameControl      = new FormControl<string>('', [Validators.required]);
  emailControl     = new FormControl<string>('', [Validators.required, Validators.email]);
  priceControl     = new FormControl<number | null>(null, [Validators.required, Validators.min(0)]);
  categoryControl  = new FormControl<string>('', [Validators.required]);
  agreeControl     = new FormControl<boolean>(false);

  categories: SelectOption[] = [
    { id: 'cpu', name: 'CPU' },
    { id: 'gpu', name: 'GPU' },
    { id: 'ram', name: 'RAM' },
    { id: 'storage', name: 'Storage' },
  ];

  // ─── Table examples ─────────────────────────────────────────────────────────
  products = signal<Product[]>([
    { 
      id: '1', 
      name: 'Intel i9-13900K', 
      category: 'CPU', 
      price: 589.99, 
      stock: 12,
      rating: 4.5,
      reviewCount: 234,
      imageUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400&h=300&fit=crop'
    },
    { 
      id: '2', 
      name: 'RTX 4090', 
      category: 'GPU', 
      price: 1599.99, 
      stock: 5,
      rating: 4.8,
      reviewCount: 567,
      imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop'
    },
    { 
      id: '3', 
      name: 'Corsair Vengeance DDR5', 
      category: 'RAM', 
      price: 129.99, 
      stock: 45,
      rating: 4.3,
      reviewCount: 892,
      imageUrl: 'https://images.unsplash.com/photo-1541348263662-e068662d82af?w=400&h=300&fit=crop'
    },
    { 
      id: '4', 
      name: 'Samsung 990 Pro', 
      category: 'Storage', 
      price: 199.99, 
      stock: 0,
      rating: 4.7,
      reviewCount: 1023,
      imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop'
    },
    { 
      id: '5', 
      name: 'NZXT H710i Case', 
      category: 'Case', 
      price: 169.99, 
      stock: 23,
      rating: 4.6,
      reviewCount: 445,
      imageUrl: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&h=300&fit=crop'
    },
    { 
      id: '6', 
      name: 'Corsair RM850x PSU', 
      category: 'PSU', 
      price: 134.99, 
      stock: 18,
      rating: 4.9,
      reviewCount: 678,
      imageUrl: 'https://images.unsplash.com/photo-1591799265444-d66432b91588?w=400&h=300&fit=crop'
    },
  ]);

  tableLoading = signal(false);
  tableColumns: ColumnDef<Product>[] = [
    { key: 'name',     header: 'Product',  sortable: true },
    { key: 'category', header: 'Category', sortable: true },
    { key: 'price',    header: 'Price',    sortable: true, formatter: (v) => `$${v}` },
    { key: 'stock',    header: 'Stock',    sortable: true },
  ];

  onRowClick(product: Product) {
    console.log('Row clicked:', product);
  }

  onPageChange(event: any) {
    console.log('Page change:', event);
  }

  onSortChange(event: any) {
    console.log('Sort change:', event);
  }

  // ─── Dialog examples ────────────────────────────────────────────────────────
  dialogVisible = signal(false);

  openDialog() {
    this.dialogVisible.set(true);
  }

  closeDialog() {
    this.dialogVisible.set(false);
  }

  confirmDialog() {
    console.log('Confirmed!');
    this.closeDialog();
  }

  // ─── Spinner examples ───────────────────────────────────────────────────────
  spinnerVisible = signal(false);

  showSpinner() {
    this.spinnerVisible.set(true);
    setTimeout(() => this.spinnerVisible.set(false), 3000);
  }
}
