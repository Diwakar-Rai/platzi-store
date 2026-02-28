import { Routes } from '@angular/router';
import { authGuard } from '../../core/gaurds/auth-guard';
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    // canActivate: [authGuard],
    data: { role: 'admin' },
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products/products').then((m) => m.Products),
      },
      // {
      //   path: 'categories',
      //   loadComponent: () => import('./pages/categories/categories').then((m) => m.Categories),
      // },
    ],
  },
];
