// Live-demo helper: one Bright Data SERP API call, printed for a room.
//   node src/ask.js "meditate every day but still reactive"
import './loadenv.js';
import { serp } from './brightdata.js';

const q = process.argv.slice(2).join(' ') || 'meditate every day but still reactive';
const t0 = Date.now();
process.stdout.write(`\n▸ POST https://api.brightdata.com/request\n  { zone: SERP, url: google.com/search?q=${JSON.stringify(q)}&brd_json=1 }\n\n`);
const data = await serp(q);
const ms = Date.now() - t0;
const organic = (data.organic ?? []).slice(0, 8);
console.log(`  ${organic.length} organic results · ${ms} ms · parsed by Bright Data, zero HTML touched\n`);
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
