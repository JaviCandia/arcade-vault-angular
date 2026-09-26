import { seededScores } from './scores';

describe('seededScores', () => {
  it('is deterministic for the same seed', () => {
    expect(seededScores(42, 10)).toEqual(seededScores(42, 10));
  });

  it('returns the requested number of rows sorted by score with sequential ranks', () => {
    const rows = seededScores(7, 12);
    expect(rows).toHaveLength(12);
    rows.forEach((r, i) => {
      expect(r.rank).toBe(i + 1);
      if (i > 0) expect(rows[i - 1].score).toBeGreaterThanOrEqual(r.score);
    });
  });
});
