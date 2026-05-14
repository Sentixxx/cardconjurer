import crypto from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { assertInsideRepo, normalizePath, toNativePath } from './project.mjs';

export async function pathExists(target) {
  try {
    await fsp.access(target);
    return true;
  } catch {
    return false;
  }
}

export async function cleanDir(target) {
  const resolved = assertInsideRepo(target, 'clean target');
  await fsp.rm(resolved, { recursive: true, force: true });
  await fsp.mkdir(resolved, { recursive: true });
}

export async function ensureDir(target) {
  await fsp.mkdir(target, { recursive: true });
}

export async function copyFilePreservingPath(source, destination) {
  await ensureDir(path.dirname(destination));
  await fsp.copyFile(source, destination);
}

export async function walkFiles(root, options = {}) {
  const skipDirs = new Set(options.skipDirs || ['.git']);
  const resolvedRoot = path.resolve(root);
  const files = [];

  async function visit(current) {
    const entries = await fsp.readdir(current, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!skipDirs.has(entry.name)) {
          await visit(path.join(current, entry.name));
        }

        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      files.push(normalizePath(path.relative(resolvedRoot, path.join(current, entry.name))));
    }
  }

  await visit(resolvedRoot);
  files.sort((a, b) => a.localeCompare(b, 'en'));
  return files;
}

export async function sha256File(target) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(target);

    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

export async function statFile(root, relativePath) {
  return fsp.stat(path.join(root, toNativePath(relativePath)));
}

export async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;

  async function run() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await worker(items[index], index);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, run);
  await Promise.all(workers);
  return results;
}
