export interface SagaAbilityRow {
  readonly ability: string;
  readonly steps: number;
}

const ROMAN_DIGITS: ReadonlyArray<readonly [number, string]> = [
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

export function toRomanNumeral(value: number): string {
  if (!Number.isFinite(value) || value < 1) return '';
  let remainder = Math.floor(value);
  let out = '';
  for (const [v, sym] of ROMAN_DIGITS) {
    while (remainder >= v) {
      out += sym;
      remainder -= v;
    }
  }
  return out;
}

export function stripSagaReminderText(text: string): string {
  return text.replace(/^\(.*?\)\s*/, '');
}

const SAGA_ABILITY_PATTERN = /([IVX, ]+)\s+—\s+([^]+?)(?=(?:\n[IVX, ]+\s+—|$))/g;

function buildStepAbilityMap(text: string): ReadonlyMap<string, string> {
  const map = new Map<string, string>();
  const abilityText = stripSagaReminderText(text);
  SAGA_ABILITY_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = SAGA_ABILITY_PATTERN.exec(abilityText)) !== null) {
    const steps = match[1].split(',').map((s) => s.trim()).filter(Boolean);
    const ability = match[2].trim();
    for (const step of steps) map.set(step, ability);
  }
  return map;
}

export function parseSagaAbilities(text: string, maxSteps = 24): readonly SagaAbilityRow[] {
  const map = buildStepAbilityMap(text);
  const order = Array.from({ length: maxSteps }, (_, i) => toRomanNumeral(i + 1));
  const rows = new Map<string, SagaAbilityRow>();
  const seen: SagaAbilityRow[] = [];
  for (const step of order) {
    const ability = map.get(step);
    if (!ability) continue;
    const existing = rows.get(ability);
    if (existing) {
      const updated: SagaAbilityRow = { ability, steps: existing.steps + 1 };
      rows.set(ability, updated);
      const index = seen.findIndex((row) => row.ability === ability);
      if (index >= 0) seen[index] = updated;
    } else {
      const fresh: SagaAbilityRow = { ability, steps: 1 };
      rows.set(ability, fresh);
      seen.push(fresh);
    }
  }
  return seen;
}
