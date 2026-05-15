import { drawRichText } from '@/features/creator/canvas/drawRichText';
import { classifyLoyaltyCost, type PlaneswalkerAbility } from '@/services/planeswalker';

const ICON_FILLS = {
  plus: '#2f7a3d',
  minus: '#a02929',
  zero: '#666666',
  ultimate: '#1d1d1d',
  other: '#444444',
} as const;

const ICON_TEXT_COLOR = '#efefef';

export interface DrawPlaneswalkerOptions {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly textColor: string;
  readonly rowHeights?: readonly number[];
  readonly costAdjustments?: readonly number[];
  readonly invertTextBoxes?: boolean;
}

export function drawPlaneswalkerAbilities(
  ctx: CanvasRenderingContext2D,
  abilities: readonly PlaneswalkerAbility[],
  options: DrawPlaneswalkerOptions,
): void {
  if (abilities.length === 0) return;
  const rowHeights = resolveRowHeights(abilities.length, options.height, options.rowHeights);
  const maxRowHeight = Math.max(...rowHeights);
  const iconSize = Math.min(110, Math.floor(maxRowHeight * 0.7));
  const iconColumnWidth = iconSize + 24;
  const textPadX = 16;
  const lightFill = options.invertTextBoxes ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.38)';
  const darkFill = options.invertTextBoxes ? 'rgba(91, 91, 91, 0.5)' : 'rgba(164, 164, 164, 0.38)';

  ctx.save();
  let rowY = options.y;
  for (let i = 0; i < abilities.length; i += 1) {
    const ability = abilities[i];
    if (!ability) continue;
    const rowHeight = rowHeights[i] ?? 0;
    if (rowHeight <= 0) continue;
    ctx.fillStyle = i % 2 === 0 ? lightFill : darkFill;
    ctx.fillRect(options.x, rowY, options.width, rowHeight);
    const iconY = rowY + (rowHeight - iconSize) / 2 + (options.costAdjustments?.[i] ?? 0);
    drawLoyaltyIcon(ctx, ability.cost, options.x + 12, iconY, iconSize);
    drawRichText(
      ctx,
      ability.text,
      options.x + iconColumnWidth + textPadX,
      rowY + 18,
      options.width - iconColumnWidth - textPadX * 2,
      {
        font: '40px mplantin, Georgia, serif',
        color: options.textColor,
        lineHeight: 48,
        symbolDiameter: 32,
      },
    );
    if (i < abilities.length - 1) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(options.x + 12, rowY + rowHeight);
      ctx.lineTo(options.x + options.width - 12, rowY + rowHeight);
      ctx.stroke();
    }
    rowY += rowHeight;
  }
  ctx.restore();
}

function resolveRowHeights(rowCount: number, totalHeight: number, configured: readonly number[] | undefined): readonly number[] {
  const rowHeights = Array.from({ length: rowCount }, (_, index) => Math.max(0, Math.round(configured?.[index] ?? 0)));
  if (rowHeights.some((height) => height > 0)) return rowHeights;
  return Array.from({ length: rowCount }, () => Math.floor(totalHeight / rowCount));
}

function drawLoyaltyIcon(
  ctx: CanvasRenderingContext2D,
  cost: string,
  x: number,
  y: number,
  size: number,
): void {
  const kind = classifyLoyaltyCost(cost);
  const fill = ICON_FILLS[kind];
  ctx.save();
  if (kind === 'plus') drawTriangleUp(ctx, x, y, size, fill);
  else if (kind === 'minus') drawTriangleDown(ctx, x, y, size, fill);
  else if (kind === 'ultimate') drawHexagon(ctx, x, y, size, fill);
  else drawDiamond(ctx, x, y, size, fill);

  ctx.fillStyle = ICON_TEXT_COLOR;
  ctx.font = `bold ${Math.round(size * 0.42)}px belerenbsc, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(cost || '·', x + size / 2, y + size / 2 + (kind === 'plus' ? size * 0.06 : kind === 'minus' ? -size * 0.06 : 0));
  ctx.restore();
}

function drawTriangleUp(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, fill: string): void {
  ctx.beginPath();
  ctx.moveTo(x + size / 2, y);
  ctx.lineTo(x + size, y + size);
  ctx.lineTo(x, y + size);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawTriangleDown(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, fill: string): void {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x + size / 2, y + size);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, fill: string): void {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size / 2;
  ctx.beginPath();
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawDiamond(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, fill: string): void {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size / 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r, cy);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - r, cy);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function drawLoyaltyShield(
  ctx: CanvasRenderingContext2D,
  loyalty: string,
  x: number,
  y: number,
  width: number,
  height: number,
  outlineColor: string,
): void {
  ctx.save();
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width, y + height * 0.7);
  ctx.lineTo(x + width / 2, y + height);
  ctx.lineTo(x, y + height * 0.7);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.fillStyle = '#efefef';
  ctx.font = `bold ${Math.round(height * 0.55)}px belerenbsc, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(loyalty, x + width / 2, y + height / 2);
  ctx.restore();
}
