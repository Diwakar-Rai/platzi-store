import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../cart/services/cart';
import { ProductType } from '../../models/products.models';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  private cartService = inject(CartService);
  product = input<ProductType>({} as ProductType);
  addToCart(product: ProductType) {
    this.cartService.addToCart(product);
  }
}
