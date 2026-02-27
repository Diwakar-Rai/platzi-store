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
  private _accessToken = signal<string | null>(
    localStorage.getItem('access_token') || sessionStorage.getItem('access_token'),
  );
  private _refreshToken = signal<string | null>(
    localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token'),
  );
  private _storageType = signal<'local' | 'session'>(
    localStorage.getItem('access_token')
      ? 'local'
      : sessionStorage.getItem('access_token')
        ? 'session'
        : 'local',
  );

  token = computed(() => this._token());
  user = computed(() => this._user());
  isAuthenticated = computed(() => !!this._token());
  isAdmin = computed(() => this._user()?.role === 'admin');
  accessToken = computed(() => this._accessToken());
  refreshToken = computed(() => this._refreshToken());

  login(email: string, password: string) {
    return this.api.post<{ access_token: string; refresh_token: string }>('auth/login', {
      email,
      password,
    });
  }

  register(data: { email: string; password: string; name: string; avatar: string }) {
    return this.api.post<User>('users', data);
  }

  getProfile() {
    return this.api.get<User>('auth/profile');
  }

  private getStorage() {
    return localStorage.getItem('access_token') ? localStorage : sessionStorage;
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
  setSession(accessToken: string, refreshToken: string, remember: boolean) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('access_token', accessToken);
    storage.setItem('refresh_token', refreshToken);
    this._storageType.set(remember ? 'local' : 'session');
    this._accessToken.set(accessToken);
    this._refreshToken.set(refreshToken);
  }

  updateTokens(accessToken: string, refreshToken: string) {
    const storage = this._storageType() === 'local' ? localStorage : sessionStorage;

    storage.setItem('access_token', accessToken);
    storage.setItem('refresh_token', refreshToken);
    this._accessToken.set(accessToken);
    this._refreshToken.set(refreshToken);
  }
  refreshAccessToken() {
    const refreshToken = this._refreshToken();
    if (!refreshToken) return null;
    return this.api.post<{ access_token: string; refresh_token: string }>('auth/refresh-token', {
      refreshToken,
    });
  }
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');

    this._token.set(null);
    this._refreshToken.set(null);
    this._user.set(null);
  }
}
