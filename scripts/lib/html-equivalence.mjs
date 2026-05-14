import fsp from 'node:fs/promises';
import * as parse5 from 'parse5';

function normalizeText(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function normalizeRawText(value) {
  return value.replace(/\r\n?/g, '\n').trim();
}

function canonicalAttributes(attrs = []) {
  return attrs
    .map((attribute) => [attribute.name, normalizeText(attribute.value)])
    .sort(([left], [right]) => left.localeCompare(right, 'en'));
}

function canonicalNode(node, parentTagName = null) {
  if (node.nodeName === '#comment' || node.nodeName === '#documentType') {
    return null;
  }

  if (node.nodeName === '#text') {
    const text = parentTagName === 'script' ? normalizeRawText(node.value || '') : normalizeText(node.value || '');
    return text ? ['#text', text] : null;
  }

  const children = (node.childNodes || []).map((child) => canonicalNode(child, node.tagName)).filter(Boolean);

  if (node.tagName) {
    return [node.tagName, canonicalAttributes(node.attrs), children];
  }

  return children;
}

export function canonicalHtml(html, mode = 'fragment') {
  const parsed = mode === 'document' ? parse5.parse(html) : parse5.parseFragment(html);
  return canonicalNode(parsed);
}

export async function htmlFilesEquivalent(leftPath, rightPath, mode = 'fragment') {
  const [left, right] = await Promise.all([
    fsp.readFile(leftPath, 'utf8'),
    fsp.readFile(rightPath, 'utf8'),
  ]);

  return JSON.stringify(canonicalHtml(left, mode)) === JSON.stringify(canonicalHtml(right, mode));
}
