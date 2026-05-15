export function isWriteTextReminderManagedField(textObject) {
  return Boolean(textObject.name && !['Title', 'Type', 'Mana Cost', 'Power/Toughness'].includes(textObject.name));
}

export function getWriteTextFlavorMarkerIndex(rawText) {
  const flavorIndex = rawText.indexOf('{flavor}');
  if (flavorIndex >= 0) {
    return flavorIndex;
  }
  return rawText.indexOf('///');
}

export function splitWriteTextRulesFlavorText(rawText) {
  const flavorIndex = getWriteTextFlavorMarkerIndex(rawText);
  if (flavorIndex < 0) {
    return {
      rulesText: rawText,
      flavorText: '',
    };
  }
  return {
    rulesText: rawText.substring(0, flavorIndex),
    flavorText: rawText.substring(flavorIndex),
  };
}

export function applyWriteTextReminderOptions(rawText, textObject, hideReminderText, italicizeReminderText) {
  if (!isWriteTextReminderManagedField(textObject)) {
    return rawText;
  }
  const textParts = splitWriteTextRulesFlavorText(rawText);
  if (hideReminderText) {
    return textParts.rulesText.replace(/ ?{i}\([^\)]+\){\/i}/g, '') + textParts.flavorText;
  }
  if (italicizeReminderText) {
    return textParts.rulesText.replace(/\(([^)]+)\)/g, '{i}($1){/i}') + textParts.flavorText;
  }
  return rawText;
}

export function shouldUseWriteTextCopyright(textObject, copyrightText, hasMargins) {
  return (textObject.name == 'wizards' || textObject.name == 'copyright') && copyrightText != null && (copyrightText != '' || hasMargins);
}

export function applyWriteTextCopyright(rawText, textObject, copyrightText, hasMargins) {
  if (!shouldUseWriteTextCopyright(textObject, copyrightText, hasMargins)) {
    return rawText;
  }
  if (copyrightText == 'none') {
    return '';
  }
  return copyrightText;
}

export function applyWriteTextInlineCardName(rawText, getInlineCardNameValue) {
  if (rawText.toLowerCase().includes('{cardname}') || rawText.toLowerCase().includes('~')) {
    return rawText.replace(/{cardname}|~/ig, getInlineCardNameValue());
  }
  return rawText;
}

export function removeWriteTextEmptyArtistMarker(rawText, hasArtist) {
  if (!hasArtist) {
    return rawText.replace('\uFFEE{savex2}{elemidinfo-artist}', '');
  }
  return rawText;
}

export function normalizeWriteTextSeparators(rawText) {
  return rawText.replace(/\/\/\//g, '{flavor}').replace(/\/\//g, '{lns}');
}

export function applyWriteTextFlavorVersion(rawText, cardVersion, showsFlavorBar) {
  if (cardVersion == 'pokemon') {
    return rawText.replace(/{flavor}/g, '{oldflavor}{fontsize-20}{fontgillsansbolditalic}');
  }
  if (cardVersion == 'dossier') {
    return rawText.replace(/{flavor}(.*)/g, (value) => '{/indent}{lns}{bar}{lns}{fixtextalign}' + value.replace(/{flavor}/g, '').toUpperCase());
  }
  if (!showsFlavorBar) {
    return rawText.replace(/{flavor}/g, '{oldflavor}');
  }
  return rawText;
}

export function applyWriteTextFontMarkers(rawText, textObject) {
  if (textObject.font == 'saloongirl') {
    rawText = rawText.replace(/\*/g, '{fontbelerenbsc}*{fontsaloongirl}');
  }
  return rawText.replace(/ - /g, ' \u2014 ');
}

export function normalizeWriteTextRawText(rawText, options) {
  if (options.textAllCaps) {
    rawText = rawText.toUpperCase();
  }
  rawText = applyWriteTextCopyright(rawText, options.textObject, options.copyrightText, options.hasMargins);
  rawText = applyWriteTextInlineCardName(rawText, options.getInlineCardNameValue);
  rawText = removeWriteTextEmptyArtistMarker(rawText, options.hasArtist);
  rawText = normalizeWriteTextSeparators(rawText);
  rawText = applyWriteTextFlavorVersion(rawText, options.cardVersion, options.showsFlavorBar);
  return applyWriteTextFontMarkers(rawText, options.textObject);
}

export function tokenizeWriteTextRawText(rawText, splitString) {
  return rawText
    .replace(/\n/g, '{line}')
    .replace(/{-}/g, '\u2014')
    .replace(/{divider}/g, '{/indent}{lns}{bar}{lns}{fixtextalign}')
    .replace(/{flavor}/g, '{/indent}{lns}{bar}{lns}{fixtextalign}{i}')
    .replace(/{oldflavor}/g, '{/indent}{lns}{lns}{up30}{i}')
    .replace(/{/g, splitString + '{')
    .replace(/}/g, '}' + splitString)
    .replace(/([\u4e00-\u9fff])/g, splitString + '$1' + splitString)
    .replace(/[\u3000-\u303F]/g, splitString + '$&' + splitString)
    .replace(/ /g, splitString + ' ' + splitString)
    .split(splitString)
    .filter((item) => item);
}

export function filterWriteTextManaCostTokens(splitText, isManaCost) {
  if (isManaCost) {
    return splitText.filter((item) => item != ' ');
  }
  return splitText;
}

export function isWriteTextCodeToken(token) {
  return token.includes('{') && token.includes('}');
}

export function appendWriteTextVerticalCharacters(verticalTokens, item, index, splitTextLength, textManaCost, startingTextSize) {
  item.split('').forEach((char) => {
    if (char == '\u2019') {
      verticalTokens.push(`{right${startingTextSize * 0.6}}`, '\u2019', '{lns}', `{up${startingTextSize * 0.75}}`);
    } else if (textManaCost && index == splitTextLength - 1) {
      verticalTokens.push(char);
    } else {
      verticalTokens.push(char, '{lns}');
    }
  });
}

export function buildWriteTextVerticalTokens(splitText, textManaCost, startingTextSize, verticalSpaceShift) {
  const verticalTokens = [];
  splitText.forEach((item, index) => {
    if (isWriteTextCodeToken(item)) {
      verticalTokens.push(item, '{lns}');
    } else if (item == ' ') {
      verticalTokens.push(`{down${verticalSpaceShift}}`);
    } else {
      appendWriteTextVerticalCharacters(verticalTokens, item, index, splitText.length, textManaCost, startingTextSize);
    }
  });
  return verticalTokens;
}
