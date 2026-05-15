import { useState, type JSX } from 'react';
import { useAbilities } from '@/hooks/useAbilities';
import { pickAbility } from '@/services/askUrza';
import type { AbilityKind } from '@/types/askUrza';

export function AskUrzaPage(): JSX.Element {
  const { status, groups, error } = useAbilities();
  const [result, setResult] = useState<string>('');

  const onRoll = (kind: AbilityKind): void => {
    setResult(pickAbility(groups, kind));
  };

  const disabled = status !== 'ready';

  return (
    <>
      <h2 className="readable-background header-extension title center margin-bottom-large">
        询问乌尔札 2.0
      </h2>
      <div className="askUrzaGrid layer margin-bottom-large">
        <div className="urzaCard">
          <img src="/askurza/urzaBlank.png" alt="Urza, Academy Headmaster" />
        </div>
        <div>
          <img
            className="askUrzaButton"
            src="/askurza/plus.png"
            alt="+1"
            onClick={() => !disabled && onRoll('plus')}
          />
        </div>
        <div>
          <img
            className="askUrzaButton"
            src="/askurza/minus.png"
            alt="-1"
            onClick={() => !disabled && onRoll('minus')}
          />
        </div>
        <div>
          <img
            className="askUrzaButton"
            src="/askurza/ultimate.png"
            alt="ultimate"
            onClick={() => !disabled && onRoll('ultimate')}
          />
        </div>
        <h3 id="askUrzaResult" className="readable-background">
          {result}
        </h3>
      </div>
      <div className="readable-background layer margin-bottom-large">
        <h5>
          询问克撒 2.0 是 AskUrza.com 的替代品，它定期收集所有鹏洛客的异能并将它们分为三类，供克撒使用。这带来了更多的不可预测性，在我看来也更有趣。要使用询问克撒，只需点击 +1、-1 或 -6，让混沌之神决定你的命运！
        </h5>
        {error && (
          <p>
            <small>异能加载失败：{error.message}</small>
          </p>
        )}
      </div>
    </>
  );
}
