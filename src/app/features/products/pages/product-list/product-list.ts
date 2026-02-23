import { Component, inject, signal } from '@angular/core';
import { Product } from '../../services/product';
import { Loader } from '../../../../shared/components/loader/loader';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message';
import { ProductCard } from '../../components/product-card/product-card';

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [Loader, ErrorMessage, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private productService = inject(Product);
  loading = signal(true);
  error = signal(false);
  products = signal<any[]>([]);
  limit = signal(12);
  offset = signal(0);
  search = signal('');
  priceMin = signal<number | null>(null);
  priceMax = signal<number | null>(null);
  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService
      .getProducts({
        limit: this.limit(),
        offset: this.offset(),
        title: this.search(),
        price_min: this.priceMin() ?? undefined,
        price_max: this.priceMax() ?? undefined,
      })
      .subscribe({
        next: (data) => {
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
  applyFilters() {
    this.offset.set(0);
    this.loadProducts();
  }
  nextPage() {
    this.loading.set(true);
    this.offset.set(this.offset() + this.limit());
    this.loadProducts();
  }

  previousPage() {
    this.loading.set(true);
    if (this.offset() === 0) return;
    this.offset.set(this.offset() - this.limit());
    this.loadProducts();
  }
}
