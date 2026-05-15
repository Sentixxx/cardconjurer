export function formatRollAbilityLine(line) {
  const rollMatch = line.match(/^(\d+(?:\u2014\d+)?)\s*\|\s*(.+)$/);
  if (!rollMatch) return null;
  return `{roll${rollMatch[1]}} ${rollMatch[2]}`;
}

export function isRollAbilityText(text) {
  return text.toLowerCase().includes('roll a d20');
}

export function getRollOutcomeLines(text) {
  return text.split('\n').slice(1);
}

export function replaceRollOutcomeLines(text, outcomeLines = getRollOutcomeLines(text)) {
  let modifiedText = text;
  for (const outcomeLine of outcomeLines) {
    const line = outcomeLine.trim();
    const newLine = formatRollAbilityLine(line);
    if (newLine) {
      modifiedText = modifiedText.replace(line, newLine);
    }
  }
  return modifiedText;
}

export function parseRollAbilities(text) {
  if (!isRollAbilityText(text)) {
    return null;
  }
  return replaceRollOutcomeLines(text);
}
