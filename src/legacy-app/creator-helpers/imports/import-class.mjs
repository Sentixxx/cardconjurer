import { formatImportedAbilityText } from './import-saga.mjs';

export function splitClassOracleText(text) {
  const lines = text.split('\n');
  if (lines[0].startsWith('(')) {
    return {
      reminderText: lines[0],
      lines: lines.slice(1)
    };
  }
  return {
    reminderText: '',
    lines
  };
}

export function getClassLevelCost(line) {
  const levelMatch = line.match(/^(\{.*?\}):\s*Level \d+/);
  return levelMatch ? `${levelMatch[1]}:` : '';
}

export function collectClassAbilities(lines) {
  const abilities = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const cost = getClassLevelCost(line);
    if (cost) {
      const ability = lines[i + 1]?.trim() || '';
      abilities.push({ cost, ability });
      i++;
    } else if (abilities.length === 0) {
      abilities.push({ cost: '', ability: line });
    }
  }
  return abilities;
}

export function prependClassReminderText(reminderText, abilities) {
  if (reminderText && abilities.length > 0) {
    abilities[0].ability = `${reminderText}{lns}{bar}{lns}${abilities[0].ability}`;
  }
  return abilities;
}

export function parseClassAbilities(text) {
  const classOracleText = splitClassOracleText(text);
  return prependClassReminderText(classOracleText.reminderText, collectClassAbilities(classOracleText.lines));
}

export function buildImportedClassData(cardToImport) {
  const abilities = parseClassAbilities(cardToImport.oracle_text);
  return {
    flavor: cardToImport.flavor_text || '',
    levels: abilities.map((ability, index) => ({
      cost: ability.cost ? ability.cost.replace('\u2212', '-') : '',
      levelLabel: index !== 0 ? `Level ${index + 1}` : '',
      text: formatImportedAbilityText(ability.ability)
    })),
    class: {
      abilities: abilities.map(ability => ability.cost).concat(Array.from({ length: 4 - abilities.length}, () => '')),
      count: abilities.length
    }
  };
}

export function buildImportedClassFields(cardToImport) {
  const classData = buildImportedClassData(cardToImport);
  return {
    flavor: classData.flavor,
    levels: classData.levels.map((levelData, index) => ({
      costField: `level${index}a`,
      cost: levelData.cost,
      levelField: `level${index}b`,
      levelLabel: levelData.levelLabel,
      textField: `level${index}c`,
      text: levelData.text
    })),
    class: classData.class
  };
}
