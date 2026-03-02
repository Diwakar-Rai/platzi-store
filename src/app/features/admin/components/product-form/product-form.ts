import { Component, inject, input, output, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import {
  CategoryType,
  ProductPayload,
  ProductType,
} from '../../../products/models/products.models';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm {
  private api = inject(ApiService);

  product = input<ProductType | null>(null);

  saveProduct = output<Partial<ProductPayload>>();

  title = '';
  price: number | null = null;
  description = '';
  image = '';
  categoryId: number | null = null;

  categories = signal<CategoryType[]>([]);
  loading = signal(true);

  constructor() {
    this.api.get<CategoryType[]>('categories').subscribe((data) => {
      this.categories.set(data);
      this.loading.set(false);
    });

    effect(() => {
      const product = this.product();

      if (!product) {
        this.resetForm();
        return;
      }

      this.title = product.title;
      this.price = product.price;
      this.description = product.description;
      this.image = product.images?.[0] ?? '';
      this.categoryId = product.category?.id ?? null;
    });
  }

  submit() {
    if (!this.title || !this.price || !this.categoryId) return;

    this.saveProduct.emit({
      title: this.title,
      price: this.price,
      description: this.description,
      images: [this.image],
      categoryId: this.categoryId,
    });
  }

  private resetForm() {
    this.title = '';
    this.price = null;
    this.description = '';
    this.image = '';
    this.categoryId = null;
  }
}
