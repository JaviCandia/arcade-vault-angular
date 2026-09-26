import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
})
export class ContactForm {
  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/\S/)]],
    email: ['', [Validators.required, Validators.email]],
    msg: ['', [Validators.required, Validators.pattern(/\S/)]],
  });

  protected readonly sent = signal<string | null>(null);
  protected readonly shake = signal(false);

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.shake.set(true);
      setTimeout(() => this.shake.set(false), 400);
      return;
    }
    this.sent.set(this.form.controls.name.value.trim());
  }

  protected reset(): void {
    this.sent.set(null);
    this.form.reset();
  }

  protected invalid(name: 'name' | 'email' | 'msg'): boolean {
    const c = this.form.controls[name];
    return c.invalid && c.touched;
  }
}
