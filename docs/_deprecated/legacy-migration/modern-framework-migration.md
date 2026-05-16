---
title: Next.js Framework Migration（已弃用）
type: architecture
status: deprecated
summary: 旧 Next.js App Router + 静态导出方案，已被 React 19 + Vite 取代
tags: [deprecated, history]
---

> **DEPRECATED**：项目已不再使用 Next.js。当前栈与目录结构见 [`docs/dev/architecture/overview.md`](../../dev/architecture/overview.md)。

# Next.js Framework Migration

This project keeps the legacy Card Conjurer public file layout as the
compatibility contract. Next.js is now the modern framework boundary: App Router
route handlers in `app/` statically export every public HTML entry, and the build
copies those generated files back into the historical `dist/` paths.

## Architecture

- `next.config.mjs` enables `output: 'export'` and `trailingSlash: true`.
- `app/**/route.js` files are the Next.js route inventory. Each route handler
  returns static HTML through the framework renderer and is prerendered by
  `next build`.
- `src/framework/routes.mjs` remains the public route manifest and maps each
  legacy HTML output path to its generated component or custom renderer.
- `scripts/build.mjs` runs `next build`, copies legacy static assets into
  `dist/`, then overlays the 16 Next.js-generated HTML files.
- `_next` runtime assets and Next's default 404 artifacts are intentionally not
  copied to `dist/` because the compatibility output does not reference them.

## Migrated Routes

- Full documents: `index.html`,
  `askurza/askUrzaAbilityListGenerator.html`, and
  `data/site/other/askUrza/askUrzaAbilityListGenerator.html`.
- HTMX fragments: `about/index.html`, `askurza/index.html`,
  `converter/index.html`, `creator/index.html`, `gallery/index.html`,
  `legal/index.html`, `phyrexian/index.html`, `print/index.html`,
  `theme/index.html`, `tutorial/index.html`, and `core/404.html`.
- Compatibility partials: `globalHTML/header.html` and
  `globalHTML/footer.html`.

## Verification Gates

- `npm test` must pass after every migration step.
- `npm run verify` must report no unexpected missing, extra, or modified files
  in `dist/`.
- `npm run migration:status:strict` must pass, proving that every legacy HTML
  entry is covered and every framework route has a matching Next.js route
  handler.
- Framework routes that are not performance overrides must pass canonical HTML
  equivalence against the legacy source file.
- `test/creator-contract.test.mjs` and `test/creator-runtime.test.mjs` guard the
  editor's DOM IDs, scripts, canvas startup, localStorage contract, import/save
  controls, and frame-search boot behavior.
- `test/public-assets.test.mjs` checks that built HTML local references resolve
  inside `dist/`, catching the resource-loading failures that motivated this
  migration check.

## Completion Criteria

The migration is complete only when:

- `frameworkRoutes.length` equals the legacy HTML entry count.
- `deferredHtmlEntries`, `legacySourceRoutes`, `rawStaticFrameworkRoutes`, and
  `rawStaticFrameworkFragments` are all empty.
- `app/**/route.js` covers every framework route.
- `npm test`, `npm run verify`, and `npm run migration:status:strict` all pass.
