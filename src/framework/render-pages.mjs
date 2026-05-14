import fsp from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import { repoRoot } from '../../scripts/lib/project.mjs';
import { frameworkRoutes } from './routes.mjs';
import { renderFrameworkRoute as renderGeneratedFrameworkRoute } from './render-route.mjs';

function sourcePathForRoute(route) {
  return path.join(repoRoot, 'src', 'app', ...route.outputPath.split('/'));
}

export function renderFrameworkRoute(route) {
  if (route.source === 'legacy') {
    return fs.readFileSync(sourcePathForRoute(route), 'utf8');
  }

  return renderGeneratedFrameworkRoute(route);
}

export async function renderFrameworkPages(outDir) {
  for (const route of frameworkRoutes) {
    const destination = path.join(outDir, ...route.outputPath.split('/'));
    await fsp.mkdir(path.dirname(destination), { recursive: true });
    await fsp.writeFile(destination, renderFrameworkRoute(route), 'utf8');
  }
}
