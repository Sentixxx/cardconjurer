import { useEffect, useState, type JSX } from 'react';
import { Placeholder } from '@/components/Placeholder';
import { Canvas } from '@/features/creator/canvas/Canvas';
import { renderCardToBlob } from '@/features/creator/canvas/renderToBlob';
import { CardFaceForm } from '@/features/creator/components/CardFaceForm';
import { CreatorActions } from '@/features/creator/components/CreatorActions';
import { CreatorIdentityFields } from '@/features/creator/components/CreatorIdentityFields';
import { FaceSwitcher, type FaceSide } from '@/features/creator/components/FaceSwitcher';
import { useCardData } from '@/hooks/useCardData';
import { useFrameVersions } from '@/hooks/useFrameVersions';
import { useImageAsset } from '@/hooks/useImageAsset';
import { useSavedCards } from '@/hooks/useSavedCards';
import { readQueryParam } from '@/lib/router';
import { readCardEntry } from '@/services/storage';
import {
  EMPTY_CARD_FACE,
  applyFaceToCard,
  cardFaceFromMain,
  isCardData,
  type CardFace,
} from '@/types/cardData';
import { downloadBlob } from '@/utils/download';

export function CreatorPage(): JSX.Element {
  const { card, setCard, updateField } = useCardData();
  const { versions } = useFrameVersions();
  const { save } = useSavedCards();
  const [activeFace, setActiveFace] = useState<FaceSide>('A');
  const [lastSavedKey, setLastSavedKey] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const face: CardFace =
    activeFace === 'A' ? cardFaceFromMain(card) : card.face2 ?? EMPTY_CARD_FACE;
  const displayedCard = activeFace === 'B' && card.face2 ? applyFaceToCard(card, card.face2) : card;
  const art = useImageAsset(face.artUrl ?? null);
  const frame = useImageAsset(face.frameUrl ?? null);

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

  const setFace = (next: CardFace): void => {
    if (activeFace === 'A') {
      setCard(applyFaceToCard(card, next));
    } else {
      updateField('face2', next);
    }
  };
  const setFaceField = <K extends keyof CardFace>(key: K, value: CardFace[K]): void => {
    setFace({ ...face, [key]: value });
  };

  const onSave = (): void => {
    const resolved = save(card.key, card);
    setLastSavedKey(resolved);
  };

  const onDownloadPng = async (): Promise<void> => {
    try {
      const blob = await renderCardToBlob(displayedCard, { art: art.image, frame: frame.image }, 'image/png');
      const safeName = card.key.replace(/[^a-z0-9_-]+/gi, '_') || 'card';
      const suffix = activeFace === 'B' ? '_back' : '';
      downloadBlob(`${safeName}${suffix}.png`, blob);
      setExportError(null);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'PNG export failed');
    }
  };

  return (
    <>
      <Placeholder
        routeKey="creator"
        description="Card Creator — minimal canvas + form. Frame assets/text layers will be ported from src/legacy-app/js/creator-23.js in later iterations."
      />
      <FaceSwitcher
        activeFace={activeFace}
        hasFaceB={card.face2 != null}
        onSelect={setActiveFace}
        onAddFaceB={() => {
          updateField('face2', EMPTY_CARD_FACE);
          setActiveFace('B');
        }}
        onRemoveFaceB={() => {
          updateField('face2', null);
          setActiveFace('A');
        }}
      />
      <section>
        <h2>Edit ({activeFace === 'A' ? 'Face A' : 'Face B'})</h2>
        <CreatorIdentityFields
          card={card}
          disabled={activeFace !== 'A'}
          onChangeKey={(v) => updateField('key', v)}
          onChangeSet={(v) => updateField('setCode', v)}
          onChangeRarity={(v) => updateField('rarity', v)}
          onChangeCardNumber={(v) => updateField('cardNumber', v)}
          onChangeArtist={(v) => updateField('artist', v)}
        />
        <CardFaceForm
          face={face}
          versions={versions}
          art={art}
          frame={frame}
          fallbackFrameVersionId={card.frameVersionId}
          setField={setFaceField}
        />
      </section>
      <section>
        <h2>Preview ({activeFace === 'A' ? 'Face A' : 'Face B'})</h2>
        <Canvas card={displayedCard} artImage={art.image} frameImage={frame.image} />
      </section>
      <CreatorActions
        lastSavedKey={lastSavedKey}
        loadError={loadError}
        exportError={exportError}
        onSave={onSave}
        onDownloadPng={() => void onDownloadPng()}
      />
    </>
  );
}
