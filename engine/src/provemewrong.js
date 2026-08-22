// Prove Me Wrong — give it a hypothesis, it asks the web to break it, through three Bright Data APIs.
//
//   node src/provemewrong.js                                     full run from hypothesis.json → out/verdict-input.json
//   node src/provemewrong.js --hypothesis other.json             another product
//   node src/provemewrong.js --play-snapshot sd_…                reuse an existing Web Scraper snapshot (skip the trigger)
//   node src/provemewrong.js --skip-play                         SERP + Unlocker only
//
//   node src/provemewrong.js --quick "<hypothesis sentence>" --community reddit.com/r/<sub>
//       the 30-second stage path: SERP only, 4 queries (2 gap · 1 refute · 1 competition), one verdict line.
//       Honest label on screen: "first pass — the full run takes four minutes".
//
// Every row records the API that served it. Policy-gated hosts are recorded with Bright Data's error text,
// never hidden. Nothing here invents a quote or a number: the analysis (research.json) is a separate step
// done by a coding agent from the rows in out/.

import './loadenv.js';
import { serp, unlock } from './brightdata.js';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const argv = process.argv.slice(2);
const flag = (f) => argv.includes(f);
const after = (f) => (argv.includes(f) ? argv[argv.indexOf(f) + 1] : undefined);

const ms = (t0) => `${Date.now() - t0} ms`;
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };
const NOT_PRODUCT_HOSTS = /reddit\.com|quora\.com|medium\.com|wikipedia\.org|youtube\.com|nytimes\.com|theguardian\.com|substack\.com|facebook\.com|x\.com|twitter\.com|linkedin\.com|stackexchange\.com|stackoverflow\.com|news\.ycombinator\.com|\.gov\b|\.edu\b|ncbi\.nlm|\.org\b/i;
const PRODUCT_HINT = /\bapps?\b|\btools?\b|\bsoftware\b|\bplatform\b|apps\.apple\.com|play\.google\.com|producthunt|\bpricing\b|\bdownload\b|\bextension\b/i;
const NEGATION = /\b(not|no|never|doesn'?t|don'?t|didn'?t|isn'?t|aren'?t|won'?t|can'?t|fails?|failed|stopped|still|myth|overrated|wrong|false)\b/i;

// ---------------------------------------------------------------------------
// SERP — the argument. Rows carry bucket · query · rank · title · link · snippet (+ paa/related per query).
// ---------------------------------------------------------------------------
async function serpBucket(bucket, query, { onRetry } = {}) {
  const t0 = Date.now();
  try {
    const data = await serp(query, { onRetry });
    const organic = (data.organic ?? []).slice(0, 8).map((r, i) => ({
      bucket, query, rank: r.rank ?? i + 1, title: r.title ?? '', link: r.link ?? '', snippet: (r.description ?? '').slice(0, 400), via: 'serp-api',
    }));
    const meta = {
      bucket, query, via: 'serp-api', ms: Date.now() - t0,
      people_also_ask: (data.people_also_ask ?? []).map((r) => r.question ?? r.text).filter(Boolean),
      related: (data.related ?? []).map((r) => r.text ?? r.query).filter(Boolean),
    };
    return { ok: true, organic, meta };
  } catch (err) {
    return { ok: false, organic: [], meta: { bucket, query, via: 'serp-api', ms: Date.now() - t0, error: err.message.split('\n')[0] } };
  }
}

// ---------------------------------------------------------------------------
// Web Unlocker — the full text of the pages behind the top links (not reddit: that host is KYC-gated).
// ---------------------------------------------------------------------------
function extractPage(html) {
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '').replace(/\s+/g, ' ').trim();
  const meta = (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1]
    ?? html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)?.[1] ?? '').trim();
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ').replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ').trim();
  return { title, meta, text: text.slice(0, 1500) };
}

async function unlockTop(rows, { max = 5 } = {}) {
  const seen = new Set();
  const picks = rows.filter((r) => ['gap', 'competition'].includes(r.bucket) && r.link && !NOT_PRODUCT_HOSTS.test(r.link))
    .sort((a, b) => a.rank - b.rank)
    .filter((r) => { const h = host(r.link); if (!h || seen.has(h)) return false; seen.add(h); return true; })
    .slice(0, max);
  const pages = [];
  for (const r of picks) {
    const t0 = Date.now();
    try {
      const html = await unlock(r.link);
      if (!html.trim()) throw new Error('HTTP 200 with an empty body (host answered the zone with nothing)');
      const page = extractPage(html);
      pages.push({ bucket: r.bucket, query: r.query, link: r.link, host: host(r.link), via: 'web-unlocker', status: 'ok', bytes: html.length, ms: Date.now() - t0, ...page });
      console.log(`  ✓ unlocker · ${host(r.link)} · ${(html.length / 1024).toFixed(0)} KB · ${Date.now() - t0} ms`);
    } catch (err) {
      const error = err.message.split('\n')[0];
      pages.push({ bucket: r.bucket, query: r.query, link: r.link, host: host(r.link), via: 'web-unlocker', status: 'policy-gated-or-failed', ms: Date.now() - t0, error });
      console.log(`  ✗ unlocker · ${host(r.link)} · ${error.slice(0, 110)}`);
    }
  }
  return pages;
}

// ---------------------------------------------------------------------------
// --quick: 4 SERP calls in parallel, one honest verdict line.
// ---------------------------------------------------------------------------
/** The mechanism is the clause after "X want / need / should have …" — that's what competitors build and what
    people complain about. "Developers want an AI code reviewer that blocks merges" → "AI code reviewer that blocks merges". */
function mechanismOf(h) {
  const core = h.replace(/[.!?]+$/, '').trim();
  const m = core.match(/\b(?:wants?|needs?|prefers?|would pay for|are looking for|is looking for|should (?:have|get|be able to use)|ask(?:s)? for|will use|use)\b\s+(.+)$/i);
  let mech = (m ? m[1] : core).trim();
  mech = mech.replace(/^(a|an|the|some|more)\s+/i, '');
  return mech;
}

function quickQueries(h, community) {
  const core = h.replace(/[.!?]+$/, '').trim();
  const mech = mechanismOf(core);
  return [
    { bucket: 'gap', query: core },
    { bucket: 'gap', query: community ? `site:${community} ${mech}` : `${mech} reddit` },
    { bucket: 'refute', query: `${mech} annoying OR useless OR "doesn't work"` },
    { bucket: 'competition', query: `${mech} app OR tool` },
  ];
}

function keyTerms(h) {
  const stop = new Set('a an the of to in on for and or but is are was were be been being that this these those it its with without from by as at into than then there their they them we our you your i my me people want wants need needs who what when where why how do does did will would can could should'.split(' '));
  return [...new Set(h.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !stop.has(w)))];
}

function verdictLine(h, byBucket) {
  const terms = keyTerms(h);
  const overlap = (s) => terms.filter((t) => (s ?? '').toLowerCase().includes(t)).length;
  const gapTop = byBucket.gap[0];
  const refTop = byBucket.refute[0];
  const compTop3 = byBucket.competition.slice(0, 3);
  const held = gapTop ? overlap(`${gapTop.title} ${gapTop.snippet}`) >= Math.min(2, terms.length) : false;
  const refuteAgrees = refTop ? NEGATION.test(`${refTop.title} ${refTop.snippet}`) : false; // the "doesn't work" query found people saying so
  const product = compTop3.find((r) => PRODUCT_HINT.test(`${r.title} ${r.link}`) && !NOT_PRODUCT_HOSTS.test(r.link));
  const parts = [];
  parts.push(held ? 'held — the web talks about this pain in your words' : 'unproven — the top result doesn\'t echo your words');
  parts.push(refuteAgrees ? `pushback on page one — "${(refTop.title || '').slice(0, 70)}"` : 'no pushback on page one');
  parts.push(product ? `mechanism exists — ${host(product.link)} (${(product.title || '').slice(0, 50)})` : 'unclaimed — no product in the top 3 for the mechanism');
  return parts.join(' · ');
}

async function quick() {
  const h = after('--quick');
  const community = after('--community');
  if (!h) { console.log('usage: node src/provemewrong.js --quick "<hypothesis>" --community reddit.com/r/<sub>'); process.exit(1); }
  const t0 = Date.now();
  const qs = quickQueries(h, community);
  console.log(`\n▸ Prove Me Wrong · first pass — the full run takes four minutes`);
  console.log(`  hypothesis: "${h}"${community ? `\n  community:  ${community}` : ''}`);
  console.log(`  4 × POST api.brightdata.com/request { zone: SERP, url: google.com/search?q=…&brd_json=1 }  (in parallel)\n`);
  const results = await Promise.all(qs.map((q) => serpBucket(q.bucket, q.query, {
    onRetry: ({ attempt, reason }) => console.log(`  … [${q.bucket}] google answered "${reason}" — retry ${attempt}`),
  })));
  const byBucket = { gap: [], refute: [], competition: [] };
  for (const r of results) byBucket[r.meta.bucket].push(...r.organic);
  for (const r of results) {
    const top = r.organic[0];
    console.log(`  [${r.meta.bucket.padEnd(11)}] ${r.meta.query}`);
    if (!r.ok) console.log(`      ! ${r.meta.error}`);
    else if (!top) console.log(`      (no organic results)`);
    else {
      console.log(`      #1 ${top.title}`);
      console.log(`         ${top.link}`);
      if (top.snippet) console.log(`         “${top.snippet.replace(/\s+/g, ' ').slice(0, 150)}…”`);
    }
  }
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n  verdict (first pass): ${verdictLine(h, byBucket)}`);
  console.log(`  ${results.length - failed}/${results.length} queries answered · ${ms(t0)} · via Bright Data SERP API${failed ? ` · ${failed} failed (google blocked the zone; retries exhausted)` : ''}\n`);
  await mkdir('out', { recursive: true });
  const cache = await readFile('out/quick-cache.json', 'utf8').then(JSON.parse).catch(() => ({}));
  if (results.some((r) => r.ok)) {
    cache[h] = { at: new Date().toISOString(), community, rows: results.flatMap((r) => r.organic), meta: results.map((r) => r.meta), verdict: verdictLine(h, byBucket) };
    await writeFile('out/quick-cache.json', JSON.stringify(cache, null, 2));
  }
}

// ---------------------------------------------------------------------------
// full run
// ---------------------------------------------------------------------------
async function full() {
  const file = after('--hypothesis') ?? 'hypothesis.json';
  const H = JSON.parse(await readFile(file, 'utf8'));
  const t0 = Date.now();
  console.log(`▸ Prove Me Wrong · ${H.product} · ${file}\n`);
  await mkdir('out', { recursive: true });

  // 1 · SERP — the argument
  console.log('1/3 SERP API — the argument');
  const buckets = H.queries ?? {};
  const plan = [];
  for (const b of ['gap', 'refute', 'competition']) for (const q of buckets[b] ?? []) plan.push({ bucket: b, query: q });
  if (plan.length < 12 || (buckets.refute ?? []).length < 4) console.warn(`  ! bar: ≥ 12 queries and ≥ 4 refute — got ${plan.length} / ${(buckets.refute ?? []).length}`);
  const serpRows = [], serpMeta = [];
  for (const q of plan) {
    const r = await serpBucket(q.bucket, q.query, { onRetry: ({ attempt, reason }) => console.log(`    … "${reason}" — retry ${attempt}`) });
    serpRows.push(...r.organic); serpMeta.push(r.meta);
    console.log(`  ${r.ok ? '✓' : '✗'} [${q.bucket}] ${q.query} — ${r.organic.length} results · ${r.meta.ms} ms${r.ok ? '' : ` · ${r.meta.error.slice(0, 80)}`}`);
  }
  const serpOk = serpMeta.filter((m) => !m.error).length;

  // 2 · Web Unlocker — the full text
  console.log('\n2/3 Web Unlocker — full text behind the top links');
  const pages = await unlockTop(serpRows, { max: 5 });
  const unlockOk = pages.filter((p) => p.status === 'ok').length;

  // 3 · Web Scraper API — reviews at scale
  let play = null;
  if (!flag('--skip-play') && H.apps?.play?.length) {
    console.log('\n3/3 Web Scraper API — Google Play reviews');
    const { collectPlayReviews } = await import('./play.js');
    try {
      play = await collectPlayReviews({ snapshotId: after('--play-snapshot') });
      console.log(`  ✓ ${play.counts.reviews} reviews · ${play.counts.negativeAtOrBelow3} negative (≤ 3) · via ${play.api}${play.snapshot_id ? ` · snapshot ${play.snapshot_id}` : ''}`);
    } catch (err) {
      console.log(`  ✗ scraper: ${err.message.split('\n')[0]} — falling back to Web Unlocker on the Play pages`);
      try { play = await collectPlayReviews({ unlocker: true }); } catch (err2) { console.log(`  ✗ unlocker fallback: ${err2.message.split('\n')[0]}`); }
    }
  } else console.log('\n3/3 Web Scraper API — skipped');

  const summary = `serp ${serpRows.length} rows (${serpOk}/${plan.length} queries) · unlocker ${unlockOk}/${pages.length} pages (${pages.length - unlockOk} gated/failed) · scraper ${play ? `${play.counts.reviews} reviews via ${play.api}` : 'skipped'}`;
  const out = {
    product: H.product, url: H.url, hypotheses: H.hypotheses, community: H.community, competitors: H.competitors,
    collected: new Date().toISOString(), ms: Date.now() - t0, summary,
    serp: { queries: serpMeta, rows: serpRows },
    unlocker: { pages },
    scraper: play ? { via: play.via, api: play.api, dataset_id: play.dataset_id, snapshot_id: play.snapshot_id, counts: play.counts, reviews: play.reviews } : null,
  };
  await writeFile('out/verdict-input.json', JSON.stringify(out, null, 2));
  console.log(`\n→ out/verdict-input.json\n  ${summary} · ${ms(t0)}`);
  console.log('  next: the coding agent reads out/verdict-input.json (+ out/corpus.json for App Store reviews) and writes out/research.json; then node src/verify.js && node src/run.js --inject-only');
}

if (flag('--quick')) await quick(); else await full();
