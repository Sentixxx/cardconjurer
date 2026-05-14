import {
  customCardSizeInputs,
  printCheckboxControls,
  printNumberControls,
  printSelectControls,
} from '../../data/print-page-options.mjs';
import { html } from '../../html.mjs';
import {
  PrintCheckboxControl,
  PrintNumberInput,
  PrintSelectControl,
} from './PrintControls.mjs';

export function PrintPageSizeSection() {
  return html`
    <${PrintSelectControl} control=${printSelectControls[0]} />
    <h5 class="margin-bottom padding input-description">切换纸张方向（纵向/横向）</h5>
    <button onclick="changeOrientation();" class="input margin-bottom">切换方向</button>
  `;
}

export function PrintCardSizeSection() {
  return html`
    <${PrintSelectControl} control=${printSelectControls[1]} />
    <h5 class="margin-bottom padding input-description">或输入自定义卡牌尺寸</h5>
    <div class="margin-bottom split-grid">
      ${customCardSizeInputs.map((input) => html`<${PrintNumberInput} input=${input} className="input" />`)}
    </div>
  `;
}

export function PrintLayoutSection() {
  return html`
    ${printNumberControls.map((input) => html`
      <h5 class="margin-bottom padding input-description">${input.label}</h5>
      <${PrintNumberInput} input=${input} />
    `)}
    ${printCheckboxControls.map((control) => html`<${PrintCheckboxControl} control=${control} />`)}
  `;
}

export function PrintBleedAndDefaultsSection() {
  return html`
    <h5 class="margin-bottom padding input-description">出血边缘颜色</h5>
    <input id="bleedEdgeColor" type="color" class="input margin-bottom" onchange="setBleedEdgeColor(this.value);" />
    <h5 class="margin-bottom padding input-description">将当前配置保存为默认设置</h5>
    <button onclick="saveDefaults();" class="input margin-bottom">保存配置</button>
  `;
}
