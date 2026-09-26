import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { findGame } from '../../data/games';
import { seededScores } from '../../data/scores';
import { Leaderboard } from '../../shared/leaderboard/leaderboard';
import { ScorePipe } from '../../shared/score.pipe';

@Component({
  selector: 'app-game-detail',
  imports: [RouterLink, Leaderboard, ScorePipe],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameDetailPage {
  readonly id = input.required<string>();

  protected readonly game = computed(() => findGame(this.id()));
  protected readonly scores = computed(() => seededScores(this.id().length * 17 + 3, 10));
}
