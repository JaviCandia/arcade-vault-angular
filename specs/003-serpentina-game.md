# 003 – SERPENTINA: first playable game

**Status:** In progress \
**Date:** 2026-09-26

## What & why
Make SERPENTINA (classic snake) really playable at `/biblioteca/serpentina/jugar`, reusing the existing player HUD, CRT frame, pause and game-over/save flow. Other games keep the fake ticker.

## Acceptance criteria
- [ ] Classic rules: one life, biting itself ends the game; borders wrap around.
- [x] Each magenta core eaten grows the snake, adds score and increases speed.
- [ ] Keyboard only: arrows / WASD to steer, Space / P to pause; arrow keys never scroll the page.
- [ ] HUD shows live score and level; the "Vidas" stat is hidden for this game.
- [ ] Game over opens the existing dialog; saving score and "JUGAR DE NUEVO" work.
- [x] Other games still show the fake arena and ticker.
- [ ] Accessible: canvas labelled, level-ups announced politely, reduced motion respected, AXE clean.
- [x] `ng build` and `ng test` pass.

## Technical plan
- `src/app/games/serpentina/serpentina-engine.ts`: pure, deterministic engine (grid 24x18, injected RNG, wrap, direction buffer, growth, scoring, `levelFor`, `tickMsFor`).
- `src/app/games/serpentina/serpentina-game.{ts,html,css}`: OnPush component rendering on `<canvas>`, rAF loop with accumulator, host keydown handling, outputs `scoreChange`, `levelChange`, `ended`, `pauseToggle`, public `reset()`.
- `game-player`: `isSerpentina` computed; ticker disabled for it; game mounted inside `.crt-screen`; level driven by the game; `restart()` resets the game.
- Decision: pure engine separated from the component so rules are unit-testable without a DOM.

## Tasks
1. [x] Engine + unit tests.
2. [x] Game component (canvas, loop, input, overlay, a11y).
3. [x] Player integration (HUD, pause, restart, hide lives).
4. [x] Player spec (serpentina vs fake game).
5. [ ] Manual browser check (build and tests pass).

## Out of scope
- Touch/swipe controls and on-screen D-pad.
- Sound, obstacles, power-ups, persistence beyond the existing score saving.
- Real games other than SERPENTINA.
