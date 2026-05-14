import { legalSections } from '../data/legal-page-sections.mjs';
import { html } from '../html.mjs';

function LegalSection({ section }) {
  return html`
    <div class="readable-background layer margin-bottom-large">
      <h2 class="center margin-bottom">${section.title}</h2>
      <h5 class="padding">${section.content}</h5>
    </div>
  `;
}

export function LegalPage() {
  return html`
    <h2 class="readable-background header-extension title center margin-bottom-large">条款和条件</h2>
    <div class="main-content">
      ${legalSections.map((section) => html`<${LegalSection} section=${section} />`)}
    </div>
  `;
}
