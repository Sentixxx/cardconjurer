import type { JSX } from 'react';
import { Link, ROUTES } from '@/lib/router';

export function LandingPage(): JSX.Element {
  return (
    <article className="landing-page">
      <div className="layer center" />
      <div className="layer center">
        <h1>欢迎来到Card Conjurer</h1>
        <h3>一个定制的万智牌制卡器</h3>
      </div>
      <div className="layer center" />

      <div className="layer readable-background center">
        <div className="sample-grid">
          <div className="animated-scene">
            <img src="/img/samples/sample1.png" className="animated-card-1" alt="" />
          </div>
          <div className="vertical-center">
            <h1 className="padding margin-bottom">选择一个牌框</h1>
            <h3 className="padding margin-bottom">
              Card Conjurer 提供了探险、发明、展示框等多种牌框。{' '}
              <Link href={ROUTES.creator.path}>查看更多</Link>!
            </h3>
          </div>
        </div>
      </div>

      <div className="layer center">
        <div className="sample-grid right">
          <div className="vertical-center">
            <h1 className="padding margin-bottom">自定义到你心满意足</h1>
            <h3 className="padding margin-bottom">
              Card Conjurer 提供了多种自定义选项，让你可以设计出你梦想中的卡片。{' '}
              <Link href={ROUTES.creator.path}>试试看</Link>!
            </h3>
          </div>
          <div className="animated-scene">
            <img
              src="/img/samples/sample2.png"
              className="animated-card-1 animation-delay-2"
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="layer readable-background center">
        <div className="sample-grid">
          <div className="animated-scene">
            <img
              src="/img/samples/sample3.png"
              className="animated-card-1 animation-delay-4"
              alt=""
            />
          </div>
          <div className="vertical-center">
            <h1 className="padding margin-bottom">为你喜欢的卡牌增添光彩</h1>
            <h3 className="padding margin-bottom">
              轻松导入现有卡片的必要信息，然后重新设计它们。
              <Link href={ROUTES.creator.path}>试试看</Link>!
            </h3>
          </div>
        </div>
      </div>

      <div className="layer center">
        <h1 className="margin-bottom">准备好了吗？</h1>
        <Link href={ROUTES.creator.path}>
          <h1>开始</h1>
        </Link>
      </div>
    </article>
  );
}
