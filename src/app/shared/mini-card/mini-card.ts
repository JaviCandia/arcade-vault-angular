import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Game } from '../../data/games';

@Component({
  selector: 'app-mini-card',
  imports: [RouterLink],
  templateUrl: './mini-card.html',
  styleUrl: './mini-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniCard {
  readonly game = input.required<Game>();
}
