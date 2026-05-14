export function formatImportedLoyaltyAbilityLine(ability) {
  const loyaltyPattern = new RegExp('\\[([+\\-\u2212]\\d+)\\]', 'g');
  return ability.replace(loyaltyPattern, function(match, number) {
    return '{' + number.replace('\u2212', '-') + '}';
  });
}

export function collapseImportedPlaneswalkerAbilityLines(abilities) {
  const collapsedAbilities = abilities.slice();
  while (collapsedAbilities.length > 4) {
    var newAbility = collapsedAbilities[collapsedAbilities.length - 2] + '\n' + collapsedAbilities.pop();
    collapsedAbilities[collapsedAbilities.length - 1] = newAbility;
  }
  return collapsedAbilities;
}

export function buildImportedPlaneswalkerAbilities(oracleText) {
  return collapseImportedPlaneswalkerAbilityLines(oracleText.split('\n').map(formatImportedLoyaltyAbilityLine)).map(ability => {
    let planeswalkerAbility = ability.replace(': ', 'splitstring').split('splitstring');
    if (!planeswalkerAbility[1]) {
      planeswalkerAbility = ['', planeswalkerAbility[0]];
    }
    return {
      cost: planeswalkerAbility[0].replace('\u2212', '-'),
      text: planeswalkerAbility[1].replace('(', '{i}(').replace(')', '){/i}')
    };
  });
}

export function getImportedPlaneswalkerAbilityHeight(cardVersion, abilityCount) {
  const heightScale = cardVersion == 'planeswalkerTall' || cardVersion == 'planeswalkerCompleated'
    ? 0.3572
    : 0.2915;
  return Math.round(globalThis.scaleHeight(heightScale) / abilityCount);
}

export function buildImportedPlaneswalkerFields(cardToImport, cardVersion) {
  const abilities = buildImportedPlaneswalkerAbilities(cardToImport.oracle_text);
  const abilityHeight = abilities.length
    ? getImportedPlaneswalkerAbilityHeight(cardVersion, abilities.length)
    : 0;
  return {
    loyalty: cardToImport.loyalty || '',
    abilities: [0, 1, 2, 3].map(i => {
      if (!abilities[i]) {
        return { text: '', height: 0 };
      }
      return {
        text: abilities[i].text,
        cost: abilities[i].cost,
        height: abilityHeight
      };
    })
  };
}
