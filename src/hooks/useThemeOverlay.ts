import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_THEME_OVERLAY, isThemeOverlay, type ThemeOverlay } from '@/types/themeOverlay';

const OVERLAY_STORAGE_KEY = 'themeOverlay';

function readStoredOverlay(): ThemeOverlay {
  if (typeof window === 'undefined') return DEFAULT_THEME_OVERLAY;
  try {
    const raw = window.localStorage.getItem(OVERLAY_STORAGE_KEY);
    if (raw == null) return DEFAULT_THEME_OVERLAY;
    const parsed: unknown = JSON.parse(raw);
    return isThemeOverlay(parsed) ? parsed : DEFAULT_THEME_OVERLAY;
  } catch {
    return DEFAULT_THEME_OVERLAY;
  }
}

function applyOverlay(overlay: ThemeOverlay): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement.style;
  root.setProperty('--site-background-filter', `hue-rotate(${overlay.hueRotateDeg}deg)`);
  root.setProperty('--layer-background-filter', `brightness(${overlay.readableBrightness})`);
}

export interface UseThemeOverlayResult {
  readonly overlay: ThemeOverlay;
  readonly setHueRotate: (degrees: number) => void;
  readonly setReadableBrightness: (value: number) => void;
  readonly reset: () => void;
}

export function useThemeOverlay(): UseThemeOverlayResult {
  const [overlay, setOverlay] = useState<ThemeOverlay>(() => readStoredOverlay());

  useEffect(() => {
    applyOverlay(overlay);
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(OVERLAY_STORAGE_KEY, JSON.stringify(overlay));
    } catch {
      // storage unavailable; in-memory state still drives CSS vars
    }
  }, [overlay]);

  const setHueRotate = useCallback((degrees: number) => {
    setOverlay((prev) => ({ ...prev, hueRotateDeg: degrees }));
  }, []);

  const setReadableBrightness = useCallback((value: number) => {
    setOverlay((prev) => ({ ...prev, readableBrightness: value }));
  }, []);

  const reset = useCallback(() => setOverlay(DEFAULT_THEME_OVERLAY), []);

  return { overlay, setHueRotate, setReadableBrightness, reset };
}
