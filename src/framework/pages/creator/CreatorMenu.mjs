import { html } from '../../html.mjs';
import {
  AutoFrameControls,
  CreatorMenuSections,
  CreatorMenuTabs,
  DownloadControls,
} from './CreatorMenuSections.mjs';

export function CreatorMenu({ panels }) {
  return html`
    <div class="creator-menu box-shadow">
      <${CreatorMenuTabs} />
      <${CreatorMenuSections} panels=${panels} />
      <div class="readable-background padding margin-bottom">
        <${AutoFrameControls} />
      </div>
      <div class="readable-background padding">
        <${DownloadControls} />
      </div>
    </div>
  `;
}
