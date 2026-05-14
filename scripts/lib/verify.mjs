import fsp from 'node:fs/promises';
import path from 'node:path';
import {
  areaFilePath,
  areas,
  classifyRelativePath,
  repoRoot,
  roots,
  sourceRoot,
  toNativePath,
} from './project.mjs';
import { frameworkRoutes } from '../../src/framework/routes.mjs';
import { mapLimit, pathExists, sha256File, statFile, walkFiles } from './fs.mjs';
import { galleryFilesDomEquivalent } from './gallery-equivalence.mjs';
import { htmlFilesEquivalent } from './html-equivalence.mjs';

const maxProblems = 30;

function addProblem(problems, message) {
  if (problems.length < maxProblems) {
    problems.push(message);
  }
}

function diffSets(left, right) {
  return {
    missing: [...left].filter((item) => !right.has(item)),
    extra: [...right].filter((item) => !left.has(item)),
  };
}

async function readBaselineManifest() {
  const manifestPath = path.join(roots.manifests, 'source-baseline.json');

  if (!(await pathExists(manifestPath))) {
    return null;
  }

  return JSON.parse(await fsp.readFile(manifestPath, 'utf8'));
}

async function readIntentionalOverrides() {
  const overridesPath = path.join(repoRoot, 'config', 'intentional-overrides.json');

  if (!(await pathExists(overridesPath))) {
    return new Map();
  }

  const overrides = JSON.parse(await fsp.readFile(overridesPath, 'utf8'));
  return new Map((overrides.allowedModifiedFiles || []).map((entry) => [entry.path, entry.reason || '']));
}

export async function verifySeparation() {
  const problems = [];

  if (!(await pathExists(sourceRoot))) {
    return {
      ok: false,
      checkedFiles: 0,
      problems: [`Source root does not exist: ${sourceRoot}`],
    };
  }

  const sourceFiles = await walkFiles(sourceRoot);
  const sourceSet = new Set(sourceFiles);
  const seenOutputPaths = new Map();
  let checkedFiles = 0;

  for (const relativePath of sourceFiles) {
    const area = classifyRelativePath(relativePath);

    if (!area) {
      continue;
    }

    checkedFiles += 1;

    if (!(await pathExists(areaFilePath(area, relativePath)))) {
      addProblem(problems, `Missing ${area} import for ${relativePath}`);
    }
  }

  for (const area of areas) {
    if (!(await pathExists(roots[area]))) {
      addProblem(problems, `Missing area directory: ${roots[area]}`);
      continue;
    }

    const areaFiles = await walkFiles(roots[area]);

    for (const relativePath of areaFiles) {
      const expectedArea = classifyRelativePath(relativePath);

      if (!sourceSet.has(relativePath)) {
        addProblem(problems, `Imported ${area} file has no source match: ${relativePath}`);
      }

      if (expectedArea !== area) {
        addProblem(problems, `Imported ${relativePath} is in ${area}, expected ${expectedArea}`);
      }

      if (seenOutputPaths.has(relativePath)) {
        addProblem(
          problems,
          `Duplicate public path ${relativePath} in ${seenOutputPaths.get(relativePath)} and ${area}`,
        );
      } else {
        seenOutputPaths.set(relativePath, area);
      }
    }
  }

  return {
    ok: problems.length === 0,
    checkedFiles,
    problems,
  };
}

export async function verifyManifest() {
  const manifest = await readBaselineManifest();

  if (!manifest) {
    return {
      ok: false,
      checkedFiles: 0,
      problems: ['Missing manifests/source-baseline.json'],
    };
  }

  const problems = [];
  const sourceFiles = await walkFiles(sourceRoot);
  const sourceSet = new Set(sourceFiles);
  const manifestFiles = manifest.files || [];
  const manifestSet = new Set(manifestFiles.map((file) => file.path));
  const { missing, extra } = diffSets(sourceSet, manifestSet);

  for (const item of missing.slice(0, maxProblems)) {
    addProblem(problems, `Manifest missing source file: ${item}`);
  }

  for (const item of extra.slice(0, maxProblems)) {
    addProblem(problems, `Manifest includes non-source file: ${item}`);
  }

  await mapLimit(manifestFiles, 16, async (entry) => {
    if (problems.length >= maxProblems || !sourceSet.has(entry.path)) {
      return;
    }

    const expectedArea = classifyRelativePath(entry.path);
    if (entry.area !== expectedArea) {
      addProblem(problems, `Manifest area mismatch for ${entry.path}: ${entry.area} != ${expectedArea}`);
    }

    const sourcePath = path.join(sourceRoot, toNativePath(entry.path));
    const [stats, hash] = await Promise.all([statFile(sourceRoot, entry.path), sha256File(sourcePath)]);

    if (entry.size !== stats.size) {
      addProblem(problems, `Manifest size mismatch for ${entry.path}`);
    }

    if (entry.sha256 !== hash) {
      addProblem(problems, `Manifest hash mismatch for ${entry.path}`);
    }
  });

  return {
    ok: problems.length === 0,
    checkedFiles: manifestFiles.length,
    problems,
  };
}

export async function verifyDist() {
  const problems = [];
  const allowedOverrides = await readIntentionalOverrides();
  const allowedModifiedFiles = new Set();
  const frameworkEquivalentFiles = new Set();
  const frameworkDomEquivalentFiles = new Set();
  const frameworkEquivalentRoutes = new Map(
    frameworkRoutes
      .filter((route) => route.baseline === 'html-equivalent')
      .map((route) => [route.outputPath, route]),
  );
  const frameworkDomEquivalentRoutes = new Map(
    frameworkRoutes
      .filter((route) => route.baseline === 'gallery-dom-equivalent')
      .map((route) => [route.outputPath, route]),
  );

  if (!(await pathExists(roots.dist))) {
    return {
      ok: false,
      checkedFiles: 0,
      problems: [`Missing dist directory: ${roots.dist}`],
    };
  }

  const sourceFiles = await walkFiles(sourceRoot);
  const distFiles = await walkFiles(roots.dist);
  const sourceSet = new Set(sourceFiles);
  const distSet = new Set(distFiles);
  const { missing, extra } = diffSets(sourceSet, distSet);

  for (const item of missing.slice(0, maxProblems)) {
    addProblem(problems, `Dist missing source file: ${item}`);
  }

  for (const item of extra.slice(0, maxProblems)) {
    addProblem(problems, `Dist includes extra file: ${item}`);
  }

  await mapLimit(sourceFiles, 16, async (relativePath) => {
    if (problems.length >= maxProblems || !distSet.has(relativePath)) {
      return;
    }

    const sourcePath = path.join(sourceRoot, toNativePath(relativePath));
    const distPath = path.join(roots.dist, toNativePath(relativePath));
    const [sourceHash, distHash] = await Promise.all([sha256File(sourcePath), sha256File(distPath)]);

    if (sourceHash !== distHash) {
      const equivalentRoute = frameworkEquivalentRoutes.get(relativePath);
      const domEquivalentRoute = frameworkDomEquivalentRoutes.get(relativePath);

      if (equivalentRoute && await htmlFilesEquivalent(sourcePath, distPath, equivalentRoute.htmlMode)) {
        frameworkEquivalentFiles.add(relativePath);
      } else if (domEquivalentRoute && await galleryFilesDomEquivalent(sourcePath, distPath)) {
        frameworkDomEquivalentFiles.add(relativePath);
      } else if (allowedOverrides.has(relativePath)) {
        allowedModifiedFiles.add(relativePath);
      } else {
        addProblem(problems, `Hash mismatch for ${relativePath}`);
      }
    }
  });

  for (const overridePath of allowedOverrides.keys()) {
    if (!sourceSet.has(overridePath)) {
      addProblem(problems, `Override does not match a source file: ${overridePath}`);
    } else if (!allowedModifiedFiles.has(overridePath)) {
      addProblem(problems, `Override is listed but file is unchanged: ${overridePath}`);
    }
  }

  return {
    ok: problems.length === 0,
    checkedFiles: sourceFiles.length,
    allowedModifiedFiles: [...allowedModifiedFiles].sort(),
    frameworkEquivalentFiles: [...frameworkEquivalentFiles].sort(),
    frameworkDomEquivalentFiles: [...frameworkDomEquivalentFiles].sort(),
    problems,
  };
}

export async function verifyBaseline() {
  const [separation, manifest, dist] = await Promise.all([
    verifySeparation(),
    verifyManifest(),
    verifyDist(),
  ]);

  const ok = separation.ok && manifest.ok && dist.ok;

  return {
    ok,
    separation,
    manifest,
    dist,
  };
}

export function formatVerification(result) {
  const lines = [
    `separation: ${result.separation.ok ? 'ok' : 'failed'} (${result.separation.checkedFiles} files)`,
    `manifest: ${result.manifest.ok ? 'ok' : 'failed'} (${result.manifest.checkedFiles} files)`,
    `dist: ${result.dist.ok ? 'ok' : 'failed'} (${result.dist.checkedFiles} files, ${result.dist.allowedModifiedFiles?.length || 0} intentional changes, ${result.dist.frameworkEquivalentFiles?.length || 0} framework-equivalent files, ${result.dist.frameworkDomEquivalentFiles?.length || 0} framework-DOM-equivalent files)`,
  ];

  for (const section of ['separation', 'manifest', 'dist']) {
    for (const problem of result[section].problems) {
      lines.push(`- ${section}: ${problem}`);
    }
  }

  return lines.join('\n');
}
