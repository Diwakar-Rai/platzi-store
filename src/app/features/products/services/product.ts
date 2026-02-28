import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ProductType } from '../models/products.models';

@Injectable({
  providedIn: 'root',
})
export class Product {
  private api: ApiService = inject(ApiService);
  getProducts(params: {
    limit?: number;
    offset?: number;
    title?: string;
    price_min?: number;
    price_max?: number;
  }) {
    const query = new URLSearchParams();
    if (params.limit !== undefined) query.append('limit', params.limit.toString());
    if (params.offset !== undefined) query.append('offset', params.offset.toString());
    if (params.title !== undefined) query.append('title', params.title);
    if (params.price_min !== undefined) query.append('limit', params.price_min.toString());
    if (params.price_max !== undefined) query.append('limit', params.price_max.toString());
    return this.api.get<ProductType[]>(`products?${query.toString()}`);
  }
  getProductById(id: number) {
    return this.api.get<ProductType>(`products/${id}`);
  }

  createProduct(data: Partial<ProductType>) {
    return this.api.post<ProductType>('products', data);
  }

  updateProduct(id: number, data: Partial<ProductType>) {
    return this.api.put<ProductType>(`products/${id}`, data);
  }

  deleteProduct(id: number) {
    return this.api.delete(`products/${id}`);
  }
}
