// Integrity check for the demo — run before going on stage.
//
//   node src/verify.js
//
// 1. every quotes[].text in out/research.json is verbatim (per … fragment) in one of the corpora
// 2. clusters[] in out/research.json equal what src/clusters.js computes from out/corpus.json
// 3. the research-data blob inside ../page/index.html is byte-identical to {sources, quotes, clusters}
// 4. the source cards' counts match the corpora
// Exit code 1 on any failure, so it can gate a commit or a republish.

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { CLASSES, computeClusters, negative } from './clusters.js';

// same contract as run.js inject() — kept in one place so the two can never drift
function blobOf(research) {
  const { sources, quotes, clusters, product, hypotheses, verdict, counter_evidence } = research;
  const blob = { sources, quotes, clusters };
  if (product) blob.product = product;
  if (hypotheses) blob.hypotheses = hypotheses;
  if (verdict) blob.verdict = verdict;
  if (counter_evidence) blob.counter_evidence = counter_evidence;
  return blob;
}

const norm = (s) => String(s ?? '').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
const research = JSON.parse(await readFile('out/research.json', 'utf8'));
const corpus = JSON.parse(await readFile('out/corpus.json', 'utf8'));
const sweep = JSON.parse(await readFile('out/moment-serp.json', 'utf8'));
const play = existsSync('out/play-reviews.json') ? JSON.parse(await readFile('out/play-reviews.json', 'utf8')) : { reviews: [] };

const haystack = [
  ...corpus.reviews.map((r) => `${r.title} ${r.text}`),
  ...corpus.threads.map((t) => `${t.title} ${t.text}`),
  ...corpus.serpRows.map((r) => `${r.title ?? ''} ${r.snippet ?? ''}`),
  ...sweep.rows.map((r) => `${r.title ?? ''} ${r.snippet ?? ''}`),
  ...play.reviews.map((r) => `${r.title} ${r.text}`),
].map(norm);

let failures = 0;
const ok = (msg) => console.log(`  ✓ ${msg}`);
const bad = (msg) => { failures++; console.log(`  ✗ ${msg}`); };

console.log('1. quotes verbatim');
for (const q of research.quotes) {
  const frags = norm(q.text).split('…').map((f) => f.trim()).filter((f) => f.length > 0);
  const missing = frags.filter((f) => !haystack.some((h) => h.includes(f)));
  if (missing.length) bad(`not verbatim: "${q.text.slice(0, 60)}…" — fragment not found: "${missing[0]}"`);
  else ok(`"${q.text.slice(0, 60)}…" (${q.src})`);
}

console.log('2. clusters computed');
const computed = computeClusters(negative(corpus.reviews, 3));
for (const c of research.clusters) {
  const m = computed.find((x) => x.label === c.label);
  if (!m) bad(`cluster "${c.label}" has no class in src/clusters.js`);
  else if (m.pct !== c.pct) bad(`cluster "${c.label}": research.json says ${c.pct}, clusters.js computes ${m.pct} (${m.count}/${m.n})`);
  else ok(`${c.label} ${c.pct} = ${m.count}/${m.n}`);
}
if (research.clusters.length !== CLASSES.length) bad(`research.json has ${research.clusters.length} clusters, clusters.js defines ${CLASSES.length}`);

console.log('3. page blob');
const pagePath = ['../page/index.html', './index.html'].find((p) => existsSync(p));
if (!pagePath) bad('page not found');
else {
  const html = await readFile(pagePath, 'utf8');
  const m = html.match(/<script id="research-data" type="application\/json">\s*([\s\S]*?)\s*<\/script>/);
  if (!m) bad('no research-data block in page');
  else {
    const expected = JSON.stringify(blobOf(research), null, 2);
    if (m[1] === expected) ok('page blob is byte-identical to research.json (sources, quotes, clusters' + (research.product ? ', product, hypotheses, verdict, counter_evidence' : '') + ')');
    else bad('page blob differs from research.json — run: node src/run.js --inject-only');
  }
}

console.log('4. counts on the source cards');
const nums = (s) => (s.match(/\d+/g) ?? []).map(Number);
const card0 = nums(research.sources[0].what);
const expect0 = [corpus.reviews.length, play.reviews.length, negative(corpus.reviews, 3).length, negative(play.reviews, 3).length];
if (card0.join() === expect0.join()) ok(`reviews card: ${expect0.join(' / ')}`);
else bad(`reviews card numbers ${card0.join('/')} ≠ corpus ${expect0.join('/')}`);
const card1 = nums(research.sources[1].what)[0];
if (card1 === corpus.threads.length) ok(`threads card: ${card1}`); else bad(`threads card ${card1} ≠ ${corpus.threads.length}`);
const card2 = nums(research.sources[2].what);
const sweepOrganic = sweep.rows.filter((r) => r.rank).length, sweepQueries = new Set(sweep.rows.map((r) => r.query)).size;
if (card2[0] === sweep.rows.length && card2[1] === sweepQueries) ok(`sweep card: ${sweep.rows.length} rows (${sweepOrganic} organic) from ${sweepQueries} queries`);
else bad(`sweep card ${card2.join('/')} ≠ ${sweep.rows.length}/${sweepQueries}`);

console.log(failures ? `\n${failures} problem(s).` : '\nAll green — every quote verbatim, every number computed, page in sync.');
process.exit(failures ? 1 : 0);
