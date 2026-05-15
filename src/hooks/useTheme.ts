import { useCallback, useEffect, useState } from 'react';
import type { ThemePalette, ThemePaletteId, ThemePaletteVarName } from '@/types/theme';

const STORAGE_KEY = 'colorPalette';
const DEFAULT_PALETTE_ID: ThemePaletteId = 'darkMode';

const SITE_BG_DARK = '#3a3838 url("/data/images/site/backgrounds/lowpolyDarkGreen.svg") left/cover no-repeat fixed';
const SITE_BG_LIGHT = '#f5f5f5 url("/data/images/site/backgrounds/lowpolyLightGreen.svg") left/cover no-repeat fixed';

const DARK_BASE = {
  '--site-background': SITE_BG_DARK,
  '--layer-background': 'none',
  '--layer-background-filter': 'grayscale(100) brightness(0.5)',
  '--layer-background-selected': '#1d1d1d',
  '--interactable-unselected': '#666666',
  '--interactable-selected': '#99ee99',
  '--font-color': '#efefef',
  '--body-background': 'none',
} as const;

export const THEME_PALETTES: Readonly<Record<ThemePaletteId, ThemePalette>> = {
  darkMode: {
    id: 'darkMode',
    label: 'Dark Mode',
    vars: {
      ...DARK_BASE,
      '--site-background-filter': 'grayscale(100) hue-rotate(0deg)',
    },
  },
  lightMode: {
    id: 'lightMode',
    label: 'Light Mode',
    vars: {
      '--site-background': SITE_BG_LIGHT,
      '--site-background-filter': 'grayscale(100)',
      '--layer-background': 'none',
      '--layer-background-filter': 'grayscale(100) brightness(0.9)',
      '--layer-background-selected': '#cccccc',
      '--interactable-unselected': '#aaaaaa',
      '--interactable-selected': '#00aa00',
      '--font-color': '#000000',
      '--body-background': 'none',
    },
  },
  dayRave: {
    id: 'dayRave',
    label: 'Day Rave',
    vars: {
      '--site-background': SITE_BG_LIGHT,
      '--site-background-filter': 'grayscale(0) hue-rotate(0deg)',
      '--layer-background': 'none',
      '--layer-background-filter': 'grayscale(100)',
      '--layer-background-selected': '#cccccc',
      '--interactable-unselected': '#aaaaaa',
      '--interactable-selected': '#00aa00',
      '--font-color': '#000000',
      '--body-background': 'none',
    },
  },
  nightRave: {
    id: 'nightRave',
    label: 'Night Rave',
    vars: {
      ...DARK_BASE,
      '--site-background-filter': 'grayscale(0) hue-rotate(0deg)',
    },
  },
  lowpolyGreen: {
    id: 'lowpolyGreen',
    label: 'Lowpoly Green',
    vars: {
      ...DARK_BASE,
      '--site-background-filter': 'grayscale(0) hue-rotate(0deg)',
    },
  },
  lowpolyBlue: {
    id: 'lowpolyBlue',
    label: 'Lowpoly Blue',
    vars: {
      ...DARK_BASE,
      '--site-background-filter': 'grayscale(0) hue-rotate(90deg)',
    },
  },
  lowpolyRed: {
    id: 'lowpolyRed',
    label: 'Lowpoly Red',
    vars: {
      ...DARK_BASE,
      '--site-background-filter': 'grayscale(0) hue-rotate(245deg)',
    },
  },
};

export const THEME_PALETTE_LIST: readonly ThemePalette[] = Object.values(THEME_PALETTES);

function isThemePaletteId(value: unknown): value is ThemePaletteId {
  return typeof value === 'string' && value in THEME_PALETTES;
}

function readStoredPaletteId(): ThemePaletteId {
  if (typeof window === 'undefined') {
    return DEFAULT_PALETTE_ID;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return isThemePaletteId(raw) ? raw : DEFAULT_PALETTE_ID;
  } catch {
    return DEFAULT_PALETTE_ID;
  }
}

function applyPalette(palette: ThemePalette): void {
  if (typeof document === 'undefined') {
    return;
  }
  const root = document.documentElement.style;
  for (const [name, value] of Object.entries(palette.vars) as ReadonlyArray<[ThemePaletteVarName, string]>) {
    root.setProperty(name, value);
  }
}

export interface UseThemeResult {
  readonly currentId: ThemePaletteId;
  readonly current: ThemePalette;
  readonly palettes: readonly ThemePalette[];
  readonly setPalette: (id: ThemePaletteId) => void;
}

export function useTheme(): UseThemeResult {
  const [currentId, setCurrentId] = useState<ThemePaletteId>(() => readStoredPaletteId());

  useEffect(() => {
    applyPalette(THEME_PALETTES[currentId]);
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, currentId);
    } catch {
      // Storage unavailable (private mode / quota); palette still applied in-memory.
    }
  }, [currentId]);

  const setPalette = useCallback((id: ThemePaletteId) => {
    setCurrentId(id);
  }, []);

  return {
    currentId,
    current: THEME_PALETTES[currentId],
    palettes: THEME_PALETTE_LIST,
    setPalette,
  };
}
