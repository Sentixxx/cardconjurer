import type { ManaSymbol } from '@/services/manaSymbols';

export interface DrawSymbolRowOptions {
  readonly anchor: 'left' | 'right';
  readonly diameter: number;
  readonly gap: number;
}

const MANA_SYMBOL_IMAGE_CACHE = new Map<string, HTMLImageElement>();
const ASSET_LOADED_EVENT = 'cardforger:asset-loaded';

export function drawManaSymbolRow(
  ctx: CanvasRenderingContext2D,
  symbols: readonly ManaSymbol[],
  x: number,
  y: number,
  options: DrawSymbolRowOptions,
): void {
  if (symbols.length === 0) return;
  const { anchor, diameter, gap } = options;
  const widths = symbols.map((symbol) => getManaSymbolDrawDimensions(symbol, diameter).width);
  const rowWidth = widths.reduce((total, width) => total + width, 0) + Math.max(0, symbols.length - 1) * gap;
  const startX = anchor === 'right' ? x - rowWidth : x;
  ctx.save();
  let cursorX = startX;
  for (let i = 0; i < symbols.length; i += 1) {
    const symbol = symbols[i];
    if (!symbol) continue;
    drawManaSymbol(ctx, symbol, cursorX, y, diameter);
    cursorX += (widths[i] ?? diameter) + gap;
  }
  ctx.restore();
}

export function getManaSymbolDrawDimensions(symbol: ManaSymbol, diameter: number): { readonly width: number; readonly height: number } {
  return {
    width: diameter * symbol.imageWidthScale,
    height: diameter * symbol.imageHeightScale,
  };
}

export function drawManaSymbol(
  ctx: CanvasRenderingContext2D,
  symbol: ManaSymbol,
  x: number,
  y: number,
  diameter: number,
  color?: string,
): void {
  const { width, height } = getManaSymbolDrawDimensions(symbol, diameter);
  const image = getManaSymbolImage(symbol);
  if (image) {
    ctx.save();
    if (color && symbol.matchTextColor && isTintableTextColor(color)) {
      drawTintedManaSymbol(ctx, image, x, y, width, height, color);
    } else {
      ctx.drawImage(image, x, y, width, height);
    }
    ctx.restore();
    return;
  }
  drawManaCircleFallback(ctx, symbol, x + width / 2, y + height / 2, Math.min(width, height) / 2);
}

export function drawManaCircle(
  ctx: CanvasRenderingContext2D,
  symbol: ManaSymbol,
  cx: number,
  cy: number,
  radius: number,
): void {
  const diameter = radius * 2;
  const { width, height } = getManaSymbolDrawDimensions(symbol, diameter);
  drawManaSymbol(ctx, symbol, cx - width / 2, cy - height / 2, diameter);
}

function drawManaCircleFallback(
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

function getManaSymbolImage(symbol: ManaSymbol): HTMLImageElement | null {
  if (typeof Image === 'undefined' || !symbol.imagePath) return null;
  const existing = MANA_SYMBOL_IMAGE_CACHE.get(symbol.imagePath);
  if (existing) return existing.complete && existing.naturalWidth > 0 ? existing : null;

  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.onload = notifyAssetLoaded;
  image.onerror = notifyAssetLoaded;
  image.src = symbol.imagePath;
  MANA_SYMBOL_IMAGE_CACHE.set(symbol.imagePath, image);
  return image.complete && image.naturalWidth > 0 ? image : null;
}

function notifyAssetLoaded(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(ASSET_LOADED_EVENT));
}

function isTintableTextColor(color: string): boolean {
  const normalized = color.trim().toLowerCase();
  return normalized !== '' && normalized !== 'black' && normalized !== '#000' && normalized !== '#000000' && normalized !== '#1d1d1d';
}

function drawTintedManaSymbol(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
): void {
  if (typeof document === 'undefined') {
    ctx.drawImage(image, x, y, width, height);
    return;
  }
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.ceil(width));
  canvas.height = Math.max(1, Math.ceil(height));
  const tempCtx = canvas.getContext('2d');
  if (!tempCtx) {
    ctx.drawImage(image, x, y, width, height);
    return;
  }
  tempCtx.drawImage(image, 0, 0, canvas.width, canvas.height);
  tempCtx.globalCompositeOperation = 'source-in';
  tempCtx.fillStyle = color;
  tempCtx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(canvas, x, y, width, height);
}
