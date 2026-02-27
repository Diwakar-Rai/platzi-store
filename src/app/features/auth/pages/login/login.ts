import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../../../core/services/auth';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(Auth);
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);

  email = '';
  password = '';
  rememberMe = false;
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
        this.authService.setSession(res.access_token, res.refresh_token, this.rememberMe);
        this.authService.getProfile().subscribe((user) => {
          this.authService.setUser(user);
          const returnUrl = this.activeRoute.snapshot.queryParams['returnUrl'] || '/products';
          this.router.navigate([returnUrl]);
        });
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
