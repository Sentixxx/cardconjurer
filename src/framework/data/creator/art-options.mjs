export const artAutofitExpression = 'document.querySelector("#art-update-autofit").checked ? "autoFit" : ""';

export const artPositionInputs = [
  { id: 'art-x', value: '0', ariaLabel: 'Art X Position' },
  { id: 'art-y', value: '0', ariaLabel: 'Art Y Position' },
  { id: 'art-zoom', value: '100', step: '0.1', min: '0', ariaLabel: 'Art Scale' },
  { id: 'art-rotate', value: '0', step: '1', min: '0', max: '360', ariaLabel: 'Art Rotation' },
];
