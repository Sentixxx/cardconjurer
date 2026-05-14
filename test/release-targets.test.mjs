import assert from 'node:assert/strict';
import fsp from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { classifyReleasePath, isHiresFrameReleasePath, isPlatformReleasePath, resolveReleaseConfig } from '../scripts/build-release.mjs';
import { repoRoot } from '../scripts/lib/project.mjs';

const config = resolveReleaseConfig(
  JSON.parse(await fsp.readFile(path.join(repoRoot, 'config', 'release-targets.json'), 'utf8')),
);

test('release classifier splits platform files away from the OSS site set', () => {
  for (const file of ['Dockerfile', 'upload.bat', 'launcher.exe', '.htaccess', 'docker/app.conf']) {
    assert.equal(isPlatformReleasePath(file, config), true, file);
    assert.equal(classifyReleasePath(file, config), 'platform', file);
  }
});

test('release classifier sends non-thumbnail frame PNG files to cold assets', () => {
  for (const file of ['img/frames/m15/w.png', 'img/frames/m15/pt/w.png', 'img/frames/maskRightHalf.png']) {
    assert.equal(isHiresFrameReleasePath(file, config), true, file);
    assert.equal(classifyReleasePath(file, config), 'assets-hires', file);
  }
});

test('release classifier keeps app shell and hot visual assets in the site set', () => {
  for (const file of [
    'index.html',
    'creator/index.html',
    'css/style-9.css',
    'js/creator-23.js',
    'fonts/GillSans.woff2',
    'img/frames/m15/wThumb.png',
    'img/manaSymbols/w.svg',
    'img/setSymbols/official/mom-m.svg',
    'gallery/img/adventure.png',
    'data/images/site/backgrounds/lowpolyDarkGreen.svg',
  ]) {
    assert.equal(classifyReleasePath(file, config), 'site', file);
  }
});

