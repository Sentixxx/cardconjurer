import path from 'node:path';
import { frameworkRoutes } from '../../src/framework/routes.mjs';
import {
  deferredHtmlEntries,
  rawStaticFrameworkFragments,
  legacySourceRoutes,
  rawStaticFrameworkRoutes,
} from '../../src/framework/migration-status.mjs';
import { repoRoot, roots, toNativePath } from './project.mjs';
import { pathExists, walkFiles } from './fs.mjs';

function sorted(values) {
  return [...values].sort((left, right) => left.localeCompare(right, 'en'));
}

function duplicateValues(values) {
  const counts = new Map();

  for (const value of values) {
    counts.set(value, (counts.get(value) || 0) + 1);
  }

  return sorted([...counts].filter(([, count]) => count > 1).map(([value]) => value));
}

function countByBaseline(routes) {
  const counts = new Map();

  for (const route of routes) {
    counts.set(route.baseline, (counts.get(route.baseline) || 0) + 1);
  }

  return Object.fromEntries(
    [...counts].sort(([left], [right]) => left.localeCompare(right, 'en')),
  );
}

function nextRouteHandlerPath(routePath) {
  return path.join(repoRoot, 'app', toNativePath(routePath), 'route.js');
}

export async function collectMigrationStatus() {
  const legacyHtmlEntries = (await walkFiles(roots.app)).filter((file) => file.endsWith('.html'));
  const legacyHtmlSet = new Set(legacyHtmlEntries);
  const routePaths = frameworkRoutes.map((route) => route.outputPath);
  const deferredPaths = deferredHtmlEntries.map((entry) => entry.path);
  const coveredPaths = new Set([...routePaths, ...deferredPaths]);
  const legacyRoutePaths = frameworkRoutes
    .filter((route) => route.source === 'legacy')
    .map((route) => route.outputPath);
  const trackedLegacyPaths = legacySourceRoutes.map((entry) => entry.path);
  const rawStaticPaths = rawStaticFrameworkRoutes.map((entry) => entry.path);
  const rawStaticFragmentRoutes = rawStaticFrameworkFragments.map((entry) => entry.route);
  const nextRouteHandlerEntries = await Promise.all(routePaths.map(async (routePath) => ({
    routePath,
    exists: await pathExists(nextRouteHandlerPath(routePath)),
  })));
  const structuralProblems = [];

  const duplicateRoutePaths = duplicateValues(routePaths);
  if (duplicateRoutePaths.length > 0) {
    structuralProblems.push(`duplicate framework route paths: ${duplicateRoutePaths.join(', ')}`);
  }

  const duplicateDeferredPaths = duplicateValues(deferredPaths);
  if (duplicateDeferredPaths.length > 0) {
    structuralProblems.push(`duplicate deferred HTML entry paths: ${duplicateDeferredPaths.join(', ')}`);
  }

  const missingEntries = legacyHtmlEntries.filter((entry) => !coveredPaths.has(entry));
  if (missingEntries.length > 0) {
    structuralProblems.push(`legacy HTML entries missing from migration inventory: ${missingEntries.join(', ')}`);
  }

  const unknownRoutes = routePaths.filter((routePath) => !legacyHtmlSet.has(routePath));
  if (unknownRoutes.length > 0) {
    structuralProblems.push(`framework routes without matching legacy HTML entries: ${unknownRoutes.join(', ')}`);
  }

  const unknownDeferredEntries = deferredPaths.filter((entry) => !legacyHtmlSet.has(entry));
  if (unknownDeferredEntries.length > 0) {
    structuralProblems.push(`deferred entries without matching legacy HTML entries: ${unknownDeferredEntries.join(', ')}`);
  }

  const untrackedLegacyRoutes = legacyRoutePaths.filter((routePath) => !trackedLegacyPaths.includes(routePath));
  if (untrackedLegacyRoutes.length > 0) {
    structuralProblems.push(`legacy-source routes missing blocker records: ${untrackedLegacyRoutes.join(', ')}`);
  }

  const staleLegacyBlockers = trackedLegacyPaths.filter((routePath) => !legacyRoutePaths.includes(routePath));
  if (staleLegacyBlockers.length > 0) {
    structuralProblems.push(`legacy-source blocker records without matching legacy route: ${staleLegacyBlockers.join(', ')}`);
  }

  const unknownRawStaticRoutes = rawStaticPaths.filter((routePath) => !routePaths.includes(routePath));
  if (unknownRawStaticRoutes.length > 0) {
    structuralProblems.push(`raw static framework blocker records without matching route: ${unknownRawStaticRoutes.join(', ')}`);
  }

  const unknownRawStaticFragmentRoutes = rawStaticFragmentRoutes.filter((routePath) => !routePaths.includes(routePath));
  if (unknownRawStaticFragmentRoutes.length > 0) {
    structuralProblems.push(
      `raw static fragment blocker records without matching route: ${unknownRawStaticFragmentRoutes.join(', ')}`,
    );
  }

  const missingNextRouteHandlers = nextRouteHandlerEntries
    .filter((entry) => !entry.exists)
    .map((entry) => entry.routePath);
  if (missingNextRouteHandlers.length > 0) {
    structuralProblems.push(`framework routes missing Next.js route handlers: ${missingNextRouteHandlers.join(', ')}`);
  }

  const generatedRoutes = frameworkRoutes.filter((route) => route.source !== 'legacy');
  const componentRoutes = generatedRoutes.filter((route) => route.component);
  const customRendererRoutes = generatedRoutes.filter((route) => route.render && !route.component);
  const legacySourceBlockers = sorted(legacySourceRoutes.map((entry) => entry.path)).map((path) => (
    legacySourceRoutes.find((entry) => entry.path === path)
  ));
  const rawStaticBlockers = sorted(rawStaticFrameworkRoutes.map((entry) => entry.path)).map((path) => (
    rawStaticFrameworkRoutes.find((entry) => entry.path === path)
  ));
  const rawStaticFragmentBlockers = sorted(rawStaticFrameworkFragments.map((entry) => entry.path)).map((path) => (
    rawStaticFrameworkFragments.find((entry) => entry.path === path)
  ));

  return {
    legacyHtmlEntries,
    routePaths: sorted(routePaths),
    deferredPaths: sorted(deferredPaths),
    generatedRoutePaths: sorted(generatedRoutes.map((route) => route.outputPath)),
    nextRouteHandlerPaths: sorted(nextRouteHandlerEntries.filter((entry) => entry.exists).map((entry) => entry.routePath)),
    componentRoutePaths: sorted(componentRoutes.map((route) => route.outputPath)),
    customRendererRoutePaths: sorted(customRendererRoutes.map((route) => route.outputPath)),
    legacySourceBlockers,
    rawStaticBlockers,
    rawStaticFragmentBlockers,
    baselineCounts: countByBaseline(frameworkRoutes),
    structuralProblems,
    complete: structuralProblems.length === 0
      && deferredHtmlEntries.length === 0
      && legacySourceRoutes.length === 0
      && rawStaticFrameworkRoutes.length === 0
      && rawStaticFrameworkFragments.length === 0,
  };
}

export function formatMigrationStatus(status) {
  const lines = [
    'Modern framework migration status',
    `- legacy HTML entries: ${status.legacyHtmlEntries.length}`,
    `- framework inventory routes: ${status.routePaths.length}`,
    `- Next.js route handlers: ${status.nextRouteHandlerPaths.length}`,
    `- framework-generated routes: ${status.generatedRoutePaths.length}`,
    `- component routes: ${status.componentRoutePaths.length}`,
    `- custom renderer routes: ${status.customRendererRoutePaths.length}`,
    `- legacy-source routes: ${status.legacySourceBlockers.length}`,
    `- raw static framework routes: ${status.rawStaticBlockers.length}`,
    `- raw static framework fragments: ${status.rawStaticFragmentBlockers.length}`,
    `- deferred HTML entries: ${status.deferredPaths.length}`,
    `- route inventory: ${status.structuralProblems.length === 0 ? 'ok' : 'failed'}`,
    `- completion: ${status.complete ? 'complete' : 'incomplete'}`,
    '',
    'Baseline categories:',
    ...Object.entries(status.baselineCounts).map(([baseline, count]) => `- ${baseline}: ${count}`),
  ];

  if (status.legacySourceBlockers.length > 0) {
    lines.push('', 'Legacy-source blockers:');
    for (const blocker of status.legacySourceBlockers) {
      lines.push(`- ${blocker.path}: ${blocker.reason}`);
    }
  }

  if (status.rawStaticBlockers.length > 0) {
    lines.push('', 'Raw static framework blockers:');
    for (const blocker of status.rawStaticBlockers) {
      lines.push(`- ${blocker.path}: ${blocker.reason}`);
    }
  }

  if (status.rawStaticFragmentBlockers.length > 0) {
    lines.push('', 'Raw static framework fragment blockers:');
    for (const blocker of status.rawStaticFragmentBlockers) {
      lines.push(`- ${blocker.path} (${blocker.route}): ${blocker.reason}`);
    }
  }

  if (status.deferredPaths.length > 0) {
    lines.push('', 'Deferred HTML entries:');
    for (const entry of status.deferredPaths) {
      lines.push(`- ${entry}`);
    }
  }

  if (status.structuralProblems.length > 0) {
    lines.push('', 'Inventory problems:');
    for (const problem of status.structuralProblems) {
      lines.push(`- ${problem}`);
    }
  }

  return lines.join('\n');
}
