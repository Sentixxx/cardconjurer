import { drawManaSymbolRow } from '@/features/creator/canvas/drawManaSymbols';
import { drawLoyaltyShield, drawPlaneswalkerAbilities } from '@/features/creator/canvas/drawPlaneswalker';
import { drawRichText } from '@/features/creator/canvas/drawRichText';
import { drawSagaAbilities } from '@/features/creator/canvas/drawSaga';
import { parseManaCost } from '@/services/manaSymbols';
import { parsePlaneswalkerAbilities } from '@/services/planeswalker';
import { parseSagaAbilities } from '@/services/saga';
import { FRAME_COLOR_OUTLINES, RARITY_COLORS, type CardData, type Rarity } from '@/types/cardData';

export interface DrawCardLayers {
  readonly art?: HTMLImageElement | null;
  readonly frame?: HTMLImageElement | null;
}

export function drawCard(ctx: CanvasRenderingContext2D, card: CardData, layers: DrawCardLayers = {}): void {
  ctx.save();
  ctx.fillStyle = '#1d1d1d';
  ctx.fillRect(0, 0, card.width, card.height);

  if (layers.frame) {
    ctx.drawImage(layers.frame, 0, 0, card.width, card.height);
  }

  if (isLegendaryType(card.typeLine)) {
    drawLegendaryCrown(ctx, card);
  }

  const inset = 60;
  const artRegion = {
    x: inset + 80,
    y: inset + 280,
    w: card.width - (inset + 80) * 2,
    h: Math.round((card.width - (inset + 80) * 2) * 0.78),
  };

  if (layers.art) {
    ctx.fillStyle = '#000';
    ctx.fillRect(artRegion.x, artRegion.y, artRegion.w, artRegion.h);
    drawImageCover(ctx, layers.art, artRegion.x, artRegion.y, artRegion.w, artRegion.h);
  } else if (!layers.frame) {
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(artRegion.x, artRegion.y, artRegion.w, artRegion.h);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 4;
    ctx.strokeRect(artRegion.x, artRegion.y, artRegion.w, artRegion.h);
  }

  const outlineColor = FRAME_COLOR_OUTLINES[card.frameColor ?? 'M'];
  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = 16;
  ctx.strokeRect(inset, inset, card.width - inset * 2, card.height - inset * 2);

  ctx.fillStyle = '#efefef';
  ctx.font = 'bold 96px system-ui, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText(card.name, inset + 40, inset + 40);

  if (card.manaCost) {
    const symbols = parseManaCost(card.manaCost);
    drawManaSymbolRow(ctx, symbols, card.width - inset - 40, inset + 60, {
      anchor: 'right',
      diameter: 70,
      gap: 8,
    });
  }

  ctx.font = '56px system-ui, sans-serif';
  ctx.fillStyle = '#cccccc';
  ctx.fillText(card.typeLine, inset + 40, inset + 180);

  if (card.setCode || card.rarity) {
    drawSetSymbol(ctx, card.setCode ?? '', card.rarity ?? 'C', card.width - inset - 40, inset + 180);
  }

  const rulesRegion = {
    x: inset + 80,
    y: artRegion.y + artRegion.h + 60,
    w: card.width - (inset + 80) * 2,
    h: card.height - (artRegion.y + artRegion.h + 60) - inset - 140,
  };
  ctx.fillStyle = '#222';
  ctx.fillRect(rulesRegion.x, rulesRegion.y, rulesRegion.w, rulesRegion.h);
  const outlineForRules = FRAME_COLOR_OUTLINES[card.frameColor ?? 'M'];
  if (card.layout === 'planeswalker') {
    const abilities = parsePlaneswalkerAbilities(card.rulesText);
    drawPlaneswalkerAbilities(ctx, abilities, {
      x: rulesRegion.x,
      y: rulesRegion.y,
      width: rulesRegion.w,
      height: rulesRegion.h,
      textColor: '#efefef',
    });
  } else if (card.layout === 'saga') {
    const rows = parseSagaAbilities(card.rulesText);
    drawSagaAbilities(ctx, rows, {
      x: rulesRegion.x,
      y: rulesRegion.y,
      width: rulesRegion.w,
      height: rulesRegion.h,
      outlineColor: outlineForRules,
      textColor: '#efefef',
    });
  } else {
    if (card.rulesText) {
      drawRichText(ctx, card.rulesText, rulesRegion.x + 24, rulesRegion.y + 24, rulesRegion.w - 48, {
        font: '44px system-ui, sans-serif',
        color: '#efefef',
        lineHeight: 54,
        symbolDiameter: 38,
      });
    }
    if (card.flavorText) {
      const flavorY = rulesRegion.y + Math.max(rulesRegion.h - 200, rulesRegion.h * 0.55);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rulesRegion.x + 60, flavorY);
      ctx.lineTo(rulesRegion.x + rulesRegion.w - 60, flavorY);
      ctx.stroke();
      drawRichText(ctx, card.flavorText, rulesRegion.x + 24, flavorY + 18, rulesRegion.w - 48, {
        font: 'italic 40px system-ui, sans-serif',
        color: '#c9c2b4',
        lineHeight: 48,
        symbolDiameter: 32,
      });
    }
  }

  drawCollectorInfo(ctx, card, inset);

  if (card.layout === 'planeswalker' && card.loyalty) {
    const shieldWidth = 180;
    const shieldHeight = 200;
    const shieldX = card.width - inset - 80 - shieldWidth;
    const shieldY = card.height - inset - 60 - shieldHeight;
    drawLoyaltyShield(ctx, card.loyalty, shieldX, shieldY, shieldWidth, shieldHeight, outlineColor);
  }

  const layout = card.layout ?? 'standard';
  if (card.powerToughness && layout === 'standard') {
    const boxWidth = 280;
    const boxHeight = 110;
    const boxX = card.width - inset - 80 - boxWidth;
    const boxY = card.height - inset - 60 - boxHeight;
    ctx.fillStyle = '#111';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    ctx.fillStyle = '#efefef';
    ctx.font = 'bold 72px system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(card.powerToughness, boxX + boxWidth / 2, boxY + boxHeight / 2);
    ctx.textAlign = 'start';
    ctx.textBaseline = 'top';
  }

  ctx.restore();
}


function isLegendaryType(typeLine: string): boolean {
  return /\blegendary\b/i.test(typeLine);
}

function drawLegendaryCrown(ctx: CanvasRenderingContext2D, card: CardData): void {
  ctx.save();
  const gradient = ctx.createLinearGradient(0, 0, card.width, 0);
  gradient.addColorStop(0, '#7a5b1a');
  gradient.addColorStop(0.18, '#caa45d');
  gradient.addColorStop(0.5, '#f1d28a');
  gradient.addColorStop(0.82, '#caa45d');
  gradient.addColorStop(1, '#7a5b1a');
  const bandHeight = 38;
  const inset = 60;
  ctx.fillStyle = gradient;
  ctx.fillRect(inset, inset - 12, card.width - inset * 2, bandHeight);
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 3;
  ctx.strokeRect(inset, inset - 12, card.width - inset * 2, bandHeight);
  ctx.restore();
}

function drawCollectorInfo(ctx: CanvasRenderingContext2D, card: CardData, inset: number): void {
  ctx.save();
  ctx.font = '32px system-ui, sans-serif';
  ctx.fillStyle = '#9a9486';
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'start';
  const year = new Date().getFullYear();
  const left = compactJoin([card.setCode, card.cardNumber], ' · ');
  if (left) ctx.fillText(left, inset + 40, card.height - inset - 32);
  const right = compactJoin([
    card.artist ? `Illus. ${card.artist}` : null,
    `© ${year} Card Forger`,
  ], ' — ');
  if (right) {
    ctx.textAlign = 'end';
    ctx.fillText(right, card.width - inset - 40, card.height - inset - 32);
  }
  ctx.restore();
}

function compactJoin(parts: ReadonlyArray<string | null | undefined>, sep: string): string {
  return parts.filter((p): p is string => Boolean(p && p.trim())).join(sep);
}

function drawSetSymbol(
  ctx: CanvasRenderingContext2D,
  setCode: string,
  rarity: Rarity,
  rightX: number,
  topY: number,
): void {
  const { fill, text } = RARITY_COLORS[rarity];
  const label = (setCode || rarity).slice(0, 5).toUpperCase();
  const padX = 18;
  const height = 56;
  ctx.save();
  ctx.font = 'bold 36px system-ui, sans-serif';
  const labelWidth = Math.ceil(ctx.measureText(label).width);
  const width = labelWidth + padX * 2;
  const x = rightX - width;
  const y = topY;
  const radius = height / 2;

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = text;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + width / 2, y + height / 2 + 2);
  ctx.restore();
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  const targetAspect = w / h;
  const sourceAspect = image.naturalWidth / image.naturalHeight;
  let sx = 0;
  let sy = 0;
  let sw = image.naturalWidth;
  let sh = image.naturalHeight;
  if (sourceAspect > targetAspect) {
    sw = image.naturalHeight * targetAspect;
    sx = (image.naturalWidth - sw) / 2;
  } else if (sourceAspect < targetAspect) {
    sh = image.naturalWidth / targetAspect;
    sy = (image.naturalHeight - sh) / 2;
  }
  ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
}
