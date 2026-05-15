# Creator Asset Helpers

This directory owns Creator asset URL policy, preload helpers, and future CORS
diagnostics. Modules here must stay pure enough for Node tests and must preserve
legacy public paths unless explicit runtime configuration is provided.

Current modules:

- `asset-url.mjs` - asset base and legacy `fixUri` URL resolution policy.
- `frame-preload.mjs` - pure frame preload source filtering and collection.
