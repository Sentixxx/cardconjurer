import { html } from '../../html.mjs';
import {
  frameAddButtons,
  frameExtraAddButtons,
  frameGroupOptions,
} from '../../data/creator/frame-options.mjs';
import {
  CreatorCheckbox,
  FrameAddButton,
  OptionList,
} from './CreatorControls.mjs';
import { ImageUploadGrid } from './CreatorUploadControls.mjs';

export function FrameBrowserSection() {
  return html`
    <div class="readable-background margin-bottom padding">
      <h5 class="margin-bottom padding input-description">
        选择一个牌框组和一个牌框包，或者输入搜索。然后你可以加载选中的牌框版本（加载牌框版本配置文本位置、卡图大小等...）
      </h5>
      <div class="input-grid margin-bottom">
        <select
          id="selectFrameGroup"
          onchange='loadScript("/js/frames/group" + this.value + ".js")'
          class="input"
          aria-label="Select Frame Group"
        >
          <${OptionList} options=${frameGroupOptions} />
        </select>
        <select
          id="selectFramePack"
          onchange='loadScript("/js/frames/pack" + this.value + ".js")'
          class="input"
          aria-label="Select Frame Pack"
        ></select>
        <div class="autocomplete">
          <input id="frameSearch" onchange="frameSearch(this.value)" type="text" class="input" placeholder="Search Frames..." />
        </div>
      </div>
      <div class="input-grid margin-bottom">
        <button id="loadFrameVersion" class="input">加载牌框版本</button>
      </div>
      <h5 class="input-description margin-bottom">自动加载牌框版本当加载牌框包时</h5>
      <label class="checkbox-container input">
        自动加载
        <input id="autoLoadFrameVersion" type="checkbox" onchange="autoLoadFrameVersion();" checked />
        <span class="checkmark"></span>
      </label>
    </div>
  `;
}

export function FramePickerSection() {
  return html`
    <div class="readable-background margin-bottom padding">
      <h5 class="margin-bottom padding input-description">选择一个牌框图像和一个蒙版，然后将其添加到你的卡片上</h5>
      <div class="split-grid margin-bottom">
        <div id="frame-picker" class="frame-picker"></div>
        <div id="mask-picker" class="mask-picker"></div>
      </div>
      <div class="input-grid margin-bottom">
        ${frameAddButtons.map((button) => html`<${FrameAddButton} button=${button} />`)}
      </div>
      <h5 class="collapsible collapsed padding input-description" onclick="toggleCollapse(event);">更多选项</h5>
      <div>
        <div class="input-grid margin-bottom">
          ${frameExtraAddButtons.map((button) => html`<${FrameAddButton} button=${button} />`)}
        </div>
        <h5 class="padding input-description">
          现在可以双击牌框和蒙版来将它们添加到卡片上。你可以按住shift、control或alt键来添加到右半部分、左半部分或中间三分之一，分别。
        </h5>
      </div>
      <h5 id="selectedPreview" class="padding input-description">(已选: 白色牌框, 无蒙版)</h5>
    </div>
  `;
}

export function FrameListSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="margin-bottom padding input-description">拖动重新排序牌框图像</h5>
      <div id="frame-list" class="frame-list margin-bottom"></div>
      <h5 class="padding input-description">你也可以点击编辑透明度、位置、大小等</h5>
    </div>
  `;
}

export function FrameUploadSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="margin-bottom padding input-description">上传自定义牌框图像</h5>
      <${ImageUploadGrid}
        className="input-grid"
        drop=${{
          oninput: 'uploadFiles(event.target.files, uploadFrameOption);',
          dropFunction: 'uploadFrameOption',
        }}
        url=${{
          onchange: 'imageURL(this.value, uploadFrameOption);',
        }}
      />
    </div>
  `;
}

export function FrameOutputOptionsSection() {
  return html`
    <div class="readable-background padding">
      <h5 class="input-description margin-bottom">圆角（当下载时）</h5>
      <label class="checkbox-container input margin-bottom">
        圆角
        <input id="rounded-corners" checked="true" type="checkbox" onchange="setRoundedCorners(this.checked);" />
        <span class="checkmark"></span>
      </label>
      <h5 class="input-description margin-bottom">显示文本、卡图、水印和系列图标的指示线</h5>
      <${CreatorCheckbox}
        className="checkbox-container input margin-bottom"
        label="指示线"
        id="show-guidelines"
        onchange="drawCard();"
      />
      <h5 class="input-description margin-bottom">突出显示卡片中的透明度</h5>
      <${CreatorCheckbox}
        className="checkbox-container input"
        label="透明度"
        id="highlight-transparencies"
        onchange="toggleCardBackgroundColor(this.checked);"
      />
    </div>
  `;
}
