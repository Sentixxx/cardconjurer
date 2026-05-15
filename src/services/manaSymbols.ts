export type ManaSymbolKind = 'colored' | 'generic' | 'hybrid' | 'phyrexian' | 'snow' | 'text';

export interface ManaSymbol {
  readonly kind: ManaSymbolKind;
  readonly raw: string;
  readonly glyph: string;
  readonly fill: string;
  readonly fillSecondary: string | null;
  readonly textColor: string;
}

const COLORED_FILLS: Readonly<Record<string, string>> = {
  w: '#fcf3c4',
  u: '#aae1f9',
  b: '#3a3540',
  r: '#f9aa8f',
  g: '#9bd3ae',
  c: '#cccccc',
};

const SNOW_FILL = '#dde7ee';
const GENERIC_FILL = '#d6d1c6';
const TEXT_DARK = '#1d1d1d';
const TEXT_LIGHT = '#efefef';

function colorFill(letter: string): string {
  return COLORED_FILLS[letter] ?? GENERIC_FILL;
}

function colorTextColor(letter: string): string {
  return letter === 'b' ? TEXT_LIGHT : TEXT_DARK;
}

function classifyToken(token: string): ManaSymbol {
  const lower = token.toLowerCase();

  if (lower.includes('/')) {
    const parts = lower.split('/').map((part) => part.trim()).filter(Boolean);
    if (parts.length === 2) {
      const [a, b] = parts as [string, string];
      if (b === 'p' && a in COLORED_FILLS) {
        return {
          kind: 'phyrexian',
          raw: token,
          glyph: `${a.toUpperCase()}Φ`,
          fill: colorFill(a),
          fillSecondary: null,
          textColor: colorTextColor(a),
        };
      }
      if (a in COLORED_FILLS && b in COLORED_FILLS) {
        return {
          kind: 'hybrid',
          raw: token,
          glyph: `${a.toUpperCase()}/${b.toUpperCase()}`,
          fill: colorFill(a),
          fillSecondary: colorFill(b),
          textColor: TEXT_DARK,
        };
      }
      if (/^\d+$/.test(a) && b in COLORED_FILLS) {
        return {
          kind: 'hybrid',
          raw: token,
          glyph: `${a}/${b.toUpperCase()}`,
          fill: GENERIC_FILL,
          fillSecondary: colorFill(b),
          textColor: TEXT_DARK,
        };
      }
    }
  }

  if (lower === 's') {
    return { kind: 'snow', raw: token, glyph: 'S', fill: SNOW_FILL, fillSecondary: null, textColor: TEXT_DARK };
  }

  if (lower in COLORED_FILLS) {
    return {
      kind: 'colored',
      raw: token,
      glyph: lower.toUpperCase(),
      fill: colorFill(lower),
      fillSecondary: null,
      textColor: colorTextColor(lower),
    };
  }
  if (/^\d+$/.test(token)) {
    return { kind: 'generic', raw: token, glyph: token, fill: GENERIC_FILL, fillSecondary: null, textColor: TEXT_DARK };
  }
  if (lower === 'x' || lower === 'y' || lower === 'z') {
    return { kind: 'generic', raw: token, glyph: token.toUpperCase(), fill: GENERIC_FILL, fillSecondary: null, textColor: TEXT_DARK };
  }
  if (lower === 't') {
    return { kind: 'text', raw: token, glyph: '⟳', fill: GENERIC_FILL, fillSecondary: null, textColor: TEXT_DARK };
  }
  if (lower === 'q') {
    return { kind: 'text', raw: token, glyph: '⟲', fill: GENERIC_FILL, fillSecondary: null, textColor: TEXT_DARK };
  }
  return { kind: 'text', raw: token, glyph: token, fill: GENERIC_FILL, fillSecondary: null, textColor: TEXT_DARK };
}

/**
 * Parse a mana-cost / inline-symbol string. Recognises `{x}` braced tokens
 * (including hybrid `{w/u}`, Phyrexian `{w/p}`, half-generic `{2/w}`, snow
 * `{s}`) and a tolerant bare-letter / bare-digit shorthand for the
 * single-symbol case (e.g. "2WU" → ["2","W","U"]).
 */
export function parseManaCost(input: string): readonly ManaSymbol[] {
  const symbols: ManaSymbol[] = [];
  const braced = /\{([^}]+)\}/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = braced.exec(input)) !== null) {
    if (match.index > cursor) {
      const between = input.slice(cursor, match.index);
      for (const token of extractBareTokens(between)) {
        symbols.push(classifyToken(token));
      }
    }
    symbols.push(classifyToken(match[1] ?? ''));
    cursor = match.index + match[0].length;
  }
  if (cursor < input.length) {
    for (const token of extractBareTokens(input.slice(cursor))) {
      symbols.push(classifyToken(token));
    }
  }
  return symbols;
}

function extractBareTokens(segment: string): readonly string[] {
  const tokens: string[] = [];
  const trimmed = segment.trim();
  if (!trimmed) return tokens;
  let digits = '';
  for (const char of trimmed) {
    if (/\d/.test(char)) {
      digits += char;
      continue;
    }
    if (digits) {
      tokens.push(digits);
      digits = '';
    }
    if (/[a-z]/i.test(char)) {
      tokens.push(char);
    }
  }
  if (digits) tokens.push(digits);
  return tokens;
}
