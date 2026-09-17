import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd(), '../..');
const required = [
  '.astra/README.md', '.astra/team.yaml', '.astra/autonomy.yaml', '.astra/economics.yaml',
  '.astra/agents/root.md', '.astra/agents/scout.md', '.astra/agents/architect.md',
  '.astra/agents/builder.md', '.astra/agents/critic.md', '.astra/agents/qa.md',
  '.astra/contracts/opportunity.schema.json', '.astra/contracts/specification.schema.json',
  '.astra/contracts/builder-result.schema.json', '.astra/contracts/review.schema.json',
  '.astra/contracts/experiment.schema.json'
];

for (const file of required) await access(resolve(root, file));
for (const file of required.filter((f) => f.endsWith('.json'))) {
  JSON.parse(await readFile(resolve(root, file), 'utf8'));
}
console.log(`Astra config OK: ${required.length} required files present; JSON contracts parse.`);
