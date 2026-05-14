export function resolveWriteTextFlowCode(possibleCode, textSize) {
  if (possibleCode === 'line') {
    return {
      newLine: true,
      startingCurrentX: 0,
      newLineSpacing: textSize * 0.35,
      linespacing: null,
      wordToWrite: null,
    };
  }
  if (possibleCode.includes('linespacing')) {
    const parsedLineSpacing = parseFloat(possibleCode.replace('linespacing#', '')) * textSize;
    return {
      newLine: null,
      startingCurrentX: null,
      newLineSpacing: parsedLineSpacing,
      linespacing: parsedLineSpacing,
      wordToWrite: null,
    };
  }
  if (possibleCode === 'lns' || possibleCode === 'linenospace') {
    return {
      newLine: true,
      startingCurrentX: null,
      newLineSpacing: null,
      linespacing: null,
      wordToWrite: null,
    };
  }
  if (possibleCode === 'bullet' || possibleCode === '•') {
    return {
      newLine: null,
      startingCurrentX: null,
      newLineSpacing: null,
      linespacing: null,
      wordToWrite: '•',
    };
  }
  return null;
}

export function resolveWriteTextBarCode(possibleCode, textWidth, textSize, textAlign, cardVersion) {
  if (possibleCode != 'bar') {
    return null;
  }
  const barState = {
    barWidth: textWidth * 0.96,
    barHeight: scaleHeight(0.03),
    barImageName: 'bar',
    barDistance: 0,
    realTextAlign: textAlign,
    textAlign: 'left',
    textSize,
    newLineSpacing: null,
  };
  if (cardVersion == 'cartoony') {
    barState.barImageName = 'cflavor';
    barState.barWidth = scaleWidth(0.8547);
    barState.barHeight = scaleHeight(0.0458);
    barState.barDistance = -0.23;
    barState.newLineSpacing = textSize * -0.23;
    barState.textSize = textSize - scaleHeight(0.0086);
  }
  return barState;
}

export function resolveWriteTextPlanechaseCode(possibleCode, textSize, currentX, startingCurrentX) {
  if (possibleCode != 'planechase') {
    return null;
  }
  const planechaseHeight = textSize * 1.8;
  const cursorAdvance = planechaseHeight * 1.3;
  return {
    imageX: currentX,
    imageWidth: planechaseHeight * 1.2,
    imageHeight: planechaseHeight,
    currentX: currentX + cursorAdvance,
    startingCurrentX: startingCurrentX + cursorAdvance,
  };
}

export function getWriteTextElemIdSelector(word) {
  return `#${word.replace('{elemid', '').replace('}', '')}`;
}

export function getWriteTextElemIdSetSubstring(bottomInfoText, setValue, languageValue) {
  return bottomInfoText
    .substring(0, bottomInfoText.indexOf('  {savex}'))
    .replace('{elemidinfo-set}', setValue || '')
    .replace('{elemidinfo-language}', languageValue || '');
}

export function resolveWriteTextElemIdNumberCode(word, wordToWrite, cardVersion) {
  if (word.includes('number') && wordToWrite.includes('/') && !['pokemon', '8thPlaytest'].includes(cardVersion)) {
    return {
      fillJustify: true,
      wordToWrite: Array.from(wordToWrite).join(' '),
    };
  }
  return null;
}

export function shouldApplyWriteTextChineseSpacing(Chinese, rawText) {
  return Boolean(Chinese && rawText.includes('CStext'));
}

export function resolveWriteTextChineseSpacing(wordToWrite, lastWord, currentX, startingCurrentX, textSize, newLine) {
  let adjustedCurrentX = currentX;
  if (!newLine && currentX != startingCurrentX) {
    if (lastWord == '）' || lastWord == '」') {
      adjustedCurrentX -= textSize * 0.5;
    }
    if (lastWord == '。' && (wordToWrite == '）' || wordToWrite == '」')) {
      adjustedCurrentX -= textSize * 0.5;
    }
    if (lastWord == '：' || lastWord == '；') {
      adjustedCurrentX -= textSize * 0.25;
    }
    if (wordToWrite == '：' || wordToWrite == '；') {
      adjustedCurrentX += textSize * 0.25;
    }
    if (wordToWrite == '（' || wordToWrite == '「') {
      if (lastWord == '。') {
        adjustedCurrentX -= textSize;
      } else {
        adjustedCurrentX -= textSize * 0.5;
      }
    }
  }
  return {
    currentX: adjustedCurrentX,
    lastWord: wordToWrite,
  };
}

export function resolveWriteTextAlignmentCode(possibleCode, textAlign, textJustify, realTextAlign) {
  if (possibleCode == 'left' || possibleCode == 'center' || possibleCode == 'right') {
    return {
      textAlign: possibleCode,
      textJustify,
    };
  }
  if (possibleCode == 'justify-left') {
    return {
      textAlign,
      textJustify: 'left',
    };
  }
  if (possibleCode == 'justify-center') {
    return {
      textAlign,
      textJustify: 'center',
    };
  }
  if (possibleCode == 'justify-right') {
    return {
      textAlign,
      textJustify: 'right',
    };
  }
  if (possibleCode.includes('fixtextalign')) {
    return {
      textAlign: realTextAlign,
      textJustify,
    };
  }
  return null;
}
