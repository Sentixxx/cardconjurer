import type { SavedCardEntry } from '@/types/card';

export const PORTABLE_CARDS_FORMAT_VERSION = 1;

export interface PortableCardsBundle {
  readonly version: typeof PORTABLE_CARDS_FORMAT_VERSION;
  readonly exportedAt: string;
  readonly cards: readonly SavedCardEntry[];
}

export interface ImportReport {
  readonly accepted: readonly SavedCardEntry[];
  readonly skipped: number;
}
