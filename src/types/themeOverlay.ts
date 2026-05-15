export interface ThemeOverlay {
  readonly hueRotateDeg: number;
  readonly readableBrightness: number;
}

export const DEFAULT_THEME_OVERLAY: ThemeOverlay = {
  hueRotateDeg: 0,
  readableBrightness: 0.9,
};

export function isThemeOverlay(value: unknown): value is ThemeOverlay {
  if (value === null || typeof value !== 'object') return false;
  const r = value as Record<string, unknown>;
  return typeof r.hueRotateDeg === 'number' && typeof r.readableBrightness === 'number';
}
