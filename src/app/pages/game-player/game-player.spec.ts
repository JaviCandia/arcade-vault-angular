import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GamePlayerPage } from './game-player';

describe('GamePlayerPage', () => {
  async function setup(id: string) {
    await TestBed.configureTestingModule({ providers: [provideRouter([])] }).compileComponents();
    const fixture = TestBed.createComponent(GamePlayerPage);
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('mounts the real game for serpentina and hides lives', async () => {
    const el = await setup('serpentina');
    expect(el.querySelector('app-serpentina-game')).not.toBeNull();
    expect(el.querySelector('.game-arena')).toBeNull();
    expect(el.querySelector('.hud-stat.lives')).toBeNull();
  });

  it('keeps the fake arena and lives for other games', async () => {
    const el = await setup('caida');
    expect(el.querySelector('app-serpentina-game')).toBeNull();
    expect(el.querySelector('.game-arena')).not.toBeNull();
    expect(el.querySelector('.hud-stat.lives')).not.toBeNull();
  });
});
