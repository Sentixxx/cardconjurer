import type { JSX } from 'react';
import { Placeholder } from '@/components/Placeholder';

export function TutorialPage(): JSX.Element {
  return (
    <>
      <Placeholder routeKey="tutorial" description="Brief guide to the Card Conjurer workflow (full editor port is in progress)." />
      <article>
        <section>
          <h2>牌框标签 (Frame tab)</h2>
          <h3>牌框组和牌框包</h3>
          <p>
            下拉菜单用于浏览边框包：左侧的"边框组"将边框包整理成大致分类，右侧的"边框包"包含用于制作卡牌的实际
            图像与设置。
          </p>
          <h3>加载牌框版本</h3>
          <p>
            点击"加载牌框版本"或勾选"自动加载"时，会设置与当前边框包相关的布局（文本框位置、艺术位置等）。
            若需要混合不同边框包的图像，建议取消勾选自动加载，手动按需切换。
          </p>
          <h3>添加图像</h3>
          <p>
            选定一个边框图像（左侧）和一个图像蒙版（右侧）后，点击"添加边框到卡牌"。图像蒙版决定显示图像的
            哪个部分，适合制作多色或彩色神器等卡。
          </p>
        </section>
        <section>
          <h2>文本标签 (Text tab)</h2>
          <h3>选择文本框</h3>
          <p>根据当前加载的牌框版本，可点击任一文本框输入卡牌文本。</p>
          <h3>文本代码</h3>
          <p>
            使用大括号包围的文本代码（例如 <code>{'{w}'}</code>、<code>{'{flavor}'}</code>）可显示法术力符号、
            切换字体等。完整列表见编辑器底部的"文本代码参考"。
          </p>
          <h3>编辑边界</h3>
          <p>"输入卡牌文本"下方的"编辑边界"按钮可打开文本框编辑器，调整当前文本框的大小与位置。</p>
        </section>
        <section>
          <h2>当前迁移状态</h2>
          <p>
            Card Forger 的 React 版本目前提供：可视化预览、JSON 导入/导出、PNG 导出、Art URL 加载、Frame 版本目录、
            主题切换、本地存储与 Gallery 列表。完整的帧图叠加、文本代码、多面牌等高级功能仍在迁移中 —
            详见 <code>REFRACTOR_STATE.md</code>。
          </p>
        </section>
      </article>
    </>
  );
}
