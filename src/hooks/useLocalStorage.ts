import { useCallback, useEffect, useState } from 'react';

export interface UseLocalStorageOptions<T> {
  readonly key: string;
  readonly defaultValue: T;
  readonly parse?: (raw: string) => T;
  readonly serialize?: (value: T) => string;
}

export interface UseLocalStorageResult<T> {
  readonly value: T;
  readonly setValue: (next: T) => void;
  readonly remove: () => void;
}

function defaultParse<T>(raw: string): T {
  return JSON.parse(raw) as T;
}

function defaultSerialize<T>(value: T): string {
  return JSON.stringify(value);
}

function readInitial<T>(options: UseLocalStorageOptions<T>): T {
  const { key, defaultValue, parse = defaultParse<T> } = options;
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) {
      return defaultValue;
    }
    return parse(raw);
  } catch {
    return defaultValue;
  }
}

export function useLocalStorage<T>(options: UseLocalStorageOptions<T>): UseLocalStorageResult<T> {
  const { key, serialize = defaultSerialize<T> } = options;
  const [value, setStateValue] = useState<T>(() => readInitial(options));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const onStorage = (event: StorageEvent): void => {
      if (event.key !== key || event.newValue == null) {
        return;
      }
      try {
        const parse = options.parse ?? defaultParse<T>;
        setStateValue(parse(event.newValue));
      } catch {
        // Ignore malformed cross-tab updates.
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, options]);

  const setValue = useCallback(
    (next: T): void => {
      setStateValue(next);
      if (typeof window === 'undefined') {
        return;
      }
      try {
        window.localStorage.setItem(key, serialize(next));
      } catch {
        // Storage unavailable (quota / private); state still updated in-memory.
      }
    },
    [key, serialize],
  );

  const remove = useCallback((): void => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }, [key]);

  return { value, setValue, remove };
}
