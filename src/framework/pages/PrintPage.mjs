import { html } from '../html.mjs';
import {
  PrintDownloadPanels,
  PrintInfoPanel,
  PrintSettingsPanel,
  PrintUploadPanel,
} from './print/PrintPanels.mjs';

export function PrintPage() {
  return html`
    <h2 class="readable-background header-extension title center margin-bottom-large">打印工具</h2>
    <${PrintSettingsPanel} />
    <${PrintUploadPanel} />
    <${PrintDownloadPanels} />
    <${PrintInfoPanel} />
    <script defer src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.5/jspdf.debug.js"></script>
    <script defer src="/print/print.js"></script>
  `;
}
