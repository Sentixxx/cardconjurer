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
  | 'Standard'
  | 'Promo'
  | 'Showcase'
  | 'Special'
  | 'Token'
  | 'Legacy';

export interface FrameVersionCatalog {
  readonly versions: readonly FrameVersion[];
}
