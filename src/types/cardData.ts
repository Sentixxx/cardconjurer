import type { FrameVersion } from '@/types/template';

/**
 * Minimal CardData shape for the new editor. Intentionally narrower than the
 * legacy `card` global (frames/masks/text layers will be added back as the
 * canvas editor port matures). Stays serializable for localStorage.
 */
export type FrameColor = 'W' | 'U' | 'B' | 'R' | 'G' | 'M' | 'A' | 'L' | 'C';

export interface CardData {
  readonly key: string;
  readonly name: string;
  readonly typeLine: string;
  readonly rulesText: string;
  readonly artUrl: string | null;
  readonly frameVersionId: FrameVersion['id'];
  readonly frameColor?: FrameColor;
  readonly frameUrl?: string | null;
  readonly frameLayers?: readonly FrameLayer[];
  readonly artOffsetX?: number | null;
  readonly artOffsetY?: number | null;
  readonly artZoom?: number | null;
  readonly artRotation?: number | null;
  readonly artGrayscale?: boolean;
  readonly artBounds?: CardRegionBounds | null;
  readonly manaBounds?: CardRegionBounds | null;
  readonly titleBounds?: CardRegionBounds | null;
  readonly typeBounds?: CardRegionBounds | null;
  readonly rulesBounds?: CardRegionBounds | null;
  readonly powerToughnessBounds?: CardRegionBounds | null;
  readonly loyaltyBounds?: CardRegionBounds | null;
  readonly powerToughness?: string | null;
  readonly manaCost?: string | null;
  readonly adventureName?: string | null;
  readonly adventureTypeLine?: string | null;
  readonly adventureRulesText?: string | null;
  readonly adventureManaCost?: string | null;
  readonly layout?: CardLayout;
  readonly loyalty?: string | null;
  readonly sagaSettings?: SagaSettings | null;
  readonly planeswalkerSettings?: PlaneswalkerSettings | null;
  readonly setCode?: string | null;
  readonly rarity?: Rarity;
  readonly setSymbolUrl?: string | null;
  readonly setSymbolOffsetX?: number | null;
  readonly setSymbolOffsetY?: number | null;
  readonly setSymbolScale?: number | null;
  readonly setSymbolBounds?: CardRegionBounds | null;
  readonly watermarkUrl?: string | null;
  readonly watermarkOffsetX?: number | null;
  readonly watermarkOffsetY?: number | null;
  readonly watermarkOpacity?: number | null;
  readonly watermarkScale?: number | null;
  readonly watermarkBounds?: CardRegionBounds | null;
  readonly watermarkLeftColor?: string | null;
  readonly watermarkRightColor?: string | null;
  readonly customTextLayers?: readonly CustomTextLayer[];
  readonly flavorText?: string | null;
  readonly cardNumber?: string | null;
  readonly artist?: string | null;
  readonly face2?: CardFace | null;
  readonly width: number;
  readonly height: number;
}

export interface CardFace {
  readonly name: string;
  readonly typeLine: string;
  readonly rulesText: string;
  readonly manaCost?: string | null;
  readonly adventureName?: string | null;
  readonly adventureTypeLine?: string | null;
  readonly adventureRulesText?: string | null;
  readonly adventureManaCost?: string | null;
  readonly powerToughness?: string | null;
  readonly loyalty?: string | null;
  readonly sagaSettings?: SagaSettings | null;
  readonly planeswalkerSettings?: PlaneswalkerSettings | null;
  readonly layout?: CardLayout;
  readonly artUrl?: string | null;
  readonly frameUrl?: string | null;
  readonly frameLayers?: readonly FrameLayer[];
  readonly frameColor?: FrameColor;
  readonly frameVersionId?: string;
  readonly artOffsetX?: number | null;
  readonly artOffsetY?: number | null;
  readonly artZoom?: number | null;
  readonly artRotation?: number | null;
  readonly artGrayscale?: boolean;
  readonly artBounds?: CardRegionBounds | null;
  readonly manaBounds?: CardRegionBounds | null;
  readonly titleBounds?: CardRegionBounds | null;
  readonly typeBounds?: CardRegionBounds | null;
  readonly rulesBounds?: CardRegionBounds | null;
  readonly powerToughnessBounds?: CardRegionBounds | null;
  readonly loyaltyBounds?: CardRegionBounds | null;
  readonly customTextLayers?: readonly CustomTextLayer[];
  readonly flavorText?: string | null;
}

export interface CustomTextLayer {
  readonly id: string;
  readonly name: string;
  readonly text: string;
  readonly bounds: CardRegionBounds;
  readonly visible?: boolean;
  readonly oneLine?: boolean;
  readonly fontSize?: number;
  readonly fontFamily?: string;
  readonly color?: string;
  readonly align?: 'start' | 'center' | 'end' | 'left' | 'right';
  readonly bold?: boolean;
  readonly italic?: boolean;
}

export interface SagaSettings {
  readonly abilityHeights?: readonly number[];
  readonly chapterCounts?: readonly number[];
}

export interface PlaneswalkerSettings {
  readonly abilityHeights?: readonly number[];
  readonly costs?: readonly string[];
  readonly abilityAdjust?: readonly number[];
  readonly invertTextBoxes?: boolean;
}

export interface FrameLayer {
  readonly id: string;
  readonly name: string;
  readonly url: string;
  readonly masks?: readonly FrameLayerMask[];
  readonly maskUrl?: string | null;
  readonly maskName?: string | null;
  readonly bounds?: FrameLayerBounds | null;
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

export interface FrameLayerMask {
  readonly url: string;
  readonly name: string;
}

export interface FrameLayerBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface CardRegionBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export const EMPTY_CARD_FACE: CardFace = {
  name: '',
  typeLine: '',
  rulesText: '',
  manaCost: null,
  adventureName: null,
  adventureTypeLine: null,
  adventureRulesText: null,
  adventureManaCost: null,
  powerToughness: null,
  loyalty: null,
  sagaSettings: null,
  planeswalkerSettings: null,
  layout: 'standard',
  artUrl: null,
  frameUrl: null,
  frameLayers: [],
  frameColor: 'W',
  artOffsetX: 0,
  artOffsetY: 0,
  artZoom: 1,
  artRotation: 0,
  artGrayscale: false,
  artBounds: null,
  manaBounds: null,
  titleBounds: null,
  typeBounds: null,
  rulesBounds: null,
  powerToughnessBounds: null,
  loyaltyBounds: null,
  customTextLayers: [],
  flavorText: null,
};

export function cardFaceFromMain(card: CardData): CardFace {
  return {
    name: card.name,
    typeLine: card.typeLine,
    rulesText: card.rulesText,
    manaCost: card.manaCost ?? null,
    adventureName: card.adventureName ?? null,
    adventureTypeLine: card.adventureTypeLine ?? null,
    adventureRulesText: card.adventureRulesText ?? null,
    adventureManaCost: card.adventureManaCost ?? null,
    powerToughness: card.powerToughness ?? null,
    loyalty: card.loyalty ?? null,
    sagaSettings: card.sagaSettings ?? null,
    planeswalkerSettings: card.planeswalkerSettings ?? null,
    layout: card.layout,
    artUrl: card.artUrl,
    frameUrl: card.frameUrl ?? null,
    frameLayers: card.frameLayers ?? [],
    frameColor: card.frameColor,
    frameVersionId: card.frameVersionId,
    artOffsetX: card.artOffsetX ?? 0,
    artOffsetY: card.artOffsetY ?? 0,
    artZoom: card.artZoom ?? 1,
    artRotation: card.artRotation ?? 0,
    artGrayscale: card.artGrayscale ?? false,
    artBounds: card.artBounds ?? null,
    manaBounds: card.manaBounds ?? null,
    titleBounds: card.titleBounds ?? null,
    typeBounds: card.typeBounds ?? null,
    rulesBounds: card.rulesBounds ?? null,
    powerToughnessBounds: card.powerToughnessBounds ?? null,
    loyaltyBounds: card.loyaltyBounds ?? null,
    customTextLayers: card.customTextLayers ?? [],
    flavorText: card.flavorText ?? null,
  };
}

export function applyFaceToCard(card: CardData, face: CardFace): CardData {
  return {
    ...card,
    name: face.name,
    typeLine: face.typeLine,
    rulesText: face.rulesText,
    manaCost: face.manaCost ?? null,
    adventureName: face.adventureName ?? null,
    adventureTypeLine: face.adventureTypeLine ?? null,
    adventureRulesText: face.adventureRulesText ?? null,
    adventureManaCost: face.adventureManaCost ?? null,
    powerToughness: face.powerToughness ?? null,
    loyalty: face.loyalty ?? null,
    sagaSettings: face.sagaSettings ?? null,
    planeswalkerSettings: face.planeswalkerSettings ?? null,
    layout: face.layout ?? card.layout,
    artUrl: face.artUrl ?? null,
    frameUrl: face.frameUrl ?? null,
    frameLayers: face.frameLayers ?? [],
    frameColor: face.frameColor ?? card.frameColor,
    frameVersionId: face.frameVersionId ?? card.frameVersionId,
    artOffsetX: face.artOffsetX ?? 0,
    artOffsetY: face.artOffsetY ?? 0,
    artZoom: face.artZoom ?? 1,
    artRotation: face.artRotation ?? 0,
    artGrayscale: face.artGrayscale ?? false,
    artBounds: face.artBounds ?? null,
    manaBounds: face.manaBounds ?? null,
    titleBounds: face.titleBounds ?? null,
    typeBounds: face.typeBounds ?? null,
    rulesBounds: face.rulesBounds ?? null,
    powerToughnessBounds: face.powerToughnessBounds ?? null,
    loyaltyBounds: face.loyaltyBounds ?? null,
    customTextLayers: face.customTextLayers ?? [],
    flavorText: face.flavorText ?? null,
  };
}

export type CardLayout = 'standard' | 'planeswalker' | 'saga';
export type Rarity = 'C' | 'U' | 'R' | 'M' | 'P';

export const RARITY_COLORS: Readonly<Record<Rarity, { fill: string; text: string }>> = {
  C: { fill: '#222222', text: '#efefef' },
  U: { fill: '#c0c0c0', text: '#1d1d1d' },
  R: { fill: '#caa45d', text: '#1d1d1d' },
  M: { fill: '#cf5b35', text: '#efefef' },
  P: { fill: '#7f5fb8', text: '#efefef' },
};

export const DEFAULT_CARD_WIDTH = 1500;
export const DEFAULT_CARD_HEIGHT = 2100;
export const DEFAULT_COLLECTOR_YEAR = new Date().getFullYear().toString();

export const M15_SET_SYMBOL_BOUNDS: CardRegionBounds = {
  x: 0.8013,
  y: 0.5705,
  width: 0.12,
  height: 0.041,
};

export const M15_WATERMARK_BOUNDS: CardRegionBounds = {
  x: 0.125,
  y: 0.66095,
  width: 0.75,
  height: 0.2305,
};

export const EMPTY_CARD: CardData = {
  key: 'untitled',
  name: '',
  typeLine: '',
  rulesText: '',
  artUrl: null,
  frameVersionId: 'm15',
  frameColor: 'W',
  frameUrl: null,
  frameLayers: [],
  artOffsetX: 0,
  artOffsetY: 0,
  artZoom: 1,
  artRotation: 0,
  artGrayscale: false,
  artBounds: null,
  manaBounds: null,
  titleBounds: null,
  typeBounds: null,
  rulesBounds: null,
  powerToughnessBounds: null,
  loyaltyBounds: null,
  powerToughness: null,
  manaCost: null,
  adventureName: null,
  adventureTypeLine: null,
  adventureRulesText: null,
  adventureManaCost: null,
  layout: 'standard',
  loyalty: null,
  sagaSettings: null,
  planeswalkerSettings: null,
  setCode: 'MTG',
  rarity: 'P',
  setSymbolUrl: null,
  setSymbolOffsetX: 0,
  setSymbolOffsetY: 0,
  setSymbolScale: 1,
  setSymbolBounds: M15_SET_SYMBOL_BOUNDS,
  watermarkUrl: null,
  watermarkOffsetX: 0,
  watermarkOffsetY: 0,
  watermarkOpacity: 0.4,
  watermarkScale: 1,
  watermarkBounds: M15_WATERMARK_BOUNDS,
  watermarkLeftColor: '#b79d58',
  watermarkRightColor: 'none',
  customTextLayers: [],
  flavorText: null,
  cardNumber: DEFAULT_COLLECTOR_YEAR,
  artist: null,
  face2: null,
  width: DEFAULT_CARD_WIDTH,
  height: DEFAULT_CARD_HEIGHT,
};

export const FRAME_COLOR_OUTLINES: Readonly<Record<FrameColor, string>> = {
  W: '#e7e3c8',
  U: '#7cb9e8',
  B: '#3a3540',
  R: '#d36651',
  G: '#5fa56a',
  M: '#caa45d',
  A: '#b8c0c8',
  L: '#a3895c',
  C: '#aab0b6',
};

export function isCardData(value: unknown): value is CardData {
  if (value === null || typeof value !== 'object') return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.key === 'string' &&
    typeof r.name === 'string' &&
    typeof r.typeLine === 'string' &&
    typeof r.rulesText === 'string' &&
    (r.artUrl === null || typeof r.artUrl === 'string') &&
    typeof r.frameVersionId === 'string' &&
    typeof r.width === 'number' &&
    typeof r.height === 'number'
  );
}
