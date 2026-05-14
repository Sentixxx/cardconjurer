export function resolveWriteTextRollColorCode(possibleCode) {
  if (!possibleCode.includes('rollcolor')) {
    return null;
  }
  return possibleCode.replace('rollcolor', '') || 'black';
}

export function resolveWriteTextRollCode(possibleCode, currentY, savedRollYPosition, textFont) {
  if (!possibleCode.includes('roll') || possibleCode.includes('rollcolor')) {
    return null;
  }
  return {
    drawTextBetweenFrames: true,
    redrawFrames: true,
    drawToPrePTCanvas: true,
    savedRollYPosition: savedRollYPosition == null ? currentY : -1,
    savedFont: textFont,
    wordToWrite: possibleCode.replace('roll', ''),
  };
}
