import { isChineseImportLanguage } from './import-card-basics.mjs';
import { parseRollAbilities } from './import-roll.mjs';

export function getImportedRulesItalicExemptions() {
  return ['Boast', 'Cycling', 'Visit', 'Prize', 'I', 'II', 'III', 'IV', 'I, II', 'II, III', 'III, IV', 'I, II, III', 'II, III, IV', 'I, II, III, IV', '\u2022 Khans', '\u2022 Dragons', '\u2022 Mirran', '\u2022 Phyrexian', 'Prototype', 'Companion', 'To solve', 'Solved'];
}

export function formatImportedRulesText(cardToImport) {
  if (!cardToImport.oracle_text) {
    return '';
  }

  const italicExemptions = getImportedRulesItalicExemptions();
  const rollText = parseRollAbilities(cardToImport.oracle_text);
  const rulesItalicPattern = new RegExp('(?:\\((?:.*?)\\)|[^"\\n]+(?= \\u2014 ))', 'g');
  let rulesText = (rollText || cardToImport.oracle_text || '').replace(rulesItalicPattern, function(a) {
    if (italicExemptions.includes(a) || (cardToImport.keywords && cardToImport.keywords.indexOf('Spree') != -1 && a.startsWith('+'))) {return a;}
    return '{i}' + a + '{/i}';
  });
  const isCleaveSpell = rulesText.toLowerCase().includes('cleave') ||
                         (cardToImport.keywords && cardToImport.keywords.includes('Cleave'));

  if (!isCleaveSpell) {
    rulesText = rulesText.replace(/\[([+\-\u2212]\d+)\]/g, function(match, number) {
      return '{' + number.replace('\u2212', '-') + '}';
    });
  }

  rulesText = globalThis.curlyQuotes(rulesText).split('{Q}').join('{untap}').split('{\u221E}').join('{inf}').replace(/\u2022 /g, '\u2022 {indent}');
  return rulesText.replace('(If this card is your chosen companion, you may put it into your hand from outside the game for {3} any time you could cast a sorcery.)', '(If this card is your chosen companion, you may put it into your hand from outside the game for {3} as a sorcery.)');
}

export function formatImportedFlavorText(flavorText) {
  let formattedFlavorText = flavorText || '';
  let flavorTextCounter = 1;
  while (formattedFlavorText.includes('*') || formattedFlavorText.includes('"')) {
    if (flavorTextCounter % 2) {
      formattedFlavorText = formattedFlavorText.replace('*', '{/i}');
      formattedFlavorText = formattedFlavorText.replace('"', '\u201c');
    } else {
      formattedFlavorText = formattedFlavorText.replace('*', '{i}');
      formattedFlavorText = formattedFlavorText.replace('"', '\u201d');
    }
    flavorTextCounter ++;
  }
  return formattedFlavorText.replace('\n', '{lns}');
}

export function buildImportedRulesFlavorText(flavorText, lang) {
  let rulesFlavorText = '{flavor}';
  if (isChineseImportLanguage(lang)) {
    rulesFlavorText += '{fontCSflavor}';
  }
  return rulesFlavorText + globalThis.curlyQuotes(formatImportedFlavorText(flavorText));
}

export function buildImportedPokemonFlavorFields(typeLine, flavorText) {
  const formattedFlavorText = globalThis.curlyQuotes(formatImportedFlavorText(flavorText));
  if (typeLine.toLowerCase().includes('creature')) {
    return {
      rules: '{flavor}' + formattedFlavorText,
      rulesnoncreature: ''
    };
  }
  return {
    rules: '{flavor}',
    rulesnoncreature: formattedFlavorText
  };
}

export function buildImportedPokemonRulesFields(cardToImport, rulesText, rulesTextPrefix) {
  const prefixedRulesText = rulesTextPrefix + rulesText;
  const typeLine = cardToImport.type_line.toLowerCase();
  if (typeLine.includes('creature')) {
    return {
      rules: prefixedRulesText,
      rulesnoncreature: '',
      middleStatTitle: 'power',
      rightStatTitle: 'toughness'
    };
  }
  if (typeLine.includes('planeswalker') || typeLine.includes('\u9e4f\u6d1b\u5ba2')) {
    return {
      rules: prefixedRulesText,
      rulesnoncreature: '',
      pt: '{' + (cardToImport.loyalty || '' + '}'),
      middleStatTitle: '',
      rightStatTitle: 'loyalty'
    };
  }
  if (typeLine.includes('battle')) {
    return {
      rules: prefixedRulesText,
      rulesnoncreature: '',
      pt: '{' + (cardToImport.defense || '' + '}'),
      middleStatTitle: '',
      rightStatTitle: 'defense'
    };
  }
  return {
    rules: '',
    rulesnoncreature: prefixedRulesText,
    middleStatTitle: '',
    rightStatTitle: ''
  };
}

export function buildImportedRulesTextFields(cardToImport, cardVersion, rulesText, rulesTextPrefix) {
  if (cardVersion == 'pokemon') {
    const fields = buildImportedPokemonRulesFields(cardToImport, rulesText, rulesTextPrefix);
    if (cardToImport.flavor_text) {
      const flavorFields = buildImportedPokemonFlavorFields(cardToImport.type_line, cardToImport.flavor_text);
      fields.rules += flavorFields.rules;
      fields.rulesnoncreature += flavorFields.rulesnoncreature;
    }
    return fields;
  }

  const fields = {
    rules: rulesTextPrefix + rulesText
  };
  if (cardToImport.flavor_text) {
    fields.rules += buildImportedRulesFlavorText(cardToImport.flavor_text, cardToImport.lang);
  }
  return fields;
}

export function buildImportedCaseRulesText(rulesText, rulesTextPrefix) {
  return rulesTextPrefix + rulesText.replace(/(\r\n|\r|\n)/g, '//{bar}//');
}

export function normalizeImportedPtText(ptText) {
  if (ptText == undefined + '/' + undefined) {return '';}
  if (ptText == undefined + '\n' + undefined) {return '';}
  if (ptText == '{}') {return '';}
  return ptText;
}

export function buildImportedPtFields(cardToImport, version) {
  if (version == 'invocation') {
    return {
      pt: normalizeImportedPtText(cardToImport.power + '\n' + cardToImport.toughness || '')
    };
  }
  if (version == 'pokemon') {
    return {
      middleStat: normalizeImportedPtText('{' + (cardToImport.power || '') + '}'),
      pt: normalizeImportedPtText('{' + (cardToImport.toughness || '') + '}')
    };
  }
  return {
    pt: normalizeImportedPtText(cardToImport.power + '/' + cardToImport.toughness || '')
  };
}
