// The cluster method, in code — so every percentage on the page is reproducible.
//
//   node src/clusters.js            prints the shares for out/corpus.json (Apple) and out/play-reviews.json
//
// Method: a review is "negative" at rating ≤ 3 (Apple) — Play is reported at both ≤ 2 and ≤ 3.
// Each class is one case-insensitive regex over title + text; classes are NOT exclusive
// (a review that rages about paying for a cluttered app counts in both), so shares need not sum to 100.
// Percentages are rounded to whole numbers. Change a regex here and the page, deck and talk must be rerun.

import { readFile } from 'node:fs/promises';

export const CLASSES = [
  {
    label: 'Paywall fatigue',
    // paying, being charged, subscriptions, trials that convert, refunds, cancellation
    re: /subscri|paywall|\bpay\b|\bpays\b|paying|paid|price|\$\d|charg|refund|billing|billed|cancel|expensive|greedy|scam|renew|money/i,
  },
  {
    label: 'Choice overload',
    // too much to choose from, cannot find or navigate, decision fatigue
    re: /overwhelm|too many|so many|too much|choos|choice|options|clutter|confus|navigat|decision|menu|(hard|impossible|no way|difficult|unable) to find|(can'?t|cannot|couldn'?t) find|search/i,
  },
  {
    label: 'Lost simplicity',
    // it used to be simple; the redesign / update made it worse
    re: /simpl|used to (be|love|work|have)|old version|redesign|new (design|layout|version|ui|update|interface)|latest update|recent update|bloat|complicated|ruined|interface|worse/i,
  },
];

export const negative = (reviews, maxRating = 3) => reviews.filter((r) => r.rating != null && r.rating <= maxRating);

/** → [{ label, count, pct, of }] for the given negative reviews. */
export function computeClusters(negRows, of = 'of negative reviews') {
  const n = negRows.length;
  return CLASSES.map(({ label, re }) => {
    const count = negRows.filter((r) => re.test(`${r.title ?? ''} ${r.text ?? ''}`)).length;
    return { label, count, n, pct: `${Math.round((100 * count) / n)}%`, of };
  });
}

export const describeMethod = () =>
  `keyword-class share of negative reviews (rating ≤ 3), classes non-exclusive, computed by src/clusters.js: ` +
  CLASSES.map((c) => `${c.label} = ${c.re}`).join(' · ');

if (process.argv[1] && process.argv[1].endsWith('clusters.js')) {
  const fmt = (rows) => rows.map((c) => `${c.label} ${c.pct} (${c.count}/${c.n})`).join(' · ');
  const corpus = JSON.parse(await readFile('out/corpus.json', 'utf8'));
  console.log(`Apple (${corpus.reviews.length} reviews, rating ≤ 3): ${fmt(computeClusters(negative(corpus.reviews, 3)))}`);
  try {
    const play = JSON.parse(await readFile('out/play-reviews.json', 'utf8'));
    console.log(`Google Play (${play.reviews.length} reviews, rating ≤ 3): ${fmt(computeClusters(negative(play.reviews, 3)))}`);
    console.log(`Google Play (${play.reviews.length} reviews, rating ≤ 2): ${fmt(computeClusters(negative(play.reviews, 2)))}`);
  } catch {
    console.log('(no out/play-reviews.json yet — run node src/play.js)');
  }
}
