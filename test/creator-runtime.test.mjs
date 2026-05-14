import assert from 'node:assert/strict';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { JSDOM, VirtualConsole } from 'jsdom';
import { roots } from '../scripts/lib/project.mjs';

async function readDistFile(relativePath) {
  return fsp.readFile(path.join(roots.dist, ...relativePath.split('/')), 'utf8');
}

function createCanvasContextStub(window) {
  class MockCanvasRenderingContext2D {}

  const noop = () => {};
  const handler = {
    get(target, property) {
      if (!(property in target)) {
        target[property] = noop;
      }

      return target[property];
    },
    set(target, property, value) {
      target[property] = value;
      return true;
    },
  };

  window.CanvasRenderingContext2D = MockCanvasRenderingContext2D;
  window.HTMLCanvasElement.prototype.getContext = () => new Proxy(new MockCanvasRenderingContext2D(), handler);
}

test('creator fragment boots with built scripts, canvas, and localStorage contracts', async () => {
  const [creatorHtml, mainScript, creatorScript, frameSearchScript] = await Promise.all([
    readDistFile('creator/index.html'),
    readDistFile('js/main-1.js'),
    readDistFile('js/creator-23.js'),
    readDistFile('js/frameSearch.js'),
  ]);
  const runtimeErrors = [];
  const virtualConsole = new VirtualConsole();

  virtualConsole.on('error', (error) => runtimeErrors.push(error));
  virtualConsole.on('jsdomError', (error) => runtimeErrors.push(error));

  const dom = new JSDOM(
    `<!DOCTYPE html><html><head></head><body><div class="notification-container"></div>${creatorHtml}</body></html>`,
    {
      url: 'http://127.0.0.1:4242/creator',
      runScripts: 'outside-only',
      pretendToBeVisual: true,
      virtualConsole,
      beforeParse(window) {
        createCanvasContextStub(window);
        window.alert = () => {};
        window.confirm = () => false;
        window.requestAnimationFrame = (callback) => window.setTimeout(() => callback(Date.now()), 0);
        window.cancelAnimationFrame = (id) => window.clearTimeout(id);
        window.URL.createObjectURL = () => 'blob:cardforger-test';
        window.URL.revokeObjectURL = () => {};
        window.document.fonts = {
          load: () => Promise.resolve(),
          ready: Promise.resolve(),
        };
      },
    },
  );

  try {
    dom.window.eval(mainScript);
    dom.window.eval(creatorScript);
    dom.window.eval(frameSearchScript);
    await new Promise((resolve) => {
      dom.window.setTimeout(resolve, 20);
    });

    assert.deepEqual(runtimeErrors.map((error) => error.message || String(error)), []);
    assert.equal(Boolean(dom.window.card), true);
    assert.equal(dom.window.document.querySelector('#previewCanvas')?.width, 1005);
    assert.equal(dom.window.document.querySelector('#info-year')?.value, String(new Date().getFullYear()));
    assert.equal(dom.window.localStorage.getItem('autoLoadFrameVersion'), 'true');
    assert.equal(dom.window.localStorage.getItem('enableCollectorInfo'), 'true');
    assert.equal(dom.window.document.querySelectorAll('script[src="/js/frames/groupStandard-3.js"]').length, 1);
    assert.equal(typeof dom.window.frameSearch, 'function');
  } finally {
    dom.window.close();
  }
});
