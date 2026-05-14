import assert from 'node:assert/strict';
import fsp from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { repoRoot } from '../scripts/lib/project.mjs';

async function readAppFile(relativePath) {
  return fsp.readFile(path.join(repoRoot, 'src', 'app', ...relativePath.split('/')), 'utf8');
}

async function readDistFile(relativePath) {
  return fsp.readFile(path.join(repoRoot, 'dist', ...relativePath.split('/')), 'utf8');
}

function fontUrls(css) {
  return [...css.matchAll(/url\((['"]?)([^'")]+)\1\)/g)]
    .map((match) => match[2])
    .filter((url) => url.includes('/fonts/') || url.includes('../fonts/'));
}

function publicAssetPath(cssPublicPath, url) {
  if (url.startsWith('/')) {
    return url.slice(1);
  }

  return path.posix.normalize(path.posix.join(path.posix.dirname(cssPublicPath), url));
}

test('landing page avoids startup-only blocking scripts', async () => {
  const html = await readDistFile('index.html');

  assert.doesNotMatch(html, /sql-wasm\.js/);
  assert.match(html, /<script\s+defer\s+src=["']js\/themes\.js["']><\/script>/);
  assert.match(html, /<script\s+defer\s+src=["']js\/htmx\.min\.js["']><\/script>/);
});

test('landing page decodes below-fold samples asynchronously', async () => {
  const html = await readDistFile('index.html');

  assert.match(html, /<img\s+src=["']img\/samples\/sample2\.png["']\s+loading=["']lazy["']\s+decoding=["']async["']/);
  assert.match(html, /<img\s+src=["']img\/samples\/sample3\.png["']\s+loading=["']lazy["']\s+decoding=["']async["']/);
});

test('gallery thumbnails use native lazy loading instead of eager image preloads', async () => {
  const html = await readAppFile('gallery/index.html');
  const templateSample = html.slice(html.indexOf('templateSample ='), html.indexOf('populateGroup ='));

  assert.doesNotMatch(templateSample, /new Image\(\)/);
  assert.match(templateSample, /img\.loading = "lazy"/);
  assert.match(templateSample, /img\.decoding = "async"/);
});

test('local card database loader lazy-loads and caches sql.js', async () => {
  const creator = await readAppFile('js/creator-23.js');

  assert.match(creator, /function loadExternalScriptOnce/);
  assert.match(creator, /let dbPromise = null;/);
  assert.match(creator, /if \(typeof initSqlJs === 'undefined'\)/);
  assert.match(creator, /sqlJsLoaderPromise = loadExternalScriptOnce/);
});

test('creator lazy-loads JSZip only for bulk downloads', async () => {
  const creator = await readAppFile('js/creator-23.js');

  assert.doesNotMatch(creator, /loadScript\('https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/jszip/);
  assert.match(creator, /const jsZipScriptUrl = 'https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/jszip\/3\.10\.1\/jszip\.min\.js';/);
  assert.match(creator, /await loadExternalScriptOnce\(jsZipScriptUrl\)/);
});

test('declared font files resolve to migrated resources', async () => {
  const stylesheets = [
    ['css/style-9.css', await readAppFile('css/style-9.css')],
    ['data/styles/main.css', await readAppFile('data/styles/main.css')],
  ];

  for (const [cssPublicPath, css] of stylesheets) {
    for (const url of fontUrls(css)) {
      const publicPath = publicAssetPath(cssPublicPath, url);
      const fontPath = path.join(repoRoot, 'resources', ...publicPath.split('/'));
      await assert.doesNotReject(
        () => fsp.access(fontPath),
        `${cssPublicPath} references missing font ${url} -> ${publicPath}`,
      );
    }
  }
});

test('font faces use non-blocking display and creator does not preload bulk fonts', async () => {
  const css = await readAppFile('css/style-9.css');
  const creator = await readAppFile('creator/index.html');
  const fontFaceBlocks = css.match(/@font-face\s*{[^}]+}/g) || [];

  assert.ok(fontFaceBlocks.length > 0);
  assert.equal(fontFaceBlocks.every((block) => block.includes('font-display: swap;')), true);
  assert.doesNotMatch(creator, /rel="preload"[^>]+as="font"/);
});

test('canvas text rendering waits for actual fonts before drawing', async () => {
  const creatorSource = await readAppFile('js/creator-23.js');
  const creatorDist = await readDistFile('js/creator-23.js');

  assert.match(creatorDist, /function fontLoadDeclaration/);
  assert.match(creatorDist, /function collectTextObjectsFonts/);
  assert.match(creatorSource, /async function ensureTextFontsReady/);
  assert.match(creatorSource, /await ensureTextFontsReady\(Object\.values\(card\.text\)\)/);
  assert.match(creatorSource, /await ensureTextFontsReady\(Object\.values\(card\.bottomInfo\)\)/);
});

test('print sheet redraws avoid fixed half-second latency', async () => {
  const print = await readAppFile('print/print.js');

  assert.doesNotMatch(print, /setTimeout\(drawSheetReal,\s*500\)/);
  assert.match(print, /const drawSheetDebounceMs = 120;/);
  assert.match(print, /requestAnimationFrame\(drawSheetReal\)/);
});

test('station frame input handling does not use dynamic eval', async () => {
  const station = await readAppFile('js/frames/versionStation.js');

  assert.doesNotMatch(station, /\beval\s*\(/);
  assert.match(station, /function setStationInputTarget/);
});
