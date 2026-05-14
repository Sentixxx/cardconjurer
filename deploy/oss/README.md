# OSS/CDN Release Policy

`dist/` is the legacy-compatible full output and should not be synced directly
as the default OSS main-site root. Generate split release targets first:

```powershell
npm run build
npm run build:release
npm run verify:release
```

Publish targets:

- `release/site` -> main static site.
- `release/assets-hires` -> CORS-enabled high-resolution frame asset origin.
- `release/platform` -> platform helpers only; do not publish as the site root.

The machine-readable policy is in `release-policy.json`. It documents cache,
CORS, and filtering expectations for OSS/CDN configuration. The values still
need to be applied in the OSS/CDN control plane or by a future sync script.

