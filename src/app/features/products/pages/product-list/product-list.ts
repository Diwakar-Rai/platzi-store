import { Component, inject, signal } from '@angular/core';
import { Product } from '../../services/product';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private productService = inject(Product);
  loading = signal(true);
  error = signal(false);
  products = signal<any[]>([]);
  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log(data);
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.log('API Error', err);
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
