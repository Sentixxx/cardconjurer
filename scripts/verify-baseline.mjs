import { formatVerification, verifyBaseline } from './lib/verify.mjs';

const result = await verifyBaseline();
console.log(formatVerification(result));

if (!result.ok) {
  process.exitCode = 1;
}
