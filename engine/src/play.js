// Third API: Google Play reviews through the Bright Data Web Scraper API.
//
//   node src/play.js                      trigger the "Google Play Store reviews" scraper for the
//                                         three apps, wait for the snapshot, write out/play-reviews.json
//   node src/play.js --snapshot <id>      skip the trigger; collect an already-triggered snapshot
//   node src/play.js --unlocker           fallback: fetch the three Play pages through Web Unlocker
//                                         and extract the reviews embedded in the page HTML
//   --out <file>                          where to write (default out/play-reviews.json)
//
// The output file records which path actually served (`via`), so the page and the talk can
// credit the API honestly — the same rule collect.js follows for the Apple feed.

import './loadenv.js';
import { triggerDataset, waitForSnapshot, unlock } from './brightdata.js';
import { writeFile, mkdir } from 'node:fs/promises';

// Bright Data → Web Scrapers → Google Play Store reviews (found via GET /datasets/list)
export const DATASET_ID = process.env.BRIGHTDATA_PLAY_REVIEWS_DATASET ?? 'gd_m6zagkt024uwvvwuyu';

export const APPS = [
  { name: 'Calm', id: 'com.calm.android' },
  { name: 'Headspace', id: 'com.getsomeheadspace.android' },
  { name: 'Waking Up', id: 'org.wakingup.android' },
];
const playUrl = (id) => `https://play.google.com/store/apps/details?id=${id}&hl=en&gl=us`;
const appName = (row) => APPS.find((a) => (row.url ?? row.input?.url ?? '').includes(a.id))?.name ?? row.app_name ?? row.app ?? '';

const argv = process.argv.slice(2);
const flag = (f) => argv.includes(f);
const after = (f) => (argv.includes(f) ? argv[argv.indexOf(f) + 1] : undefined);

/** Normalize a Web Scraper API row into the corpus review shape. */
function normalize(row) {
  const rating = Number(row.rating ?? row.review_rating ?? row.score ?? row.stars);
  const text = String(row.review ?? row.review_text ?? row.content ?? row.text ?? '').trim();
  return {
    app: appName(row),
    rating: Number.isFinite(rating) ? rating : null,
    title: String(row.title ?? row.review_title ?? '').trim(),
    text: text.slice(0, 600),
    date: row.review_date ?? row.date ?? row.timestamp ?? null,
    author: row.reviewer_name ?? row.author ?? row.user_name ?? null,
    helpful: row.found_helpful ?? row.likes ?? row.thumbs_up ?? row.helpful_count ?? null,
  };
}

async function viaWebScraperApi() {
  let snapshotId = after('--snapshot');
  if (!snapshotId) {
    const inputs = APPS.map((a) => ({ url: playUrl(a.id) }));
    console.log(`▸ POST https://api.brightdata.com/datasets/v3/trigger?dataset_id=${DATASET_ID}&limit_per_input=100`);
    console.log(`  ${JSON.stringify(inputs)}`);
    snapshotId = await triggerDataset(DATASET_ID, inputs, { limit_per_input: '100' });
    console.log(`  → snapshot_id ${snapshotId}  (resume later with: node src/play.js --snapshot ${snapshotId})\n`);
  }
  console.log(`▸ GET https://api.brightdata.com/datasets/v3/progress/${snapshotId}  (polling every 10 s)`);
  const t0 = Date.now();
  const rows = await waitForSnapshot(snapshotId, {
    pollMs: 10000,
    timeoutMs: Number(after('--timeout') ?? 20 * 60 * 1000),
    onProgress: (p, ms) => console.log(`  … ${p.status}${p.records != null ? ` · ${p.records} records` : ''}${p.error ? ` (${p.error})` : ''} · ${Math.round(ms / 1000)} s`),
  });
  const list = Array.isArray(rows) ? rows : rows?.data ?? [];
  console.log(`  ✓ snapshot ready · ${list.length} rows · ${Math.round((Date.now() - t0) / 1000)} s\n`);
  const errors = list.filter((r) => r.error || r.warning);
  if (errors.length) console.warn(`  ! ${errors.length} rows carry an error/warning, e.g. ${JSON.stringify(errors[0]).slice(0, 200)}`);
  return { via: 'web-scraper-api', snapshotId, raw: list, reviews: list.filter((r) => !r.error).map(normalize).filter((r) => r.text) };
}

/** Fallback: the Play page resolves through Web Unlocker (verified 200, ~1.2 MB). Reviews are embedded
    in the page's AF_initDataCallback payloads; pull out (rating, text) pairs from the "ds:8"-style blob. */
function extractEmbeddedReviews(html, app) {
  const out = [];
  // Each review object in the embedded data carries a 5-element rating cell and the review text as a
  // long string. The pattern below is deliberately conservative: a quoted review body ≥ 40 chars that is
  // followed within the same array by a small integer rating.
  const re = /\["[^"]{8,80}",\s*"[^"]*",\s*\[[^\]]*\][^\]]*\],\s*(\d),\s*null,\s*(?:\d+|null),\s*"((?:[^"\\]|\\.){40,2000})"/g;
  let m;
  while ((m = re.exec(html))) {
    let text;
    try { text = JSON.parse(`"${m[2]}"`); } catch { continue; }
    out.push({ app, rating: Number(m[1]), title: '', text: text.slice(0, 600), date: null, author: null, helpful: null });
  }
  return out;
}

async function viaUnlocker() {
  const reviews = [];
  const pages = [];
  for (const a of APPS) {
    const url = playUrl(a.id);
    console.log(`▸ POST https://api.brightdata.com/request  { zone: UNLOCKER, url: ${url} }`);
    const t0 = Date.now();
    const html = await unlock(url);
    const found = extractEmbeddedReviews(html, a.name);
    pages.push({ app: a.name, url, bytes: html.length, ms: Date.now() - t0, reviews: found.length });
    console.log(`  ✓ ${a.name} · ${(html.length / 1024).toFixed(0)} KB · ${Date.now() - t0} ms · ${found.length} embedded reviews`);
    reviews.push(...found);
  }
  return { via: 'web-unlocker', pages, reviews };
}

await mkdir('out', { recursive: true });
const result = flag('--unlocker') ? await viaUnlocker() : await viaWebScraperApi();
const { reviews } = result;
const negative = reviews.filter((r) => r.rating != null && r.rating <= 2);
const negative3 = reviews.filter((r) => r.rating != null && r.rating <= 3); // same definition collect.js/clusters.js use for Apple
const perApp = Object.fromEntries(APPS.map((a) => [a.name, reviews.filter((r) => r.app === a.name).length]));

const file = {
  collected: new Date().toISOString().slice(0, 10),
  via: result.via,
  api: result.via === 'web-scraper-api' ? 'Web Scraper API' : 'Web Unlocker API',
  dataset_id: result.via === 'web-scraper-api' ? DATASET_ID : undefined,
  snapshot_id: result.snapshotId,
  pages: result.pages,
  apps: APPS,
  counts: { reviews: reviews.length, negative: negative.length, negativeDefinition: 'rating ≤ 2', negativeAtOrBelow3: negative3.length, perApp },
  reviews,
  raw: result.raw,
};
const outFile = after('--out') ?? 'out/play-reviews.json';
await writeFile(outFile, JSON.stringify(file, null, 2));
console.log(`→ ${outFile}`);
console.log(`  ${reviews.length} Google Play reviews (${APPS.map((a) => `${a.name} ${perApp[a.name]}`).join(' · ')}) — ${negative.length} negative at rating ≤ 2, ${negative3.length} at ≤ 3 · via ${file.api}`);
