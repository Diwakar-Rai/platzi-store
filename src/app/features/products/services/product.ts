import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class Product {
  private api: ApiService = inject(ApiService);
  getProducts() {
    return this.api.get<any[]>('products');
  }
  getProductById(id: number) {
    return this.api.get<any>(`products/${id}`);
  }
}
