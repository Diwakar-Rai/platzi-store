import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../../features/auth/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private api = inject(ApiService);
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _user = signal<User | null>(null);

  token = computed(() => this._token());
  user = computed(() => this._user());
  isAuthenticated = computed(() => !!this._token());
  isAdmin = computed(() => this._user()?.role === 'admin');

  login(email: string, password: string) {
    return this.api.post<{ access_token: string }>('auth/login', { email, password });
  }

  register(data: { email: string; password: string; name: string; avatar: string }) {
    return this.api.post<User>('users', data);
  }

  getProfile() {
    return this.api.get<User>('auth/profile');
  }
  setToken(token: string) {
    localStorage.setItem('token', token);
    this._token.set(token);
  }

  setUser(user: User) {
    this._user.set(user);
  }

  restoreSession() {
    if (!this._token()) return;
    this.getProfile().subscribe({
      next: (user) => this._user.set(user),
      error: () => this.logout(),
    });
  }
  logout() {
    localStorage.removeItem('token');
    this._token.set(null);
    this._user.set(null);
  }
}
