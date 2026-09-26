import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => localStorage.clear());

  it('logs in with an uppercased, trimmed and truncated name and persists it', () => {
    const auth = TestBed.inject(AuthService);
    auth.login('  verylongusername ');
    expect(auth.user()).toEqual({ name: 'VERYLONGUS' });
    expect(JSON.parse(localStorage.getItem('av_user') ?? 'null')).toEqual({ name: 'VERYLONGUS' });
  });

  it('falls back to PLAYER1 when the name is empty', () => {
    const auth = TestBed.inject(AuthService);
    auth.login('');
    expect(auth.user()?.name).toBe('PLAYER1');
  });

  it('logs out and clears storage', () => {
    const auth = TestBed.inject(AuthService);
    auth.login('kai');
    auth.logout();
    expect(auth.user()).toBeNull();
    expect(localStorage.getItem('av_user')).toBeNull();
  });
});
