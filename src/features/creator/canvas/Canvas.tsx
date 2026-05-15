import { useEffect, useRef, useState, type JSX, type PointerEvent } from 'react';
import { drawCard, type DrawFrameLayer } from '@/features/creator/canvas/drawCard';
import type { CardData } from '@/types/cardData';

export type CanvasDragTarget =
  | 'art'
  | 'setSymbol'
  | 'watermark'
  | { readonly kind: 'frameLayer'; readonly index: number };

export interface CanvasTransformDelta {
  readonly offsetX?: number;
  readonly offsetY?: number;
  readonly scaleDelta?: number;
  readonly rotationDelta?: number;
}

export interface CanvasProps {
  readonly card: CardData;
  readonly artImage?: HTMLImageElement | null;
  readonly frameImage?: HTMLImageElement | null;
  readonly frameLayers?: readonly DrawFrameLayer[];
  readonly setSymbolImage?: HTMLImageElement | null;
  readonly watermarkImage?: HTMLImageElement | null;
  readonly displayWidth?: number;
  readonly showGuidelines?: boolean;
  readonly showTransparency?: boolean;
  readonly dragTarget?: CanvasDragTarget;
  readonly onTransformDelta?: (target: CanvasDragTarget, delta: CanvasTransformDelta) => void;
}

export function Canvas({
  card,
  artImage = null,
  frameImage = null,
  frameLayers = [],
  setSymbolImage = null,
  watermarkImage = null,
  displayWidth = 360,
  showGuidelines = false,
  showTransparency = false,
  dragTarget,
  onTransformDelta,
}: CanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragRef = useRef<{ pointerId: number; lastX: number; lastY: number } | null>(null);
  const canDrag = dragTarget !== undefined && onTransformDelta !== undefined;
  const [fontReadyTick, setFontReadyTick] = useState(0);
  const [assetReadyTick, setAssetReadyTick] = useState(0);

  useEffect(() => {
    let isMounted = true;
    void document.fonts?.ready.then(() => {
      if (isMounted) setFontReadyTick((tick) => tick + 1);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const onAssetLoaded = (): void => setAssetReadyTick((tick) => tick + 1);
    window.addEventListener('cardforger:asset-loaded', onAssetLoaded);
    return () => window.removeEventListener('cardforger:asset-loaded', onAssetLoaded);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawCard(ctx, card, {
      art: artImage,
      frame: frameImage,
      frameLayers,
      setSymbol: setSymbolImage,
      watermark: watermarkImage,
      showGuidelines,
      showTransparency,
    });
    drawFrameLayerEditOverlay(ctx, card, frameLayers, dragTarget);
  }, [
    assetReadyTick,
    card,
    artImage,
    dragTarget,
    frameImage,
    frameLayers,
    fontReadyTick,
    setSymbolImage,
    showGuidelines,
    showTransparency,
    watermarkImage,
  ]);

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>): void => {
    if (!canDrag) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastY: event.clientY,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>): void => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !dragTarget || !onTransformDelta) return;

    const deltaX = event.clientX - drag.lastX;
    const deltaY = event.clientY - drag.lastY;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    if (deltaX === 0 && deltaY === 0) return;

    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const scaleX = rect.width > 0 ? event.currentTarget.width / rect.width : 1;
    const scaleY = rect.height > 0 ? event.currentTarget.height / rect.height : 1;
    const offsetX = deltaX * scaleX;
    const offsetY = deltaY * scaleY;

    if (event.shiftKey) {
      onTransformDelta(dragTarget, { scaleDelta: -offsetY / 240 });
    } else if (dragTarget === 'art' && (event.ctrlKey || event.metaKey)) {
      onTransformDelta(dragTarget, { rotationDelta: offsetX / 4 });
    } else {
      onTransformDelta(dragTarget, { offsetX, offsetY });
    }
  };

  const onPointerEnd = (event: PointerEvent<HTMLCanvasElement>): void => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      width={card.width}
      height={card.height}
      className="creator-canvas box-shadow"
      style={{
        width: `min(100%, ${displayWidth}px)`,
        aspectRatio: `${card.width} / ${card.height}`,
        height: 'auto',
        background: showTransparency
          ? 'linear-gradient(45deg, #777 25%, transparent 25%), linear-gradient(-45deg, #777 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #777 75%), linear-gradient(-45deg, transparent 75%, #777 75%)'
          : 'var(--site-background)',
        backgroundColor: showTransparency ? '#444' : undefined,
        backgroundPosition: showTransparency ? '0 0, 0 12px, 12px -12px, -12px 0' : undefined,
        backgroundSize: showTransparency ? '24px 24px' : undefined,
        display: 'block',
        touchAction: canDrag ? 'none' : undefined,
        cursor: canDrag ? 'grab' : undefined,
        userSelect: canDrag ? 'none' : undefined,
      }}
      title={canDrag ? getDragTitle(dragTarget) : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    />
  );
}

function getDragTitle(target: CanvasDragTarget | undefined): string {
  if (isFrameLayerDragTarget(target)) return '拖动移动当前牌框图层；Shift 缩放';
  if (target === 'setSymbol') return '拖动移动系列图标；Shift 缩放';
  if (target === 'watermark') return '拖动移动水印；Shift 缩放';
  return '拖动移动卡图；Shift 缩放；Ctrl/⌘ 旋转';
}

function isFrameLayerDragTarget(target: CanvasDragTarget | undefined): target is { readonly kind: 'frameLayer'; readonly index: number } {
  return typeof target === 'object' && target !== null && target.kind === 'frameLayer';
}

function drawFrameLayerEditOverlay(
  ctx: CanvasRenderingContext2D,
  card: CardData,
  frameLayers: readonly DrawFrameLayer[],
  target: CanvasDragTarget | undefined,
): void {
  if (!isFrameLayerDragTarget(target)) return;
  const layer = frameLayers[target.index];
  if (!layer) return;

  const bounds = layer.bounds ?? { x: 0, y: 0, width: 1, height: 1 };
  const rect = {
    x: bounds.x * card.width,
    y: bounds.y * card.height,
    width: bounds.width * card.width,
    height: bounds.height * card.height,
  };
  const lineWidth = Math.max(4, card.width * 0.003);
  const handleSize = Math.max(18, card.width * 0.014);

  ctx.save();
  ctx.setLineDash([lineWidth * 3, lineWidth * 2]);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = '#34d4ff';
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(52, 212, 255, 0.72)';
  ctx.fillRect(rect.x - handleSize / 2, rect.y - handleSize / 2, handleSize, handleSize);
  ctx.fillRect(rect.x + rect.width - handleSize / 2, rect.y - handleSize / 2, handleSize, handleSize);
  ctx.fillRect(rect.x - handleSize / 2, rect.y + rect.height - handleSize / 2, handleSize, handleSize);
  ctx.fillRect(rect.x + rect.width - handleSize / 2, rect.y + rect.height - handleSize / 2, handleSize, handleSize);
  ctx.restore();
}
