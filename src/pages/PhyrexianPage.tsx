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
        description="Phyrexian transliterator — generates Phyrexian-font-compatible glyphs from input text."
      />
      <section>
        <h2>输入</h2>
        <textarea
          value={input}
          rows={8}
          cols={60}
          placeholder="Type or paste English text…"
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
