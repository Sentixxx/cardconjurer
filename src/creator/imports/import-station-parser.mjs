export function formatStationReminderText(text) {
  return text.replace(/Station (\([^)]+\))/g, 'Station {i}$1{/i}');
}

export function isStationOracleText(oracleText) {
  return Boolean(oracleText && oracleText.includes('Station'));
}

export function getStationAbilityPattern() {
  return /(\d+\+)\s*\|\s*([^\n]+)/g;
}

export function parseStationAbilities(oracleText) {
  const stationRegex = getStationAbilityPattern();
  const stationAbilities = [];
  let match;
  while ((match = stationRegex.exec(oracleText)) !== null) {
    stationAbilities.push({
      number: match[1],
      text: match[2].trim()
    });
  }
  return stationAbilities;
}

export function getStationPreText(oracleText) {
  return oracleText.split(/STATION \d+\+/)[0].trim();
}

export function formatStationPreText(oracleText) {
  return formatStationReminderText(getStationPreText(oracleText));
}

export function splitStationPreText(preStationText) {
  if (!preStationText) {
    return { preText: '', reminderText: '' };
  }

  const stationReminderMatch = preStationText.match(/(.*?)(Station \{i\}\([^)]+\)\{\/i\}|Station \([^)]+\))/s);
  if (!stationReminderMatch) {
    return { preText: preStationText.trim(), reminderText: '' };
  }

  const reminderText = stationReminderMatch[2].includes('{i}')
    ? stationReminderMatch[2]
    : formatStationReminderText(stationReminderMatch[2]);
  return {
    preText: stationReminderMatch[1].trim(),
    reminderText
  };
}

export function buildStationPlacementData(stationData) {
  const { preText, reminderText } = splitStationPreText(stationData.preStationText);
  const stationAbilities = stationData.stationAbilities;
  const numAbilities = stationAbilities.length;
  const hasPreText = Boolean(preText);
  const scenarios = {
    'false,1': ['', reminderText, stationAbilities[0]?.text, [null, stationAbilities[0]?.number]],
    'true,1': [preText, reminderText, stationAbilities[0]?.text, [null, stationAbilities[0]?.number]],
    'false,2': [reminderText, stationAbilities[0]?.text, stationAbilities[1]?.text, [stationAbilities[0]?.number, stationAbilities[1]?.number]],
    'true,2': [preText + (reminderText ? '\n' + reminderText : ''), stationAbilities[0]?.text, stationAbilities[1]?.text, [stationAbilities[0]?.number, stationAbilities[1]?.number]]
  };
  const scenario = scenarios[`${hasPreText},${numAbilities}`];
  if (!scenario) {
    return null;
  }

  return {
    abilityTexts: scenario.slice(0, 3),
    badges: scenario[3],
    hasPreText,
    shouldDisableFirstSquare: numAbilities === 1
  };
}

export function parseStationCard(oracleText) {
  if (!isStationOracleText(oracleText)) {
    return null;
  }

  return {
    preStationText: formatStationPreText(oracleText),
    stationAbilities: parseStationAbilities(oracleText)
  };
}
