import { html } from '../../html.mjs';
import { NumericEditorField } from './CreatorEditorFields.mjs';

export function TextboxEditorPopup() {
  return html`
    <div id="textbox-editor" class="textbox-editor">
      <h2 class="textbox-editor-title">文本框编辑器</h2>
      <h2 class="textbox-editor-close" onclick='this.parentElement.classList.remove("opened");'>X</h2>
      <${NumericEditorField} id="textbox-editor-x" label="X" />
      <${NumericEditorField} id="textbox-editor-y" label="Y" />
      <${NumericEditorField} id="textbox-editor-width" label="宽度" />
      <${NumericEditorField} id="textbox-editor-height" label="高度" />
    </div>
  `;
}
