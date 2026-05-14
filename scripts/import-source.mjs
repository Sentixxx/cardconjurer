import fsp from 'node:fs/promises';
import path from 'node:path';
import { areaFilePath, areas, classifyRelativePath, roots, sourceRoot, toNativePath } from './lib/project.mjs';
import { cleanDir, copyFilePreservingPath, ensureDir, pathExists, sha256File, statFile, walkFiles } from './lib/fs.mjs';

if (!(await pathExists(sourceRoot))) {
  throw new Error(`Source root does not exist: ${sourceRoot}`);
}

for (const area of areas) {
  await cleanDir(roots[area]);
}

await cleanDir(roots.manifests);

const files = await walkFiles(sourceRoot);
const manifest = {
  version: 1,
  sourceRoot,
  generatedAt: new Date().toISOString(),
  files: [],
  counts: Object.fromEntries(areas.map((area) => [area, 0])),
};

for (const relativePath of files) {
  const area = classifyRelativePath(relativePath);

  if (!area) {
    continue;
  }

  const sourcePath = path.join(sourceRoot, toNativePath(relativePath));
  const destinationPath = areaFilePath(area, relativePath);

  await copyFilePreservingPath(sourcePath, destinationPath);

  const [stats, hash] = await Promise.all([statFile(sourceRoot, relativePath), sha256File(sourcePath)]);
  manifest.files.push({
    path: relativePath,
    area,
    size: stats.size,
    sha256: hash,
  });
  manifest.counts[area] += 1;
}

await ensureDir(roots.manifests);
await fsp.writeFile(
  path.join(roots.manifests, 'source-baseline.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
);

console.log(`Imported ${manifest.files.length} files from ${sourceRoot}`);
for (const area of areas) {
  console.log(`${area}: ${manifest.counts[area]}`);
}
