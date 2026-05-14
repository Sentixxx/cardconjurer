import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cleanDir, copyFilePreservingPath, ensureDir, mapLimit, pathExists, sha256File, statFile, walkFiles } from './lib/fs.mjs';
import { assertInsideRepo, normalizePath, repoRoot, roots, toNativePath } from './lib/project.mjs';

const thisFile = fileURLToPath(import.meta.url);
const defaultConfigPath = path.join(repoRoot, 'config', 'release-targets.json');
const copyConcurrency = 16;
const hashConcurrency = 16;

function relativeFromRepo(value) {
  return normalizePath(path.relative(repoRoot, value));
}

async function readJson(filePath) {
  return JSON.parse(await fsp.readFile(filePath, 'utf8'));
}

function normalizeConfiguredPath(value) {
  return normalizePath(value).replace(/^\/+/, '');
}

export function resolveReleaseConfig(rawConfig, configPath = defaultConfigPath) {
  const sourceRoot = assertInsideRepo(path.resolve(repoRoot, rawConfig.sourceRoot || 'dist'), 'release source root');
  const manifestPath = assertInsideRepo(
    path.resolve(repoRoot, rawConfig.manifestPath || 'manifests/release-manifest.json'),
    'release manifest path',
  );

  const targets = Object.fromEntries(
    Object.entries(rawConfig.targets || {}).map(([name, target]) => [
      name,
      {
        ...target,
        root: assertInsideRepo(path.resolve(repoRoot, target.root), `${name} release root`),
      },
    ]),
  );

  for (const requiredTarget of ['site', 'assets-hires', 'platform']) {
    if (!targets[requiredTarget]) {
      throw new Error(`Missing release target: ${requiredTarget}`);
    }
  }

  return {
    configPath: path.resolve(configPath),
    sourceRoot,
    manifestPath,
    targets,
    platform: {
      paths: new Set((rawConfig.platform?.paths || []).map(normalizeConfiguredPath)),
      prefixes: (rawConfig.platform?.prefixes || []).map(normalizeConfiguredPath),
    },
    assetsHires: {
      framePrefix: normalizeConfiguredPath(rawConfig.assetsHires?.framePrefix || 'img/frames/'),
      extensions: new Set((rawConfig.assetsHires?.extensions || ['.png']).map((extension) => extension.toLowerCase())),
      thumbnailSuffix: rawConfig.assetsHires?.thumbnailSuffix || 'Thumb.png',
    },
  };
}

export function isPlatformReleasePath(relativePath, config) {
  const normalized = normalizeConfiguredPath(relativePath);

  if (config.platform.paths.has(normalized)) {
    return true;
  }

  return config.platform.prefixes.some((prefix) => normalized.startsWith(prefix));
}

export function isHiresFrameReleasePath(relativePath, config) {
  const normalized = normalizeConfiguredPath(relativePath);

  if (!normalized.startsWith(config.assetsHires.framePrefix)) {
    return false;
  }

  if (normalized.endsWith(config.assetsHires.thumbnailSuffix)) {
    return false;
  }

  return config.assetsHires.extensions.has(path.posix.extname(normalized).toLowerCase());
}

export function classifyReleasePath(relativePath, config) {
  if (isPlatformReleasePath(relativePath, config)) {
    return 'platform';
  }

  if (isHiresFrameReleasePath(relativePath, config)) {
    return 'assets-hires';
  }

  return 'site';
}

async function copyReleaseFile(file, targetName, config) {
  const source = path.join(config.sourceRoot, toNativePath(file));
  const destination = path.join(config.targets[targetName].root, toNativePath(file));
  await copyFilePreservingPath(source, destination);
}

async function createFileEntry(root, file) {
  const source = path.join(root, toNativePath(file));
  const [stat, sha256] = await Promise.all([statFile(root, file), sha256File(source)]);

  return {
    path: file,
    bytes: stat.size,
    sha256,
  };
}

function summarizeEntries(entries) {
  return {
    fileCount: entries.length,
    totalBytes: entries.reduce((sum, entry) => sum + entry.bytes, 0),
  };
}

function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

export async function buildRelease(configPath = defaultConfigPath) {
  const rawConfig = await readJson(configPath);
  const config = resolveReleaseConfig(rawConfig, configPath);

  if (!(await pathExists(config.sourceRoot))) {
    throw new Error(`Missing release source root: ${relativeFromRepo(config.sourceRoot)}. Run npm run build first.`);
  }

  const distFiles = await walkFiles(config.sourceRoot);
  const filesByTarget = new Map(Object.keys(config.targets).map((targetName) => [targetName, []]));

  for (const file of distFiles) {
    filesByTarget.get(classifyReleasePath(file, config)).push(file);
  }

  await cleanDir(roots.release);
  await ensureDir(path.dirname(config.manifestPath));

  for (const [targetName, target] of Object.entries(config.targets)) {
    await ensureDir(target.root);
    await mapLimit(filesByTarget.get(targetName), copyConcurrency, (file) => copyReleaseFile(file, targetName, config));
  }

  const manifestTargets = {};

  for (const [targetName, target] of Object.entries(config.targets)) {
    const files = await walkFiles(target.root);
    const entries = await mapLimit(files, hashConcurrency, (file) => createFileEntry(target.root, file));

    manifestTargets[targetName] = {
      root: relativeFromRepo(target.root),
      description: target.description,
      ...summarizeEntries(entries),
      files: entries,
    };
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceRoot: relativeFromRepo(config.sourceRoot),
    configPath: relativeFromRepo(config.configPath),
    targets: manifestTargets,
  };

  await fsp.writeFile(config.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  return {
    manifest,
    manifestPath: config.manifestPath,
  };
}

if (process.argv[1] === thisFile) {
  const configArgIndex = process.argv.indexOf('--config');

  if (configArgIndex !== -1 && !process.argv[configArgIndex + 1]) {
    throw new Error('Missing value for --config');
  }

  const configPath = configArgIndex === -1 ? defaultConfigPath : path.resolve(process.argv[configArgIndex + 1]);
  const result = await buildRelease(configPath);

  console.log(`Built release targets from ${result.manifest.sourceRoot}:`);

  for (const [targetName, target] of Object.entries(result.manifest.targets)) {
    console.log(`- ${targetName}: ${target.fileCount} files, ${formatBytes(target.totalBytes)} -> ${target.root}`);
  }

  console.log(`Manifest: ${relativeFromRepo(result.manifestPath)}`);
}
