import { collectMigrationStatus, formatMigrationStatus } from './lib/migration-status.mjs';

const strict = process.argv.includes('--strict');
const status = await collectMigrationStatus();

console.log(formatMigrationStatus(status));

if (status.structuralProblems.length > 0 || (strict && !status.complete)) {
  process.exitCode = 1;
}
