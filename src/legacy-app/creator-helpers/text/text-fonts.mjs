export function fontLoadDeclaration(fontFamily) {
  const font = String(fontFamily || '').trim();
  if (/^[a-zA-Z_][\w-]*$/.test(font)) {
    return `12px ${font}`;
  }

  return `12px "${font.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

export function normalizeFontFamilies(fonts = []) {
  return [...new Set([...fonts].map((font) => String(font || '').trim()).filter(Boolean))];
}

export function getCreatorCardVersion(globalObject = globalThis) {
  return globalObject.card?.version || '';
}

export function collectTextObjectFonts(textObject, cardVersion = getCreatorCardVersion()) {
  const fonts = new Set();
  if (!textObject) {
    return fonts;
  }

  const defaultFont = textObject.font || 'mplantin';
  const rawText = textObject.text || '';
  fonts.add(defaultFont);

  for (const match of rawText.matchAll(/\{font(?!color|size)([^}]+)\}/g)) {
    fonts.add(match[1]);
  }

  if (rawText.includes('{i}') && defaultFont === 'mplantin') {
    fonts.add('mplantini');
  }
  if (cardVersion === 'pokemon' && rawText.includes('{flavor}')) {
    fonts.add('gillsansbolditalic');
  }
  if (defaultFont === 'saloongirl' && rawText.includes('*')) {
    fonts.add('belerenbsc');
  }

  return fonts;
}

export function collectTextObjectsFonts(textObjects = [], cardVersion = getCreatorCardVersion()) {
  const fonts = new Set();
  for (const textObject of textObjects) {
    for (const font of collectTextObjectFonts(textObject, cardVersion)) {
      fonts.add(font);
    }
  }

  return fonts;
}

export function buildWriteTextFontDeclaration(textFontStyle, textSize, textFont, textFontExtension) {
  return textFontStyle + textSize + 'px ' + textFont + textFontExtension;
}

export function startWriteTextItalicFontState(textFont, textFontStyle) {
  if (textFont == 'gilllsans' || textFont == 'neosans') {
    return {
      fontStyle: textFontStyle,
      fontExtension: 'italic',
    };
  }
  if (textFont == 'mplantin') {
    return {
      fontStyle: textFontStyle.replace('italic ', ''),
      fontExtension: 'i',
    };
  }
  return {
    fontStyle: textFontStyle.includes('italic') ? textFontStyle : textFontStyle + 'italic ',
    fontExtension: '',
  };
}

export function endWriteTextItalicFontState(textFontStyle) {
  return {
    fontStyle: textFontStyle.replace('italic ', ''),
    fontExtension: '',
  };
}

export function startWriteTextBoldFontState(textFont, textFontStyle, textFontExtension) {
  if (textFont == 'gillsans') {
    return {
      fontStyle: textFontStyle,
      fontExtension: 'bold',
    };
  }
  return {
    fontStyle: textFontStyle.includes('bold') ? textFontStyle : textFontStyle + 'bold ',
    fontExtension: textFontExtension,
  };
}

export function endWriteTextBoldFontState(textFont, textFontStyle, textFontExtension) {
  if (textFont == 'gillsans') {
    return {
      fontStyle: textFontStyle,
      fontExtension: '',
    };
  }
  return {
    fontStyle: textFontStyle.replace('bold ', ''),
    fontExtension: textFontExtension,
  };
}

export function applyWriteTextFontState(lineContext, textFontStyle, textSize, textFont, textFontExtension) {
  lineContext.font = buildWriteTextFontDeclaration(textFontStyle, textSize, textFont, textFontExtension);
}

export function resolveWriteTextFontCode(word, possibleCode, savedFont) {
  if (!possibleCode.includes('font') && !savedFont) {
    return null;
  }
  let textFont = word.replace('{font', '').replace('}', '');
  const wordToWrite = savedFont ? word : null;
  if (savedFont) {
    textFont = savedFont;
  }
  return {
    textFont,
    textFontExtension: '',
    textFontStyle: '',
    savedFont: null,
    wordToWrite,
  };
}

export function applyWriteTextBelerenGlyphs(wordToWrite, fontDeclaration) {
  if (!wordToWrite || !fontDeclaration.endsWith('belerenb')) {
    return wordToWrite;
  }
  return wordToWrite
    .replace(/f(?:\s|$)/g, '\ue006')
    .replace(/h(?:\s|$)/g, '\ue007')
    .replace(/m(?:\s|$)/g, '\ue008')
    .replace(/n(?:\s|$)/g, '\ue009')
    .replace(/k(?:\s|$)/g, '\ue00a');
}
