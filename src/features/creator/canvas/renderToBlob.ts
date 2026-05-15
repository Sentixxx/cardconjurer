import { drawCard, type DrawCardLayers } from '@/features/creator/canvas/drawCard';
import type { CardData } from '@/types/cardData';

export interface RenderCardToBlobOptions {
  readonly roundedCorners?: boolean;
}

export function renderCardToBlob(
  card: CardData,
  layers: DrawCardLayers = {},
  mime = 'image/png',
  quality?: number,
  options: RenderCardToBlobOptions = {},
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('renderCardToBlob requires a DOM environment'));
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = card.width;
    canvas.height = card.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not acquire 2D context for offscreen canvas'));
      return;
    }
    drawCard(ctx, card, layers);
    if (options.roundedCorners) {
      cutRoundedCardCorners(ctx, card.width, card.height);
    }
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('canvas.toBlob returned null'));
        }
      },
      mime,
      quality,
    );
  });
}

function cutRoundedCardCorners(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const radius = Math.max(1, Math.round(width * (59 / 1500)));
  ctx.save();
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(width - radius, 0);
  ctx.quadraticCurveTo(width, 0, width, radius);
  ctx.lineTo(width, height - radius);
  ctx.quadraticCurveTo(width, height, width - radius, height);
  ctx.lineTo(radius, height);
  ctx.quadraticCurveTo(0, height, 0, height - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
