import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductsService, Product } from '@app/core/services/products.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);
  
  product = signal<Product | null>(null);
  loading = signal(false);
  selectedImage = signal(0);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // TODO: Load product details
      // this.loading.set(true);
      // const product = await this.productsService.getProduct(id);
      // this.product.set(product);
      // this.loading.set(false);
    }
  }

  addToCart() {
    // TODO: Add to cart functionality
    throw new Error('Not implemented');
  }
}
