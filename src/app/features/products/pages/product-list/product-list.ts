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
  loading: boolean = true;
  products = signal<any[]>([]);
  private productService = inject(Product);

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log(data);
        this.products.set(data);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
