import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

type Mode = 'in' | 'up';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly mode = signal<Mode>('in');
  protected readonly form = inject(FormBuilder).nonNullable.group({
    user: [''],
    email: ['', Validators.email],
    pass: [''],
  });

  protected setMode(mode: Mode): void {
    this.mode.set(mode);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.auth.login(this.form.controls.user.value);
    void this.router.navigateByUrl('/biblioteca');
  }

  protected guest(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/biblioteca');
  }
}
