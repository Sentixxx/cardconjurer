import { useState, type JSX } from 'react';
import { Placeholder } from '@/components/Placeholder';
import { useAbilities } from '@/hooks/useAbilities';
import { pickAbility } from '@/services/askUrza';
import type { AbilityKind } from '@/types/askUrza';

export function AskUrzaPage(): JSX.Element {
  const { status, groups, error } = useAbilities();
  const [result, setResult] = useState<string | null>(null);

  const onRoll = (kind: AbilityKind): void => {
    setResult(pickAbility(groups, kind));
  };

  const disabled = status !== 'ready';

  return (
    <>
      <Placeholder
        routeKey="askUrza"
        description="询问乌尔札 2.0 — generates a random planeswalker ability for one of the three loyalty kinds."
      />
      <section>
        <h2>Roll an ability</h2>
        <button type="button" onClick={() => onRoll('plus')} disabled={disabled}>
          +
        </button>{' '}
        <button type="button" onClick={() => onRoll('minus')} disabled={disabled}>
          −
        </button>{' '}
        <button type="button" onClick={() => onRoll('ultimate')} disabled={disabled}>
          Ultimate
        </button>
        <p>
          <small>Status: <code>{status}</code>{error ? ` — ${error.message}` : ''}</small>
        </p>
        <p>
          <small>
            Loaded {groups.plus.length} plus / {groups.minus.length} minus / {groups.ultimate.length} ultimate
            entries.
          </small>
        </p>
        {result && (
          <blockquote style={{ borderLeft: '4px solid var(--interactable-selected)', padding: '0.5rem 1rem' }}>
            {result}
          </blockquote>
        )}
      </section>
    </>
  );
}
