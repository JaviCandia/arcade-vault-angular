export const COLS = 24;
export const ROWS = 18;

export interface Point {
  x: number;
  y: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';
export type Status = 'ready' | 'running' | 'over';
export type Rng = () => number;

export interface SnakeState {
  /** Head first. */
  snake: readonly Point[];
  dir: Direction;
  /** Turns queued for the next ticks (max 2). */
  pending: readonly Direction[];
  food: Point;
  eaten: number;
  score: number;
  status: Status;
}

const DELTA: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

const MAX_PENDING = 2;
const EATEN_PER_LEVEL = 5;

export const levelFor = (eaten: number): number => 1 + Math.floor(eaten / EATEN_PER_LEVEL);

export const tickMsFor = (eaten: number): number => Math.max(55, 140 - eaten * 3);

const same = (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y;

const wrap = (value: number, size: number): number => (value + size) % size;

/** Picks a random cell not covered by the snake, or `null` if the board is full. */
export function spawnFood(snake: readonly Point[], rng: Rng): Point | null {
  const free: Point[] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!snake.some((s) => s.x === x && s.y === y)) free.push({ x, y });
    }
  }
  return free.length ? free[Math.floor(rng() * free.length)] : null;
}

export function createState(rng: Rng): SnakeState {
  const y = Math.floor(ROWS / 2);
  const x = Math.floor(COLS / 2);
  const snake: Point[] = [
    { x, y },
    { x: x - 1, y },
    { x: x - 2, y },
  ];
  return {
    snake,
    dir: 'right',
    pending: [],
    food: spawnFood(snake, rng) as Point,
    eaten: 0,
    score: 0,
    status: 'ready',
  };
}

/** Queues a turn; reversals and repeats are ignored. The first valid turn starts the game. */
export function queueTurn(state: SnakeState, dir: Direction): SnakeState {
  if (state.status === 'over' || state.pending.length >= MAX_PENDING) return state;
  const last = state.pending.at(-1) ?? state.dir;
  if (dir === last || dir === OPPOSITE[last]) return state;
  return { ...state, pending: [...state.pending, dir], status: 'running' };
}

/** Advances the snake one cell. */
export function step(state: SnakeState, rng: Rng): SnakeState {
  if (state.status !== 'running') return state;

  const dir = state.pending[0] ?? state.dir;
  const pending = state.pending.slice(1);
  const from = state.snake[0];
  const head: Point = {
    x: wrap(from.x + DELTA[dir].x, COLS),
    y: wrap(from.y + DELTA[dir].y, ROWS),
  };
  const eating = same(head, state.food);

  // When not growing, the tail cell is vacated on this same tick, so it is safe to enter.
  const body = eating ? state.snake : state.snake.slice(0, -1);
  if (body.some((s) => same(s, head))) {
    return { ...state, dir, pending, status: 'over' };
  }

  const snake = [head, ...body];
  if (!eating) return { ...state, snake, dir, pending };

  const food = spawnFood(snake, rng);
  const score = state.score + 10 * levelFor(state.eaten);
  const eaten = state.eaten + 1;
  if (!food) return { ...state, snake, dir, pending, eaten, score, status: 'over' };
  return { ...state, snake, dir, pending, food, eaten, score };
}
