import { drawManaCircle } from '@/features/creator/canvas/drawManaSymbols';
import { parseManaCost, type ManaSymbol } from '@/services/manaSymbols';

type TextToken = { readonly kind: 'word'; readonly text: string };
type SymbolToken = { readonly kind: 'symbol'; readonly symbol: ManaSymbol };
type BreakToken = { readonly kind: 'space' } | { readonly kind: 'newline' };

type Token = TextToken | SymbolToken | BreakToken;

const BRACED = /\{([^}]+)\}/g;

function tokenize(text: string): readonly Token[] {
  const tokens: Token[] = [];
  for (let line = 0; line < text.length; ) {
    const nextNewline = text.indexOf('\n', line);
    const end = nextNewline === -1 ? text.length : nextNewline;
    const segment = text.slice(line, end);
    pushTextSegment(tokens, segment);
    if (nextNewline === -1) break;
    tokens.push({ kind: 'newline' });
    line = nextNewline + 1;
  }
  return tokens;
}

function pushTextSegment(tokens: Token[], segment: string): void {
  let cursor = 0;
  BRACED.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = BRACED.exec(segment)) !== null) {
    if (match.index > cursor) {
      pushWords(tokens, segment.slice(cursor, match.index));
    }
    const parsed = parseManaCost(`{${match[1] ?? ''}}`);
    for (const sym of parsed) {
      tokens.push({ kind: 'symbol', symbol: sym });
    }
    cursor = match.index + match[0].length;
  }
  if (cursor < segment.length) {
    pushWords(tokens, segment.slice(cursor));
  }
}

function pushWords(tokens: Token[], text: string): void {
  const parts = text.split(/(\s+)/);
  for (const part of parts) {
    if (part === '') continue;
    if (/^\s+$/.test(part)) {
      tokens.push({ kind: 'space' });
    } else {
      tokens.push({ kind: 'word', text: part });
    }
  }
}

export interface DrawRichTextOptions {
  readonly font: string;
  readonly color: string;
  readonly lineHeight: number;
  readonly symbolDiameter: number;
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
  const { font, color, lineHeight, symbolDiameter } = options;
  const spaceWidth = measureSpaceWidth(ctx, font);

  ctx.save();
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'start';

  let cursorX = x;
  let cursorY = y;
  let lineHasContent = false;

  const newline = (): void => {
    cursorX = x;
    cursorY += lineHeight;
    lineHasContent = false;
  };

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (!token) continue;
    if (token.kind === 'newline') {
      newline();
      continue;
    }
    if (token.kind === 'space') {
      if (lineHasContent) cursorX += spaceWidth;
      continue;
    }
    const width = token.kind === 'word' ? measureWord(ctx, token.text, font) : symbolDiameter;
    if (lineHasContent && cursorX + width > x + maxWidth) {
      newline();
    }
    if (token.kind === 'word') {
      ctx.fillStyle = color;
      ctx.font = font;
      ctx.fillText(token.text, cursorX, cursorY);
    } else {
      drawInlineSymbol(ctx, token.symbol, cursorX, cursorY, symbolDiameter, lineHeight);
    }
    cursorX += width;
    lineHasContent = true;
  }

  ctx.restore();
}

function measureWord(ctx: CanvasRenderingContext2D, word: string, font: string): number {
  ctx.font = font;
  return ctx.measureText(word).width;
}

function measureSpaceWidth(ctx: CanvasRenderingContext2D, font: string): number {
  ctx.font = font;
  return ctx.measureText(' ').width;
}

function drawInlineSymbol(
  ctx: CanvasRenderingContext2D,
  symbol: ManaSymbol,
  x: number,
  y: number,
  diameter: number,
  lineHeight: number,
): void {
  const radius = diameter / 2;
  drawManaCircle(ctx, symbol, x + radius, y + lineHeight / 2, radius);
}
