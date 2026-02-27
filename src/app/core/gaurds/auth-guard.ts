import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  const requiredRole = route.data?.['role'];
  if (requiredRole && authService.user()?.role !== requiredRole) {
    router.navigate(['/products']);
    return false;
  }
  return true;
};
