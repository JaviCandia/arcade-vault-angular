import { Injectable, signal } from '@angular/core';

export interface User {
  name: string;
}

const KEY = 'av_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<User | null>(this.read());
  readonly user = this._user.asReadonly();

  login(rawName: string): void {
    const user = { name: (rawName.trim() || 'PLAYER1').toUpperCase().slice(0, 10) };
    this._user.set(user);
    try {
      localStorage.setItem(KEY, JSON.stringify(user));
    } catch {
      // storage unavailable: keep the in-memory session only
    }
  }

  logout(): void {
    this._user.set(null);
    try {
      localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }

  private read(): User | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
