import { spawn } from 'node:child_process';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { areas, repoRoot, roots, toNativePath } from './lib/project.mjs';
import { cleanDir, copyFilePreservingPath, pathExists, walkFiles } from './lib/fs.mjs';
import { buildCreatorCompatScript } from './lib/creator-compat.mjs';
import { frameworkRoutes } from '../src/framework/routes.mjs';

const nextOutRoot = path.join(repoRoot, 'out');
const nextBuildRoot = path.join(repoRoot, '.next');

async function runNextBuild() {
  const nextBin = path.join(repoRoot, 'node_modules', 'next', 'dist', 'bin', 'next');

  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [nextBin, 'build'], {
      cwd: repoRoot,
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: '1',
      },
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`next build exited with code ${code}`));
      }
    });
  });
}

for (const area of areas) {
  if (!(await pathExists(roots[area]))) {
    throw new Error(`Missing ${area} directory. Run npm run import:source first.`);
  }
}

await cleanDir(roots.dist);
await cleanDir(nextOutRoot);
await cleanDir(nextBuildRoot);
await runNextBuild();

let copied = 0;
let nextRoutes = 0;

for (const area of areas) {
  const files = await walkFiles(roots[area]);

  for (const relativePath of files) {
    await copyFilePreservingPath(
      path.join(roots[area], toNativePath(relativePath)),
      path.join(roots.dist, toNativePath(relativePath)),
    );
    copied += 1;
  }
}

for (const route of frameworkRoutes) {
  await copyFilePreservingPath(
    path.join(nextOutRoot, toNativePath(route.outputPath)),
    path.join(roots.dist, toNativePath(route.outputPath)),
  );
  nextRoutes += 1;
}

const creatorRuntimePath = path.join('js', 'creator-23.js');
const creatorRuntimeSourcePath = path.join(roots.app, creatorRuntimePath);
const creatorRuntimeDistPath = path.join(roots.dist, creatorRuntimePath);

await fsp.writeFile(
  creatorRuntimeDistPath,
  await buildCreatorCompatScript(await fsp.readFile(creatorRuntimeSourcePath, 'utf8')),
);

console.log(`Built dist with ${copied} files and ${nextRoutes} Next.js route exports.`);
