export function shouldApplyWriteTextPtShift(cardObject) {
  return cardObject.frames.findIndex((element) => element.name.toLowerCase().includes('power/toughness')) >= 0
    || cardObject.version.includes('planeswalker')
    || ['commanderLegends', 'm21', 'mysticalArchive', 'customDualLands', 'feuerAmeiseKaldheim'].includes(cardObject.version);
}

export function resolveWriteTextPtShiftCode(possibleCode, cardObject) {
  if (!possibleCode.includes('ptshift') || !shouldApplyWriteTextPtShift(cardObject)) {
    return null;
  }
  return [
    scaleWidth(parseFloat(possibleCode.replace('ptshift', '').split(',')[0])),
    scaleHeight(parseFloat(possibleCode.split(',')[1])),
  ];
}

export function resolveWriteTextTransformCode(possibleCode, transformState) {
  if (possibleCode.includes('permashift')) {
    return {
      permaShift: [
        parseFloat(possibleCode.replace('permashift', '').split(',')[0]),
        parseFloat(possibleCode.split(',')[1]),
      ],
      textArcRadius: transformState.textArcRadius,
      textArcStart: transformState.textArcStart,
      textRotation: transformState.textRotation,
    };
  }
  if (possibleCode.includes('arcradius')) {
    return {
      permaShift: transformState.permaShift,
      textArcRadius: parseInt(possibleCode.replace('arcradius', '')) || 0,
      textArcStart: transformState.textArcStart,
      textRotation: transformState.textRotation,
    };
  }
  if (possibleCode.includes('arcstart')) {
    return {
      permaShift: transformState.permaShift,
      textArcRadius: transformState.textArcRadius,
      textArcStart: parseFloat(possibleCode.replace('arcstart', '')) || 0,
      textRotation: transformState.textRotation,
    };
  }
  if (possibleCode.includes('rotate')) {
    return {
      permaShift: transformState.permaShift,
      textArcRadius: transformState.textArcRadius,
      textArcStart: transformState.textArcStart,
      textRotation: parseInt(possibleCode.replace('rotate', '')) % 360,
    };
  }
  return null;
}
