# 002 – MVP: all Arcade Vault screens (visual only)

**Status:** In progress (pending manual visual/AXE check) \
**Date:** 2026-09-26

## What & why
Port every screen of the `references/templates` React prototypes to Angular so the MVP looks and navigates like the prototype. Visual only: no real games (the player keeps the fake HUD/score ticker), mock data, no backend.

## Acceptance criteria
- [x] Routes (lazy): `/` Home, `/biblioteca`, `/biblioteca/:id`, `/biblioteca/:id/jugar`, `/salon-de-la-fama`, `/acerca-de`, `/acceso`; unknown → `/`.
- [x] Nav (desktop + mobile panel), footer and skip link on every page.
- [x] Library search + category filter, detail page with leaderboard, player with pause/end/save flow, auth tabs (reactive form), hall of fame tabs/podium/table, home sections, about + contact form with terminal success.
- [x] Mock user persisted in localStorage (login/logout); scores saved to localStorage.
- [ ] Visual parity with the templates using the existing global styles (not yet checked in a browser).
- [ ] AXE clean, WCAG AA (semantic markup, labels, dialog focus and reduced motion are implemented; AXE not run yet).
- [x] `ng build` and `ng test` pass.

## Technical plan
- `src/app/data` (games, seededScores, home data), `core` (AuthService, ScoreService), `shared` (score pipe, reveal + tilt directives, pixel-icon, game-card, mini-card, leaderboard), `layout` (nav, footer), `pages` (home, library, game-detail, game-player, auth, hall-of-fame, about).
- Routing with `withComponentInputBinding` + top scroll restoration; page titles per route.
- Standalone, OnPush, signals, separate template/style files, existing global CSS classes reused.

## Tasks
1. [x] Data layer, services, pipe, directives.
2. [x] Shell: nav, footer, routes, app config.
3. [x] Library + game card; Detail + leaderboard.
4. [x] Player + game-over dialog.
5. [x] Auth; Hall of Fame.
6. [x] Home (+ silhouettes, pixel icons, mini-card); About (+ contact form).
7. [x] Unit tests (seededScores, AuthService, Library filtering).

## Out of scope
- Real games, backend, real auth/OAuth, persistence beyond localStorage.
- Gamepad component and theme variants (unused by any template screen).
