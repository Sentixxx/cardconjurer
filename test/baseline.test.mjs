import assert from 'node:assert/strict';
import test from 'node:test';
import { roots } from '../scripts/lib/project.mjs';
import { walkFiles } from '../scripts/lib/fs.mjs';
import { verifyDist, verifyManifest, verifySeparation } from '../scripts/lib/verify.mjs';

function assertClean(result) {
  assert.equal(result.ok, true, result.problems.join('\n'));
}

let verifyDistResultPromise;

function verifyDistOnce() {
  verifyDistResultPromise ||= verifyDist();
  return verifyDistResultPromise;
}

test('source files are imported into separated areas exactly once', async () => {
  assertClean(await verifySeparation());
});

test('baseline manifest matches the read-only source tree', async () => {
  assertClean(await verifyManifest());
});

test('dist output matches the read-only source tree except intentional overrides', async () => {
  assertClean(await verifyDistOnce());
});

test('intentional dist overrides are limited to documented files', async () => {
  const result = await verifyDistOnce();
  assertClean(result);
  assert.deepEqual(result.allowedModifiedFiles, [
    'creator/index.html',
    'css/style-9.css',
    'data/styles/main.css',
    'index.html',
    'js/creator-23.js',
    'js/frames/versionStation.js',
    'print/print.js',
    'upload.bat',
  ]);
});

test('framework dist overrides are limited to HTML-equivalent routes', async () => {
  const result = await verifyDistOnce();
  assertClean(result);
  assert.deepEqual(result.frameworkEquivalentFiles, [
    'about/index.html',
    'askurza/askUrzaAbilityListGenerator.html',
    'askurza/index.html',
    'converter/index.html',
    'core/404.html',
    'data/site/other/askUrza/askUrzaAbilityListGenerator.html',
    'globalHTML/footer.html',
    'globalHTML/header.html',
    'legal/index.html',
    'phyrexian/index.html',
    'print/index.html',
    'theme/index.html',
    'tutorial/index.html',
  ]);
});

test('framework DOM overrides are limited to DOM-equivalent routes', async () => {
  const result = await verifyDistOnce();
  assertClean(result);
  assert.deepEqual(result.frameworkDomEquivalentFiles, [
    'gallery/index.html',
  ]);
});

test('resources do not contain browser app code files', async () => {
  const codeLikeExtensions = new Set(['.css', '.html', '.js']);
  const resourceFiles = await walkFiles(roots.resources);
  const codeLikeFiles = resourceFiles.filter((file) => {
    const extension = file.slice(file.lastIndexOf('.')).toLowerCase();
    return codeLikeExtensions.has(extension);
  });

  assert.deepEqual(codeLikeFiles, []);
});
