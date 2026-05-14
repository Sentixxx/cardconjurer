import { html } from '../../html.mjs';
import {
  artAutofitExpression,
  artPositionInputs,
} from '../../data/creator/art-options.mjs';
import {
  ArtPositionInput,
  CreatorCheckbox,
} from './CreatorControls.mjs';
import {
  ImageUploadGrid,
} from './CreatorUploadControls.mjs';

export function ArtSourceSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="margin-bottom padding input-description">选择/上传你的卡图</h5>
      <${ImageUploadGrid}
        drop=${{
          oninput: `uploadFiles(event.target.files, uploadArt, ${artAutofitExpression});`,
          dropFunction: 'uploadArt',
          otherParams: 'autoFit',
        }}
        url=${{
          onchange: `imageURL(this.value, uploadArt, ${artAutofitExpression});`,
        }}
        extra=${html`<button class="input margin-bottom" onclick="pasteArt();">Paste from clipboard</button>`}
      >
        <h5 class="input-description margin-bottom"></h5>
        <label class="checkbox-container input">
          设置卡图时自适应
          <input id="art-update-autofit" type="checkbox" onchange="setAutofit();" />
          <span class="checkmark"></span>
        </label>
      </${ImageUploadGrid}>
      <h5 class="margin-bottom padding input-description">或输入一个卡牌名称</h5>
      <input
        id="art-name"
        type="text"
        placeholder="输入卡名"
        class="input margin-bottom"
        onchange="fetchScryfallData(this.value, artFromScryfall, 'art');"
        aria-label="Enter Card Name"
      />
      <h5 class="padding margin-bottom input-description">选择一个特定的卡图</h5>
      <select
        class="input margin-bottom"
        id="art-index"
        onchange="changeArtIndex();"
        aria-label="Select specific card art"
      ></select>
      <h5 class="margin-bottom padding input-description">并注明艺术家</h5>
      <div class="input-grid">
        <input id="art-artist" type="text" class="input" oninput="artistEdited(this.value);" placeholder="艺术家" />
      </div>
    </div>
  `;
}

export function ArtPositionSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="margin-bottom padding input-description">
        位置/缩放你的卡图 (X, Y, 缩放, 旋转)<br />
        卡图现在可以视觉调整了！点击并拖动卡片上的任何位置来移动你的卡图。按住shift键进行缩放，或按住control键进行旋转。
      </h5>
      <div class="input-grid margin-bottom">
        ${artPositionInputs.map((input) => html`<${ArtPositionInput} input=${input} />`)}
      </div>
      <div class="input-grid">
        <button class="input" onclick="autoFitArt();">自动适应卡图</button>
      </div>
    </div>
  `;
}

export function ArtGrayscaleSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="input-description margin-bottom">使卡图变为灰度</h5>
      <${CreatorCheckbox}
        className="checkbox-container input"
        label="灰度"
        id="grayscale-art"
        onchange="drawCard();"
      />
    </div>
  `;
}

export function ArtClearSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="padding margin-bottom input-description">清除卡图，使其变为空白</h5>
      <button class="input margin-bottom" onclick="uploadArt(blank.src);">清除卡图</button>
    </div>
  `;
}

export function ArtGuidelinesSection() {
  return html`
    <div class="readable-background padding">
      <h5 class="input-description margin-bottom">显示文本、卡图、水印和套牌符号的指示线</h5>
      <${CreatorCheckbox}
        className="checkbox-container input"
        label="指示线"
        id="show-guidelines-2"
        onchange="drawCard();"
      />
    </div>
  `;
}
