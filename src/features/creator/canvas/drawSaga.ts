import { drawRichText } from '@/features/creator/canvas/drawRichText';
import { toRomanNumeral, type SagaAbilityRow } from '@/services/saga';

export interface DrawSagaOptions {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly outlineColor: string;
  readonly textColor: string;
}

export function drawSagaAbilities(
  ctx: CanvasRenderingContext2D,
  rows: readonly SagaAbilityRow[],
  options: DrawSagaOptions,
): void {
  if (rows.length === 0) return;
  const rowHeight = Math.floor(options.height / rows.length);
  const badgeRadius = Math.min(54, Math.floor(rowHeight * 0.32));
  const badgeColumnWidth = badgeRadius * 2 + 32;

  ctx.save();
  let stepCursor = 1;
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    if (!row) continue;
    const rowY = options.y + i * rowHeight;

    const numerals: string[] = [];
    for (let s = 0; s < row.steps; s += 1) {
      numerals.push(toRomanNumeral(stepCursor + s));
    }
    stepCursor += row.steps;
    const combinedNumeral = numerals.join(', ');

    const badgeCx = options.x + 12 + badgeRadius;
    const badgeCy = rowY + rowHeight / 2;
    ctx.beginPath();
    ctx.arc(badgeCx, badgeCy, badgeRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#1d1d1d';
    ctx.fill();
    ctx.strokeStyle = options.outlineColor;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.fillStyle = '#efefef';
    ctx.font = `bold ${Math.round(badgeRadius * 0.85)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(combinedNumeral, badgeCx, badgeCy + 2);

    drawRichText(
      ctx,
      row.ability,
      options.x + badgeColumnWidth,
      rowY + 16,
      options.width - badgeColumnWidth - 16,
      {
        font: '40px system-ui, sans-serif',
        color: options.textColor,
        lineHeight: 48,
        symbolDiameter: 32,
      },
    );

    if (i < rows.length - 1) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(options.x + 12, rowY + rowHeight);
      ctx.lineTo(options.x + options.width - 12, rowY + rowHeight);
      ctx.stroke();
    }
  }
  ctx.restore();
}
