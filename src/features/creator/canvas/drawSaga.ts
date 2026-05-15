import { drawRichText } from '@/features/creator/canvas/drawRichText';
import { toRomanNumeral, type SagaAbilityRow } from '@/services/saga';

export interface DrawSagaOptions {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly outlineColor: string;
  readonly textColor: string;
  readonly rowHeights?: readonly number[];
}

export function drawSagaAbilities(
  ctx: CanvasRenderingContext2D,
  rows: readonly SagaAbilityRow[],
  options: DrawSagaOptions,
): void {
  if (rows.length === 0) return;
  const rowHeights = resolveRowHeights(rows.length, options.height, options.rowHeights);
  const maxRowHeight = Math.max(...rowHeights);
  const badgeRadius = Math.min(54, Math.floor(maxRowHeight * 0.32));
  const badgeColumnWidth = badgeRadius * 2 + 32;

  ctx.save();
  let stepCursor = 1;
  let rowY = options.y;
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    if (!row) continue;
    const rowHeight = rowHeights[i] ?? 0;
    if (rowHeight <= 0) continue;

    const numerals: string[] = [];
    for (let s = 0; s < row.steps; s += 1) {
      numerals.push(toRomanNumeral(stepCursor + s));
    }
    stepCursor += row.steps;
    const badgeCx = options.x + 12 + badgeRadius;
    const badgeCy = rowY + rowHeight / 2;
    const badgeSpacing = Math.min(rowHeight * 0.42, badgeRadius * 2.35);
    const centerOffset = (numerals.length - 1) / 2;
    for (let n = 0; n < numerals.length; n += 1) {
      const numeral = numerals[n];
      if (!numeral) continue;
      const numeralY = badgeCy + (n - centerOffset) * badgeSpacing;
      ctx.beginPath();
      ctx.arc(badgeCx, numeralY, badgeRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#ece8df';
      ctx.fill();
      ctx.strokeStyle = options.outlineColor;
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.fillStyle = '#1d1d1d';
      ctx.font = `bold ${Math.round(badgeRadius * 0.85)}px belerenbsc, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(numeral, badgeCx, numeralY + 2);
    }

    drawRichText(
      ctx,
      row.ability,
      options.x + badgeColumnWidth,
      rowY + 16,
      options.width - badgeColumnWidth - 16,
      {
        font: '40px mplantin, Georgia, serif',
        color: options.textColor,
        lineHeight: 48,
        symbolDiameter: 32,
      },
    );

    if (i < rows.length - 1) {
      ctx.strokeStyle = options.outlineColor;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(options.x + 12, rowY + rowHeight);
      ctx.lineTo(options.x + options.width - 12, rowY + rowHeight);
      ctx.stroke();
      ctx.globalAlpha = 1;
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
