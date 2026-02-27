import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { Auth } from './core/services/auth';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, Navbar],
})
export class App {
  private authService = inject(Auth);
  constructor() {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token) {
      this.authService.getProfile().subscribe({
        next: (user) => this.authService.setUser(user),
        error: () => this.authService.logout(),
      });
    }
  }
}
