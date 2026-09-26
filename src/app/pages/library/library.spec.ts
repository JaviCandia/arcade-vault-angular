import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LibraryPage } from './library';

describe('LibraryPage', () => {
  async function setup() {
    await TestBed.configureTestingModule({ providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(LibraryPage);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('shows every game by default', async () => {
    const { el } = await setup();
    expect(el.querySelectorAll('app-game-card')).toHaveLength(8);
  });

  it('filters by category', async () => {
    const { fixture, el } = await setup();
    const chip = Array.from(el.querySelectorAll<HTMLButtonElement>('.chip')).find((b) => b.textContent?.trim() === 'SHOOTER');
    chip?.click();
    fixture.detectChanges();
    expect(el.querySelectorAll('app-game-card')).toHaveLength(2);
  });

  it('filters by search text and shows an empty state', async () => {
    const { fixture, el } = await setup();
    const input = el.querySelector<HTMLInputElement>('input[type="search"]')!;
    input.value = 'zzz';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(el.querySelectorAll('app-game-card')).toHaveLength(0);
    expect(el.textContent).toContain('NO HAY RESULTADOS');
  });
});
