export type PaperSize = readonly [widthInches: number, heightInches: number];

export interface PrintConfig {
  readonly paper: PaperSize;
  readonly cardWidth: number;
  readonly cardHeight: number;
  readonly cardPadding: number;
  readonly cardMargin: number;
  readonly ppi: number;
  readonly imgIncludesBleedEdge: boolean;
  readonly bleedEdgeColor: string;
  readonly useCuttingAids: boolean;
}

export const DEFAULT_PRINT_CONFIG: PrintConfig = {
  paper: [8.5, 11],
  cardWidth: 1500,
  cardHeight: 2100,
  cardPadding: 0,
  cardMargin: 30,
  ppi: 600,
  imgIncludesBleedEdge: true,
  bleedEdgeColor: '#000000',
  useCuttingAids: false,
};

export interface PrintSheetLayout {
  readonly cellWidth: number;
  readonly cellHeight: number;
  readonly cardsX: number;
  readonly cardsY: number;
  readonly pageMarginX: number;
  readonly pageMarginY: number;
}
