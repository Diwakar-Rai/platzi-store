import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../../../core/services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal(false);

  onLogin() {
    this.loading.set(true);

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.authService.setToken(res.access_token);
        this.router.navigate(['/products']);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
