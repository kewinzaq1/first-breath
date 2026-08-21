// Zero-dependency .env loader.
// Node only reads .env files when launched with --env-file=.env — easy to forget,
// and `npm start` never passed it. Importing this module first makes a plain
// `node src/run.js` work from any directory.
//
// Looks for .env in: current working dir → engine/ → repo root (first found wins).
// Existing process.env values are never overridden. Supports comments, blank
// lines, `export KEY=…`, quoted values, CRLF line endings, and a BOM.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const candidates = [
  path.resolve(process.cwd(), '.env'),
  fileURLToPath(new URL('../.env', import.meta.url)), // engine/.env
  fileURLToPath(new URL('../../.env', import.meta.url)), // repo-root .env
];

for (const file of candidates) {
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip BOM
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim().replace(/^export\s+/, '');
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"') && val.length >= 2) ||
      (val.startsWith("'") && val.endsWith("'") && val.length >= 2)
    ) {
      val = val.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = val;
  }
  console.log(`  (env loaded from ${file})`);
  break;
}
