import Ajv from 'ajv';
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const requirePatch = process.argv.includes('--require-patch');
const root = resolve(process.cwd(), '../..');
const out = resolve(root, '.astra-run');
const ajv = new Ajv({ allErrors: true, strict: false });

const contracts = [
  ['opportunity.json', '.astra/contracts/opportunity.schema.json'],
  ['specification.json', '.astra/contracts/specification.schema.json'],
  ['builder-a.json', '.astra/contracts/builder-result.schema.json'],
  ['builder-b.json', '.astra/contracts/builder-result.schema.json'],
  ['review.json', '.astra/contracts/review.schema.json']
];

for (const file of ['qa.md', 'summary.md']) await access(resolve(out, file));
if (requirePatch) await access(resolve(out, 'changes.patch'));

for (const [outputName, schemaPath] of contracts) {
  const data = JSON.parse(await readFile(resolve(out, outputName), 'utf8'));
  const schema = JSON.parse(await readFile(resolve(root, schemaPath), 'utf8'));
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    console.error(`${outputName} failed contract validation:`);
    console.error(validate.errors);
    process.exit(3);
  }
}
console.log(`Astra outputs OK: ${contracts.length} JSON contracts validated${requirePatch ? '; patch present' : ''}.`);
