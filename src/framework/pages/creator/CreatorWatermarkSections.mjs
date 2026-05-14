import { html } from '../../html.mjs';
import {
  loreWatermarkOptions,
  watermarkLeftColorOptions,
  watermarkPositionInputs,
  watermarkRightColorOptions,
} from '../../data/creator/watermark-options.mjs';
import {
  OptionList,
  WatermarkPositionInput,
} from './CreatorControls.mjs';
import {
  ImageUploadGrid,
} from './CreatorUploadControls.mjs';

export function WatermarkSourceSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="margin-bottom padding input-description">选择/上传你的水印</h5>
      <${ImageUploadGrid}
        className="input-grid"
        drop=${{
          oninput: 'uploadFiles(event.target.files, uploadWatermark, "resetWatermark");',
          dropFunction: 'uploadWatermark',
          otherParams: 'resetWatermark',
        }}
        url=${{
          className: 'input margin-bottom',
          onchange: 'imageURL(this.value, uploadWatermark, "resetWatermark");',
        }}
      >
        <input
          type="text"
          placeholder="Via Set Code"
          class="input"
          onchange="getSetSymbolWatermark(this.value);"
        />
      </${ImageUploadGrid}>
      <h5 class="margin-bottom padding input-description">选择基于lore的水印</h5>
      <select
        class="input padding margin-bottom"
        onchange="getSetSymbolWatermark(fixUri(this.value));"
        aria-label="Select lore-based watermarks"
      >
        <${OptionList} options=${loreWatermarkOptions} />
      </select>
      <h5 class="collapsible collapsed padding input-description" onclick="toggleCollapse(event);">
        如何找到系列代码
      </h5>
      <div class="padding">
        <h5 class="margin-top">系列代码是代表系列的两个或三个字符组合。对于2015年之后发布的系列，可以在左下角找到三字符系列代码。</h5>
        <h5 class="margin-top">对于较早的系列，代码可能因使用情况而有所不同：</h5>
        <p class="margin-top padding">
          系列图标图像使用与<a class="underline" href="https://scryfall.com/sets" target="_blank" rel="noopener">Scryfall</a>相同的代码命名。
        </p>
        <p class="padding">
          对于水印，请参考<a class="underline" href="https://keyrune.andrewgioia.com/icons.html" target="_blank" rel="noopener">Keyrune</a>。
        </p>
      </div>
    </div>
  `;
}

export function WatermarkColorSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="margin-bottom padding input-description">选择水印颜色（左，右）</h5>
      <div class="input-grid margin-bottom">
        <select class="input" id="watermark-left" onchange="watermarkLeftColor(this.value);" aria-label="Watermark left color">
          <${OptionList} options=${watermarkLeftColorOptions} />
        </select>
        <select class="input" id="watermark-right" onchange="watermarkRightColor(this.value);" aria-label="Watermark right color">
          <${OptionList} options=${watermarkRightColorOptions} />
        </select>
      </div>
      <h5 class="margin-bottom padding input-description">或者手动选择（左，右）</h5>
      <div class="input-grid margin-bottom">
        <input class="input" type="color" placeholder="Color" value="#000000" onchange="watermarkLeftColor(this.value);" />
        <input class="input" type="color" placeholder="Color" value="#000000" onchange="watermarkRightColor(this.value);" />
      </div>
      <h5 class="margin-bottom padding input-description">并输入一个不透明度</h5>
      <div class="input-grid margin-bottom">
        <input
          id="watermark-opacity"
          type="number"
          class="input"
          oninput="watermarkEdited();"
          value="40"
          step="1"
          min="0"
          max="100"
          aria-label="Watermark opacity"
        />
      </div>
    </div>
  `;
}

export function WatermarkPositionSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="margin-bottom padding input-description">位置/缩放你的水印 (X, Y, 缩放)</h5>
      <div class="input-grid margin-bottom">
        ${watermarkPositionInputs.map((input) => html`<${WatermarkPositionInput} input=${input} />`)}
      </div>
      <div class="input-grid">
        <button class="input" onclick="resetWatermark();">重置水印</button>
      </div>
    </div>
  `;
}

export function WatermarkClearSection() {
  return html`
    <div class="readable-background padding">
      <h5 class="padding margin-bottom input-description">清除水印，使其变为空白</h5>
      <button class="input margin-bottom" onclick="uploadWatermark(blank.src);">去除水印</button>
    </div>
  `;
}
