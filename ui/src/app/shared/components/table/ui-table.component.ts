import {
  Component,
  input,
  output,
  computed,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgTemplateOutlet } from '@angular/common';
import { UiEmptyStateComponent } from '@shared/components/empty-state/ui-empty-state.component';

/**
 * Column definition for UiTableComponent.
 *
 * @example
 * columns: ColumnDef<Product>[] = [
 *   { key: 'name',  header: 'Product',  sortable: true },
 *   { key: 'price', header: 'Price',    sortable: true, formatter: (v) => `$${v}` },
 *   { key: 'stock', header: 'Stock' },
 * ];
 */
export interface ColumnDef<T> {
  /** Property name on the data object */
  key: keyof T & string;
  /** Column header label */
  header: string;
  /** Optional value formatter */
  formatter?: (value: unknown, row: T) => string;
  /** Whether this column is sortable */
  sortable?: boolean;
  /** CSS min-width e.g. '120px' */
  width?: string;
}

export interface PageChange {
  page: number;
  pageSize: number;
}

/**
 * UiTableComponent — Generic, reusable data table.
 *
 * Generic scoped usage:
 *   In ProductsTableComponent, import UiTableComponent and pass typed columns + data.
 *   This keeps column definitions scoped while keeping the rendering generic.
 */
@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    NgTemplateOutlet,
    UiEmptyStateComponent,
  ],
  templateUrl: './ui-table.component.html',
  styleUrl: './ui-table.component.scss',
})
export class UiTableComponent<T extends object> {
  // ── Inputs ──────────────────────────────────────────────────────────────────
  data         = input.required<T[]>();
  columns      = input.required<ColumnDef<T>[]>();
  loading      = input<boolean>(false);
  paginated    = input<boolean>(true);
  totalItems   = input<number>(0);
  pageSize     = input<number>(20);
  rowClickable = input<boolean>(false);
  /** Pass an ng-template ref for custom action buttons per row */
  actionsTemplate = input<import('@angular/core').TemplateRef<{ $implicit: T }> | null>(null);

  // ── Outputs ─────────────────────────────────────────────────────────────────
  pageChange = output<PageChange>();
  sortChange = output<Sort>();
  rowClick   = output<T>();

  // ── Derived ─────────────────────────────────────────────────────────────────
  hasActions = computed(() => this.actionsTemplate() !== null);

  displayedColumns = computed(() => {
    const cols = this.columns().map((c) => c.key);
    return this.hasActions() ? [...cols, '__actions'] : cols;
  });

  onPage(event: PageEvent): void {
    this.pageChange.emit({ page: event.pageIndex, pageSize: event.pageSize });
  }

  onSort(sort: Sort): void {
    this.sortChange.emit(sort);
  }
}
