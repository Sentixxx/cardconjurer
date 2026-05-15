import { useEffect, useState } from 'react';
import { fetchAbilities } from '@/services/askUrza';
import { EMPTY_ABILITY_GROUPS, type AbilityGroups } from '@/types/askUrza';

export type AbilitiesStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface UseAbilitiesResult {
  readonly status: AbilitiesStatus;
  readonly groups: AbilityGroups;
  readonly error: Error | null;
}

export function useAbilities(): UseAbilitiesResult {
  const [state, setState] = useState<UseAbilitiesResult>({
    status: 'idle',
    groups: EMPTY_ABILITY_GROUPS,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', groups: EMPTY_ABILITY_GROUPS, error: null });
    fetchAbilities()
      .then((groups) => {
        if (cancelled) return;
        setState({ status: 'ready', groups, error: null });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const wrapped = error instanceof Error ? error : new Error(String(error));
        setState({ status: 'error', groups: EMPTY_ABILITY_GROUPS, error: wrapped });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
