import type { JSX } from 'react';
import { parsePlaneswalkerAbilities } from '@/services/planeswalker';
import { parseSagaAbilities } from '@/services/saga';
import type { CardFace, PlaneswalkerSettings, SagaSettings } from '@/types/cardData';

type SpecialLayoutKind = 'saga' | 'planeswalker';

interface CreatorSpecialLayoutFieldsProps {
  readonly kind: SpecialLayoutKind;
  readonly face: CardFace;
  readonly cardHeight: number;
  readonly onChange: (fields: Partial<CardFace>) => void;
}

const ABILITY_LABELS = ['First Ability:', 'Second Ability:', 'Third Ability:', 'Fourth Ability:'] as const;
const DEFAULT_PLANESWALKER_COSTS = ['', '+1', '0', '-7'] as const;
const DEFAULT_SAGA_CHAPTER_COUNTS = [1, 1, 1, 0] as const;

export function CreatorSpecialLayoutFields({
  kind,
  face,
  cardHeight,
  onChange,
}: CreatorSpecialLayoutFieldsProps): JSX.Element {
  if (kind === 'saga') {
    return <SagaFields face={face} cardHeight={cardHeight} onChange={onChange} />;
  }
  return <PlaneswalkerFields face={face} cardHeight={cardHeight} onChange={onChange} />;
}

function SagaFields({
  face,
  cardHeight,
  onChange,
}: Omit<CreatorSpecialLayoutFieldsProps, 'kind'>): JSX.Element {
  const settings = face.sagaSettings ?? {};
  const rows = parseSagaAbilities(face.rulesText).slice(0, 4);
  const activeRows = Math.max(rows.length, 3);
  const heights = Array.from({ length: 4 }, (_, index) =>
    ratioToPixels(
      settings.abilityHeights?.[index],
      index < activeRows ? Math.round(defaultRulesHeight(face, cardHeight) / activeRows) : 0,
      cardHeight,
    ),
  );
  const chapterCounts = Array.from({ length: 4 }, (_, index) =>
    numberValue(settings.chapterCounts?.[index], rows[index]?.steps ?? DEFAULT_SAGA_CHAPTER_COUNTS[index] ?? 0),
  );

  const updateSettings = (patch: SagaSettings): void => {
    onChange({ sagaSettings: { ...settings, ...patch } });
  };

  return (
    <section className="input-stack readable-background padding margin-bottom">
      <h5>Adjust the height (first input) and chapter count (second input) of each Saga ability</h5>
      {ABILITY_LABELS.map((label, index) => (
        <div key={label}>
          <h5>{label}</h5>
          <div className="input-grid margin-bottom">
            <input
              aria-label={`Saga ${label} height`}
              type="number"
              min={0}
              value={heights[index]}
              onChange={(event) => {
                updateSettings({
                  abilityHeights: setRatioAt(settings.abilityHeights, index, Number(event.target.value) || 0, cardHeight),
                });
              }}
            />
            <input
              aria-label={`Saga ${label} chapter count`}
              type="number"
              min={0}
              max={6}
              step={1}
              value={chapterCounts[index]}
              onChange={(event) => {
                updateSettings({
                  chapterCounts: setNumberAt(settings.chapterCounts, index, Number(event.target.value) || 0),
                });
              }}
            />
          </div>
        </div>
      ))}
    </section>
  );
}

function PlaneswalkerFields({
  face,
  cardHeight,
  onChange,
}: Omit<CreatorSpecialLayoutFieldsProps, 'kind'>): JSX.Element {
  const settings = face.planeswalkerSettings ?? {};
  const abilities = parsePlaneswalkerAbilities(face.rulesText).slice(0, 4);
  const activeRows = Math.max(abilities.length, 3);
  const heights = Array.from({ length: 4 }, (_, index) =>
    ratioToPixels(
      settings.abilityHeights?.[index],
      index < activeRows ? Math.round(defaultRulesHeight(face, cardHeight) / activeRows) : 0,
      cardHeight,
    ),
  );
  const costs = Array.from({ length: 4 }, (_, index) =>
    stringValue(settings.costs?.[index], abilities[index]?.cost ?? DEFAULT_PLANESWALKER_COSTS[index] ?? ''),
  );
  const shifts = Array.from({ length: 4 }, (_, index) =>
    ratioToPixels(settings.abilityAdjust?.[index], 0, cardHeight),
  );

  const updateSettings = (patch: PlaneswalkerSettings): void => {
    onChange({ planeswalkerSettings: { ...settings, ...patch } });
  };

  return (
    <section className="input-stack readable-background padding margin-bottom">
      <h5>Adjust the height (first input), loyalty cost (second input), and loyalty placement (third input) of each Planeswalker ability</h5>
      {ABILITY_LABELS.map((label, index) => (
        <div key={label}>
          <h5>{label}</h5>
          <div className="input-grid margin-bottom">
            <input
              aria-label={`Planeswalker ${label} height`}
              type="number"
              min={0}
              value={heights[index]}
              onChange={(event) => {
                updateSettings({
                  abilityHeights: setRatioAt(settings.abilityHeights, index, Number(event.target.value) || 0, cardHeight),
                });
              }}
            />
            <input
              aria-label={`Planeswalker ${label} loyalty cost`}
              type="text"
              value={costs[index]}
              onChange={(event) => {
                updateSettings({ costs: setStringAt(settings.costs, index, event.target.value) });
              }}
            />
            <input
              aria-label={`Planeswalker ${label} loyalty placement`}
              type="number"
              value={shifts[index]}
              onChange={(event) => {
                updateSettings({
                  abilityAdjust: setRatioAt(settings.abilityAdjust, index, Number(event.target.value) || 0, cardHeight),
                });
              }}
            />
          </div>
        </div>
      ))}
      <h5>Invert textbox colors:</h5>
      <input
        aria-label="Invert textbox colors"
        type="checkbox"
        checked={settings.invertTextBoxes ?? false}
        onChange={(event) => updateSettings({ invertTextBoxes: event.target.checked })}
      />
    </section>
  );
}

function defaultRulesHeight(face: CardFace, cardHeight: number): number {
  return Math.max(0, Math.round((face.rulesBounds?.height ?? 0.32) * cardHeight));
}

function ratioToPixels(value: number | undefined, fallback: number, cardHeight: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.round((value ?? 0) * cardHeight));
}

function numberValue(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.round(value)) : fallback;
}

function stringValue(value: string | undefined, fallback: string): string {
  return value ?? fallback;
}

function setNumberAt(values: readonly number[] | undefined, index: number, value: number): readonly number[] {
  const next = Array.from({ length: 4 }, (_, itemIndex) => numberValue(values?.[itemIndex], 0));
  next[index] = Math.max(0, Math.round(value));
  return next;
}

function setRatioAt(values: readonly number[] | undefined, index: number, pixelValue: number, cardHeight: number): readonly number[] {
  const next = Array.from({ length: 4 }, (_, itemIndex) => values?.[itemIndex] ?? 0);
  next[index] = cardHeight > 0 ? Math.max(0, pixelValue) / cardHeight : 0;
  return next;
}

function setStringAt(values: readonly string[] | undefined, index: number, value: string): readonly string[] {
  const next = Array.from({ length: 4 }, (_, itemIndex) => values?.[itemIndex] ?? '');
  next[index] = value;
  return next;
}
