import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService, Product } from '@app/core/services/products.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  
  products = signal<Product[]>([]);
  loading = signal(false);

  async ngOnInit() {
    // TODO: Load products with filters
    // await this.productsService.loadProducts();
    // this.products.set(this.productsService.products());
  }
}
