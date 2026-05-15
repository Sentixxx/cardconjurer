import type { JSX } from 'react';
import type { CardData, Rarity } from '@/types/cardData';

export interface CreatorIdentityFieldsProps {
  readonly card: CardData;
  readonly disabled: boolean;
  readonly onChangeKey: (value: string) => void;
  readonly onChangeSet: (value: string | null) => void;
  readonly onChangeRarity: (value: Rarity) => void;
  readonly onChangeCardNumber: (value: string | null) => void;
  readonly onChangeArtist: (value: string | null) => void;
}

export function CreatorIdentityFields(props: CreatorIdentityFieldsProps): JSX.Element {
  const { card, disabled } = props;
  return (
    <>
      <label>
        Key{' '}
        <input
          type="text"
          value={card.key}
          disabled={disabled}
          onChange={(e) => props.onChangeKey(e.target.value)}
        />
      </label>{' '}
      <label>
        Set{' '}
        <input
          type="text"
          size={6}
          value={card.setCode ?? ''}
          disabled={disabled}
          placeholder="MOM"
          onChange={(e) => props.onChangeSet(e.target.value || null)}
        />
      </label>{' '}
      <label>
        Rarity{' '}
        <select
          value={card.rarity ?? 'C'}
          disabled={disabled}
          onChange={(e) => props.onChangeRarity(e.target.value as Rarity)}
        >
          <option value="C">Common</option>
          <option value="U">Uncommon</option>
          <option value="R">Rare</option>
          <option value="M">Mythic</option>
        </select>
      </label>{' '}
      <label>
        Card #{' '}
        <input
          type="text"
          size={10}
          value={card.cardNumber ?? ''}
          disabled={disabled}
          placeholder="123/280"
          onChange={(e) => props.onChangeCardNumber(e.target.value || null)}
        />
      </label>{' '}
      <label>
        Artist{' '}
        <input
          type="text"
          size={24}
          value={card.artist ?? ''}
          disabled={disabled}
          placeholder="Illustrator name"
          onChange={(e) => props.onChangeArtist(e.target.value || null)}
        />
      </label>
    </>
  );
}
