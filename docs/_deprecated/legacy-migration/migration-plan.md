---
title: Card Forger Migration Plan（已弃用）
type: process
status: deprecated
summary: 旧 Next.js 静态导出迁移计划；当前 React 19 + Vite 不再适用
tags: [deprecated, history]
---

> **DEPRECATED**：本文描述的 import-source / build / verify-baseline 流水线随 Next.js 方案一同移除。当前流程见 [`docs/dev/process/workflow.md`](../../dev/process/workflow.md)。

# Card Forger Migration Plan

## Objective

Migrate the local CardConjurer source tree into this repository with a clearer
source/resource split, lower coupling, and a buildable static output that keeps
current behavior intact.

## Constraints

- Only files under this repository are written.
- The CardConjurer source tree is read-only input.
- Baseline tests must exist before refactoring and must prove migrated behavior
  remains equivalent.

## Architecture

- `src/app/` owns browser code: HTML, CSS, JS, and app fragments.
- `resources/` owns assets: images, fonts, icons, local art, and static binaries.
- `platform/` owns operational files: launchers, Docker config, and server config.
- `scripts/` contains single-purpose commands:
  - `import-source` classifies and imports the read-only source tree.
  - `build` emits the public-compatible `dist/` tree.
  - `verify-baseline` compares `dist/` against the source tree.
  - `serve` serves `dist/` locally for manual checks.

The public paths are intentionally preserved in `dist/` so absolute and relative
links such as `/img/...`, `/fonts/...`, and `/data/scripts/...` continue to work.

## Baseline Gate

`npm test` runs a build, then verifies:

- every source file outside `.git/` is represented in exactly one separated area;
- the separated area matches the classification rules;
- `dist/` has the same file set as `cardconjurer`;
- every `dist/` file has the same SHA-256 hash as the source file, unless the
  difference is documented in `config/intentional-overrides.json` or covered by a
  framework equivalence test.

This keeps the migration behavior-compatible while allowing explicit,
reviewable performance, security, and framework-rendering improvements.
