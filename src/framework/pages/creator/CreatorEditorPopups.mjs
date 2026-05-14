import { html } from '../../html.mjs';
import { FrameElementEditorPopup } from './CreatorFrameElementEditorPopup.mjs';
import { TextboxEditorPopup } from './CreatorTextboxEditorPopup.mjs';

export function CreatorEditorPopups() {
  return html`
    <${FrameElementEditorPopup} />
    <${TextboxEditorPopup} />
  `;
}
