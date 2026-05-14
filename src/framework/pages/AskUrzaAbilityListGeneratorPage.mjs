import { askUrzaAbilityGeneratorScript } from '../data/ask-urza-ability-generator-scripts.mjs';
import { html } from '../html.mjs';

export function AskUrzaAbilityListGeneratorPage({ variant = 'download' }) {
  return html`
    <html>
      <head>
        <title>Ask Scryfall - Ability List Generator</title>
      </head>
      <body></body>
      <script dangerouslySetInnerHTML=${{ __html: askUrzaAbilityGeneratorScript(variant) }}></script>
    </html>
  `;
}

export function AskUrzaAbilityListGeneratorDownloadPage() {
  return html`<${AskUrzaAbilityListGeneratorPage} variant="download" />`;
}

export function AskUrzaAbilityListGeneratorWindowOpenPage() {
  return html`<${AskUrzaAbilityListGeneratorPage} variant="window-open" />`;
}
