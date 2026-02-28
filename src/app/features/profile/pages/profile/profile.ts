import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../../../core/services/auth';
import { ApiService } from '../../../../core/services/api.service';
import { User } from '../../../auth/models/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private authService = inject(Auth);
  private api = inject(ApiService);

  user = this.authService.user;
  editing = signal(false);
  loading = signal(false);
  error = signal(false);
  name = '';
  avatar = '';

  enableEdit() {
    const current = this.user();
    if (!current) return;
    this.name = current.name;
    this.avatar = current.avatar;
    this.editing.set(true);
  }

  save() {
    const current = this.user();
    if (!current) return;
    this.loading.set(true);
    this.api
      .put<User>(`users/${current.id}`, {
        name: this.name,
        avatar: this.avatar,
      })
      .subscribe({
        next: (updated) => {
          this.authService.setUser(updated);
          this.editing.set(false);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}
