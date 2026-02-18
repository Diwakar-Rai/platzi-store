import { Routes } from '@angular/router';
import { ProductList } from './pages/product-list/product-list';
import { ProductDetail } from './pages/product-detail/product-detail';
export const PRODUCT_ROUTES: Routes = [
  { path: '', component: ProductList },
  { path: ':id', component: ProductDetail },
];
