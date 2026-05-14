# Card Forger

Card Forger is a migration workspace for the local Card Conjurer tree at
`D:\万智牌\cardconjurer`.

The editable tree separates browser/application code from resource files while
the generated `dist/` directory preserves Card Conjurer's original public file
layout for compatibility. Differences from the source tree must be documented in
`config/intentional-overrides.json` or covered by framework equivalence tests.

## Layout

- `src/app/` - HTML, CSS, JavaScript, and web app fragments.
- `src/creator/` - staged target modules for Creator runtime helpers.
- `src/shell/`, `src/page-components/`, `src/legacy/` - target directory skeletons,
  documented before source files are moved.
- `resources/` - fonts, images, icons, local art, and other binary/static assets.
- `assets/` - target asset-boundary skeleton; not a build input yet.
- `platform/` - launcher, Docker, server, and repository-level runtime files.
- `deploy/` - deployment policy sources, including OSS/CDN release rules.
- `dist/` - generated compatibility output, matching the original project except
  for documented intentional overrides and framework-equivalent HTML.
- `release/` - generated deployment sets split from `dist/`: main site,
  high-resolution frame assets, and platform helpers.
- `scripts/` - small import/build/verify/serve commands.
- `test/` - baseline tests using the read-only source project as the oracle.

## Resource repository split

The resource tree is intentionally isolated from editable application code.
If resources move to a separate Git repository, keep
`https://github.com/Sentixxx/magic_resources.git` mounted at `resources/` in
this checkout as a Git submodule. That preserves the existing public paths such
as `/img/...`, `/fonts/...`, and `/data/images/...`, so the application code and
`dist/` compatibility layout do not need URL rewrites.

The migration should be done as a Git ownership change rather than a public-path
change:

```powershell
git rm -r --cached resources
git submodule add <resource-repo-url> resources
git commit -m "chore: split resources into submodule"
```

The resource repository should contain only public asset files. Repository
metadata that should not be published, such as long-form docs or automation, is
better kept outside the mounted asset root.

## Commands

```powershell
npm run import:source
npm run build
npm run build:release
npm test
npm run verify
npm run migration:status:strict
npm run serve
npm run serve:release
```

Set `CARDCONJURER_SOURCE` to override the default source path.
