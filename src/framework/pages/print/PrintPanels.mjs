import {
  printDownloadActions,
} from '../../data/print-page-options.mjs';
import { html } from '../../html.mjs';
import {
  PrintBleedAndDefaultsSection,
  PrintCardSizeSection,
  PrintLayoutSection,
  PrintPageSizeSection,
} from './PrintSettingsSections.mjs';

export function PrintSettingsPanel() {
  return html`
    <div class="readable-background padding layer margin-bottom-large">
      <h4 class="collapsible collapsed center padding margin-bottom" onclick="toggleCollapse(event);">配置页面设置</h4>
      <div>
        <${PrintPageSizeSection} />
        <${PrintCardSizeSection} />
        <${PrintLayoutSection} />
        <${PrintBleedAndDefaultsSection} />
      </div>
    </div>
  `;
}

export function PrintUploadPanel() {
  return html`
    <div class="layer margin-bottom-large">
      <div class="drop-area" style="padding: 1rem">
        <div class="padding margin-bottom-large readable-background">
          <h5 class="margin-bottom padding input-description">上传您想打印的图片，或直接拖放文件</h5>
          <input
            type="file"
            multiple
            accept=".png, .svg, .jpg, .jpeg, .bmp, .webp"
            placeholder="文件上传"
            class="input"
            oninput='uploadFiles(event.target.files, uploadCard, "filename");'
            data-dropFunction="uploadCard"
            data-otherParams="filename"
          />
        </div>
        <div class="center">
          <canvas style="height: auto; max-width:850px; width: 100%; background: #fff;"></canvas>
        </div>
      </div>
    </div>
  `;
}

export function PrintDownloadPanels() {
  return html`
    ${printDownloadActions.map((action) => html`
      <div class="readable-background padding layer margin-bottom-large">
        <h3 class="download padding" onclick=${action.onclick}>${action.label}</h3>
        <h4 class="padding center">${action.note}</h4>
      </div>
    `)}
  `;
}

export function PrintInfoPanel() {
  return html`
    <div class="readable-background layer margin-bottom-large">
      <h3 class="padding margin-bottom center">想在餐桌上看到您的自制卡牌吗？</h3>
      <h4 class="padding">
        上传最多九张图片，它们将自动排列在8.5" x 11"的打印页面上，这样您就可以在家用最高600PPI的分辨率打印它们。
      </h4>
    </div>
  `;
}
