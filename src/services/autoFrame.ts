import { getFramePresets, type FramePreset } from '@/services/framePresets';
import type { CardFace, FrameColor, FrameLayer } from '@/types/cardData';

export const AUTO_FRAME_LAYER_ID_PREFIX = 'autoframe-';

export type AutoFrameMode =
  | 'off'
  | 'm15'
  | 'extended'
  | 'short'
  | 'universesBeyond'
  | 'etched'
  | 'borderless'
  | 'borderlessUniversesBeyond'
  | 'phyrexian'
  | 'eighth'
  | 'm15Promo'
  | 'm15PromoExtended'
  | 'm15PromoGenericShowcase'
  | 'bleedEdge'
  | 'showcase'
  | 'invocation'
  | 'custom'
  | 'circuit'
  | 'm15Eighth'
  | 'm15EighthUniversesBeyond'
  | 'storybook'
  | 'future'
  | 'ixalan'
  | 'seventh'
  | 'token';

export const AUTO_FRAME_MODE_OPTIONS: readonly {
  readonly id: AutoFrameMode;
  readonly label: string;
  readonly disabled?: boolean;
}[] = [
  { id: 'off', label: '禁用' },
  { id: 'm15', label: '标准' },
  { id: 'extended', label: '扩展艺术' },
  { id: 'short', label: '扩展艺术（短文本框）' },
  { id: 'universesBeyond', label: 'Universes Beyond' },
  { id: 'etched', label: '蚀刻' },
  { id: 'borderless', label: '无边框（修改）' },
  { id: 'borderlessUniversesBeyond', label: '无边框（修改）(无疆新宇宙)' },
  { id: 'phyrexian', label: 'Phyrexian' },
  { id: 'eighth', label: 'Eighth Edition' },
  { id: 'seventh', label: 'Seventh Edition' },
  { id: 'showcase', label: 'Showcase frames', disabled: true },
  { id: 'invocation', label: 'Invocation' },
  { id: 'custom', label: 'Custom frames', disabled: true },
  { id: 'circuit', label: 'Circuit' },
  { id: 'm15Eighth', label: 'M15-Eighth' },
  { id: 'm15EighthUniversesBeyond', label: 'M15-Eighth Universes Beyond' },
];

export interface AutoFrameOptions {
  readonly mode: AutoFrameMode;
  readonly alwaysNyx: boolean;
}

export interface AutoFrameResult {
  readonly frameVersionId: string;
  readonly frameUrl: string;
  readonly frameColor: FrameColor;
  readonly frameLayers: readonly FrameLayer[];
}

interface FrameAnalysis {
  readonly colors: readonly ManaColor[];
  readonly frameColor: FrameColor;
  readonly primaryVariant: string;
  readonly ptVariant: string;
  readonly isCreatureLike: boolean;
  readonly isEnchantment: boolean;
  readonly isLegendary: boolean;
  readonly isLand: boolean;
  readonly isVehicle: boolean;
  readonly typeIcon: IxalanTypeIcon | null;
}

interface AutoFrameConfig {
  readonly frameVersionId: string;
  readonly primaryPrefix: string;
  readonly ptPrefix?: string;
  readonly extraPtFrameVersionIds?: readonly string[];
  readonly landStyle?: 'single' | 'suffix-l' | 'prefix-l';
  readonly supportsVehicle?: boolean;
  readonly supportsColorless?: boolean;
  readonly typeIconPrefix?: string;
  readonly nyxCrownPrefix?: string;
}

type ManaColor = 'W' | 'U' | 'B' | 'R' | 'G';
type IxalanTypeIcon = 'creature' | 'instant' | 'sorcery' | 'enchantment' | 'artifact' | 'multi';

const MANA_COLORS: readonly ManaColor[] = ['W', 'U', 'B', 'R', 'G'];
const BASIC_LAND_COLOR_WORDS: Readonly<Record<ManaColor, readonly string[]>> = {
  W: ['plains', '平原'],
  U: ['island', '海岛'],
  B: ['swamp', '沼泽'],
  R: ['mountain', '山脉'],
  G: ['forest', '树林', '森林'],
};

export function resolveAutoFrame(face: CardFace, options: AutoFrameOptions): AutoFrameResult | null {
  if (options.mode === 'off') return null;

  const analysis = analyzeFace(face);
  const config = getAutoFrameConfig(options.mode, analysis, options.alwaysNyx);
  const presets = getFramePresets(config.frameVersionId);
  const primaryPreset = findPresetByIds(presets, primaryPresetIds(config, analysis)) ?? findFallbackPrimaryPreset(presets);
  if (!primaryPreset) return null;

  const frameLayers = [
    ...optionalPresetLayer(presets, nyxCrownPresetIds(config, analysis)),
    ...optionalPresetLayer(getPtPresets(config), ptPresetIds(config, analysis), analysis.isCreatureLike),
    ...optionalPresetLayer(presets, typeIconPresetIds(config, analysis), analysis.typeIcon !== null),
  ];

  return {
    frameVersionId: config.frameVersionId,
    frameUrl: primaryPreset.url,
    frameColor: analysis.frameColor,
    frameLayers,
  };
}

export function mergeAutoFrameLayers(
  existingLayers: readonly FrameLayer[] | null | undefined,
  autoLayers: readonly FrameLayer[],
): readonly FrameLayer[] {
  return [
    ...(existingLayers ?? []).filter((layer) => !layer.id.startsWith(AUTO_FRAME_LAYER_ID_PREFIX)),
    ...autoLayers,
  ];
}

function analyzeFace(face: CardFace): FrameAnalysis {
  const typeLine = face.typeLine.toLowerCase();
  const rulesText = face.rulesText.toLowerCase();
  const isLand = includesAny(typeLine, ['land', '地']);
  const isArtifact = includesAny(typeLine, ['artifact', '神器']);
  const isVehicle = includesAny(typeLine, ['vehicle', '载具']);
  const isEnchantment = includesAny(typeLine, ['enchantment', '结界']);
  const isLegendary = includesAny(typeLine, ['legendary', '传奇']);
  const isCreatureLike = Boolean(face.powerToughness?.trim()) || includesAny(typeLine, ['creature', '生物', 'vehicle', '载具']);
  const colors = isLand ? detectLandColors(face) : detectManaCostColors(face.manaCost ?? '');
  const colorless = colors.length === 0 || includesAny(rulesText, ['devoid', '虚色']);
  const frameColor = resolveFrameColor(colors, { isLand, isArtifact, isVehicle, colorless });
  const primaryVariant = resolvePrimaryVariant(frameColor, colors, { isLand, isVehicle });
  const ptVariant = resolvePtVariant(frameColor, { isVehicle });

  return {
    colors,
    frameColor,
    primaryVariant,
    ptVariant,
    isCreatureLike,
    isEnchantment,
    isLegendary,
    isLand,
    isVehicle,
    typeIcon: resolveIxalanTypeIcon(typeLine),
  };
}

function getAutoFrameConfig(mode: Exclude<AutoFrameMode, 'off'>, analysis: FrameAnalysis, alwaysNyx: boolean): AutoFrameConfig {
  const useNyx = analysis.isEnchantment && (alwaysNyx || analysis.isCreatureLike);
  if (mode === 'm15' && useNyx) {
    return {
      frameVersionId: 'm15Nyx',
      primaryPrefix: 'm15-nyx',
      ptPrefix: 'm15-pt',
      extraPtFrameVersionIds: ['m15'],
      nyxCrownPrefix: 'm15-nyx-crown',
      supportsColorless: false,
    };
  }
  if (mode === 'm15') {
    return {
      frameVersionId: 'm15',
      primaryPrefix: 'm15',
      ptPrefix: 'm15-pt',
      landStyle: 'single',
      supportsVehicle: true,
    };
  }
  if (mode === 'extended') {
    return {
      frameVersionId: 'm15PromoExtended',
      primaryPrefix: 'm15-promo-extended',
      ptPrefix: 'm15-promo-extended-pt',
      landStyle: 'single',
      supportsVehicle: true,
      supportsColorless: true,
    };
  }
  if (mode === 'short') {
    return {
      frameVersionId: 'short',
      primaryPrefix: 'short',
      ptPrefix: 'short-pt',
      landStyle: 'suffix-l',
    };
  }
  if (mode === 'universesBeyond' || mode === 'm15EighthUniversesBeyond') {
    return {
      frameVersionId: 'm15UB',
      primaryPrefix: 'm15-ub',
      ptPrefix: 'm15-ub-pt',
      landStyle: 'single',
      supportsVehicle: true,
      supportsColorless: true,
    };
  }
  if (mode === 'borderlessUniversesBeyond') {
    return {
      frameVersionId: 'm15UBFull',
      primaryPrefix: 'm15-ub-full',
      ptPrefix: 'm15-ub-pt',
      landStyle: 'single',
      supportsVehicle: true,
      supportsColorless: true,
    };
  }
  if (mode === 'etched' || mode === 'phyrexian' || mode === 'invocation' || mode === 'custom' || mode === 'circuit' || mode === 'm15Eighth') {
    return {
      frameVersionId: 'm15',
      primaryPrefix: 'm15',
      ptPrefix: 'm15-pt',
      landStyle: 'single',
      supportsVehicle: true,
    };
  }
  if (mode === 'eighth') {
    return {
      frameVersionId: 'seventh',
      primaryPrefix: 'seventh',
      landStyle: 'suffix-l',
      supportsColorless: true,
    };
  }
  if (mode === 'm15Promo' && useNyx) {
    return {
      frameVersionId: 'm15PromoNyx',
      primaryPrefix: 'm15-promo-nyx',
      ptPrefix: 'm15-promo-nyx-pt',
      landStyle: 'single',
      supportsVehicle: true,
      supportsColorless: true,
    };
  }
  if (mode === 'm15Promo') {
    return {
      frameVersionId: 'm15Promo',
      primaryPrefix: 'm15-promo',
      ptPrefix: 'm15-promo-pt',
      landStyle: 'single',
    };
  }
  if (mode === 'm15PromoExtended') {
    return {
      frameVersionId: 'm15PromoExtended',
      primaryPrefix: 'm15-promo-extended',
      ptPrefix: 'm15-promo-extended-pt',
      landStyle: 'single',
      supportsVehicle: true,
      supportsColorless: true,
    };
  }
  if (mode === 'm15PromoGenericShowcase' || mode === 'showcase') {
    return {
      frameVersionId: 'm15PromoGenericShowcase',
      primaryPrefix: 'm15-promo-generic-showcase',
      ptPrefix: 'm15-promo-generic-showcase-pt',
    };
  }
  if (mode === 'bleedEdge' || mode === 'borderless') {
    return {
      frameVersionId: 'bleedEdge',
      primaryPrefix: 'bleed-edge',
      ptPrefix: 'bleed-edge-pt',
      landStyle: 'prefix-l',
      supportsVehicle: true,
      supportsColorless: true,
    };
  }
  if (mode === 'storybook') {
    return {
      frameVersionId: 'storybook',
      primaryPrefix: 'storybook',
      ptPrefix: 'storybook-pt',
      supportsColorless: true,
    };
  }
  if (mode === 'future') {
    return {
      frameVersionId: 'future',
      primaryPrefix: 'future',
      ptPrefix: 'future-pt',
      landStyle: 'single',
      supportsColorless: true,
    };
  }
  if (mode === 'ixalan') {
    return {
      frameVersionId: 'ixalan',
      primaryPrefix: 'ixalan',
      ptPrefix: 'ixalan-pt',
      landStyle: 'single',
      typeIconPrefix: 'ixalan-icon',
    };
  }
  if (mode === 'seventh') {
    return {
      frameVersionId: 'seventh',
      primaryPrefix: 'seventh',
      landStyle: 'suffix-l',
      supportsColorless: true,
    };
  }
  if (mode === 'token' && useNyx) {
    return {
      frameVersionId: 'token',
      primaryPrefix: 'token-m15-nyx',
      ptPrefix: 'token-m15-pt',
    };
  }
  return {
    frameVersionId: 'token',
    primaryPrefix: 'token-m15',
    ptPrefix: 'token-m15-pt',
    landStyle: 'single',
  };
}

function detectManaCostColors(manaCost: string): readonly ManaColor[] {
  return uniqueColors(Array.from(manaCost.toUpperCase()).filter((char): char is ManaColor => isManaColor(char)));
}

function detectLandColors(face: CardFace): readonly ManaColor[] {
  const colors: ManaColor[] = [];
  const typeAndRules = `${face.typeLine}\n${stripFlavorText(face.rulesText)}`.toLowerCase();
  if (
    includesAny(typeAndRules, [
      'any color',
      'any one color',
      'choose a color',
      'any combination of colors',
      '任意颜色',
      '选择一种颜色',
      '颜色组合',
    ])
  ) {
    return MANA_COLORS;
  }

  for (const line of typeAndRules.split(/\r?\n/)) {
    const addIndex = firstPresentIndex(line, ['add', '加']);
    if (addIndex === -1) continue;
    colors.push(...readBracedColors(line.slice(addIndex)));
  }

  for (const color of MANA_COLORS) {
    if (colors.includes(color)) continue;
    if (BASIC_LAND_COLOR_WORDS[color].some((word) => typeAndRules.includes(word))) {
      colors.push(color);
    }
  }

  return uniqueColors(colors);
}

function stripFlavorText(rulesText: string): string {
  return rulesText.split(/\{(?:old)?flavor\}/i)[0] ?? rulesText;
}

function readBracedColors(text: string): readonly ManaColor[] {
  const colors: ManaColor[] = [];
  const matches = text.toUpperCase().matchAll(/\{([^}]+)\}/g);
  for (const match of matches) {
    const symbol = match[1] ?? '';
    for (const char of symbol) {
      if (isManaColor(char)) colors.push(char);
    }
  }
  return uniqueColors(colors);
}

function resolveFrameColor(
  colors: readonly ManaColor[],
  flags: { readonly isLand: boolean; readonly isArtifact: boolean; readonly isVehicle: boolean; readonly colorless: boolean },
): FrameColor {
  if (!flags.colorless && colors.length === 1) return colors[0] ?? 'C';
  if (!flags.colorless && colors.length > 1) return 'M';
  if (flags.isLand) return 'L';
  if (flags.isArtifact || flags.isVehicle) return 'A';
  return 'C';
}

function resolvePrimaryVariant(
  frameColor: FrameColor,
  colors: readonly ManaColor[],
  flags: { readonly isLand: boolean; readonly isVehicle: boolean },
): string {
  if (flags.isVehicle && colors.length === 0) return 'v';
  return frameColor.toLowerCase();
}

function resolvePtVariant(frameColor: FrameColor, flags: { readonly isVehicle: boolean }): string {
  if (flags.isVehicle) return 'v';
  return frameColor === 'L' ? 'c' : frameColor.toLowerCase();
}

function primaryPresetIds(config: AutoFrameConfig, analysis: FrameAnalysis): readonly string[] {
  const variant = resolveConfiguredPrimaryVariant(config, analysis);
  const fallbackVariants = [
    variant,
    analysis.primaryVariant,
    analysis.frameColor.toLowerCase(),
    analysis.frameColor === 'C' ? 'a' : 'm',
    'm',
    'a',
    'c',
  ];
  return uniqueStrings(fallbackVariants).map((candidate) => `${config.primaryPrefix}-${candidate}`);
}

function resolveConfiguredPrimaryVariant(config: AutoFrameConfig, analysis: FrameAnalysis): string {
  if (analysis.isLand) {
    if (config.landStyle === 'suffix-l') {
      return landColorVariant(analysis.colors, 'suffix-l');
    }
    if (config.landStyle === 'prefix-l') {
      return landColorVariant(analysis.colors, 'prefix-l');
    }
    if (config.landStyle === 'single') {
      return 'l';
    }
  }
  if (analysis.isVehicle && !config.supportsVehicle) return 'a';
  if (analysis.frameColor === 'C' && !config.supportsColorless) return 'a';
  return analysis.primaryVariant;
}

function landColorVariant(colors: readonly ManaColor[], style: 'suffix-l' | 'prefix-l'): string {
  const color = colors.length === 1 ? colors[0]?.toLowerCase() : colors.length > 1 ? 'm' : '';
  if (!color) return 'l';
  return style === 'suffix-l' ? `${color}l` : `l${color}`;
}

function ptPresetIds(config: AutoFrameConfig, analysis: FrameAnalysis): readonly string[] {
  if (!config.ptPrefix) return [];
  const variants = [
    analysis.ptVariant,
    analysis.frameColor.toLowerCase(),
    analysis.frameColor === 'C' ? 'a' : 'm',
    'm',
    'a',
    'c',
  ];
  return uniqueStrings(variants).map((variant) => `${config.ptPrefix}-${variant}`);
}

function typeIconPresetIds(config: AutoFrameConfig, analysis: FrameAnalysis): readonly string[] {
  if (!config.typeIconPrefix || !analysis.typeIcon) return [];
  return [`${config.typeIconPrefix}-${analysis.typeIcon}`];
}

function nyxCrownPresetIds(config: AutoFrameConfig, analysis: FrameAnalysis): readonly string[] {
  if (!config.nyxCrownPrefix || !analysis.isLegendary) return [];
  const variant = analysis.frameColor === 'L' || analysis.frameColor === 'C' ? 'm' : analysis.frameColor.toLowerCase();
  return [`${config.nyxCrownPrefix}-${variant}`, `${config.nyxCrownPrefix}-m`];
}

function getPtPresets(config: AutoFrameConfig): readonly FramePreset[] {
  const frameVersionIds = [config.frameVersionId, ...(config.extraPtFrameVersionIds ?? [])];
  return frameVersionIds.flatMap((frameVersionId) => [...getFramePresets(frameVersionId)]);
}

function optionalPresetLayer(
  presets: readonly FramePreset[],
  ids: readonly string[],
  enabled = true,
): readonly FrameLayer[] {
  if (!enabled || ids.length === 0) return [];
  const preset = findPresetByIds(presets, ids);
  return preset ? [frameLayerFromPreset(preset)] : [];
}

function frameLayerFromPreset(preset: FramePreset): FrameLayer {
  return {
    id: `${AUTO_FRAME_LAYER_ID_PREFIX}${preset.id}`,
    name: preset.label,
    url: preset.url,
    bounds: preset.bounds ?? null,
    visible: true,
    opacity: preset.opacity ?? 1,
    erase: preset.erase ?? false,
    preserveAlpha: false,
    colorOverlayEnabled: false,
    colorOverlay: '#000000',
    hslHue: 0,
    hslSaturation: 0,
    hslLightness: 0,
  };
}

function findPresetByIds(presets: readonly FramePreset[], ids: readonly string[]): FramePreset | null {
  for (const id of ids) {
    const preset = presets.find((item) => item.id === id);
    if (preset) return preset;
  }
  return null;
}

function findFallbackPrimaryPreset(presets: readonly FramePreset[]): FramePreset | null {
  return (
    presets.find(
      (preset) =>
        !preset.bounds &&
        !preset.erase &&
        !preset.id.includes('-pt-') &&
        !preset.id.includes('icon') &&
        !preset.id.includes('holo') &&
        !preset.id.includes('outline'),
    ) ?? null
  );
}

function resolveIxalanTypeIcon(typeLine: string): IxalanTypeIcon | null {
  const matches: IxalanTypeIcon[] = [];
  if (includesAny(typeLine, ['creature', '生物'])) matches.push('creature');
  if (includesAny(typeLine, ['instant', '瞬间'])) matches.push('instant');
  if (includesAny(typeLine, ['sorcery', '法术'])) matches.push('sorcery');
  if (includesAny(typeLine, ['enchantment', '结界'])) matches.push('enchantment');
  if (includesAny(typeLine, ['artifact', '神器'])) matches.push('artifact');
  if (matches.length > 1) return 'multi';
  return matches[0] ?? null;
}

function includesAny(value: string, needles: readonly string[]): boolean {
  return needles.some((needle) => value.includes(needle));
}

function firstPresentIndex(value: string, needles: readonly string[]): number {
  const indexes = needles.map((needle) => value.indexOf(needle)).filter((index) => index >= 0);
  return indexes.length > 0 ? Math.min(...indexes) : -1;
}

function isManaColor(value: string): value is ManaColor {
  return (MANA_COLORS as readonly string[]).includes(value);
}

function uniqueColors(colors: readonly ManaColor[]): readonly ManaColor[] {
  return MANA_COLORS.filter((color) => colors.includes(color));
}

function uniqueStrings(values: readonly string[]): readonly string[] {
  return Array.from(new Set(values.filter(Boolean)));
}
