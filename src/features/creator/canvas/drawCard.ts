import { drawManaCircle, drawManaSymbolRow } from '@/features/creator/canvas/drawManaSymbols';
import { drawLoyaltyShield, drawPlaneswalkerAbilities } from '@/features/creator/canvas/drawPlaneswalker';
import { drawFlavorDivider, drawRichText, resolveFlavorDividerColor } from '@/features/creator/canvas/drawRichText';
import { drawSagaAbilities } from '@/features/creator/canvas/drawSaga';
import { getFrameLayoutPreset } from '@/services/framePresets';
import { parseManaCost } from '@/services/manaSymbols';
import { parsePlaneswalkerAbilities, type PlaneswalkerAbility } from '@/services/planeswalker';
import { parseSagaAbilities, type SagaAbilityRow } from '@/services/saga';
import {
  FRAME_COLOR_OUTLINES,
  M15_SET_SYMBOL_BOUNDS,
  M15_WATERMARK_BOUNDS,
  RARITY_COLORS,
  type CardData,
  type CardRegionBounds,
  type CustomTextLayer,
  type PlaneswalkerSettings,
  type Rarity,
  type SagaSettings,
} from '@/types/cardData';

export interface DrawCardLayers {
  readonly art?: HTMLImageElement | null;
  readonly frame?: HTMLImageElement | null;
  readonly frameLayers?: readonly DrawFrameLayer[];
  readonly setSymbol?: HTMLImageElement | null;
  readonly watermark?: HTMLImageElement | null;
  readonly showGuidelines?: boolean;
  readonly showTransparency?: boolean;
}

export interface DrawFrameLayer {
  readonly image: HTMLImageElement | null;
  readonly maskImage?: HTMLImageElement | null;
  readonly maskImages?: readonly (HTMLImageElement | null)[];
  readonly bounds?: DrawFrameLayerBounds | null;
  readonly visible?: boolean;
  readonly opacity?: number;
  readonly erase?: boolean;
  readonly preserveAlpha?: boolean;
  readonly colorOverlayEnabled?: boolean;
  readonly colorOverlay?: string | null;
  readonly hslHue?: number;
  readonly hslSaturation?: number;
  readonly hslLightness?: number;
}

export interface DrawFrameLayerBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

const LEGACY_TITLE_FONT_RATIO = 0.0381;
const LEGACY_TYPE_FONT_RATIO = 0.0324;
const LEGACY_RULES_FONT_RATIO = 0.0362;
const LEGACY_PT_FONT_RATIO = 0.0372;

function applySagaSettings(rows: readonly SagaAbilityRow[], settings: SagaSettings | null | undefined): readonly SagaAbilityRow[] {
  return rows.slice(0, 4).map((row, index) => ({
    ...row,
    steps: positiveInteger(settings?.chapterCounts?.[index], row.steps),
  }));
}

function applyPlaneswalkerSettings(
  abilities: readonly PlaneswalkerAbility[],
  settings: PlaneswalkerSettings | null | undefined,
): readonly PlaneswalkerAbility[] {
  return abilities.slice(0, 4).map((ability, index) => ({
    ...ability,
    cost: settings?.costs?.[index] ?? ability.cost,
  }));
}

function ratiosToPixels(values: readonly number[] | undefined, cardHeight: number): readonly number[] | undefined {
  if (!values || values.length === 0) return undefined;
  return values.map((value) => (typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value * cardHeight) : 0));
}

function positiveInteger(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.round(value)) : fallback;
}

export function drawCard(ctx: CanvasRenderingContext2D, card: CardData, layers: DrawCardLayers = {}): void {
  ctx.save();
  if (isBlankWorkspace(card, layers)) {
    ctx.clearRect(0, 0, card.width, card.height);
    ctx.restore();
    return;
  }
  if (layers.showTransparency) {
    ctx.clearRect(0, 0, card.width, card.height);
  } else {
    ctx.fillStyle = '#1d1d1d';
    ctx.fillRect(0, 0, card.width, card.height);
  }
  const hasFrameArtwork = Boolean(layers.frame) || Boolean(layers.frameLayers?.some((layer) => layer.image && layer.visible !== false));

  if (isLegendaryType(card.typeLine)) {
    drawLegendaryCrown(ctx, card);
  }

  const inset = 60;
  const defaultArtWidth = card.width - (inset + 80) * 2;
  const defaultArtHeight = Math.round(defaultArtWidth * 0.78);
  const artRegion = resolveCardRegion(card, card.artBounds ?? null, {
    x: inset + 80,
    y: inset + 280,
    w: defaultArtWidth,
    h: defaultArtHeight,
  });
  const titleRegion = resolveCardRegion(card, card.titleBounds ?? null, {
    x: inset + 40,
    y: inset + 40,
    w: card.width - inset * 2 - 80,
    h: 110,
  });
  const manaRegion = resolveCardRegion(card, card.manaBounds ?? null, {
    x: 0,
    y: inset + 60,
    w: card.width - inset - 40,
    h: 70,
  });
  const typeRegion = resolveCardRegion(card, card.typeBounds ?? null, {
    x: inset + 40,
    y: inset + 180,
    w: card.width - inset * 2 - 220,
    h: 72,
  });
  const ptRegion = resolveCardRegion(card, card.powerToughnessBounds ?? null, {
    x: card.width - inset - 80 - 280,
    y: card.height - inset - 60 - 110,
    w: 280,
    h: 110,
  });
  const loyaltyRegion = resolveCardRegion(card, card.loyaltyBounds ?? null, {
    x: card.width - inset - 80 - 180,
    y: card.height - inset - 60 - 200,
    w: 180,
    h: 200,
  });

  if (layers.art) {
    ctx.fillStyle = '#000';
    ctx.fillRect(artRegion.x, artRegion.y, artRegion.w, artRegion.h);
    drawTransformedArt(ctx, layers.art, card, artRegion.x, artRegion.y, artRegion.w, artRegion.h);
  } else if (!layers.frame) {
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(artRegion.x, artRegion.y, artRegion.w, artRegion.h);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 4;
    ctx.strokeRect(artRegion.x, artRegion.y, artRegion.w, artRegion.h);
  }

  if (layers.frame) {
    ctx.drawImage(layers.frame, 0, 0, card.width, card.height);
  }
  if (layers.frameLayers) {
    for (const layer of [...layers.frameLayers].reverse()) {
      if (!layer.image || layer.visible === false) continue;
      drawFrameLayer(ctx, layer.image, getDrawFrameLayerMaskImages(layer), card.width, card.height, layer);
    }
  }

  const outlineColor = FRAME_COLOR_OUTLINES[card.frameColor ?? 'M'];
  const layoutPreset = getFrameLayoutPreset(card.frameVersionId);
  const presetTextColors = resolveTextColors(card, layoutPreset?.textColors);
  const presetTextAligns = layoutPreset?.textAligns;
  const showManaCost = layoutPreset?.showManaCost ?? true;
  const showTypeText = layoutPreset?.showTypeText ?? true;
  const showRulesText = layoutPreset?.showRulesText ?? true;
  const showPowerToughness = layoutPreset?.showPowerToughness ?? true;
  const defaultPrimaryTextColor = hasFrameArtwork ? '#1d1d1d' : '#efefef';
  const primaryTextColor = presetTextColors?.title ?? defaultPrimaryTextColor;
  const secondaryTextColor = presetTextColors?.type ?? (hasFrameArtwork ? '#1d1d1d' : '#cccccc');
  const rulesTextColor = presetTextColors?.rules ?? (hasFrameArtwork ? '#1d1d1d' : '#efefef');
  const flavorTextColor = presetTextColors?.flavor ?? (hasFrameArtwork ? '#4f4638' : '#c9c2b4');
  const powerToughnessTextColor = presetTextColors?.powerToughness ?? defaultPrimaryTextColor;
  const loyaltyTextColor = presetTextColors?.loyalty ?? defaultPrimaryTextColor;
  if (!hasFrameArtwork) {
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 16;
    ctx.strokeRect(inset, inset, card.width - inset * 2, card.height - inset * 2);
  }

  drawSingleLineText(ctx, card.name, titleRegion, {
    fontSize: card.height * LEGACY_TITLE_FONT_RATIO,
    color: primaryTextColor,
    align: presetTextAligns?.title,
    family: 'belerenb, system-ui, sans-serif',
  });

  if (card.manaCost && showManaCost) {
    const symbols = parseManaCost(card.manaCost);
    if (layoutPreset?.manaSymbolPositions) {
      const diameter = (layoutPreset.manaSymbolDiameter ?? 0.0467) * card.width;
      for (let index = 0; index < symbols.length && index < layoutPreset.manaSymbolPositions.length; index += 1) {
        const position = layoutPreset.manaSymbolPositions[index];
        drawManaCircle(ctx, symbols[index], position.x * card.width, position.y * card.height, diameter / 2);
      }
    } else {
      const diameter = Math.max(18, Math.min(70, manaRegion.h));
      drawManaSymbolRow(ctx, symbols, manaRegion.x + manaRegion.w, manaRegion.y + (manaRegion.h - diameter) / 2, {
        anchor: 'right',
        diameter,
        gap: Math.max(4, diameter * 0.11),
      });
    }
  }

  if (showTypeText) {
    drawSingleLineText(ctx, card.typeLine, typeRegion, {
      fontSize: card.height * LEGACY_TYPE_FONT_RATIO,
      color: secondaryTextColor,
      align: presetTextAligns?.type,
      family: 'belerenb, system-ui, sans-serif',
    });
  }

  const setSymbolRegion = resolveCardRegion(card, card.setSymbolBounds ?? M15_SET_SYMBOL_BOUNDS, {
    x: card.width - inset - 52 - 120,
    y: inset + 176 - 34,
    w: 120,
    h: 68,
  });
  let setSymbolGuideRegion = scaleCanvasRect(
    setSymbolRegion,
    Math.max(0.1, card.setSymbolScale ?? 1),
    card.setSymbolOffsetX ?? 0,
    card.setSymbolOffsetY ?? 0,
  );
  if (layers.setSymbol) {
    setSymbolGuideRegion = drawSetSymbolImage(ctx, layers.setSymbol, card, setSymbolRegion);
  } else if (card.setCode || card.rarity) {
    drawSetSymbol(
      ctx,
      card.setCode ?? '',
      card.rarity ?? 'C',
      setSymbolRegion.x + setSymbolRegion.w,
      setSymbolRegion.y + (setSymbolRegion.h - 56) / 2,
    );
    setSymbolGuideRegion = setSymbolRegion;
  }

  const rulesRegion = resolveCardRegion(card, card.rulesBounds ?? null, {
    x: inset + 80,
    y: artRegion.y + artRegion.h + 60,
    w: card.width - (inset + 80) * 2,
    h: card.height - (artRegion.y + artRegion.h + 60) - inset - 140,
  });
  if (!hasFrameArtwork) {
    ctx.fillStyle = '#222';
    ctx.fillRect(rulesRegion.x, rulesRegion.y, rulesRegion.w, rulesRegion.h);
  }
  const watermarkRegion = resolveCardRegion(card, card.watermarkBounds ?? M15_WATERMARK_BOUNDS, rulesRegion);
  let watermarkGuideRegion = scaleCanvasRect(
    watermarkRegion,
    Math.max(0.05, card.watermarkScale ?? 1),
    card.watermarkOffsetX ?? 0,
    card.watermarkOffsetY ?? 0,
  );
  if (layers.watermark) {
    watermarkGuideRegion = drawWatermark(ctx, layers.watermark, card, watermarkRegion);
  }
  const outlineForRules = FRAME_COLOR_OUTLINES[card.frameColor ?? 'M'];
  if (!showRulesText) {
    // Textless frames intentionally keep the lower art clear even when imported card data has rules text.
  } else if (card.layout === 'planeswalker') {
    const abilities = applyPlaneswalkerSettings(parsePlaneswalkerAbilities(card.rulesText), card.planeswalkerSettings);
    drawPlaneswalkerAbilities(ctx, abilities, {
      x: rulesRegion.x,
      y: rulesRegion.y,
      width: rulesRegion.w,
      height: rulesRegion.h,
      textColor: rulesTextColor,
      rowHeights: ratiosToPixels(card.planeswalkerSettings?.abilityHeights, card.height),
      costAdjustments: ratiosToPixels(card.planeswalkerSettings?.abilityAdjust, card.height),
      invertTextBoxes: card.planeswalkerSettings?.invertTextBoxes,
    });
  } else if (card.layout === 'saga') {
    const rows = applySagaSettings(parseSagaAbilities(card.rulesText), card.sagaSettings);
    drawSagaAbilities(ctx, rows, {
      x: rulesRegion.x,
      y: rulesRegion.y,
      width: rulesRegion.w,
      height: rulesRegion.h,
      outlineColor: outlineForRules,
      textColor: rulesTextColor,
      rowHeights: ratiosToPixels(card.sagaSettings?.abilityHeights, card.height),
    });
  } else {
    const textX = rulesRegion.x + 24;
    const textY = rulesRegion.y + 24;
    const textWidth = rulesRegion.w - 48;
    const rulesFontSize = card.height * LEGACY_RULES_FONT_RATIO;
    const rulesLineHeight = rulesFontSize * 1.14;
    const rulesSymbolDiameter = rulesFontSize * 0.9;
    const flavorDividerColor = resolveFlavorDividerColor(rulesTextColor);
    const flavorDividerHeight = card.height * 0.002;
    const flavorY = card.flavorText
      ? rulesRegion.y + Math.max(rulesRegion.h - 200, rulesRegion.h * 0.55)
      : null;
    const rulesMaxHeight = Math.max(1, (flavorY ?? rulesRegion.y + rulesRegion.h) - textY - 12);
    if (card.rulesText) {
      drawRichText(ctx, card.rulesText, textX, textY, textWidth, {
        font: `${rulesFontSize}px mplantin, Georgia, serif`,
        color: rulesTextColor,
        lineHeight: rulesLineHeight,
        symbolDiameter: rulesSymbolDiameter,
        maxHeight: rulesMaxHeight,
        dividerColor: flavorDividerColor,
        dividerHeight: flavorDividerHeight,
      });
    }
    if (card.flavorText && flavorY !== null) {
      const flavorTextY = flavorY + 18;
      drawFlavorDivider(ctx, textX, flavorY, textWidth, {
        color: flavorDividerColor,
        height: flavorDividerHeight,
        lineHeight: rulesLineHeight,
        verticalOffset: 0,
      });
      drawRichText(ctx, card.flavorText, textX, flavorTextY, textWidth, {
        font: `${rulesFontSize}px mplantini, Georgia, serif`,
        color: flavorTextColor,
        lineHeight: rulesLineHeight,
        symbolDiameter: rulesSymbolDiameter,
        maxHeight: Math.max(1, rulesRegion.y + rulesRegion.h - flavorTextY - 8),
        dividerColor: flavorDividerColor,
        dividerHeight: flavorDividerHeight,
      });
    }
  }

  if (layoutPreset?.adventureTitleBounds || layoutPreset?.adventureRulesBounds) {
    drawAdventureText(ctx, card, layoutPreset, rulesTextColor);
  }

  drawCollectorInfo(ctx, card, inset);

  if (card.layout === 'planeswalker' && card.loyalty) {
    if (card.loyaltyBounds) {
      drawSingleLineText(ctx, card.loyalty, loyaltyRegion, {
        weight: 'bold',
        maxFontSize: 72,
        color: loyaltyTextColor,
        align: 'center',
        family: 'belerenbsc, system-ui, sans-serif',
      });
    } else {
      drawLoyaltyShield(ctx, card.loyalty, loyaltyRegion.x, loyaltyRegion.y, loyaltyRegion.w, loyaltyRegion.h, outlineColor);
    }
  }

  const layout = card.layout ?? 'standard';
  if (card.powerToughness && layout !== 'planeswalker' && showPowerToughness) {
    if (!hasFrameArtwork) {
      ctx.fillStyle = '#111';
      ctx.fillRect(ptRegion.x, ptRegion.y, ptRegion.w, ptRegion.h);
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = 8;
      ctx.strokeRect(ptRegion.x, ptRegion.y, ptRegion.w, ptRegion.h);
    }
    drawSingleLineText(ctx, card.powerToughness, ptRegion, {
      fontSize: card.height * LEGACY_PT_FONT_RATIO,
      color: powerToughnessTextColor,
      align: presetTextAligns?.powerToughness ?? 'center',
      family: 'belerenbsc, system-ui, sans-serif',
    });
  }

  drawCustomTextLayers(ctx, card);

  if (layers.showGuidelines) {
    drawGuidelines(
      ctx,
      artRegion,
      manaRegion,
      titleRegion,
      typeRegion,
      rulesRegion,
      ptRegion,
      loyaltyRegion,
      setSymbolGuideRegion,
      watermarkGuideRegion,
    );
  }

  ctx.restore();
}

function isBlankWorkspace(card: CardData, layers: DrawCardLayers): boolean {
  if (layers.showGuidelines) return false;
  if (layers.art || layers.frame || layers.setSymbol || layers.watermark) return false;
  if (layers.frameLayers?.some((layer) => layer.image && layer.visible !== false)) return false;
  return ![
    card.name,
    card.typeLine,
    card.rulesText,
    card.manaCost,
    card.powerToughness,
    card.loyalty,
    card.flavorText,
    card.adventureName,
    card.adventureTypeLine,
    card.adventureRulesText,
    card.adventureManaCost,
    card.setCode,
    card.cardNumber,
    card.artist,
  ].some((value) => typeof value === 'string' && value.trim()) &&
    !(card.customTextLayers ?? []).some((layer) => layer.visible !== false && layer.text.trim());
}

function drawCustomTextLayers(ctx: CanvasRenderingContext2D, card: CardData): void {
  const layers = card.customTextLayers ?? [];
  if (layers.length === 0) return;
  for (const layer of layers) {
    if (!layer.text || layer.visible === false) continue;
    drawCustomTextLayer(ctx, card, layer);
  }
}

function drawCustomTextLayer(ctx: CanvasRenderingContext2D, card: CardData, layer: CustomTextLayer): void {
  const region = resolveCardRegion(card, layer.bounds, { x: 0, y: 0, w: 0, h: 0 });
  const fontSize = Math.max(8, (layer.fontSize ?? 0.028) * card.height);
  const family = layer.fontFamily?.trim() || 'mplantin, Georgia, serif';
  const style = layer.italic ? 'italic ' : '';
  const weight = layer.bold ? 'bold ' : '';
  const font = `${style}${weight}${fontSize}px ${family}`;
  const color = layer.color ?? '#1d1d1d';
  const align = layer.align ?? 'start';

  ctx.save();
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  if (layer.oneLine ?? true) {
    const x = align === 'center' ? region.x + region.w / 2 : align === 'end' || align === 'right' ? region.x + region.w : region.x;
    ctx.textBaseline = 'middle';
    ctx.fillText(layer.text, x, region.y + region.h / 2, Math.max(1, region.w));
  } else {
    ctx.textBaseline = 'top';
    drawRichText(ctx, layer.text, region.x, region.y, Math.max(1, region.w), {
      font,
      color,
      lineHeight: fontSize * 1.22,
      symbolDiameter: fontSize * 0.82,
      maxHeight: Math.max(1, region.h),
    });
  }
  ctx.restore();
}

function resolveTextColors(
  card: CardData,
  presetTextColors: NonNullable<ReturnType<typeof getFrameLayoutPreset>>['textColors'] | undefined,
) {
  if (card.frameVersionId !== 'modal') return presetTextColors;
  const frameUrl = card.frameUrl ?? '';
  const isBack = frameUrl.includes('/img/frames/modal/regular/back/');
  const isVehicle = /\/v\.png$/i.test(frameUrl);
  if (!isBack && !isVehicle) return presetTextColors;
  return {
    ...presetTextColors,
    title: isBack ? '#efefef' : presetTextColors?.title,
    type: isBack ? '#efefef' : presetTextColors?.type,
    powerToughness: '#efefef',
  };
}

interface CanvasRect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

function drawGuidelines(
  ctx: CanvasRenderingContext2D,
  artRegion: CanvasRect,
  manaRegion: CanvasRect,
  titleRegion: CanvasRect,
  typeRegion: CanvasRect,
  rulesRegion: CanvasRect,
  ptRegion: CanvasRect,
  loyaltyRegion: CanvasRect,
  setSymbolRegion: CanvasRect,
  watermarkRegion: CanvasRect,
): void {
  ctx.save();
  drawGuideRect(ctx, artRegion, '#49c6ff');
  drawGuideRect(ctx, manaRegion, '#c5a3ff');
  drawGuideRect(ctx, titleRegion, '#7dd36f');
  drawGuideRect(ctx, typeRegion, '#ff9f66');
  drawGuideRect(ctx, rulesRegion, '#f2f2f2');
  drawGuideRect(ctx, ptRegion, '#ff6f91');
  drawGuideRect(ctx, loyaltyRegion, '#bfe66a');
  drawGuideRect(ctx, setSymbolRegion, '#f0c64f');
  drawGuideRect(ctx, watermarkRegion, '#d98cff');
  ctx.restore();
}

function drawGuideRect(ctx: CanvasRenderingContext2D, rect: CanvasRect, color: string): void {
  ctx.save();
  ctx.setLineDash([18, 12]);
  ctx.lineWidth = 5;
  ctx.strokeStyle = color;
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
}

function resolveCardRegion(card: CardData, bounds: CardRegionBounds | null, fallback: CanvasRect): CanvasRect {
  if (!bounds) return fallback;
  return {
    x: bounds.x * card.width,
    y: bounds.y * card.height,
    w: bounds.width * card.width,
    h: bounds.height * card.height,
  };
}

function scaleCanvasRect(rect: CanvasRect, scale: number, offsetX = 0, offsetY = 0): CanvasRect {
  const w = rect.w * scale;
  const h = rect.h * scale;
  return {
    x: rect.x + (rect.w - w) / 2 + offsetX,
    y: rect.y + (rect.h - h) / 2 + offsetY,
    w,
    h,
  };
}

function fitImageInRect(image: HTMLImageElement, rect: CanvasRect): CanvasRect {
  const imageAspect = image.naturalWidth / image.naturalHeight;
  const rectAspect = rect.w / rect.h;
  let w = rect.w;
  let h = rect.h;
  if (imageAspect > rectAspect) {
    h = w / imageAspect;
  } else if (imageAspect < rectAspect) {
    w = h * imageAspect;
  }
  return {
    x: rect.x + (rect.w - w) / 2,
    y: rect.y + (rect.h - h) / 2,
    w,
    h,
  };
}

function drawAdventureText(
  ctx: CanvasRenderingContext2D,
  card: CardData,
  layoutPreset: NonNullable<ReturnType<typeof getFrameLayoutPreset>>,
  fallbackTextColor: string,
): void {
  const textColor = layoutPreset.textColors?.rules ?? fallbackTextColor;
  if (card.adventureName && layoutPreset.adventureTitleBounds) {
    const titleRegion = resolveCardRegion(card, layoutPreset.adventureTitleBounds, { x: 0, y: 0, w: 0, h: 0 });
    drawSingleLineText(ctx, card.adventureName, titleRegion, {
      maxFontSize: 42,
      color: '#efefef',
      family: 'belerenb, system-ui, sans-serif',
    });
  }

  if (card.adventureManaCost && layoutPreset.adventureManaBounds) {
    const manaRegion = resolveCardRegion(card, layoutPreset.adventureManaBounds, { x: 0, y: 0, w: 0, h: 0 });
    const symbols = parseManaCost(card.adventureManaCost);
    const diameter = Math.max(16, Math.min(60, manaRegion.h));
    drawManaSymbolRow(ctx, symbols, manaRegion.x + manaRegion.w, manaRegion.y + (manaRegion.h - diameter) / 2, {
      anchor: 'right',
      diameter,
      gap: Math.max(3, diameter * 0.1),
    });
  }

  if (card.adventureTypeLine && layoutPreset.adventureTypeBounds) {
    const typeRegion = resolveCardRegion(card, layoutPreset.adventureTypeBounds, { x: 0, y: 0, w: 0, h: 0 });
    drawSingleLineText(ctx, card.adventureTypeLine, typeRegion, {
      maxFontSize: 40,
      color: '#efefef',
      family: 'belerenb, system-ui, sans-serif',
    });
  }

  if (card.adventureRulesText && layoutPreset.adventureRulesBounds) {
    const rulesRegion = resolveCardRegion(card, layoutPreset.adventureRulesBounds, { x: 0, y: 0, w: 0, h: 0 });
    drawRichText(ctx, card.adventureRulesText, rulesRegion.x + 16, rulesRegion.y + 16, rulesRegion.w - 32, {
      font: '42px mplantin, Georgia, serif',
      color: textColor,
      lineHeight: 50,
      symbolDiameter: 34,
      maxHeight: Math.max(1, rulesRegion.h - 32),
    });
  }
}

function drawSingleLineText(
  ctx: CanvasRenderingContext2D,
  text: string,
  region: CanvasRect,
  options: {
    readonly weight?: 'normal' | 'bold';
    readonly fontSize?: number;
    readonly maxFontSize?: number;
    readonly color: string;
    readonly align?: CanvasTextAlign;
    readonly family?: string;
  },
): void {
  if (!text) return;
  const requestedFontSize = options.fontSize ?? Math.min(options.maxFontSize ?? Number.POSITIVE_INFINITY, region.h * 0.9);
  const fontSize = Math.max(16, requestedFontSize);
  const align = options.align ?? 'start';
  const x = align === 'center' ? region.x + region.w / 2 : align === 'end' || align === 'right' ? region.x + region.w : region.x;

  ctx.save();
  ctx.fillStyle = options.color;
  ctx.font = `${options.weight === 'bold' ? 'bold ' : ''}${fontSize}px ${options.family ?? 'system-ui, sans-serif'}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = align;
  ctx.fillText(text, x, region.y + region.h / 2, Math.max(1, region.w));
  ctx.restore();
}

function drawFrameLayer(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  maskImages: readonly HTMLImageElement[],
  width: number,
  height: number,
  layer: DrawFrameLayer,
): void {
  const opacity = clamp(layer.opacity ?? 1, 0, 1);
  if (opacity <= 0) return;

  const rect = resolveFrameLayerRect(width, height, layer.bounds ?? null);
  const layerCanvas = document.createElement('canvas');
  layerCanvas.width = width;
  layerCanvas.height = height;
  const layerCtx = layerCanvas.getContext('2d');
  if (!layerCtx) return;

  drawProcessedFrameImage(layerCtx, image, rect, layer);
  if (maskImages.length > 0) {
    layerCtx.globalCompositeOperation = 'destination-in';
    layerCtx.drawImage(createCombinedMaskCanvas(maskImages, width, height), 0, 0, width, height);
    layerCtx.globalCompositeOperation = 'source-over';
  }

  if (layer.preserveAlpha && !layer.erase && blendFrameLayerPreservingAlpha(ctx, layerCanvas, opacity)) {
    return;
  }

  ctx.save();
  ctx.globalAlpha = opacity;
  if (layer.erase) {
    ctx.globalCompositeOperation = 'destination-out';
  }
  ctx.drawImage(layerCanvas, 0, 0, width, height);
  ctx.restore();
}

function getDrawFrameLayerMaskImages(layer: DrawFrameLayer): readonly HTMLImageElement[] {
  const maskImages = layer.maskImages ?? (layer.maskImage ? [layer.maskImage] : []);
  return maskImages.filter((maskImage): maskImage is HTMLImageElement => Boolean(maskImage));
}

function createCombinedMaskCanvas(maskImages: readonly HTMLImageElement[], width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  for (const maskImage of maskImages) {
    ctx.drawImage(maskImage, 0, 0, width, height);
  }
  return canvas;
}

function drawProcessedFrameImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  rect: CanvasRect,
  layer: DrawFrameLayer,
): void {
  ctx.save();
  ctx.filter = buildFrameLayerFilter(layer);
  ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h);
  ctx.filter = 'none';
  if (layer.colorOverlayEnabled && isCssHexColor(layer.colorOverlay ?? '')) {
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = layer.colorOverlay ?? '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
  ctx.restore();
}

function buildFrameLayerFilter(layer: DrawFrameLayer): string {
  const hue = clamp(layer.hslHue ?? 0, -180, 180);
  const saturation = clamp(100 + (layer.hslSaturation ?? 0), 0, 300);
  const lightness = clamp(100 + (layer.hslLightness ?? 0), 0, 300);
  if (hue === 0 && saturation === 100 && lightness === 100) return 'none';
  return `hue-rotate(${hue}deg) saturate(${saturation}%) brightness(${lightness}%)`;
}

function blendFrameLayerPreservingAlpha(
  ctx: CanvasRenderingContext2D,
  layerCanvas: HTMLCanvasElement,
  opacity: number,
): boolean {
  try {
    const width = layerCanvas.width;
    const height = layerCanvas.height;
    const baseData = ctx.getImageData(0, 0, width, height);
    const layerCtx = layerCanvas.getContext('2d');
    if (!layerCtx) return false;
    const layerPixels = layerCtx.getImageData(0, 0, width, height).data;
    const basePixels = baseData.data;
    for (let i = 0; i < basePixels.length; i += 4) {
      const alpha = (layerPixels[i + 3] / 255) * opacity;
      if (alpha <= 0) continue;
      basePixels[i] = basePixels[i] * (1 - alpha) + layerPixels[i] * alpha;
      basePixels[i + 1] = basePixels[i + 1] * (1 - alpha) + layerPixels[i + 1] * alpha;
      basePixels[i + 2] = basePixels[i + 2] * (1 - alpha) + layerPixels[i + 2] * alpha;
    }
    ctx.putImageData(baseData, 0, 0);
    return true;
  } catch {
    return false;
  }
}

function isCssHexColor(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function resolveFrameLayerRect(width: number, height: number, bounds: DrawFrameLayerBounds | null): CanvasRect {
  if (!bounds) return { x: 0, y: 0, w: width, h: height };
  return {
    x: bounds.x * width,
    y: bounds.y * height,
    w: bounds.width * width,
    h: bounds.height * height,
  };
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

// 等价于上游 setBottomInfoStyle (creator-23.js:245–270) 的 6 个 text object：
// midLeft / topLeft / note / bottomLeft / wizards / bottomRight。
// 相对坐标体系：x=0.0647 (xLeft), x+width=0.9354 (xRight)，主字号 0.0171，
// 小字号 0.0143，wizards 0.0162。色按 frame 受控（黑卡边白文 / 白卡边黑文）。
function drawCollectorInfo(ctx: CanvasRenderingContext2D, card: CardData, _inset: number): void {
  if (card.frameVersionId === 'planechase') {
    drawPlanechaseCollectorInfo(ctx, card);
    return;
  }

  ctx.save();
  ctx.textBaseline = 'alphabetic';

  const xLeft = card.width * 0.0647;
  const xRight = card.width * 0.9354;
  const yTopLeft = card.height * 0.9377;
  const yMidLeft = card.height * 0.9548;
  const yBottomLeft = card.height * 0.9719;
  const mainSize = Math.max(8, card.height * 0.0171);
  const smallSize = Math.max(7, card.height * 0.0143);
  const wizardsSize = Math.max(8, card.height * 0.0162);

  const useNewStyle = true;
  const year = new Date().getFullYear();
  const fillColor = resolveBottomInfoColor(card);

  ctx.fillStyle = fillColor;
  ctx.textAlign = 'start';

  // topLeft: 新版 `{rarity}{kerning3}{number}{kerning0}` / 旧版 `{number}` + 独立 rarity object
  ctx.font = `${mainSize}px gothammedium, "Gotham Medium", system-ui, sans-serif`;
  const rarityCode = card.rarity ?? '';
  const cardNumber = card.cardNumber ?? '';
  if (useNewStyle) {
    const topLeftText = compactJoin([rarityCode, cardNumber], ' ');
    if (topLeftText) ctx.fillText(topLeftText, xLeft, yTopLeft);
  } else {
    if (cardNumber) ctx.fillText(cardNumber, xLeft, yTopLeft);
    if (rarityCode) {
      // 旧版独立 rarity object（同 y 不同 x，模拟 {loadx}{rarity}）
      const numberAdvance = cardNumber ? ctx.measureText(`${cardNumber}  `).width : 0;
      ctx.fillText(rarityCode, xLeft + numberAdvance, yTopLeft);
    }
  }

  // midLeft: `{set} • {language}  {fontbelerenbsc}￮ {artist}` — artist 段切 belerenbsc
  let cursorX = xLeft;
  const setLang = compactJoin([card.setCode ? card.setCode.toUpperCase() : null, 'EN'], ' • ');
  if (setLang) {
    ctx.font = `${mainSize}px gothammedium, "Gotham Medium", system-ui, sans-serif`;
    ctx.fillText(setLang, cursorX, yMidLeft);
    cursorX += ctx.measureText(`${setLang}  `).width;
  }
  if (card.artist) {
    ctx.font = `${mainSize * 1.06}px belerenbsc, system-ui, sans-serif`;
    const brushChar = '￮';
    ctx.fillText(brushChar, cursorX, yMidLeft);
    cursorX += ctx.measureText(`${brushChar} `).width;
    ctx.fillText(card.artist, cursorX, yMidLeft);
  }

  // bottomLeft: NOT FOR SALE (smallSize)
  ctx.font = `${smallSize}px gothammedium, "Gotham Medium", system-ui, sans-serif`;
  ctx.fillText('NOT FOR SALE', xLeft, yBottomLeft);

  // wizards: ™ & © {year} Wizards of the Coast (mplantin, align=right, y=yTopLeft)
  ctx.textAlign = 'right';
  ctx.font = `${wizardsSize}px mplantin, Georgia, serif`;
  ctx.fillText(`™ & © ${year} Wizards of the Coast`, xRight, yTopLeft);

  // bottomRight: 站点署名 (mplantin smallSize align=right, y=yMidLeft)
  ctx.font = `${smallSize}px mplantin, Georgia, serif`;
  ctx.fillText('card.sentixx.top', xRight, yMidLeft);

  ctx.restore();
}

// 上游 creator-23.js:347 默认 card.bottomInfoColor='white'，仅 packWanted.js 等
// 白底 frame 切 'black'。cardforger 用 hex 值。
const WHITE_BORDER_FRAME_IDS: ReadonlySet<string> = new Set(['wanted']);

function resolveBottomInfoColor(card: CardData): string {
  return WHITE_BORDER_FRAME_IDS.has(card.frameVersionId) ? '#000000' : '#ffffff';
}

function drawPlanechaseCollectorInfo(ctx: CanvasRenderingContext2D, card: CardData): void {
  const year = new Date().getFullYear();
  const centerX = card.width / 2;
  const maxWidth = card.width * (760 / 2100);
  const artist = card.artist ? `Illus. ${card.artist}` : null;
  const cardInfo = compactJoin([card.cardNumber, card.setCode], ' ');
  const legal = compactJoin([cardInfo, `© ${year} Card Forger`], ' · ');

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  drawOutlinedCollectorLine(ctx, artist, centerX, card.height * (2008 / 2100), card.height * (36 / 2100), maxWidth);
  drawOutlinedCollectorLine(ctx, legal, centerX, card.height * (2044 / 2100), card.height * (36 / 2100), maxWidth);
  ctx.restore();
}

function drawOutlinedCollectorLine(
  ctx: CanvasRenderingContext2D,
  text: string | null,
  x: number,
  y: number,
  fontSize: number,
  maxWidth: number,
): void {
  if (!text) return;
  ctx.font = `${Math.max(24, fontSize)}px mplantin, Georgia, serif`;
  ctx.lineWidth = Math.max(4, fontSize * 0.22);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.78)';
  ctx.fillStyle = '#f4f4f0';
  ctx.lineJoin = 'round';
  ctx.strokeText(text, x, y, maxWidth);
  ctx.fillText(text, x, y, maxWidth);
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
  ctx.font = 'bold 36px belerenbsc, system-ui, sans-serif';
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

function drawSetSymbolImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  card: CardData,
  region: CanvasRect,
): CanvasRect {
  const scale = Math.max(0.1, card.setSymbolScale ?? 1);
  const fitted = fitImageInRect(image, region);
  const drawRect = scaleCanvasRect(fitted, scale, card.setSymbolOffsetX ?? 0, card.setSymbolOffsetY ?? 0);
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = 6;
  ctx.drawImage(image, drawRect.x, drawRect.y, drawRect.w, drawRect.h);
  ctx.restore();
  return drawRect;
}

function drawWatermark(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  card: CardData,
  region: CanvasRect,
): CanvasRect {
  const opacity = clamp(card.watermarkOpacity ?? 0.28, 0, 1);
  const scale = Math.max(0.05, card.watermarkScale ?? 1);
  const fitted = fitImageInRect(image, region);
  const drawRect = scaleCanvasRect(fitted, scale, card.watermarkOffsetX ?? 0, card.watermarkOffsetY ?? 0);
  const { x, y, w: width, h: height } = drawRect;
  const leftPaint = normalizeWatermarkPaint(card.watermarkLeftColor, '#b79d58');
  const rightPaint = normalizeWatermarkPaint(card.watermarkRightColor, 'none');
  if (leftPaint === 'none') return drawRect;

  ctx.save();
  ctx.globalAlpha = opacity;
  if (rightPaint === 'none') {
    drawWatermarkFullPaint(ctx, image, x, y, width, height, leftPaint);
  } else if (isWatermarkTint(leftPaint) && isWatermarkTint(rightPaint)) {
    ctx.drawImage(createTintedWatermark(image, width, height, leftPaint, rightPaint), x, y, width, height);
  } else {
    drawWatermarkPaint(ctx, image, x, y, width, height, leftPaint, 'left');
    drawWatermarkPaint(ctx, image, x, y, width, height, rightPaint, 'right');
  }
  ctx.restore();
  return drawRect;
}

function normalizeWatermarkPaint(value: string | null | undefined, fallback: string): string {
  const resolved = (value ?? fallback).trim();
  if (resolved === 'none' || resolved === 'default' || isWatermarkTint(resolved)) return resolved;
  return fallback;
}

function isWatermarkTint(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function drawWatermarkFullPaint(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  paint: string,
): void {
  const source = paint === 'default' ? image : createTintedWatermark(image, width, height, paint, paint);
  ctx.drawImage(source, x, y, width, height);
}

function drawWatermarkPaint(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  paint: string,
  side: 'left' | 'right',
): void {
  if (paint === 'none') return;
  const source = paint === 'default' ? image : createTintedWatermark(image, width, height, paint, paint);
  const clipX = side === 'left' ? x : x + width / 2;
  ctx.save();
  ctx.beginPath();
  ctx.rect(clipX, y, width / 2, height);
  ctx.clip();
  ctx.drawImage(source, x, y, width, height);
  ctx.restore();
}

function createTintedWatermark(
  image: HTMLImageElement,
  width: number,
  height: number,
  leftColor: string,
  rightColor: string,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'source-in';
  const fill = ctx.createLinearGradient(0, 0, canvas.width, 0);
  fill.addColorStop(0, leftColor);
  fill.addColorStop(1, rightColor);
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function drawTransformedArt(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  card: CardData,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  const targetAspect = w / h;
  const sourceAspect = image.naturalWidth / image.naturalHeight;
  let drawW = w;
  let drawH = h;
  if (sourceAspect > targetAspect) {
    drawW = h * sourceAspect;
  } else if (sourceAspect < targetAspect) {
    drawH = w / sourceAspect;
  }
  const zoom = Math.max(0.05, card.artZoom ?? 1);
  drawW *= zoom;
  drawH *= zoom;
  const offsetX = card.artOffsetX ?? 0;
  const offsetY = card.artOffsetY ?? 0;
  const rotation = ((card.artRotation ?? 0) * Math.PI) / 180;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.translate(x + w / 2 + offsetX, y + h / 2 + offsetY);
  ctx.rotate(rotation);
  if (card.artGrayscale) {
    ctx.filter = 'grayscale(1)';
  }
  ctx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
}
