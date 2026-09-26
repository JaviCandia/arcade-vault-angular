import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { GAMES } from '../../data/games';
import { seededScores } from '../../data/scores';
import { ScorePipe } from '../../shared/score.pipe';

@Component({
  selector: 'app-hall-of-fame',
  imports: [RouterLink, ScorePipe],
  templateUrl: './hall-of-fame.html',
  styleUrl: './hall-of-fame.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HallOfFamePage {
  protected readonly user = inject(AuthService).user;
  protected readonly games = GAMES;
  protected readonly tab = signal(GAMES[0].id);

  protected readonly game = computed(() => GAMES.find((g) => g.id === this.tab()) ?? GAMES[0]);
  protected readonly rows = computed(() => seededScores(this.tab().length * 23 + 7, 12));
  protected readonly podium = computed(() => this.rows().slice(0, 3));
  protected readonly youRank = computed(() => 8 + (this.tab().length % 4));
  protected readonly youScore = computed(() => (this.rows()[5]?.score ?? 0) - 2400 || 9999);

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  protected rankClass(i: number): string {
    return i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : '';
  }
}
