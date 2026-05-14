import { html } from '../../html.mjs';
import {
  setSymbolPositionInputs,
  setSymbolSources,
} from '../../data/creator/set-symbol-options.mjs';
import {
  CreatorCheckbox,
  OptionList,
  SetSymbolPositionInput,
} from './CreatorControls.mjs';
import {
  ImageUploadGrid,
} from './CreatorUploadControls.mjs';

export function SetSymbolSourceSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="margin-bottom padding input-description">选择/上传你的系列图标</h5>
      <${ImageUploadGrid}
        drop=${{
          oninput: 'uploadFiles(event.target.files, uploadSetSymbol, "resetSetSymbol");',
          dropFunction: 'uploadSetSymbol',
          otherParams: 'resetSetSymbol',
        }}
        url=${{
          onchange: 'imageURL(this.value, uploadSetSymbol, "resetSetSymbol");',
        }}
      />
      <h5 class="margin-bottom padding input-description">或输入一个系列代码/稀有度</h5>
      <div class="input-grid margin-bottom">
        <input id="set-symbol-code" type="text" placeholder="系列代码" class="input" onchange="fetchSetSymbol();" />
        <input id="set-symbol-rarity" type="text" placeholder="稀有度" class="input" onchange="fetchSetSymbol();" />
      </div>
      <h5 class="margin-bottom padding input-description">从以下位置加载系列图标：</h5>
      <div class="input-grid margin-bottom">
        <select id="set-symbol-source" class="input" onchange="fetchSetSymbol();" aria-label="Set symbol source">
          <${OptionList} options=${setSymbolSources} />
        </select>
      </div>
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

export function SetSymbolPositionSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="margin-bottom padding input-description">位置/缩放你的系列图标 (X, Y, 缩放)</h5>
      <div class="input-grid margin-bottom">
        ${setSymbolPositionInputs.map((input) => html`<${SetSymbolPositionInput} input=${input} />`)}
      </div>
      <div class="input-grid">
        <button class="input" onclick="resetSetSymbol();">重置系列图标</button>
      </div>
    </div>
  `;
}

export function SetSymbolClearSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="padding margin-bottom input-description">清除系列图标，使其变为空白</h5>
      <button class="input margin-bottom" onclick="uploadSetSymbol(blank.src);">清除系列图标</button>
    </div>
  `;
}

export function SetSymbolDragTargetSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="input-description margin-bottom">Click and drag to move set symbol instead of art (hold shift to zoom)</h5>
      <${CreatorCheckbox}
        className="checkbox-container input margin-bottom"
        label="Click and drag to move set symbol instead of art"
        id="drag-target-setSymbol"
      />
    </div>
  `;
}

export function SetSymbolLockSection() {
  return html`
    <div class="readable-background padding">
      <h5 class="input-description margin-bottom">锁定系列代码（在重新加载时保存）</h5>
      <${CreatorCheckbox}
        className="checkbox-container input margin-bottom"
        label="锁定系列代码"
        id="lockSetSymbolCode"
        onchange="lockSetSymbolCode();"
      />
      <h5 class="input-description margin-bottom">锁定系列图标URL（在重新加载时保存）</h5>
      <${CreatorCheckbox}
        className="checkbox-container input"
        label="锁定系列图标URL"
        id="lockSetSymbolURL"
        onchange="lockSetSymbolURL();"
      />
    </div>
  `;
}
