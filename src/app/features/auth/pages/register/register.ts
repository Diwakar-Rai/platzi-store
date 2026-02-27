import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Auth } from '../../../../core/services/auth';
import { RouterLink } from '@angular/router';

interface RegisterForm {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  avatar: FormControl<string>;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  registerForm: FormGroup<RegisterForm> = this.fb.group({
    name: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
    avatar: this.fb.nonNullable.control('https://api.lorem.space/image/face?w=640&h=480', [
      Validators.required,
    ]),
  });

  // ✅ Correct password strength
  passwordStrength = computed(() => {
    const value = this.registerForm.controls.password.value;
    if (!value) return 0;

    let score = 0;
    if (value.length >= 6) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    return score;
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.success.set(true);
        this.registerForm.reset({
          name: '',
          email: '',
          password: '',
          avatar: 'https://api.lorem.space/image/face?w=640&h=480',
        });
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Registration failed');
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }
}
