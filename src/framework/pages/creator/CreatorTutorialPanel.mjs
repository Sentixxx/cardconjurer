import { html } from '../../html.mjs';

export function CreatorTutorialPanel() {
  return html`
    <div class="padding readable-background margin-bottom">
      <h5 class="padding input-description">以下是使用Card Conjurer的基础教程：</h5>
    </div>
    <div class="video">
      <iframe width="560" height="315" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>
    </div>
  `;
}
