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
        description="随机生成一个鹏洛客异能。"
      />
      <section>
        <h2>生成异能</h2>
        <button type="button" onClick={() => onRoll('plus')} disabled={disabled}>
          +
        </button>{' '}
        <button type="button" onClick={() => onRoll('minus')} disabled={disabled}>
          −
        </button>{' '}
        <button type="button" onClick={() => onRoll('ultimate')} disabled={disabled}>
          终极
        </button>
        <p>
          <small>状态：<code>{status}</code>{error ? ` — ${error.message}` : ''}</small>
        </p>
        <p>
          <small>
            已加载 {groups.plus.length} 条加号 / {groups.minus.length} 条减号 / {groups.ultimate.length} 条终极异能。
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
