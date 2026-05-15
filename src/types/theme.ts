export interface ThemePaletteVars {
  readonly '--site-background': string;
  readonly '--site-background-filter': string;
  readonly '--layer-background': string;
  readonly '--layer-background-filter': string;
  readonly '--layer-background-selected': string;
  readonly '--interactable-unselected': string;
  readonly '--interactable-selected': string;
  readonly '--font-color': string;
  readonly '--body-background': string;
}

export type ThemePaletteVarName = keyof ThemePaletteVars;

export type ThemePaletteId =
  | 'darkMode'
  | 'lightMode'
  | 'dayRave'
  | 'nightRave'
  | 'lowpolyGreen'
  | 'lowpolyBlue'
  | 'lowpolyRed';

export interface ThemePalette {
  readonly id: ThemePaletteId;
  readonly label: string;
  readonly vars: ThemePaletteVars;
}
