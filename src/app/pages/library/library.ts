import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CATS, GAMES } from '../../data/games';
import { GameCard } from '../../shared/game-card/game-card';

@Component({
  selector: 'app-library',
  imports: [GameCard],
  templateUrl: './library.html',
  styleUrl: './library.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'fade-in' },
})
export class LibraryPage {
  protected readonly cats = CATS;
  protected readonly query = signal('');
  protected readonly category = signal<string>('TODOS');

  protected readonly filtered = computed(() => {
    const q = this.query().toLowerCase();
    const cat = this.category();
    return GAMES.filter((g) => (cat === 'TODOS' || g.cat === cat) && g.title.toLowerCase().includes(q));
  });

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
