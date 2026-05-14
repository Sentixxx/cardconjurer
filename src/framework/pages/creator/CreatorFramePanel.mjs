import { html } from '../../html.mjs';
import {
  FrameBrowserSection,
  FrameListSection,
  FrameOutputOptionsSection,
  FramePickerSection,
  FrameUploadSection,
} from './CreatorFrameSections.mjs';

export function CreatorFramePanel() {
  return html`
    <${FrameBrowserSection} />
    <${FramePickerSection} />
    <${FrameListSection} />
    <${FrameUploadSection} />
    <${FrameOutputOptionsSection} />
  `;
}
