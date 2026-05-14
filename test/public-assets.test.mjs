import assert from 'node:assert/strict';
import fsp from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { roots, toNativePath } from '../scripts/lib/project.mjs';
import { pathExists, walkFiles } from '../scripts/lib/fs.mjs';

const referencePattern = /\b(?:src|href|hx-get)=["']([^"'#]+)["']/gi;
const cssUrlPattern = /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi;
const ignoredSchemes = /^(?:https?:|mailto:|tel:|data:|javascript:)/i;

function stripComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function publicPathForReference(htmlPath, reference) {
  if (ignoredSchemes.test(reference) || reference.startsWith('{') || reference.includes('{{')) {
    return null;
  }

  const withoutQuery = reference.split(/[?#]/, 1)[0];

  if (!withoutQuery || withoutQuery === '.') {
    return null;
  }

  if (withoutQuery.startsWith('/')) {
    return withoutQuery.slice(1);
  }

  return path.posix.normalize(path.posix.join(path.posix.dirname(htmlPath), withoutQuery));
}

async function publicPathExists(publicPath) {
  const target = path.join(roots.dist, toNativePath(publicPath));

  if (await pathExists(target)) {
    const stat = await fsp.stat(target);
    return stat.isDirectory() ? pathExists(path.join(target, 'index.html')) : true;
  }

  if (!path.extname(publicPath)) {
    return pathExists(path.join(target, 'index.html'));
  }

  return false;
}

test('built HTML local references resolve inside dist', async () => {
  const htmlFiles = (await walkFiles(roots.dist)).filter((file) => file.endsWith('.html'));
  const missing = [];

  for (const htmlFile of htmlFiles) {
    const html = stripComments(await fsp.readFile(path.join(roots.dist, toNativePath(htmlFile)), 'utf8'));

    for (const match of html.matchAll(referencePattern)) {
      const publicPath = publicPathForReference(htmlFile, match[1]);

      if (publicPath && !(await publicPathExists(publicPath))) {
        missing.push(`${htmlFile} -> ${match[1]} (${publicPath})`);
      }
    }
  }

  assert.deepEqual(missing, []);
});

test('built CSS local url references resolve inside dist', async () => {
  const cssFiles = (await walkFiles(roots.dist)).filter((file) => file.endsWith('.css'));
  const missing = [];

  for (const cssFile of cssFiles) {
    const css = stripCssComments(await fsp.readFile(path.join(roots.dist, toNativePath(cssFile)), 'utf8'));

    for (const match of css.matchAll(cssUrlPattern)) {
      const publicPath = publicPathForReference(cssFile, match[2].trim());

      if (publicPath && !(await publicPathExists(publicPath))) {
        missing.push(`${cssFile} -> ${match[2]} (${publicPath})`);
      }
    }
  }

  assert.deepEqual(missing, []);
});
