import assert from 'node:assert/strict';
import fsp from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import nextConfig from '../next.config.mjs';
import { repoRoot } from '../scripts/lib/project.mjs';
import { canonicalHtml } from '../scripts/lib/html-equivalence.mjs';
import { collectMigrationStatus } from '../scripts/lib/migration-status.mjs';
import { readGalleryDataSync } from '../src/framework/data/gallery-data.mjs';
import {
  deferredHtmlEntries,
  rawStaticFrameworkFragments,
  legacySourceRoutes,
  rawStaticFrameworkRoutes,
} from '../src/framework/migration-status.mjs';
import { frameworkRoutes } from '../src/framework/routes.mjs';
import { renderFrameworkRoute } from '../src/framework/render-pages.mjs';

async function allowedOverridePaths() {
  const configPath = path.join(repoRoot, 'config', 'intentional-overrides.json');
  const config = JSON.parse(await fsp.readFile(configPath, 'utf8'));
  return new Set(config.allowedModifiedFiles.map((entry) => entry.path));
}

function sourcePathForRoute(route) {
  return path.join(repoRoot, 'src', 'app', ...route.outputPath.split('/'));
}

async function legacyHtmlEntries() {
  const entries = [];
  const srcApp = path.join(repoRoot, 'src', 'app');

  async function visit(current, parts = []) {
    const dirents = await fsp.readdir(current, { withFileTypes: true });

    for (const dirent of dirents) {
      if (dirent.isDirectory()) {
        await visit(path.join(current, dirent.name), [...parts, dirent.name]);
      } else if (dirent.isFile() && dirent.name.endsWith('.html')) {
        entries.push([...parts, dirent.name].join('/'));
      }
    }
  }

  await visit(srcApp);
  return entries.sort((left, right) => left.localeCompare(right, 'en'));
}

test('framework migration currently owns only whitelisted public pages', async () => {
  const overrides = await allowedOverridePaths();

  assert.deepEqual(frameworkRoutes.map((route) => route.outputPath), [
    'about/index.html',
    'askurza/askUrzaAbilityListGenerator.html',
    'askurza/index.html',
    'converter/index.html',
    'creator/index.html',
    'core/404.html',
    'data/site/other/askUrza/askUrzaAbilityListGenerator.html',
    'gallery/index.html',
    'globalHTML/footer.html',
    'globalHTML/header.html',
    'index.html',
    'legal/index.html',
    'phyrexian/index.html',
    'print/index.html',
    'theme/index.html',
    'tutorial/index.html',
  ]);

  for (const route of frameworkRoutes) {
    if (route.baseline === 'performance-override') {
      assert.equal(overrides.has(route.outputPath), true, `${route.outputPath} must be baseline-whitelisted`);
    } else {
      assert.match(route.baseline, /^(?:html-equivalent|gallery-dom-equivalent|exact-copy)$/);
    }
  }
});

test('framework route inventory is explicit and points at legacy HTML entries', async () => {
  const entries = await legacyHtmlEntries();
  const entrySet = new Set(entries);
  const outputPaths = frameworkRoutes.map((route) => route.outputPath);
  const deferredPaths = deferredHtmlEntries.map((entry) => entry.path);

  assert.equal(new Set(outputPaths).size, outputPaths.length, 'framework route output paths must be unique');
  assert.equal(new Set(deferredPaths).size, deferredPaths.length, 'deferred HTML entry paths must be unique');

  for (const route of frameworkRoutes) {
    assert.equal(entrySet.has(route.outputPath), true, `${route.outputPath} must map to a legacy source HTML entry`);
  }

  for (const entry of deferredHtmlEntries) {
    assert.equal(entrySet.has(entry.path), true, `${entry.path} must map to a legacy source HTML entry`);
    assert.ok(entry.reason.trim().length >= 40, `${entry.path} must include a concrete deferral reason`);
  }

  assert.deepEqual(outputPaths.filter((outputPath) => !entrySet.has(outputPath)), []);
  assert.deepEqual([...new Set([...outputPaths, ...deferredPaths])].sort((left, right) => left.localeCompare(right, 'en')), entries);
});

test('Next.js static export route handlers cover the framework inventory', async () => {
  assert.equal(nextConfig.output, 'export');
  assert.equal(nextConfig.trailingSlash, true);

  for (const route of frameworkRoutes) {
    const routeHandlerPath = path.join(repoRoot, 'app', ...route.outputPath.split('/'), 'route.js');
    const stats = await fsp.stat(routeHandlerPath);

    assert.equal(stats.isFile(), true, `${route.outputPath} must be exported by a Next.js route handler`);
  }
});

test('legacy-source framework routes are explicitly tracked as incomplete component migrations', () => {
  const legacyRoutePaths = frameworkRoutes.filter((route) => route.source === 'legacy').map((route) => route.outputPath).sort();
  const trackedPaths = legacySourceRoutes.map((entry) => entry.path).sort();

  assert.deepEqual(legacyRoutePaths, trackedPaths);

  for (const entry of legacySourceRoutes) {
    assert.ok(entry.reason.trim().length >= 40, `${entry.path} must include a concrete legacy-source reason`);
  }
});

test('raw static framework routes are explicitly tracked as incomplete panel migrations', () => {
  const rawStaticPaths = rawStaticFrameworkRoutes.map((entry) => entry.path).sort();

  assert.deepEqual(rawStaticPaths, []);

  for (const entry of rawStaticFrameworkRoutes) {
    assert.ok(entry.reason.trim().length >= 40, `${entry.path} must include a concrete raw-static reason`);
  }
});

test('raw static creator fragments are explicitly tracked as incomplete component migrations', () => {
  assert.deepEqual(rawStaticFrameworkFragments.map((entry) => entry.path), []);

  for (const entry of rawStaticFrameworkFragments) {
    assert.equal(entry.route, 'creator/index.html');
    assert.ok(entry.reason.trim().length >= 40, `${entry.path} must include a concrete raw fragment reason`);
  }
});

test('migration status reports a complete framework migration', async () => {
  const status = await collectMigrationStatus();

  assert.equal(status.structuralProblems.length, 0);
  assert.equal(status.complete, true);
  assert.deepEqual(status.legacySourceBlockers.map((entry) => entry.path), []);
  assert.deepEqual(status.rawStaticBlockers.map((entry) => entry.path), []);
  assert.equal(status.rawStaticFragmentBlockers.length, 0);
  assert.deepEqual(status.customRendererRoutePaths, [
    'globalHTML/footer.html',
    'globalHTML/header.html',
  ]);
  assert.equal(status.generatedRoutePaths.length, 16);
  assert.equal(status.nextRouteHandlerPaths.length, 16);
  assert.equal(status.deferredPaths.length, 0);
});

test('canonical HTML equivalence preserves behavior-sensitive script text', () => {
  assert.notDeepEqual(
    canonicalHtml('<script>const value = "a  b";</script>'),
    canonicalHtml('<script>const value = "a b";</script>'),
  );

  assert.deepEqual(
    canonicalHtml('<p>a  b</p>'),
    canonicalHtml('<p>a b</p>'),
  );
});

for (const route of frameworkRoutes.filter((candidate) => candidate.baseline === 'html-equivalent')) {
  test(`framework-rendered ${route.outputPath} is structurally equivalent to the legacy source`, async () => {
    const legacy = await fsp.readFile(sourcePathForRoute(route), 'utf8');
    const rendered = renderFrameworkRoute(route);

    assert.deepEqual(canonicalHtml(rendered, route.htmlMode), canonicalHtml(legacy, route.htmlMode));
  });
}

test('framework-rendered gallery fragment statically renders legacy gallery cards', () => {
  const route = frameworkRoutes.find((candidate) => candidate.outputPath === 'gallery/index.html');
  const rendered = renderFrameworkRoute(route);
  const imageCount = [...rendered.matchAll(/<img /g)].length;
  const expectedImageCount = readGalleryDataSync().reduce((total, section) => total + section.items.length, 0);

  assert.equal(imageCount, expectedImageCount);
  assert.doesNotMatch(rendered, /<script>/);
  assert.match(rendered, /src="\/gallery\/img\/regular\.png"/);
  assert.match(rendered, /loading="lazy"/);
  assert.match(rendered, /decoding="async"/);
});

test('framework-rendered creator route preserves the optimized editor fragment structure', async () => {
  const route = frameworkRoutes.find((candidate) => candidate.outputPath === 'creator/index.html');
  const legacy = await fsp.readFile(sourcePathForRoute(route), 'utf8');

  assert.equal(route.source, undefined);
  assert.equal(route.component.name, 'CreatorPage');
  assert.deepEqual(canonicalHtml(renderFrameworkRoute(route), route.htmlMode), canonicalHtml(legacy, route.htmlMode));
});

test('framework-rendered global HTML partial routes preserve document boundary contracts', () => {
  const header = renderFrameworkRoute(frameworkRoutes.find((route) => route.outputPath === 'globalHTML/header.html'));
  const footer = renderFrameworkRoute(frameworkRoutes.find((route) => route.outputPath === 'globalHTML/footer.html'));

  assert.match(header, /^<!DOCTYPE html>/);
  assert.match(header, /<body>/);
  assert.doesNotMatch(header, /<\/body>/);
  assert.match(header, /href="\/core\/site\.webmanifest"/);
  assert.match(header, /href="\/creator"/);
  assert.match(header, /<h2>导航<\/h2>/);

  assert.match(footer, /<!--/);
  assert.match(footer, /Card Conjurer/);
  assert.match(footer, /<\/body>\s*<\/html>/);
});

test('framework-rendered landing page preserves legacy app shell contracts', () => {
  const html = renderFrameworkRoute(frameworkRoutes.find((route) => route.outputPath === 'index.html'));

  assert.match(html, /^<!DOCTYPE html>/);
  assert.match(html, /<div id="content">/);
  assert.match(html, /hx-get="creator\/index\.html"/);
  assert.match(html, /hx-get="creator"/);
  assert.match(html, /href="css\/style-9\.css"/);
  assert.match(html, /href="core\/favicon\.ico"/);
  assert.match(html, /src="js\/htmx\.min\.js"/);
});

test('framework-rendered about fragment preserves external profile link', () => {
  const route = frameworkRoutes.find((candidate) => candidate.outputPath === 'about/index.html');
  const rendered = renderFrameworkRoute(route);

  assert.match(rendered, /href="https:\/\/twitter\.com\/ImKyle4815"/);
});

test('framework-rendered ask urza fragment preserves tool contracts', () => {
  const route = frameworkRoutes.find((candidate) => candidate.outputPath === 'askurza/index.html');
  const rendered = renderFrameworkRoute(route);

  assert.match(rendered, /src="\/askurza\/urzaBlank\.png"/);
  assert.match(rendered, /onclick="randomAbility\(0\)"/);
  assert.match(rendered, /src="\/askurza\/askUrza\.js"/);
});

test('framework-rendered ask urza generator documents preserve inline script contracts', () => {
  const downloadRoute = frameworkRoutes.find(
    (candidate) => candidate.outputPath === 'askurza/askUrzaAbilityListGenerator.html',
  );
  const windowOpenRoute = frameworkRoutes.find(
    (candidate) => candidate.outputPath === 'data/site/other/askUrza/askUrzaAbilityListGenerator.html',
  );

  const downloadHtml = renderFrameworkRoute(downloadRoute);
  const windowOpenHtml = renderFrameworkRoute(windowOpenRoute);

  assert.match(downloadHtml, /download\.download = 'planeswalkerAbilities\.txt'/);
  assert.match(downloadHtml, /download\.click\(\)/);
  assert.match(windowOpenHtml, /window\.open\(encodedUri\)/);
  assert.match(windowOpenHtml, /importPlaneswalkers\("https:\/\/api\.scryfall\.com\/cards\/search\?order=released&q=type%3Dplaneswalker"\)/);
});

test('framework-rendered converter fragment preserves upload contracts', () => {
  const route = frameworkRoutes.find((candidate) => candidate.outputPath === 'converter/index.html');
  const rendered = renderFrameworkRoute(route);

  assert.match(rendered, /type="file"/);
  assert.match(rendered, /data-dropFunction="prepareImage"/);
  assert.match(rendered, /oninput="uploadFiles\(event\.target\.files, prepareImage, &quot;filename&quot;\);"/);
  assert.match(rendered, /src="\/converter\/converter\.js"/);
});

test('framework-rendered print fragment preserves print tool contracts', () => {
  const route = frameworkRoutes.find((candidate) => candidate.outputPath === 'print/index.html');
  const rendered = renderFrameworkRoute(route);

  assert.match(rendered, /onchange="setPageSize\(this\.value\.split\(&quot;,&quot;\)\);"/);
  assert.match(rendered, /oninput="uploadFiles\(event\.target\.files, uploadCard, &quot;filename&quot;\);"/);
  assert.match(rendered, /onclick="downloadCanvas\(\);"/);
  assert.match(rendered, /src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/jspdf\/1\.3\.5\/jspdf\.debug\.js"/);
  assert.match(rendered, /src="\/print\/print\.js"/);
});

test('framework-rendered tutorial fragment preserves guide image contracts', () => {
  const route = frameworkRoutes.find((candidate) => candidate.outputPath === 'tutorial/index.html');
  const rendered = renderFrameworkRoute(route);

  assert.match(rendered, /src="\/img\/tutorial\/frame-tab\.jpg"/);
  assert.match(rendered, /src="\/img\/tutorial\/text-tab\.jpg"/);
});

test('framework-rendered not found fragment preserves title and message', () => {
  const route = frameworkRoutes.find((candidate) => candidate.outputPath === 'core/404.html');
  const rendered = renderFrameworkRoute(route);

  assert.match(rendered, /<title>404 - Card Conjurer<\/title>/);
  assert.match(rendered, />页面未找到</);
});

test('framework-rendered theme fragment preserves editor contracts', () => {
  const route = frameworkRoutes.find((candidate) => candidate.outputPath === 'theme/index.html');
  const rendered = renderFrameworkRoute(route);

  assert.match(rendered, /onchange="changeThemeVar\(this\.value, &quot;background&quot;\);"/);
  assert.match(rendered, /src="\.\.\/js\/themeEditor\.js"/);
});

test('framework-rendered phyrexian fragment preserves generator contracts', () => {
  const route = frameworkRoutes.find((candidate) => candidate.outputPath === 'phyrexian/index.html');
  const rendered = renderFrameworkRoute(route);

  assert.match(rendered, /oninput="generatePhyrexianText\(\)"/);
  assert.match(rendered, /src="\/phyrexian\/phyrexian\.js"/);
});
