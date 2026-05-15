import { useMemo, useState, type JSX } from 'react';
import { transliterateToPhyrexian } from '@/services/phyrexian';

export function PhyrexianPage(): JSX.Element {
  const [input, setInput] = useState('');
  const output = useMemo(() => transliterateToPhyrexian(input), [input]);

  return (
    <>
      <h2 className="readable-background header-extension title center margin-bottom-large">
        非瑞克西亚文字生成器
      </h2>
      <div className="layer margin-bottom-large">
        <div className="input-grid padding margin-bottom readable-background">
          <div>
            <h5 className="margin-bottom padding input-description">
              输入您想要“翻译”的文字
            </h5>
            <textarea
              className="input phyrexian-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div>
            <h5 className="margin-bottom padding input-description">
              然后从这里复制“翻译”后的文字
            </h5>
            <textarea
              className="input phyrexian-textarea"
              style={{ fontFamily: 'phyrexian' }}
              value={output}
              disabled
              readOnly
            />
          </div>
        </div>
      </div>
      <div className="readable-background layer margin-bottom-large">
        <h3 className="padding margin-bottom center">这不是一个翻译器</h3>
        <h4 className="padding margin-bottom">
          非瑞克西亚文字生成器只是将您输入的字符数量转换成与非瑞克西亚字体兼容的随机字符。
        </h4>
        <h4 className="padding margin-bottom">
          要在Card Conjurer中使用生成的文字，只需复制并粘贴输出文字，但请记住在文字前添加{'{fontphyrexian}'}以使用正确的字体！
        </h4>
      </div>
    </>
  );
}
