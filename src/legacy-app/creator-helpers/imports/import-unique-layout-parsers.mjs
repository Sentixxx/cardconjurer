export function collectLevelSections(sections) {
  const levelSections = [];
  let currentSection = null;
  for (let i = 1; i < sections.length; i++) {
    const line = sections[i];
    const levelMatch = line.match(/^LEVEL (.+)$/);
    if (levelMatch) {
      if (currentSection) {
        levelSections.push(currentSection);
      }
      currentSection = {
        levelRange: levelMatch[1],
        content: []
      };
    } else if (currentSection && line.trim()) {
      currentSection.content.push(line);
    }
  }

  if (currentSection) {
    levelSections.push(currentSection);
  }

  return levelSections;
}

export function buildLevelData(section) {
  const ptMatch = section.content.find(line => /^\d+\/\d+$/.test(line.trim()));
  const abilities = ptMatch
    ? section.content.filter(line => line.trim() !== ptMatch.trim())
    : section.content;
  return {
    range: section.levelRange,
    pt: ptMatch ? ptMatch.trim() : '',
    abilities,
    rulesText: abilities.join('\n')
  };
}

export function getLevelerOracleLines(oracleText) {
  return oracleText.split('\n');
}

export function parseLevelUpLine(line) {
  const levelUpMatch = line.match(/Level up (.+?) \((.+?)\)/);
  return {
    cost: levelUpMatch ? levelUpMatch[1] : '',
    reminder: levelUpMatch ? levelUpMatch[2] : ''
  };
}

export function formatLevelUpText(levelUpData) {
  return `Level up ${levelUpData.cost} {i}(${levelUpData.reminder}){/i}`;
}

export function buildLevelerData(card, sections) {
  const levelUpData = parseLevelUpLine(sections[0]);
  const levelSections = collectLevelSections(sections);
  return {
    ...getLayoutCardBase(card, 'leveler'),
    levelUpCost: levelUpData.cost,
    levelUpText: formatLevelUpText(levelUpData),
    levels: levelSections.map(buildLevelData)
  };
}

export function hasLayoutOracleText(card, layout) {
  return card.layout === layout && Boolean(card.oracle_text);
}

export function parseLevelerCard(card) {
  if (!hasLayoutOracleText(card, 'leveler')) {
    console.error('Not a valid leveler card');
    return null;
  }

  return buildLevelerData(card, getLevelerOracleLines(card.oracle_text));
}

export function getLayoutIdentityFields(card, layout) {
  return {
    layout,
    name: card.name || '',
    type: card.type_line || '',
  };
}

export function getLayoutCardBase(card, layout) {
  return {
    ...getLayoutIdentityFields(card, layout),
    mana: card.mana_cost || '',
    basePT: card.power && card.toughness ? `${card.power}/${card.toughness}` : '',
  };
}

export function getRulesAfterFirstLine(oracleText) {
  return oracleText.split('\n').slice(1).join('\n').trim();
}

export function parsePrototypeText(oracleText) {
  const prototypeMatch = oracleText.match(/^Prototype (.+?) \u2014 (\d+)\/(\d+) \((.+?)\)/);
  if (!prototypeMatch) return null;
  return {
    cost: prototypeMatch[1],
    power: prototypeMatch[2],
    toughness: prototypeMatch[3],
    pt: `${prototypeMatch[2]}/${prototypeMatch[3]}`,
    reminder: prototypeMatch[4]
  };
}

export function formatPrototypeReminderText(prototypeData) {
  return `Prototype ${prototypeData.cost} \u2014 ${prototypeData.pt} {i}(${prototypeData.reminder}){/i}`;
}

export function buildPrototypeLayoutData(card, prototypeData) {
  return {
    ...getLayoutCardBase(card, 'prototype'),
    rules: getRulesAfterFirstLine(card.oracle_text),
    prototype: {
      cost: prototypeData.cost,
      pt: prototypeData.pt,
      reminderText: formatPrototypeReminderText(prototypeData)
    }
  };
}

export function parsePrototypeLayout(card) {
  if (!hasLayoutOracleText(card, 'prototype')) {
    console.error('Not a valid prototype card');
    return null;
  }

  const prototypeData = parsePrototypeText(card.oracle_text);
  if (!prototypeData) {
    console.error('Could not parse prototype information');
    return null;
  }

  return buildPrototypeLayoutData(card, prototypeData);
}

export function parseMutateText(oracleText) {
  const mutateMatch = oracleText.match(/^Mutate (.+?) \((.+?)\)/);
  if (!mutateMatch) return null;
  return {
    cost: mutateMatch[1],
    reminder: mutateMatch[2]
  };
}

export function formatMutateReminderText(mutateData) {
  return `Mutate ${mutateData.cost} {i}(${mutateData.reminder}){/i}`;
}

export function buildMutateLayoutData(card, mutateData) {
  return {
    ...getLayoutCardBase(card, 'mutate'),
    rules: getRulesAfterFirstLine(card.oracle_text),
    mutate: {
      cost: mutateData.cost,
      reminderText: formatMutateReminderText(mutateData)
    }
  };
}

export function parseMutateLayout(card) {
  if (!hasLayoutOracleText(card, 'mutate')) {
    console.error('Not a valid mutate card');
    return null;
  }

  const mutateData = parseMutateText(card.oracle_text);
  if (!mutateData) {
    console.error('Could not parse mutate information');
    return null;
  }

  return buildMutateLayoutData(card, mutateData);
}

export function parseVanguardLayout(card) {
  if (!hasLayoutOracleText(card, 'vanguard')) {
    console.error('Not a valid vanguard card');
    return null;
  }

  return {
    ...getLayoutIdentityFields(card, 'vanguard'),
    rules: card.oracle_text || '',
    flavor: card.flavor_text || '',
    handModifier: card.hand_modifier || '',
    lifeModifier: card.life_modifier || ''
  };
}
