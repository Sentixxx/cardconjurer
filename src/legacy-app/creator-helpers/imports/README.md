# Creator Import Helpers

This directory owns low-risk Creator import helpers that can be tested as pure
modules before request dispatch, DOM updates, and card application workflows are
split out of the legacy runtime.

Current modules:

- `import-clipboard-text.mjs` - Scryfall clipboard text parser helpers used by
  the generated Creator compatibility prelude.
- `import-options.mjs` - imported-card option name and eligibility helpers used
  by the generated Creator compatibility prelude.
- `import-search-options.mjs` - imported-card search option and datasource
  unique-flag helpers used by the generated Creator compatibility prelude.
- `import-url.mjs` - Scryfall, MTGCH, and collector metadata URL builders used
  by the generated Creator compatibility prelude.
- `import-card-basics.mjs` - imported-card display name, title/subtitle,
  language/font-prefix, and type-line helpers used by the generated Creator
  compatibility prelude.
- `import-printing.mjs` - imported-card collector info/number, set-symbol,
  art/media plan, and print identity helpers used by the generated Creator
  compatibility prelude.
- `import-text-preservation.mjs` - imported-card text preservation helpers used
  by the generated Creator compatibility prelude.
- `import-multi-faced.mjs` - imported-card multi-faced layout, face-data, and
  face text helpers used by the generated Creator compatibility prelude.
- `import-unique-layout.mjs` - imported-card unique-layout predicate helpers
  used by the generated Creator compatibility prelude.
- `import-station-layout.mjs` - imported-card station-layout predicate helper
  used by the generated Creator compatibility prelude.
- `import-station-parser.mjs` - imported-card station oracle parser and placement
  helpers used by the generated Creator compatibility prelude.
- `import-roll.mjs` - imported-card d20 roll ability parser helpers used by the
  generated Creator compatibility prelude.
- `import-text-fields.mjs` - imported-card rules/flavor, Pokemon rules fields,
  case-layout rules, and power/toughness helpers used by the generated Creator
  compatibility prelude.
- `import-planeswalker.mjs` - imported-card planeswalker ability and field
  formatter helper used by the generated Creator compatibility prelude.
- `import-saga.mjs` - imported-card saga ability and field formatter helper used
  by the generated Creator compatibility prelude.
- `import-class.mjs` - imported-card class ability and field formatter helper
  used by the generated Creator compatibility prelude.
- `import-unique-layout-parsers.mjs` - imported-card leveler, prototype, mutate,
  and vanguard layout parser helpers used by the generated Creator compatibility
  prelude.
