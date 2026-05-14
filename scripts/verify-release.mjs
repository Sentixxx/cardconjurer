import fsp from 'node:fs/promises';
import path from 'node:path';
import { classifyReleasePath, resolveReleaseConfig } from './build-release.mjs';
import { pathExists, statFile, walkFiles } from './lib/fs.mjs';
import { repoRoot } from './lib/project.mjs';

const configPath = path.join(repoRoot, 'config', 'release-targets.json');

async function readJson(filePath) {
  return JSON.parse(await fsp.readFile(filePath, 'utf8'));
}

async function summarizeFiles(root, files) {
  let totalBytes = 0;

  for (const file of files) {
    totalBytes += (await statFile(root, file)).size;
  }

  return {
    fileCount: files.length,
    totalBytes,
  };
}

function comparePathLists(actual, expected) {
  if (actual.length !== expected.length) {
    return false;
  }

  return actual.every((file, index) => file === expected[index]);
}

function formatSummary(targetName, summary) {
  return `- ${targetName}: ${summary.fileCount} files, ${summary.totalBytes} bytes`;
}

const rawConfig = await readJson(configPath);
const config = resolveReleaseConfig(rawConfig, configPath);
const manifestPath = path.resolve(repoRoot, rawConfig.manifestPath || 'manifests/release-manifest.json');
const deploymentPolicyPath = path.join(repoRoot, 'deploy', 'oss', 'release-policy.json');
const problems = [];
const summaries = [];
const expectedFilesByTarget = new Map(Object.keys(config.targets).map((targetName) => [targetName, []]));

if (!(await pathExists(config.sourceRoot))) {
  problems.push(`Missing release source root: ${path.relative(repoRoot, config.sourceRoot)}`);
} else {
  for (const file of await walkFiles(config.sourceRoot)) {
    expectedFilesByTarget.get(classifyReleasePath(file, config)).push(file);
  }
}

if (!(await pathExists(manifestPath))) {
  problems.push(`Missing release manifest: ${path.relative(repoRoot, manifestPath)}`);
} else {
  const manifest = await readJson(manifestPath);

  for (const [targetName, target] of Object.entries(config.targets)) {
    if (!(await pathExists(target.root))) {
      problems.push(`Missing release target directory: ${path.relative(repoRoot, target.root)}`);
      continue;
    }

    const actualFiles = await walkFiles(target.root);
    const expectedFiles = (manifest.targets?.[targetName]?.files || []).map((entry) => entry.path).sort((a, b) => a.localeCompare(b, 'en'));
    const expectedDistFiles = expectedFilesByTarget.get(targetName);
    const actualSummary = await summarizeFiles(target.root, actualFiles);
    const manifestSummary = {
      fileCount: manifest.targets?.[targetName]?.fileCount,
      totalBytes: manifest.targets?.[targetName]?.totalBytes,
    };
    const misclassified = actualFiles.filter((file) => classifyReleasePath(file, config) !== targetName);

    summaries.push(formatSummary(targetName, actualSummary));

    if (!comparePathLists(actualFiles, expectedFiles)) {
      problems.push(`${targetName} file list does not match ${path.relative(repoRoot, manifestPath)}`);
    }

    if (expectedDistFiles && !comparePathLists(actualFiles, expectedDistFiles)) {
      problems.push(`${targetName} file list does not match current ${path.relative(repoRoot, config.sourceRoot)}`);
    }

    if (actualSummary.fileCount !== manifestSummary.fileCount || actualSummary.totalBytes !== manifestSummary.totalBytes) {
      problems.push(`${targetName} summary does not match ${path.relative(repoRoot, manifestPath)}`);
    }

    if (misclassified.length > 0) {
      problems.push(`${targetName} contains files classified for another target: ${misclassified.slice(0, 10).join(', ')}`);
    }
  }
}

if (await pathExists(deploymentPolicyPath)) {
  const deploymentPolicy = await readJson(deploymentPolicyPath);

  for (const [targetName, target] of Object.entries(config.targets)) {
    const policyTarget = deploymentPolicy.targets?.[targetName];

    if (!policyTarget) {
      problems.push(`Deployment policy missing target: ${targetName}`);
      continue;
    }

    const expectedSource = path.relative(repoRoot, target.root).split(path.sep).join('/');
    if (policyTarget.source !== expectedSource) {
      problems.push(`Deployment policy source mismatch for ${targetName}: ${policyTarget.source} != ${expectedSource}`);
    }
  }
}

if (problems.length > 0) {
  console.log('release: failed');
  for (const problem of problems) {
    console.log(`- ${problem}`);
  }
  process.exitCode = 1;
} else {
  console.log('release: ok');
  for (const summary of summaries) {
    console.log(summary);
  }
}
