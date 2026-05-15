export function stripSagaReminderText(text) {
  return text.replace(/^\(.*?\)\s*/, '');
}

export function getSagaAbilityPattern() {
  return /([IVX, ]+)\s+\u2014\s+([^]+?)(?=(?:\n[IVX, ]+\s+\u2014|$))/g;
}

export function buildSagaStepAbilityMap(text) {
  const stepsMap = {};
  const abilityText = stripSagaReminderText(text);
  const regex = getSagaAbilityPattern();
  let match;
  while ((match = regex.exec(abilityText)) !== null) {
    const stepsRaw = match[1].split(',').map(s => s.trim());
    const ability = match[2].trim();
    for (const step of stepsRaw) {
      stepsMap[step] = ability;
    }
  }
  return stepsMap;
}

export function getSagaLoreStepOrder(maxSteps = 24) {
  return Array.from({ length: maxSteps }, (_, i) => globalThis.romanNumeral(i + 1));
}

export function collectSagaAbilitiesInOrder(stepsMap, loreOrder = getSagaLoreStepOrder()) {
  const abilityMap = new Map();
  for (const step of loreOrder) {
    const ability = stepsMap[step];
    if (!ability) continue;
    if (abilityMap.has(ability)) {
      abilityMap.get(ability).steps += 1;
    } else {
      abilityMap.set(ability, { ability, steps: 1 });
    }
  }
  return Array.from(abilityMap.values());
}

export function parseSagaAbilities(text) {
  return collectSagaAbilitiesInOrder(buildSagaStepAbilityMap(text));
}

export function extractSagaReminderText(text) {
  const match = text.match(/^\([^)]*\)/);
  return match ? match[0] : null;
}

export function formatImportedAbilityText(abilityText) {
  return abilityText.replace('(', '{i}(').replace(')', '){/i}');
}

export function buildImportedSagaData(cardToImport) {
  const abilities = parseSagaAbilities(cardToImport.oracle_text);
  return {
    rules2: [cardToImport.flavor_text, ...(cardToImport.keywords || [])]
      .filter(Boolean)
      .join('\n'),
    abilityTexts: abilities.map(ability => formatImportedAbilityText(ability.ability)),
    reminderText: `{i}${extractSagaReminderText(cardToImport.oracle_text)}{/i}`,
    saga: {
      abilities: abilities.map(ability => ability.steps).concat(Array.from({ length: 4 - abilities.length}, () => 0)),
      count: abilities.length
    }
  };
}

export function buildImportedSagaFields(cardToImport) {
  const sagaData = buildImportedSagaData(cardToImport);
  return {
    rules2: sagaData.rules2,
    abilities: sagaData.abilityTexts.map((text, index) => ({
      field: `ability${index}`,
      text
    })),
    reminder: sagaData.reminderText,
    saga: sagaData.saga
  };
}
