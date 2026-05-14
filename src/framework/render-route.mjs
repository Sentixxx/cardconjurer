import render from 'preact-render-to-string';
import { html } from './html.mjs';

export function renderFrameworkRoute(route) {
  if (route.render) {
    return route.render();
  }

  if (route.source === 'legacy') {
    throw new Error(`${route.outputPath} is still marked as a legacy-source route`);
  }

  const rendered = render(html`<${route.component} />`);
  return route.htmlMode === 'document' ? `<!DOCTYPE html>\n${rendered}\n` : `${rendered}\n`;
}
