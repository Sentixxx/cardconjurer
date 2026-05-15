import { readCardRegistry, writeCardEntry } from '@/services/storage';
import type { SavedCardEntry } from '@/types/card';
import {
  PORTABLE_CARDS_FORMAT_VERSION,
  type ImportReport,
  type PortableCardsBundle,
} from '@/types/portableCards';

export function buildExportBundle(): PortableCardsBundle {
  const { entries } = readCardRegistry();
  return {
    version: PORTABLE_CARDS_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    cards: entries,
  };
}

export function serializeBundle(bundle: PortableCardsBundle): string {
  return JSON.stringify(bundle, null, 2);
}

function isSavedCardEntry(value: unknown): value is SavedCardEntry {
  if (value === null || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.key === 'string' && 'raw' in record;
}

function isLegacySavedCardEntry(value: unknown): value is { readonly key: string; readonly data: unknown } {
  if (value === null || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.key === 'string' && 'data' in record;
}

export function parseImportedBundle(text: string): readonly SavedCardEntry[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return [];
  }
  if (Array.isArray(parsed)) {
    return parsed.flatMap((entry): SavedCardEntry[] => {
      if (isSavedCardEntry(entry)) return [entry];
      if (isLegacySavedCardEntry(entry)) return [{ key: entry.key, raw: entry.data }];
      return [];
    });
  }
  if (parsed === null || typeof parsed !== 'object') return [];
  const candidate = (parsed as Record<string, unknown>).cards;
  if (!Array.isArray(candidate)) return [];
  return candidate.filter(isSavedCardEntry);
}

export function importEntriesToStorage(entries: readonly SavedCardEntry[]): ImportReport {
  const accepted: SavedCardEntry[] = [];
  let skipped = 0;
  for (const entry of entries) {
    if (!entry.key) {
      skipped += 1;
      continue;
    }
    const resolvedKey = writeCardEntry(entry.key, entry.raw);
    accepted.push({ key: resolvedKey, raw: entry.raw });
  }
  return { accepted, skipped };
}
