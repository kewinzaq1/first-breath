// Orchestrator: collect (Bright Data) → analyze (Claude) → inject into the page.
//
//   node src/run.js                 collect + analyze + write out/research.json + inject
//   node src/run.js --collect-only  just collect, write out/corpus.json (no Anthropic key needed)
//
// The landing page (page/index.html) holds its data in
// <script id="research-data" type="application/json">…</script>.
// This script replaces that blob in place — republish the page and the story
// is running on real market data.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { collectAppReviews, collectRedditThreads, collectSerpLandscape } from './collect.js';

// Run from engine/ — the page lives one level up in page/.
const PAGE_PATHS = ['../page/index.html', './index.html'];
const collectOnly = process.argv.includes('--collect-only');

console.log('▸ First Breath research engine\n');
console.log('1/3 Collecting via Bright Data…');

const [reviews, threads, serpRows] = [
  await collectAppReviews(),
  await collectRedditThreads(),
  await collectSerpLandscape(),
];

await mkdir('out', { recursive: true });
await writeFile('out/corpus.json', JSON.stringify({ reviews, threads, serpRows }, null, 2));
console.log(`  → out/corpus.json (${reviews.length} reviews · ${threads.length} threads · ${serpRows.length} serp rows)\n`);

if (collectOnly) {
  console.log('Collect-only mode: done.');
  process.exit(0);
}

console.log('2/3 Analyzing with Claude…');
const { analyze } = await import('./analyze.js');
const research = await analyze({ reviews, threads, serpRows });
await writeFile('out/research.json', JSON.stringify(research, null, 2));
console.log('  → out/research.json');
console.log('  insights:');
for (const i of research.insights ?? []) console.log(`    · ${i}`);
console.log();

console.log('3/3 Injecting into landing page…');
const pagePath = PAGE_PATHS.find((p) => existsSync(p));
if (!pagePath) {
  console.log('  ! landing page not found next to the engine — paste out/research.json into');
  console.log('    the <script id="research-data"> block of index.html by hand.');
} else {
  const html = await readFile(pagePath, 'utf8');
  const re = /(<script id="research-data" type="application\/json">)[\s\S]*?(<\/script>)/;
  if (!re.test(html)) {
    console.log(`  ! no research-data block in ${pagePath} — is this the data-driven version of the page?`);
  } else {
    const { sources, quotes, clusters } = research;
    const blob = JSON.stringify({ sources, quotes, clusters }, null, 2);
    await writeFile(pagePath, html.replace(re, `$1\n${blob}\n$2`));
    console.log(`  ✓ injected into ${pagePath} — republish the page and the story runs on real data.`);
  }
}
