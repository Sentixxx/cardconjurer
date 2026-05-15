import { drawManaSymbol, getManaSymbolDrawDimensions } from '@/features/creator/canvas/drawManaSymbols';
import { parseManaCost, type ManaSymbol } from '@/services/manaSymbols';

interface TextStyleState {
  italic: boolean;
  bold: boolean;
  color: string | null;
  fontSizeDelta: number;
  offsetX: number;
  offsetY: number;
  outlineColor: string | null;
  outlineWidth: number;
  shadowColor: string | null;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
}

type TextToken = { readonly kind: 'word'; readonly text: string; readonly style: TextStyleState };
type SymbolToken = { readonly kind: 'symbol'; readonly symbol: ManaSymbol; readonly style: TextStyleState };
type SpecialSymbolName = 'chaos' | 'planeswalker' | 'planechase';
type SpecialSymbolToken = { readonly kind: 'specialSymbol'; readonly name: SpecialSymbolName; readonly style: TextStyleState };
type RichTextAlign = 'start' | 'center' | 'end';
type AlignToken = { readonly kind: 'align'; readonly align: RichTextAlign };
type BreakToken = { readonly kind: 'space' } | { readonly kind: 'newline' };
type DividerToken = { readonly kind: 'divider' };

type DrawableToken = TextToken | SymbolToken | SpecialSymbolToken;
type Token = DrawableToken | AlignToken | BreakToken | DividerToken;
type LineItem = { readonly token: DrawableToken; readonly width: number; readonly leadingSpace: number };
type LineLayout = { readonly items: readonly LineItem[]; readonly width: number; readonly align: RichTextAlign; readonly divider?: boolean };
type TextDirective =
  | { readonly kind: 'italic-on' }
  | { readonly kind: 'italic-off' }
  | { readonly kind: 'bold-on' }
  | { readonly kind: 'bold-off' }
  | { readonly kind: 'color'; readonly color: string | null }
  | { readonly kind: 'font-size'; readonly delta: number }
  | { readonly kind: 'offset'; readonly dx: number; readonly dy: number }
  | { readonly kind: 'outline'; readonly color: string | null; readonly width: number }
  | {
      readonly kind: 'shadow';
      readonly color?: string | null;
      readonly offsetX?: number;
      readonly offsetY?: number;
      readonly blur?: number;
    }
  | { readonly kind: 'align'; readonly align: RichTextAlign }
  | { readonly kind: 'newline' }
  | { readonly kind: 'divider' }
  | { readonly kind: 'flavor' }
  | { readonly kind: 'old-flavor' }
  | { readonly kind: 'ignore' };

const BRACED = /\{([^}]+)\}/g;
const SPECIAL_SYMBOL_IMAGES: Partial<Record<'chaos' | 'planeswalker', HTMLImageElement>> = {};
const FLAVOR_BAR_IMAGES: Partial<Record<'bar' | 'whitebar', HTMLImageElement>> = {};

function tokenize(text: string): readonly Token[] {
  const tokens: Token[] = [];
  const style: TextStyleState = createDefaultTextStyle();
  for (let line = 0; line < text.length; ) {
    const nextNewline = text.indexOf('\n', line);
    const end = nextNewline === -1 ? text.length : nextNewline;
    const segment = text.slice(line, end);
    pushTextSegment(tokens, segment, style);
    if (nextNewline === -1) break;
    tokens.push({ kind: 'newline' });
    line = nextNewline + 1;
  }
  return tokens;
}

function pushTextSegment(tokens: Token[], segment: string, style: TextStyleState): void {
  let cursor = 0;
  BRACED.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = BRACED.exec(segment)) !== null) {
    if (match.index > cursor) {
      pushWords(tokens, segment.slice(cursor, match.index), style);
    }
    const rawToken = match[1] ?? '';
    const directive = readTextDirective(rawToken);
    if (directive) {
      applyTextDirective(tokens, style, directive);
      cursor = match.index + match[0].length;
      continue;
    }
    const specialSymbol = readSpecialSymbol(rawToken);
    if (specialSymbol) {
      tokens.push({ kind: 'specialSymbol', name: specialSymbol, style: { ...style } });
    } else {
      const parsed = parseManaCost(`{${rawToken}}`);
      for (const sym of parsed) {
        tokens.push({ kind: 'symbol', symbol: sym, style: { ...style } });
      }
    }
    cursor = match.index + match[0].length;
  }
  if (cursor < segment.length) {
    pushWords(tokens, segment.slice(cursor), style);
  }
}

function readSpecialSymbol(raw: string): SpecialSymbolName | null {
  const lower = raw.trim().toLowerCase();
  if (lower === 'chaos' || lower === 'planeswalker' || lower === 'planechase') return lower;
  return null;
}

function readTextDirective(raw: string): TextDirective | null {
  const lower = raw.trim().toLowerCase();
  if (lower === 'i') return { kind: 'italic-on' };
  if (lower === '/i') return { kind: 'italic-off' };
  if (lower === 'bold') return { kind: 'bold-on' };
  if (lower === '/bold') return { kind: 'bold-off' };
  if (lower === 'line' || lower === 'lns') return { kind: 'newline' };
  if (lower === 'flavor') return { kind: 'flavor' };
  if (lower === 'oldflavor') return { kind: 'old-flavor' };
  if (lower === 'bar' || lower === 'divider') return { kind: 'divider' };
  if (lower === '/fontcolor') return { kind: 'color', color: null };
  if (lower.startsWith('fontcolor')) {
    const color = raw.trim().slice('fontcolor'.length).trim();
    return { kind: 'color', color: isReadableCanvasColor(color) ? color : null };
  }
  if (lower.startsWith('fontsize')) {
    const value = Number(raw.trim().slice('fontsize'.length).trim());
    return Number.isFinite(value) ? { kind: 'font-size', delta: value } : { kind: 'ignore' };
  }
  const outlineDirective = readOutlineDirective(raw);
  if (outlineDirective) return outlineDirective;
  const shadowDirective = readShadowDirective(raw);
  if (shadowDirective) return shadowDirective;
  const offsetDirective = readOffsetDirective(raw);
  if (offsetDirective) return offsetDirective;
  if (lower === 'left') return { kind: 'align', align: 'start' };
  if (lower === 'center') return { kind: 'align', align: 'center' };
  if (lower === 'right') return { kind: 'align', align: 'end' };
  if (
    lower === 'artistbrush' ||
    lower === 'oldartistbrush' ||
    lower === 'star' ||
    lower === 'savetextx' ||
    lower === 'savex' ||
    lower === 'savex2' ||
    lower === 'fixtextalign' ||
    lower.startsWith('font') ||
    lower.startsWith('/font') ||
    lower.startsWith('up') ||
    lower.startsWith('/indent') ||
    lower.startsWith('indent')
  ) {
    return { kind: 'ignore' };
  }
  return null;
}

function readOutlineDirective(raw: string): TextDirective | null {
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();
  if (lower === '/outline') return { kind: 'outline', color: null, width: 0 };
  if (lower.startsWith('outline:')) {
    const [color = '', rawWidth = ''] = trimmed.slice('outline:'.length).split(',');
    const width = Number(rawWidth.trim());
    if (!Number.isFinite(width)) return { kind: 'ignore' };
    return {
      kind: 'outline',
      color: isReadableCanvasColor(color.trim()) ? color.trim() : '#000000',
      width: Math.max(0, width),
    };
  }
  if (lower.startsWith('outlinecolor')) {
    const color = trimmed.slice('outlinecolor'.length).trim();
    return {
      kind: 'outline',
      color: isReadableCanvasColor(color) ? color : '#000000',
      width: Number.NaN,
    };
  }
  if (/^outline[-+]?\d+(?:\.\d+)?$/.test(lower)) {
    const width = Number(lower.slice('outline'.length));
    return { kind: 'outline', color: null, width: Math.max(0, width) };
  }
  return null;
}

function readShadowDirective(raw: string): TextDirective | null {
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();
  if (lower === '/shadow') {
    return { kind: 'shadow', color: null, offsetX: 0, offsetY: 0, blur: 0 };
  }
  if (lower.startsWith('shadowcolor')) {
    const color = trimmed.slice('shadowcolor'.length).trim();
    return { kind: 'shadow', color: isReadableCanvasColor(color) ? color : '#000000' };
  }
  if (lower.startsWith('shadowblur')) {
    const blur = Number(trimmed.slice('shadowblur'.length).trim());
    return Number.isFinite(blur) ? { kind: 'shadow', blur: Math.max(0, blur) } : { kind: 'ignore' };
  }
  if (lower.startsWith('shadowx')) {
    const offsetX = Number(trimmed.slice('shadowx'.length).trim());
    return Number.isFinite(offsetX) ? { kind: 'shadow', offsetX } : { kind: 'ignore' };
  }
  if (lower.startsWith('shadowy')) {
    const offsetY = Number(trimmed.slice('shadowy'.length).trim());
    return Number.isFinite(offsetY) ? { kind: 'shadow', offsetY } : { kind: 'ignore' };
  }
  if (/^shadow[-+]?\d+(?:\.\d+)?$/.test(lower)) {
    const offset = Number(lower.slice('shadow'.length));
    if (!Number.isFinite(offset)) return { kind: 'ignore' };
    return { kind: 'shadow', color: '#000000', offsetX: offset, offsetY: offset };
  }
  return null;
}

function readOffsetDirective(raw: string): TextDirective | null {
  const lower = raw.trim().toLowerCase();
  const match = /^(right|left|up|down|upinline|downinline)([-+]?\d+(?:\.\d+)?)$/.exec(lower);
  if (!match) return null;
  const direction = match[1];
  const value = Number(match[2]);
  if (!Number.isFinite(value)) return null;
  if (direction === 'right') return { kind: 'offset', dx: value, dy: 0 };
  if (direction === 'left') return { kind: 'offset', dx: -value, dy: 0 };
  if (direction === 'down' || direction === 'downinline') return { kind: 'offset', dx: 0, dy: value };
  return { kind: 'offset', dx: 0, dy: -value };
}

function applyTextDirective(tokens: Token[], style: TextStyleState, directive: TextDirective): void {
  if (directive.kind === 'italic-on') style.italic = true;
  if (directive.kind === 'italic-off') style.italic = false;
  if (directive.kind === 'bold-on') style.bold = true;
  if (directive.kind === 'bold-off') style.bold = false;
  if (directive.kind === 'color') style.color = directive.color;
  if (directive.kind === 'font-size') style.fontSizeDelta = directive.delta;
  if (directive.kind === 'offset') {
    style.offsetX += directive.dx;
    style.offsetY += directive.dy;
  }
  if (directive.kind === 'outline') {
    if (directive.color !== null) style.outlineColor = directive.color;
    if (Number.isFinite(directive.width)) style.outlineWidth = directive.width;
  }
  if (directive.kind === 'shadow') {
    if ('color' in directive) style.shadowColor = directive.color ?? null;
    if (directive.offsetX !== undefined) style.shadowOffsetX = directive.offsetX;
    if (directive.offsetY !== undefined) style.shadowOffsetY = directive.offsetY;
    if (directive.blur !== undefined) style.shadowBlur = directive.blur;
  }
  if (directive.kind === 'align') tokens.push({ kind: 'align', align: directive.align });
  if (directive.kind === 'newline') tokens.push({ kind: 'newline' });
  if (directive.kind === 'divider') {
    tokens.push({ kind: 'newline' });
    tokens.push({ kind: 'divider' });
    tokens.push({ kind: 'newline' });
  }
  if (directive.kind === 'flavor') {
    tokens.push({ kind: 'newline' });
    tokens.push({ kind: 'divider' });
    tokens.push({ kind: 'newline' });
    style.italic = true;
  }
  if (directive.kind === 'old-flavor') {
    tokens.push({ kind: 'newline' });
    style.italic = true;
  }
}

function pushWords(tokens: Token[], text: string, style: TextStyleState): void {
  const parts = text.split(/(\s+)/);
  for (const part of parts) {
    if (part === '') continue;
    if (/^\s+$/.test(part)) {
      tokens.push({ kind: 'space' });
    } else {
      for (const segment of segmentWordForWrapping(part)) {
        tokens.push({ kind: 'word', text: segment, style: { ...style } });
      }
    }
  }
}

function segmentWordForWrapping(value: string): readonly string[] {
  const segments: string[] = [];
  let run = '';

  for (const char of Array.from(value)) {
    if (isCjk(char)) {
      if (run) {
        segments.push(...splitLongRun(run));
        run = '';
      }
      segments.push(char);
    } else {
      run += char;
    }
  }

  if (run) segments.push(...splitLongRun(run));
  return segments.length > 0 ? segments : [value];
}

function splitLongRun(value: string): readonly string[] {
  const chars = Array.from(value);
  const maxChars = 14;
  if (chars.length <= maxChars) return [value];
  const chunks: string[] = [];
  for (let index = 0; index < chars.length; index += maxChars) {
    chunks.push(chars.slice(index, index + maxChars).join(''));
  }
  return chunks;
}

function isCjk(char: string): boolean {
  const code = char.codePointAt(0) ?? 0;
  return (
    (code >= 0x3400 && code <= 0x9fff) ||
    (code >= 0xf900 && code <= 0xfaff) ||
    (code >= 0x3040 && code <= 0x30ff) ||
    (code >= 0xac00 && code <= 0xd7af)
  );
}

export interface DrawRichTextOptions {
  readonly font: string;
  readonly color: string;
  readonly lineHeight: number;
  readonly symbolDiameter: number;
  readonly maxHeight?: number;
  readonly minScale?: number;
  readonly dividerColor?: string;
  readonly dividerHeight?: number;
}

export function drawRichText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  options: DrawRichTextOptions,
): void {
  if (!text) return;
  const tokens = tokenize(text);
  const { color } = options;
  const fitted = fitRichTextToBox(ctx, tokens, options, maxWidth);
  const { font, lineHeight, symbolDiameter, lines } = fitted;
  const dividerColor = options.dividerColor ?? resolveFlavorDividerColor(color);

  ctx.save();
  if (options.maxHeight !== undefined) {
    ctx.beginPath();
    ctx.rect(x, y, maxWidth, Math.max(1, options.maxHeight));
    ctx.clip();
  }
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'start';

  let cursorY = y;
  for (const line of lines) {
    drawRichTextLine(ctx, line, x, cursorY, maxWidth, color, lineHeight, symbolDiameter, font, {
      color: dividerColor,
      height: options.dividerHeight,
    });
    cursorY += lineHeight;
  }

  ctx.restore();
}

function fitRichTextToBox(
  ctx: CanvasRenderingContext2D,
  tokens: readonly Token[],
  options: DrawRichTextOptions,
  maxWidth: number,
): {
  readonly font: string;
  readonly lineHeight: number;
  readonly symbolDiameter: number;
  readonly lines: readonly LineLayout[];
} {
  const maxHeight = options.maxHeight;
  let font = options.font;
  let lineHeight = options.lineHeight;
  let symbolDiameter = options.symbolDiameter;
  let lines = layoutRichTextLines(ctx, tokens, font, lineHeight, symbolDiameter, maxWidth);
  if (maxHeight === undefined || maxHeight <= 0) return { font, lineHeight, symbolDiameter, lines };

  const minScale = options.minScale ?? 0.48;
  const originalLineHeight = options.lineHeight;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const usedHeight = lines.length * lineHeight;
    if (usedHeight <= maxHeight) return { font, lineHeight, symbolDiameter, lines };

    const targetScale = Math.max(minScale, Math.min(0.98, maxHeight / usedHeight) * 0.96);
    const absoluteScale = Math.max(minScale, (lineHeight / originalLineHeight) * targetScale);
    font = scaleFontSize(options.font, absoluteScale);
    lineHeight = Math.max(10, options.lineHeight * absoluteScale);
    symbolDiameter = Math.max(8, options.symbolDiameter * absoluteScale);
    lines = layoutRichTextLines(ctx, tokens, font, lineHeight, symbolDiameter, maxWidth);
  }

  if (lines.length * lineHeight > maxHeight) {
    lines = trimLinesToHeight(lines, lineHeight, maxHeight);
  }
  return { font, lineHeight, symbolDiameter, lines };
}

function trimLinesToHeight(
  lines: readonly LineLayout[],
  lineHeight: number,
  maxHeight: number,
): readonly LineLayout[] {
  const maxLines = Math.max(1, Math.floor(maxHeight / lineHeight));
  return lines.slice(0, maxLines);
}

function scaleFontSize(font: string, scale: number): string {
  return font.replace(/(\d+(?:\.\d+)?)px/g, (_match, rawSize: string) => {
    const next = Math.max(4, Number(rawSize) * scale);
    return `${Math.round(next * 10) / 10}px`;
  });
}

function layoutRichTextLines(
  ctx: CanvasRenderingContext2D,
  tokens: readonly Token[],
  font: string,
  lineHeight: number,
  symbolDiameter: number,
  maxWidth: number,
): readonly LineLayout[] {
  const spaceWidth = measureSpaceWidth(ctx, font);
  const lines: LineLayout[] = [];
  let items: LineItem[] = [];
  let width = 0;
  let align: RichTextAlign = 'start';
  let nextAlign: RichTextAlign = 'start';
  let pendingSpace = 0;

  const pushLine = (): void => {
    lines.push({ items, width, align });
    items = [];
    width = 0;
    align = nextAlign;
    pendingSpace = 0;
  };

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (!token) continue;
    if (token.kind === 'align') {
      nextAlign = token.align;
      if (items.length > 0) {
        pushLine();
      } else {
        align = token.align;
      }
      continue;
    }
    if (token.kind === 'newline') {
      pushLine();
      continue;
    }
    if (token.kind === 'divider') {
      if (items.length > 0) pushLine();
      lines.push({ items: [], width: 0, align, divider: true });
      items = [];
      width = 0;
      align = nextAlign;
      pendingSpace = 0;
      continue;
    }
    if (token.kind === 'space') {
      if (items.length > 0) pendingSpace = spaceWidth;
      continue;
    }
    const tokenWidth =
      token.kind === 'word'
        ? measureWord(ctx, token.text, fontForStyle(font, token.style))
        : token.kind === 'symbol'
          ? getManaSymbolDrawDimensions(token.symbol, symbolDiameter).width
          : specialSymbolWidth(token.name, symbolDiameter);
    const leadingSpace = items.length > 0 ? pendingSpace : 0;
    if (items.length > 0 && width + leadingSpace + tokenWidth > maxWidth) {
      pushLine();
    }
    const resolvedLeadingSpace = items.length > 0 ? pendingSpace : 0;
    items.push({ token, width: tokenWidth, leadingSpace: resolvedLeadingSpace });
    width += resolvedLeadingSpace + tokenWidth;
    pendingSpace = 0;
  }
  if (items.length > 0 || lines.length === 0) {
    lines.push({ items, width, align });
  }
  return lines;
}

function drawRichTextLine(
  ctx: CanvasRenderingContext2D,
  line: LineLayout,
  x: number,
  y: number,
  maxWidth: number,
  color: string,
  lineHeight: number,
  symbolDiameter: number,
  baseFont: string,
  divider: FlavorDividerOptions,
): void {
  let cursorX = line.align === 'center'
    ? x + (maxWidth - line.width) / 2
    : line.align === 'end'
      ? x + maxWidth - line.width
      : x;
  if (line.divider) {
    drawFlavorDivider(ctx, x, y, maxWidth, { ...divider, lineHeight });
    return;
  }
  for (const item of line.items) {
    cursorX += item.leadingSpace;
    const token = item.token;
    const drawX = cursorX + token.style.offsetX;
    const drawY = y + token.style.offsetY;
    if (token.kind === 'word') {
      drawStyledWord(ctx, token, drawX, drawY, color, baseFont);
    } else if (token.kind === 'symbol') {
      drawInlineSymbol(ctx, token.symbol, drawX, drawY, symbolDiameter, lineHeight, color);
    } else {
      drawSpecialSymbol(ctx, token.name, drawX, drawY, symbolDiameter, lineHeight, color);
    }
    cursorX += item.width;
  }
}

function createDefaultTextStyle(): TextStyleState {
  return {
    italic: false,
    bold: false,
    color: null,
    fontSizeDelta: 0,
    offsetX: 0,
    offsetY: 0,
    outlineColor: null,
    outlineWidth: 0,
    shadowColor: null,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
  };
}

function drawStyledWord(
  ctx: CanvasRenderingContext2D,
  token: TextToken,
  x: number,
  y: number,
  color: string,
  baseFont: string,
): void {
  ctx.save();
  ctx.font = fontForStyle(baseFont, token.style);
  ctx.shadowColor = token.style.shadowColor ?? 'transparent';
  ctx.shadowOffsetX = token.style.shadowOffsetX;
  ctx.shadowOffsetY = token.style.shadowOffsetY;
  ctx.shadowBlur = token.style.shadowBlur;
  if (token.style.outlineWidth > 0) {
    ctx.strokeStyle = token.style.outlineColor ?? '#000000';
    ctx.lineWidth = token.style.outlineWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeText(token.text, x, y);
  }
  ctx.fillStyle = token.style.color ?? color;
  ctx.fillText(token.text, x, y);
  ctx.restore();
}

interface FlavorDividerOptions {
  readonly lineHeight: number;
  readonly color: string;
  readonly height?: number;
  readonly verticalOffset?: number;
}

export function drawFlavorDivider(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  maxWidth: number,
  options: FlavorDividerOptions,
): void {
  const barWidth = maxWidth * 0.95;
  const barHeight = Math.max(1, options.height ?? options.lineHeight * 0.048);
  const barX = x + (maxWidth - barWidth) / 2;
  const barY = y + options.lineHeight * (options.verticalOffset ?? 0.7);
  const imageName = isWhiteFlavorDivider(options.color) ? 'whitebar' : 'bar';
  const image = getFlavorBarImage(imageName);

  ctx.save();
  if (image) {
    ctx.drawImage(image, barX, barY, barWidth, barHeight);
  } else {
    ctx.fillStyle = options.color;
    ctx.fillRect(barX, barY, barWidth, barHeight);
  }
  ctx.restore();
}

export function resolveFlavorDividerColor(color: string): string {
  return isWhiteFlavorDivider(color) ? '#ffffff' : '#000000';
}

function isWhiteFlavorDivider(color: string): boolean {
  const normalized = color.trim().toLowerCase();
  return normalized === 'white' || normalized === '#fff' || normalized === '#ffffff' || normalized === '#efefef';
}

function measureWord(ctx: CanvasRenderingContext2D, word: string, font: string): number {
  ctx.font = font;
  return ctx.measureText(word).width;
}

function measureSpaceWidth(ctx: CanvasRenderingContext2D, font: string): number {
  ctx.font = font;
  return ctx.measureText(' ').width;
}

function fontForStyle(font: string, style: TextStyleState): string {
  let resolved = style.fontSizeDelta === 0 ? font : adjustFontSize(font, style.fontSizeDelta);
  if (style.bold && !/\bbold\b/i.test(resolved)) resolved = `bold ${resolved}`;
  if (style.italic && !/\bitalic\b/i.test(resolved)) resolved = `italic ${resolved}`;
  return resolved;
}

function adjustFontSize(font: string, delta: number): string {
  return font.replace(/(\d+(?:\.\d+)?)px/, (_match, rawSize: string) => {
    const next = Math.max(4, Number(rawSize) + delta);
    return `${Math.round(next * 10) / 10}px`;
  });
}

function isReadableCanvasColor(value: string): boolean {
  return /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(value) || /^[a-z]+$/i.test(value);
}

function drawInlineSymbol(
  ctx: CanvasRenderingContext2D,
  symbol: ManaSymbol,
  x: number,
  y: number,
  diameter: number,
  lineHeight: number,
  color: string,
): void {
  const { height } = getManaSymbolDrawDimensions(symbol, diameter);
  drawManaSymbol(ctx, symbol, x, y + (lineHeight - height) / 2, diameter, color);
}

function specialSymbolWidth(name: SpecialSymbolName, diameter: number): number {
  if (name === 'planechase') return diameter * 1.8 * 1.2;
  return diameter;
}

function drawSpecialSymbol(
  ctx: CanvasRenderingContext2D,
  name: SpecialSymbolName,
  x: number,
  y: number,
  diameter: number,
  lineHeight: number,
  color: string,
): void {
  const height = name === 'planechase' ? diameter * 1.8 : diameter;
  const width = name === 'planechase' ? height * 1.2 : diameter;
  const drawY = y + (lineHeight - height) / 2;
  const imageName = name === 'planeswalker' ? 'planeswalker' : 'chaos';
  const image = getSpecialSymbolImage(imageName);

  ctx.save();
  if (image) {
    ctx.drawImage(image, x, drawY, width, height);
  } else if (imageName === 'planeswalker') {
    drawPlaneswalkerFallback(ctx, x, drawY, width, height, color);
  } else {
    drawChaosFallback(ctx, x, drawY, width, height, color);
  }
  ctx.restore();
}

function getSpecialSymbolImage(name: 'chaos' | 'planeswalker'): HTMLImageElement | null {
  if (typeof Image === 'undefined') return null;
  const existing = SPECIAL_SYMBOL_IMAGES[name];
  if (existing) return existing.complete && existing.naturalWidth > 0 ? existing : null;
  const image = new Image();
  image.src = `/img/manaSymbols/${name}.svg`;
  SPECIAL_SYMBOL_IMAGES[name] = image;
  return image.complete && image.naturalWidth > 0 ? image : null;
}

function getFlavorBarImage(name: 'bar' | 'whitebar'): HTMLImageElement | null {
  if (typeof Image === 'undefined') return null;
  const existing = FLAVOR_BAR_IMAGES[name];
  if (existing) return existing.complete && existing.naturalWidth > 0 ? existing : null;
  const image = new Image();
  image.src = `/img/manaSymbols/${name}.png`;
  FLAVOR_BAR_IMAGES[name] = image;
  return image.complete && image.naturalWidth > 0 ? image : null;
}

function drawChaosFallback(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
): void {
  const cx = x + width / 2;
  const cy = y + height / 2;
  const radius = Math.min(width, height) * 0.25;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(2, Math.min(width, height) * 0.08);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 8; i += 1) {
    const angle = (Math.PI * 2 * i) / 8;
    const inner = radius * 0.75;
    const outer = Math.min(width, height) * 0.46;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
    ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
    ctx.stroke();
  }
}

function drawPlaneswalkerFallback(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
): void {
  ctx.fillStyle = color;
  const centerX = x + width / 2;
  const top = y + height * 0.16;
  const dotRadius = Math.max(2, width * 0.09);
  const offsets = [-0.32, -0.16, 0, 0.16, 0.32];
  for (const offset of offsets) {
    const dotX = centerX + offset * width;
    const dotY = top + Math.abs(offset) * height * 0.42;
    ctx.beginPath();
    ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.moveTo(x + width * 0.18, y + height * 0.58);
  ctx.lineTo(x + width * 0.82, y + height * 0.58);
  ctx.lineTo(x + width * 0.68, y + height * 0.9);
  ctx.lineTo(x + width * 0.32, y + height * 0.9);
  ctx.closePath();
  ctx.fill();
}
