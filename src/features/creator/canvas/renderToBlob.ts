import { drawCard, type DrawCardLayers } from '@/features/creator/canvas/drawCard';
import type { CardData } from '@/types/cardData';

export function renderCardToBlob(
  card: CardData,
  layers: DrawCardLayers = {},
  mime = 'image/png',
  quality?: number,
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
