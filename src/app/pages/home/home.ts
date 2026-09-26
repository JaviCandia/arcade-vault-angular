import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GAMES } from '../../data/games';
import { FAQ, FEATURES, PRICE_PERKS, STATS, TICKER, TOP_PLAYERS } from '../../data/home-data';
import { MiniCard } from '../../shared/mini-card/mini-card';
import { PixelIcon } from '../../shared/pixel-icon/pixel-icon';
import { RevealDirective } from '../../shared/reveal.directive';
import { ScorePipe } from '../../shared/score.pipe';
import { FloatingSilhouettes } from './floating-silhouettes/floating-silhouettes';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FloatingSilhouettes, MiniCard, PixelIcon, RevealDirective, ScorePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  protected readonly features = FEATURES;
  protected readonly games = GAMES.slice(0, 6);
  protected readonly stats = STATS;
  protected readonly ticker = TICKER;
  protected readonly top = TOP_PLAYERS;
  protected readonly perks = PRICE_PERKS;
  protected readonly faq = FAQ;

  protected rankClass(i: number): string {
    return i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : '';
  }

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
