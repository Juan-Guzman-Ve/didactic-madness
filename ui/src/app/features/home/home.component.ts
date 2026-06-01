import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ProductsService, Category, categoryImageUrl } from '@app/core/services/products.service';
import { AppRoutes } from '@app/app.routes.constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);

  protected readonly routes = AppRoutes;
  protected readonly categories = signal<Category[]>([]);
  protected readonly loading = signal(false);

  protected categoryImageUrl = categoryImageUrl;

  readonly categorySkeleton = [1, 2, 3, 4, 5, 6];

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      await this.productsService.loadCategories();
      this.categories.set(this.productsService.categories());
    } finally {
      this.loading.set(false);
    }
  }
}
