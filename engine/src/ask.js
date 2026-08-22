// Live-demo helper: one Bright Data SERP API call, printed for a room.
//   node src/ask.js "meditate every day but still reactive"
//   node src/ask.js --cached "<query>"     print the last successful answer for that query (offline)
//
// Every successful call is saved to out/ask-cache.json. If Google is captcha-ing the zone and all
// retries fail, the cached answer is printed instead — clearly labelled, never silently.
import './loadenv.js';
import { serp } from './brightdata.js';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const argv = process.argv.slice(2);
const cachedOnly = argv.includes('--cached');
const q = argv.filter((a) => a !== '--cached').join(' ') || 'meditate every day but still reactive';
const CACHE = 'out/ask-cache.json';
const cache = await readFile(CACHE, 'utf8').then(JSON.parse).catch(() => ({}));

function print(data, { ms, cachedAt }) {
  const organic = (data.organic ?? []).slice(0, 8);
  const tag = cachedAt ? `CACHED · collected ${cachedAt} · network unavailable right now` : `${ms} ms`;
  console.log(`  ${organic.length} organic results · ${tag} · parsed by Bright Data, zero HTML touched\n`);
  for (const r of organic) {
    console.log(`  #${String(r.rank ?? '').padEnd(2)} ${r.title}`);
    console.log(`      ${r.link}`);
    if (r.description) console.log(`      “${r.description.replace(/\s+/g, ' ').slice(0, 160)}…”`);
  }
  const paa = (data.people_also_ask ?? []).map((r) => r.question ?? r.text).filter(Boolean);
  const related = (data.related ?? []).map((r) => r.text ?? r.query).filter(Boolean);
  if (paa.length) console.log(`\n  people also ask → ${paa.slice(0, 4).join(' · ')}`);
  if (related.length) console.log(`  related searches → ${related.slice(0, 6).join(' · ')}`);
  console.log();
}

process.stdout.write(`\n▸ POST https://api.brightdata.com/request\n  { zone: SERP, url: google.com/search?q=${JSON.stringify(q)}&brd_json=1 }\n\n`);

if (!cachedOnly) {
  const t0 = Date.now();
  try {
    const data = await serp(q, {
      onRetry: ({ attempt, reason, waitMs }) =>
        console.log(`  … google answered the zone with "${reason}" — retry ${attempt}${waitMs ? ` after ${waitMs / 1000} s` : ''}`),
    });
    print(data, { ms: Date.now() - t0 });
    await mkdir('out', { recursive: true });
    cache[q] = { cachedAt: new Date().toISOString().slice(0, 10), data };
    await writeFile(CACHE, JSON.stringify(cache, null, 2));
    process.exit(0);
  } catch (err) {
    console.log(`  ! ${err.message.split('\n')[0]}\n`);
  }
}

const hit = cache[q] ?? cache[Object.keys(cache).find((k) => k.toLowerCase().includes(q.toLowerCase().split(' ').slice(0, 3).join(' '))) ?? ''];
if (hit) {
  print(hit.data, { cachedAt: hit.cachedAt });
} else {
  console.log(`  no cached answer for this query — run it once on a good connection, or read slide 8.\n`);
  process.exit(1);
}
