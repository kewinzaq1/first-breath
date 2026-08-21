// Orchestrator: collect (Bright Data) → analyze (Claude) → inject into the page.
//
//   node src/run.js                 collect + analyze + inject
//   node src/run.js --collect-only  just collect → out/corpus.json (no Anthropic key needed)
//   node src/run.js --inject-only   skip collect/analyze; inject an existing out/research.json
//
// If the analysis step fails (e.g. no API credits), the run writes the full
// prompt to out/analysis-prompt.md — paste it into Claude (claude.ai), save the
// JSON reply as out/research.json, then run with --inject-only.
//
// The landing page (page/index.html) holds its data in
// <script id="research-data" type="application/json">…</script>.
// This script replaces that blob in place — republish the page and the story
// is running on real market data.

import './loadenv.js'; // must stay the first import — loads .env for everything below
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

// Run from engine/ — the page lives one level up in page/.
const PAGE_PATHS = ['../page/index.html', './index.html'];
const collectOnly = process.argv.includes('--collect-only');
const injectOnly = process.argv.includes('--inject-only');

console.log('▸ First Breath research engine\n');

/** The page's data contract: sources/quotes/clusters always; Prove Me Wrong fields when present. */
export function blobOf(research) {
  const { sources, quotes, clusters, product, hypotheses, verdict, counter_evidence } = research;
  const blob = { sources, quotes, clusters };
  if (product) blob.product = product;
  if (hypotheses) blob.hypotheses = hypotheses;
  if (verdict) blob.verdict = verdict;
  if (counter_evidence) blob.counter_evidence = counter_evidence;
  return blob;
}

async function inject(research) {
  console.log('3/3 Injecting into landing page…');
  const pagePath = PAGE_PATHS.find((p) => existsSync(p));
  if (!pagePath) {
    console.log('  ! landing page not found next to the engine — paste out/research.json into');
    console.log('    the <script id="research-data"> block of page/index.html by hand.');
    return;
  }
  const html = await readFile(pagePath, 'utf8');
  const re = /(<script id="research-data" type="application\/json">)[\s\S]*?(<\/script>)/;
  if (!re.test(html)) {
    console.log(`  ! no research-data block in ${pagePath} — is this the data-driven version of the page?`);
    return;
  }
  const blob = JSON.stringify(blobOf(research), null, 2);
  await writeFile(pagePath, html.replace(re, `$1\n${blob}\n$2`));
  console.log(`  ✓ injected into ${pagePath} — republish the page and the story runs on real data.`);
}

if (injectOnly) {
  const research = JSON.parse(await readFile('out/research.json', 'utf8'));
  await inject(research);
  process.exit(0);
}

console.log('1/3 Collecting via Bright Data…');
const { collectAppReviews, collectRedditThreads, collectSerpLandscape } = await import('./collect.js');

const reviews = await collectAppReviews();
const threads = await collectRedditThreads();
const serpRows = await collectSerpLandscape();

await mkdir('out', { recursive: true });
await writeFile('out/corpus.json', JSON.stringify({ reviews, threads, serpRows }, null, 2));
console.log(`  → out/corpus.json (${reviews.length} reviews · ${threads.length} threads · ${serpRows.length} serp rows)\n`);

if (reviews.length + threads.length + serpRows.length === 0) {
  console.error('Nothing collected — fix the warnings above before analyzing.');
  process.exit(1);
}
if (collectOnly) {
  console.log('Collect-only mode: done.');
  process.exit(0);
}

console.log('2/3 Analyzing with Claude…');
const { analyze, buildPrompt } = await import('./analyze.js');
let research;
try {
  research = await analyze({ reviews, threads, serpRows });
} catch (err) {
  const firstLine = String(err.message ?? err).split('\n')[0];
  console.error(`  ! analysis failed: ${firstLine}\n`);
  const prompt = buildPrompt({ reviews, threads, serpRows });
  await writeFile('out/analysis-prompt.md', prompt);
  console.log('  Plan B (no API credits needed):');
  console.log('    1. Open out/analysis-prompt.md and paste its contents into Claude (claude.ai)');
  console.log('    2. Save Claude\'s JSON reply as out/research.json');
  console.log('    3. Run: node src/run.js --inject-only');
  process.exit(1);
}

await writeFile('out/research.json', JSON.stringify(research, null, 2));
console.log('  → out/research.json');
console.log('  insights:');
for (const i of research.insights ?? []) console.log(`    · ${i}`);
console.log();

await inject(research);
