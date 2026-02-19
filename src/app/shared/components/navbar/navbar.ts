import { Component, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  private authService = inject(Auth);
  isAuthenticated = this.authService.token;

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
