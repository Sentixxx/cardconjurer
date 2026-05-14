import { html } from '../../html.mjs';
import {
  FrameEditorCheckboxField,
  HslAdjustmentInput,
  NumericEditorField,
} from './CreatorEditorFields.mjs';
import { ImageDropInput } from './CreatorUploadControls.mjs';

export function FrameEditorGeometrySection() {
  return html`
    <${NumericEditorField} id="frame-editor-x" label="X" />
    <${NumericEditorField} id="frame-editor-y" label="Y" />
    <${NumericEditorField} id="frame-editor-width" label="宽度" />
    <${NumericEditorField} id="frame-editor-height" label="高度" />
    <${NumericEditorField}
      id="frame-editor-opacity"
      label="透明度"
      placeholder="Opacity"
      attrs=${{ max: '100', min: '0' }}
    />
  `;
}

export function FrameEditorBlendSection() {
  return html`
    <${FrameEditorCheckboxField}
      label="擦除"
      text="擦除卡片"
      id="frame-editor-erase"
      placeholder="擦除"
    />
    <${FrameEditorCheckboxField}
      label="混合模式"
      text="保留Alpha"
      id="frame-editor-alpha"
      placeholder="保留Alpha"
    />
  `;
}

export function FrameEditorColorOverlaySection() {
  return html`
    <div>
      <label class="checkbox-container input">
        颜色叠加
        <input id="frame-editor-color-overlay-check" type="checkbox" placeholder="颜色叠加" />
        <span class="checkmark"></span>
      </label>
      <input
        id="frame-editor-color-overlay"
        class="input"
        type="color"
        placeholder="Color"
        value="#000000"
      />
    </div>
  `;
}

export function FrameEditorHslSection() {
  return html`
    <div>
      <h5 class="input-description">HSL 调整</h5>
      <${HslAdjustmentInput}
        id="frame-editor-hsl-hue-slider"
        type="range"
        min="-180"
        max="180"
        label="HSL Hue Slider"
      />
      <${HslAdjustmentInput}
        id="frame-editor-hsl-hue"
        type="number"
        min="-180"
        max="180"
        label="HSL Hue Value"
      />
      <${HslAdjustmentInput}
        id="frame-editor-hsl-saturation-slider"
        type="range"
        min="-100"
        max="100"
        label="HSL Saturation Slider"
      />
      <${HslAdjustmentInput}
        id="frame-editor-hsl-saturation"
        type="number"
        min="-100"
        max="100"
        label="HSL Saturation Value"
      />
      <${HslAdjustmentInput}
        id="frame-editor-hsl-lightness-slider"
        type="range"
        min="-100"
        max="100"
        label="HSL Lightness Slider"
      />
      <${HslAdjustmentInput}
        id="frame-editor-hsl-lightness"
        type="number"
        min="-100"
        max="100"
        label="HSL Lightness Value"
      />
    </div>
  `;
}

export function FrameEditorMaskSection() {
  return html`
    <div>
      <h5 class="input-description">选择并删除蒙版</h5>
      <select id="frame-editor-masks" class="input margin-bottom" aria-label="Frame editor masks"></select>
      <button onclick="frameElementMaskRemoved();" class="input">删除蒙版</button>
    </div>
    <${ImageDropInput}
      className="drop-area"
      label="拖放蒙版以添加"
      oninput="uploadFiles(event.target.files, uploadMaskOption);"
      dropFunction="uploadMaskOption"
    />
  `;
}
