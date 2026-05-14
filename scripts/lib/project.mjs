import path from 'node:path';
import { fileURLToPath } from 'node:url';

const thisFile = fileURLToPath(import.meta.url);

export const repoRoot = path.resolve(path.dirname(thisFile), '..', '..');
export const sourceRoot = path.resolve(
  process.env.CARDCONJURER_SOURCE || path.join(repoRoot, '..', 'cardconjurer'),
);

export const roots = {
  app: path.join(repoRoot, 'src', 'app'),
  resources: path.join(repoRoot, 'resources'),
  platform: path.join(repoRoot, 'platform'),
  dist: path.join(repoRoot, 'dist'),
  release: path.join(repoRoot, 'release'),
  manifests: path.join(repoRoot, 'manifests'),
};

export const areas = ['app', 'resources', 'platform'];

const appTopDirs = new Set([
  'about',
  'askurza',
  'converter',
  'creator',
  'css',
  'gallery',
  'globalHTML',
  'js',
  'legal',
  'phyrexian',
  'print',
  'theme',
  'tutorial',
]);

const resourceTopDirs = new Set(['fonts', 'img', 'local_art']);
const appDataDirs = new Set(['scripts', 'site', 'styles']);
const resourceDataDirs = new Set(['fonts', 'images']);

export function normalizePath(value) {
  return value.split(path.sep).join('/').replace(/^\.\//, '');
}

export function toNativePath(relativePath) {
  return relativePath.split('/').join(path.sep);
}

export function isInside(parent, child) {
  const relative = path.relative(path.resolve(parent), path.resolve(child));
  return relative === '' || (!!relative && !relative.startsWith('..') && !path.isAbsolute(relative));
}

export function assertInsideRepo(target, label = 'path') {
  const resolved = path.resolve(target);

  if (!isInside(repoRoot, resolved) || resolved === repoRoot) {
    throw new Error(`${label} must stay inside ${repoRoot}: ${resolved}`);
  }

  return resolved;
}

export function classifyRelativePath(relativePath) {
  const normalized = normalizePath(relativePath);

  if (!normalized || normalized === '.git' || normalized.startsWith('.git/')) {
    return null;
  }

  if (normalized === 'index.html') {
    return 'app';
  }

  const [top, second] = normalized.split('/');

  if (appTopDirs.has(top)) {
    return 'app';
  }

  if (resourceTopDirs.has(top)) {
    return 'resources';
  }

  if (top === 'core') {
    return normalized === 'core/404.html' ? 'app' : 'resources';
  }

  if (top === 'data') {
    if (appDataDirs.has(second)) {
      return 'app';
    }

    if (resourceDataDirs.has(second)) {
      return 'resources';
    }

    return 'resources';
  }

  return 'platform';
}

export function areaFilePath(area, relativePath) {
  if (!areas.includes(area)) {
    throw new Error(`Unknown area: ${area}`);
  }

  return path.join(roots[area], toNativePath(relativePath));
}
