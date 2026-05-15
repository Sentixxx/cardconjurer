import type { CardLayout } from '@/types/cardData';
import framePresetConfig from './framePresetConfig.json';

export interface FramePreset {
  readonly id: string;
  readonly label: string;
  readonly url: string;
  readonly bounds?: FramePresetBounds;
  readonly erase?: boolean;
  readonly opacity?: number;
}

export interface FrameMaskPreset {
  readonly label: string;
  readonly url: string;
}

export interface FrameLayoutPreset {
  readonly layout?: CardLayout;
  readonly cardWidth?: number;
  readonly cardHeight?: number;
  readonly artBounds: FramePresetBounds;
  readonly manaBounds: FramePresetBounds;
  readonly titleBounds: FramePresetBounds;
  readonly typeBounds: FramePresetBounds;
  readonly rulesBounds: FramePresetBounds;
  readonly adventureManaBounds?: FramePresetBounds;
  readonly adventureTitleBounds?: FramePresetBounds;
  readonly adventureTypeBounds?: FramePresetBounds;
  readonly adventureRulesBounds?: FramePresetBounds;
  readonly powerToughnessBounds: FramePresetBounds;
  readonly loyaltyBounds?: FramePresetBounds;
  readonly setSymbolBounds?: FramePresetBounds;
  readonly watermarkBounds?: FramePresetBounds;
  readonly manaSymbolPositions?: readonly FramePresetPoint[];
  readonly manaSymbolDiameter?: number;
  readonly textColors?: FrameTextColors;
  readonly textAligns?: FrameTextAligns;
  readonly showManaCost?: boolean;
  readonly showTypeText?: boolean;
  readonly showRulesText?: boolean;
  readonly showPowerToughness?: boolean;
}

export interface FramePresetBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface FramePresetPoint {
  readonly x: number;
  readonly y: number;
}

export interface FrameTextColors {
  readonly title?: string;
  readonly type?: string;
  readonly rules?: string;
  readonly flavor?: string;
  readonly powerToughness?: string;
  readonly loyalty?: string;
}

export interface FrameTextAligns {
  readonly title?: CanvasTextAlign;
  readonly type?: CanvasTextAlign;
  readonly powerToughness?: CanvasTextAlign;
}

const M15_PT_BOUNDS = {
  x: 1136 / 1500,
  y: 1858 / 2100,
  width: 282 / 1500,
  height: 154 / 2100,
};

const FULL_CARD_LAYER_BOUNDS = {
  x: 0,
  y: 0,
  width: 1,
  height: 1,
};

const SAGA_NYX_PT_LAYER_BOUNDS = {
  x: 1179 / 1500,
  y: 1766 / 2100,
  width: 237 / 1500,
  height: 154 / 2100,
};

const SHORT_PT_LAYER_BOUNDS = {
  x: 0.7573,
  y: 0.8848,
  width: 0.188,
  height: 0.0733,
};

const M15_NYX_INNER_CROWN_BOUNDS = {
  x: 0.164,
  y: 0.0239,
  width: 0.672,
  height: 0.0239,
};

const M15_LEGEND_CROWN_BOUNDS = {
  x: 41 / 1500,
  y: 40 / 2100,
  width: 1418 / 1500,
  height: 350 / 2100,
};

const M15_LEGEND_CROWN_BORDER_COVER_BOUNDS = {
  x: 59 / 1500,
  y: 58 / 2100,
  width: 1382 / 1500,
  height: 37 / 2100,
};

const M15_FLOATING_CROWN_CUTOUT_BOUNDS = {
  x: 110 / 1500,
  y: 230 / 2100,
  width: 1280 / 1500,
  height: 30 / 2100,
};

const M15_FLOATING_CROWN_BOUNDS = {
  x: 46 / 1500,
  y: 40 / 2100,
  width: 1408 / 1500,
  height: 215 / 2100,
};

const M15_FLOATING_CROWN_BORDER_COVER_BOUNDS = {
  x: 59 / 1500,
  y: 58 / 2100,
  width: 1384 / 1500,
  height: 37 / 2100,
};

const M15_FLOATING_CROWN_OUTLINE_BOUNDS = {
  x: 42 / 1500,
  y: 36 / 2100,
  width: 1416 / 1500,
  height: 223 / 2100,
};

const M15_UB_LEGEND_CROWN_BOUNDS = {
  x: 0.0274,
  y: 0.0191,
  width: 0.9454,
  height: 0.1667,
};

const M15_UB_LEGEND_CROWN_BORDER_COVER_BOUNDS = {
  x: 0.0394,
  y: 0.0277,
  width: 0.9214,
  height: 0.0177,
};

const M15_UB_FLOATING_CROWN_BOUNDS = {
  x: 0.0307,
  y: 0.0191,
  width: 0.9387,
  height: 0.1024,
};

const M15_UB_FLOATING_CROWN_CUTOUT_BOUNDS = {
  x: 0.0734,
  y: 0.1096,
  width: 0.8532,
  height: 0.0143,
};

const M15_UB_FLOATING_CROWN_OUTLINE_BOUNDS = {
  x: 0.028,
  y: 0.0172,
  width: 0.944,
  height: 0.1062,
};

const M15_HOLO_STAMP_BOUNDS = {
  x: 654 / 1500,
  y: 1897 / 2100,
  width: 192 / 1500,
  height: 96 / 2100,
};

const M15_SMALL_HOLO_STAMP_BOUNDS = {
  x: 0.4554,
  y: 0.9172,
  width: 0.0894,
  height: 0.032,
};

const M15_ACORN_HOLO_STAMP_BOUNDS = {
  x: 0.4554,
  y: 0.9129,
  width: 0.0894,
  height: 0.0381,
};

const M15_UB_HOLO_STAMP_BOUNDS = {
  x: 0.4254,
  y: 0.9005,
  width: 0.1494,
  height: 0.0486,
};

const M15_NICKNAME_TITLE_BOUNDS = {
  x: 74 / 1500,
  y: 85 / 2100,
  width: 1352 / 1500,
  height: 221 / 2100,
};

const M15_NICKNAME_CROWN_BOUNDS = {
  x: 36 / 1500,
  y: 36 / 2100,
  width: 1428 / 1500,
  height: 270 / 2100,
};

const M15_CUSTOM_PT_INNER_FILL_BOUNDS = {
  x: 1185 / 1500,
  y: 1885 / 2100,
  width: 212 / 1500,
  height: 84 / 2100,
};

const M15_TRANSFORM_TYPE_ICON_BOUNDS = {
  x: 0.0594,
  y: 0.0505,
  width: 0.0734,
  height: 0.0524,
};

const SNOW_WATERMARK_LAYER_BOUNDS = {
  x: 0.3267,
  y: 0.6491,
  width: 0.3474,
  height: 0.2496,
};

const SEVENTH_BASIC_WATERMARK_BOUNDS = {
  x: 0.3354,
  y: 0.6239,
  width: 0.33,
  height: 0.2386,
};

const SEVENTH_TOMBSTONE_BOUNDS = {
  x: 0.0687,
  y: 0.0491,
  width: 0.0338,
  height: 0.0329,
};

const SEVENTH_TEXTLESS_TEXTBOX_BOUNDS = {
  x: 0.116,
  y: 0.5896,
  width: 0.768,
  height: 0.2858,
};

const FUTURE_PT_BOUNDS = {
  x: 0.7621,
  y: 0.8834,
  width: 0.1734,
  height: 0.0781,
};

const FUTURE_TYPE_ICON_BOUNDS = {
  x: 0.0659,
  y: 0.0472,
  width: 0.0431,
  height: 0.0308,
};

const FUTURE_MANA_SYMBOL_POSITIONS = [
  { x: 0.1224, y: 0.1348 },
  { x: 0.082, y: 0.1993 },
  { x: 0.0619, y: 0.2705 },
  { x: 0.0619, y: 0.3427 },
  { x: 0.0794, y: 0.4206 },
  { x: 0.1425, y: 0.4928 },
] as const;

const IXALAN_TYPE_ICON_BOUNDS = {
  x: 0.06,
  y: 0.05,
  width: 0.0667,
  height: 0.0481,
};

const IXALAN_PT_BOUNDS = {
  x: 0.7567,
  y: 0.8786,
  width: 0.2007,
  height: 0.0748,
};

const STORYBOOK_PT_BOUNDS = {
  x: 0.7414,
  y: 0.8839,
  width: 0.2134,
  height: 0.0681,
};

const STORYBOOK_HOLO_BOUNDS = {
  x: 0.4507,
  y: 0.9129,
  width: 0.0987,
  height: 0.0386,
};

const TEXTLESS_2022_MANA_SYMBOL_BOUNDS = {
  x: 62 / 1500,
  y: 1752 / 2100,
  width: 168 / 1500,
  height: 168 / 2100,
};

const TEXTLESS_2022_UB_STAMP_BOUNDS = {
  x: 657 / 1500,
  y: 1907 / 2100,
  width: 186 / 1500,
  height: 82 / 2100,
};

const EQUINOX_TEXTLESS_PT_LAYER_BOUNDS = {
  x: 0.7794,
  y: 0.8839,
  width: 0.1827,
  height: 0.0639,
};

const M15_REGULAR_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0.0767, y: 0.1129, width: 0.8476, height: 0.4429 },
  manaBounds: { x: 0, y: 0.0613, width: 0.9292, height: 71 / 2100 },
  titleBounds: { x: 0.0854, y: 0.0522, width: 0.8292, height: 0.0543 },
  typeBounds: { x: 0.0854, y: 0.5664, width: 0.8292, height: 0.0543 },
  rulesBounds: { x: 0.086, y: 0.6303, width: 0.828, height: 0.2875 },
  powerToughnessBounds: { x: 0.7928, y: 0.902, width: 0.1367, height: 0.0372 },
  setSymbolBounds: { x: 0.8013, y: 0.5705, width: 0.12, height: 0.041 },
  watermarkBounds: { x: 0.125, y: 0.66095, width: 0.75, height: 0.2305 },
};

const M15_NICKNAME_LAYOUT_PRESET: FrameLayoutPreset = {
  ...M15_REGULAR_LAYOUT_PRESET,
  artBounds: { x: 0, y: 0, width: 1, height: 1936 / 2100 },
  titleBounds: { x: 126 / 1500, y: 188 / 2100, width: 1248 / 1500, height: 80 / 2100 },
  textColors: {
    title: '#efefef',
    type: '#efefef',
    rules: '#efefef',
    flavor: '#efefef',
    powerToughness: '#efefef',
  },
};

const M15_UB_FULL_LAYOUT_PRESET: FrameLayoutPreset = {
  ...M15_REGULAR_LAYOUT_PRESET,
  artBounds: { x: 0.062, y: 0.1129, width: 0.876, height: 0.8096 },
  textColors: {
    type: '#efefef',
    rules: '#efefef',
    flavor: '#efefef',
  },
};

const M15_UB_EXTENDED_LAYOUT_PRESET: FrameLayoutPreset = {
  ...M15_REGULAR_LAYOUT_PRESET,
  artBounds: { x: 0, y: 0.081, width: 1, height: 0.531 },
  textColors: {
    type: '#efefef',
  },
};

const M15_TRANSFORM_FRONT_LAYOUT_PRESET: FrameLayoutPreset = {
  ...M15_REGULAR_LAYOUT_PRESET,
  titleBounds: { x: 0.16, y: 0.0522, width: 0.7547, height: 0.0543 },
};

const M15_TRANSFORM_BACK_LAYOUT_PRESET: FrameLayoutPreset = {
  ...M15_REGULAR_LAYOUT_PRESET,
  titleBounds: { x: 0.0854, y: 0.0522, width: 0.7547, height: 0.0543 },
  textColors: {
    title: '#efefef',
    type: '#efefef',
    powerToughness: '#efefef',
  },
};

const MODAL_REGULAR_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0.0767, y: 0.1129, width: 0.8476, height: 0.4429 },
  manaBounds: { x: 0, y: 0.0613, width: 0.9292, height: 71 / 2100 },
  titleBounds: { x: 0.1614, y: 0.0522, width: 0.7534, height: 0.0543 },
  typeBounds: { x: 0.0854, y: 0.5664, width: 0.8292, height: 0.0543 },
  rulesBounds: { x: 0.086, y: 0.6303, width: 0.828, height: 726 / 2814 },
  powerToughnessBounds: { x: 0.7928, y: 0.902, width: 0.1367, height: 0.0372 },
  setSymbolBounds: { x: 0.8013, y: 0.5705, width: 0.12, height: 0.041 },
  watermarkBounds: { x: 0.125, y: 0.66095, width: 0.75, height: 0.2305 },
};

const SEVENTH_REGULAR_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0.12, y: 0.0991, width: 0.7667, height: 0.4429 },
  manaBounds: { x: 0.1067, y: 0.0539, width: 0.8174, height: 72 / 2100 },
  titleBounds: { x: 0.1134, y: 0.0481, width: 0.7734, height: 0.041 },
  typeBounds: { x: 0.1074, y: 0.5486, width: 0.7852, height: 0.0543 },
  rulesBounds: { x: 0.128, y: 0.6067, width: 0.744, height: 0.2724 },
  powerToughnessBounds: { x: 0.8074, y: 0.9043, width: 0.1367, height: 0.0429 },
  setSymbolBounds: { x: 0.78, y: 0.5553, width: 0.12, height: 0.0372 },
  watermarkBounds: { x: 0.18, y: 0.64, width: 0.64, height: 0.24 },
  textColors: {
    title: '#efefef',
    type: '#efefef',
    powerToughness: '#efefef',
  },
};

const SEVENTH_TEXTLESS_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0.116, y: 0.0977, width: 0.768, height: 0.7772 },
  manaBounds: { x: 0.108, y: 0.0486, width: 0.8147, height: 72 / 2100 },
  titleBounds: { x: 0.108, y: 0.0448, width: 0.784, height: 0.0405 },
  typeBounds: { x: 0, y: 0, width: 0, height: 0 },
  rulesBounds: { x: 0.128, y: 0.6429, width: 0.744, height: 0.2381 },
  powerToughnessBounds: { x: 0.8, y: 0.8981, width: 0.1367, height: 0.0453 },
  setSymbolBounds: { x: 0.7714, y: 0.9019, width: 0.12, height: 0.041 },
  watermarkBounds: { x: -1, y: -1, width: 0.0007, height: 0.0005 },
  textColors: {
    title: '#efefef',
    rules: '#efefef',
    flavor: '#efefef',
    powerToughness: '#efefef',
  },
  showTypeText: false,
};

const LEGENDS_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0.1074, y: 0.0924, width: 0.7854, height: 0.4524 },
  manaBounds: { x: 0.108, y: 0.0458, width: 0.8147, height: 72 / 2100 },
  titleBounds: { x: 0.108, y: 0.04, width: 0.784, height: 0.0405 },
  typeBounds: { x: 0.108, y: 0.5524, width: 0.784, height: 0.0543 },
  rulesBounds: { x: 0.126, y: 0.6081, width: 0.748, height: 0.2762 },
  powerToughnessBounds: { x: 0.8, y: 0.91, width: 0.1367, height: 0.0453 },
  setSymbolBounds: { x: 0.7714, y: 0.561, width: 0.12, height: 0.0334 },
  watermarkBounds: { x: 0.18, y: 0.64, width: 0.64, height: 0.24 },
  textColors: {
    title: '#dedede',
    type: '#dedede',
    powerToughness: '#dedede',
  },
};

const FUTURE_REGULAR_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0.086, y: 0.0843, width: 0.8714, height: 0.5853 },
  manaBounds: { x: 0, y: 0, width: 0, height: 0 },
  titleBounds: { x: 0.176, y: 0.0491, width: 0.832, height: 0.0643 },
  typeBounds: { x: 0.1214, y: 0.5615, width: 0.832, height: 0.0586 },
  rulesBounds: { x: 0.1027, y: 0.6248, width: 0.8074, height: 0.2639 },
  powerToughnessBounds: { x: 0.7734, y: 0.8953, width: 0.14, height: 0.0572 },
  setSymbolBounds: { x: 0.8847, y: 0.57575, width: 0.0534, height: 0.0381 },
  watermarkBounds: { x: 0.125, y: 0.64335, width: 0.75, height: 0.2305 },
  manaSymbolPositions: FUTURE_MANA_SYMBOL_POSITIONS,
  manaSymbolDiameter: 119 / 1500,
  textColors: {
    title: '#efefef',
    type: '#efefef',
    powerToughness: '#efefef',
  },
};

const UNSTABLE_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0, y: 0, width: 1, height: 0.9196 },
  manaBounds: { x: 0, y: 0, width: 0, height: 0 },
  titleBounds: { x: 0.0854, y: 0.0024, width: 0.8292, height: 0.0639 },
  typeBounds: { x: 0, y: 0, width: 0, height: 0 },
  rulesBounds: { x: 0, y: 0, width: 0, height: 0 },
  powerToughnessBounds: { x: 0, y: 0, width: 0, height: 0 },
  setSymbolBounds: { x: 0.44, y: -0.0844, width: 0.12, height: 0.041 },
  watermarkBounds: { x: -1, y: -1, width: 0.0007, height: 0.0005 },
  textColors: { title: '#efefef' },
  textAligns: { title: 'center' },
  showManaCost: false,
  showTypeText: false,
  showRulesText: false,
  showPowerToughness: false,
};

const EXPEDITION_ZNR_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0.04, y: 0.0667, width: 0.92, height: 0.7491 },
  manaBounds: { x: 0, y: 0.0613, width: 0.9292, height: 71 / 2100 },
  titleBounds: { x: 0.0854, y: 0.0522, width: 0.8292, height: 0.0543 },
  typeBounds: { x: 0.0854, y: 0.8196, width: 0.8292, height: 0.0543 },
  rulesBounds: { x: 0.1, y: 0.5648, width: 0.8, height: 0.2505 },
  powerToughnessBounds: { x: 0, y: 0, width: 0, height: 0 },
  setSymbolBounds: { x: 0.826, y: 0.82485, width: 0.12, height: 0.0381 },
  watermarkBounds: { x: 0.125, y: 0.66095, width: 0.75, height: 0.2305 },
  showPowerToughness: false,
};

const IXALAN_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0.04, y: 0.1091, width: 0.92, height: 0.4543 },
  manaBounds: { x: 0, y: 0.0553, width: 0.9292, height: 71 / 2100 },
  titleBounds: { x: 0.14, y: 0.0458, width: 0.72, height: 0.0543 },
  typeBounds: { x: 0.23, y: 0.5662, width: 0.54, height: 0.0543 },
  rulesBounds: { x: 0.1167, y: 0.6381, width: 0.7667, height: 0.27 },
  powerToughnessBounds: { x: 0.7928, y: 0.902, width: 0.1367, height: 0.0372 },
  setSymbolBounds: { x: 0.44, y: 0.0957, width: 0.12, height: 0.041 },
  watermarkBounds: { x: 0.125, y: 0.66095, width: 0.75, height: 0.2305 },
  textAligns: {
    title: 'center',
    type: 'center',
  },
};

const M15_BLEED_EDGE_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0.062, y: 0.1129, width: 0.876, height: 0.8096 },
  manaBounds: { x: 0, y: 176 / 2814, width: 1864 / 2010, height: 71 / 2100 },
  titleBounds: { x: 168 / 2010, y: 145 / 2814, width: 0.8292, height: 0.0543 },
  typeBounds: { x: 168 / 2010, y: 1588 / 2814, width: 0.8292, height: 0.0543 },
  rulesBounds: { x: 0.086, y: 1780 / 2814, width: 0.828, height: 0.2875 },
  powerToughnessBounds: { x: 0.7928, y: 0.902, width: 0.1367, height: 0.0372 },
  setSymbolBounds: { x: 1862 / 2010 - 0.12, y: 0.5705, width: 0.12, height: 0.041 },
  watermarkBounds: { x: 0.125, y: 0.66095, width: 0.75, height: 0.2305 },
  textColors: {
    type: '#efefef',
    rules: '#efefef',
    flavor: '#efefef',
  },
};

const STORYBOOK_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0.0334, y: 0.0258, width: 0.9367, height: 0.5596 },
  manaBounds: { x: 0, y: 0.0613, width: 0.9292, height: 71 / 2100 },
  titleBounds: { x: 0.1454, y: 0.0522, width: 0.8292, height: 0.0543 },
  typeBounds: { x: 0.2134, y: 0.5667, width: 0.5732, height: 0.0543 },
  rulesBounds: { x: 0.5267, y: 0.65, width: 0.3867, height: 0.2358 },
  adventureManaBounds: { x: 0.0814, y: 0.6391, width: 0.4, height: 60 / 2100 },
  adventureTitleBounds: { x: 0.0814, y: 0.6391, width: 0.4, height: 0.0296 },
  adventureTypeBounds: { x: 0.0814, y: 0.6839, width: 0.4, height: 0.0296 },
  adventureRulesBounds: { x: 0.0854, y: 0.7358, width: 0.3947, height: 0.15 },
  powerToughnessBounds: { x: 0.7934, y: 0.9029, width: 0.14, height: 0.0372 },
  setSymbolBounds: { x: 0.8607, y: 0.57525, width: 0.0494, height: 0.0353 },
  watermarkBounds: { x: 0.52665, y: 0.6502, width: 0.3867, height: 0.2358 },
  textAligns: { type: 'center' },
};

const PLANECHASE_LAYOUT_PRESET: FrameLayoutPreset = {
  cardWidth: 3000,
  cardHeight: 2100,
  artBounds: { x: 0.031, y: 0.0434, width: 0.9381, height: 0.9147 },
  manaBounds: { x: 0, y: 0, width: 0, height: 0 },
  titleBounds: { x: 0.0854, y: 0.0643, width: 0.8292, height: 0.0543 },
  typeBounds: { x: 0.2424, y: 0.6658, width: 0.5152, height: 0.0543 },
  rulesBounds: { x: 0.1158, y: 0.7174, width: 0.7684, height: 0.2087 },
  powerToughnessBounds: { x: 0, y: 0, width: 0, height: 0 },
  setSymbolBounds: { x: 0.6572, y: 0.6773, width: 0.12, height: 0.0334 },
  watermarkBounds: { x: 0.125, y: 0.66095, width: 0.75, height: 0.2305 },
  textAligns: {
    title: 'center',
    type: 'center',
  },
  showManaCost: false,
  showPowerToughness: false,
};

const TOKEN_M15_REGULAR_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0.0767, y: 0.1248, width: 0.8476, height: 0.5143 },
  manaBounds: { x: 0, y: 0.0613, width: 0.9292, height: 71 / 2100 },
  titleBounds: { x: 0.0854, y: 0.0522, width: 0.8292, height: 0.0543 },
  typeBounds: { x: 0.0854, y: 0.65, width: 0.8292, height: 0.0543 },
  rulesBounds: { x: 0.086, y: 0.7143, width: 0.828, height: 0.2048 },
  powerToughnessBounds: { x: 0.7928, y: 0.902, width: 0.1367, height: 0.0372 },
  setSymbolBounds: { x: 0.8013, y: 0.6538, width: 0.12, height: 0.041 },
  watermarkBounds: { x: 0.125, y: 0.7441, width: 0.75, height: 0.1472 },
  textColors: { title: '#efefef' },
};

const M15_PROMO_REGULAR_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0, y: 0, width: 1, height: 0.9224 },
  manaBounds: { x: 0, y: 0.0613, width: 0.9292, height: 71 / 2100 },
  titleBounds: { x: 0.0854, y: 0.0522, width: 0.8292, height: 0.0543 },
  typeBounds: { x: 0.0854, y: 0.65, width: 0.8292, height: 0.0543 },
  rulesBounds: { x: 0.086, y: 0.7143, width: 0.828, height: 0.2048 },
  powerToughnessBounds: { x: 0.7928, y: 0.902, width: 0.1367, height: 0.0372 },
  setSymbolBounds: { x: 0.8013, y: 0.6538, width: 0.12, height: 0.041 },
  watermarkBounds: { x: 0.125, y: 0.7441, width: 0.75, height: 0.1472 },
  textColors: {
    title: '#efefef',
    type: '#efefef',
    rules: '#efefef',
    flavor: '#efefef',
  },
};

const M15_PROMO_FULL_ART_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0.0614, y: 0.1124, width: 0.8774, height: 0.8086 },
  manaBounds: { x: 0, y: 0.0613, width: 0.9292, height: 71 / 2100 },
  titleBounds: { x: 0.0854, y: 0.0522, width: 0.8292, height: 0.0543 },
  typeBounds: { x: 0.0854, y: 0.65, width: 0.8292, height: 0.0543 },
  rulesBounds: { x: 0.086, y: 0.7143, width: 0.828, height: 0.2048 },
  powerToughnessBounds: { x: 0.7928, y: 0.902, width: 0.1367, height: 0.0372 },
  setSymbolBounds: { x: 0.8013, y: 0.6538, width: 0.12, height: 0.041 },
  watermarkBounds: { x: 0.125, y: 0.7441, width: 0.75, height: 0.1472 },
  textColors: {
    type: '#efefef',
    rules: '#efefef',
    flavor: '#efefef',
  },
};

const M15_PROMO_EXTENDED_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0, y: 0.081, width: 1, height: 0.6153 },
  manaBounds: { x: 0, y: 0.0613, width: 0.9292, height: 71 / 2100 },
  titleBounds: { x: 0.0854, y: 0.0522, width: 0.8292, height: 0.0543 },
  typeBounds: { x: 0.0854, y: 0.65, width: 0.8292, height: 0.0543 },
  rulesBounds: { x: 0.086, y: 0.7143, width: 0.828, height: 0.2048 },
  powerToughnessBounds: { x: 0.7928, y: 0.902, width: 0.1367, height: 0.0372 },
  setSymbolBounds: { x: 0.8013, y: 0.6538, width: 0.12, height: 0.041 },
  watermarkBounds: { x: 0.125, y: 0.7441, width: 0.75, height: 0.1472 },
  textColors: { type: '#efefef' },
};

const M15_PROMO_GENERIC_SHOWCASE_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0, y: 0, width: 1, height: 0.9224 },
  manaBounds: { x: 0, y: 0.0613, width: 0.9292, height: 71 / 2100 },
  titleBounds: { x: 0.0854, y: 0.0522, width: 0.8292, height: 0.0543 },
  typeBounds: { x: 0.0854, y: 0.65, width: 0.8292, height: 0.0543 },
  rulesBounds: { x: 0.086, y: 0.7143, width: 0.828, height: 0.2048 },
  powerToughnessBounds: { x: 0.7928, y: 0.902, width: 0.1367, height: 0.0372 },
  setSymbolBounds: { x: 0.8013, y: 0.6538, width: 0.12, height: 0.041 },
  watermarkBounds: { x: 0.125, y: 0.7441, width: 0.75, height: 0.1472 },
  textColors: {
    title: '#efefef',
    type: '#efefef',
    rules: '#efefef',
    flavor: '#efefef',
    powerToughness: '#efefef',
  },
};

const M15_EXTENDED_ART_SHORT_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0, y: 0.081, width: 1, height: 0.5753 },
  manaBounds: { x: 0, y: 0.0613, width: 0.9292, height: 71 / 2100 },
  titleBounds: { x: 0.0854, y: 0.0522, width: 0.8292, height: 0.0543 },
  typeBounds: { x: 0.0854, y: 0.61, width: 0.8292, height: 0.0543 },
  rulesBounds: { x: 0.086, y: 0.6743, width: 0.828, height: 0.2448 },
  powerToughnessBounds: { x: 0.7928, y: 0.902, width: 0.1367, height: 0.0372 },
  setSymbolBounds: { x: 0.8013, y: 0.6138, width: 0.12, height: 0.041 },
  watermarkBounds: { x: 0.125, y: 0.7042, width: 0.75, height: 0.1872 },
  textColors: { type: '#efefef' },
};

const M15_TEXTLESS_GENERIC_SHOWCASE_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0, y: 0, width: 1, height: 0.9224 },
  manaBounds: { x: 0, y: 0.0613, width: 0.9292, height: 71 / 2100 },
  titleBounds: { x: 0.0854, y: 0.0522, width: 0.8292, height: 0.0543 },
  typeBounds: { x: 0.0854, y: 0.8196, width: 0.8292, height: 0.0543 },
  rulesBounds: { x: 0, y: 0, width: 0, height: 0 },
  powerToughnessBounds: { x: 0.7928, y: 0.902, width: 0.1367, height: 0.0372 },
  setSymbolBounds: { x: 0.8013, y: 0.8234, width: 0.12, height: 0.041 },
  watermarkBounds: { x: -1, y: -1, width: 0.0007, height: 0.0005 },
  textColors: {
    title: '#efefef',
    type: '#efefef',
    powerToughness: '#efefef',
  },
  showRulesText: false,
};

const M15_TEXTLESS_BASICS_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0.0394, y: 0.0281, width: 0.9214, height: 0.8929 },
  manaBounds: { x: 0, y: 0.0613, width: 0.9292, height: 71 / 2100 },
  titleBounds: { x: 0.0854, y: 0.0522, width: 0.8292, height: 0.0543 },
  typeBounds: { x: 0.0854, y: 0.8481, width: 0.8292, height: 0.0543 },
  rulesBounds: { x: 0, y: 0, width: 0, height: 0 },
  powerToughnessBounds: { x: 0.7928, y: 0.902, width: 0.1367, height: 0.0372 },
  setSymbolBounds: { x: 0.8013, y: 0.8534, width: 0.12, height: 0.041 },
  watermarkBounds: { x: -1, y: -1, width: 0.0007, height: 0.0005 },
  showRulesText: false,
};

const M15_TEXTLESS_BASICS_2022_LAYOUT_PRESET: FrameLayoutPreset = {
  ...M15_TEXTLESS_BASICS_LAYOUT_PRESET,
  typeBounds: { x: 283 / 1500, y: 0.8481, width: 0.8292, height: 0.0543 },
};

const EQUINOX_TEXTLESS_LAYOUT_PRESET: FrameLayoutPreset = {
  artBounds: { x: 0.0754, y: 0.0534, width: 0.8574, height: 0.8715 },
  manaBounds: { x: 0, y: 0.0643, width: 0.9234, height: 71 / 2100 },
  titleBounds: { x: 0.0967, y: 0.0553, width: 0.8067, height: 0.0543 },
  typeBounds: { x: 0.11, y: 0.8648, width: 0.8067, height: 0.0543 },
  rulesBounds: { x: 0, y: 0, width: 0, height: 0 },
  powerToughnessBounds: { x: 0.7947, y: 0.9, width: 0.1367, height: 0.0372 },
  setSymbolBounds: { x: 0.7867, y: 0.8691, width: 0.12, height: 0.041 },
  watermarkBounds: { x: 0.125, y: 0.66095, width: 0.75, height: 0.2305 },
  textColors: {
    title: '#efefef',
    type: '#efefef',
    powerToughness: '#efefef',
  },
  showRulesText: false,
};

const M15_PLANESWALKER_LAYOUT_PRESET: FrameLayoutPreset = {
  layout: 'planeswalker',
  artBounds: { x: 0.068, y: 0.101, width: 0.864, height: 0.8143 },
  manaBounds: { x: 0, y: 0.0481, width: 0.9292, height: 71 / 2100 },
  titleBounds: { x: 0.0867, y: 0.0372, width: 0.8267, height: 0.0548 },
  typeBounds: { x: 0.0867, y: 0.5625, width: 0.8267, height: 0.0548 },
  rulesBounds: { x: 0.18, y: 0.6239, width: 0.7467, height: 0.2744 },
  powerToughnessBounds: { x: 0.7928, y: 0.902, width: 0.1367, height: 0.0372 },
  loyaltyBounds: { x: 0.806, y: 0.902, width: 0.14, height: 0.0372 },
  setSymbolBounds: { x: 0.8027, y: 0.57005, width: 0.12, height: 0.0381 },
  watermarkBounds: { x: 0.125, y: 0.66095, width: 0.75, height: 0.2305 },
};

const SAGA_REGULAR_LAYOUT_PRESET: FrameLayoutPreset = {
  layout: 'saga',
  artBounds: { x: 0.5, y: 0.1124, width: 0.4247, height: 0.7253 },
  manaBounds: { x: 0, y: 0.0613, width: 0.9292, height: 71 / 2100 },
  titleBounds: { x: 0.0854, y: 0.0522, width: 0.8292, height: 0.0543 },
  typeBounds: { x: 0.0854, y: 0.8481, width: 0.8292, height: 0.0543 },
  rulesBounds: { x: 0.0867, y: 0.2896, width: 0.404, height: 0.5585 },
  powerToughnessBounds: { x: 0.7928, y: 0.902, width: 0.1367, height: 0.0372 },
  setSymbolBounds: { x: 0.8027, y: 0.85485, width: 0.12, height: 0.0381 },
  watermarkBounds: { x: 0.12535, y: 0.13645, width: 0.3547, height: 0.6767 },
};

const SAGA_NYX_LAYOUT_PRESET: FrameLayoutPreset = {
  ...SAGA_REGULAR_LAYOUT_PRESET,
  powerToughnessBounds: { x: 0.8267, y: 1803 / 2100, width: 0.0967, height: 0.0372 },
};

const SAGA_UB_LAYOUT_PRESET: FrameLayoutPreset = {
  ...SAGA_REGULAR_LAYOUT_PRESET,
  artBounds: { x: 753 / 1500, y: 240 / 2100, width: 630 / 1500, height: 1517 / 2100 },
  typeBounds: { x: 0.0854, y: 1775 / 2100, width: 0.8292, height: 0.0543 },
  rulesBounds: { x: 0.0867, y: 0.2896, width: 0.404, height: 0.5556 },
  setSymbolBounds: { x: 0.8027, y: 1829 / 2100 - 0.0381 / 2, width: 0.12, height: 0.0381 },
};

const M15_REGULAR_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Pinline (m15)', url: '/img/frames/m15/regular/m15MaskPinline.png' },
  { label: 'Title (m15)', url: '/img/frames/m15/regular/m15MaskTitle.png' },
  { label: 'Type (m15)', url: '/img/frames/m15/regular/m15MaskType.png' },
  { label: 'Rules (m15)', url: '/img/frames/m15/regular/m15MaskRules.png' },
  { label: 'Frame (m15)', url: '/img/frames/m15/regular/m15MaskFrame.png' },
  { label: 'Border (m15)', url: '/img/frames/m15/regular/m15MaskBorder.png' },
  { label: 'Pinline Super (m15)', url: '/img/frames/m15/regular/m15MaskPinlineSuper.png' },
];

const MODAL_REGULAR_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'modal-front-w', label: 'White Frame (Front)', url: '/img/frames/modal/regular/w.png' },
  { id: 'modal-front-u', label: 'Blue Frame (Front)', url: '/img/frames/modal/regular/u.png' },
  { id: 'modal-front-b', label: 'Black Frame (Front)', url: '/img/frames/modal/regular/b.png' },
  { id: 'modal-front-r', label: 'Red Frame (Front)', url: '/img/frames/modal/regular/r.png' },
  { id: 'modal-front-g', label: 'Green Frame (Front)', url: '/img/frames/modal/regular/g.png' },
  { id: 'modal-front-m', label: 'Multicolored Frame (Front)', url: '/img/frames/modal/regular/m.png' },
  { id: 'modal-front-a', label: 'Artifact Frame (Front)', url: '/img/frames/modal/regular/a.png' },
  { id: 'modal-front-l', label: 'Land Frame (Front)', url: '/img/frames/modal/regular/l.png' },
  { id: 'modal-front-v', label: 'Vehicle Frame (Front)', url: '/img/frames/modal/regular/v.png' },
  { id: 'modal-pt-w', label: 'White Power/Toughness', url: '/img/frames/m15/regular/m15PTW.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'modal-pt-u', label: 'Blue Power/Toughness', url: '/img/frames/m15/regular/m15PTU.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'modal-pt-b', label: 'Black Power/Toughness', url: '/img/frames/m15/regular/m15PTB.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'modal-pt-r', label: 'Red Power/Toughness', url: '/img/frames/m15/regular/m15PTR.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'modal-pt-g', label: 'Green Power/Toughness', url: '/img/frames/m15/regular/m15PTG.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'modal-pt-m', label: 'Multicolored Power/Toughness', url: '/img/frames/m15/regular/m15PTM.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'modal-pt-a', label: 'Artifact Power/Toughness', url: '/img/frames/m15/regular/m15PTA.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'modal-pt-c', label: 'Colorless Power/Toughness', url: '/img/frames/m15/regular/m15PTC.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'modal-pt-v', label: 'Vehicle Power/Toughness', url: '/img/frames/m15/regular/m15PTV.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'modal-back-w', label: 'White Frame (Back)', url: '/img/frames/modal/regular/back/w.png' },
  { id: 'modal-back-u', label: 'Blue Frame (Back)', url: '/img/frames/modal/regular/back/u.png' },
  { id: 'modal-back-b', label: 'Black Frame (Back)', url: '/img/frames/modal/regular/back/b.png' },
  { id: 'modal-back-r', label: 'Red Frame (Back)', url: '/img/frames/modal/regular/back/r.png' },
  { id: 'modal-back-g', label: 'Green Frame (Back)', url: '/img/frames/modal/regular/back/g.png' },
  { id: 'modal-back-m', label: 'Multicolored Frame (Back)', url: '/img/frames/modal/regular/back/m.png' },
  { id: 'modal-back-a', label: 'Artifact Frame (Back)', url: '/img/frames/modal/regular/back/a.png' },
  { id: 'modal-back-l', label: 'Land Frame (Back)', url: '/img/frames/modal/regular/back/l.png' },
  { id: 'modal-back-v', label: 'Vehicle Frame (Back)', url: '/img/frames/modal/regular/back/v.png' },
  { id: 'modal-back-pt-w', label: 'White Power/Toughness (Back)', url: '/img/frames/m15/transform/regular/ptW.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'modal-back-pt-u', label: 'Blue Power/Toughness (Back)', url: '/img/frames/m15/transform/regular/ptU.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'modal-back-pt-b', label: 'Black Power/Toughness (Back)', url: '/img/frames/m15/transform/regular/ptB.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'modal-back-pt-r', label: 'Red Power/Toughness (Back)', url: '/img/frames/m15/transform/regular/ptR.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'modal-back-pt-g', label: 'Green Power/Toughness (Back)', url: '/img/frames/m15/transform/regular/ptG.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'modal-back-pt-m', label: 'Multicolored Power/Toughness (Back)', url: '/img/frames/m15/transform/regular/ptM.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'modal-back-pt-a', label: 'Artifact Power/Toughness (Back)', url: '/img/frames/m15/transform/regular/ptA.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'modal-back-pt-v', label: 'Vehicle Power/Toughness (Back)', url: '/img/frames/m15/transform/regular/ptV.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'modal-front-wl', label: 'White Land Frame (Front)', url: '/img/frames/modal/regular/wl.png' },
  { id: 'modal-front-ul', label: 'Blue Land Frame (Front)', url: '/img/frames/modal/regular/ul.png' },
  { id: 'modal-front-bl', label: 'Black Land Frame (Front)', url: '/img/frames/modal/regular/bl.png' },
  { id: 'modal-front-rl', label: 'Red Land Frame (Front)', url: '/img/frames/modal/regular/rl.png' },
  { id: 'modal-front-gl', label: 'Green Land Frame (Front)', url: '/img/frames/modal/regular/gl.png' },
  { id: 'modal-front-ml', label: 'Multicolored Land Frame (Front)', url: '/img/frames/modal/regular/ml.png' },
  { id: 'modal-back-wl', label: 'White Land Frame (Back)', url: '/img/frames/modal/regular/back/wl.png' },
  { id: 'modal-back-ul', label: 'Blue Land Frame (Back)', url: '/img/frames/modal/regular/back/ul.png' },
  { id: 'modal-back-bl', label: 'Black Land Frame (Back)', url: '/img/frames/modal/regular/back/bl.png' },
  { id: 'modal-back-rl', label: 'Red Land Frame (Back)', url: '/img/frames/modal/regular/back/rl.png' },
  { id: 'modal-back-gl', label: 'Green Land Frame (Back)', url: '/img/frames/modal/regular/back/gl.png' },
  { id: 'modal-back-ml', label: 'Multicolored Land Frame (Back)', url: '/img/frames/modal/regular/back/ml.png' },
];

const MODAL_REGULAR_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Flipside Reminder (modal)', url: '/img/frames/modal/regular/reminder.svg' },
  { label: 'Pinline (modal)', url: '/img/frames/modal/regular/pinline.svg' },
  { label: 'Title (modal)', url: '/img/frames/modal/regular/title.svg' },
  { label: 'Type (m15)', url: '/img/frames/m15/regular/m15MaskType.png' },
  { label: 'Rules (modal)', url: '/img/frames/modal/regular/textbox.svg' },
  { label: 'MDFC Arrow (modal)', url: '/img/frames/modal/titleMDFCArrow.svg' },
  { label: 'Frame (modal)', url: '/img/frames/modal/regular/frame.svg' },
  { label: 'Border (modal)', url: '/img/frames/modal/regular/border.svg' },
];

const SEVENTH_REGULAR_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'seventh-w', label: 'White Frame', url: '/img/frames/seventh/regular/w.png' },
  { id: 'seventh-u', label: 'Blue Frame', url: '/img/frames/seventh/regular/u.png' },
  { id: 'seventh-b', label: 'Black Frame', url: '/img/frames/seventh/regular/b.png' },
  { id: 'seventh-r', label: 'Red Frame', url: '/img/frames/seventh/regular/r.png' },
  { id: 'seventh-g', label: 'Green Frame', url: '/img/frames/seventh/regular/g.png' },
  { id: 'seventh-m', label: 'Multicolored Frame', url: '/img/frames/seventh/regular/m.png' },
  { id: 'seventh-a', label: 'Artifact Frame', url: '/img/frames/seventh/regular/a.png' },
  { id: 'seventh-c', label: 'Colorless Frame', url: '/img/frames/seventh/regular/c.png' },
  { id: 'seventh-l', label: 'Land Frame', url: '/img/frames/seventh/regular/l.png' },
  { id: 'seventh-wl', label: 'White Land Frame', url: '/img/frames/seventh/regular/wl.png' },
  { id: 'seventh-ul', label: 'Blue Land Frame', url: '/img/frames/seventh/regular/ul.png' },
  { id: 'seventh-bl', label: 'Black Land Frame', url: '/img/frames/seventh/regular/bl.png' },
  { id: 'seventh-rl', label: 'Red Land Frame', url: '/img/frames/seventh/regular/rl.png' },
  { id: 'seventh-gl', label: 'Green Land Frame', url: '/img/frames/seventh/regular/gl.png' },
  { id: 'seventh-tombstone', label: 'Tombstone Icon', url: '/img/frames/old/icons/tombstone.svg', bounds: SEVENTH_TOMBSTONE_BOUNDS },
  { id: 'seventh-watermark-w', label: 'Plains Watermark', url: '/img/frames/m15/basics/w.png', bounds: SEVENTH_BASIC_WATERMARK_BOUNDS },
  { id: 'seventh-watermark-u', label: 'Island Watermark', url: '/img/frames/m15/basics/u.png', bounds: SEVENTH_BASIC_WATERMARK_BOUNDS },
  { id: 'seventh-watermark-b', label: 'Swamp Watermark', url: '/img/frames/m15/basics/b.png', bounds: SEVENTH_BASIC_WATERMARK_BOUNDS },
  { id: 'seventh-watermark-r', label: 'Mountain Watermark', url: '/img/frames/m15/basics/r.png', bounds: SEVENTH_BASIC_WATERMARK_BOUNDS },
  { id: 'seventh-watermark-g', label: 'Forest Watermark', url: '/img/frames/m15/basics/g.png', bounds: SEVENTH_BASIC_WATERMARK_BOUNDS },
  { id: 'seventh-watermark-c', label: 'Wastes Watermark', url: '/img/frames/m15/basics/c.png', bounds: SEVENTH_BASIC_WATERMARK_BOUNDS },
  { id: 'seventh-dci-star', label: 'DCI Star', url: '/img/frames/seventh/foilStar.svg', bounds: FULL_CARD_LAYER_BOUNDS },
  { id: 'seventh-foil-layer', label: 'Foil Layer', url: '/img/frames/effects/foil.png', bounds: FULL_CARD_LAYER_BOUNDS, opacity: 0.2 },
  { id: 'seventh-white-border', label: 'White Border', url: '/img/frames/white.png', bounds: FULL_CARD_LAYER_BOUNDS },
  { id: 'seventh-silver-border', label: 'Silver Border', url: '/img/frames/silver.png', bounds: FULL_CARD_LAYER_BOUNDS },
  { id: 'seventh-gold-border', label: 'Gold Border', url: '/img/frames/gold.png', bounds: FULL_CARD_LAYER_BOUNDS },
  { id: 'seventh-c-alt', label: 'Colorless Frame (Alt)', url: '/img/frames/seventh/regular/cAlt.png' },
  { id: 'seventh-l-the-dark', label: 'The Dark Land Frame', url: '/img/frames/seventh/regular/lTheDark.png' },
  { id: 'seventh-l-alliances', label: 'Alliances Land Frame', url: '/img/frames/seventh/regular/lAlliances.png' },
  { id: 'seventh-l-mirage', label: 'Mirage Land Frame', url: '/img/frames/seventh/regular/lMirage.png' },
  { id: 'seventh-l-ice-age', label: 'Ice Age Land Frame', url: '/img/frames/seventh/regular/lIceAge.png' },
  { id: 'seventh-l-homelands', label: 'Homelands Land Frame', url: '/img/frames/seventh/regular/lHomelands.png' },
  { id: 'seventh-l-fallen-empires', label: 'Fallen Empires Land Frame', url: '/img/frames/seventh/regular/lFallenEmpires.png' },
  { id: 'seventh-l-arabian-nights', label: 'Arabian Nights Land Frame', url: '/img/frames/seventh/regular/lArabianNights.png' },
  { id: 'seventh-l-antiquities', label: 'Antiquities Land Frame', url: '/img/frames/seventh/regular/lAntiquities.png' },
];

const SEVENTH_REGULAR_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Pinline (seventh)', url: '/img/frames/seventh/regular/pinline.svg' },
  { label: 'Rules (seventh)', url: '/img/frames/seventh/regular/rules.svg' },
  { label: 'Frame (seventh)', url: '/img/frames/seventh/regular/frame.svg' },
  { label: 'Textbox Pinline (seventh)', url: '/img/frames/seventh/regular/trim.svg' },
  { label: 'Dual Land (seventh)', url: '/img/frames/seventh/regular/dual.svg' },
  { label: 'Border (seventh)', url: '/img/frames/seventh/regular/border.svg' },
  { label: 'Foil With Star (seventh)', url: '/img/frames/seventh/foil.svg' },
  { label: 'Foil Without Star (seventh)', url: '/img/frames/seventh/foil2.svg' },
];

const SEVENTH_TEXTLESS_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'seventh-textless-w', label: 'White Textless Frame', url: '/img/frames/seventh/textless/seventhTextlessFrameW.png' },
  { id: 'seventh-textless-u', label: 'Blue Textless Frame', url: '/img/frames/seventh/textless/seventhTextlessFrameU.png' },
  { id: 'seventh-textless-b', label: 'Black Textless Frame', url: '/img/frames/seventh/textless/seventhTextlessFrameB.png' },
  { id: 'seventh-textless-r', label: 'Red Textless Frame', url: '/img/frames/seventh/textless/seventhTextlessFrameR.png' },
  { id: 'seventh-textless-g', label: 'Green Textless Frame', url: '/img/frames/seventh/textless/seventhTextlessFrameG.png' },
  { id: 'seventh-textless-m', label: 'Multicolored Textless Frame', url: '/img/frames/seventh/textless/seventhTextlessFrameM.png' },
  { id: 'seventh-textless-a', label: 'Artifact Textless Frame', url: '/img/frames/seventh/textless/seventhTextlessFrameA.png' },
  { id: 'seventh-textless-l', label: 'Land Textless Frame', url: '/img/frames/seventh/textless/seventhTextlessFrameL.png' },
  { id: 'seventh-textless-tombstone', label: 'Tombstone Icon', url: '/img/frames/old/icons/tombstone.svg', bounds: SEVENTH_TOMBSTONE_BOUNDS },
  { id: 'seventh-textless-textbox', label: 'Textbox', url: '/img/frames/seventh/textless/textbox.svg', bounds: SEVENTH_TEXTLESS_TEXTBOX_BOUNDS },
];

const SEVENTH_TEXTLESS_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Pinline (seventh textless)', url: '/img/frames/seventh/textless/seventhTextlessMaskPinline.png' },
];

const LEGENDS_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'legends-m', label: 'Multicolored Frame', url: '/img/frames/old/legends/m.png' },
];

const FUTURE_REGULAR_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'future-w', label: 'White Future Frame', url: '/img/frames/future/regular/futureFrameW.png' },
  { id: 'future-u', label: 'Blue Future Frame', url: '/img/frames/future/regular/futureFrameU.png' },
  { id: 'future-b', label: 'Black Future Frame', url: '/img/frames/future/regular/futureFrameB.png' },
  { id: 'future-r', label: 'Red Future Frame', url: '/img/frames/future/regular/futureFrameR.png' },
  { id: 'future-g', label: 'Green Future Frame', url: '/img/frames/future/regular/futureFrameG.png' },
  { id: 'future-m', label: 'Multicolored Future Frame', url: '/img/frames/future/regular/futureFrameM.png' },
  { id: 'future-a', label: 'Artifact Future Frame', url: '/img/frames/future/regular/futureFrameA.png' },
  { id: 'future-l', label: 'Land Future Frame', url: '/img/frames/future/regular/futureFrameL.png' },
  { id: 'future-c', label: 'Colorless Future Frame', url: '/img/frames/future/regular/futureFrameC.png' },
  { id: 'future-pt-w', label: 'White Power/Toughness', url: '/img/frames/future/regular/futurePTW.png', bounds: FUTURE_PT_BOUNDS },
  { id: 'future-pt-u', label: 'Blue Power/Toughness', url: '/img/frames/future/regular/futurePTU.png', bounds: FUTURE_PT_BOUNDS },
  { id: 'future-pt-b', label: 'Black Power/Toughness', url: '/img/frames/future/regular/futurePTB.png', bounds: FUTURE_PT_BOUNDS },
  { id: 'future-pt-r', label: 'Red Power/Toughness', url: '/img/frames/future/regular/futurePTR.png', bounds: FUTURE_PT_BOUNDS },
  { id: 'future-pt-g', label: 'Green Power/Toughness', url: '/img/frames/future/regular/futurePTG.png', bounds: FUTURE_PT_BOUNDS },
  { id: 'future-pt-m', label: 'Multicolored Power/Toughness', url: '/img/frames/future/regular/futurePTM.png', bounds: FUTURE_PT_BOUNDS },
  { id: 'future-pt-a', label: 'Artifact Power/Toughness', url: '/img/frames/future/regular/futurePTA.png', bounds: FUTURE_PT_BOUNDS },
  { id: 'future-pt-l', label: 'Land Power/Toughness', url: '/img/frames/future/regular/futurePTL.png', bounds: FUTURE_PT_BOUNDS },
  { id: 'future-pt-c', label: 'Colorless Power/Toughness', url: '/img/frames/future/regular/futurePTC.png', bounds: FUTURE_PT_BOUNDS },
  { id: 'future-type-white', label: 'White Type Icon', url: '/img/frames/future/futureWhite.png', bounds: FUTURE_TYPE_ICON_BOUNDS },
  { id: 'future-type-gray', label: 'Gray Type Icon', url: '/img/frames/future/futureGray.png', bounds: FUTURE_TYPE_ICON_BOUNDS },
];

const FUTURE_REGULAR_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Border (future)', url: '/img/frames/future/futureMaskBorder.png' },
  { label: 'Creature Type Icon (future)', url: '/img/frames/future/futureMaskCreature.png' },
  { label: 'Instant Type Icon (future)', url: '/img/frames/future/futureMaskInstant.png' },
  { label: 'Sorcery Type Icon (future)', url: '/img/frames/future/futureMaskSorcery.png' },
  { label: 'Enchantment Type Icon (future)', url: '/img/frames/future/futureMaskEnchantment.png' },
  { label: 'Artifact Type Icon (future)', url: '/img/frames/future/futureMaskArtifact.png' },
  { label: 'Land Type Icon (future)', url: '/img/frames/future/futureMaskLand.png' },
  { label: 'Multitype Icon (future)', url: '/img/frames/future/futureMaskMulti.png' },
];

const UNSTABLE_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'unstable-w', label: 'White Unstable Frame', url: '/img/frames/unstable/unstableFrameW.png' },
  { id: 'unstable-u', label: 'Blue Unstable Frame', url: '/img/frames/unstable/unstableFrameU.png' },
  { id: 'unstable-b', label: 'Black Unstable Frame', url: '/img/frames/unstable/unstableFrameB.png' },
  { id: 'unstable-r', label: 'Red Unstable Frame', url: '/img/frames/unstable/unstableFrameR.png' },
  { id: 'unstable-g', label: 'Green Unstable Frame', url: '/img/frames/unstable/unstableFrameG.png' },
  { id: 'unstable-m', label: 'Multicolored Unstable Frame', url: '/img/frames/unstable/unstableFrameM.png' },
  { id: 'unstable-c', label: 'Colorless Unstable Frame', url: '/img/frames/unstable/unstableFrameC.png' },
];

const UNSTABLE_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Title (unstable)', url: '/img/frames/unstable/title.svg' },
  { label: 'Bottom Pinline (unstable)', url: '/img/frames/unstable/pinline.svg' },
];

const EXPEDITION_ZNR_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'expedition-w', label: 'White Expedition Frame', url: '/img/frames/expedition/znr/expeditionNewFrameW.png' },
  { id: 'expedition-u', label: 'Blue Expedition Frame', url: '/img/frames/expedition/znr/expeditionNewFrameU.png' },
  { id: 'expedition-b', label: 'Black Expedition Frame', url: '/img/frames/expedition/znr/expeditionNewFrameB.png' },
  { id: 'expedition-r', label: 'Red Expedition Frame', url: '/img/frames/expedition/znr/expeditionNewFrameR.png' },
  { id: 'expedition-g', label: 'Green Expedition Frame', url: '/img/frames/expedition/znr/expeditionNewFrameG.png' },
  { id: 'expedition-m', label: 'Multicolored Expedition Frame', url: '/img/frames/expedition/znr/expeditionNewFrameM.png' },
  { id: 'expedition-l', label: 'Land Expedition Frame', url: '/img/frames/expedition/znr/expeditionNewFrameL.png' },
  { id: 'expedition-c', label: 'Colorless Expedition Frame', url: '/img/frames/expedition/znr/expeditionNewFrameC.png' },
];

const EXPEDITION_ZNR_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Pinline (expedition)', url: '/img/frames/expedition/znr/expeditionNewMaskPinline.png' },
  { label: 'Title (m15)', url: '/img/frames/m15/regular/m15MaskTitle.png' },
  { label: 'Type (expedition)', url: '/img/frames/expedition/znr/expeditionNewMaskType.png' },
  { label: 'Rules (expedition)', url: '/img/frames/expedition/znr/expeditionNewMaskText.png' },
  { label: 'Frame (expedition)', url: '/img/frames/expedition/znr/expeditionNewMaskFrame.png' },
  { label: 'Hedrons (expedition)', url: '/img/frames/expedition/znr/expeditionNewMaskHedrons.png' },
  { label: 'Border (expedition)', url: '/img/frames/expedition/znr/expeditionNewMaskBorder.png' },
];

const IXALAN_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'ixalan-w', label: 'White Ixalan Frame', url: '/img/frames/ixalan/ixalanFrameW.png' },
  { id: 'ixalan-u', label: 'Blue Ixalan Frame', url: '/img/frames/ixalan/ixalanFrameU.png' },
  { id: 'ixalan-b', label: 'Black Ixalan Frame', url: '/img/frames/ixalan/ixalanFrameB.png' },
  { id: 'ixalan-r', label: 'Red Ixalan Frame', url: '/img/frames/ixalan/ixalanFrameR.png' },
  { id: 'ixalan-g', label: 'Green Ixalan Frame', url: '/img/frames/ixalan/ixalanFrameG.png' },
  { id: 'ixalan-m', label: 'Multicolored Ixalan Frame', url: '/img/frames/ixalan/ixalanFrameM.png' },
  { id: 'ixalan-l', label: 'Colorless Ixalan Frame', url: '/img/frames/ixalan/ixalanFrameL.png' },
  { id: 'ixalan-icon-creature', label: 'Creature Icon', url: '/img/frames/ixalan/ixalanIconCreature.png', bounds: IXALAN_TYPE_ICON_BOUNDS },
  { id: 'ixalan-icon-instant', label: 'Instant Icon', url: '/img/frames/ixalan/ixalanIconInstant.png', bounds: IXALAN_TYPE_ICON_BOUNDS },
  { id: 'ixalan-icon-sorcery', label: 'Sorcery Icon', url: '/img/frames/ixalan/ixalanIconSorcery.png', bounds: IXALAN_TYPE_ICON_BOUNDS },
  { id: 'ixalan-icon-enchantment', label: 'Enchantment Icon', url: '/img/frames/ixalan/ixalanIconEnchantment.png', bounds: IXALAN_TYPE_ICON_BOUNDS },
  { id: 'ixalan-icon-artifact', label: 'Artifact Icon', url: '/img/frames/ixalan/ixalanIconArtifact.png', bounds: IXALAN_TYPE_ICON_BOUNDS },
  { id: 'ixalan-icon-multi', label: 'Multitype Icon', url: '/img/frames/ixalan/ixalanIconMulti.png', bounds: IXALAN_TYPE_ICON_BOUNDS },
  { id: 'ixalan-pt-w', label: 'White Power/Toughness', url: '/img/frames/ixalan/pt/w.png', bounds: IXALAN_PT_BOUNDS },
  { id: 'ixalan-pt-u', label: 'Blue Power/Toughness', url: '/img/frames/ixalan/pt/u.png', bounds: IXALAN_PT_BOUNDS },
  { id: 'ixalan-pt-b', label: 'Black Power/Toughness', url: '/img/frames/ixalan/pt/b.png', bounds: IXALAN_PT_BOUNDS },
  { id: 'ixalan-pt-r', label: 'Red Power/Toughness', url: '/img/frames/ixalan/pt/r.png', bounds: IXALAN_PT_BOUNDS },
  { id: 'ixalan-pt-g', label: 'Green Power/Toughness', url: '/img/frames/ixalan/pt/g.png', bounds: IXALAN_PT_BOUNDS },
  { id: 'ixalan-pt-m', label: 'Multicolored Power/Toughness', url: '/img/frames/ixalan/pt/m.png', bounds: IXALAN_PT_BOUNDS },
  { id: 'ixalan-pt-l', label: 'Colorless Power/Toughness', url: '/img/frames/ixalan/pt/l.png', bounds: IXALAN_PT_BOUNDS },
];

const M15_BLEED_EDGE_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'bleed-edge-w', label: 'White Bleed Edge Frame', url: '/img/frames/m15/new/fullart/w.png' },
  { id: 'bleed-edge-u', label: 'Blue Bleed Edge Frame', url: '/img/frames/m15/new/fullart/u.png' },
  { id: 'bleed-edge-b', label: 'Black Bleed Edge Frame', url: '/img/frames/m15/new/fullart/b.png' },
  { id: 'bleed-edge-r', label: 'Red Bleed Edge Frame', url: '/img/frames/m15/new/fullart/r.png' },
  { id: 'bleed-edge-g', label: 'Green Bleed Edge Frame', url: '/img/frames/m15/new/fullart/g.png' },
  { id: 'bleed-edge-m', label: 'Multicolored Bleed Edge Frame', url: '/img/frames/m15/new/fullart/m.png' },
  { id: 'bleed-edge-a', label: 'Artifact Bleed Edge Frame', url: '/img/frames/m15/new/fullart/a.png' },
  { id: 'bleed-edge-l', label: 'Land Bleed Edge Frame', url: '/img/frames/m15/new/fullart/l.png' },
  { id: 'bleed-edge-c', label: 'Eldrazi Bleed Edge Frame', url: '/img/frames/m15/new/fullart/c.png' },
  { id: 'bleed-edge-v', label: 'Vehicle Bleed Edge Frame', url: '/img/frames/m15/new/fullart/v.png' },
  { id: 'bleed-edge-pt-w', label: 'White Power/Toughness', url: '/img/frames/m15/regular/m15PTW.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'bleed-edge-pt-u', label: 'Blue Power/Toughness', url: '/img/frames/m15/regular/m15PTU.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'bleed-edge-pt-b', label: 'Black Power/Toughness', url: '/img/frames/m15/regular/m15PTB.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'bleed-edge-pt-r', label: 'Red Power/Toughness', url: '/img/frames/m15/regular/m15PTR.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'bleed-edge-pt-g', label: 'Green Power/Toughness', url: '/img/frames/m15/regular/m15PTG.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'bleed-edge-pt-m', label: 'Multicolored Power/Toughness', url: '/img/frames/m15/regular/m15PTM.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'bleed-edge-pt-a', label: 'Artifact Power/Toughness', url: '/img/frames/m15/regular/m15PTA.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'bleed-edge-pt-c', label: 'Colorless Power/Toughness', url: '/img/frames/m15/regular/m15PTC.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'bleed-edge-pt-v', label: 'Vehicle Power/Toughness', url: '/img/frames/m15/regular/m15PTV.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'bleed-edge-lw', label: 'White Land Bleed Edge Frame', url: '/img/frames/m15/new/fullart/lw.png' },
  { id: 'bleed-edge-lu', label: 'Blue Land Bleed Edge Frame', url: '/img/frames/m15/new/fullart/lu.png' },
  { id: 'bleed-edge-lb', label: 'Black Land Bleed Edge Frame', url: '/img/frames/m15/new/fullart/lb.png' },
  { id: 'bleed-edge-lr', label: 'Red Land Bleed Edge Frame', url: '/img/frames/m15/new/fullart/lr.png' },
  { id: 'bleed-edge-lg', label: 'Green Land Bleed Edge Frame', url: '/img/frames/m15/new/fullart/lg.png' },
  { id: 'bleed-edge-lm', label: 'Multicolored Land Bleed Edge Frame', url: '/img/frames/m15/new/fullart/lm.png' },
];

const STORYBOOK_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'storybook-w', label: 'White Storybook Frame', url: '/img/frames/storybook/w.png' },
  { id: 'storybook-u', label: 'Blue Storybook Frame', url: '/img/frames/storybook/u.png' },
  { id: 'storybook-b', label: 'Black Storybook Frame', url: '/img/frames/storybook/b.png' },
  { id: 'storybook-r', label: 'Red Storybook Frame', url: '/img/frames/storybook/r.png' },
  { id: 'storybook-g', label: 'Green Storybook Frame', url: '/img/frames/storybook/g.png' },
  { id: 'storybook-m', label: 'Multicolored Storybook Frame', url: '/img/frames/storybook/m.png' },
  { id: 'storybook-c', label: 'Colorless Storybook Frame', url: '/img/frames/storybook/c.png' },
  { id: 'storybook-pt-w', label: 'White Power/Toughness', url: '/img/frames/storybook/wpt.png', bounds: STORYBOOK_PT_BOUNDS },
  { id: 'storybook-pt-u', label: 'Blue Power/Toughness', url: '/img/frames/storybook/upt.png', bounds: STORYBOOK_PT_BOUNDS },
  { id: 'storybook-pt-b', label: 'Black Power/Toughness', url: '/img/frames/storybook/bpt.png', bounds: STORYBOOK_PT_BOUNDS },
  { id: 'storybook-pt-r', label: 'Red Power/Toughness', url: '/img/frames/storybook/rpt.png', bounds: STORYBOOK_PT_BOUNDS },
  { id: 'storybook-pt-g', label: 'Green Power/Toughness', url: '/img/frames/storybook/gpt.png', bounds: STORYBOOK_PT_BOUNDS },
  { id: 'storybook-pt-m', label: 'Multicolored Power/Toughness', url: '/img/frames/storybook/mpt.png', bounds: STORYBOOK_PT_BOUNDS },
  { id: 'storybook-pt-c', label: 'Colorless Power/Toughness', url: '/img/frames/storybook/cpt.png', bounds: STORYBOOK_PT_BOUNDS },
  { id: 'storybook-holo', label: 'Holo Stamp', url: '/img/frames/storybook/holo.png', bounds: STORYBOOK_HOLO_BOUNDS },
];

const STORYBOOK_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Pinline (storybook)', url: '/img/frames/storybook/pinline.png' },
];

const PLANECHASE_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'planechase-phenomenon', label: 'Planar Frame (Phenomenon)', url: '/img/frames/planechase/phenomenon.png' },
  { id: 'planechase-tallest', label: 'Planar Frame (1)', url: '/img/frames/planechase/tallest.png' },
  { id: 'planechase-taller', label: 'Planar Frame (2)', url: '/img/frames/planechase/taller.png' },
  { id: 'planechase-tall', label: 'Planar Frame (3)', url: '/img/frames/planechase/tall.png' },
  { id: 'planechase-short', label: 'Planar Frame (4)', url: '/img/frames/planechase/short.png' },
  { id: 'planechase-shorter', label: 'Planar Frame (5)', url: '/img/frames/planechase/shorter.png' },
  { id: 'planechase-shortest', label: 'Planar Frame (6)', url: '/img/frames/planechase/shortest.png' },
];

const M15_NEW_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Pinline (m15 new)', url: '/img/frames/m15/new/pinline.png' },
  { label: 'Title (m15 new)', url: '/img/frames/m15/new/title.png' },
  { label: 'Type (m15 new)', url: '/img/frames/m15/new/type.png' },
  { label: 'Rules (m15 new)', url: '/img/frames/m15/new/rules.png' },
  { label: 'Frame (m15 new)', url: '/img/frames/m15/new/frame.png' },
  { label: 'Border (m15 new)', url: '/img/frames/m15/new/border.png' },
];

const M15_PROMO_REGULAR_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'm15-promo-w', label: 'White Promo Frame', url: '/img/frames/promo/regular/m15PromoFrameW.png' },
  { id: 'm15-promo-u', label: 'Blue Promo Frame', url: '/img/frames/promo/regular/m15PromoFrameU.png' },
  { id: 'm15-promo-b', label: 'Black Promo Frame', url: '/img/frames/promo/regular/m15PromoFrameB.png' },
  { id: 'm15-promo-r', label: 'Red Promo Frame', url: '/img/frames/promo/regular/m15PromoFrameR.png' },
  { id: 'm15-promo-g', label: 'Green Promo Frame', url: '/img/frames/promo/regular/m15PromoFrameG.png' },
  { id: 'm15-promo-m', label: 'Multicolored Promo Frame', url: '/img/frames/promo/regular/m15PromoFrameM.png' },
  { id: 'm15-promo-a', label: 'Artifact Promo Frame', url: '/img/frames/promo/regular/m15PromoFrameA.png' },
  { id: 'm15-promo-l', label: 'Land Promo Frame', url: '/img/frames/promo/regular/m15PromoFrameL.png' },
  { id: 'm15-promo-pt-w', label: 'White Power/Toughness', url: '/img/frames/m15/regular/m15PTW.png', bounds: M15_PT_BOUNDS },
  { id: 'm15-promo-pt-u', label: 'Blue Power/Toughness', url: '/img/frames/m15/regular/m15PTU.png', bounds: M15_PT_BOUNDS },
  { id: 'm15-promo-pt-b', label: 'Black Power/Toughness', url: '/img/frames/m15/regular/m15PTB.png', bounds: M15_PT_BOUNDS },
  { id: 'm15-promo-pt-r', label: 'Red Power/Toughness', url: '/img/frames/m15/regular/m15PTR.png', bounds: M15_PT_BOUNDS },
  { id: 'm15-promo-pt-g', label: 'Green Power/Toughness', url: '/img/frames/m15/regular/m15PTG.png', bounds: M15_PT_BOUNDS },
  { id: 'm15-promo-pt-m', label: 'Multicolored Power/Toughness', url: '/img/frames/m15/regular/m15PTM.png', bounds: M15_PT_BOUNDS },
  { id: 'm15-promo-pt-a', label: 'Artifact Power/Toughness', url: '/img/frames/m15/regular/m15PTA.png', bounds: M15_PT_BOUNDS },
  { id: 'm15-promo-pt-c', label: 'Colorless Power/Toughness', url: '/img/frames/m15/regular/m15PTC.png', bounds: M15_PT_BOUNDS },
  { id: 'm15-promo-outline', label: 'Outline (Solid)', url: '/img/frames/promo/outline.svg' },
  { id: 'm15-promo-bevel', label: 'Outline (Bevel)', url: '/img/frames/promo/bevel.png' },
];

const M15_PROMO_REGULAR_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Pinline (promo)', url: '/img/frames/promo/m15PromoMaskPinline.png' },
  { label: 'Title (m15)', url: '/img/frames/m15/regular/m15MaskTitle.png' },
  { label: 'Type (promo)', url: '/img/frames/promo/m15PromoMaskType.png' },
  { label: 'Rules (promo)', url: '/img/frames/promo/m15PromoMaskRules.png' },
  { label: 'Border (m15)', url: '/img/frames/m15/regular/m15MaskBorder.png' },
];

const M15_PROMO_OPEN_HOUSE_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'm15-promo-open-house-w', label: 'White Open House Promo Frame', url: '/img/frames/promo/openHouse/w.png' },
  { id: 'm15-promo-open-house-u', label: 'Blue Open House Promo Frame', url: '/img/frames/promo/openHouse/u.png' },
  { id: 'm15-promo-open-house-b', label: 'Black Open House Promo Frame', url: '/img/frames/promo/openHouse/b.png' },
  { id: 'm15-promo-open-house-r', label: 'Red Open House Promo Frame', url: '/img/frames/promo/openHouse/r.png' },
  { id: 'm15-promo-open-house-g', label: 'Green Open House Promo Frame', url: '/img/frames/promo/openHouse/g.png' },
  { id: 'm15-promo-open-house-m', label: 'Multicolored Open House Promo Frame', url: '/img/frames/promo/openHouse/m.png' },
  { id: 'm15-promo-open-house-a', label: 'Artifact Open House Promo Frame', url: '/img/frames/promo/openHouse/a.png' },
  { id: 'm15-promo-open-house-l', label: 'Land Open House Promo Frame', url: '/img/frames/promo/openHouse/l.png' },
  { id: 'm15-promo-open-house-v', label: 'Vehicle Open House Promo Frame', url: '/img/frames/promo/openHouse/v.png' },
  { id: 'm15-promo-open-house-c', label: 'Colorless Open House Promo Frame', url: '/img/frames/promo/openHouse/c.png' },
  { id: 'm15-promo-open-house-pt-w', label: 'White Power/Toughness', url: '/img/frames/m15/regular/m15PTW.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-open-house-pt-u', label: 'Blue Power/Toughness', url: '/img/frames/m15/regular/m15PTU.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-open-house-pt-b', label: 'Black Power/Toughness', url: '/img/frames/m15/regular/m15PTB.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-open-house-pt-r', label: 'Red Power/Toughness', url: '/img/frames/m15/regular/m15PTR.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-open-house-pt-g', label: 'Green Power/Toughness', url: '/img/frames/m15/regular/m15PTG.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-open-house-pt-m', label: 'Multicolored Power/Toughness', url: '/img/frames/m15/regular/m15PTM.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-open-house-pt-a', label: 'Artifact Power/Toughness', url: '/img/frames/m15/regular/m15PTA.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-open-house-pt-c', label: 'Colorless Power/Toughness', url: '/img/frames/m15/regular/m15PTC.png', bounds: SHORT_PT_LAYER_BOUNDS },
];

const M15_PROMO_NYX_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'm15-promo-nyx-w', label: 'White Nyx Promo Frame', url: '/img/frames/promo/nyx/w.png' },
  { id: 'm15-promo-nyx-u', label: 'Blue Nyx Promo Frame', url: '/img/frames/promo/nyx/u.png' },
  { id: 'm15-promo-nyx-b', label: 'Black Nyx Promo Frame', url: '/img/frames/promo/nyx/b.png' },
  { id: 'm15-promo-nyx-r', label: 'Red Nyx Promo Frame', url: '/img/frames/promo/nyx/r.png' },
  { id: 'm15-promo-nyx-g', label: 'Green Nyx Promo Frame', url: '/img/frames/promo/nyx/g.png' },
  { id: 'm15-promo-nyx-m', label: 'Multicolored Nyx Promo Frame', url: '/img/frames/promo/nyx/m.png' },
  { id: 'm15-promo-nyx-a', label: 'Artifact Nyx Promo Frame', url: '/img/frames/promo/nyx/a.png' },
  { id: 'm15-promo-nyx-l', label: 'Land Nyx Promo Frame', url: '/img/frames/promo/nyx/l.png' },
  { id: 'm15-promo-nyx-v', label: 'Vehicle Nyx Promo Frame', url: '/img/frames/promo/nyx/v.png' },
  { id: 'm15-promo-nyx-c', label: 'Colorless Nyx Promo Frame', url: '/img/frames/promo/nyx/c.png' },
  { id: 'm15-promo-nyx-pt-w', label: 'White Power/Toughness', url: '/img/frames/m15/regular/m15PTW.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-nyx-pt-u', label: 'Blue Power/Toughness', url: '/img/frames/m15/regular/m15PTU.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-nyx-pt-b', label: 'Black Power/Toughness', url: '/img/frames/m15/regular/m15PTB.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-nyx-pt-r', label: 'Red Power/Toughness', url: '/img/frames/m15/regular/m15PTR.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-nyx-pt-g', label: 'Green Power/Toughness', url: '/img/frames/m15/regular/m15PTG.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-nyx-pt-m', label: 'Multicolored Power/Toughness', url: '/img/frames/m15/regular/m15PTM.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-nyx-pt-a', label: 'Artifact Power/Toughness', url: '/img/frames/m15/regular/m15PTA.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-nyx-pt-c', label: 'Colorless Power/Toughness', url: '/img/frames/m15/regular/m15PTC.png', bounds: SHORT_PT_LAYER_BOUNDS },
];

const M15_PROMO_FULL_ART_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Pinline (promo)', url: '/img/frames/promo/pinline.svg' },
  { label: 'Title (m15)', url: '/img/frames/m15/regular/m15MaskTitle.png' },
  { label: 'Type (promo)', url: '/img/frames/promo/m15PromoMaskType.png' },
  { label: 'Frame (promo)', url: '/img/frames/promo/frame.svg' },
  { label: 'Rules (promo)', url: '/img/frames/promo/m15PromoMaskRules.png' },
  { label: 'Border (m15)', url: '/img/frames/m15/regular/m15MaskBorder.png' },
];

const M15_PROMO_EXTENDED_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'm15-promo-extended-w', label: 'White Extended Promo Frame', url: '/img/frames/promo/extended/w.png' },
  { id: 'm15-promo-extended-u', label: 'Blue Extended Promo Frame', url: '/img/frames/promo/extended/u.png' },
  { id: 'm15-promo-extended-b', label: 'Black Extended Promo Frame', url: '/img/frames/promo/extended/b.png' },
  { id: 'm15-promo-extended-r', label: 'Red Extended Promo Frame', url: '/img/frames/promo/extended/r.png' },
  { id: 'm15-promo-extended-g', label: 'Green Extended Promo Frame', url: '/img/frames/promo/extended/g.png' },
  { id: 'm15-promo-extended-m', label: 'Multicolored Extended Promo Frame', url: '/img/frames/promo/extended/m.png' },
  { id: 'm15-promo-extended-a', label: 'Artifact Extended Promo Frame', url: '/img/frames/promo/extended/a.png' },
  { id: 'm15-promo-extended-l', label: 'Land Extended Promo Frame', url: '/img/frames/promo/extended/l.png' },
  { id: 'm15-promo-extended-c', label: 'Colorless Extended Promo Frame', url: '/img/frames/promo/extended/c.png' },
  { id: 'm15-promo-extended-v', label: 'Vehicle Extended Promo Frame', url: '/img/frames/promo/extended/v.png' },
  { id: 'm15-promo-extended-pt-w', label: 'White Power/Toughness', url: '/img/frames/m15/regular/m15PTW.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-extended-pt-u', label: 'Blue Power/Toughness', url: '/img/frames/m15/regular/m15PTU.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-extended-pt-b', label: 'Black Power/Toughness', url: '/img/frames/m15/regular/m15PTB.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-extended-pt-r', label: 'Red Power/Toughness', url: '/img/frames/m15/regular/m15PTR.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-extended-pt-g', label: 'Green Power/Toughness', url: '/img/frames/m15/regular/m15PTG.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-extended-pt-m', label: 'Multicolored Power/Toughness', url: '/img/frames/m15/regular/m15PTM.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-extended-pt-a', label: 'Artifact Power/Toughness', url: '/img/frames/m15/regular/m15PTA.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-extended-pt-c', label: 'Colorless Power/Toughness', url: '/img/frames/m15/regular/m15PTC.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-extended-pt-v', label: 'Vehicle Power/Toughness', url: '/img/frames/m15/regular/m15PTV.png', bounds: SHORT_PT_LAYER_BOUNDS },
];

const M15_PROMO_EXTENDED_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Pinline (promo)', url: '/img/frames/promo/m15PromoMaskPinline.png' },
  { label: 'Title (m15)', url: '/img/frames/m15/regular/m15MaskTitle.png' },
  { label: 'Type (promo)', url: '/img/frames/promo/m15PromoMaskType.png' },
  { label: 'Frame (promo extended)', url: '/img/frames/promo/extended/frame.svg' },
  { label: 'Rules (promo)', url: '/img/frames/promo/m15PromoMaskRules.png' },
  { label: 'Border (m15)', url: '/img/frames/m15/regular/m15MaskBorder.png' },
];

const M15_PROMO_GENERIC_SHOWCASE_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'm15-promo-generic-showcase-w', label: 'White Generic Showcase Promo Frame', url: '/img/frames/promo/genericShowcase/w.png' },
  { id: 'm15-promo-generic-showcase-u', label: 'Blue Generic Showcase Promo Frame', url: '/img/frames/promo/genericShowcase/u.png' },
  { id: 'm15-promo-generic-showcase-b', label: 'Black Generic Showcase Promo Frame', url: '/img/frames/promo/genericShowcase/b.png' },
  { id: 'm15-promo-generic-showcase-r', label: 'Red Generic Showcase Promo Frame', url: '/img/frames/promo/genericShowcase/r.png' },
  { id: 'm15-promo-generic-showcase-g', label: 'Green Generic Showcase Promo Frame', url: '/img/frames/promo/genericShowcase/g.png' },
  { id: 'm15-promo-generic-showcase-m', label: 'Multicolored Generic Showcase Promo Frame', url: '/img/frames/promo/genericShowcase/m.png' },
  { id: 'm15-promo-generic-showcase-a', label: 'Artifact Generic Showcase Promo Frame', url: '/img/frames/promo/genericShowcase/a.png' },
  { id: 'm15-promo-generic-showcase-pt-w', label: 'Darkened White Power/Toughness', url: '/img/frames/m15/nickname/m15NicknamePTW.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-generic-showcase-pt-u', label: 'Darkened Blue Power/Toughness', url: '/img/frames/m15/nickname/m15NicknamePTU.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-generic-showcase-pt-b', label: 'Darkened Black Power/Toughness', url: '/img/frames/m15/nickname/m15NicknamePTB.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-generic-showcase-pt-r', label: 'Darkened Red Power/Toughness', url: '/img/frames/m15/nickname/m15NicknamePTR.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-generic-showcase-pt-g', label: 'Darkened Green Power/Toughness', url: '/img/frames/m15/nickname/m15NicknamePTG.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-generic-showcase-pt-m', label: 'Darkened Multicolored Power/Toughness', url: '/img/frames/m15/nickname/m15NicknamePTM.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-generic-showcase-pt-a', label: 'Darkened Artifact Power/Toughness', url: '/img/frames/m15/nickname/m15NicknamePTA.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-generic-showcase-pt-c', label: 'Darkened Colorless Power/Toughness', url: '/img/frames/m15/nickname/m15NicknamePTC.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'm15-promo-generic-showcase-outline-cutout', label: 'Outline Cutout', url: '/img/frames/promo/outlineCutout.svg', erase: true },
  { id: 'm15-promo-generic-showcase-outline', label: 'Outline (Solid)', url: '/img/frames/promo/outline.svg' },
  { id: 'm15-promo-generic-showcase-bevel', label: 'Outline (Bevel)', url: '/img/frames/promo/bevel.png' },
];

const M15_EXTENDED_ART_SHORT_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'short-w', label: 'White Short Frame', url: '/img/frames/m15/boxTopper/short/w.png' },
  { id: 'short-u', label: 'Blue Short Frame', url: '/img/frames/m15/boxTopper/short/u.png' },
  { id: 'short-b', label: 'Black Short Frame', url: '/img/frames/m15/boxTopper/short/b.png' },
  { id: 'short-r', label: 'Red Short Frame', url: '/img/frames/m15/boxTopper/short/r.png' },
  { id: 'short-g', label: 'Green Short Frame', url: '/img/frames/m15/boxTopper/short/g.png' },
  { id: 'short-m', label: 'Multicolored Short Frame', url: '/img/frames/m15/boxTopper/short/m.png' },
  { id: 'short-a', label: 'Artifact Short Frame', url: '/img/frames/m15/boxTopper/short/a.png' },
  { id: 'short-l', label: 'Land Short Frame', url: '/img/frames/m15/boxTopper/short/l.png' },
  { id: 'short-wl', label: 'White Land Short Frame', url: '/img/frames/m15/boxTopper/short/wl.png' },
  { id: 'short-ul', label: 'Blue Land Short Frame', url: '/img/frames/m15/boxTopper/short/ul.png' },
  { id: 'short-bl', label: 'Black Land Short Frame', url: '/img/frames/m15/boxTopper/short/bl.png' },
  { id: 'short-rl', label: 'Red Land Short Frame', url: '/img/frames/m15/boxTopper/short/rl.png' },
  { id: 'short-gl', label: 'Green Land Short Frame', url: '/img/frames/m15/boxTopper/short/gl.png' },
  { id: 'short-ml', label: 'Multicolored Land Short Frame', url: '/img/frames/m15/boxTopper/short/ml.png' },
  { id: 'short-pt-w', label: 'White Power/Toughness', url: '/img/frames/m15/regular/m15PTW.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'short-pt-u', label: 'Blue Power/Toughness', url: '/img/frames/m15/regular/m15PTU.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'short-pt-b', label: 'Black Power/Toughness', url: '/img/frames/m15/regular/m15PTB.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'short-pt-r', label: 'Red Power/Toughness', url: '/img/frames/m15/regular/m15PTR.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'short-pt-g', label: 'Green Power/Toughness', url: '/img/frames/m15/regular/m15PTG.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'short-pt-m', label: 'Multicolored Power/Toughness', url: '/img/frames/m15/regular/m15PTM.png', bounds: SHORT_PT_LAYER_BOUNDS },
  { id: 'short-pt-a', label: 'Artifact Power/Toughness', url: '/img/frames/m15/regular/m15PTA.png', bounds: SHORT_PT_LAYER_BOUNDS },
];

const M15_EXTENDED_ART_SHORT_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Pinline (short)', url: '/img/frames/m15/boxTopper/short/pinline.svg' },
  { label: 'Title (m15)', url: '/img/frames/m15/regular/m15MaskTitle.png' },
  { label: 'Type (short)', url: '/img/frames/m15/boxTopper/short/type.png' },
  { label: 'Rules (short)', url: '/img/frames/m15/boxTopper/short/text.svg' },
  { label: 'Frame (short)', url: '/img/frames/m15/boxTopper/short/frame.svg' },
  { label: 'Border (m15)', url: '/img/frames/m15/regular/m15MaskBorder.png' },
];

const M15_TEXTLESS_GENERIC_SHOWCASE_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'm15-textless-w', label: 'White Textless Frame', url: '/img/frames/textless/genericShowcase/m15TextlessGenericShowcaseFrameW.png' },
  { id: 'm15-textless-u', label: 'Blue Textless Frame', url: '/img/frames/textless/genericShowcase/m15TextlessGenericShowcaseFrameU.png' },
  { id: 'm15-textless-b', label: 'Black Textless Frame', url: '/img/frames/textless/genericShowcase/m15TextlessGenericShowcaseFrameB.png' },
  { id: 'm15-textless-r', label: 'Red Textless Frame', url: '/img/frames/textless/genericShowcase/m15TextlessGenericShowcaseFrameR.png' },
  { id: 'm15-textless-g', label: 'Green Textless Frame', url: '/img/frames/textless/genericShowcase/m15TextlessGenericShowcaseFrameG.png' },
  { id: 'm15-textless-m', label: 'Multicolored Textless Frame', url: '/img/frames/textless/genericShowcase/m15TextlessGenericShowcaseFrameM.png' },
  { id: 'm15-textless-a', label: 'Artifact Textless Frame', url: '/img/frames/textless/genericShowcase/m15TextlessGenericShowcaseFrameA.png' },
  { id: 'm15-textless-c', label: 'Colorless Textless Frame', url: '/img/frames/textless/genericShowcase/m15TextlessGenericShowcaseFrameL.png' },
  { id: 'm15-textless-pt-w', label: 'Darkened White Power/Toughness', url: '/img/frames/m15/nickname/m15NicknamePTW.png', bounds: M15_PT_BOUNDS },
  { id: 'm15-textless-pt-u', label: 'Darkened Blue Power/Toughness', url: '/img/frames/m15/nickname/m15NicknamePTU.png', bounds: M15_PT_BOUNDS },
  { id: 'm15-textless-pt-b', label: 'Darkened Black Power/Toughness', url: '/img/frames/m15/nickname/m15NicknamePTB.png', bounds: M15_PT_BOUNDS },
  { id: 'm15-textless-pt-r', label: 'Darkened Red Power/Toughness', url: '/img/frames/m15/nickname/m15NicknamePTR.png', bounds: M15_PT_BOUNDS },
  { id: 'm15-textless-pt-g', label: 'Darkened Green Power/Toughness', url: '/img/frames/m15/nickname/m15NicknamePTG.png', bounds: M15_PT_BOUNDS },
  { id: 'm15-textless-pt-m', label: 'Darkened Multicolored Power/Toughness', url: '/img/frames/m15/nickname/m15NicknamePTM.png', bounds: M15_PT_BOUNDS },
  { id: 'm15-textless-pt-a', label: 'Darkened Artifact Power/Toughness', url: '/img/frames/m15/nickname/m15NicknamePTA.png', bounds: M15_PT_BOUNDS },
  { id: 'm15-textless-pt-c', label: 'Darkened Colorless Power/Toughness', url: '/img/frames/m15/nickname/m15NicknamePTC.png', bounds: M15_PT_BOUNDS },
];

const M15_TEXTLESS_GENERIC_SHOWCASE_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Pinline (m15 textless)', url: '/img/frames/textless/m15TextlessMaskPinline.png' },
  { label: 'Title (m15)', url: '/img/frames/m15/regular/m15MaskTitle.png' },
  { label: 'Type (m15 textless)', url: '/img/frames/textless/m15TextlessMaskType.png' },
  { label: 'Border (m15)', url: '/img/frames/m15/regular/m15MaskBorder.png' },
];

const M15_TEXTLESS_BASICS_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'm15-textless-basics-w', label: 'White Textless Basic Frame', url: '/img/frames/textless/basics/w.png' },
  { id: 'm15-textless-basics-u', label: 'Blue Textless Basic Frame', url: '/img/frames/textless/basics/u.png' },
  { id: 'm15-textless-basics-b', label: 'Black Textless Basic Frame', url: '/img/frames/textless/basics/b.png' },
  { id: 'm15-textless-basics-r', label: 'Red Textless Basic Frame', url: '/img/frames/textless/basics/r.png' },
  { id: 'm15-textless-basics-g', label: 'Green Textless Basic Frame', url: '/img/frames/textless/basics/g.png' },
  { id: 'm15-textless-basics-m', label: 'Multicolored Textless Basic Frame', url: '/img/frames/textless/basics/m.png' },
  { id: 'm15-textless-basics-a', label: 'Artifact Textless Basic Frame', url: '/img/frames/textless/basics/a.png' },
  { id: 'm15-textless-basics-c', label: 'Colorless Textless Basic Frame', url: '/img/frames/textless/basics/l.png' },
];

const M15_TEXTLESS_BASICS_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Pinline (textless basics)', url: '/img/frames/textless/basics/pinline.svg' },
  { label: 'Title (m15)', url: '/img/frames/m15/regular/m15MaskTitle.png' },
  { label: 'Type (textless basics)', url: '/img/frames/textless/basics/type.svg' },
  { label: 'Border (m15)', url: '/img/frames/m15/regular/m15MaskBorder.png' },
];

const M15_TEXTLESS_BASICS_2022_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'm15-textless-2022-w', label: 'White Textless 2022 Frame', url: '/img/frames/textless/2022/w.png' },
  { id: 'm15-textless-2022-u', label: 'Blue Textless 2022 Frame', url: '/img/frames/textless/2022/u.png' },
  { id: 'm15-textless-2022-b', label: 'Black Textless 2022 Frame', url: '/img/frames/textless/2022/b.png' },
  { id: 'm15-textless-2022-r', label: 'Red Textless 2022 Frame', url: '/img/frames/textless/2022/r.png' },
  { id: 'm15-textless-2022-g', label: 'Green Textless 2022 Frame', url: '/img/frames/textless/2022/g.png' },
  { id: 'm15-textless-2022-m', label: 'Multicolored Textless 2022 Frame', url: '/img/frames/textless/2022/m.png' },
  { id: 'm15-textless-2022-c', label: 'Colorless Textless 2022 Frame', url: '/img/frames/textless/2022/l.png' },
  { id: 'm15-textless-2022-symbol-w', label: 'White Mana Symbol', url: '/img/frames/textless/2022/sw.png', bounds: TEXTLESS_2022_MANA_SYMBOL_BOUNDS },
  { id: 'm15-textless-2022-symbol-u', label: 'Blue Mana Symbol', url: '/img/frames/textless/2022/su.png', bounds: TEXTLESS_2022_MANA_SYMBOL_BOUNDS },
  { id: 'm15-textless-2022-symbol-b', label: 'Black Mana Symbol', url: '/img/frames/textless/2022/sb.png', bounds: TEXTLESS_2022_MANA_SYMBOL_BOUNDS },
  { id: 'm15-textless-2022-symbol-r', label: 'Red Mana Symbol', url: '/img/frames/textless/2022/sr.png', bounds: TEXTLESS_2022_MANA_SYMBOL_BOUNDS },
  { id: 'm15-textless-2022-symbol-g', label: 'Green Mana Symbol', url: '/img/frames/textless/2022/sg.png', bounds: TEXTLESS_2022_MANA_SYMBOL_BOUNDS },
  { id: 'm15-textless-2022-symbol-c', label: 'Colorless Mana Symbol', url: '/img/frames/textless/2022/sc.png', bounds: TEXTLESS_2022_MANA_SYMBOL_BOUNDS },
  { id: 'm15-textless-2022-snow-w', label: 'White Snow Textless 2022 Frame', url: '/img/frames/textless/2022/snow/w.png' },
  { id: 'm15-textless-2022-snow-u', label: 'Blue Snow Textless 2022 Frame', url: '/img/frames/textless/2022/snow/u.png' },
  { id: 'm15-textless-2022-snow-b', label: 'Black Snow Textless 2022 Frame', url: '/img/frames/textless/2022/snow/b.png' },
  { id: 'm15-textless-2022-snow-r', label: 'Red Snow Textless 2022 Frame', url: '/img/frames/textless/2022/snow/r.png' },
  { id: 'm15-textless-2022-snow-g', label: 'Green Snow Textless 2022 Frame', url: '/img/frames/textless/2022/snow/g.png' },
];

const M15_TEXTLESS_BASICS_2022_UB_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'm15-textless-2022-ub-w', label: 'White Textless 2022 UB Frame', url: '/img/frames/textless/2022/ub/w.png' },
  { id: 'm15-textless-2022-ub-u', label: 'Blue Textless 2022 UB Frame', url: '/img/frames/textless/2022/ub/u.png' },
  { id: 'm15-textless-2022-ub-b', label: 'Black Textless 2022 UB Frame', url: '/img/frames/textless/2022/ub/b.png' },
  { id: 'm15-textless-2022-ub-r', label: 'Red Textless 2022 UB Frame', url: '/img/frames/textless/2022/ub/r.png' },
  { id: 'm15-textless-2022-ub-g', label: 'Green Textless 2022 UB Frame', url: '/img/frames/textless/2022/ub/g.png' },
  { id: 'm15-textless-2022-ub-m', label: 'Multicolored Textless 2022 UB Frame', url: '/img/frames/textless/2022/ub/m.png' },
  { id: 'm15-textless-2022-ub-c', label: 'Colorless Textless 2022 UB Frame', url: '/img/frames/textless/2022/ub/l.png' },
  { id: 'm15-textless-2022-ub-symbol-w', label: 'White Mana Symbol', url: '/img/frames/textless/2022/sw.png', bounds: TEXTLESS_2022_MANA_SYMBOL_BOUNDS },
  { id: 'm15-textless-2022-ub-symbol-u', label: 'Blue Mana Symbol', url: '/img/frames/textless/2022/su.png', bounds: TEXTLESS_2022_MANA_SYMBOL_BOUNDS },
  { id: 'm15-textless-2022-ub-symbol-b', label: 'Black Mana Symbol', url: '/img/frames/textless/2022/sb.png', bounds: TEXTLESS_2022_MANA_SYMBOL_BOUNDS },
  { id: 'm15-textless-2022-ub-symbol-r', label: 'Red Mana Symbol', url: '/img/frames/textless/2022/sr.png', bounds: TEXTLESS_2022_MANA_SYMBOL_BOUNDS },
  { id: 'm15-textless-2022-ub-symbol-g', label: 'Green Mana Symbol', url: '/img/frames/textless/2022/sg.png', bounds: TEXTLESS_2022_MANA_SYMBOL_BOUNDS },
  { id: 'm15-textless-2022-ub-symbol-c', label: 'Colorless Mana Symbol', url: '/img/frames/textless/2022/sc.png', bounds: TEXTLESS_2022_MANA_SYMBOL_BOUNDS },
  { id: 'm15-textless-2022-ub-stamp', label: 'Gold Holo Stamp', url: '/img/frames/textless/2022/ub/stamp.png', bounds: TEXTLESS_2022_UB_STAMP_BOUNDS },
  { id: 'm15-textless-2022-ub-gray-stamp', label: 'Gray Holo Stamp', url: '/img/frames/textless/2022/ub/grayStamp.png', bounds: TEXTLESS_2022_UB_STAMP_BOUNDS },
];

const M15_TEXTLESS_BASICS_2022_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Pinline (textless 2022)', url: '/img/frames/textless/2022/maskPinline.png' },
  { label: 'Title (m15)', url: '/img/frames/m15/regular/m15MaskTitle.png' },
  { label: 'Type (textless 2022)', url: '/img/frames/textless/2022/maskType.png' },
  { label: 'Border (textless 2022)', url: '/img/frames/textless/2022/maskBorder.png' },
];

const EQUINOX_TEXTLESS_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'equinox-textless-w', label: 'White Equinox Textless Frame', url: '/img/frames/m15/equinox/textless/w.png' },
  { id: 'equinox-textless-u', label: 'Blue Equinox Textless Frame', url: '/img/frames/m15/equinox/textless/u.png' },
  { id: 'equinox-textless-b', label: 'Black Equinox Textless Frame', url: '/img/frames/m15/equinox/textless/b.png' },
  { id: 'equinox-textless-r', label: 'Red Equinox Textless Frame', url: '/img/frames/m15/equinox/textless/r.png' },
  { id: 'equinox-textless-g', label: 'Green Equinox Textless Frame', url: '/img/frames/m15/equinox/textless/g.png' },
  { id: 'equinox-textless-m', label: 'Multicolored Equinox Textless Frame', url: '/img/frames/m15/equinox/textless/m.png' },
  { id: 'equinox-textless-a', label: 'Artifact Equinox Textless Frame', url: '/img/frames/m15/equinox/textless/a.png' },
  { id: 'equinox-textless-l', label: 'Land Equinox Textless Frame', url: '/img/frames/m15/equinox/textless/l.png' },
  { id: 'equinox-textless-pt-w', label: 'White Power/Toughness', url: '/img/frames/m15/equinox/back/pt/w.png', bounds: EQUINOX_TEXTLESS_PT_LAYER_BOUNDS },
  { id: 'equinox-textless-pt-u', label: 'Blue Power/Toughness', url: '/img/frames/m15/equinox/back/pt/u.png', bounds: EQUINOX_TEXTLESS_PT_LAYER_BOUNDS },
  { id: 'equinox-textless-pt-b', label: 'Black Power/Toughness', url: '/img/frames/m15/equinox/back/pt/b.png', bounds: EQUINOX_TEXTLESS_PT_LAYER_BOUNDS },
  { id: 'equinox-textless-pt-r', label: 'Red Power/Toughness', url: '/img/frames/m15/equinox/back/pt/r.png', bounds: EQUINOX_TEXTLESS_PT_LAYER_BOUNDS },
  { id: 'equinox-textless-pt-g', label: 'Green Power/Toughness', url: '/img/frames/m15/equinox/back/pt/g.png', bounds: EQUINOX_TEXTLESS_PT_LAYER_BOUNDS },
  { id: 'equinox-textless-pt-m', label: 'Multicolored Power/Toughness', url: '/img/frames/m15/equinox/back/pt/m.png', bounds: EQUINOX_TEXTLESS_PT_LAYER_BOUNDS },
  { id: 'equinox-textless-pt-a', label: 'Artifact Power/Toughness', url: '/img/frames/m15/equinox/back/pt/a.png', bounds: EQUINOX_TEXTLESS_PT_LAYER_BOUNDS },
  { id: 'equinox-textless-pt-l', label: 'Land Power/Toughness', url: '/img/frames/m15/equinox/back/pt/l.png', bounds: EQUINOX_TEXTLESS_PT_LAYER_BOUNDS },
];

const EQUINOX_TEXTLESS_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Pinline (equinox textless)', url: '/img/frames/m15/equinox/textless/pinline.svg' },
  { label: 'Title (equinox textless)', url: '/img/frames/m15/equinox/textless/title.svg' },
  { label: 'Type (equinox textless)', url: '/img/frames/m15/equinox/textless/type.svg' },
];

const TOKEN_M15_REGULAR_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'token-m15-w', label: 'White Token Frame', url: '/img/frames/token/m15/regular/w.png' },
  { id: 'token-m15-u', label: 'Blue Token Frame', url: '/img/frames/token/m15/regular/u.png' },
  { id: 'token-m15-b', label: 'Black Token Frame', url: '/img/frames/token/m15/regular/b.png' },
  { id: 'token-m15-r', label: 'Red Token Frame', url: '/img/frames/token/m15/regular/r.png' },
  { id: 'token-m15-g', label: 'Green Token Frame', url: '/img/frames/token/m15/regular/g.png' },
  { id: 'token-m15-m', label: 'Multicolored Token Frame', url: '/img/frames/token/m15/regular/m.png' },
  { id: 'token-m15-a', label: 'Artifact Token Frame', url: '/img/frames/token/m15/regular/a.png' },
  { id: 'token-m15-l', label: 'Land Token Frame', url: '/img/frames/token/m15/regular/l.png' },
  { id: 'token-m15-nyx-w', label: 'White Nyx Token Frame', url: '/img/frames/token/m15/regular/nyx/w.png' },
  { id: 'token-m15-nyx-u', label: 'Blue Nyx Token Frame', url: '/img/frames/token/m15/regular/nyx/u.png' },
  { id: 'token-m15-nyx-b', label: 'Black Nyx Token Frame', url: '/img/frames/token/m15/regular/nyx/b.png' },
  { id: 'token-m15-nyx-r', label: 'Red Nyx Token Frame', url: '/img/frames/token/m15/regular/nyx/r.png' },
  { id: 'token-m15-nyx-g', label: 'Green Nyx Token Frame', url: '/img/frames/token/m15/regular/nyx/g.png' },
  { id: 'token-m15-nyx-m', label: 'Multicolored Nyx Token Frame', url: '/img/frames/token/m15/regular/nyx/m.png' },
  { id: 'token-m15-nyx-a', label: 'Artifact Nyx Token Frame', url: '/img/frames/token/m15/regular/nyx/a.png' },
  { id: 'token-m15-pt-w', label: 'White Power/Toughness', url: '/img/frames/m15/regular/m15PTW.png', bounds: M15_PT_BOUNDS },
  { id: 'token-m15-pt-u', label: 'Blue Power/Toughness', url: '/img/frames/m15/regular/m15PTU.png', bounds: M15_PT_BOUNDS },
  { id: 'token-m15-pt-b', label: 'Black Power/Toughness', url: '/img/frames/m15/regular/m15PTB.png', bounds: M15_PT_BOUNDS },
  { id: 'token-m15-pt-r', label: 'Red Power/Toughness', url: '/img/frames/m15/regular/m15PTR.png', bounds: M15_PT_BOUNDS },
  { id: 'token-m15-pt-g', label: 'Green Power/Toughness', url: '/img/frames/m15/regular/m15PTG.png', bounds: M15_PT_BOUNDS },
  { id: 'token-m15-pt-m', label: 'Multicolored Power/Toughness', url: '/img/frames/m15/regular/m15PTM.png', bounds: M15_PT_BOUNDS },
  { id: 'token-m15-pt-a', label: 'Artifact Power/Toughness', url: '/img/frames/m15/regular/m15PTA.png', bounds: M15_PT_BOUNDS },
  { id: 'token-m15-pt-c', label: 'Colorless Power/Toughness', url: '/img/frames/m15/regular/m15PTC.png', bounds: M15_PT_BOUNDS },
];

const TOKEN_M15_REGULAR_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Pinline (token)', url: '/img/frames/token/m15/regular/pinline.svg' },
  { label: 'Frame (token)', url: '/img/frames/token/m15/regular/frame.svg' },
  { label: 'Token Pinline', url: '/img/frames/token/tokenMaskRegularPinline.png' },
  { label: 'Token Type', url: '/img/frames/token/tokenMaskRegularType.png' },
  { label: 'Token Rules', url: '/img/frames/token/tokenMaskRegularRules.png' },
  { label: 'Title (m15)', url: '/img/frames/m15/regular/m15MaskTitle.png' },
  { label: 'Border (m15)', url: '/img/frames/m15/regular/m15MaskBorder.png' },
];

const M15_PLANESWALKER_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'm15-pw-w', label: 'White Planeswalker Frame', url: '/img/frames/planeswalker/regular/planeswalkerFrameW.png' },
  { id: 'm15-pw-u', label: 'Blue Planeswalker Frame', url: '/img/frames/planeswalker/regular/planeswalkerFrameU.png' },
  { id: 'm15-pw-b', label: 'Black Planeswalker Frame', url: '/img/frames/planeswalker/regular/planeswalkerFrameB.png' },
  { id: 'm15-pw-r', label: 'Red Planeswalker Frame', url: '/img/frames/planeswalker/regular/planeswalkerFrameR.png' },
  { id: 'm15-pw-g', label: 'Green Planeswalker Frame', url: '/img/frames/planeswalker/regular/planeswalkerFrameG.png' },
  { id: 'm15-pw-m', label: 'Multicolored Planeswalker Frame', url: '/img/frames/planeswalker/regular/planeswalkerFrameM.png' },
  { id: 'm15-pw-a', label: 'Artifact Planeswalker Frame', url: '/img/frames/planeswalker/regular/planeswalkerFrameA.png' },
];

const M15_PLANESWALKER_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Pinline (planeswalker)', url: '/img/frames/planeswalker/regular/planeswalkerMaskPinline.png' },
  { label: 'Title (planeswalker)', url: '/img/frames/planeswalker/regular/planeswalkerMaskTitle.png' },
  { label: 'Type (planeswalker)', url: '/img/frames/planeswalker/regular/planeswalkerMaskType.png' },
  { label: 'Frame (planeswalker)', url: '/img/frames/planeswalker/regular/planeswalkerMaskFrame.png' },
  { label: 'Border (planeswalker)', url: '/img/frames/planeswalker/regular/planeswalkerMaskBorder.png' },
  { label: 'Loyalty (planeswalker)', url: '/img/frames/planeswalker/maskLoyalty.png' },
];

const SAGA_REGULAR_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'saga-w', label: 'White Saga Frame', url: '/img/frames/saga/regular/sagaFrameW.png' },
  { id: 'saga-u', label: 'Blue Saga Frame', url: '/img/frames/saga/regular/sagaFrameU.png' },
  { id: 'saga-b', label: 'Black Saga Frame', url: '/img/frames/saga/regular/sagaFrameB.png' },
  { id: 'saga-r', label: 'Red Saga Frame', url: '/img/frames/saga/regular/sagaFrameR.png' },
  { id: 'saga-g', label: 'Green Saga Frame', url: '/img/frames/saga/regular/sagaFrameG.png' },
  { id: 'saga-m', label: 'Multicolored Saga Frame', url: '/img/frames/saga/regular/sagaFrameM.png' },
  { id: 'saga-a', label: 'Artifact Saga Frame', url: '/img/frames/saga/regular/sagaFrameA.png' },
  { id: 'saga-l', label: 'Land Saga Frame', url: '/img/frames/saga/regular/l.png' },
  {
    id: 'saga-mid-stripe',
    label: 'Banner Pinstripe (Multicolored)',
    url: '/img/frames/saga/sagaMidStripe.png',
    bounds: { x: 0.0727, y: 0.3058, width: 0.0087, height: 0.4762 },
  },
  {
    id: 'saga-stamp',
    label: 'Holo Stamp',
    url: '/img/frames/saga/stamp.png',
    bounds: { x: 0.438, y: 0.912, width: 0.124, height: 0.0372 },
  },
];

const SAGA_NYX_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'saga-nyx-w', label: 'White Nyx Saga Frame', url: '/img/frames/saga/nyx/w.png' },
  { id: 'saga-nyx-u', label: 'Blue Nyx Saga Frame', url: '/img/frames/saga/nyx/u.png' },
  { id: 'saga-nyx-b', label: 'Black Nyx Saga Frame', url: '/img/frames/saga/nyx/b.png' },
  { id: 'saga-nyx-r', label: 'Red Nyx Saga Frame', url: '/img/frames/saga/nyx/r.png' },
  { id: 'saga-nyx-g', label: 'Green Nyx Saga Frame', url: '/img/frames/saga/nyx/g.png' },
  { id: 'saga-nyx-m', label: 'Multicolored Nyx Saga Frame', url: '/img/frames/saga/nyx/m.png' },
  { id: 'saga-nyx-a', label: 'Artifact Nyx Saga Frame', url: '/img/frames/saga/nyx/a.png' },
  {
    id: 'saga-nyx-mid-stripe',
    label: 'Banner Pinstripe (Multicolored)',
    url: '/img/frames/saga/sagaMidStripe.png',
    bounds: { x: 0.0727, y: 0.3058, width: 0.0087, height: 0.4762 },
  },
  { id: 'saga-nyx-pt-w', label: 'White Power/Toughness', url: '/img/frames/saga/pt/w.png', bounds: SAGA_NYX_PT_LAYER_BOUNDS },
  { id: 'saga-nyx-pt-u', label: 'Blue Power/Toughness', url: '/img/frames/saga/pt/u.png', bounds: SAGA_NYX_PT_LAYER_BOUNDS },
  { id: 'saga-nyx-pt-b', label: 'Black Power/Toughness', url: '/img/frames/saga/pt/b.png', bounds: SAGA_NYX_PT_LAYER_BOUNDS },
  { id: 'saga-nyx-pt-r', label: 'Red Power/Toughness', url: '/img/frames/saga/pt/r.png', bounds: SAGA_NYX_PT_LAYER_BOUNDS },
  { id: 'saga-nyx-pt-g', label: 'Green Power/Toughness', url: '/img/frames/saga/pt/g.png', bounds: SAGA_NYX_PT_LAYER_BOUNDS },
  { id: 'saga-nyx-pt-m', label: 'Multicolored Power/Toughness', url: '/img/frames/saga/pt/m.png', bounds: SAGA_NYX_PT_LAYER_BOUNDS },
  { id: 'saga-nyx-pt-a', label: 'Artifact Power/Toughness', url: '/img/frames/saga/pt/a.png', bounds: SAGA_NYX_PT_LAYER_BOUNDS },
  {
    id: 'saga-nyx-stamp',
    label: 'Holo Stamp',
    url: '/img/frames/saga/stamp.png',
    bounds: { x: 0.438, y: 0.912, width: 0.124, height: 0.0372 },
  },
];

const SAGA_UB_FRAME_PRESETS: readonly FramePreset[] = [
  { id: 'saga-ub-w', label: 'White Universes Beyond Saga Frame', url: '/img/frames/saga/ub/sagaFrameW.png' },
  { id: 'saga-ub-u', label: 'Blue Universes Beyond Saga Frame', url: '/img/frames/saga/ub/sagaFrameU.png' },
  { id: 'saga-ub-b', label: 'Black Universes Beyond Saga Frame', url: '/img/frames/saga/ub/sagaFrameB.png' },
  { id: 'saga-ub-r', label: 'Red Universes Beyond Saga Frame', url: '/img/frames/saga/ub/sagaFrameR.png' },
  { id: 'saga-ub-g', label: 'Green Universes Beyond Saga Frame', url: '/img/frames/saga/ub/sagaFrameG.png' },
  { id: 'saga-ub-m', label: 'Multicolored Universes Beyond Saga Frame', url: '/img/frames/saga/ub/sagaFrameM.png' },
  { id: 'saga-ub-l', label: 'Land Universes Beyond Saga Frame', url: '/img/frames/saga/ub/l.png' },
  {
    id: 'saga-ub-mid-stripe',
    label: 'Banner Pinstripe (Multicolored)',
    url: '/img/frames/saga/ub/sagaMidStripe.png',
    bounds: { x: 112 / 1500, y: 630 / 2100, width: 15 / 1500, height: 985 / 2100 },
  },
  {
    id: 'saga-ub-stamp',
    label: 'Holo Stamp',
    url: '/img/frames/saga/ub/stamp.png',
    bounds: { x: 666 / 1500, y: 1905 / 2100, width: 171 / 1500, height: 95 / 2100 },
  },
  {
    id: 'saga-ub-stamp-gray',
    label: 'Gray Stamp',
    url: '/img/frames/saga/ub/stampGray.png',
    bounds: { x: 666 / 1500, y: 1905 / 2100, width: 171 / 1500, height: 95 / 2100 },
  },
];

const SAGA_REGULAR_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Pinline (saga)', url: '/img/frames/saga/sagaMaskPinline.png' },
  { label: 'Title (m15)', url: '/img/frames/m15/regular/m15MaskTitle.png' },
  { label: 'Type (saga)', url: '/img/frames/saga/sagaMaskType.png' },
  { label: 'Frame (saga)', url: '/img/frames/saga/sagaMaskFrame.png' },
  { label: 'Banner (saga)', url: '/img/frames/saga/sagaMaskBanner.png' },
  { label: 'Banner Right (saga)', url: '/img/frames/saga/sagaMaskBannerRight.png' },
  { label: 'Text (saga)', url: '/img/frames/saga/sagaMaskText.png' },
  { label: 'Text Right (saga)', url: '/img/frames/saga/sagaMaskTextRight.png' },
  { label: 'Border (saga)', url: '/img/frames/saga/sagaMaskBorder.png' },
];

const SAGA_UB_MASK_PRESETS: readonly FrameMaskPreset[] = [
  { label: 'Pinline (saga UB)', url: '/img/frames/saga/ub/sagaMaskPinline.png' },
  { label: 'Title (saga UB)', url: '/img/frames/saga/ub/sagaMaskTitle.png' },
  { label: 'Type (saga UB)', url: '/img/frames/saga/ub/sagaMaskType.png' },
  { label: 'Frame (saga UB)', url: '/img/frames/saga/ub/sagaMaskFrame.png' },
  { label: 'Banner (saga UB)', url: '/img/frames/saga/ub/sagaMaskBanner.png' },
  { label: 'Banner Right (saga UB)', url: '/img/frames/saga/ub/sagaMaskBannerRight.png' },
  { label: 'Text (saga UB)', url: '/img/frames/saga/ub/sagaMaskText.png' },
  { label: 'Text Right (saga UB)', url: '/img/frames/saga/ub/sagaMaskTextRight.png' },
  { label: 'Border (saga UB)', url: '/img/frames/saga/ub/sagaMaskBorder.png' },
];

interface FramePresetConfigFile {
  readonly masks?: Record<string, readonly FrameMaskPreset[]>;
  readonly sets: Record<string, readonly FramePresetConfigItem[]>;
  readonly packs: Record<string, FramePresetPackConfig>;
}

interface FramePresetConfigItem {
  readonly key: string;
  readonly label: string;
  readonly code?: string;
  readonly filename?: string;
}

interface FramePresetGroupConfig {
  readonly idPrefix: string;
  readonly labelPrefix?: string;
  readonly labelSuffix?: string;
  readonly pathPrefix: string;
  readonly filenamePattern?: string;
  readonly bounds?: string;
  readonly erase?: boolean;
  readonly opacity?: number;
  readonly items: string;
}

interface ConfiguredFramePreset {
  readonly id: string;
  readonly label: string;
  readonly url: string;
  readonly bounds?: string;
  readonly erase?: boolean;
  readonly opacity?: number;
}

interface FramePresetPackConfig {
  readonly layout?: string;
  readonly presets?: readonly ConfiguredFramePreset[];
  readonly presetGroups?: readonly FramePresetGroupConfig[];
  readonly presetsAfter?: readonly ConfiguredFramePreset[];
  readonly masks?: string | readonly FrameMaskPreset[];
}

interface ConfiguredFramePack {
  readonly presets: readonly FramePreset[];
  readonly masks: readonly FrameMaskPreset[];
  readonly layout: FrameLayoutPreset | null;
}

const FRAME_PRESET_CONFIG = framePresetConfig as FramePresetConfigFile;

const CONFIGURED_BOUNDS = {
  fullCard: FULL_CARD_LAYER_BOUNDS,
  m15CustomPtInnerFill: M15_CUSTOM_PT_INNER_FILL_BOUNDS,
  m15FloatingCrown: M15_FLOATING_CROWN_BOUNDS,
  m15FloatingCrownBorderCover: M15_FLOATING_CROWN_BORDER_COVER_BOUNDS,
  m15FloatingCrownCutout: M15_FLOATING_CROWN_CUTOUT_BOUNDS,
  m15FloatingCrownOutline: M15_FLOATING_CROWN_OUTLINE_BOUNDS,
  m15HoloStamp: M15_HOLO_STAMP_BOUNDS,
  m15SmallHoloStamp: M15_SMALL_HOLO_STAMP_BOUNDS,
  m15AcornHoloStamp: M15_ACORN_HOLO_STAMP_BOUNDS,
  m15LegendCrown: M15_LEGEND_CROWN_BOUNDS,
  m15LegendCrownBorderCover: M15_LEGEND_CROWN_BORDER_COVER_BOUNDS,
  m15NicknameCrown: M15_NICKNAME_CROWN_BOUNDS,
  m15NicknameTitle: M15_NICKNAME_TITLE_BOUNDS,
  m15NyxInnerCrown: M15_NYX_INNER_CROWN_BOUNDS,
  m15Pt: M15_PT_BOUNDS,
  m15TransformTypeIcon: M15_TRANSFORM_TYPE_ICON_BOUNDS,
  m15UbFloatingCrown: M15_UB_FLOATING_CROWN_BOUNDS,
  m15UbFloatingCrownCutout: M15_UB_FLOATING_CROWN_CUTOUT_BOUNDS,
  m15UbFloatingCrownOutline: M15_UB_FLOATING_CROWN_OUTLINE_BOUNDS,
  m15UbHoloStamp: M15_UB_HOLO_STAMP_BOUNDS,
  m15UbLegendCrown: M15_UB_LEGEND_CROWN_BOUNDS,
  m15UbLegendCrownBorderCover: M15_UB_LEGEND_CROWN_BORDER_COVER_BOUNDS,
  shortPt: SHORT_PT_LAYER_BOUNDS,
  snowWatermark: SNOW_WATERMARK_LAYER_BOUNDS,
} as const;

const CONFIGURED_LAYOUTS = {
  m15Nickname: M15_NICKNAME_LAYOUT_PRESET,
  m15Regular: M15_REGULAR_LAYOUT_PRESET,
  m15TransformFront: M15_TRANSFORM_FRONT_LAYOUT_PRESET,
  m15TransformBack: M15_TRANSFORM_BACK_LAYOUT_PRESET,
  m15UbExtended: M15_UB_EXTENDED_LAYOUT_PRESET,
  m15UbFull: M15_UB_FULL_LAYOUT_PRESET,
} as const;

const CONFIGURED_FRAME_PACKS = buildConfiguredFramePacks();

function buildConfiguredFramePacks(): Readonly<Record<string, ConfiguredFramePack>> {
  return Object.fromEntries(
    Object.entries(FRAME_PRESET_CONFIG.packs).map(([packId, pack]) => [
      packId,
      {
        presets: [
          ...(pack.presets ?? []).map(expandConfiguredPreset),
          ...(pack.presetGroups ?? []).flatMap(expandConfiguredPresetGroup),
          ...(pack.presetsAfter ?? []).map(expandConfiguredPreset),
        ],
        masks: resolveConfiguredMasks(pack.masks),
        layout: resolveConfiguredLayout(pack.layout),
      },
    ]),
  );
}

function expandConfiguredPresetGroup(group: FramePresetGroupConfig): FramePreset[] {
  const items = FRAME_PRESET_CONFIG.sets[group.items];
  if (!items) throw new Error(`Unknown frame preset item set: ${group.items}`);

  return items.map((item) => ({
    id: `${group.idPrefix}-${item.key}`,
    label: [group.labelPrefix, item.label, group.labelSuffix].filter(Boolean).join(' '),
    url: joinFrameConfigPath(group.pathPrefix, item.filename ?? expandFilenamePattern(group.filenamePattern, item)),
    bounds: resolveConfiguredBounds(group.bounds),
    erase: group.erase,
    opacity: group.opacity,
  }));
}

function expandConfiguredPreset(preset: ConfiguredFramePreset): FramePreset {
  return {
    ...preset,
    bounds: resolveConfiguredBounds(preset.bounds),
  };
}

function expandFilenamePattern(pattern: string | undefined, item: FramePresetConfigItem): string {
  if (!pattern) throw new Error(`Frame preset item ${item.key} needs either filename or filenamePattern.`);

  return pattern.replaceAll('{key}', item.key).replaceAll('{code}', item.code ?? item.key);
}

function joinFrameConfigPath(pathPrefix: string, filename: string): string {
  return `${pathPrefix.replace(/\/$/, '')}/${filename.replace(/^\//, '')}`;
}

function resolveConfiguredBounds(boundsKey: string | undefined): FramePresetBounds | undefined {
  if (!boundsKey) return undefined;
  const bounds = CONFIGURED_BOUNDS[boundsKey as keyof typeof CONFIGURED_BOUNDS];
  if (!bounds) throw new Error(`Unknown frame preset bounds: ${boundsKey}`);
  return bounds;
}

function resolveConfiguredMasks(masks: string | readonly FrameMaskPreset[] | undefined): readonly FrameMaskPreset[] {
  if (!masks) return [];
  if (typeof masks !== 'string') return masks;
  const maskPreset = FRAME_PRESET_CONFIG.masks?.[masks];
  if (!maskPreset) throw new Error(`Unknown frame mask preset: ${masks}`);
  return maskPreset;
}

function resolveConfiguredLayout(layoutKey: string | undefined): FrameLayoutPreset | null {
  if (!layoutKey) return null;
  const layout = CONFIGURED_LAYOUTS[layoutKey as keyof typeof CONFIGURED_LAYOUTS];
  if (!layout) throw new Error(`Unknown frame layout preset: ${layoutKey}`);
  return layout;
}

const FRAME_VERSION_ALIASES = framePresetConfig.aliases as Readonly<Record<string, string>>;

function resolveFrameVersionAlias(frameVersionId: string): string {
  return FRAME_VERSION_ALIASES[frameVersionId] ?? frameVersionId;
}

export function getFramePresets(frameVersionId: string): readonly FramePreset[] {
  const resolvedFrameVersionId = resolveFrameVersionAlias(frameVersionId);
  const configuredPack = CONFIGURED_FRAME_PACKS[resolvedFrameVersionId];
  if (configuredPack) return configuredPack.presets;

  if (resolvedFrameVersionId === 'modal') return MODAL_REGULAR_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'm15Promo') return M15_PROMO_REGULAR_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'm15PromoOpenHouse') return M15_PROMO_OPEN_HOUSE_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'm15PromoNyx') return M15_PROMO_NYX_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'm15PromoExtended') return M15_PROMO_EXTENDED_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'm15PromoGenericShowcase') return M15_PROMO_GENERIC_SHOWCASE_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'm15Textless') return M15_TEXTLESS_GENERIC_SHOWCASE_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'm15TextlessBasics') return M15_TEXTLESS_BASICS_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'm15TextlessBasics2022') return M15_TEXTLESS_BASICS_2022_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'm15TextlessBasics2022UB') return M15_TEXTLESS_BASICS_2022_UB_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'equinoxTextless') return EQUINOX_TEXTLESS_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'm15Planeswalker') return M15_PLANESWALKER_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'short') return M15_EXTENDED_ART_SHORT_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'saga') return SAGA_REGULAR_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'sagaNyx') return SAGA_NYX_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'sagaUB') return SAGA_UB_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'planechase') return PLANECHASE_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'storybook') return STORYBOOK_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'unstable') return UNSTABLE_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'expedition') return EXPEDITION_ZNR_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'ixalan') return IXALAN_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'bleedEdge') return M15_BLEED_EDGE_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'future') return FUTURE_REGULAR_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'legends') return LEGENDS_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'seventh') return SEVENTH_REGULAR_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'seventhTextless') return SEVENTH_TEXTLESS_FRAME_PRESETS;
  if (resolvedFrameVersionId === 'token') return TOKEN_M15_REGULAR_FRAME_PRESETS;
  return [];
}

export function getFrameMaskPresets(frameVersionId: string): readonly FrameMaskPreset[] {
  const resolvedFrameVersionId = resolveFrameVersionAlias(frameVersionId);
  const configuredPack = CONFIGURED_FRAME_PACKS[resolvedFrameVersionId];
  if (configuredPack) return configuredPack.masks;

  if (resolvedFrameVersionId === 'modal') return MODAL_REGULAR_MASK_PRESETS;
  if (resolvedFrameVersionId === 'm15Promo') return M15_PROMO_REGULAR_MASK_PRESETS;
  if (resolvedFrameVersionId === 'm15PromoOpenHouse') return M15_PROMO_FULL_ART_MASK_PRESETS;
  if (resolvedFrameVersionId === 'm15PromoNyx') return M15_PROMO_FULL_ART_MASK_PRESETS;
  if (resolvedFrameVersionId === 'm15PromoExtended') return M15_PROMO_EXTENDED_MASK_PRESETS;
  if (resolvedFrameVersionId === 'm15PromoGenericShowcase') return M15_PROMO_REGULAR_MASK_PRESETS;
  if (resolvedFrameVersionId === 'm15Textless') return M15_TEXTLESS_GENERIC_SHOWCASE_MASK_PRESETS;
  if (resolvedFrameVersionId === 'm15TextlessBasics') return M15_TEXTLESS_BASICS_MASK_PRESETS;
  if (resolvedFrameVersionId === 'm15TextlessBasics2022') return M15_TEXTLESS_BASICS_2022_MASK_PRESETS;
  if (resolvedFrameVersionId === 'm15TextlessBasics2022UB') return M15_TEXTLESS_BASICS_2022_MASK_PRESETS;
  if (resolvedFrameVersionId === 'equinoxTextless') return EQUINOX_TEXTLESS_MASK_PRESETS;
  if (resolvedFrameVersionId === 'm15Planeswalker') return M15_PLANESWALKER_MASK_PRESETS;
  if (resolvedFrameVersionId === 'short') return M15_EXTENDED_ART_SHORT_MASK_PRESETS;
  if (resolvedFrameVersionId === 'saga') return SAGA_REGULAR_MASK_PRESETS;
  if (resolvedFrameVersionId === 'sagaNyx') return SAGA_REGULAR_MASK_PRESETS;
  if (resolvedFrameVersionId === 'sagaUB') return SAGA_UB_MASK_PRESETS;
  if (resolvedFrameVersionId === 'planechase') return [];
  if (resolvedFrameVersionId === 'storybook') return STORYBOOK_MASK_PRESETS;
  if (resolvedFrameVersionId === 'unstable') return UNSTABLE_MASK_PRESETS;
  if (resolvedFrameVersionId === 'expedition') return EXPEDITION_ZNR_MASK_PRESETS;
  if (resolvedFrameVersionId === 'ixalan') return [];
  if (resolvedFrameVersionId === 'bleedEdge') return M15_NEW_MASK_PRESETS;
  if (resolvedFrameVersionId === 'future') return FUTURE_REGULAR_MASK_PRESETS;
  if (resolvedFrameVersionId === 'legends') return [];
  if (resolvedFrameVersionId === 'seventh') return SEVENTH_REGULAR_MASK_PRESETS;
  if (resolvedFrameVersionId === 'seventhTextless') return SEVENTH_TEXTLESS_MASK_PRESETS;
  if (resolvedFrameVersionId === 'token') return TOKEN_M15_REGULAR_MASK_PRESETS;
  return [];
}

export function getFrameLayoutPreset(frameVersionId: string): FrameLayoutPreset | null {
  const resolvedFrameVersionId = resolveFrameVersionAlias(frameVersionId);
  const configuredPack = CONFIGURED_FRAME_PACKS[resolvedFrameVersionId];
  if (configuredPack) return configuredPack.layout;

  if (resolvedFrameVersionId === 'modal') return MODAL_REGULAR_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'm15Promo') return M15_PROMO_REGULAR_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'm15PromoOpenHouse') return M15_PROMO_FULL_ART_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'm15PromoNyx') return M15_PROMO_FULL_ART_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'm15PromoExtended') return M15_PROMO_EXTENDED_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'm15PromoGenericShowcase') return M15_PROMO_GENERIC_SHOWCASE_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'm15Textless') return M15_TEXTLESS_GENERIC_SHOWCASE_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'm15TextlessBasics') return M15_TEXTLESS_BASICS_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'm15TextlessBasics2022') return M15_TEXTLESS_BASICS_2022_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'm15TextlessBasics2022UB') return M15_TEXTLESS_BASICS_2022_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'equinoxTextless') return EQUINOX_TEXTLESS_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'm15Planeswalker') return M15_PLANESWALKER_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'short') return M15_EXTENDED_ART_SHORT_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'saga') return SAGA_REGULAR_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'sagaNyx') return SAGA_NYX_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'sagaUB') return SAGA_UB_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'planechase') return PLANECHASE_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'storybook') return STORYBOOK_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'unstable') return UNSTABLE_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'expedition') return EXPEDITION_ZNR_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'ixalan') return IXALAN_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'bleedEdge') return M15_BLEED_EDGE_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'future') return FUTURE_REGULAR_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'legends') return LEGENDS_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'seventh') return SEVENTH_REGULAR_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'seventhTextless') return SEVENTH_TEXTLESS_LAYOUT_PRESET;
  if (resolvedFrameVersionId === 'token') return TOKEN_M15_REGULAR_LAYOUT_PRESET;
  return null;
}
