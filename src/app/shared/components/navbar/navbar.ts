import { Component, effect, inject, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { CartService } from '../../../features/cart/services/cart';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  private authService = inject(Auth);
  public cartService = inject(CartService);

  isAuthenticated = this.authService.token;
  totalItems = this.cartService.totalItems;
  animate = signal(false);
  user = this.authService.user;

  constructor() {
    effect(() => {
      const count = this.totalItems();
      if (count > 0) {
        this.animate.set(true);

        setTimeout(() => {
          this.animate.set(false);
        }, 300);
      }
    });
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
