import { useCallback, useEffect, useState } from 'react';
import { buildExportBundle, importEntriesToStorage, parseImportedBundle, serializeBundle } from '@/services/io';
import { deleteCardEntry, readCardRegistry, writeCardEntry } from '@/services/storage';
import { CARD_KEY_LIST_STORAGE_KEY, type CardKey, type CardRegistrySnapshot } from '@/types/card';
import type { ImportReport } from '@/types/portableCards';

export interface UseSavedCardsResult {
  readonly registry: CardRegistrySnapshot;
  readonly refresh: () => void;
  readonly remove: (key: CardKey) => void;
  readonly save: (key: CardKey, payload: unknown, options?: { readonly overwrite?: boolean }) => CardKey;
  readonly exportJson: () => string;
  readonly importJson: (text: string) => ImportReport;
}

export function useSavedCards(): UseSavedCardsResult {
  const [registry, setRegistry] = useState<CardRegistrySnapshot>(() => readCardRegistry());

  const refresh = useCallback(() => {
    setRegistry(readCardRegistry());
  }, []);

  const remove = useCallback(
    (key: CardKey) => {
      deleteCardEntry(key);
      refresh();
    },
    [refresh],
  );

  const exportJson = useCallback((): string => {
    return serializeBundle(buildExportBundle());
  }, []);

  const importJson = useCallback(
    (text: string): ImportReport => {
      const entries = parseImportedBundle(text);
      const report = importEntriesToStorage(entries);
      refresh();
      return report;
    },
    [refresh],
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const onStorage = (event: StorageEvent): void => {
      if (event.key === CARD_KEY_LIST_STORAGE_KEY || event.key === null) {
        refresh();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refresh]);

  const saveWithOptions = useCallback(
    (key: CardKey, payload: unknown, options: { readonly overwrite?: boolean } = {}): CardKey => {
      const resolvedKey = writeCardEntry(key, payload, options);
      refresh();
      return resolvedKey;
    },
    [refresh],
  );

  return { registry, refresh, remove, save: saveWithOptions, exportJson, importJson };
}
