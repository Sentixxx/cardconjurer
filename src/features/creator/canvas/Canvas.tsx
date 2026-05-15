import { useEffect, useRef, type JSX } from 'react';
import { drawCard } from '@/features/creator/canvas/drawCard';
import type { CardData } from '@/types/cardData';

export interface CanvasProps {
  readonly card: CardData;
  readonly artImage?: HTMLImageElement | null;
  readonly frameImage?: HTMLImageElement | null;
  readonly displayWidth?: number;
}

export function Canvas({ card, artImage = null, frameImage = null, displayWidth = 360 }: CanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawCard(ctx, card, { art: artImage, frame: frameImage });
  }, [card, artImage, frameImage]);

  const aspect = card.height / card.width;
  return (
    <canvas
      ref={canvasRef}
      width={card.width}
      height={card.height}
      style={{
        width: `${displayWidth}px`,
        height: `${Math.round(displayWidth * aspect)}px`,
        background: '#000',
        display: 'block',
      }}
    />
  );
}
