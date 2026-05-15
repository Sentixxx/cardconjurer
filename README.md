# Card Forger

An open-source, statically-hosted Magic: the Gathering card builder. Card
Forger is a TypeScript / React / Vite port of
[Card Conjurer](https://cardconjurer.com), focused on running entirely in the
browser with no backend and being deployable to any static host (GitHub Pages,
Netlify, Vercel Static, Cloudflare Pages, plain HTTP).

## Stack

- React 19 + TypeScript (strict) for UI and state.
- Vite 6 for build / dev / preview.
- `wouter` for client-side routing — the only file that imports from `wouter`
  is `src/lib/router.ts`; every page uses `@/lib/router` instead.
- Native Web APIs only for everything else: Canvas 2D for card rendering,
  `localStorage` for saved cards, `Blob` + `URL.createObjectURL` for downloads,
  `fetch` for static text assets, `Image` for art / frame URLs.

Runtime dependencies (`npm ls --depth=0`): `react`, `react-dom`, `wouter` — **3**.

## Commands

```bash
npm install          # one-time
npm run dev          # vite dev server
npm run build        # tsc --noEmit && vite build → dist/
npm run preview      # serve dist/ via vite preview
npm run typecheck    # tsc --noEmit alone
```

The build output in `dist/` is static (HTML + JS + CSS + copied `public/`
assets). No Node server is involved at runtime; `npx http-server dist` will
serve it as-is.

## Layout

```
src/
  app/        React root + <App> route wiring
  components/ Shared UI primitives (AppShell, Placeholder)
  features/   Domain-scoped UI and rendering modules
    creator/  Canvas drawing pipeline + Creator subcomponents
  hooks/      Custom hooks: useTheme / useLocalStorage / useSavedCards /
              useFrameVersions / useCardData / useImageAsset / useAbilities /
              useThemeOverlay
  lib/        router.ts (single boundary to wouter)
  pages/      Route-level components (Landing/Creator/Gallery/…)
  services/   Logic & I/O: storage, io, assets, manaSymbols, planeswalker,
              saga, phyrexian, converter, print, askUrza, templates
  styles/     Global CSS (CSS variables driven by the theme system)
  types/      Domain types (CardData / CardFace / ManaSymbol / Theme palettes…)
  utils/      Small helpers (download.ts)
  legacy-app/ Frozen reference copy of the original Card Conjurer tree;
              not part of the build (tsconfig excludes it).
public/
  data/       Static assets fetched at runtime (abilities.txt, converter
              mask & wizards logo, print cutting guides).
```

## Routes

`src/lib/router.ts` is the authoritative list. Each one is mounted in
`src/app/App.tsx`:

`/` (Landing) · `/creator` · `/gallery` · `/converter` · `/print` · `/theme` ·
`/phyrexian` · `/askurza` · `/askurza/askUrzaAbilityListGenerator.html` ·
`/data/site/other/askUrza/askUrzaAbilityListGenerator.html` (legacy URL) ·
`/tutorial` · `/about` · `/legal` · 404 catch-all.

## Status

The refactor was driven by an iterative loop guided by `REFRACTOR_PROMPT.md`
and tracked in `REFRACTOR_STATE.md`. Every accepted iteration enforces:

- `tsc --noEmit` exit 0 (TypeScript strict, no `any` outside annotated
  exceptions — currently zero exceptions).
- `vite build` exit 0, static `dist/` output.
- `grep -RIn "from 'wouter'" src | grep -v src/lib/router.ts` empty.
- `grep -RIn "from '../../'" src` empty.
- Runtime dependency count ≤ 12.
- No new dependency without a justification entry in `REFRACTOR_STATE.md`.

### What is shipped

- **Creator** — multi-face (DFC) card editing with live canvas preview:
  name / mana cost / type line / set chip / rarity / rules text (with inline
  mana symbols including hybrid, Phyrexian, snow, half-generic) / flavor
  text / Power-Toughness / Planeswalker layout (loyalty icons + ability
  rows) / Saga layout (lore-counter badges) / legendary crown auto-trigger /
  art URL / frame URL / frame color / collector info line. Save to
  `localStorage`, load via `?key=`, download PNG, download/import JSON.
- **Gallery** — list / load / delete / JSON import / JSON export.
- **Converter** — port of the legacy canvas mask + wizards-line overlay tool.
- **Print** — multi-image print sheet generator (Letter / A4 / landscape,
  custom card size, padding, margins, PPI, bleed edge, cutting guides) with
  PNG output.
- **AskUrza** — random planeswalker ability generator backed by the legacy
  abilities corpus shipped as a static asset.
- **Phyrexian** — text → Phyrexian-glyph transliterator (algorithm 1:1 with
  legacy).
- **Theme** — 7 fixed palettes + custom hue / brightness overlay; both
  persist to `localStorage`.
- **Static info pages** — About / Legal / Tutorial / 404 with content
  carried over from the legacy HTML.

### Known scope decisions

- **Frame PNGs**: the legacy app loads them from a separate `resources/`
  submodule. The new build supports arbitrary frame URLs via the Creator
  form and renders them onto the canvas, but no frame artwork is bundled in
  this repository. A frame-color fallback paints the card outline tinted by
  W/U/B/R/G/M/A/L/C so the card is identifiable without bundled art.
- **MTG fonts** (Beleren, Plantin, etc.) are not OFL-licensed and are not
  bundled. The UI falls back to `system-ui`.
- **Print → PDF** is intentionally omitted; the legacy implementation relied
  on jsPDF (≈200 KB external script). PNG export covers the home-print
  workflow.
- **frameSearch** (legacy text filter over the frame catalog) is superseded
  by the direct version / color select pair, since the new architecture
  exposes a curated 18-version catalog rather than the legacy submodule's
  unbounded frame pool.

These are documented design boundaries, not pending tasks. The remaining
fidelity gap from legacy is purely visual (real frame artwork, MTG-licensed
fonts) — every user-facing capability has a working path in the new build.

## Contributing

The loop-driven refactor is captured in `REFRACTOR_STATE.md` (multi-iteration
plan and per-iteration history) and gated by the criteria in
`REFRACTOR_PROMPT.md`. New work should keep the gates (`tsc --noEmit` /
`vite build` clean, wouter boundary, runtime-dep cap, no `any`) and prefer
extending existing services and hooks over introducing new dependencies.
