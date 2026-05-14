import {
  askUrzaButtons,
  askUrzaDescription,
  askUrzaStyles,
} from '../data/ask-urza-page-content.mjs';
import { html } from '../html.mjs';

function AskUrzaButton({ button }) {
  return html`
    <div>
      <img class="askUrzaButton" src=${button.src} onclick=${button.onclick} />
    </div>
  `;
}

export function AskUrzaPage() {
  return html`
    <h2 class="readable-background header-extension title center margin-bottom-large">询问乌尔札 2.0</h2>
    <style dangerouslySetInnerHTML=${{ __html: askUrzaStyles }}></style>
    <div class="askUrzaGrid layer margin-bottom-large">
      <div class="urzaCard">
        <img src="/askurza/urzaBlank.png" />
      </div>
      ${askUrzaButtons.map((button) => html`<${AskUrzaButton} button=${button} />`)}
      <h3 id="askUrzaResult" class="readable-background"></h3>
    </div>
    <div class="readable-background layer margin-bottom-large">
      <h5>${askUrzaDescription}</h5>
    </div>
    <script defer src="/askurza/askUrza.js"></script>
  `;
}
