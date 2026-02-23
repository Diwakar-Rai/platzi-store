import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ProductType } from '../models/products.models';

@Injectable({
  providedIn: 'root',
})
export class Product {
  private api: ApiService = inject(ApiService);
  getProducts() {
    return this.api.get<ProductType[]>('products');
  }
  getProductById(id: number) {
    return this.api.get<ProductType>(`products/${id}`);
  }
}
