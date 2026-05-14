import { html } from '../../html.mjs';
import {
  extraTextboxButtons,
  manaCodeRows,
  textCodeRows,
} from '../../data/creator/text-options.mjs';
import {
  CodeReferenceGrid,
  CreatorCheckbox,
} from './CreatorControls.mjs';

export function TextAreaPickerSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="margin-bottom padding input-description">选择一个文本区域进行编辑</h5>
      <div id="text-options" class="input-grid"></div>
    </div>
  `;
}

export function TextEditorSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="margin-bottom padding input-description">输入卡片文本</h5>
      <textarea id="text-editor" class="input margin-bottom" oninput="textEdited();" aria-label="Card text editor"></textarea>
      <div class="padding input-grid">
        <button class="input" onclick="toggleTextTag('i');">斜体</button>
        <button class="input" onclick="toggleTextTag('bold');">加粗</button>
      </div>
      <h5 class="margin-bottom padding input-description">编辑选中的文本框的位置和大小</h5>
      <button class="input" onclick="textboxEditor();">编辑边界</button>
      <h5 class="margin-bottom padding input-description">调整字体大小</h5>
      <input
        id="text-editor-font-size"
        class="input"
        type="number"
        placeholder="0"
        value="0"
        step="1"
        oninput="fontSizedEdited();"
      />
    </div>
  `;
}

export function TextCodeReferenceSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <h5 class="collapsible collapsed padding input-description" onclick="toggleCollapse(event);">
        文本代码 / 法术符号代码参考
      </h5>
      <div class="padding">
        <h5 class="margin-top">文本代码:</h5>
        <${CodeReferenceGrid} className="text-codes margin-bottom padding" rows=${textCodeRows} />
        <h5>法术符号代码:</h5>
        <${CodeReferenceGrid} className="text-codes padding" rows=${manaCodeRows} />
      </div>
    </div>
  `;
}

export function ReminderTextVisibilitySection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <${CreatorCheckbox}
        className="checkbox-container input"
        label="隐藏提示文本"
        id="hide-reminder-text"
        onchange="textEdited();"
      />
    </div>
  `;
}

export function ReminderTextItalicSection() {
  return html`
    <div class="readable-background padding margin-bottom">
      <${CreatorCheckbox}
        className="checkbox-container input"
        label="自动斜体提示文本"
        id="italicize-reminder-text"
        onchange="textEdited();"
      />
    </div>
  `;
}

export function ExtraTextboxSection() {
  return html`
    <div class="readable-background padding">
      <h5 class="padding input-description">添加一个文本框到你的卡片</h5>
      <div class="padding input-grid">
        ${extraTextboxButtons.map((button) => html`
          <button class="input" onclick=${button.onclick}>${button.label}</button>
        `)}
      </div>
    </div>
  `;
}
