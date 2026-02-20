import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  product = input<Product>({} as Product);
}
