import { Component, inject, signal } from '@angular/core';
import { Product } from '../../services/product';
import { RouterLink } from '@angular/router';
import { Loader } from '../../../../shared/components/loader/loader';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message';
import { ProductCard } from '../../components/product-card/product-card';

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [RouterLink, Loader, ErrorMessage, ProductCard],
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
        this.error.set(true);
        console.log('User message:', err.userMessage);
        this.loading.set(false);
      },
    });
  }
}
