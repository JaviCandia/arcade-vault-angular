# 001 – Global Arcade Vault theme

**Status:** Done \
**Date:** 2026-09-25

## What & why
Port the retro/neon theme from `references/templates` into the Angular app as its global stylesheet, with self-hosted fonts, so every future page looks identical to the reference templates.

## Context / findings
- `references/templates/home-about/styles.css` (1744 lines) is a **superset** of `references/templates/styles.css` (951 lines): same base + Home, About, Gamepad, theme variants, Activity, Pricing. → Use the home-about one as the source.
- Fonts referenced: **Press Start 2P** (400), **JetBrains Mono** (400/500/700), **Courier Prime** (400/700, fallback in `--mono`). Loaded from Google Fonts CDN in the templates.
- Only other `url()` is an inline SVG noise data-URI (keep as is).
- Template relies on `#root` as app frame and on two decorative divs `.av-bg` / `.av-noise` placed in `<body>`.
- `public/fonts/` and `src/styles/` already exist (empty). `src/styles.css` is the only global style in `angular.json`.
- `src/app/app.html` still has the CLI placeholder (with its own `<style>` that would clash); `app.ts` uses `ChangeDetectionStrategy.Eager` (CLAUDE.md requires OnPush).

## Acceptance criteria
- [x] All CSS from the reference is available globally (tokens, base, background, utilities, components, page sections).
- [x] Fonts are self-hosted in `public/fonts/` (woff2, latin + latin-ext subsets) — no Google Fonts CDN request.
- [x] Background grid, scanlines and noise render behind the app, like the template.
- [x] `ng build` passes with no budget errors.
- [x] Accessibility: visible `:focus-visible` styles and `prefers-reduced-motion` support (WCAG AA).

## Technical plan
**Fonts** — download woff2 from Google Fonts (css2 API, latin + latin-ext subsets) into `public/fonts/`:
- `press-start-2p-latin.woff2`, `press-start-2p-latin-ext.woff2`
- `jetbrains-mono-latin.woff2`, `jetbrains-mono-latin-ext.woff2` (variable font → one `@font-face` per subset with `font-weight: 400 700`)
- `courier-prime-400-latin(-ext).woff2`, `courier-prime-700-latin(-ext).woff2`
Declared in `src/styles/fonts.css` with `font-display: swap`, `unicode-range` copied from the template, `src: url('/fonts/...')`.

**Global CSS split** — `src/styles.css` becomes an index of `@import`s (bundled by the Angular esbuild builder), one partial per reference section, content copied verbatim:
- `src/styles/fonts.css` – @font-face
- `src/styles/tokens.css` – `:root` variables
- `src/styles/base.css` – reset, body, `app-root` frame (replaces `#root`)
- `src/styles/background.css` – `.av-bg`, `.av-noise`
- `src/styles/utilities.css` – `.pixel`, `.neon-*`, `.flicker`, misc animations, spinner, divider
- `src/styles/components/` – `nav.css`, `buttons.css`, `forms.css` (search, chips, field, auth tabs), `cards.css` (+ cover art), `modal.css`, `leaderboard.css`, `gamepad.css` (+ theme variants), `crt.css`
- `src/styles/pages/` – `library.css` (hero/filters/grid), `detail.css`, `player.css`, `auth.css`, `hall.css`, `home.css`, `about.css`, `activity.css`, `pricing.css`
- `src/styles/a11y.css` – `:focus-visible` outline (cyan glow) for buttons/links/inputs and `@media (prefers-reduced-motion: reduce)` disabling animations/transitions.

Key decisions:
- `#root` selectors → `app-root` (Angular's host element); adds `display: flex` column frame.
- Decorative `<div class="av-bg" aria-hidden="true">` and `<div class="av-noise" aria-hidden="true">` added to `src/index.html` before `<app-root>` (pure decoration, outside Angular).
- Everything global for now (as requested); page sections can migrate to component styles when those pages are built.

**Other files**
- `src/index.html`: `lang="es"`, title `Arcade Vault · Portal Retro`, `<link rel="preload">` for the two latin woff2 of Press Start 2P and JetBrains Mono, background divs.
- `src/app/app.html`: remove CLI placeholder, leave `<router-outlet />`.
- `src/app/app.ts`: `ChangeDetectionStrategy.OnPush`; `src/app/app.css` stays empty. Update `app.spec.ts` if it asserts placeholder text.

## Tasks
1. Save this plan as `specs/001-global-theme.md`.
2. Download font files into `public/fonts/`.
3. Create partials under `src/styles/` and the `@import` index in `src/styles.css`.
4. Update `index.html`, `app.html`, `app.ts` (and spec if needed).
5. Verify (below), check off criteria, set status to Done.

## Verification
- `npx ng build` → succeeds, no budget errors.
- `npx ng test` (if spec touched) passes.
- `npx ng serve`, open in Chrome: dark bg with animated perspective grid + scanlines; add a temporary check in DevTools that `document.fonts.check('12px "Press Start 2P"')` is true and Network tab shows fonts served from `/fonts/` (no googleapis).

## Out of scope
- Building the actual components/pages (nav, library, home, etc.) — only their styles are made available.
- Porting JSX logic from the templates.
