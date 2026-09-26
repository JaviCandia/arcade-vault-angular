import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Game } from '../../data/games';
import { ScorePipe } from '../score.pipe';
import { TiltDirective } from '../tilt.directive';

@Component({
  selector: 'app-game-card',
  imports: [RouterLink, ScorePipe, TiltDirective],
  templateUrl: './game-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCard {
  private readonly router = inject(Router);

  readonly game = input.required<Game>();
  protected readonly buttonClass = computed(() => {
    const c = this.game().color;
    return c === 'magenta' || c === 'yellow' ? `btn ${c}` : 'btn';
  });

  /** Mouse convenience: the whole card is clickable; keyboard users use the links. */
  protected open(): void {
    void this.router.navigate(['/biblioteca', this.game().id]);
  }
}
