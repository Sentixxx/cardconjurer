import { useEffect, useRef, useState, type ChangeEvent, type JSX } from 'react';
import { Canvas, type CanvasDragTarget, type CanvasTransformDelta } from '@/features/creator/canvas/Canvas';
import { renderCardToBlob } from '@/features/creator/canvas/renderToBlob';
import { CardFaceForm, type CardFaceFormSection } from '@/features/creator/components/CardFaceForm';
import { CreatorCollapsible } from '@/features/creator/components/CreatorCollapsible';
import { CreatorIdentityFields } from '@/features/creator/components/CreatorIdentityFields';
import {
  CreatorSymbolWatermarkFields,
  type SymbolWatermarkSection,
} from '@/features/creator/components/CreatorSymbolWatermarkFields';
import { CreatorSpecialLayoutFields } from '@/features/creator/components/CreatorSpecialLayoutFields';
import type { FaceSide } from '@/features/creator/components/FaceSwitcher';
import { useCardData } from '@/hooks/useCardData';
import { useFrameVersions } from '@/hooks/useFrameVersions';
import { useImageAsset } from '@/hooks/useImageAsset';
import { useImageAssets } from '@/hooks/useImageAssets';
import { useSavedCards } from '@/hooks/useSavedCards';
import { readQueryParam } from '@/lib/router';
import {
  AUTO_FRAME_MODE_OPTIONS,
  mergeAutoFrameLayers,
  resolveAutoFrame,
  type AutoFrameMode,
  type AutoFrameResult,
} from '@/services/autoFrame';
import { getFrameLayoutPreset } from '@/services/framePresets';
import {
  importCardCandidate,
  importScryfallClipboardText,
  searchCardImportCandidates,
  type CardImportSource,
  type ScryfallImportCandidate,
} from '@/services/scryfall';
import { readCardEntry } from '@/services/storage';
import {
  DEFAULT_CARD_HEIGHT,
  DEFAULT_CARD_WIDTH,
  EMPTY_CARD_FACE,
  applyFaceToCard,
  cardFaceFromMain,
  isCardData,
  type CardFace,
  type FrameLayer,
  type FrameLayerBounds,
} from '@/types/cardData';
import { downloadBlob, downloadTextFile, readTextFile } from '@/utils/download';

type CreatorTab = CardFaceFormSection | SymbolWatermarkSection | 'bottomInfo' | 'save' | 'tutorial' | 'saga' | 'planeswalker';

const CREATOR_TABS: readonly { id: CreatorTab; label: string }[] = [
  { id: 'frame', label: '牌框' },
  { id: 'text', label: '文本' },
  { id: 'art', label: '卡图' },
  { id: 'setSymbol', label: '系列图标' },
  { id: 'watermark', label: '水印' },
  { id: 'bottomInfo', label: '收藏家信息' },
  { id: 'save', label: '导入/保存' },
  { id: 'tutorial', label: '教程' },
];

function isCardFaceFormSection(tab: CreatorTab): tab is CardFaceFormSection {
  return tab === 'frame' || tab === 'text' || tab === 'art';
}

function isSymbolWatermarkSection(tab: CreatorTab): tab is SymbolWatermarkSection {
  return tab === 'setSymbol' || tab === 'watermark';
}

function roundTransform(value: number): number {
  return Math.round(value * 100) / 100;
}

function getCanvasDragTarget(
  activeTab: CreatorTab,
  artImage: HTMLImageElement | null,
  setSymbolImage: HTMLImageElement | null,
  watermarkImage: HTMLImageElement | null,
  selectedFrameLayerIndex: number,
): CanvasDragTarget | undefined {
  if (activeTab === 'frame') {
    return selectedFrameLayerIndex >= 0 ? { kind: 'frameLayer', index: selectedFrameLayerIndex } : undefined;
  }
  if (activeTab === 'art') return artImage ? 'art' : undefined;
  if (activeTab === 'setSymbol') return setSymbolImage ? 'setSymbol' : undefined;
  if (activeTab === 'watermark') return watermarkImage ? 'watermark' : undefined;
  return undefined;
}

function isFrameLayerDragTarget(target: CanvasDragTarget): target is { readonly kind: 'frameLayer'; readonly index: number } {
  return typeof target === 'object' && target !== null && target.kind === 'frameLayer';
}

function roundRatio(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function transformFrameLayerBounds(
  bounds: FrameLayerBounds | null | undefined,
  cardWidth: number,
  cardHeight: number,
  delta: CanvasTransformDelta,
): FrameLayerBounds {
  let next: FrameLayerBounds = bounds ?? { x: 0, y: 0, width: 1, height: 1 };
  if (delta.offsetX !== undefined || delta.offsetY !== undefined) {
    next = {
      ...next,
      x: roundRatio(next.x + (delta.offsetX ?? 0) / cardWidth),
      y: roundRatio(next.y + (delta.offsetY ?? 0) / cardHeight),
    };
  }
  if (delta.scaleDelta !== undefined) {
    const scale = Math.max(0.05, 1 + delta.scaleDelta);
    const centerX = next.x + next.width / 2;
    const centerY = next.y + next.height / 2;
    const width = Math.max(0.001, next.width * scale);
    const height = Math.max(0.001, next.height * scale);
    next = {
      x: roundRatio(centerX - width / 2),
      y: roundRatio(centerY - height / 2),
      width: roundRatio(width),
      height: roundRatio(height),
    };
  }
  return next;
}

function applyFrameLayoutPresetToFace(face: CardFace, frameVersionId: string): CardFace {
  const layoutPreset = getFrameLayoutPreset(frameVersionId);
  if (!layoutPreset) return face;
  return {
    ...face,
    layout: layoutPreset.layout ?? face.layout,
    artBounds: layoutPreset.artBounds,
    manaBounds: layoutPreset.manaBounds,
    titleBounds: layoutPreset.titleBounds,
    typeBounds: layoutPreset.typeBounds,
    rulesBounds: layoutPreset.rulesBounds,
    powerToughnessBounds: layoutPreset.powerToughnessBounds,
    loyaltyBounds: layoutPreset.loyaltyBounds ?? null,
  };
}

function faceMatchesAutoFrameResult(face: CardFace, result: AutoFrameResult): boolean {
  const mergedLayers = mergeAutoFrameLayers(face.frameLayers, result.frameLayers);
  return (
    face.frameVersionId === result.frameVersionId &&
    face.frameUrl === result.frameUrl &&
    face.frameColor === result.frameColor &&
    JSON.stringify(face.frameLayers ?? []) === JSON.stringify(mergedLayers)
  );
}

function getFrameLayerMaskUrls(layer: FrameLayer): readonly string[] {
  if (layer.masks && layer.masks.length > 0) return layer.masks.map((mask) => mask.url).filter(Boolean);
  return layer.maskUrl ? [layer.maskUrl] : [];
}

export function CreatorPage(): JSX.Element {
  const { card, setCard, updateField } = useCardData();
  const { versions } = useFrameVersions();
  const { registry, save, remove, importJson } = useSavedCards();
  const [activeFace, setActiveFace] = useState<FaceSide>('A');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CreatorTab>('frame');
  const [importName, setImportName] = useState('');
  const [importCandidates, setImportCandidates] = useState<readonly ScryfallImportCandidate[]>([]);
  const [selectedImportId, setSelectedImportId] = useState('');
  const [includeAllPrints, setIncludeAllPrints] = useState(false);
  const [importSource, setImportSource] = useState<CardImportSource>('mtgch');
  const [importLanguage, setImportLanguage] = useState('en');
  const [selectedSavedKey, setSelectedSavedKey] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const importRequestId = useRef(0);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showTransparency, setShowTransparency] = useState(false);
  const [selectedFrameLayerId, setSelectedFrameLayerId] = useState<string | null>(null);
  const [autoLoadFrameVersion, setAutoLoadFrameVersion] = useState(true);
  const [autoFrameMode, setAutoFrameMode] = useState<AutoFrameMode>('off');
  const [autoFrameAlwaysNyx, setAutoFrameAlwaysNyx] = useState(true);
  const [roundedDownloadCorners, setRoundedDownloadCorners] = useState(true);
  const [enabledSpecialTabs, setEnabledSpecialTabs] = useState({ saga: false, planeswalker: false });

  const face: CardFace =
    activeFace === 'A' ? cardFaceFromMain(card) : card.face2 ?? EMPTY_CARD_FACE;
  const creatorTabs: readonly { id: CreatorTab; label: string }[] = [
    ...CREATOR_TABS,
    ...(enabledSpecialTabs.saga ? [{ id: 'saga' as const, label: 'Saga' }] : []),
    ...(enabledSpecialTabs.planeswalker ? [{ id: 'planeswalker' as const, label: 'Planeswalker' }] : []),
  ];
  const displayedCard = activeFace === 'B' && card.face2 ? applyFaceToCard(card, card.face2) : card;
  const art = useImageAsset(face.artUrl ?? null);
  const frame = useImageAsset(face.frameUrl ?? null);
  const frameLayers = face.frameLayers ?? [];
  const selectedFrameLayerIndex = frameLayers.findIndex((layer) => layer.id === selectedFrameLayerId);
  const frameLayerAssets = useImageAssets(frameLayers.map((layer) => layer.url));
  const frameLayerMaskUrlGroups = frameLayers.map(getFrameLayerMaskUrls);
  const frameLayerMaskAssets = useImageAssets(frameLayerMaskUrlGroups.flat());
  let frameLayerMaskAssetIndex = 0;
  const frameLayerDrawLayers = frameLayers.map((layer, index) => {
    const maskUrls = frameLayerMaskUrlGroups[index] ?? [];
    const maskImages = frameLayerMaskAssets
      .slice(frameLayerMaskAssetIndex, frameLayerMaskAssetIndex + maskUrls.length)
      .map((asset) => asset.image ?? null);
    frameLayerMaskAssetIndex += maskUrls.length;
    return {
      image: frameLayerAssets[index]?.image ?? null,
      maskImages,
      bounds: layer.bounds ?? null,
      visible: layer.visible ?? true,
      opacity: layer.opacity ?? 1,
      erase: layer.erase ?? false,
      preserveAlpha: layer.preserveAlpha ?? false,
      colorOverlayEnabled: layer.colorOverlayEnabled ?? false,
      colorOverlay: layer.colorOverlay ?? null,
      hslHue: layer.hslHue ?? 0,
      hslSaturation: layer.hslSaturation ?? 0,
      hslLightness: layer.hslLightness ?? 0,
    };
  });
  const setSymbol = useImageAsset(card.setSymbolUrl ?? null);
  const watermark = useImageAsset(card.watermarkUrl ?? null);
  const canvasDragTarget = getCanvasDragTarget(
    activeTab,
    art.image,
    setSymbol.image,
    watermark.image,
    selectedFrameLayerIndex,
  );

  useEffect(() => {
    const key = readQueryParam('key');
    if (!key) return;
    const entry = readCardEntry(key);
    if (!entry) {
      setLoadError(`No saved card found for key "${key}".`);
      return;
    }
    if (!isCardData(entry.raw)) {
      setLoadError(`Saved entry "${key}" does not match the current CardData schema.`);
      return;
    }
    setCard(entry.raw);
    setActiveFace('A');
    setLoadError(null);
  }, [setCard]);

  useEffect(() => {
    if (face.layout === 'saga') {
      setEnabledSpecialTabs((tabs) => (tabs.saga ? tabs : { ...tabs, saga: true }));
    }
    if (face.layout === 'planeswalker') {
      setEnabledSpecialTabs((tabs) => (tabs.planeswalker ? tabs : { ...tabs, planeswalker: true }));
    }
  }, [face.layout]);

  useEffect(() => {
    if (frameLayers.length === 0) {
      if (selectedFrameLayerId !== null) setSelectedFrameLayerId(null);
      return;
    }
    if (!selectedFrameLayerId || !frameLayers.some((layer) => layer.id === selectedFrameLayerId)) {
      setSelectedFrameLayerId(frameLayers[frameLayers.length - 1]?.id ?? null);
    }
  }, [frameLayers, selectedFrameLayerId]);

  const setFace = (next: CardFace): void => {
    if (activeFace === 'A') {
      setCard(applyFaceToCard(card, next));
    } else {
      updateField('face2', next);
    }
  };

  const setFaceWithFrameVersion = (nextFace: CardFace, frameVersionId: string): void => {
    const layoutPreset = getFrameLayoutPreset(frameVersionId);
    const nextFaceWithLayout = applyFrameLayoutPresetToFace(nextFace, frameVersionId);

    if (activeFace !== 'A') {
      if (layoutPreset) {
        setCard({
          ...card,
          face2: nextFaceWithLayout,
          width: layoutPreset.cardWidth ?? DEFAULT_CARD_WIDTH,
          height: layoutPreset.cardHeight ?? DEFAULT_CARD_HEIGHT,
        });
        return;
      }
      setFace(nextFaceWithLayout);
      return;
    }

    const nextCard = applyFaceToCard(card, nextFaceWithLayout);
    setCard(
      layoutPreset
        ? {
            ...nextCard,
            setSymbolBounds: layoutPreset.setSymbolBounds ?? nextCard.setSymbolBounds,
            setSymbolOffsetX: 0,
            setSymbolOffsetY: 0,
            setSymbolScale: 1,
            watermarkBounds: layoutPreset.watermarkBounds ?? nextCard.watermarkBounds,
            watermarkOffsetX: 0,
            watermarkOffsetY: 0,
            watermarkScale: 1,
            width: layoutPreset.cardWidth ?? DEFAULT_CARD_WIDTH,
            height: layoutPreset.cardHeight ?? DEFAULT_CARD_HEIGHT,
          }
        : nextCard,
    );
  };

  const setFaceField = <K extends keyof CardFace>(key: K, value: CardFace[K]): void => {
    const nextFace = { ...face, [key]: value };
    if (key === 'frameVersionId' && typeof value === 'string') {
      if (autoLoadFrameVersion) {
        setFaceWithFrameVersion(nextFace, value);
      } else {
        setFace(nextFace);
      }
      return;
    }
    setFace(nextFace);
  };
  const setFaceFields = (fields: Partial<CardFace>): void => {
    setFace({ ...face, ...fields });
  };

  const applyAutoFrameToCurrentFace = (): void => {
    const result = resolveAutoFrame(face, { mode: autoFrameMode, alwaysNyx: autoFrameAlwaysNyx });
    if (!result || faceMatchesAutoFrameResult(face, result)) return;
    setFaceWithFrameVersion(
      {
        ...face,
        frameVersionId: result.frameVersionId,
        frameColor: result.frameColor,
        frameUrl: result.frameUrl,
        frameLayers: mergeAutoFrameLayers(face.frameLayers, result.frameLayers),
      },
      result.frameVersionId,
    );
  };

  useEffect(() => {
    if (autoFrameMode === 'off') return;
    applyAutoFrameToCurrentFace();
  }, [
    activeFace,
    autoFrameAlwaysNyx,
    autoFrameMode,
    face.manaCost,
    face.powerToughness,
    face.rulesText,
    face.typeLine,
  ]);

  const onCanvasTransformDelta = (target: CanvasDragTarget, delta: CanvasTransformDelta): void => {
    if (isFrameLayerDragTarget(target)) {
      const targetLayer = frameLayers[target.index];
      if (!targetLayer) return;
      const nextLayers = frameLayers.map((layer, index) =>
        index === target.index
          ? {
              ...layer,
              bounds: transformFrameLayerBounds(layer.bounds, displayedCard.width, displayedCard.height, delta),
            }
          : layer,
      );
      setFace({ ...face, frameLayers: nextLayers });
      return;
    }
    if (target === 'setSymbol') {
      if (delta.offsetX !== undefined) {
        updateField('setSymbolOffsetX', roundTransform((card.setSymbolOffsetX ?? 0) + delta.offsetX));
      }
      if (delta.offsetY !== undefined) {
        updateField('setSymbolOffsetY', roundTransform((card.setSymbolOffsetY ?? 0) + delta.offsetY));
      }
      if (delta.scaleDelta !== undefined) {
        updateField('setSymbolScale', roundTransform(Math.max(0.05, (card.setSymbolScale ?? 1) + delta.scaleDelta)));
      }
      return;
    }
    if (target === 'watermark') {
      if (delta.offsetX !== undefined) {
        updateField('watermarkOffsetX', roundTransform((card.watermarkOffsetX ?? 0) + delta.offsetX));
      }
      if (delta.offsetY !== undefined) {
        updateField('watermarkOffsetY', roundTransform((card.watermarkOffsetY ?? 0) + delta.offsetY));
      }
      if (delta.scaleDelta !== undefined) {
        updateField('watermarkScale', roundTransform(Math.max(0.05, (card.watermarkScale ?? 1) + delta.scaleDelta)));
      }
      return;
    }

    const next: CardFace = { ...face };
    if (delta.offsetX !== undefined) {
      next.artOffsetX = roundTransform((face.artOffsetX ?? 0) + delta.offsetX);
    }
    if (delta.offsetY !== undefined) {
      next.artOffsetY = roundTransform((face.artOffsetY ?? 0) + delta.offsetY);
    }
    if (delta.scaleDelta !== undefined) {
      next.artZoom = roundTransform(Math.max(0.05, (face.artZoom ?? 1) + delta.scaleDelta));
    }
    if (delta.rotationDelta !== undefined) {
      next.artRotation = roundTransform((face.artRotation ?? 0) + delta.rotationDelta);
    }
    setFace(next);
  };

  const onSave = (): void => {
    const fallbackName = card.name.trim() || card.key || 'untitled';
    const requestedKey = window.prompt('Enter the name you would like to save your card under:', fallbackName)?.trim();
    if (!requestedKey) return;

    const overwrite =
      registry.keys.includes(requestedKey) &&
      window.confirm(
        `Would you like to overwrite your card previously saved as "${requestedKey}"?\n(Clicking "cancel" will affix a version number)`,
      );
    save(requestedKey, { ...card, key: requestedKey }, { overwrite });
  };

  const onDownloadImage = async (mime: 'image/png' | 'image/jpeg'): Promise<void> => {
    try {
      const blob = await renderCardToBlob(
        displayedCard,
        {
          art: art.image,
          frame: frame.image,
          frameLayers: frameLayerDrawLayers,
          setSymbol: setSymbol.image,
          watermark: watermark.image,
        },
        mime,
        mime === 'image/jpeg' ? 0.8 : undefined,
        { roundedCorners: roundedDownloadCorners },
      );
      const safeName = card.key.replace(/[^a-z0-9_-]+/gi, '_') || 'card';
      const suffix = activeFace === 'B' ? '_back' : '';
      const extension = mime === 'image/jpeg' ? 'jpeg' : 'png';
      downloadBlob(`${safeName}${suffix}.${extension}`, blob);
      setExportError(null);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Image export failed');
    }
  };

  const onDeleteSelectedSavedCard = (): void => {
    if (!selectedSavedKey) return;
    remove(selectedSavedKey);
    setSelectedSavedKey('');
  };

  const onDownloadAllSavedCards = (): void => {
    const legacyExport = registry.entries.map((entry) => ({ key: entry.key, data: entry.raw }));
    downloadTextFile('saved-cards.cardconjurer', JSON.stringify(legacyExport));
  };

  const onImportSavedCardsFile = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      importJson(await readTextFile(file));
      setImportStatus('ready');
      setLoadError(null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : '无法导入保存卡牌文件。');
    }
  };

  const onDeleteAllSavedCards = (): void => {
    const confirmed = window.confirm(
      'WARNING:\n\nALL of your saved cards will be deleted! If you would like to save these cards, please make sure you have downloaded them first. There is no way to undo this.\n\n(Press "OK" to delete your cards)',
    );
    if (!confirmed) return;
    for (const key of registry.keys) {
      remove(key);
    }
    setSelectedSavedKey('');
  };

  const onImportCard = async ({
    name = importName,
    source = importSource,
    language = importLanguage,
    allPrints = includeAllPrints,
  }: {
    readonly name?: string;
    readonly source?: CardImportSource;
    readonly language?: string;
    readonly allPrints?: boolean;
  } = {}): Promise<void> => {
    const requestId = importRequestId.current + 1;
    importRequestId.current = requestId;
    const query = name.trim();
    if (!query) {
      setImportCandidates([]);
      setSelectedImportId('');
      setImportStatus('idle');
      return;
    }
    setImportStatus('loading');
    try {
      const candidates = await searchCardImportCandidates(source, query, language, allPrints);
      if (importRequestId.current !== requestId) return;
      if (candidates.length === 0) {
        setImportCandidates([]);
        setSelectedImportId('');
        setImportStatus('error');
        return;
      }
      setImportCandidates(candidates);
      setSelectedImportId(candidates[0].id);
      const imported = importCardCandidate(candidates[0], card);
      setCard(imported);
      setActiveFace('A');
      setImportStatus('ready');
    } catch (error) {
      if (importRequestId.current !== requestId) return;
      console.error(error);
      setImportStatus('error');
    }
  };

  const onSelectImportCandidate = (candidateId: string): void => {
    setSelectedImportId(candidateId);
    const candidate = importCandidates.find((item) => item.id === candidateId);
    if (!candidate) return;
    const imported = importCardCandidate(candidate, card);
    setCard(imported);
    setActiveFace('A');
    setImportStatus('ready');
  };

  const onImportText = (text: string): void => {
    setImportStatus('loading');
    try {
      const imported = importScryfallClipboardText(text, card);
      setCard(imported);
      setActiveFace('A');
      setImportStatus('ready');
    } catch (error) {
      console.error(error);
      setImportStatus('error');
    }
  };

  const onPasteImportText = async (): Promise<void> => {
    try {
      if (!navigator.clipboard?.readText) {
        throw new Error('当前浏览器不支持读取剪贴板文本，或页面不是安全上下文。');
      }
      const text = await navigator.clipboard.readText();
      onImportText(text);
    } catch (error) {
      console.error(error);
      setImportStatus('error');
    }
  };

  const onLoadSavedCardByKey = (key: string): void => {
    if (!key) return;
    const entry = readCardEntry(key);
    if (!entry || !isCardData(entry.raw)) {
      setLoadError('选中的保存卡牌不是当前 CardData 格式。');
      return;
    }
    setCard(entry.raw);
    setActiveFace('A');
    setLoadError(null);
  };

  const creatorOutputOptions = (
    <section className="compact-section creator-output-options readable-background padding margin-bottom">
      <h5>自动更新牌框</h5>
      <select
        aria-label="Automatically update frame"
        value={autoFrameMode}
        onChange={(event) => setAutoFrameMode(event.target.value as AutoFrameMode)}
      >
        {AUTO_FRAME_MODE_OPTIONS.map((option) => (
          <option key={option.id} value={option.id} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={autoFrameAlwaysNyx}
          onChange={(event) => setAutoFrameAlwaysNyx(event.target.checked)}
        />
        使用星彩牌框（适用于所有结界）
      </label>
      <h3>下载您的卡片</h3>
      <div className="input-grid">
        <button type="button" onClick={() => void onDownloadImage('image/jpeg')}>
          点击这里下载为JPEG
        </button>
        <button type="button" onClick={() => void onDownloadImage('image/png')}>
          点击这里获取备用下载
        </button>
      </div>
      {exportError && <p>{exportError}</p>}
    </section>
  );

  return (
    <section className="creator-grid">
      <div className="creator-preview">
        <Canvas
          card={displayedCard}
          artImage={art.image}
          frameImage={frame.image}
          frameLayers={frameLayerDrawLayers}
          setSymbolImage={setSymbol.image}
          watermarkImage={watermark.image}
          displayWidth={750}
          showGuidelines={showGuidelines}
          showTransparency={showTransparency}
          dragTarget={canvasDragTarget}
          onTransformDelta={onCanvasTransformDelta}
        />
      </div>
      <div className="creator-menu box-shadow">
        <div className="creator-menu-tabs">
          {creatorTabs.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <h3
                key={tab.id}
                className={`selectable readable-background ${selected ? 'selected' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </h3>
            );
          })}
        </div>
        <div className="creator-menu-panel">
          {isCardFaceFormSection(activeTab) && (
            <>
              <CardFaceForm
                section={activeTab}
                face={face}
                versions={versions}
                art={art}
                frame={frame}
                fallbackFrameVersionId={card.frameVersionId}
                cardWidth={displayedCard.width}
                cardHeight={displayedCard.height}
                selectedFrameLayerId={selectedFrameLayerId}
                autoLoadFrameVersion={autoLoadFrameVersion}
                autoFrameMode={autoFrameMode}
                autoFrameAlwaysNyx={autoFrameAlwaysNyx}
                artist={card.artist}
                onArtistFound={(artist) => updateField('artist', artist)}
                onArtistChange={(artist) => updateField('artist', artist)}
                onSelectFrameLayer={setSelectedFrameLayerId}
                onAutoLoadFrameVersionChange={setAutoLoadFrameVersion}
                onAutoFrameModeChange={setAutoFrameMode}
                onAutoFrameAlwaysNyxChange={setAutoFrameAlwaysNyx}
                onApplyAutoFrame={applyAutoFrameToCurrentFace}
                setField={setFaceField}
                setFields={setFaceFields}
              />
              {activeTab === 'frame' && (
                <section className="compact-section creator-frame-options readable-background padding margin-bottom">
                  <h5>圆角（当下载时）</h5>
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={roundedDownloadCorners}
                      onChange={(event) => setRoundedDownloadCorners(event.target.checked)}
                    />
                    圆角
                  </label>
                  <h5>显示文本、卡图、水印和系列图标的指示线</h5>
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={showGuidelines}
                      onChange={(event) => setShowGuidelines(event.target.checked)}
                    />
                    指示线
                  </label>
                  <h5>突出显示卡片中的透明度</h5>
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={showTransparency}
                      onChange={(event) => setShowTransparency(event.target.checked)}
                    />
                    透明度
                  </label>
                </section>
              )}
              {activeTab === 'art' && (
                <section className="compact-section readable-background padding margin-bottom">
                  <h5>显示文本、卡图、水印和套牌符号的指示线</h5>
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={showGuidelines}
                      onChange={(event) => setShowGuidelines(event.target.checked)}
                    />
                    指示线
                  </label>
                </section>
              )}
            </>
          )}
          {isSymbolWatermarkSection(activeTab) && (
            <>
              <CreatorSymbolWatermarkFields
                section={activeTab}
                card={card}
                setSymbol={setSymbol}
                watermark={watermark}
                updateField={updateField}
              />
            </>
          )}
          {activeTab === 'bottomInfo' && (
            <>
              <CreatorIdentityFields
                card={card}
                disabled={activeFace !== 'A'}
                onChangeKey={(v) => updateField('key', v)}
                onChangeSet={(v) => updateField('setCode', v)}
                onChangeRarity={(v) => updateField('rarity', v)}
                onChangeCardNumber={(v) => updateField('cardNumber', v)}
                onChangeArtist={(v) => updateField('artist', v)}
              />
              {activeFace !== 'A' && <p className="input-description">收藏家信息应用于整张卡，请切回正面编辑。</p>}
            </>
          )}
          {activeTab === 'save' && (
            <>
              <section className="compact-section readable-background padding margin-bottom">
                <h5>通过名称导入一张真实卡牌</h5>
                <input
                  type="text"
                  value={importName}
                  placeholder="Enter Card Name"
                  onChange={(e) => setImportName(e.target.value)}
                  onBlur={(e) => void onImportCard({ name: e.currentTarget.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      void onImportCard();
                    }
                  }}
                />
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={includeAllPrints}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setIncludeAllPrints(checked);
                      void onImportCard({ allPrints: checked });
                    }}
                  />
                  包括所有版本
                </label>
                <h5>选择一张卡牌导入的数据源</h5>
                <select
                  value={importSource}
                  onChange={(e) => {
                    const source = e.target.value as CardImportSource;
                    setImportSource(source);
                    void onImportCard({ source });
                  }}
                >
                  <option value="scryfall">Scryfall</option>
                  <option value="mtgch">mtgch</option>
                  <option value="local">Local</option>
                </select>
                <h5>选择一张特定的卡牌导入</h5>
                <select
                  value={selectedImportId}
                  aria-label="Select specific card to import"
                  onChange={(e) => onSelectImportCandidate(e.target.value)}
                >
                  {importCandidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.label}
                    </option>
                  ))}
                </select>
                <h5>选择一张卡牌导入的语言（并非所有语言都始终可用）</h5>
                <select
                  value={importLanguage}
                  aria-label="Select language for card imports"
                  onChange={(e) => {
                    const language = e.target.value;
                    setImportLanguage(language);
                    void onImportCard({ language });
                  }}
                >
                  <option value="en">英语</option>
                  <option value="es">西班牙语</option>
                  <option value="fr">法语</option>
                  <option value="de">德语</option>
                  <option value="it">意大利语</option>
                  <option value="pt">葡萄牙语</option>
                  <option value="ja">日语</option>
                  <option value="ko">韩语</option>
                  <option value="ru">俄语</option>
                  <option value="zhs">简体中文</option>
                  <option value="zht">繁体中文</option>
                  <option value="ph">Phyrexian</option>
                </select>
              </section>
              <section className="compact-section readable-background padding margin-bottom">
                <h5>粘贴全部文本</h5>
                <button type="button" onClick={() => void onPasteImportText()} disabled={importStatus === 'loading'}>
                  粘贴卡牌
                </button>
              </section>
              <section className="compact-section readable-background padding margin-bottom">
                <h5>保存当前卡牌</h5>
                <button type="button" onClick={onSave}>
                  保存卡牌
                </button>
                <h5>加载保存的卡牌</h5>
                <select
                  value={selectedSavedKey}
                  aria-label="Load a saved card"
                  onChange={(e) => {
                    const key = e.target.value;
                    setSelectedSavedKey(key);
                    onLoadSavedCardByKey(key);
                  }}
                >
                  <option value="">None selected</option>
                  {registry.keys.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
                <h5>删除选中的卡牌</h5>
                <button type="button" onClick={onDeleteSelectedSavedCard} disabled={!selectedSavedKey}>
                  删除卡牌
                </button>
              </section>
              <section className="compact-section readable-background padding margin-bottom">
                <h5>下载所有保存的卡牌</h5>
                <button type="button" onClick={onDownloadAllSavedCards}>
                  下载所有
                </button>
                <h5>上传之前下载的保存卡牌文件（从上面下载）</h5>
                <input
                  type="file"
                  accept="application/json,.json"
                  onChange={(event) => void onImportSavedCardsFile(event)}
                />
                <h5>删除所有保存的卡牌</h5>
                <button type="button" onClick={onDeleteAllSavedCards} disabled={registry.keys.length === 0}>
                  删除所有
                </button>
              </section>
              <section className="compact-section readable-background padding margin-bottom">
                <CreatorCollapsible title="我的卡牌是如何保存的？">
                  <h5>卡片保存在您的计算机上，位于浏览器本地存储中，通常限制为5MB，无法更改。</h5>
                  <h5>不幸的是，这意味着如果您保存大量卡片，您可能会用完空间。</h5>
                  <h5>当您直接从计算机上传图像时，本地存储空间会特别快地用完，因为图像本身必须保存。然而，如果可能，通过URL上传图像将节省大量空间，允许您保存更多卡片。</h5>
                  <h5>如果您确实用完了空间，不用担心！您可以下载所有保存的卡片，然后删除所有保存的卡片，释放所有5MB的空间。当您想编辑之前下载/删除的卡片时，可以通过文件上传重新上传它们（在“上传之前下载的卡片”下）。</h5>
                </CreatorCollapsible>
                {loadError && <p>{loadError}</p>}
                {exportError && <p>{exportError}</p>}
              </section>
            </>
          )}
          {activeTab === 'tutorial' && (
            <>
              <section className="compact-section readable-background padding margin-bottom">
                <h5>以下是使用Card Conjurer的基础教程：</h5>
              </section>
              <div className="creator-video margin-bottom">
                <iframe
                  title="Card Conjurer tutorial"
                  src="https://player.bilibili.com/player.html?isOutside=true&aid=113906324346763&bvid=BV1mZFsegE2p&cid=28127986929&p=1&autoplay=0"
                  allow="encrypted-media"
                  allowFullScreen
                />
              </div>
            </>
          )}
          {activeTab === 'saga' && (
            <CreatorSpecialLayoutFields
              kind="saga"
              face={face}
              cardHeight={displayedCard.height}
              onChange={setFaceFields}
            />
          )}
          {activeTab === 'planeswalker' && (
            <CreatorSpecialLayoutFields
              kind="planeswalker"
              face={face}
              cardHeight={displayedCard.height}
              onChange={setFaceFields}
            />
          )}
          {creatorOutputOptions}
        </div>
      </div>
    </section>
  );
}
