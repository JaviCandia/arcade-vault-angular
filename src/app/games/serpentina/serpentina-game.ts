import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  COLS,
  Direction,
  ROWS,
  SnakeState,
  createState,
  levelFor,
  queueTurn,
  step,
  tickMsFor,
} from './serpentina-engine';

const KEY_TO_DIR: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
};

/** Longest frame gap we simulate; avoids a burst of ticks after a tab switch. */
const MAX_FRAME_MS = 250;

@Component({
  selector: 'app-serpentina-game',
  templateUrl: './serpentina-game.html',
  styleUrl: './serpentina-game.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onKey($event)',
    '(document:visibilitychange)': 'onVisibility()',
  },
})
export class SerpentinaGame {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('board');

  readonly paused = input(false);
  readonly scoreChange = output<number>();
  readonly levelChange = output<number>();
  readonly ended = output<number>();
  readonly pauseToggle = output<void>();

  private readonly state = signal<SnakeState>(createState(Math.random));
  private lastScore = 0;
  private lastLevel = 1;
  private acc = 0;
  private reducedMotion = false;

  protected readonly status = computed(() => this.state().status);
  protected readonly announcement = signal('');
  protected readonly label = computed(
    () => `Tablero de Serpentina: serpiente de ${this.state().snake.length} segmentos, ${this.state().score} puntos`,
  );

  constructor() {
    afterNextRender(() => this.start());
  }

  /** Starts a fresh round (used by the parent's "play again"). */
  reset(): void {
    this.state.set(createState(Math.random));
    this.lastScore = 0;
    this.lastLevel = 1;
    this.acc = 0;
    this.announcement.set('');
  }

  protected onKey(e: KeyboardEvent): void {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    const target = e.target as HTMLElement | null;
    const inField = !!target?.closest('input, textarea, select');
    if (inField || this.state().status === 'over') return;

    if (e.code === 'Space' || e.code === 'KeyP') {
      // Space on a focused button/link activates it natively; don't toggle twice.
      if (e.code === 'Space' && target?.closest('button, a')) return;
      e.preventDefault();
      this.pauseToggle.emit();
      return;
    }

    const dir = KEY_TO_DIR[e.code];
    if (!dir) return;
    e.preventDefault();
    if (this.paused()) return;
    this.state.update((s) => queueTurn(s, dir));
  }

  protected onVisibility(): void {
    if (document.hidden && this.state().status === 'running' && !this.paused()) {
      this.pauseToggle.emit();
    }
  }

  private start(): void {
    const canvas = this.canvas().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const styles = getComputedStyle(this.host.nativeElement);
    const color = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;
    const palette = {
      cyan: color('--cyan', '#00f5ff'),
      magenta: color('--magenta', '#ff006e'),
      green: color('--green', '#00ff88'),
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let last = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      const dt = Math.min(now - last, MAX_FRAME_MS);
      last = now;
      this.advance(dt);
      this.draw(ctx, palette, now);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    });
  }

  private advance(dt: number): void {
    if (this.state().status !== 'running' || this.paused()) {
      this.acc = 0;
      return;
    }
    this.acc += dt;
    let next = this.state();
    while (this.acc >= tickMsFor(next.eaten) && next.status === 'running') {
      this.acc -= tickMsFor(next.eaten);
      next = step(next, Math.random);
    }
    if (next === this.state()) return;
    this.state.set(next);

    if (next.score !== this.lastScore) {
      this.lastScore = next.score;
      this.scoreChange.emit(next.score);
    }
    const level = levelFor(next.eaten);
    if (level !== this.lastLevel) {
      this.lastLevel = level;
      this.levelChange.emit(level);
      this.announcement.set(`Nivel ${level}`);
    }
    if (next.status === 'over') this.ended.emit(next.score);
  }

  private draw(
    ctx: CanvasRenderingContext2D,
    palette: { cyan: string; magenta: string; green: string },
    now: number,
  ): void {
    const { width, height } = ctx.canvas;
    const cw = width / COLS;
    const ch = height / ROWS;
    const { snake, food, status } = this.state();

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(0, 245, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 1; x < COLS; x++) {
      ctx.moveTo(x * cw, 0);
      ctx.lineTo(x * cw, height);
    }
    for (let y = 1; y < ROWS; y++) {
      ctx.moveTo(0, y * ch);
      ctx.lineTo(width, y * ch);
    }
    ctx.stroke();

    const pulse = this.reducedMotion ? 0.5 : 0.5 + 0.5 * Math.sin(now / 180);
    ctx.shadowColor = palette.magenta;
    ctx.shadowBlur = 10 + 8 * pulse;
    ctx.fillStyle = palette.magenta;
    ctx.beginPath();
    ctx.arc((food.x + 0.5) * cw, (food.y + 0.5) * ch, Math.min(cw, ch) * (0.28 + 0.1 * pulse), 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = palette.green;
    ctx.shadowBlur = 8;
    const inset = Math.max(1, Math.min(cw, ch) * 0.08);
    snake.forEach((p, i) => {
      ctx.fillStyle = i === 0 ? '#eafff5' : palette.green;
      ctx.globalAlpha = status === 'over' ? 0.5 : 1;
      ctx.fillRect(p.x * cw + inset, p.y * ch + inset, cw - inset * 2, ch - inset * 2);
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
}
