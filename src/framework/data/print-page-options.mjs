export const printSelectControls = [
  {
    label: '选择纸张大小',
    onchange: 'setPageSize(this.value.split(","));',
    options: [
      { value: '8.5,11', label: '信纸 (8.5 x 11)' },
      { value: '8.2667,11.6934', label: 'A4纸' },
    ],
  },
  {
    label: '选择默认卡牌尺寸',
    onchange: 'setCardSize(this.value.split(","));',
    options: [
      { value: '2.5,3.5', label: '2.5 x 3.5 英寸' },
      { value: '2.48031,3.46457', label: '63 x 88 毫米' },
    ],
  },
];

export const customCardSizeInputs = [
  { id: 'cardWidth', value: '1500' },
  { id: 'cardHeight', value: '2100' },
];

export const printNumberControls = [
  {
    label: '输入出血边缘厚度（像素）',
    id: 'cardPadding',
    value: '0',
    min: '0',
    onchange: 'setPaddingSize(this.value);',
  },
  {
    label: '输入卡牌之间的间距（像素）',
    id: 'cardMargin',
    value: '30',
    min: '0',
    onchange: 'setMarginSize(this.value);',
  },
  {
    label: '设置PPI（每英寸像素数）',
    id: 'cardPPI',
    value: '600',
    min: '1',
    max: '2400',
    onchange: 'setPPI(this.value);',
  },
];

export const printCheckboxControls = [
  {
    description: '包含裁切辅助线（帮助引导裁切的彩色标记；预览中可能不可见）',
    label: '裁切辅助线',
    id: 'cuttingAidsCheckbox',
    onchange: 'setCuttingAids(this.checked);',
  },
  {
    description: '图像已包含出血边缘',
    label: '包含出血边缘',
    id: 'bleedEdgeCheckbox',
    onchange: 'setBleedEdge(this.checked);',
    checked: true,
  },
];

export const printDownloadActions = [
  {
    label: '下载打印页面 (PNG)',
    note: '（可能需要几秒钟）',
    onclick: 'downloadCanvas();',
  },
  {
    label: '下载打印页面 (PDF)',
    note: '（警告：这可能需要约15秒...）',
    onclick: 'downloadPDF();',
  },
];
