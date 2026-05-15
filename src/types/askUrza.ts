export type AbilityKind = 'plus' | 'minus' | 'ultimate';

export interface AbilityGroups {
  readonly plus: readonly string[];
  readonly minus: readonly string[];
  readonly ultimate: readonly string[];
}

export const EMPTY_ABILITY_GROUPS: AbilityGroups = {
  plus: [],
  minus: [],
  ultimate: [],
};
