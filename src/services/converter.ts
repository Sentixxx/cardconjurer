import { loadImage } from '@/services/assets';

export const CONVERTER_MASK_URL = '/converter/card.png';
export const CONVERTER_WIZARDS_URL = '/converter/wizards.png';

const TARGET_WIDTH = 1500;
const TARGET_HEIGHT = 2100;

export interface ConvertResult {
  readonly blob: Blob;
  readonly versionRecognized: boolean;
}

interface WizardsPlacement {
  readonly y: number;
  readonly recognized: boolean;
}

function pickWizardsPlacement(ctx: CanvasRenderingContext2D): WizardsPlacement {
  const isWhite = (x: number, y: number): boolean => {
    const data = ctx.getImageData(x, y, 1, 1).data;
    return data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255;
  };
  if (isWhite(1342, 2026)) return { y: 1973, recognized: true };
  if (isWhite(1342, 2020)) return { y: 1967, recognized: true };
  if (isWhite(1342, 2062)) return { y: 2009, recognized: true };
  if (isWhite(1342, 2056)) return { y: 2003, recognized: true };
  return { y: 2009, recognized: false };
}

export async function convertCardImage(sourceUrl: string): Promise<ConvertResult> {
  if (typeof document === 'undefined') {
    throw new Error('convertCardImage requires a DOM environment');
  }
  const [source, mask, wizards] = await Promise.all([
    loadImage(sourceUrl),
    loadImage(CONVERTER_MASK_URL),
    loadImage(CONVERTER_WIZARDS_URL),
  ]);
  const canvas = document.createElement('canvas');
  canvas.width = TARGET_WIDTH;
  canvas.height = TARGET_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not acquire 2D context for converter canvas');
  }
  ctx.drawImage(source, -66, -60, 1632, 2220);
  const placement = pickWizardsPlacement(ctx);
  ctx.drawImage(wizards, 895, placement.y, 509, 25);
  ctx.globalCompositeOperation = 'destination-atop';
  ctx.drawImage(mask, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error('canvas.toBlob returned null'))),
      'image/png',
    );
  });
  return { blob, versionRecognized: placement.recognized };
}
