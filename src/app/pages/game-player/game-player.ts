import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ScoreService } from '../../core/score.service';
import { findGame } from '../../data/games';
import { ScorePipe } from '../../shared/score.pipe';
import { GameOverDialog } from './game-over-dialog/game-over-dialog';

/** Visual-only player: a fake score ticker stands in for a real game. */
@Component({
  selector: 'app-game-player',
  imports: [RouterLink, ScorePipe, GameOverDialog],
  templateUrl: './game-player.html',
  styleUrl: './game-player.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePlayerPage {
  private readonly auth = inject(AuthService);
  private readonly scores = inject(ScoreService);

  readonly id = input.required<string>();

  protected readonly game = computed(() => findGame(this.id()));
  protected readonly playerName = computed(() => this.auth.user()?.name ?? 'INVITADO');
  protected readonly score = signal(0);
  protected readonly lives = signal(3);
  protected readonly paused = signal(false);
  protected readonly over = signal(false);

  protected readonly level = computed(() => 1 + Math.floor(this.score() / 2500));
  protected readonly levelLabel = computed(() => String(this.level()).padStart(2, '0'));
  protected readonly hearts = computed(() => '♥ '.repeat(this.lives()).trim() || '—');

  constructor() {
    effect((onCleanup) => {
      if (this.over() || this.paused()) return;
      const t = setInterval(() => this.score.update((s) => s + Math.floor(10 + Math.random() * 90)), 220);
      onCleanup(() => clearInterval(t));
    });
  }

  protected togglePause(): void {
    this.paused.update((p) => !p);
  }

  protected end(): void {
    this.over.set(true);
  }

  protected restart(): void {
    this.score.set(0);
    this.lives.set(3);
    this.paused.set(false);
    this.over.set(false);
  }

  protected save(name: string): void {
    this.scores.save({ game: this.id(), score: this.score(), name });
  }
}
