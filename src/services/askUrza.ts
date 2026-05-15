import { EMPTY_ABILITY_GROUPS, type AbilityGroups, type AbilityKind } from '@/types/askUrza';

export const ABILITY_DATA_URL = '/data/askurza/abilities.txt';

function splitAndClean(group: string): readonly string[] {
  return group
    .split(';')
    .map((entry) => entry.replace(/\\"/g, '"').trim())
    .filter((entry) => entry.length > 0);
}

export function parseAbilities(text: string): AbilityGroups {
  const groups = text.split('$$$');
  return {
    plus: splitAndClean(groups[0] ?? ''),
    minus: splitAndClean(groups[1] ?? ''),
    ultimate: splitAndClean(groups[2] ?? ''),
  };
}

export async function fetchAbilities(url: string = ABILITY_DATA_URL): Promise<AbilityGroups> {
  if (typeof fetch === 'undefined') return EMPTY_ABILITY_GROUPS;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ability data: HTTP ${response.status}`);
  }
  const text = await response.text();
  return parseAbilities(text);
}

export function pickAbility(
  groups: AbilityGroups,
  kind: AbilityKind,
  rand: () => number = Math.random,
): string | null {
  const pool = groups[kind];
  if (pool.length === 0) return null;
  const index = Math.floor(rand() * pool.length);
  return pool[index] ?? null;
}
