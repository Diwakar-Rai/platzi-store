import { Routes } from '@angular/router';
import { authGuard } from './core/gaurds/auth-guard';

export const routes: Routes = [
  {
    path: 'products',
    canActivate: [authGuard],
    loadChildren: () => import('./features/products/product.routes').then((m) => m.PRODUCT_ROUTES),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart.routes').then((m) => m.CART_ROUTES),
  },
];
