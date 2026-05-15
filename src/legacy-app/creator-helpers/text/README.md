# Creator Text Helpers

This directory owns low-risk Creator text runtime helpers that can be tested as
pure modules before the legacy text renderer is split further.

Current modules:

- `text-fonts.mjs` - font load declaration, text-object font discovery,
  write-text font state, font-code parsing, and Beleren glyph helpers used by
  the generated Creator compatibility prelude.
- `text-fields.mjs` - selected text-field lookup helpers used by the generated
  Creator compatibility prelude.
- `write-text-content.mjs` - reminder handling, raw text normalization,
  tokenization, mana-cost token filtering, and vertical token expansion helpers
  used by the generated Creator compatibility prelude.
- `write-text-conditional-color.mjs` - conditional text color frame/mask
  matching helpers used by the generated Creator compatibility prelude.
- `write-text-style.mjs` - initial color/shadow/outline state, line style,
  shadow, fill color, and font size token helpers used by the generated
  Creator compatibility prelude.
- `write-text-mana.mjs` - mana symbol color/kerning tokens, Safari image
  composition, outline, and queued drawing helpers used by the generated
  Creator compatibility prelude.
- `write-text-transform.mjs` - pt-shift and arc/rotation transform token
  helpers used by the generated Creator compatibility prelude.
- `write-text-roll.mjs` - roll color and d20 roll state token helpers used by
  the generated Creator compatibility prelude.
- `write-text-controls.mjs` - line flow, flavor bar, planechase symbol,
  elem-id, CStext spacing, and alignment control helpers used by the generated
  Creator compatibility prelude.
- `write-text-positioning.mjs` - saved cursor positions, indent, inline
  insertion, and cursor/inline offset token helpers used by the generated
  Creator compatibility prelude.
- `write-text-layout.mjs` - overflow shrink/wrap, horizontal/vertical
  adjustment, word measurement, and final paragraph draw helpers used by the
  generated Creator compatibility prelude.
