import fsp from 'node:fs/promises';
import * as parse5 from 'parse5';
import { galleryDataFromHtml, gallerySections } from '../../src/framework/data/gallery-data.mjs';

function hasClass(node, className) {
  const classAttribute = (node.attrs || []).find((attribute) => attribute.name === 'class');
  return classAttribute?.value.split(/\s+/).includes(className) || false;
}

function attribute(node, name) {
  return (node.attrs || []).find((candidate) => candidate.name === name)?.value || '';
}

function textContent(node) {
  if (node.nodeName === '#text') {
    return node.value || '';
  }

  return (node.childNodes || []).map(textContent).join('');
}

function findAll(node, predicate, results = []) {
  if (predicate(node)) {
    results.push(node);
  }

  for (const child of node.childNodes || []) {
    findAll(child, predicate, results);
  }

  return results;
}

function firstDescendant(node, predicate) {
  return findAll(node, predicate, [])[0] || null;
}

function renderedGalleryData(html) {
  const fragment = parse5.parseFragment(html);

  return gallerySections.map((section) => {
    const grid = firstDescendant(fragment, (node) => attribute(node, 'id') === section.gridId);
    const cards = grid ? (grid.childNodes || []).filter((node) => hasClass(node, 'galleryGridItem')) : [];

    return {
      ...section,
      items: cards.map((card) => {
        const image = firstDescendant(card, (node) => node.tagName === 'img');
        const title = firstDescendant(card, (node) => node.tagName === 'h4');
        const location = firstDescendant(card, (node) => node.tagName === 'p');

        return {
          name: textContent(title).trim(),
          location: textContent(location).trim(),
          image: attribute(image, 'src').replace(/^\/?gallery\/img\//, ''),
          loading: attribute(image, 'loading'),
          decoding: attribute(image, 'decoding'),
          alt: attribute(image, 'alt'),
        };
      }),
    };
  });
}

function comparableLegacyData(html) {
  return galleryDataFromHtml(html).map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      loading: 'lazy',
      decoding: 'async',
      alt: item.name,
    })),
  }));
}

export function galleryDomEquivalent(sourceHtml, renderedHtml) {
  return JSON.stringify(comparableLegacyData(sourceHtml)) === JSON.stringify(renderedGalleryData(renderedHtml));
}

export async function galleryFilesDomEquivalent(sourcePath, renderedPath) {
  const [sourceHtml, renderedHtml] = await Promise.all([
    fsp.readFile(sourcePath, 'utf8'),
    fsp.readFile(renderedPath, 'utf8'),
  ]);

  return galleryDomEquivalent(sourceHtml, renderedHtml);
}
