export type ManaSymbolKind = 'colored' | 'generic' | 'hybrid' | 'phyrexian' | 'snow' | 'text';

export interface ManaSymbol {
  readonly kind: ManaSymbolKind;
  readonly raw: string;
  readonly glyph: string;
  readonly fill: string;
  readonly fillSecondary: string | null;
  readonly textColor: string;
  readonly code: string | null;
  readonly imagePath: string | null;
  readonly imageWidthScale: number;
  readonly imageHeightScale: number;
  readonly matchTextColor: boolean;
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

const NORMAL_SYMBOL_CODES = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  'w',
  'u',
  'b',
  'r',
  'g',
  'c',
  'x',
  'y',
  'z',
  't',
  'untap',
  's',
  'snow',
  'oldtap',
  'originaltap',
  'purple',
  'inf',
  'alchemy',
  'e',
  'a',
  'p',
] as const;

const HYBRID_SYMBOL_CODES = [
  'wu',
  'wb',
  'ub',
  'ur',
  'br',
  'bg',
  'rg',
  'rw',
  'gw',
  'gu',
  '2w',
  '2u',
  '2b',
  '2r',
  '2g',
  'wp',
  'up',
  'bp',
  'rp',
  'gp',
  'h',
  'wup',
  'wbp',
  'ubp',
  'urp',
  'brp',
  'bgp',
  'rgp',
  'rwp',
  'gwp',
  'gup',
  'purplew',
  'purpleu',
  'purpleb',
  'purpler',
  'purpleg',
  '2purple',
  'purplep',
  'cw',
  'cu',
  'cb',
  'cr',
  'cg',
] as const;

const EXTRA_SYMBOL_CODES = [
  'bar',
  'whitebar',
  'brush',
  'whitebrush',
  'xxbgw',
  'xxbrg',
  'xxgub',
  'xxgwu',
  'xxrgw',
  'xxrwu',
  'xxubr',
  'xxurg',
  'xxwbr',
  'xxwub',
  'chaos',
  'tk',
  'planeswalker',
  '+0',
  '+1',
  '+2',
  '+3',
  '+4',
  '+5',
  '+6',
  '+7',
  '+8',
  '+9',
  '-1',
  '-2',
  '-3',
  '-4',
  '-5',
  '-6',
  '-7',
  '-8',
  '-9',
] as const;

const KNOWN_SYMBOL_CODES = new Set<string>([
  ...NORMAL_SYMBOL_CODES,
  ...HYBRID_SYMBOL_CODES,
  ...EXTRA_SYMBOL_CODES,
  'half',
  'star',
  'artistbrush',
  'l+',
  'l-',
  'l0',
]);

const PNG_SYMBOL_CODES = new Set<string>(['bar', 'whitebar', 'l+', 'l-', 'l0']);
const MATCH_TEXT_COLOR_SYMBOL_CODES = new Set<string>(['e', 'a', 'p', 'chaos', 'tk', 'planeswalker']);
const WIDE_SYMBOL_CODES = new Set<string>([
  ...HYBRID_SYMBOL_CODES,
  'xxbgw',
  'xxbrg',
  'xxgub',
  'xxgwu',
  'xxrgw',
  'xxrwu',
  'xxubr',
  'xxurg',
  'xxwbr',
  'xxwub',
]);
const LOYALTY_SYMBOL_CODES = new Set<string>([
  '+0',
  '+1',
  '+2',
  '+3',
  '+4',
  '+5',
  '+6',
  '+7',
  '+8',
  '+9',
  '-1',
  '-2',
  '-3',
  '-4',
  '-5',
  '-6',
  '-7',
  '-8',
  '-9',
]);

const SYMBOL_ALIASES: Readonly<Record<string, string>> = {
  q: 'untap',
  tap: 't',
  snow: 's',
  infinity: 'inf',
  '∞': 'inf',
  '½': 'half',
  pw: 'planeswalker',
};

function colorFill(letter: string): string {
  return COLORED_FILLS[letter] ?? GENERIC_FILL;
}

function colorTextColor(letter: string): string {
  return letter === 'b' ? TEXT_LIGHT : TEXT_DARK;
}

function createManaSymbol(
  kind: ManaSymbolKind,
  raw: string,
  glyph: string,
  fill: string,
  fillSecondary: string | null,
  textColor: string,
): ManaSymbol {
  const code = resolveManaSymbolCode(raw);
  const [imageWidthScale, imageHeightScale] = code ? getManaSymbolImageScale(code) : [1, 1];
  return {
    kind,
    raw,
    glyph,
    fill,
    fillSecondary,
    textColor,
    code,
    imagePath: code ? `/img/manaSymbols/${getManaSymbolFileName(code)}` : null,
    imageWidthScale,
    imageHeightScale,
    matchTextColor: code ? MATCH_TEXT_COLOR_SYMBOL_CODES.has(code) : false,
  };
}

function classifyToken(token: string): ManaSymbol {
  const lower = token.toLowerCase();

  if (lower.includes('/')) {
    const parts = lower.split('/').map((part) => part.trim()).filter(Boolean);
    if (parts.length === 2) {
      const [a, b] = parts as [string, string];
      if (b === 'p' && a in COLORED_FILLS) {
        return createManaSymbol('phyrexian', token, `${a.toUpperCase()}Φ`, colorFill(a), null, colorTextColor(a));
      }
      if (a in COLORED_FILLS && b in COLORED_FILLS) {
        return createManaSymbol('hybrid', token, `${a.toUpperCase()}/${b.toUpperCase()}`, colorFill(a), colorFill(b), TEXT_DARK);
      }
      if (/^\d+$/.test(a) && b in COLORED_FILLS) {
        return createManaSymbol('hybrid', token, `${a}/${b.toUpperCase()}`, GENERIC_FILL, colorFill(b), TEXT_DARK);
      }
    }
  }

  if (lower === 's') {
    return createManaSymbol('snow', token, 'S', SNOW_FILL, null, TEXT_DARK);
  }

  if (lower in COLORED_FILLS) {
    return createManaSymbol('colored', token, lower.toUpperCase(), colorFill(lower), null, colorTextColor(lower));
  }
  if (/^\d+$/.test(token)) {
    return createManaSymbol('generic', token, token, GENERIC_FILL, null, TEXT_DARK);
  }
  if (lower === 'x' || lower === 'y' || lower === 'z') {
    return createManaSymbol('generic', token, token.toUpperCase(), GENERIC_FILL, null, TEXT_DARK);
  }
  if (lower === 't') {
    return createManaSymbol('text', token, '⟳', GENERIC_FILL, null, TEXT_DARK);
  }
  if (lower === 'q') {
    return createManaSymbol('text', token, '⟲', GENERIC_FILL, null, TEXT_DARK);
  }
  return createManaSymbol('text', token, token, GENERIC_FILL, null, TEXT_DARK);
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

export function resolveManaSymbolCode(token: string): string | null {
  const normalized = normalizeManaSymbolToken(token);
  if (!normalized) return null;
  if (normalized.includes('/')) {
    const compact = normalized.replaceAll('/', '');
    return resolveExactManaSymbolCode(compact) ?? resolveExactManaSymbolCode(reverseString(compact)) ?? resolveKnownManaSymbolCode(compact);
  }
  return resolveKnownManaSymbolCode(normalized);
}

function resolveExactManaSymbolCode(code: string): string | null {
  return KNOWN_SYMBOL_CODES.has(code) ? code : null;
}

function resolveKnownManaSymbolCode(code: string): string | null {
  if (KNOWN_SYMBOL_CODES.has(code)) return code;
  const aliased = SYMBOL_ALIASES[code];
  if (aliased && KNOWN_SYMBOL_CODES.has(aliased)) return aliased;
  return null;
}

function normalizeManaSymbolToken(token: string): string {
  return token
    .trim()
    .replace(/^\{|\}$/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

function reverseString(value: string): string {
  return Array.from(value).reverse().join('');
}

function getManaSymbolFileName(code: string): string {
  return `${code}.${PNG_SYMBOL_CODES.has(code) ? 'png' : 'svg'}`;
}

function getManaSymbolImageScale(code: string): readonly [number, number] {
  if (code === 'brush' || code === 'whitebrush') return [2.85, 2.85];
  if (code === 'chaos') return [1.2, 1];
  if (code === 'tk') return [0.8, 1];
  if (code === 'planeswalker') return [0.6, 1.2];
  if (LOYALTY_SYMBOL_CODES.has(code)) return [1.6, 1];
  if (WIDE_SYMBOL_CODES.has(code)) return [1.2, 1.2];
  return [1, 1];
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
