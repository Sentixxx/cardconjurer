import fsp from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const thisFile = fileURLToPath(import.meta.url);
const gallerySourcePath = path.resolve(path.dirname(thisFile), '..', '..', 'app', 'gallery', 'index.html');

export const gallerySections = [
  { title: 'Showcase Frames', gridId: 'showcaseGrid', templateName: 'showcaseTemplates' },
  { title: 'Promo Frames', gridId: 'promoGrid', templateName: 'promoTemplates' },
  { title: 'Textless Frames', gridId: 'textlessGrid', templateName: 'textlessTemplates' },
  { title: 'Custom Frames', gridId: 'customGrid', templateName: 'customTemplates' },
  { title: 'Regular Frames', gridId: 'regularGrid', templateName: 'regularTemplates' },
  { title: 'Token Frames', gridId: 'tokenGrid', templateName: 'tokenTemplates' },
];

function extractScript(html) {
  const match = html.match(/<script>\s*([\s\S]*?)\s*<\/script>/);

  if (!match) {
    throw new Error('Gallery source is missing its inline script');
  }

  return match[1];
}

function extractTemplates(script) {
  const templates = new Map();

  for (const match of script.matchAll(/const\s+(\w+Templates)\s*=\s*(\[[\s\S]*?\]);/g)) {
    templates.set(match[1], vm.runInNewContext(match[2]));
  }

  return templates;
}

export function galleryDataFromHtml(html) {
  const templates = extractTemplates(extractScript(html));

  return gallerySections.map((section) => ({
    ...section,
    items: templates.get(section.templateName) || [],
  }));
}

export function readGalleryDataSync() {
  return galleryDataFromHtml(fs.readFileSync(gallerySourcePath, 'utf8'));
}

export async function readGalleryData() {
  return galleryDataFromHtml(await fsp.readFile(gallerySourcePath, 'utf8'));
}
