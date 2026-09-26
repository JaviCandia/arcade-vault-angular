import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ScoreRow } from '../../data/scores';
import { ScorePipe } from '../score.pipe';

@Component({
  selector: 'app-leaderboard',
  imports: [ScorePipe],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Leaderboard {
  readonly rows = input.required<ScoreRow[]>();

  protected rankClass(i: number): string {
    return i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : '';
  }

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
