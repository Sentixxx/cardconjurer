import type { JSX } from 'react';
import { Placeholder } from '@/components/Placeholder';

export function LegalPage(): JSX.Element {
  return (
    <>
      <Placeholder routeKey="legal" description="Terms, disclaimers, and storage notice (ported from the Card Conjurer original)." />
      <article>
        <section>
          <h2>简介</h2>
          <p>
            欢迎使用 Card Forger。使用本服务即表示您确认已阅读、理解并同意受下列条款的约束。本项目是 Card
            Conjurer 的开源 TypeScript/React 重构，承袭其条款主旨。
          </p>
        </section>
        <section>
          <h2>免责声明</h2>
          <p>
            本项目与 Wizards of the Coast、Legend Story Studios、Scryfall LLC 没有任何关联，也未受其赞助或认可。
            字体、法术力符号、卡牌图像和其他相关图像为各自商标和版权所有人的财产。
          </p>
          <p>
            所有用户上传的艺术作品归原作者所有，由用户负责确认其使用权与署名。
          </p>
        </section>
        <section>
          <h2>使用条款</h2>
          <p>本服务仅供个人使用，不得用于商业目的。请勿上传您没有使用权限的内容。</p>
        </section>
        <section>
          <h2>本地存储</h2>
          <p>
            使用本服务即表示您同意在您的设备上使用 <code>localStorage</code>，用于保存您之前的偏好与您选择保存的
            卡牌。我们不会把这些数据发送到任何后端——这是纯静态站点。
          </p>
        </section>
        <section>
          <h2>变更</h2>
          <p>
            条款可能随项目演进而修改。继续使用本服务即表示您接受当前生效版本。
          </p>
        </section>
      </article>
    </>
  );
}
