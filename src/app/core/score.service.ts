import { Injectable } from '@angular/core';

export interface SavedScore {
  game: string;
  score: number;
  name: string;
  at: number;
}

const KEY = 'av_scores';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  save(entry: Omit<SavedScore, 'at'>): void {
    try {
      const all = JSON.parse(localStorage.getItem(KEY) ?? '[]') as SavedScore[];
      all.push({ ...entry, at: Date.now() });
      localStorage.setItem(KEY, JSON.stringify(all));
    } catch {
      // storage unavailable: score is simply not persisted
    }
  }
}
