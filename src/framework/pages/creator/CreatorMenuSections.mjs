import { h } from 'preact';
import { html } from '../../html.mjs';
import {
  autoFrameOptions,
  creatorTabs,
} from '../../data/creator/creator-menu-options.mjs';
import { OptionList } from './CreatorControls.mjs';

export function CreatorMenuTabs() {
  return html`
    <div id="creator-menu-tabs" class="creator-menu-tabs">
      ${creatorTabs.map((tab) => html`
        <h3
          class=${`selectable readable-background${tab.selected ? ' selected' : ''}`}
          onclick=${`toggleCreatorTabs(event, "${tab.target}")${tab.afterToggle ? `; ${tab.afterToggle}` : ''}`}
        >
          ${tab.label}
        </h3>
      `)}
    </div>
  `;
}

export function CreatorMenuSections({ panels }) {
  return html`
    <div id="creator-menu-sections" class="margin-bottom">
      ${panels.map((panel) => html`<${CreatorPanel} panel=${panel} />`)}
    </div>
  `;
}

function CreatorPanel({ panel }) {
  const attrs = {
    id: panel.id,
    ...(panel.hidden ? { class: 'hidden' } : {}),
  };

  if (panel.component) {
    return h('div', attrs, h(panel.component));
  }
}

export function AutoFrameControls() {
  return html`
    <h5 class="padding input-description">自动更新牌框</h5>
    <div class="padding input-grid">
      <select id="autoFrame" class="input" onchange="setAutoFrame()" aria-label="Automatically update frame">
        <${OptionList} options=${autoFrameOptions} />
      </select>
    </div>
    <div class="padding input-grid">
      <label class="checkbox-container input">
        使用星彩牌框（适用于所有结界）
        <input id="autoframe-always-nyx" type="checkbox" onchange="setAutoframeNyx(this.checked);" />
        <span class="checkmark"></span>
      </label>
    </div>
  `;
}

export function DownloadControls() {
  return html`
    <h3 class="download padding" onclick="downloadCard();">下载您的卡片</h3>
    <h5
      onclick="downloadCard(false, true);"
      id="downloadJpg"
      href=""
      target="_blank"
      class="padding download input-description"
    >
      点击这里下载为JPEG
    </h5>
    <h5
      onclick="downloadCard(true);"
      id="downloadAlt"
      href=""
      target="_blank"
      class="padding download input-description"
    >
      点击这里获取备用下载
    </h5>
  `;
}
