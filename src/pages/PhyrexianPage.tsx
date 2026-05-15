import { useMemo, useState, type JSX } from 'react';
import { Placeholder } from '@/components/Placeholder';
import { transliterateToPhyrexian } from '@/services/phyrexian';

export function PhyrexianPage(): JSX.Element {
  const [input, setInput] = useState('');
  const output = useMemo(() => transliterateToPhyrexian(input), [input]);

  return (
    <>
      <Placeholder
        routeKey="phyrexian"
        description="把输入文字转换为可用于非瑞克西亚字体的字符。"
      />
      <section>
        <h2>输入</h2>
        <textarea
          value={input}
          rows={8}
          cols={60}
          placeholder="输入或粘贴英文文本…"
          onChange={(e) => setInput(e.target.value)}
        />
      </section>
      <section>
        <h2>输出</h2>
        <textarea value={output} rows={8} cols={60} readOnly style={{ fontFamily: 'phyrexian, monospace' }} />
        <p>
          <small>
            这不是真正的翻译。生成器只是将输入文字按字符数转换成与 Phyrexian 字体兼容的随机字符。
            在 Creator 中使用时，请在文本前添加 <code>{'{fontphyrexian}'}</code>。
          </small>
        </p>
      </section>
    </>
  );
}
