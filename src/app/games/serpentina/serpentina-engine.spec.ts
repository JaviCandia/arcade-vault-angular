import {
  COLS,
  ROWS,
  SnakeState,
  createState,
  levelFor,
  queueTurn,
  spawnFood,
  step,
  tickMsFor,
} from './serpentina-engine';

const rng = () => 0;

function running(overrides: Partial<SnakeState> = {}): SnakeState {
  return { ...createState(rng), status: 'running', ...overrides };
}

describe('serpentina engine', () => {
  it('starts ready with a 3-segment snake and food off the snake', () => {
    const s = createState(rng);
    expect(s.status).toBe('ready');
    expect(s.snake).toHaveLength(3);
    expect(s.snake.some((p) => p.x === s.food.x && p.y === s.food.y)).toBe(false);
  });

  it('does not move until a turn starts the game', () => {
    const s = createState(rng);
    expect(step(s, rng)).toBe(s);
    expect(queueTurn(s, 'up').status).toBe('running');
  });

  it('moves one cell per step', () => {
    const s = running({ food: { x: 0, y: 0 } });
    const next = step(s, rng);
    expect(next.snake[0]).toEqual({ x: s.snake[0].x + 1, y: s.snake[0].y });
    expect(next.snake).toHaveLength(3);
  });

  it('wraps around every edge', () => {
    const food = { x: 5, y: 5 };
    const cases = [
      { dir: 'right', head: { x: COLS - 1, y: 3 }, expected: { x: 0, y: 3 } },
      { dir: 'left', head: { x: 0, y: 3 }, expected: { x: COLS - 1, y: 3 } },
      { dir: 'up', head: { x: 3, y: 0 }, expected: { x: 3, y: ROWS - 1 } },
      { dir: 'down', head: { x: 3, y: ROWS - 1 }, expected: { x: 3, y: 0 } },
    ] as const;
    for (const c of cases) {
      const s = running({ dir: c.dir, snake: [c.head], food });
      expect(step(s, rng).snake[0]).toEqual(c.expected);
    }
  });

  it('ignores reversals and repeated directions', () => {
    const s = running();
    expect(queueTurn(s, 'left')).toBe(s);
    expect(queueTurn(s, 'right')).toBe(s);
    const up = queueTurn(s, 'up');
    expect(queueTurn(up, 'down')).toBe(up);
    expect(queueTurn(up, 'up')).toBe(up);
  });

  it('applies buffered turns in order, one per step', () => {
    let s = running({ food: { x: 0, y: 0 } });
    s = queueTurn(queueTurn(s, 'up'), 'left');
    const start = s.snake[0];
    s = step(s, rng);
    expect(s.snake[0]).toEqual({ x: start.x, y: start.y - 1 });
    s = step(s, rng);
    expect(s.snake[0]).toEqual({ x: start.x - 1, y: start.y - 1 });
  });

  it('caps the turn buffer at two', () => {
    let s = running();
    s = queueTurn(queueTurn(queueTurn(s, 'up'), 'left'), 'down');
    expect(s.pending).toEqual(['up', 'left']);
  });

  it('grows, scores and speeds up when eating', () => {
    const s = running();
    const food = { x: s.snake[0].x + 1, y: s.snake[0].y };
    const next = step({ ...s, food }, () => 0.5);
    expect(next.snake).toHaveLength(4);
    expect(next.eaten).toBe(1);
    expect(next.score).toBe(10);
    expect(next.food).not.toEqual(food);
    expect(tickMsFor(next.eaten)).toBeLessThan(tickMsFor(0));
  });

  it('scales points with the level', () => {
    const s = running({ eaten: 5 });
    const food = { x: s.snake[0].x + 1, y: s.snake[0].y };
    expect(step({ ...s, food }, rng).score).toBe(20);
  });

  it('never spawns food on the snake', () => {
    const snake = Array.from({ length: COLS * ROWS - 1 }, (_, i) => ({ x: i % COLS, y: Math.floor(i / COLS) }));
    expect(spawnFood(snake, Math.random)).toEqual({ x: COLS - 1, y: ROWS - 1 });
    expect(spawnFood([...snake, { x: COLS - 1, y: ROWS - 1 }], Math.random)).toBeNull();
  });

  it('ends the game when the snake bites itself', () => {
    const snake = [
      { x: 5, y: 5 },
      { x: 5, y: 6 },
      { x: 6, y: 6 },
      { x: 6, y: 5 },
      { x: 6, y: 4 },
    ];
    const s = running({ snake, dir: 'up', food: { x: 0, y: 0 } });
    const next = step(queueTurn(s, 'right'), rng);
    expect(next.status).toBe('over');
  });

  it('allows entering the cell the tail is leaving', () => {
    const snake = [
      { x: 5, y: 5 },
      { x: 5, y: 6 },
      { x: 6, y: 6 },
      { x: 6, y: 5 },
    ];
    const s = running({ snake, dir: 'up', food: { x: 0, y: 0 } });
    const next = step(queueTurn(s, 'right'), rng);
    expect(next.status).toBe('running');
    expect(next.snake[0]).toEqual({ x: 6, y: 5 });
  });

  it('computes level and tick interval', () => {
    expect(levelFor(0)).toBe(1);
    expect(levelFor(5)).toBe(2);
    expect(tickMsFor(0)).toBe(140);
    expect(tickMsFor(1000)).toBe(55);
  });
});
