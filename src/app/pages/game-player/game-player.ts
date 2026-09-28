import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ScoreService } from '../../core/score.service';
import { findGame } from '../../data/games';
import { SerpentinaGame } from '../../games/serpentina/serpentina-game';
import { ScorePipe } from '../../shared/score.pipe';
import { GameOverDialog } from './game-over-dialog/game-over-dialog';

/** Game player: SERPENTINA is playable; the other games still use a fake score ticker. */
@Component({
  selector: 'app-game-player',
  imports: [RouterLink, ScorePipe, GameOverDialog, SerpentinaGame],
  templateUrl: './game-player.html',
  styleUrl: './game-player.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePlayerPage {
  private readonly auth = inject(AuthService);
  private readonly scores = inject(ScoreService);
  private readonly document = inject(DOCUMENT);

  readonly id = input.required<string>();

  protected readonly game = computed(() => findGame(this.id()));
  protected readonly playerName = computed(() => this.auth.user()?.name ?? 'INVITADO');
  protected readonly score = signal(0);
  protected readonly lives = signal(3);
  protected readonly paused = signal(false);
  protected readonly over = signal(false);

  protected readonly isSerpentina = computed(() => this.id() === 'serpentina');
  protected readonly gameLevel = signal(1);
  private readonly serpentina = viewChild(SerpentinaGame);

  protected readonly level = computed(() =>
    this.isSerpentina() ? this.gameLevel() : 1 + Math.floor(this.score() / 2500),
  );
  protected readonly levelLabel = computed(() => String(this.level()).padStart(2, '0'));
  protected readonly hearts = computed(() => '♥ '.repeat(this.lives()).trim() || '—');

  constructor() {
    const body = this.document.body;
    body.classList.add('game-view-active');
    inject(DestroyRef).onDestroy(() => body.classList.remove('game-view-active'));

    effect((onCleanup) => {
      if (this.isSerpentina() || this.over() || this.paused()) return;
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
    this.gameLevel.set(1);
    this.serpentina()?.reset();
    this.paused.set(false);
    this.over.set(false);
  }

  protected save(name: string): void {
    this.scores.save({ game: this.id(), score: this.score(), name });
  }
}
