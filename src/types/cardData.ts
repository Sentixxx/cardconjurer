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
  readonly powerToughness?: string | null;
  readonly manaCost?: string | null;
  readonly layout?: CardLayout;
  readonly loyalty?: string | null;
  readonly setCode?: string | null;
  readonly rarity?: Rarity;
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
  readonly powerToughness?: string | null;
  readonly loyalty?: string | null;
  readonly layout?: CardLayout;
  readonly artUrl?: string | null;
  readonly frameUrl?: string | null;
  readonly frameColor?: FrameColor;
  readonly frameVersionId?: string;
  readonly flavorText?: string | null;
}

export const EMPTY_CARD_FACE: CardFace = {
  name: 'Reverse Face',
  typeLine: '',
  rulesText: '',
  manaCost: null,
  powerToughness: null,
  loyalty: null,
  layout: 'standard',
  artUrl: null,
  frameUrl: null,
  frameColor: 'M',
  flavorText: null,
};

export function cardFaceFromMain(card: CardData): CardFace {
  return {
    name: card.name,
    typeLine: card.typeLine,
    rulesText: card.rulesText,
    manaCost: card.manaCost ?? null,
    powerToughness: card.powerToughness ?? null,
    loyalty: card.loyalty ?? null,
    layout: card.layout,
    artUrl: card.artUrl,
    frameUrl: card.frameUrl ?? null,
    frameColor: card.frameColor,
    frameVersionId: card.frameVersionId,
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
    powerToughness: face.powerToughness ?? null,
    loyalty: face.loyalty ?? null,
    layout: face.layout ?? card.layout,
    artUrl: face.artUrl ?? null,
    frameUrl: face.frameUrl ?? null,
    frameColor: face.frameColor ?? card.frameColor,
    frameVersionId: face.frameVersionId ?? card.frameVersionId,
    flavorText: face.flavorText ?? null,
  };
}

export type CardLayout = 'standard' | 'planeswalker' | 'saga';
export type Rarity = 'C' | 'U' | 'R' | 'M';

export const RARITY_COLORS: Readonly<Record<Rarity, { fill: string; text: string }>> = {
  C: { fill: '#222222', text: '#efefef' },
  U: { fill: '#c0c0c0', text: '#1d1d1d' },
  R: { fill: '#caa45d', text: '#1d1d1d' },
  M: { fill: '#cf5b35', text: '#efefef' },
};

export const DEFAULT_CARD_WIDTH = 1500;
export const DEFAULT_CARD_HEIGHT = 2100;

export const EMPTY_CARD: CardData = {
  key: 'untitled',
  name: 'Untitled Card',
  typeLine: 'Creature — Concept',
  rulesText: '',
  artUrl: null,
  frameVersionId: 'm15',
  frameColor: 'M',
  frameUrl: null,
  powerToughness: null,
  manaCost: null,
  layout: 'standard',
  loyalty: null,
  setCode: null,
  rarity: 'C',
  flavorText: null,
  cardNumber: null,
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
