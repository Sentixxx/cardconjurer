export const collectorInfoRows = [
  [
    { id: 'info-number', placeholder: 'Number', value: '', oninput: 'bottomInfoEdited();' },
    { id: 'info-rarity', placeholder: 'Rarity', value: 'P', oninput: 'bottomInfoEdited();' },
    { id: 'info-note', placeholder: 'Note', value: '', oninput: 'bottomInfoEdited();' },
  ],
  [
    { id: 'info-set', placeholder: 'Set', value: 'MTG', oninput: 'bottomInfoEdited();' },
    { id: 'info-language', placeholder: 'Language', value: 'EN', oninput: 'bottomInfoEdited();' },
    { id: 'info-artist', placeholder: 'Artist', oninput: 'artistEdited(this.value);' },
  ],
  [
    { id: 'info-year', type: 'number', placeholder: '0', value: '1993', oninput: 'bottomInfoEdited();' },
  ],
];

export const collectorSettings = [
  { label: '启用导入', id: 'enableImportCollectorInfo', onchange: 'enableImportCollectorInfo();' },
  { label: '启用版权', id: 'enableCopyright', onchange: 'enableCopyright();' },
  {
    label: '启用额外信息',
    id: 'enableWebsiteInfo',
    onchange: 'enableWebsiteInfo(); document.getElementById("extra-info-container").style.display = this.checked ? "block" : "none";',
  },
  { label: '启用艺术家导入', id: 'enableImportArtist', onchange: 'enableImportArtist();' },
];

export const serialNumberInputs = [
  { id: 'serial-number', placeholder: '001', value: '' },
  { id: 'serial-total', placeholder: '500', value: '' },
];

export const serialPositionInputs = [
  { id: 'serial-x', value: '172', ariaLabel: 'Serial Number X Position' },
  { id: 'serial-y', value: '1383', ariaLabel: 'Serial Number Y Position' },
  { id: 'serial-scale', value: '1', step: '0.01', ariaLabel: 'Serial Number Scale' },
];
