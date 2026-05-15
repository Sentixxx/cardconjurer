export function getImportedDisplayName(card) {
  return (card.printed_name || card.name || '').replace(/^A-/, '{alchemy}');
}

export function buildImportedTitleParts(name, version) {
  if (version !== 'wanted') {
    return { title: name };
  }

  const index = name.indexOf(', ');
  if (index > 0) {
    return {
      title: name.substring(0, index + 1),
      subtitle: name.substring(index + 2),
    };
  }

  return { title: name, subtitle: '' };
}

export function buildImportedTitleTextFields(name, version, textPrefix) {
  const titleParts = buildImportedTitleParts(name, version);
  const fields = {
    title: textPrefix + globalThis.curlyQuotes(titleParts.title)
  };
  if (version === 'wanted') {
    fields.subtitle = titleParts.subtitle ? textPrefix + globalThis.curlyQuotes(titleParts.subtitle) : '';
  }
  return fields;
}

export function isChineseImportLanguage(lang) {
  return lang == 'cs' || lang == 'zhs';
}

export function getImportedRulesTextPrefix(lang, fallbackFontCode) {
  return isChineseImportLanguage(lang) ? '{fontCStext}' : fallbackFontCode;
}

export function getImportedBaseTextPrefix(lang) {
  return lang == 'ph' ? '{fontphyrexian}' : '';
}

export function getImportedStandardTextPrefix(lang, fallbackFontCode) {
  return isChineseImportLanguage(lang) ? '{fontCStitle}{fontsize+14}' : fallbackFontCode;
}

export function getImportedCollectorLanguage(lang) {
  return isChineseImportLanguage(lang) ? 'CS' : (lang || '').toUpperCase();
}

export function formatImportedTypeLine(typeLine, lang) {
  if (isChineseImportLanguage(lang)) {
    return typeLine.replace('～', '～').replace(' — ', '～');
  }
  return typeLine;
}

export function buildImportedTypeTextFields(typeLine, lang, textPrefix) {
  const formattedTypeLine = formatImportedTypeLine(typeLine, lang);
  return {
    typeLine: formattedTypeLine,
    text: textPrefix + formattedTypeLine || '',
  };
}
