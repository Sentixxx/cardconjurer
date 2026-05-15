/**
 * Card domain types. The legacy editor stores arbitrary JSON per card under
 * its own localStorage key. During migration we keep the payload as `unknown`
 * and narrow it inside the editor feature; the registry-level type below is
 * what services / hooks / pages can rely on.
 */

export type CardKey = string;

export interface SavedCardEntry {
  readonly key: CardKey;
  readonly raw: unknown;
}

export interface CardRegistrySnapshot {
  readonly keys: readonly CardKey[];
  readonly entries: readonly SavedCardEntry[];
}

export const CARD_KEY_LIST_STORAGE_KEY = 'cardKeyList';
