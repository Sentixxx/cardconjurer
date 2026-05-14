import { html } from '../../html.mjs';
import {
  collectorInfoRows,
  collectorSettings,
  serialNumberInputs,
  serialPositionInputs,
} from '../../data/creator/collector-options.mjs';
import {
  CollectorInfoInput,
  CreatorCheckbox,
  SerialInput,
} from './CreatorControls.mjs';

export function CollectorInfoFieldsSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="padding margin-bottom input-description">输入卡牌编号、稀有度、系列代码、语言和艺术家名称</h5>
      ${collectorInfoRows.map((row) => html`
        <div class="padding input-grid">
          ${row.map((input) => html`<${CollectorInfoInput} input=${input} />`)}
        </div>
      `)}
    </div>
  `;
}

export function CollectorSettingsSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="input-description margin-bottom">收藏信息设置</h5>
      ${collectorSettings.map((setting) => html`
        <${CreatorCheckbox}
          className="checkbox-container input margin-bottom"
          label=${setting.label}
          id=${setting.id}
          onchange=${setting.onchange}
        />
        ${setting.id === 'enableWebsiteInfo' && html`
          <div id="extra-info-container" class="padding input-grid" style="display:none">
            <input
              id="extra-info"
              type="text"
              class="input"
              oninput="bottomInfoEdited();"
              placeholder="额外信息"
              value="card.sentixx.top"
            />
          </div>
        `}
      `)}
    </div>
  `;
}

export function CollectorStyleSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="input-description margin-bottom">收藏信息样式</h5>
      <${CreatorCheckbox}
        className="checkbox-container input margin-bottom"
        label="使用新的（后ONE）收藏信息样式"
        id="enableNewCollectorStyle"
        onchange="enableNewCollectorInfoStyle();"
      />
    </div>
  `;
}

export function CollectorVisibilitySection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="input-description margin-bottom">显示收藏信息</h5>
      <${CreatorCheckbox}
        className="checkbox-container input margin-bottom"
        label="显示收藏信息（取消选中以隐藏）"
        id="enableCollectorInfo"
        onchange="enableCollectorInfo();"
      />
    </div>
  `;
}

export function SerialControlsSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="padding input-description">编号（留空以隐藏）</h5>
      <div class="padding input-grid">
        ${serialNumberInputs.map((input) => html`<${SerialInput} input=${input} />`)}
      </div>
      <h5 class="padding input-description">位置（X, Y, 缩放）</h5>
      <div class="padding input-grid">
        ${serialPositionInputs.map((input) => html`<${SerialInput} input=${input} />`)}
      </div>
      <div class="padding input-grid">
        <button class="input" onclick="resetSerial();">重置编号位置</button>
      </div>
    </div>
  `;
}

export function CollectorFinishStyleSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="input-description padding margin-bottom">在星号（在闪卡上可见）和点号（在普通卡上可见）之间切换</h5>
      <div class="padding">
        <button class="input padding" onclick="toggleStarDot();">切换星号/点号</button>
      </div>
    </div>
  `;
}

export function CollectorDefaultSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="input-description padding margin-bottom">保存当前收藏信息作为默认值</h5>
      <div class="padding">
        <button class="input padding" onclick="setDefaultCollector();">保存为默认值</button>
      </div>
      <h5 class="input-description padding margin-bottom">清除你的保存默认收藏信息</h5>
      <div class="padding">
        <button class="input padding" onclick="removeDefaultCollector();">清除保存的默认值</button>
      </div>
    </div>
  `;
}
