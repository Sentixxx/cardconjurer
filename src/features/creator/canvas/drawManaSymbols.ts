import type { ManaSymbol } from '@/services/manaSymbols';

export interface DrawSymbolRowOptions {
  readonly anchor: 'left' | 'right';
  readonly diameter: number;
  readonly gap: number;
}

export function drawManaSymbolRow(
  ctx: CanvasRenderingContext2D,
  symbols: readonly ManaSymbol[],
  x: number,
  y: number,
  options: DrawSymbolRowOptions,
): void {
  if (symbols.length === 0) return;
  const { anchor, diameter, gap } = options;
  const rowWidth = symbols.length * diameter + Math.max(0, symbols.length - 1) * gap;
  const startX = anchor === 'right' ? x - rowWidth : x;
  ctx.save();
  for (let i = 0; i < symbols.length; i += 1) {
    const symbol = symbols[i];
    if (!symbol) continue;
    const cx = startX + i * (diameter + gap) + diameter / 2;
    const cy = y + diameter / 2;
    drawManaCircle(ctx, symbol, cx, cy, diameter / 2);
  }
  ctx.restore();
}

export function drawManaCircle(
  ctx: CanvasRenderingContext2D,
  symbol: ManaSymbol,
  cx: number,
  cy: number,
  radius: number,
): void {
  ctx.save();
  if (symbol.fillSecondary) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius);
    ctx.arc(cx, cy, radius, -Math.PI / 2, Math.PI / 2);
    ctx.closePath();
    ctx.fillStyle = symbol.fillSecondary;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius);
    ctx.arc(cx, cy, radius, -Math.PI / 2, Math.PI / 2, true);
    ctx.closePath();
    ctx.fillStyle = symbol.fill;
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = symbol.fill;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = symbol.textColor;
  const glyph = symbol.glyph;
  const fontSize = glyph.length > 1 ? Math.round(radius * 0.85) : Math.round(radius * 1.24);
  ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(glyph, cx, cy + 1);
  ctx.restore();
}
