export function resolveWriteTextSavedXCode(possibleCode, currentX, savedTextXPosition, savedTextXPosition2) {
  if (possibleCode == 'savex') {
    return {
      currentX,
      savedTextXPosition: currentX,
      savedTextXPosition2,
    };
  }
  if (possibleCode == 'loadx') {
    return {
      currentX: savedTextXPosition > currentX ? savedTextXPosition : currentX,
      savedTextXPosition,
      savedTextXPosition2,
    };
  }
  if (possibleCode == 'savex2') {
    return {
      currentX,
      savedTextXPosition,
      savedTextXPosition2: currentX,
    };
  }
  if (possibleCode == 'loadx2') {
    return {
      currentX: savedTextXPosition2 > currentX ? savedTextXPosition2 : currentX,
      savedTextXPosition,
      savedTextXPosition2,
    };
  }
  return null;
}

export function resolveWriteTextIndentCode(possibleCode, startingCurrentX, currentX, currentY) {
  if (possibleCode == 'indent') {
    return {
      startingCurrentX: startingCurrentX + currentX,
      currentY: currentY - 10,
    };
  }
  if (possibleCode == '/indent') {
    return {
      startingCurrentX: 0,
      currentY,
    };
  }
  return null;
}

export function resolveWriteTextInsertionCode(wordToWrite, currentX, textSize) {
  if (wordToWrite == '{Lins}') {
    return {
      currentX: currentX + textSize * 0.1,
    };
  }
  if (wordToWrite == '{Rins}') {
    return {
      currentX: currentX - textSize * 0.1,
    };
  }
  return null;
}

export function resolveWriteTextPositionCode(possibleCode, lineY, currentY, currentX) {
  if (possibleCode.includes('upinline')) {
    return {
      lineY: lineY - (parseInt(possibleCode.replace('upinline', '')) || 0),
      currentY,
      currentX,
    };
  }
  if (possibleCode.substring(0, 2) == 'up' && possibleCode != 'up') {
    return {
      lineY,
      currentY: currentY - (parseInt(possibleCode.replace('up', '')) || 0),
      currentX,
    };
  }
  if (possibleCode.includes('down')) {
    return {
      lineY,
      currentY: currentY + (parseInt(possibleCode.replace('down', '')) || 0),
      currentX,
    };
  }
  if (possibleCode.includes('left')) {
    return {
      lineY,
      currentY,
      currentX: currentX - (parseInt(possibleCode.replace('left', '')) || 0),
    };
  }
  if (possibleCode.includes('right')) {
    return {
      lineY,
      currentY,
      currentX: currentX + (parseInt(possibleCode.replace('right', '')) || 0),
    };
  }
  return null;
}
