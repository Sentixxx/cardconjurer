import { aboutParagraphs, aboutProfile } from '../data/about-page-content.mjs';
import { html } from '../html.mjs';

function AboutParagraph({ children }) {
  return html`
    <div class="layer readable-background margin-bottom-large">
      <h4 class="padding">${children}</h4>
    </div>
  `;
}

export function AboutPage() {
  return html`
    <h2 class="readable-background header-extension title center">About Me</h2>
    <div class="layer center"></div>
    <div class="layer center">
      <h1>Hello!</h1>
      <h4 dangerouslySetInnerHTML=${{ __html: aboutProfile.greetingHtml }}></h4>
    </div>
    <div class="layer center"></div>
    ${aboutParagraphs.map((paragraph) => html`<${AboutParagraph}>${paragraph}</${AboutParagraph}>`)}
    <div class="layer readable-background margin-bottom-large">
      <h4 class="padding">
        Whether you'd like to see what I'm up to in the Magic world or take a look at some of the cards I've made with Card Conjurer, please consider taking a moment to check out my Twitter
        <a style="color: #00aced;" href=${aboutProfile.twitterUrl} target="_blank">${aboutProfile.twitterHandle}</a>!
      </h4>
    </div>
  `;
}
