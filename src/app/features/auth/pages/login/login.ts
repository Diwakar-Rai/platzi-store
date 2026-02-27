import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../../../core/services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
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
  showPassword = signal(false);

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  onLogin() {
    this.loading.set(true);

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.authService.setToken(res.access_token);
        this.authService.getProfile().subscribe((user) => {
          this.authService.setUser(user);
          this.router.navigate(['/products']);
        });
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
