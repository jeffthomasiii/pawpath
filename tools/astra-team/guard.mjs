import { execFileSync } from 'node:child_process';

const protectedPrefixes = ['.astra/', '.github/workflows/', '.github/CODEOWNERS', '.env'];
const changed = execFileSync('git', ['diff', '--name-only', '--cached'], { encoding: 'utf8' })
  .split(/\r?\n/).filter(Boolean);
const blocked = changed.filter((file) => protectedPrefixes.some((prefix) => file === prefix || file.startsWith(prefix)));
if (blocked.length) {
  console.error('Astra guard blocked protected paths:\n' + blocked.map((f) => `- ${f}`).join('\n'));
  process.exit(2);
}
console.log(`Astra guard OK: ${changed.length} staged file(s), no protected paths.`);
