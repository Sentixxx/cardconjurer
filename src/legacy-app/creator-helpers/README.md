# Creator Target Boundary

This directory is the staged target location for Creator runtime modules.
The legacy browser entry remains `src/app/js/creator-23.js` while helpers move
here in small, tested steps.

Current modules:

- `assets/asset-url.mjs` - pure asset URL/base resolution helpers mirrored by
  the generated legacy `fixUri()` compatibility function.
- `assets/frame-preload.mjs` - pure frame preload source collection helpers
  mirrored by the generated legacy compatibility functions.
- `text/text-fonts.mjs` - pure font declaration, text-object font discovery,
  write-text font-state, font-code, and Beleren glyph helpers used by the
  generated legacy compatibility functions.
- `text/text-fields.mjs` - pure text-field lookup helpers used by the generated
  legacy compatibility functions.
- `storage/saved-card-data.mjs` - saved-card data clone/export/import and key
  helpers used by the generated legacy compatibility functions.
- `imports/import-clipboard-text.mjs` - pure Scryfall clipboard text parser
  helpers used by the generated legacy compatibility functions.
- `imports/import-options.mjs` - pure imported-card option name and eligibility
  helpers used by the generated legacy compatibility functions.
- `imports/import-search-options.mjs` - pure imported-card search option and
  datasource unique-flag helpers used by the generated legacy compatibility functions.
- `imports/import-url.mjs` - pure Scryfall, MTGCH, and collector metadata URL
  builders used by the generated legacy compatibility functions.
- `imports/import-card-basics.mjs` - pure imported-card display name,
  title/subtitle, language/font-prefix, and type-line helpers used by the
  generated legacy compatibility functions.
- `imports/import-printing.mjs` - pure imported-card collector info/number,
  set-symbol, art/media plan, and print identity helpers used by the generated
  legacy compatibility functions.
- `imports/import-text-preservation.mjs` - pure imported-card text preservation
  helpers used by the generated legacy compatibility functions.
- `imports/import-multi-faced.mjs` - pure imported-card multi-faced layout,
  face-data, and face text helpers used by the generated legacy compatibility functions.
- `imports/import-unique-layout.mjs` - pure imported-card unique-layout predicate
  helpers used by the generated legacy compatibility functions.
- `imports/import-station-layout.mjs` - pure imported-card station-layout
  predicate helper used by the generated legacy compatibility functions.
- `imports/import-station-parser.mjs` - pure imported-card station oracle parser
  and placement helpers used by the generated legacy compatibility functions.
- `imports/import-roll.mjs` - pure imported-card d20 roll ability parser helpers
  used by the generated legacy compatibility functions.
- `imports/import-text-fields.mjs` - pure imported-card rules/flavor,
  Pokemon rules fields, case-layout rules, and power/toughness helpers used by
  the generated legacy compatibility functions.
- `imports/import-planeswalker.mjs` - pure imported-card planeswalker ability and
  field formatter used by the generated legacy compatibility functions.
- `imports/import-saga.mjs` - pure imported-card saga ability and field formatter
  used by the generated legacy compatibility functions.
- `imports/import-class.mjs` - pure imported-card class ability and field
  formatter used by the generated legacy compatibility functions.
- `imports/import-unique-layout-parsers.mjs` - pure imported-card leveler,
  prototype, mutate, and vanguard layout parsers used by the generated legacy
  compatibility functions.
