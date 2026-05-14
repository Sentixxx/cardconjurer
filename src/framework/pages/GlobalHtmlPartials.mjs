import render from 'preact-render-to-string';
import { html } from '../html.mjs';
import {
  DormantLegacyFooter,
  LegacyHeaderDocument,
} from './global-html/GlobalHtmlComponents.mjs';

export function renderGlobalHeaderPartial() {
  const rendered = render(html`<${LegacyHeaderDocument} />`);
  return `<!DOCTYPE html>\n${rendered.replace(/<\/body>\s*<\/html>\s*$/, '')}\n`;
}

export function renderGlobalFooterPartial() {
  const dormantFooter = render(html`<${DormantLegacyFooter} />`);
  return `\t<!--\n\t${dormantFooter}\n\t-->\n</body>\n</html>\n`;
}
