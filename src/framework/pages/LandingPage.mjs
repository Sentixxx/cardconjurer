import { AppShell } from '../components/AppShell.mjs';
import { landingSampleSections } from '../data/landing-page-sections.mjs';
import { html } from '../html.mjs';

function HtmxCreatorLink({ children }) {
  return html`<a href="#" hx-get="creator" hx-target="#content" hx-trigger="click">${children}</a>`;
}

function landingSampleImageMarkup(image) {
  if (image.fetchpriority) {
    return `<img src="${image.src}" decoding="${image.decoding}" fetchpriority="${image.fetchpriority}" class="${image.className}" />`;
  }

  return `<img src="${image.src}" loading="${image.loading}" decoding="${image.decoding}" class="${image.className}" />`;
}

function LandingSampleImage({ image }) {
  return html`
    <div class="animated-scene" dangerouslySetInnerHTML=${{ __html: landingSampleImageMarkup(image) }}></div>
  `;
}

function LandingSampleCopy({ section }) {
  return html`
    <div class="vertical-center">
      <h1 class="padding margin-bottom">${section.title}</h1>
      <h3 class="padding margin-bottom">
        ${section.description}
        <${HtmxCreatorLink}>${section.linkText}</${HtmxCreatorLink}>!
      </h3>
    </div>
  `;
}

function LandingSampleSection({ section }) {
  const image = html`<${LandingSampleImage} image=${section.image} />`;
  const copy = html`<${LandingSampleCopy} section=${section} />`;

  return html`
    <div class=${section.layerClass}>
      <div class=${section.gridClass}>
        ${section.imageSide === 'right' ? html`${copy}${image}` : html`${image}${copy}`}
      </div>
    </div>
  `;
}

export function LandingPage() {
  return html`
    <${AppShell}>
      <div id="content">
        <div class="layer center"></div>
        <div class="layer center">
          <h1>欢迎来到Card Conjurer</h1>
          <h3>一个定制的万智牌制卡器</h3>
        </div>
        <div class="layer center"></div>
        ${landingSampleSections.map((section) => html`<${LandingSampleSection} section=${section} />`)}
        <div class="layer center">
          <h1 class="margin-bottom">准备好了吗？</h1>
          <${HtmxCreatorLink}><h1>开始</h1></${HtmxCreatorLink}>
        </div>
      </div>
    </${AppShell}>
  `;
}
