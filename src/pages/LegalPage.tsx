import type { JSX } from 'react';
import { Placeholder } from '@/components/Placeholder';

export function LegalPage(): JSX.Element {
  return (
    <>
      <Placeholder routeKey="legal" />
      <article>
        <section>
          <h2>简介</h2>
          <p>
            欢迎使用Card Conjurer。使用本网站即表示您确认已阅读、理解并同意受这些条款约束。
          </p>
        </section>
        <section>
          <h2>免责声明</h2>
          <p>
            本项目与Wizards of the Coast、Legend Story Studios或Scryfall LLC没有任何关联，也未受其赞助或认可。
            字体、法术力符号、图标、卡牌图像和相关素材归各自权利人所有。
          </p>
          <p>
            所有用户上传的材料均归原作者所有，用户需要自行确认使用权并提供适当署名。
            部分牌框素材或其中使用的元素来自社区创作者，其他内容归Card Conjurer项目所有。
          </p>
        </section>
        <section>
          <h2>使用条款</h2>
          <p>
            本服务仅供个人使用，不得用于商业目的。请勿上传您没有使用权限的艺术作品或任何非法内容。
          </p>
        </section>
        <section>
          <h2>Cookie/本地存储</h2>
          <p>
            使用本服务即表示您同意在您的设备上使用本地存储和cookie。这些数据用于保存设置、偏好以及您选择保存的卡牌。
          </p>
        </section>
        <section>
          <h2>广告</h2>
          <p>
            本项目可能展示第三方网站、产品或服务的广告和链接。我们不对第三方内容的可用性、材料或由此造成的损失负责。
          </p>
        </section>
        <section>
          <h2>责任</h2>
          <p>
            我们不对使用本服务导致的任何设备损坏、数据丢失或其他损害负责。
          </p>
        </section>
        <section>
          <h2>变更</h2>
          <p>
            我们可能随时修改这些条款。继续使用本服务即表示您同意受最新版本约束。
          </p>
        </section>
        <section>
          <h2>联系方式</h2>
          <p>
            如果您对本协议有任何问题，可以通过CardConjurerMTG@gmail.com联系。
          </p>
        </section>
      </article>
    </>
  );
}
