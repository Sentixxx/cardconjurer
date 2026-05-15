import { useCallback, useState } from 'react';
import { EMPTY_CARD, type CardData } from '@/types/cardData';

export interface UseCardDataResult {
  readonly card: CardData;
  readonly setCard: (next: CardData) => void;
  readonly updateField: <K extends keyof CardData>(key: K, value: CardData[K]) => void;
  readonly reset: () => void;
}

export function useCardData(initial: CardData = EMPTY_CARD): UseCardDataResult {
  const [card, setCard] = useState<CardData>(initial);

  const updateField = useCallback(<K extends keyof CardData>(key: K, value: CardData[K]) => {
    setCard((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => setCard(initial), [initial]);

  return { card, setCard, updateField, reset };
}
