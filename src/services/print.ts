import { loadImage } from '@/services/assets';
import type { PrintConfig, PrintSheetLayout } from '@/types/print';

export const CUTTING_GUIDES_URL = '/data/print/cuttingGuides.svg';

const AID_WIDTH = 2;
const AID_OFFSET = AID_WIDTH / 2;

export function computeLayout(config: PrintConfig): PrintSheetLayout {
  const cellWidth = config.cardWidth + 2 * config.cardPadding + config.cardMargin;
  const cellHeight = config.cardHeight + 2 * config.cardPadding + config.cardMargin;
  const cardsX = Math.max(0, Math.floor(config.paper[0] / (cellWidth / config.ppi)));
  const cardsY = Math.max(0, Math.floor(config.paper[1] / (cellHeight / config.ppi)));
  const pageMarginX = Math.floor((config.paper[0] * config.ppi - cardsX * cellWidth) / 2);
  const pageMarginY = Math.floor((config.paper[1] * config.ppi - cardsY * cellHeight) / 2);
  return { cellWidth, cellHeight, cardsX, cardsY, pageMarginX, pageMarginY };
}

export interface RenderPrintSheetInput {
  readonly config: PrintConfig;
  readonly images: readonly HTMLImageElement[];
}

export async function renderPrintSheet(
  canvas: HTMLCanvasElement,
  input: RenderPrintSheetInput,
): Promise<void> {
  const { config, images } = input;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not acquire 2D context for print canvas');

  canvas.width = Math.round(config.paper[0] * config.ppi);
  canvas.height = Math.round(config.paper[1] * config.ppi);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const layout = computeLayout(config);
  const cuttingGuides = config.useCuttingAids ? await loadImage(CUTTING_GUIDES_URL) : null;

  if (config.useCuttingAids) {
    ctx.fillStyle = '#000';
    for (let i = 0; i < layout.cardsX; i += 1) {
      const x = layout.pageMarginX + i * layout.cellWidth + Math.floor(config.cardMargin / 2) + config.cardPadding - AID_OFFSET;
      ctx.fillRect(x, 0, AID_WIDTH, canvas.height);
      ctx.fillRect(x + config.cardWidth, 0, AID_WIDTH, canvas.height);
    }
    for (let j = 0; j < layout.cardsY; j += 1) {
      const y = layout.pageMarginY + j * layout.cellHeight + Math.floor(config.cardMargin / 2) + config.cardPadding - AID_OFFSET;
      ctx.fillRect(0, y, canvas.width, AID_WIDTH);
      ctx.fillRect(0, y + config.cardHeight, canvas.width, AID_WIDTH);
    }
  }

  const maxCards = layout.cardsX * layout.cardsY;
  let count = 0;
  for (let i = images.length - 1; i >= 0 && count < maxCards; i -= 1) {
    const image = images[i];
    if (!image || image.naturalWidth < 2) continue;
    const x = layout.pageMarginX + (count % layout.cardsX) * layout.cellWidth + Math.floor(config.cardMargin / 2) + config.cardPadding;
    const y = layout.pageMarginY + Math.floor(count / layout.cardsX) * layout.cellHeight + Math.floor(config.cardMargin / 2) + config.cardPadding;
    if (config.imgIncludesBleedEdge) {
      ctx.drawImage(image, x - config.cardPadding, y - config.cardPadding, config.cardWidth + 2 * config.cardPadding, config.cardHeight + 2 * config.cardPadding);
    } else {
      ctx.fillStyle = config.bleedEdgeColor;
      ctx.fillRect(x - config.cardPadding, y - config.cardPadding, config.cardWidth + 2 * config.cardPadding, config.cardHeight + 2 * config.cardPadding);
      ctx.drawImage(image, x, y, config.cardWidth, config.cardHeight);
    }
    if (cuttingGuides) {
      ctx.drawImage(cuttingGuides, x, y, config.cardWidth, config.cardHeight);
    }
    count += 1;
  }
}
