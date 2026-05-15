import {
  CARD_KEY_LIST_STORAGE_KEY,
  type CardKey,
  type CardRegistrySnapshot,
  type SavedCardEntry,
} from '@/types/card';

function safeWindow(): Window | null {
  return typeof window === 'undefined' ? null : window;
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function readCardKeyList(): readonly CardKey[] {
  const w = safeWindow();
  if (!w) return [];
  try {
    const raw = w.localStorage.getItem(CARD_KEY_LIST_STORAGE_KEY);
    if (raw == null) return [];
    const parsed: unknown = JSON.parse(raw);
    return isStringArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readCardEntry(key: CardKey): SavedCardEntry | null {
  const w = safeWindow();
  if (!w) return null;
  try {
    const raw = w.localStorage.getItem(key);
    if (raw == null) return null;
    return { key, raw: JSON.parse(raw) as unknown };
  } catch {
    return null;
  }
}

export function readCardRegistry(): CardRegistrySnapshot {
  const keys = readCardKeyList();
  const entries = keys
    .map((key) => readCardEntry(key))
    .filter((entry): entry is SavedCardEntry => entry !== null);
  return { keys, entries };
}

export function writeCardKeyList(keys: readonly CardKey[]): void {
  const w = safeWindow();
  if (!w) return;
  try {
    w.localStorage.setItem(CARD_KEY_LIST_STORAGE_KEY, JSON.stringify(keys));
  } catch {
    // storage unavailable; caller-visible state is unchanged
  }
}

function nextAvailableKey(desired: CardKey, existing: readonly CardKey[]): CardKey {
  if (!existing.includes(desired)) return desired;
  let suffix = 1;
  let candidate = `${desired} (${suffix})`;
  while (existing.includes(candidate)) {
    suffix += 1;
    candidate = `${desired} (${suffix})`;
  }
  return candidate;
}

export function writeCardEntry(key: CardKey, payload: unknown): CardKey {
  const w = safeWindow();
  if (!w) return key;
  try {
    const keys = readCardKeyList();
    const resolvedKey = nextAvailableKey(key, keys);
    w.localStorage.setItem(resolvedKey, JSON.stringify(payload));
    if (!keys.includes(resolvedKey)) {
      const nextKeys = [...keys, resolvedKey].sort();
      writeCardKeyList(nextKeys);
    }
    return resolvedKey;
  } catch {
    return key;
  }
}

export function deleteCardEntry(key: CardKey): void {
  const w = safeWindow();
  if (!w) return;
  try {
    w.localStorage.removeItem(key);
    const next = readCardKeyList().filter((k) => k !== key);
    writeCardKeyList(next);
  } catch {
    // ignore
  }
}
