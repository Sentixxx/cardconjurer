# Creator Storage Helpers

This directory owns low-risk saved-card storage helpers that can be tested as
pure modules before localStorage, download, and upload workflows are split out
of the legacy Creator runtime.

Current modules:

- `saved-card-data.mjs` - saved-card JSON clone/export/import and key helpers
  used by the generated Creator compatibility prelude.
