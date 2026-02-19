import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private api = inject(ApiService);
  token = signal<string | null>(localStorage.getItem('token'));
  login(email: string, password: string) {
    return this.api.post<{ access_token: string }>('auth/login', { email, password });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.token.set(token);
  }

  logout() {
    localStorage.removeItem('token');
    this.token.set(null);
  }

  isAuthenticated() {
    return !!this.token();
  }
}
