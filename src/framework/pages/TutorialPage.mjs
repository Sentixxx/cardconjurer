import { guideSections } from '../data/tutorial-guide-sections.mjs';
import { html } from '../html.mjs';

function GuideSection({ section }) {
  return html`
    <div class="readable-background layer margin-bottom-large">
      <div class="tutorial-grid">
        <img src=${section.image} />
        <div>
          <h3 class="padding center margin-bottom${section.title === '牌框标签' ? '-large' : ''}">${section.title}</h3>
          ${section.blocks.map((block) => html`
            <h5 class="padding">${block.heading}</h5>
            <p class="padding margin-bottom">${block.body}</p>
          `)}
        </div>
      </div>
    </div>
  `;
}

export function TutorialPage() {
  return html`
    <div class="layer center">
      <h2>Written Guides</h2>
    </div>
    ${guideSections.map((section) => html`<${GuideSection} section=${section} />`)}
  `;
}
