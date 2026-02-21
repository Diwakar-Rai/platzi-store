import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../cart/services/cart';
export interface Product {
  id: string;
  images: string[];
  title: string;
  description: string;
  price: number;
}
@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  private cartService = inject(CartService);
  product = input<Product>({} as Product);
  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
}
