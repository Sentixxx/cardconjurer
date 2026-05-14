import { html } from '../../html.mjs';
import {
  LegacyHeadPartial,
  LegacyMenuPartial,
} from './LegacyHeaderPartials.mjs';

export { DormantLegacyFooter } from './LegacyFooter.mjs';

export function LegacyHeaderDocument() {
  return html`
    <html>
      <${LegacyHeadPartial} />
      <body>
        <div class="background"></div>
        <header class="readable-background">
          <h1 class="title center">CARD CONJURER</h1>
        </header>
        <${LegacyMenuPartial} />
      </body>
    </html>
  `;
}
