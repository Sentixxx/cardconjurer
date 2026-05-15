/**
 * Frame version catalog types. Each "frame version" maps to a directory under
 * the legacy `data/scripts/versions/<id>/` tree (e.g. `m15`, `m15Promo`,
 * `future`, `saga`). The catalog itself is editor metadata — actual frame
 * image payloads will be loaded lazily when the canvas editor is ported.
 */

export interface FrameVersion {
  readonly id: string;
  readonly label: string;
  readonly group: FrameVersionGroup;
}

export type FrameVersionGroup =
  | 'Regular'
  | 'Promo'
  | 'Showcase'
  | 'Textless'
  | 'Token'
  | 'Saga'
  | 'Planeswalker'
  | 'DFC'
  | 'Transform'
  | 'UniversesBeyond'
  | 'Custom'
  | 'Misc'
  | 'Accurate'
  | 'Margin'
  | 'FleshAndBlood';

export interface FrameVersionCatalog {
  readonly versions: readonly FrameVersion[];
}
