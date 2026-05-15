import creatorAssetConfig from './creatorAssetConfig.json';
import type { FrameLayerMask } from '@/types/cardData';

export type SetSymbolSource = 'cardconjurer' | 'gatherer' | 'hexproof';

export interface SetSymbolSourceOption {
  readonly id: SetSymbolSource;
  readonly label: string;
}

export type WatermarkSelectItem =
  | { readonly kind: 'separator'; readonly label: string; readonly value?: string }
  | { readonly kind: 'preset'; readonly label: string; readonly url: string };

export interface WatermarkColorOption {
  readonly label: string;
  readonly value: string;
}

interface CreatorAssetConfig {
  readonly frameMasks: {
    readonly emptyPreviewUrl: string;
    readonly split: {
      readonly rightHalf: FrameLayerMask;
      readonly leftHalf: FrameLayerMask;
      readonly middleThird: FrameLayerMask;
      readonly topHalf: FrameLayerMask;
      readonly bottomHalf: FrameLayerMask;
    };
  };
  readonly setSymbol: {
    readonly defaultSource: SetSymbolSource;
    readonly sources: readonly SetSymbolSourceOption[];
    readonly urlTemplates: Readonly<Record<SetSymbolSource, string>>;
  };
  readonly watermark: {
    readonly noneValue: string;
    readonly items: readonly WatermarkSelectItem[];
    readonly colors: readonly WatermarkColorOption[];
  };
}

const CONFIG = creatorAssetConfig as CreatorAssetConfig;

export const CREATOR_FRAME_MASK_ASSETS = CONFIG.frameMasks;
export const SET_SYMBOL_SOURCES = CONFIG.setSymbol.sources;
export const DEFAULT_SET_SYMBOL_SOURCE = CONFIG.setSymbol.defaultSource;
export const WATERMARK_NONE_VALUE = CONFIG.watermark.noneValue;
export const WATERMARK_SELECT_ITEMS = CONFIG.watermark.items;
export const WATERMARK_COLOR_OPTIONS = CONFIG.watermark.colors;

export function buildSetSymbolUrl(
  source: SetSymbolSource,
  setCode: string | null | undefined,
  rarityCode: string | null | undefined,
): string {
  const set = (setCode || 'cc').trim().toLowerCase();
  const rarity = normalizeRarityCode(rarityCode);
  return applyUrlTemplate(CONFIG.setSymbol.urlTemplates[source], { set, rarity });
}

function normalizeRarityCode(rarityCode: string | null | undefined): string {
  return (rarityCode || 'c')
    .trim()
    .toLowerCase()
    .replace('uncommon', 'u')
    .replace('common', 'c')
    .replace('rare', 'r')
    .replace('mythic', 'm');
}

function applyUrlTemplate(template: string, values: Readonly<Record<string, string>>): string {
  return Object.entries(values).reduce((url, [key, value]) => url.replaceAll(`{${key}}`, value), template);
}
