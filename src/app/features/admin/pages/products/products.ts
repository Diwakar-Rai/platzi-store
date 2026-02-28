import { Component, inject, signal } from '@angular/core';
import { Product } from '../../../products/services/product';
import { ProductType } from '../../../products/models/products.models';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private productService = inject(Product);
  products = signal<ProductType[]>([]);
  loading = signal(true);

  constructor() {
    this.load();
  }

  load() {
    this.productService.getProducts({ limit: 50, offset: 0 }).subscribe((data) => {
      this.products.set(data);
      this.loading.set(false);
    });
  }

  delete(id: number) {
    this.productService.deleteProduct(id).subscribe(() => this.load());
  }
}
