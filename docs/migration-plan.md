# Card Forger Migration Plan

## Objective

Migrate `D:\万智牌\cardconjurer` into `D:\万智牌\cardforger` with a clearer
source/resource split, lower coupling, and a buildable static output that keeps
current behavior intact.

## Constraints

- Only files under `D:\万智牌\cardforger` are written.
- `D:\万智牌\cardconjurer` is read-only input.
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
