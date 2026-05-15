import type { FrameVersion, FrameVersionCatalog } from '@/types/template';

/**
 * Hand-curated index of frame versions, derived from
 * `src/legacy-app/data/scripts/versions/*` directory names. The legacy
 * editor loads each version's `.js` payload on demand; the catalog below is
 * intentionally just metadata so it stays decoupled from the editor port.
 */
export const FRAME_VERSIONS: readonly FrameVersion[] = [
  { id: 'm15', label: 'M15', group: 'Standard' },
  { id: 'm15Planeswalker', label: 'M15 Planeswalker', group: 'Standard' },
  { id: 'm15Textless', label: 'M15 Textless', group: 'Standard' },
  { id: 'm15Promo', label: 'M15 Promo', group: 'Promo' },
  { id: 'short', label: 'Short Frame', group: 'Standard' },
  { id: 'modal', label: 'Modal (MDFC)', group: 'Special' },
  { id: 'saga', label: 'Saga', group: 'Special' },
  { id: 'planechase', label: 'Planechase', group: 'Special' },
  { id: 'storybook', label: 'Storybook', group: 'Showcase' },
  { id: 'expedition', label: 'Expedition', group: 'Showcase' },
  { id: 'ixalan', label: 'Ixalan', group: 'Showcase' },
  { id: 'future', label: 'Future Sight', group: 'Showcase' },
  { id: 'legends', label: 'Legends', group: 'Legacy' },
  { id: 'seventh', label: 'Seventh Edition', group: 'Legacy' },
  { id: 'seventhTextless', label: 'Seventh Edition Textless', group: 'Legacy' },
  { id: 'unstable', label: 'Unstable', group: 'Special' },
  { id: 'bleedEdge', label: 'Bleed Edge', group: 'Special' },
  { id: 'token', label: 'Token', group: 'Token' },
];

export function loadFrameVersionCatalog(): FrameVersionCatalog {
  return { versions: FRAME_VERSIONS };
}
