import { html } from '../../html.mjs';
import {
  FrameEditorBlendSection,
  FrameEditorColorOverlaySection,
  FrameEditorGeometrySection,
  FrameEditorHslSection,
  FrameEditorMaskSection,
} from './CreatorFrameElementEditorSections.mjs';

export function FrameElementEditorPopup() {
  return html`
    <div id="frame-element-editor" class="frame-element-editor">
      <h2 class="frame-element-editor-title">牌框图像编辑器</h2>
      <h2 class="frame-element-editor-close" onclick='this.parentElement.classList.remove("opened");'>X</h2>
      <${FrameEditorGeometrySection} />
      <${FrameEditorBlendSection} />
      <${FrameEditorColorOverlaySection} />
      <${FrameEditorHslSection} />
      <${FrameEditorMaskSection} />
    </div>
  `;
}
