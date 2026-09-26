import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, viewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'close()' },
})
export class Nav {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = this.auth.user;
  protected readonly open = signal(false);
  protected readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');
  protected readonly hamburger = viewChild.required<ElementRef<HTMLButtonElement>>('hamburger');
  protected readonly accountLabel = computed(() => (this.user() ? 'Cuenta' : 'Iniciar Sesión'));

  private readonly navigated = toSignal(
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)),
  );

  constructor() {
    // Close the mobile panel whenever a navigation finishes.
    effect(() => {
      this.navigated();
      this.open.set(false);
    });
    // Move focus into the panel when it opens.
    effect(() => {
      if (this.open()) {
        queueMicrotask(() => this.panel().nativeElement.querySelector<HTMLElement>('a')?.focus());
      }
    });
  }

  protected toggle(): void {
    this.open.update((v) => !v);
  }

  protected close(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.hamburger().nativeElement.focus();
  }

  protected signOut(): void {
    this.auth.logout();
  }
}
