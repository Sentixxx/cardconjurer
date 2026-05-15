import { Fragment, useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type JSX, type MouseEvent } from 'react';
import type {
  CardFace,
  CardLayout,
  CardRegionBounds,
  CustomTextLayer,
  FrameColor,
  FrameLayer,
  FrameLayerBounds,
  FrameLayerMask,
} from '@/types/cardData';
import type { FrameVersion, FrameVersionGroup } from '@/types/template';
import type { ImageAssetState } from '@/types/asset';
import type { AutoFrameMode } from '@/services/autoFrame';
import { CREATOR_FRAME_MASK_ASSETS } from '@/services/creatorAssets';
import { getFrameLayoutPreset, getFrameMaskPresets, getFramePresets, type FramePreset } from '@/services/framePresets';
import { searchScryfallArt, type ScryfallArtCandidate } from '@/services/scryfall';
import { readFileAsDataUrl } from '@/utils/download';
import { CreatorCollapsible } from '@/features/creator/components/CreatorCollapsible';

export type CardFaceFormSection = 'frame' | 'text' | 'art';

const FRAME_GROUP_LABELS: Readonly<Record<FrameVersionGroup, string>> = {
  Regular: '常规',
  Token: '衍生物',
  Saga: '传记',
  Planeswalker: '鹏洛客',
  DFC: '双面',
  Transform: '转化',
  Showcase: 'Showcase牌框',
  UniversesBeyond: '无疆新宇宙',
  Promo: 'Promos (Tall Art)',
  Textless: '无文本/全卡图',
  Custom: '自定义',
  Misc: '旧/其他',
  Accurate: '准确牌框',
  Margin: '1/8英寸边距',
  FleshAndBlood: 'Flesh and Blood',
};

const FRAME_GROUP_ORDER: readonly FrameVersionGroup[] = [
  'Regular',
  'Token',
  'Saga',
  'Planeswalker',
  'DFC',
  'Transform',
  'Showcase',
  'UniversesBeyond',
  'Promo',
  'Textless',
  'Custom',
  'Misc',
  'Accurate',
  'Margin',
  'FleshAndBlood',
];

type FrameGroupSelectItem =
  | { readonly kind: 'separator'; readonly id: string; readonly label: string }
  | { readonly kind: 'group'; readonly group: FrameVersionGroup };
type CustomFramePreset = FramePreset & { readonly packId: string };

const FRAME_GROUP_SELECT_ITEMS: readonly FrameGroupSelectItem[] = [
  { kind: 'separator', id: 'standard', label: '标准牌框' },
  ...FRAME_GROUP_ORDER.slice(0, 6).map((group) => ({ kind: 'group' as const, group })),
  { kind: 'separator', id: 'special', label: '特殊牌框' },
  ...FRAME_GROUP_ORDER.slice(6, 10).map((group) => ({ kind: 'group' as const, group })),
  { kind: 'separator', id: 'other', label: '其他牌框' },
  ...FRAME_GROUP_ORDER.slice(10, 14).map((group) => ({ kind: 'group' as const, group })),
  { kind: 'separator', id: 'other-games', label: '其他游戏' },
  ...FRAME_GROUP_ORDER.slice(14).map((group) => ({ kind: 'group' as const, group })),
];

const REGULAR_FRAME_PACK_SEPARATORS: Readonly<Record<string, string>> = {
  m15LegendCrowns: 'Addons',
  m15Lands: 'Other Frames',
  m15BrawlLegendCrowns: 'Custom Addons',
};

const NO_FRAME_MASK_PRESET = { label: '无蒙版', url: '' } as const;
const FRAME_SPLIT_MASKS = CREATOR_FRAME_MASK_ASSETS.split;
const EMPTY_MASK_PREVIEW_URL = CREATOR_FRAME_MASK_ASSETS.emptyPreviewUrl;

const M15_ART_BOUNDS: CardRegionBounds = {
  x: 0.0767,
  y: 0.1129,
  width: 0.8476,
  height: 0.4429,
};

const M15_RULES_BOUNDS: CardRegionBounds = {
  x: 0.086,
  y: 0.6303,
  width: 0.828,
  height: 0.2875,
};

const M15_MANA_BOUNDS: CardRegionBounds = {
  x: 0,
  y: 0.0613,
  width: 0.9292,
  height: 71 / 2100,
};

const M15_TITLE_BOUNDS: CardRegionBounds = {
  x: 0.0854,
  y: 0.0522,
  width: 0.8292,
  height: 0.0543,
};

const M15_TYPE_BOUNDS: CardRegionBounds = {
  x: 0.0854,
  y: 0.5664,
  width: 0.8292,
  height: 0.0543,
};

const M15_PT_BOUNDS: CardRegionBounds = {
  x: 0.7928,
  y: 0.902,
  width: 0.1367,
  height: 0.0372,
};

const M15_LOYALTY_BOUNDS: CardRegionBounds = {
  x: 0.806,
  y: 0.902,
  width: 0.14,
  height: 0.0372,
};

const CUSTOM_TEXT_BOUNDS: CardRegionBounds = {
  x: 0.1,
  y: 0.64,
  width: 0.8,
  height: 0.12,
};

const NICKNAME_TEXT_BOUNDS: CardRegionBounds = {
  x: 0.14,
  y: 0.1129,
  width: 0.72,
  height: 0.0243,
};

const DATE_STAMP_TEXT_BOUNDS: CardRegionBounds = {
  x: 0.11,
  y: 0.5072,
  width: 0.78,
  height: 0.0286,
};

type CustomTextLayerPreset = 'custom' | 'nickname' | 'powerToughness' | 'dateStamp';
type BuiltInTextTargetId = 'manaCost' | 'name' | 'typeLine' | 'rulesText' | 'powerToughness';
type TextEditorTargetId = BuiltInTextTargetId | `custom:${string}`;
type TextFormatDirective = 'italic' | 'bold';
type TextReferenceRow = {
  readonly code: string;
  readonly result: string;
};

interface RulesAndFlavorText {
  readonly rulesText: string;
  readonly flavorText: string | null;
}

type CardRegionField =
  | 'artBounds'
  | 'manaBounds'
  | 'titleBounds'
  | 'typeBounds'
  | 'rulesBounds'
  | 'powerToughnessBounds'
  | 'loyaltyBounds';

const BUILT_IN_TEXT_TARGETS: readonly { id: BuiltInTextTargetId; label: string }[] = [
  { id: 'manaCost', label: 'Mana Cost' },
  { id: 'name', label: 'Title' },
  { id: 'typeLine', label: 'Type' },
  { id: 'rulesText', label: 'Rules Text' },
  { id: 'powerToughness', label: 'Power/Toughness' },
];

const TEXT_CODE_REFERENCE: readonly TextReferenceRow[] = [
  { code: '{cardname}', result: '插入卡片名称（或使用波浪号：~）' },
  { code: '{Lins}', result: '在左边插入一个小空间' },
  { code: '{Rins}', result: '在左边删除一个小空间' },
  { code: '{-}', result: '插入一个em-dash' },
  { code: '{i}', result: '斜体化文本' },
  { code: '{/i}', result: '移除斜体' },
  { code: '{bold}', result: '加粗文本' },
  { code: '{/bold}', result: '移除加粗' },
  { code: '{lns}', result: '移动到下一行，不带额外空间（代表行-无空间）' },
  { code: '{divider}', result: '移动到下一行并绘制风味文本条' },
  { code: '{flavor}', result: '移动到下一行，绘制风味文本条，并斜体化' },
  { code: '{oldflavor}', result: '斜体化并添加换行符' },
  { code: '{linespacing#num}', result: '更改行距为#num' },
  { code: '{fontsize#pt}', result: '将字体大小更改为#pt（绝对）' },
  { code: '{fontsize#}', result: "将字体大小更改为#像素（相对 - 使用负整数缩小文本 - ie '{fontsize-12}')" },
  { code: '{fontcolor___}', result: "将字体颜色更改为___（ie '{fontcolor#00FF00}'）" },
  { code: '{left}', result: '将文本对齐到左边' },
  { code: '{center}', result: '将文本对齐到中心' },
  { code: '{right}', result: '将文本对齐到右边' },
  { code: '{justify-left}', result: '将文本对齐到左边' },
  { code: '{justify-center}', result: '将文本对齐到中心' },
  { code: '{justify-right}', result: '将文本对齐到右边' },
  { code: '{permashift#,$}', result: '移动文本#像素右移$像素。推荐用于移动文本到较大距离' },
  { code: '{up#}', result: '移动文本#像素向上' },
  { code: '{down#}', result: '移动文本#像素向下' },
  { code: '{left#}', result: '移动文本#像素向左' },
  { code: '{right#}', result: '移动文本#像素向右' },
  { code: '{shadow#}', result: '更改阴影距离为#（使用{shadow0}移除阴影）' },
  { code: '{shadowcolor#}', result: '更改阴影颜色为#' },
  { code: '{indent}', result: '将段落缩进到当前点' },
  { code: '{/indent}', result: '移除段落缩进' },
  { code: '{kerning#}', result: '更改字距为#' },
  { code: '{roll___}', result: '用于骰子卡（如AFR）- 无论你填入什么，都会加粗，交替段落会变暗。' },
];

const MANA_SYMBOL_REFERENCE: readonly TextReferenceRow[] = [
  { code: '{1}, {2}... {20}', result: '通用法术力（适用于1到20）' },
  { code: '{w}, {u}, {b}, {r}, {g}', result: '五色法术力' },
  { code: '{wu}, {wb}, {ub}... {2w}, {2u}...', result: '混血法术力' },
  { code: '{pw}, {pu}...', result: '非瑞法术力' },
  { code: '{wup}, {wbp}, {ubp}...', result: '三色混血法术力' },
  { code: '{t}, {untap}', result: '相应的横置/重置符号' },
  { code: '{oldtap}, {originaltap}', result: '旧的横置/重置符号' },
  { code: '{x}, {y}, {z}', result: '相应的变量相关符号' },
  { code: '{c}', result: '无色法术力' },
  { code: '{s}', result: '雪法术力' },
  { code: '{e}', result: '能量' },
  { code: '{+1}', result: '+1忠诚指示物' },
  { code: '{planeswalker}', result: '鹏洛客标志' },
  { code: '{chaos}', result: '混沌标（Planechase）' },
  { code: '{p}', result: 'BLB爪印符号' },
];

export interface CardFaceFormProps {
  readonly section: CardFaceFormSection;
  readonly face: CardFace;
  readonly versions: readonly FrameVersion[];
  readonly art: ImageAssetState;
  readonly frame: ImageAssetState;
  readonly fallbackFrameVersionId: string;
  readonly cardWidth: number;
  readonly cardHeight: number;
  readonly selectedFrameLayerId?: string | null;
  readonly autoLoadFrameVersion?: boolean;
  readonly autoFrameMode?: AutoFrameMode;
  readonly autoFrameAlwaysNyx?: boolean;
  readonly artist?: string | null;
  readonly onArtistFound?: (artist: string | null) => void;
  readonly onArtistChange?: (artist: string | null) => void;
  readonly onSelectFrameLayer?: (id: string | null) => void;
  readonly onAutoLoadFrameVersionChange?: (value: boolean) => void;
  readonly onAutoFrameModeChange?: (mode: AutoFrameMode) => void;
  readonly onAutoFrameAlwaysNyxChange?: (value: boolean) => void;
  readonly onApplyAutoFrame?: () => void;
  readonly setField: <K extends keyof CardFace>(key: K, value: CardFace[K]) => void;
  readonly setFields: (fields: Partial<CardFace>) => void;
}

export function CardFaceForm(props: CardFaceFormProps): JSX.Element {
  const {
    section,
    face,
    versions,
    frame,
    fallbackFrameVersionId,
    cardWidth,
    cardHeight,
    selectedFrameLayerId,
    autoLoadFrameVersion = true,
    artist,
    onArtistFound,
    onArtistChange,
    onSelectFrameLayer,
    onAutoLoadFrameVersionChange,
    setField,
    setFields,
  } = props;
  const textEditorRef = useRef<HTMLTextAreaElement | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [artQuery, setArtQuery] = useState('');
  const [artCandidates, setArtCandidates] = useState<readonly ScryfallArtCandidate[]>([]);
  const [artSearchStatus, setArtSearchStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [artSearchMessage, setArtSearchMessage] = useState<string | null>(null);
  const [frameMaskUrl, setFrameMaskUrl] = useState('');
  const [selectedFramePresetId, setSelectedFramePresetId] = useState('');
  const [customFrameUrl, setCustomFrameUrl] = useState('');
  const [customFramePresets, setCustomFramePresets] = useState<readonly CustomFramePreset[]>([]);
  const [frameSearch, setFrameSearch] = useState('');
  const [editingFrameLayerId, setEditingFrameLayerId] = useState<string | null>(null);
  const [editingFrameMaskIndex, setEditingFrameMaskIndex] = useState('');
  const [selectedTextTargetId, setSelectedTextTargetId] = useState<TextEditorTargetId>('manaCost');
  const [editingTextBounds, setEditingTextBounds] = useState(false);
  const [hideTextHint, setHideTextHint] = useState(false);
  const [autoItalicHint, setAutoItalicHint] = useState(false);
  const [draggingFrameLayerId, setDraggingFrameLayerId] = useState<string | null>(null);
  const [dragOverFrameLayerId, setDragOverFrameLayerId] = useState<string | null>(null);
  const [autoFitArtOnSet, setAutoFitArtOnSet] = useState(true);
  const selectedFrameVersionId = face.frameVersionId ?? fallbackFrameVersionId;
  const selectedFrameVersion =
    versions.find((version) => version.id === selectedFrameVersionId) ?? versions[0] ?? null;
  const selectedFrameGroup = selectedFrameVersion?.group ?? 'Regular';
  const frameGroupsWithVersions = new Set(versions.map((version) => version.group));
  const frameVersionsInGroup = versions.filter((version) => version.group === selectedFrameGroup);
  const frameSearchQuery = frameSearch.trim().toLowerCase();
  const visibleFrameVersions = frameSearchQuery
    ? versions.filter((version) => matchesFrameVersionSearch(version, frameSearchQuery))
    : frameVersionsInGroup;
  const selectedPackId = selectedFrameVersion?.id ?? frameVersionsInGroup[0]?.id ?? selectedFrameVersionId;
  const frameLayers = face.frameLayers ?? [];
  const customTextLayers = face.customTextLayers ?? [];
  const selectedCustomTextIndex = selectedTextTargetId.startsWith('custom:')
    ? customTextLayers.findIndex((layer) => layer.id === selectedTextTargetId.slice('custom:'.length))
    : -1;
  const selectedCustomTextLayer = selectedCustomTextIndex >= 0 ? customTextLayers[selectedCustomTextIndex] : null;
  const selectedTextValue = getTextEditorValue(face, selectedTextTargetId, selectedCustomTextLayer);
  const selectedTextBounds = getTextTargetBounds(face, selectedTextTargetId, selectedCustomTextLayer);
  const baseFramePresets = useMemo(() => getFramePresets(selectedPackId), [selectedPackId]);
  const framePresets = useMemo<readonly FramePreset[]>(
    () => [
      ...baseFramePresets,
      ...customFramePresets.filter((preset) => preset.packId === selectedPackId),
    ],
    [baseFramePresets, customFramePresets, selectedPackId],
  );
  const visibleFramePresets = frameSearchQuery
    ? framePresets.filter((preset) => matchesSearch(`${preset.id} ${preset.label}`, frameSearchQuery))
    : framePresets;
  const selectedLayoutPreset = getFrameLayoutPreset(selectedPackId);
  const defaultFramePreset =
    framePresets.find((preset) => framePresetMatchesColor(preset, face.frameColor ?? 'M')) ??
    visibleFramePresets.find((preset) => framePresetMatchesColor(preset, face.frameColor ?? 'M')) ??
    visibleFramePresets[0] ??
    framePresets[0] ??
    null;
  const selectedFramePreset =
    visibleFramePresets.find((preset) => preset.id === selectedFramePresetId) ??
    framePresets.find((preset) => preset.id === selectedFramePresetId) ??
    defaultFramePreset;
  const frameMaskPresets = [
    NO_FRAME_MASK_PRESET,
    ...getFrameMaskPresets(selectedPackId),
  ];
  const selectedMaskLabel = frameMaskUrl
    ? frameMaskPresets.find((preset) => preset.url === frameMaskUrl)?.label ?? '自定义蒙版'
    : 'No Mask';
  const editingFrameLayerIndex = editingFrameLayerId
    ? frameLayers.findIndex((layer) => layer.id === editingFrameLayerId)
    : -1;
  const editingFrameLayer = editingFrameLayerIndex >= 0 ? frameLayers[editingFrameLayerIndex] : null;
  const editingFrameLayerMasks = editingFrameLayer ? getFrameLayerMasks(editingFrameLayer) : [];

  useEffect(() => {
    if (editingFrameLayerId && !frameLayers.some((layer) => layer.id === editingFrameLayerId)) {
      setEditingFrameLayerId(null);
    }
  }, [editingFrameLayerId, frameLayers]);

  useEffect(() => {
    setEditingFrameMaskIndex('');
  }, [editingFrameLayerId]);

  useEffect(() => {
    if (!editingFrameMaskIndex) return;
    const maskIndex = Number(editingFrameMaskIndex);
    if (!Number.isInteger(maskIndex) || maskIndex < 0 || maskIndex >= editingFrameLayerMasks.length) {
      setEditingFrameMaskIndex('');
    }
  }, [editingFrameLayerMasks.length, editingFrameMaskIndex]);

  useEffect(() => {
    if (selectedFramePresetId && framePresets.some((preset) => preset.id === selectedFramePresetId)) return;
    setSelectedFramePresetId(defaultFramePreset?.id ?? '');
  }, [defaultFramePreset?.id, framePresets, selectedFramePresetId]);

  useEffect(() => {
    if (!selectedTextTargetId.startsWith('custom:')) return;
    if (customTextLayers.some((layer) => `custom:${layer.id}` === selectedTextTargetId)) return;
    setSelectedTextTargetId('rulesText');
    setEditingTextBounds(false);
  }, [customTextLayers, selectedTextTargetId]);

  const onImageFile = async (
    field: 'artUrl' | 'frameUrl',
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    await setImageFile(field, file);
  };

  const setImageFile = async (field: 'artUrl' | 'frameUrl', file: File): Promise<void> => {
    try {
      const dataUrl = await readFileAsDataUrl(file);
      if (field === 'artUrl' && autoFitArtOnSet) {
        setFields({ artUrl: dataUrl, ...resetArtTransformFields() });
      } else {
        setField(field, dataUrl);
      }
      setUploadError(null);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : '无法读取图片文件。');
    }
  };

  const onImageDrop = async (field: 'artUrl' | 'frameUrl', event: DragEvent<HTMLElement>): Promise<void> => {
    event.preventDefault();
    const file = firstDroppedFile(event);
    if (file) {
      await setImageFile(field, file);
    }
  };

  const addCustomFrameUrlToPicker = (url: string): void => {
    const normalizedUrl = url.trim();
    if (!normalizedUrl) return;
    const preset = createCustomFramePreset(selectedPackId, normalizedUrl, 'Custom Frame');
    setCustomFramePresets((current) => [...current, preset]);
    setSelectedFramePresetId(preset.id);
    setCustomFrameUrl('');
  };

  const onCustomFrameFile = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;
    await addCustomFrameFiles(files);
  };

  const addCustomFrameFiles = async (files: readonly File[]): Promise<void> => {
    try {
      const uploadedPresets = await Promise.all(
        files.map(async (file) => createCustomFramePreset(selectedPackId, await readFileAsDataUrl(file), file.name || 'Uploaded Image')),
      );
      setCustomFramePresets((current) => [...current, ...uploadedPresets]);
      setSelectedFramePresetId(uploadedPresets[uploadedPresets.length - 1]?.id ?? selectedFramePresetId);
      setUploadError(null);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : '无法读取图片文件。');
    }
  };

  const onCustomFrameDrop = async (event: DragEvent<HTMLElement>): Promise<void> => {
    event.preventDefault();
    const files = droppedFiles(event);
    if (files.length > 0) await addCustomFrameFiles(files);
  };

  const onLayerMaskFile = async (index: number, event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    await setLayerMaskFile(index, file);
  };

  const setLayerMaskFile = async (index: number, file: File): Promise<void> => {
    try {
      const mask = {
        url: await readFileAsDataUrl(file),
        name: file.name || 'Uploaded Image',
      };
      appendFrameLayerMask(index, mask);
      setUploadError(null);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : '无法读取蒙版文件。');
    }
  };

  const onLayerMaskDrop = async (index: number, event: DragEvent<HTMLElement>): Promise<void> => {
    event.preventDefault();
    const file = firstDroppedFile(event);
    if (file) {
      await setLayerMaskFile(index, file);
    }
  };

  const onPasteArt = async (): Promise<void> => {
    setUploadError(null);
    try {
      if (!navigator.clipboard?.read) {
        throw new Error('当前浏览器不支持读取剪贴板图片，或页面不是安全上下文。');
      }
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((type) => type.startsWith('image/'));
        if (!imageType) continue;
        const blob = await item.getType(imageType);
        const file = new File([blob], `clipboard.${extensionFromMime(imageType)}`, { type: imageType });
        setFields({
          artUrl: await readFileAsDataUrl(file),
          artOffsetX: 0,
          artOffsetY: 0,
          artZoom: 1,
          artRotation: 0,
          artGrayscale: false,
        });
        return;
      }
      throw new Error('剪贴板中没有图片。');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : '无法读取剪贴板图片。');
    }
  };

  const applyScryfallArt = (candidate: ScryfallArtCandidate): void => {
    setFields({
      artUrl: candidate.artUrl,
      ...resetArtTransformFields(),
    });
    onArtistFound?.(candidate.artist);
  };

  const addFrameLayerFromUrl = (
    url: string,
    name: string,
    options?: {
      readonly masks?: readonly FrameLayerMask[];
      readonly bounds?: FrameLayerBounds | null;
      readonly opacity?: number;
      readonly erase?: boolean;
    },
  ): void => {
    const normalizedUrl = url.trim();
    if (!normalizedUrl) return;
    const id = createFrameLayerId();
    const masks = normalizeFrameLayerMasks(options?.masks ?? []);
    const firstMask = masks[0] ?? null;
    setFields({
      frameLayers: [
        {
          id,
          name,
          url: normalizedUrl,
          masks,
          maskUrl: firstMask?.url ?? null,
          maskName: firstMask?.name ?? null,
          bounds: options?.bounds ?? null,
          visible: true,
          opacity: options?.opacity ?? 1,
          erase: options?.erase ?? false,
          preserveAlpha: false,
          colorOverlayEnabled: false,
          colorOverlay: '#000000',
          hslHue: 0,
          hslSaturation: 0,
          hslLightness: 0,
        },
        ...frameLayers,
      ],
    });
    onSelectFrameLayer?.(id);
  };

  const loadSelectedFrameVersion = (): void => {
    if (!selectedFramePreset) return;
    setM15LayoutBounds();
  };

  const addSelectedFramePreset = (
    additionalMasks: readonly FrameLayerMask[] = [],
    maskOverrideUrl?: string,
  ): void => {
    if (!selectedFramePreset) return;
    const resolvedMaskUrl = maskOverrideUrl ?? frameMaskUrl;
    const maskPreset = frameMaskPresets.find((preset) => preset.url === resolvedMaskUrl);
    const selectedMasks = resolvedMaskUrl
      ? [{ url: resolvedMaskUrl, name: maskPreset?.label ?? '自定义蒙版' }]
      : [];
    addFrameLayerFromUrl(selectedFramePreset.url, selectedFramePreset.label, {
      masks: [...selectedMasks, ...additionalMasks],
      bounds: selectedFramePreset.bounds ?? null,
      opacity: selectedFramePreset.opacity ?? 1,
      erase: selectedFramePreset.erase ?? false,
    });
  };

  const addSelectedFramePresetRightHalf = (): void => {
    addSelectedFramePreset([FRAME_SPLIT_MASKS.rightHalf]);
  };

  const addSelectedFramePresetLeftHalf = (): void => {
    addSelectedFramePreset([FRAME_SPLIT_MASKS.leftHalf]);
  };

  const addSelectedFramePresetMiddleThird = (): void => {
    addSelectedFramePreset([FRAME_SPLIT_MASKS.middleThird]);
  };

  const addSelectedFramePresetTopHalf = (): void => {
    addSelectedFramePreset([FRAME_SPLIT_MASKS.topHalf]);
  };

  const addSelectedFramePresetBottomHalf = (): void => {
    addSelectedFramePreset([FRAME_SPLIT_MASKS.bottomHalf]);
  };

  const addFramePresetFromPickerDoubleClick = (
    event: MouseEvent,
    maskOverrideUrl?: string,
  ): void => {
    if (event.shiftKey) {
      addSelectedFramePreset([FRAME_SPLIT_MASKS.rightHalf], maskOverrideUrl);
    } else if (event.ctrlKey) {
      addSelectedFramePreset([FRAME_SPLIT_MASKS.leftHalf], maskOverrideUrl);
    } else if (event.altKey) {
      addSelectedFramePreset([FRAME_SPLIT_MASKS.middleThird], maskOverrideUrl);
    } else {
      addSelectedFramePreset([], maskOverrideUrl);
    }
  };

  const openFrameLayerEditor = (layerId: string): void => {
    onSelectFrameLayer?.(layerId);
    setEditingFrameLayerId(layerId);
  };

  const updateFrameLayer = (index: number, patch: Partial<FrameLayer>): void => {
    setFields({
      frameLayers: frameLayers.map((layer, layerIndex) => (layerIndex === index ? { ...layer, ...patch } : layer)),
    });
  };

  const updateFrameLayerMasks = (index: number, masks: readonly FrameLayerMask[]): void => {
    const normalizedMasks = normalizeFrameLayerMasks(masks);
    const firstMask = normalizedMasks[0] ?? null;
    updateFrameLayer(index, {
      masks: normalizedMasks,
      maskUrl: firstMask?.url ?? null,
      maskName: firstMask?.name ?? null,
    });
  };

  const appendFrameLayerMask = (index: number, mask: FrameLayerMask): void => {
    const layer = frameLayers[index];
    if (!layer) return;
    updateFrameLayerMasks(index, [...getFrameLayerMasks(layer), mask]);
  };

  const removeEditingFrameLayerMask = (): void => {
    if (!editingFrameLayer) return;
    const maskIndex = Number(editingFrameMaskIndex);
    if (!Number.isInteger(maskIndex) || maskIndex < 0 || maskIndex >= editingFrameLayerMasks.length) return;
    updateFrameLayerMasks(
      editingFrameLayerIndex,
      editingFrameLayerMasks.filter((_, index) => index !== maskIndex),
    );
    setEditingFrameMaskIndex('');
  };

  const removeFrameLayer = (index: number): void => {
    const removed = frameLayers[index] ?? null;
    const nextLayers = frameLayers.filter((_, layerIndex) => layerIndex !== index);
    setFields({ frameLayers: nextLayers });
    if (removed?.id === editingFrameLayerId) {
      setEditingFrameLayerId(null);
    }
    if (removed?.id === selectedFrameLayerId) {
      onSelectFrameLayer?.(nextLayers[Math.min(index, nextLayers.length - 1)]?.id ?? null);
    }
  };

  const moveFrameLayer = (index: number, direction: -1 | 1): void => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= frameLayers.length) return;
    const next = [...frameLayers];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    setFields({ frameLayers: next });
  };

  const reorderFrameLayer = (sourceId: string, targetId: string): void => {
    if (sourceId === targetId) return;
    const sourceIndex = frameLayers.findIndex((layer) => layer.id === sourceId);
    const targetIndex = frameLayers.findIndex((layer) => layer.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1) return;
    const next = [...frameLayers];
    const [moved] = next.splice(sourceIndex, 1);
    if (!moved) return;
    next.splice(targetIndex, 0, moved);
    setFields({ frameLayers: next });
    onSelectFrameLayer?.(moved.id);
  };

  const onFrameLayerDragStart = (event: DragEvent<HTMLElement>, layerId: string): void => {
    setDraggingFrameLayerId(layerId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', layerId);
  };

  const onFrameLayerDragOver = (event: DragEvent<HTMLElement>, layerId: string): void => {
    if (!draggingFrameLayerId || draggingFrameLayerId === layerId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDragOverFrameLayerId(layerId);
  };

  const onFrameLayerDrop = (event: DragEvent<HTMLElement>, layerId: string): void => {
    event.preventDefault();
    const sourceId = event.dataTransfer.getData('text/plain') || draggingFrameLayerId;
    if (sourceId) reorderFrameLayer(sourceId, layerId);
    setDraggingFrameLayerId(null);
    setDragOverFrameLayerId(null);
  };

  const onFrameLayerDragEnd = (): void => {
    setDraggingFrameLayerId(null);
    setDragOverFrameLayerId(null);
  };

  const addCustomTextLayer = (kind: CustomTextLayerPreset): void => {
    const layer = createCustomTextLayer(kind, face);
    setFields({ customTextLayers: [...customTextLayers, layer] });
    setSelectedTextTargetId(`custom:${layer.id}`);
  };

  const updateCustomTextLayer = (index: number, patch: Partial<CustomTextLayer>): void => {
    setFields({
      customTextLayers: customTextLayers.map((layer, layerIndex) => (layerIndex === index ? { ...layer, ...patch } : layer)),
    });
  };

  const removeCustomTextLayer = (index: number): void => {
    setFields({ customTextLayers: customTextLayers.filter((_, layerIndex) => layerIndex !== index) });
  };

  const moveCustomTextLayer = (index: number, direction: -1 | 1): void => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= customTextLayers.length) return;
    const next = [...customTextLayers];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    setFields({ customTextLayers: next });
  };

  const updateCustomTextLayerBounds = (index: number, key: keyof CardRegionBounds, value: number): void => {
    const current = customTextLayers[index]?.bounds ?? CUSTOM_TEXT_BOUNDS;
    updateCustomTextLayer(index, {
      bounds: {
        ...current,
        [key]: Math.max(0, value / 100),
      },
    });
  };

  const updateSelectedTextValue = (value: string): void => {
    if (selectedTextTargetId.startsWith('custom:')) {
      if (selectedCustomTextIndex >= 0) updateCustomTextLayer(selectedCustomTextIndex, { text: value });
      return;
    }
    if (selectedTextTargetId === 'manaCost') {
      setField('manaCost', value || null);
      return;
    }
    if (selectedTextTargetId === 'powerToughness') {
      if (face.layout === 'planeswalker') {
        setField('loyalty', value || null);
      } else {
        setField('powerToughness', value || null);
      }
      return;
    }
    if (selectedTextTargetId === 'rulesText') {
      setFields(splitRulesAndFlavorText(value));
      return;
    }
    setField(selectedTextTargetId, value);
  };

  const applyTextFormat = (format: TextFormatDirective): void => {
    const textarea = textEditorRef.current;
    const value = selectedTextValue;
    const startTag = format === 'italic' ? '{i}' : '{bold}';
    const endTag = format === 'italic' ? '{/i}' : '{/bold}';
    const start = textarea?.selectionStart ?? 0;
    const end = textarea?.selectionEnd ?? value.length;
    const selected = value.slice(start, end);
    const nextValue = `${value.slice(0, start)}${startTag}${selected}${endTag}${value.slice(end)}`;
    updateSelectedTextValue(nextValue);
    window.setTimeout(() => {
      const nextSelectionStart = start + startTag.length;
      const nextSelectionEnd = nextSelectionStart + selected.length;
      textEditorRef.current?.focus();
      textEditorRef.current?.setSelectionRange(nextSelectionStart, nextSelectionEnd);
    }, 0);
  };

  const updateSelectedTextBounds = (key: keyof CardRegionBounds, value: number): void => {
    if (selectedTextTargetId.startsWith('custom:')) {
      if (selectedCustomTextIndex >= 0) updateCustomTextLayerBounds(selectedCustomTextIndex, key, value);
      return;
    }
    const field = getBuiltInTextBoundsField(selectedTextTargetId, face.layout);
    updateCardRegionBound(field, key, value);
  };

  const updateSelectedTextFontSize = (value: number): void => {
    if (selectedCustomTextIndex < 0) return;
    updateCustomTextLayer(selectedCustomTextIndex, { fontSize: Math.max(0.001, value / 100) });
  };

  const setM15LayoutBounds = (): void => {
    const preset = selectedLayoutPreset ?? {
      artBounds: M15_ART_BOUNDS,
      manaBounds: M15_MANA_BOUNDS,
      titleBounds: M15_TITLE_BOUNDS,
      typeBounds: M15_TYPE_BOUNDS,
      rulesBounds: M15_RULES_BOUNDS,
      powerToughnessBounds: M15_PT_BOUNDS,
      loyaltyBounds: M15_LOYALTY_BOUNDS,
    };
    setFields({
      layout: preset.layout ?? face.layout,
      artBounds: preset.artBounds,
      manaBounds: preset.manaBounds,
      titleBounds: preset.titleBounds,
      typeBounds: preset.typeBounds,
      rulesBounds: preset.rulesBounds,
      powerToughnessBounds: preset.powerToughnessBounds,
      loyaltyBounds: preset.loyaltyBounds ?? M15_LOYALTY_BOUNDS,
    });
  };

  const resetLayoutBounds = (): void => {
    setFields({
      artBounds: null,
      manaBounds: null,
      titleBounds: null,
      typeBounds: null,
      rulesBounds: null,
      powerToughnessBounds: null,
      loyaltyBounds: null,
    });
  };

  const updateFrameLayerBoundPixels = (index: number, key: keyof FrameLayerBounds, value: number): void => {
    const current = frameLayers[index]?.bounds ?? { x: 0, y: 0, width: 1, height: 1 };
    const dimension = key === 'x' || key === 'width' ? cardWidth : cardHeight;
    const ratio = dimension > 0 ? value / dimension : 0;
    updateFrameLayer(index, {
      bounds: {
        ...current,
        [key]: key === 'width' || key === 'height' ? Math.max(1 / dimension, ratio) : ratio,
      },
    });
  };

  const updateCardRegionBound = (
    field: CardRegionField,
    key: keyof CardRegionBounds,
    value: number,
  ): void => {
    const current = face[field] ?? getDefaultRegionBounds(field);
    setField(field, {
      ...current,
      [key]: Math.max(0, value / 100),
    });
  };

  const onSearchArt = async (): Promise<void> => {
    setArtSearchStatus('loading');
    setArtSearchMessage(null);
    try {
      const candidates = await searchScryfallArt(artQuery);
      setArtCandidates(candidates);
      setArtSearchStatus('ready');
      setArtSearchMessage(candidates.length === 0 ? '没有找到可用卡图。' : `找到 ${candidates.length} 张卡图。`);
      if (candidates[0]) {
        applyScryfallArt(candidates[0]);
      }
    } catch (error) {
      setArtSearchStatus('error');
      setArtSearchMessage(error instanceof Error ? error.message : 'Scryfall 搜索失败。');
    }
  };

  if (section === 'frame') {
    return (
      <>
        <section className="input-stack readable-background padding margin-bottom">
          <h5>选择一个牌框组和一个牌框包，或者输入搜索。然后你可以加载选中的牌框版本（加载牌框版本配置文本位置、卡图大小等...）</h5>
          <div className="input-grid">
            <select
              aria-label="Select Frame Group"
              value={selectedFrameGroup}
              onChange={(e) => {
                const nextGroup = e.target.value as FrameVersionGroup;
                const nextVersion = versions.find((version) => version.group === nextGroup);
                if (nextVersion) {
                  setField('frameVersionId', nextVersion.id);
                }
              }}
            >
              {FRAME_GROUP_SELECT_ITEMS.map((item) =>
                item.kind === 'separator' ? (
                  <option key={item.id} value={`separator:${item.id}`} disabled>
                    {item.label}
                  </option>
                ) : (
                  <option key={item.group} value={item.group} disabled={!frameGroupsWithVersions.has(item.group)}>
                    {FRAME_GROUP_LABELS[item.group]}
                  </option>
                ),
              )}
            </select>
            <select
              aria-label="Select Frame Pack"
              value={selectedPackId}
              onChange={(e) => setField('frameVersionId', e.target.value)}
            >
              {visibleFrameVersions.length === 0 && <option value={selectedPackId}>无匹配牌框包</option>}
              {visibleFrameVersions.map((v) => (
                <Fragment key={v.id}>
                  {!frameSearchQuery && selectedFrameGroup === 'Regular' && REGULAR_FRAME_PACK_SEPARATORS[v.id] && (
                    <option value={`separator:${v.id}`} disabled>
                      {REGULAR_FRAME_PACK_SEPARATORS[v.id]}
                    </option>
                  )}
                  <option value={v.id}>{v.label}</option>
                </Fragment>
              ))}
            </select>
            <input
              aria-label="Search Frames..."
              type="search"
              value={frameSearch}
              placeholder="Search Frames..."
              onChange={(e) => setFrameSearch(e.target.value)}
            />
          </div>
          <button type="button" onClick={loadSelectedFrameVersion}>
            加载牌框版本
          </button>
          <h5>自动加载牌框版本当加载牌框包时</h5>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={autoLoadFrameVersion}
              onChange={(e) => onAutoLoadFrameVersionChange?.(e.target.checked)}
            />
            自动加载
          </label>
        </section>
        {framePresets.length > 0 && (
          <section className="input-stack readable-background padding margin-bottom">
            <h5>选择一个牌框图像和一个蒙版，然后将其添加到你的卡片上</h5>
            <div className="split-grid margin-bottom">
              <div className="frame-picker">
                {visibleFramePresets.map((preset) => {
                  const selected = preset.id === selectedFramePreset?.id;
                  return (
                    <div
                      key={preset.id}
                      className={`frame-option ${selected ? 'selected' : ''}`}
                      onClick={() => setSelectedFramePresetId(preset.id)}
                      onDoubleClick={(event) => addFramePresetFromPickerDoubleClick(event)}
                    >
                      <img src={preset.url} alt="" loading="lazy" />
                    </div>
                  );
                })}
                {visibleFramePresets.length === 0 && <h5>无匹配牌框图像</h5>}
              </div>
              <div className="mask-picker">
                {frameMaskPresets.map((preset) => {
                  const selected = preset.url === frameMaskUrl;
                  const label = formatMaskLabel(preset.label, preset.url);
                  return (
                    <div
                      key={`${preset.label}-${preset.url}`}
                      className={`mask-option ${selected ? 'selected' : ''}`}
                      onClick={() => setFrameMaskUrl(preset.url)}
                      onDoubleClick={(event) => addFramePresetFromPickerDoubleClick(event, preset.url)}
                    >
                      <img src={preset.url || EMPTY_MASK_PREVIEW_URL} alt="" loading="lazy" />
                      <p>{label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="input-grid">
              <button type="button" onClick={() => addSelectedFramePreset()}>
                添加牌框到卡片
              </button>
              <button type="button" onClick={addSelectedFramePresetRightHalf}>
                添加牌框到卡片（右半部分）
              </button>
            </div>
            <CreatorCollapsible title="更多选项">
              <div className="input-grid">
                <button type="button" onClick={addSelectedFramePresetLeftHalf}>
                  添加牌框到卡片（左半部分）
                </button>
                <button type="button" onClick={addSelectedFramePresetMiddleThird}>
                  添加牌框到卡片（中间三分之一）
                </button>
                <button type="button" onClick={addSelectedFramePresetTopHalf}>
                  添加牌框到卡片（上半）
                </button>
                <button type="button" onClick={addSelectedFramePresetBottomHalf}>
                  添加牌框到卡片（下半）
                </button>
              </div>
              <h5>
                现在可以双击牌框和蒙版来将它们添加到卡片上。你可以按住shift、control或alt键来添加到右半部分、左半部分或中间三分之一，分别。
              </h5>
            </CreatorCollapsible>
            <h5 className="selected-frame-status">
              (Selected: {selectedFramePreset?.label ?? 'None'}, {selectedMaskLabel})
            </h5>
          </section>
        )}
        <section className="frame-layer-list input-stack readable-background padding margin-bottom">
          <h5>拖动重新排序牌框图像</h5>
          {frameLayers.map((layer, index) => {
            const layerMasks = getFrameLayerMasks(layer);
            const maskThumbnail = getFrameLayerThumbnailMask(layerMasks);
            const displayName = frameLayerDisplayName(layer);
            return (
              <div
                className={`draggable frame-element frame-layer-row ${selectedFrameLayerId === layer.id ? 'selected' : ''} ${dragOverFrameLayerId === layer.id ? 'drag-over' : ''}`}
                key={layer.id}
                draggable
                onClick={() => openFrameLayerEditor(layer.id)}
                onDragStart={(event) => onFrameLayerDragStart(event, layer.id)}
                onDragOver={(event) => onFrameLayerDragOver(event, layer.id)}
                onDrop={(event) => onFrameLayerDrop(event, layer.id)}
                onDragEnd={onFrameLayerDragEnd}
              >
                <img
                  src={thumbnailUrl(layer.url)}
                  alt=""
                  onError={(event) => fallbackImage(event.currentTarget, layer.url)}
                />
                <img
                  src={maskThumbnail ? thumbnailUrl(maskThumbnail.url) : EMPTY_MASK_PREVIEW_URL}
                  alt=""
                  onError={(event) => fallbackImage(event.currentTarget, maskThumbnail?.url ?? EMPTY_MASK_PREVIEW_URL)}
                />
                <h4>{displayName}</h4>
                <h4
                  className="frame-layer-delete"
                  aria-label={`删除 ${displayName}`}
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation();
                    removeFrameLayer(index);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      event.stopPropagation();
                      removeFrameLayer(index);
                    }
                  }}
                >
                  X
                </h4>
              </div>
            );
          })}
          <h5>你也可以点击编辑透明度、位置、大小等</h5>
        </section>
        <section className="custom-frame-uploader input-stack readable-background padding margin-bottom">
          <h5>上传自定义牌框图像</h5>
          <div className="input-grid">
            <div
              className="padding drop-area"
              onDragOver={preventDropDefaults}
              onDrop={(event) => void onCustomFrameDrop(event)}
            >
              <h5 className="margin-bottom padding input-description">拖放</h5>
              <input
                type="file"
                multiple
                accept=".png,.svg,.jpg,.jpeg,.bmp,.webp"
                onChange={(e) => void onCustomFrameFile(e)}
              />
            </div>
            <div>
              <input
                aria-label="Via URL"
                type="url"
                size={60}
                value={customFrameUrl}
                placeholder="Via URL"
                onChange={(e) => setCustomFrameUrl(e.target.value)}
                onBlur={(e) => addCustomFrameUrlToPicker(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomFrameUrlToPicker(e.currentTarget.value);
                  }
                }}
              />
            </div>
          </div>
          {frame.error && <small>{frame.error.message}</small>}
        </section>
        {editingFrameLayer && (
          <section
            className="frame-element-editor opened"
            role="dialog"
            aria-modal="true"
            aria-labelledby="frame-layer-editor-title"
          >
            <h2 id="frame-layer-editor-title" className="frame-element-editor-title">
              牌框图像编辑器
            </h2>
            <h2
              className="frame-element-editor-close"
              role="button"
              tabIndex={0}
              onClick={() => setEditingFrameLayerId(null)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setEditingFrameLayerId(null);
                }
              }}
            >
              X
            </h2>
            <div>
              <h5 className="input-description">X</h5>
              <input
                type="number"
                step={1}
                value={frameLayerPixelBoundValue(editingFrameLayer.bounds, 'x', cardWidth, cardHeight)}
                onChange={(e) => updateFrameLayerBoundPixels(editingFrameLayerIndex, 'x', Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <h5 className="input-description">Y</h5>
              <input
                type="number"
                step={1}
                value={frameLayerPixelBoundValue(editingFrameLayer.bounds, 'y', cardWidth, cardHeight)}
                onChange={(e) => updateFrameLayerBoundPixels(editingFrameLayerIndex, 'y', Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <h5 className="input-description">宽度</h5>
              <input
                type="number"
                min={1}
                step={1}
                value={frameLayerPixelBoundValue(editingFrameLayer.bounds, 'width', cardWidth, cardHeight)}
                onChange={(e) => updateFrameLayerBoundPixels(editingFrameLayerIndex, 'width', Number(e.target.value) || 1)}
              />
            </div>
            <div>
              <h5 className="input-description">高度</h5>
              <input
                type="number"
                min={1}
                step={1}
                value={frameLayerPixelBoundValue(editingFrameLayer.bounds, 'height', cardWidth, cardHeight)}
                onChange={(e) => updateFrameLayerBoundPixels(editingFrameLayerIndex, 'height', Number(e.target.value) || 1)}
              />
            </div>
            <div>
              <h5 className="input-description">透明度</h5>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={Math.round((editingFrameLayer.opacity ?? 1) * 100)}
                onChange={(e) => updateFrameLayer(editingFrameLayerIndex, { opacity: clampPercent(Number(e.target.value) || 0) / 100 })}
              />
            </div>
            <div>
              <h5 className="input-description">擦除</h5>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={editingFrameLayer.erase ?? false}
                  onChange={(e) => updateFrameLayer(editingFrameLayerIndex, { erase: e.target.checked })}
                />
                擦除卡片
              </label>
            </div>
            <div>
              <h5 className="input-description">混合模式</h5>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={editingFrameLayer.preserveAlpha ?? false}
                  onChange={(e) => updateFrameLayer(editingFrameLayerIndex, { preserveAlpha: e.target.checked })}
                />
                保留Alpha
              </label>
            </div>
            <div>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={editingFrameLayer.colorOverlayEnabled ?? false}
                  onChange={(e) => updateFrameLayer(editingFrameLayerIndex, { colorOverlayEnabled: e.target.checked })}
                />
                颜色叠加
              </label>
              <input
                type="color"
                aria-label="叠加颜色"
                value={editingFrameLayer.colorOverlay ?? '#000000'}
                disabled={!(editingFrameLayer.colorOverlayEnabled ?? false)}
                onChange={(e) => updateFrameLayer(editingFrameLayerIndex, { colorOverlay: e.target.value })}
              />
            </div>
            <div className="frame-layer-hsl-controls">
              <h5 className="input-description">HSL 调整</h5>
              <input
                type="range"
                aria-label="HSL Hue Slider"
                min={-180}
                max={180}
                step={1}
                value={editingFrameLayer.hslHue ?? 0}
                onChange={(e) => updateFrameLayer(editingFrameLayerIndex, { hslHue: Number(e.target.value) || 0 })}
              />
              <input
                type="number"
                aria-label="HSL Hue Value"
                min={-180}
                max={180}
                step={1}
                value={editingFrameLayer.hslHue ?? 0}
                onChange={(e) => updateFrameLayer(editingFrameLayerIndex, { hslHue: Number(e.target.value) || 0 })}
              />
              <input
                type="range"
                aria-label="HSL Saturation Slider"
                min={-100}
                max={100}
                step={1}
                value={editingFrameLayer.hslSaturation ?? 0}
                onChange={(e) => updateFrameLayer(editingFrameLayerIndex, { hslSaturation: Number(e.target.value) || 0 })}
              />
              <input
                type="number"
                aria-label="HSL Saturation Value"
                min={-100}
                max={100}
                step={1}
                value={editingFrameLayer.hslSaturation ?? 0}
                onChange={(e) => updateFrameLayer(editingFrameLayerIndex, { hslSaturation: Number(e.target.value) || 0 })}
              />
              <input
                type="range"
                aria-label="HSL Lightness Slider"
                min={-100}
                max={100}
                step={1}
                value={editingFrameLayer.hslLightness ?? 0}
                onChange={(e) => updateFrameLayer(editingFrameLayerIndex, { hslLightness: Number(e.target.value) || 0 })}
              />
              <input
                type="number"
                aria-label="HSL Lightness Value"
                min={-100}
                max={100}
                step={1}
                value={editingFrameLayer.hslLightness ?? 0}
                onChange={(e) => updateFrameLayer(editingFrameLayerIndex, { hslLightness: Number(e.target.value) || 0 })}
              />
            </div>
            <div>
              <h5 className="input-description">选择并删除蒙版</h5>
              <select
                aria-label="Frame editor masks"
                value={editingFrameMaskIndex}
                onChange={(event) => setEditingFrameMaskIndex(event.target.value)}
              >
                <option value="" disabled>
                  None Selected
                </option>
                {editingFrameLayerMasks.map((mask, index) => (
                  <option key={`${mask.url}-${index}`} value={String(index)}>
                    {mask.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={removeEditingFrameLayerMask}
                disabled={!editingFrameMaskIndex || editingFrameLayerMasks.length === 0}
              >
                删除蒙版
              </button>
            </div>
            <div
              className="drop-area"
              onDragOver={preventDropDefaults}
              onDrop={(event) => void onLayerMaskDrop(editingFrameLayerIndex, event)}
            >
              <h5 className="margin-bottom padding input-description">拖放蒙版以添加</h5>
              <input
                type="file"
                multiple
                accept=".png,.svg,.jpg,.jpeg,.bmp,.webp"
                onChange={(e) => void onLayerMaskFile(editingFrameLayerIndex, e)}
              />
            </div>
          </section>
        )}
        {uploadError && <p>{uploadError}</p>}
      </>
    );
  }

  if (section === 'art') {
    return (
      <>
        <section className="input-stack readable-background padding margin-bottom">
          <h5>选择/上传你的卡图</h5>
          <div className="input-grid">
            <div
              className="padding drop-area"
              onDragOver={preventDropDefaults}
              onDrop={(event) => void onImageDrop('artUrl', event)}
            >
              <h5 className="margin-bottom padding input-description">拖放</h5>
              <input
                type="file"
                multiple
                accept=".png,.svg,.jpg,.jpeg,.bmp,.webp"
                onChange={(e) => void onImageFile('artUrl', e)}
              />
            </div>
            <div>
              <input
                aria-label="Via URL"
                type="url"
                size={60}
                value={face.artUrl ?? ''}
                placeholder="Via URL"
                onChange={(e) => {
                  const artUrl = e.target.value || null;
                  if (autoFitArtOnSet) {
                    setFields({ artUrl, ...resetArtTransformFields() });
                  } else {
                    setField('artUrl', artUrl);
                  }
                }}
              />
              <h5 className="input-description margin-bottom" />
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={autoFitArtOnSet}
                  onChange={(e) => setAutoFitArtOnSet(e.target.checked)}
                />
                设置卡图时自适应
              </label>
            </div>
          </div>
          <button type="button" onClick={() => void onPasteArt()}>
            Paste from clipboard
          </button>
          <h5>或输入一个卡牌名称</h5>
        <input
          type="text"
          value={artQuery}
          placeholder="输入卡名"
          onChange={(e) => setArtQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void onSearchArt();
            }
          }}
          disabled={artSearchStatus === 'loading'}
        />
        <h5>选择一个特定的卡图</h5>
        <select
          aria-label="选择一个特定的卡图"
          value=""
          onChange={(e) => {
            const candidate = artCandidates.find((item) => item.id === e.target.value);
            if (candidate) applyScryfallArt(candidate);
          }}
        >
          <option value="" />
          {artCandidates.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.name} ({candidate.setCode} {candidate.collectorNumber} - {candidate.artist ?? 'Unknown'})
            </option>
          ))}
        </select>
        {artSearchMessage && (
          <small>
            Scryfall：<code>{artSearchStatus}</code> - {artSearchMessage}
          </small>
        )}
        <h5>并注明艺术家</h5>
        <input
          type="text"
          value={artist ?? ''}
          placeholder="艺术家"
          onChange={(e) => onArtistChange?.(e.target.value || null)}
          disabled={!onArtistChange}
        />
        </section>
        <section className="input-stack readable-background padding margin-bottom">
          <h5>
            位置/缩放你的卡图 (X, Y, 缩放, 旋转)
            <br />
            卡图现在可以视觉调整了！点击并拖动卡片上的任何位置来移动你的卡图。按住shift键进行缩放，或按住control键进行旋转。
          </h5>
          <div className="input-grid">
          <label>
            X
            <input
              aria-label="Art X Position"
              type="number"
              value={face.artOffsetX ?? 0}
              onChange={(e) => setField('artOffsetX', Number(e.target.value) || 0)}
            />
          </label>
          <label>
            Y
            <input
              aria-label="Art Y Position"
              type="number"
              value={face.artOffsetY ?? 0}
              onChange={(e) => setField('artOffsetY', Number(e.target.value) || 0)}
            />
          </label>
          <label>
            缩放
            <input
              aria-label="Art Scale"
              type="number"
              min={0}
              step={0.1}
              value={Math.round((face.artZoom ?? 1) * 1000) / 10}
              onChange={(e) => setField('artZoom', Math.max(0, Number(e.target.value) || 0) / 100)}
            />
          </label>
          <label>
            旋转
            <input
              aria-label="Art Rotation"
              type="number"
              step={1}
              value={face.artRotation ?? 0}
              onChange={(e) => setField('artRotation', Number(e.target.value) || 0)}
            />
          </label>
          </div>
          <button
            type="button"
            onClick={() => {
              setFields(resetArtTransformFields());
            }}
          >
            自动适应卡图
          </button>
        </section>
        <section className="input-stack readable-background padding margin-bottom">
          <h5>使卡图变为灰度</h5>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={face.artGrayscale ?? false}
              onChange={(e) => setField('artGrayscale', e.target.checked)}
            />
            灰度
          </label>
        </section>
        <section className="input-stack readable-background padding margin-bottom">
          <h5>清除卡图，使其变为空白</h5>
          <button
            type="button"
            onClick={() => {
              setFields({ artUrl: null, ...resetArtTransformFields() });
              onArtistChange?.(null);
            }}
            disabled={!face.artUrl}
          >
            清除卡图
          </button>
          {uploadError && <p>{uploadError}</p>}
        </section>
      </>
    );
  }

  return (
    <>
    <section className="input-stack text-editor-stack readable-background padding margin-bottom">
      <h5>选择一个文本区域进行编辑</h5>
      <div className="input-grid">
        {BUILT_IN_TEXT_TARGETS.map((target) => (
          <h4
            key={target.id}
            className={`selectable text-option ${selectedTextTargetId === target.id ? 'selected' : ''}`}
            role="button"
            tabIndex={0}
            aria-pressed={selectedTextTargetId === target.id}
            onClick={() => setSelectedTextTargetId(target.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setSelectedTextTargetId(target.id);
              }
            }}
          >
            {target.label}
          </h4>
        ))}
        {customTextLayers.map((layer) => (
          <h4
            key={layer.id}
            className={`selectable text-option ${selectedTextTargetId === `custom:${layer.id}` ? 'selected' : ''}`}
            role="button"
            tabIndex={0}
            aria-pressed={selectedTextTargetId === `custom:${layer.id}`}
            onClick={() => setSelectedTextTargetId(`custom:${layer.id}`)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setSelectedTextTargetId(`custom:${layer.id}`);
              }
            }}
          >
            {layer.name}
          </h4>
        ))}
      </div>
    </section>
    <section className="input-stack text-editor-stack readable-background padding margin-bottom">
      <h5>输入卡片文本</h5>
      <textarea
        ref={textEditorRef}
        aria-label="Card text editor"
        value={selectedTextValue}
        rows={selectedTextTargetId === 'manaCost' || selectedTextTargetId === 'powerToughness' ? 2 : 7}
        cols={60}
        onChange={(e) => updateSelectedTextValue(e.target.value)}
      />
      <div className="text-format-actions">
        <button type="button" onClick={() => applyTextFormat('italic')}>
          斜体
        </button>
        <button type="button" onClick={() => applyTextFormat('bold')}>
          加粗
        </button>
      </div>
      <h5>编辑选中的文本框的位置和大小</h5>
      <button type="button" onClick={() => setEditingTextBounds(true)}>
        编辑边界
      </button>
      <h5>调整字体大小</h5>
      <input
        aria-label="0"
        type="number"
        step={0.1}
        value={selectedCustomTextLayer ? customTextFontSizeValue(selectedCustomTextLayer.fontSize) : 0}
        disabled={!selectedCustomTextLayer}
        onChange={(e) => updateSelectedTextFontSize(Number(e.target.value) || 0)}
      />
    </section>
    <section className="input-stack text-editor-stack readable-background padding margin-bottom">
      <CreatorCollapsible title="文本代码 / 法术符号代码参考">
        {!hideTextHint && (
          <div className={`text-reference ${autoItalicHint ? 'italic-helper-text' : ''}`}>
          <h5>文本代码:</h5>
          <div className="text-reference-grid">
            <h5>代码</h5>
            <h5>结果</h5>
            {TEXT_CODE_REFERENCE.map((row) => (
              <TextReferenceEntry key={row.code} row={row} />
            ))}
          </div>
          <h5>Notes</h5>
          <h5>对于颜色，你可以使用HTML颜色代码（如'green'）、十六进制颜色代码（如'#00FF00'）或rgb（如'rgb(0,255,0)'）</h5>
          <h5>法术符号代码:</h5>
          <div className="text-reference-grid">
            <h5>代码</h5>
            <h5>结果</h5>
            {MANA_SYMBOL_REFERENCE.map((row) => (
              <TextReferenceEntry key={row.code} row={row} />
            ))}
          </div>
          <h5>Notes</h5>
          <h5>混血/非瑞法术力只适用于WUBRG</h5>
          </div>
        )}
      </CreatorCollapsible>
    </section>
    <section className="input-stack text-editor-stack readable-background padding margin-bottom">
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={hideTextHint}
          onChange={(e) => setHideTextHint(e.target.checked)}
        />
        隐藏提示文本
      </label>
    </section>
    <section className="input-stack text-editor-stack readable-background padding margin-bottom">
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={autoItalicHint}
          onChange={(e) => setAutoItalicHint(e.target.checked)}
        />
        自动斜体提示文本
      </label>
    </section>
    <section className="input-stack text-editor-stack readable-background padding">
      <h5>添加一个文本框到你的卡片</h5>
      <div className="input-grid">
        <button type="button" onClick={() => addCustomTextLayer('nickname')}>
          昵称
        </button>
        <button type="button" onClick={() => addCustomTextLayer('powerToughness')}>
          力量/血量
        </button>
        <button type="button" onClick={() => addCustomTextLayer('dateStamp')}>
          日期戳
        </button>
      </div>
      {selectedCustomTextLayer && (
        <section className="text-custom-controls">
          <h5>{selectedCustomTextLayer.name}</h5>
          <div className="input-grid">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={selectedCustomTextLayer.visible ?? true}
                onChange={(e) => updateCustomTextLayer(selectedCustomTextIndex, { visible: e.target.checked })}
              />
              显示
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={selectedCustomTextLayer.oneLine ?? true}
                onChange={(e) => updateCustomTextLayer(selectedCustomTextIndex, { oneLine: e.target.checked })}
              />
              单行
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={selectedCustomTextLayer.bold ?? false}
                onChange={(e) => updateCustomTextLayer(selectedCustomTextIndex, { bold: e.target.checked })}
              />
              加粗
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={selectedCustomTextLayer.italic ?? false}
                onChange={(e) => updateCustomTextLayer(selectedCustomTextIndex, { italic: e.target.checked })}
              />
              斜体
            </label>
          </div>
          <div className="input-grid">
            <label>
              名称
              <input
                type="text"
                value={selectedCustomTextLayer.name}
                onChange={(e) => updateCustomTextLayer(selectedCustomTextIndex, { name: e.target.value })}
              />
            </label>
            <label>
              颜色
              <input
                type="color"
                value={selectedCustomTextLayer.color ?? '#1d1d1d'}
                onChange={(e) => updateCustomTextLayer(selectedCustomTextIndex, { color: e.target.value })}
              />
            </label>
            <label>
              对齐
              <select
                value={selectedCustomTextLayer.align ?? 'start'}
                onChange={(e) => updateCustomTextLayer(selectedCustomTextIndex, { align: e.target.value as CustomTextLayer['align'] })}
              >
                <option value="start">左</option>
                <option value="center">中</option>
                <option value="end">右</option>
              </select>
            </label>
            <label>
              字体
              <select
                value={selectedCustomTextLayer.fontFamily ?? 'mplantin, Georgia, serif'}
                onChange={(e) => updateCustomTextLayer(selectedCustomTextIndex, { fontFamily: e.target.value })}
              >
                <option value="mplantin, Georgia, serif">MPlantin</option>
                <option value="belerenb, system-ui, sans-serif">Beleren</option>
                <option value="belerenbsc, system-ui, sans-serif">Beleren SC</option>
                <option value="system-ui, sans-serif">System</option>
              </select>
            </label>
          </div>
          <div className="input-grid">
            <button type="button" onClick={() => moveCustomTextLayer(selectedCustomTextIndex, -1)} disabled={selectedCustomTextIndex === 0}>
              上移
            </button>
            <button type="button" onClick={() => moveCustomTextLayer(selectedCustomTextIndex, 1)} disabled={selectedCustomTextIndex === customTextLayers.length - 1}>
              下移
            </button>
            <button type="button" onClick={() => removeCustomTextLayer(selectedCustomTextIndex)}>
              删除
            </button>
          </div>
        </section>
      )}
      {selectedPackId === 'storybook' && (
        <section className="input-stack">
          <h5>历险文字</h5>
          <div className="input-grid">
            <label>
              历险标题
              <input
                type="text"
                value={face.adventureName ?? ''}
                onChange={(e) => setField('adventureName', e.target.value || null)}
              />
            </label>
            <label>
              历险费用
              <input
                type="text"
                size={14}
                value={face.adventureManaCost ?? ''}
                placeholder="{1}{G}"
                onChange={(e) => setField('adventureManaCost', e.target.value || null)}
              />
            </label>
            <label>
              历险类型
              <input
                type="text"
                value={face.adventureTypeLine ?? ''}
                placeholder="Sorcery - Adventure"
                onChange={(e) => setField('adventureTypeLine', e.target.value || null)}
              />
            </label>
          </div>
          <label>
            历险规则文字
            <textarea
              value={face.adventureRulesText ?? ''}
              rows={3}
              cols={60}
              onChange={(e) => setField('adventureRulesText', e.target.value || null)}
            />
          </label>
        </section>
      )}
    </section>
      {editingTextBounds && (
        <section className="textbox-editor opened" role="dialog" aria-modal="true" aria-labelledby="text-bounds-editor-title">
          <h2 id="text-bounds-editor-title" className="textbox-editor-title">
            文本框编辑器
          </h2>
          <h2
            className="textbox-editor-close"
            role="button"
            tabIndex={0}
            onClick={() => setEditingTextBounds(false)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setEditingTextBounds(false);
              }
            }}
          >
            X
          </h2>
          <TextBoundsPixelEditor
            bounds={selectedTextBounds}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            onChange={updateSelectedTextBounds}
          />
        </section>
      )}
    </>
  );
}

interface TextBoundsPixelEditorProps {
  readonly bounds: CardRegionBounds;
  readonly cardWidth: number;
  readonly cardHeight: number;
  readonly onChange: (key: keyof CardRegionBounds, value: number) => void;
}

function TextBoundsPixelEditor({ bounds, cardWidth, cardHeight, onChange }: TextBoundsPixelEditorProps): JSX.Element {
  return (
    <>
      <div>
        <h5 className="input-description">X</h5>
        <input
          type="number"
          step={1}
          value={textBoundPixelValue(bounds, 'x', cardWidth, cardHeight)}
          onChange={(e) => onChange('x', (Number(e.target.value) || 0) / cardWidth)}
        />
      </div>
      <div>
        <h5 className="input-description">Y</h5>
        <input
          type="number"
          step={1}
          value={textBoundPixelValue(bounds, 'y', cardWidth, cardHeight)}
          onChange={(e) => onChange('y', (Number(e.target.value) || 0) / cardHeight)}
        />
      </div>
      <div>
        <h5 className="input-description">宽度</h5>
        <input
          type="number"
          min={0}
          step={1}
          value={textBoundPixelValue(bounds, 'width', cardWidth, cardHeight)}
          onChange={(e) => onChange('width', (Number(e.target.value) || 0) / cardWidth)}
        />
      </div>
      <div>
        <h5 className="input-description">高度</h5>
        <input
          type="number"
          min={0}
          step={1}
          value={textBoundPixelValue(bounds, 'height', cardWidth, cardHeight)}
          onChange={(e) => onChange('height', (Number(e.target.value) || 0) / cardHeight)}
        />
      </div>
    </>
  );
}

function TextReferenceEntry({ row }: { readonly row: TextReferenceRow }): JSX.Element {
  return (
    <>
      <h5>{row.code}</h5>
      <h5>{row.result}</h5>
    </>
  );
}

function createCustomTextLayer(kind: CustomTextLayerPreset, face: CardFace): CustomTextLayer {
  const id = createCustomTextLayerId();
  if (kind === 'nickname') {
    return {
      id,
      name: 'Nickname',
      text: face.name,
      bounds: NICKNAME_TEXT_BOUNDS,
      visible: true,
      oneLine: true,
      fontSize: 0.0229,
      fontFamily: 'mplantin, Georgia, serif',
      color: '#ffffff',
      align: 'center',
      italic: true,
    };
  }
  if (kind === 'powerToughness') {
    return {
      id,
      name: 'Power/Toughness',
      text: face.powerToughness ?? '',
      bounds: M15_PT_BOUNDS,
      visible: true,
      oneLine: true,
      fontSize: 0.0372,
      fontFamily: 'belerenbsc, system-ui, sans-serif',
      color: '#1d1d1d',
      align: 'center',
      bold: true,
    };
  }
  if (kind === 'dateStamp') {
    return {
      id,
      name: 'Date Stamp',
      text: '',
      bounds: DATE_STAMP_TEXT_BOUNDS,
      visible: true,
      oneLine: true,
      fontSize: 0.0286,
      fontFamily: 'belerenb, system-ui, sans-serif',
      color: '#ffd35b',
      align: 'end',
      bold: true,
    };
  }
  return {
    id,
    name: 'Custom Text',
    text: '',
    bounds: CUSTOM_TEXT_BOUNDS,
    visible: true,
    oneLine: false,
    fontSize: 0.028,
    fontFamily: 'mplantin, Georgia, serif',
    color: '#1d1d1d',
    align: 'start',
  };
}

function createCustomTextLayerId(): string {
  return `text-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function createFrameLayerId(): string {
  return `frame-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function resetArtTransformFields(): Partial<CardFace> {
  return {
    artOffsetX: 0,
    artOffsetY: 0,
    artZoom: 1,
    artRotation: 0,
    artGrayscale: false,
  };
}

function matchesFrameVersionSearch(version: FrameVersion, query: string): boolean {
  if (matchesSearch(`${version.id} ${version.label} ${version.group}`, query)) return true;
  return getFramePresets(version.id).some((preset) => matchesSearch(`${preset.id} ${preset.label}`, query));
}

function matchesSearch(value: string, query: string): boolean {
  return value.toLowerCase().includes(query);
}

function customTextFontSizeValue(fontSize: number | null | undefined): number {
  return Math.round(((fontSize ?? 0.028) * 100) * 10) / 10;
}

function extensionFromMime(mime: string): string {
  if (mime === 'image/jpeg') return 'jpg';
  if (mime === 'image/svg+xml') return 'svg';
  const match = /^image\/([a-z0-9.+-]+)$/i.exec(mime);
  return match?.[1]?.replace(/\+xml$/i, '') ?? 'png';
}

function getDefaultRegionBounds(field: CardRegionField): CardRegionBounds {
  switch (field) {
    case 'artBounds':
      return M15_ART_BOUNDS;
    case 'manaBounds':
      return M15_MANA_BOUNDS;
    case 'titleBounds':
      return M15_TITLE_BOUNDS;
    case 'typeBounds':
      return M15_TYPE_BOUNDS;
    case 'rulesBounds':
      return M15_RULES_BOUNDS;
    case 'powerToughnessBounds':
      return M15_PT_BOUNDS;
    case 'loyaltyBounds':
      return M15_LOYALTY_BOUNDS;
  }
}

function getTextEditorValue(
  face: CardFace,
  targetId: TextEditorTargetId,
  customLayer: CustomTextLayer | null,
): string {
  if (targetId.startsWith('custom:')) return customLayer?.text ?? '';
  if (targetId === 'manaCost') return face.manaCost ?? '';
  if (targetId === 'name') return face.name;
  if (targetId === 'typeLine') return face.typeLine;
  if (targetId === 'powerToughness') {
    return face.layout === 'planeswalker' ? face.loyalty ?? '' : face.powerToughness ?? '';
  }
  if (targetId === 'rulesText') return formatRulesAndFlavorText(face.rulesText, face.flavorText);
  return face.rulesText;
}

function formatRulesAndFlavorText(rulesText: string, flavorText: string | null | undefined): string {
  const flavor = flavorText?.trim();
  if (!flavor) return rulesText;
  const rules = rulesText.trimEnd();
  return rules ? `${rules}\n{flavor}\n${flavor}` : `{flavor}\n${flavor}`;
}

function splitRulesAndFlavorText(value: string): RulesAndFlavorText {
  const marker = /\{(?:flavor|oldflavor)\}/i.exec(value);
  if (!marker) return { rulesText: value, flavorText: null };

  const rulesText = value.slice(0, marker.index).trimEnd();
  const flavorText = value.slice(marker.index + marker[0].length).replace(/^\s*\n?/, '').trimEnd();
  return {
    rulesText,
    flavorText: flavorText.trim() ? flavorText : null,
  };
}

function getTextTargetBounds(
  face: CardFace,
  targetId: TextEditorTargetId,
  customLayer: CustomTextLayer | null,
): CardRegionBounds {
  if (targetId.startsWith('custom:')) return customLayer?.bounds ?? CUSTOM_TEXT_BOUNDS;
  const field = getBuiltInTextBoundsField(targetId, face.layout);
  return face[field] ?? getDefaultRegionBounds(field);
}

function getBuiltInTextBoundsField(
  targetId: BuiltInTextTargetId,
  layout: CardLayout | undefined,
): CardRegionField {
  if (targetId === 'manaCost') return 'manaBounds';
  if (targetId === 'name') return 'titleBounds';
  if (targetId === 'typeLine') return 'typeBounds';
  if (targetId === 'powerToughness') return layout === 'planeswalker' ? 'loyaltyBounds' : 'powerToughnessBounds';
  return 'rulesBounds';
}

function frameLayerPixelBoundValue(
  bounds: FrameLayerBounds | null | undefined,
  key: keyof FrameLayerBounds,
  cardWidth: number,
  cardHeight: number,
): number {
  const fallback = key === 'width' || key === 'height' ? 1 : 0;
  const dimension = key === 'x' || key === 'width' ? cardWidth : cardHeight;
  return Math.round((bounds?.[key] ?? fallback) * dimension);
}

function textBoundPixelValue(
  bounds: CardRegionBounds,
  key: keyof CardRegionBounds,
  cardWidth: number,
  cardHeight: number,
): number {
  const dimension = key === 'x' || key === 'width' ? cardWidth : cardHeight;
  return Math.round(bounds[key] * dimension);
}

function frameLayerDisplayName(layer: FrameLayer): string {
  const maskNames = getFrameLayerMasks(layer).map((mask) => mask.name);
  return maskNames.length > 0 ? `${layer.name}, ${maskNames.join(', ')}` : layer.name;
}

function getFrameLayerMasks(layer: FrameLayer): readonly FrameLayerMask[] {
  if (layer.masks && layer.masks.length > 0) return normalizeFrameLayerMasks(layer.masks);
  if (!layer.maskUrl) return [];
  return normalizeFrameLayerMasks([{ url: layer.maskUrl, name: layer.maskName ?? 'Mask' }]);
}

function normalizeFrameLayerMasks(masks: readonly FrameLayerMask[]): readonly FrameLayerMask[] {
  return masks
    .map((mask) => ({ url: mask.url.trim(), name: mask.name.trim() || 'Mask' }))
    .filter((mask) => Boolean(mask.url));
}

function getFrameLayerThumbnailMask(masks: readonly FrameLayerMask[]): FrameLayerMask | null {
  return masks.find((mask) => !isSplitFrameMaskUrl(mask.url)) ?? null;
}

function isSplitFrameMaskUrl(url: string): boolean {
  return Object.values(FRAME_SPLIT_MASKS).some((mask) => mask.url === url);
}

function thumbnailUrl(url: string): string {
  if (url.startsWith('data:')) return url;
  return url.replace(/\.(png|svg)$/i, 'Thumb.png');
}

function createCustomFramePreset(packId: string, url: string, label: string): CustomFramePreset {
  const id = `custom-frame-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    packId,
    label,
    url,
  };
}

function fallbackImage(image: HTMLImageElement, fallbackUrl: string): void {
  if (image.src.endsWith(fallbackUrl)) return;
  image.src = fallbackUrl;
}

function preventDropDefaults(event: DragEvent<HTMLElement>): void {
  event.preventDefault();
}

function firstDroppedFile(event: DragEvent<HTMLElement>): File | null {
  return event.dataTransfer.files?.[0] ?? null;
}

function droppedFiles(event: DragEvent<HTMLElement>): readonly File[] {
  return Array.from(event.dataTransfer.files ?? []);
}

function framePresetMatchesColor(preset: { readonly id: string; readonly label: string }, color: FrameColor): boolean {
  const normalizedId = preset.id.toLowerCase();
  const normalizedLabel = preset.label.toLowerCase();
  const labelMatch = FRAME_COLOR_NAME_BY_ID[color].toLowerCase();
  const keyMatch = FRAME_COLOR_KEY_BY_ID[color];
  return (
    normalizedLabel.startsWith(`${labelMatch} `) ||
    normalizedId.endsWith(`-${keyMatch}`) ||
    normalizedId.endsWith(keyMatch)
  );
}

function formatMaskLabel(label: string, url: string): string {
  if (!url) return 'No Mask';
  return label.replace(/\s*\([^)]*\)\s*$/, '');
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

const FRAME_COLOR_NAME_BY_ID: Readonly<Record<FrameColor, string>> = {
  W: 'White',
  U: 'Blue',
  B: 'Black',
  R: 'Red',
  G: 'Green',
  M: 'Multicolored',
  A: 'Artifact',
  L: 'Land',
  C: 'Colorless',
};

const FRAME_COLOR_KEY_BY_ID: Readonly<Record<FrameColor, string>> = {
  W: 'w',
  U: 'u',
  B: 'b',
  R: 'r',
  G: 'g',
  M: 'm',
  A: 'a',
  L: 'l',
  C: 'c',
};
