import type { JSX } from 'react';
import type { CardFace, CardLayout, FrameColor } from '@/types/cardData';
import type { FrameVersion } from '@/types/template';
import type { ImageAssetState } from '@/types/asset';

const FRAME_COLORS: readonly { id: FrameColor; label: string }[] = [
  { id: 'W', label: 'White' },
  { id: 'U', label: 'Blue' },
  { id: 'B', label: 'Black' },
  { id: 'R', label: 'Red' },
  { id: 'G', label: 'Green' },
  { id: 'M', label: 'Multicolor' },
  { id: 'A', label: 'Artifact' },
  { id: 'L', label: 'Land' },
  { id: 'C', label: 'Colorless' },
];

export interface CardFaceFormProps {
  readonly face: CardFace;
  readonly versions: readonly FrameVersion[];
  readonly art: ImageAssetState;
  readonly frame: ImageAssetState;
  readonly fallbackFrameVersionId: string;
  readonly setField: <K extends keyof CardFace>(key: K, value: CardFace[K]) => void;
}

export function CardFaceForm(props: CardFaceFormProps): JSX.Element {
  const { face, versions, art, frame, fallbackFrameVersionId, setField } = props;
  return (
    <>
      <label>
        Name{' '}
        <input type="text" value={face.name} onChange={(e) => setField('name', e.target.value)} />
      </label>{' '}
      <label>
        Type{' '}
        <input
          type="text"
          value={face.typeLine}
          onChange={(e) => setField('typeLine', e.target.value)}
        />
      </label>{' '}
      <label>
        Layout{' '}
        <select
          value={face.layout ?? 'standard'}
          onChange={(e) => setField('layout', e.target.value as CardLayout)}
        >
          <option value="standard">Standard</option>
          <option value="planeswalker">Planeswalker</option>
          <option value="saga">Saga</option>
        </select>
      </label>{' '}
      <label>
        Mana cost{' '}
        <input
          type="text"
          size={14}
          value={face.manaCost ?? ''}
          placeholder="{2}{W}{U} or 2WU"
          onChange={(e) => setField('manaCost', e.target.value || null)}
        />
      </label>{' '}
      <label>
        Frame version{' '}
        <select
          value={face.frameVersionId ?? fallbackFrameVersionId}
          onChange={(e) => setField('frameVersionId', e.target.value)}
        >
          {versions.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </select>
      </label>{' '}
      <label>
        Color{' '}
        <select
          value={face.frameColor ?? 'M'}
          onChange={(e) => setField('frameColor', e.target.value as FrameColor)}
        >
          {FRAME_COLORS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <div>
        <label>
          Rules text{' '}
          <textarea
            value={face.rulesText}
            rows={4}
            cols={60}
            onChange={(e) => setField('rulesText', e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Flavor text{' '}
          <textarea
            value={face.flavorText ?? ''}
            rows={2}
            cols={60}
            placeholder="Italicised flavor quote (standard layout only)"
            onChange={(e) => setField('flavorText', e.target.value || null)}
          />
        </label>
      </div>
      <div>
        {face.layout === 'planeswalker' ? (
          <label>
            Starting loyalty{' '}
            <input
              type="text"
              size={6}
              value={face.loyalty ?? ''}
              placeholder="3"
              onChange={(e) => setField('loyalty', e.target.value || null)}
            />
          </label>
        ) : (
          <label>
            Power / Toughness{' '}
            <input
              type="text"
              size={10}
              value={face.powerToughness ?? ''}
              placeholder="e.g. 2/3"
              onChange={(e) => setField('powerToughness', e.target.value || null)}
            />
          </label>
        )}{' '}
        <small>
          {face.layout === 'planeswalker'
            ? 'Abilities: one per line in "<cost>: <text>" form, e.g. "+1: Draw a card."'
            : face.layout === 'saga'
              ? 'Chapters: "I, II — Effect." (em-dash) per line. Optional leading reminder text in parentheses.'
              : 'Leave P/T empty for non-creature cards.'}
        </small>
      </div>
      <div>
        <label>
          Art URL{' '}
          <input
            type="text"
            size={60}
            value={face.artUrl ?? ''}
            placeholder="https://… (CORS-enabled image)"
            onChange={(e) => setField('artUrl', e.target.value || null)}
          />
        </label>{' '}
        <small>
          Status: <code>{art.status}</code>
          {art.error ? ` — ${art.error.message}` : ''}
        </small>
      </div>
      <div>
        <label>
          Frame URL{' '}
          <input
            type="text"
            size={60}
            value={face.frameUrl ?? ''}
            placeholder="https://… (CORS-enabled frame PNG, optional)"
            onChange={(e) => setField('frameUrl', e.target.value || null)}
          />
        </label>{' '}
        <small>
          Status: <code>{frame.status}</code>
          {frame.error ? ` — ${frame.error.message}` : ''}
        </small>
      </div>
    </>
  );
}
