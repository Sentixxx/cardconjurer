export interface PlaneswalkerAbility {
  readonly cost: string;
  readonly text: string;
}

export type LoyaltyIconKind = 'plus' | 'minus' | 'zero' | 'ultimate' | 'other';

export function classifyLoyaltyCost(cost: string): LoyaltyIconKind {
  const trimmed = cost.trim();
  if (trimmed === '0') return 'zero';
  if (trimmed.startsWith('+')) return 'plus';
  if (trimmed.startsWith('-') || trimmed.startsWith('−')) {
    const numeric = parseInt(trimmed.replace(/[−-]/g, ''), 10);
    if (Number.isFinite(numeric) && numeric >= 5) return 'ultimate';
    return 'minus';
  }
  return 'other';
}

/**
 * Parse a multiline string into planeswalker abilities. Each non-empty line is
 * expected as `<cost>: <text>` (matching legacy ability list format). Lines
 * without `:` are treated as continuation of the previous ability.
 */
export function parsePlaneswalkerAbilities(input: string): readonly PlaneswalkerAbility[] {
  const lines = input.split('\n');
  const abilities: PlaneswalkerAbility[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) {
      const last = abilities[abilities.length - 1];
      if (last) {
        abilities[abilities.length - 1] = { cost: last.cost, text: `${last.text}\n${line}` };
      } else {
        abilities.push({ cost: '', text: line });
      }
      continue;
    }
    const cost = line.slice(0, colonIndex).trim();
    const text = line.slice(colonIndex + 1).trim();
    abilities.push({ cost, text });
  }
  return abilities;
}
