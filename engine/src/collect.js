// The three research fan-outs from the landing page's "asking the web" scene.
// Each returns plain JS objects ready for the analysis step.
//
// Resilience model: Bright Data zones are the primary path; every collector has
// a fallback so a zone restriction never zeroes out a source.
//   reviews : Web Unlocker → direct fetch (Apple's feed is a public API)
//   reddit  : Web Unlocker → SERP site:reddit.com search (needs only the SERP zone)
//   serp    : SERP zone (no fallback needed — it's the base capability)

import { unlock, unlockJson, serp } from './brightdata.js';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

/** Try Web Unlocker first; fall back to a direct fetch for public endpoints.
    Tracks which path served, so the demo can attribute sources honestly. */
export const pathStats = { unlocker: 0, direct: 0 };

async function jsonViaUnlockerOrDirect(url) {
  let unlockerErr;
  try {
    const data = await unlockJson(url);
    pathStats.unlocker++;
    return data;
  } catch (err) {
    unlockerErr = err;
  }
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/json' },
    signal: AbortSignal.timeout(20000),
  });
  const text = await res.text();
  if (!res.ok || !text.trim()) {
    throw new Error(`unlocker: ${unlockerErr.message} | direct: HTTP ${res.status}${text.trim() ? '' : ' empty'}`);
  }
  try {
    const data = JSON.parse(text);
    pathStats.direct++;
    return data;
  } catch {
    throw new Error(`unlocker: ${unlockerErr.message} | direct: non-JSON body`);
  }
}

// ---------------------------------------------------------------------------
// 1. APP-STORE REVIEWS  (story credit: "Web Scraper API")
// Apple's public customer-review feed. Two known URL orderings — try both.
// (Upgrade path: trigger the App-Store scraper from the Web Scraper API
//  library via triggerDataset() in brightdata.js.)
// ---------------------------------------------------------------------------

const APPS = [
  { name: 'Calm', id: '571800810' },
  { name: 'Headspace', id: '493145008' },
  { name: 'Waking Up', id: '1307736395' },
];
// ^ verify IDs once: the number in each app's App Store URL (apps.apple.com/us/app/xxx/idNNNNNNNNN)

const reviewFeedUrls = (id, page) => [
  `https://itunes.apple.com/us/rss/customerreviews/id=${id}/sortby=mostrecent/page=${page}/json`,
  `https://itunes.apple.com/us/rss/customerreviews/page=${page}/id=${id}/sortby=mostrecent/json`,
];

export async function collectAppReviews({ pages = 3 } = {}) {
  const reviews = [];
  for (const app of APPS) {
    for (let page = 1; page <= pages; page++) {
      let lastErr = 'no entries in feed';
      for (const url of reviewFeedUrls(app.id, page)) {
        try {
          const data = await jsonViaUnlockerOrDirect(url);
          const entries = data?.feed?.entry ?? [];
          const before = reviews.length;
          for (const e of Array.isArray(entries) ? entries : [entries]) {
            if (!e?.['im:rating']) continue; // first entry is app metadata on some pages
            reviews.push({
              app: app.name,
              rating: Number(e['im:rating'].label),
              title: e.title?.label ?? '',
              text: (e.content?.label ?? '').slice(0, 600),
            });
          }
          if (reviews.length > before) { lastErr = null; break; }
        } catch (err) {
          lastErr = err.message;
        }
      }
      if (lastErr) console.warn(`  ! reviews ${app.name} p${page}: ${lastErr}`);
    }
  }
  console.log(
    `  ✓ ${reviews.length} app-store reviews (${APPS.map((a) => a.name).join(', ')}) — ` +
      `${pathStats.unlocker} pages via unlocker, ${pathStats.direct} via direct fallback`
  );
  return reviews;
}

// ---------------------------------------------------------------------------
// 2. REDDIT THREADS  (story credit: "Crawl API")
// Primary: reddit's public .json endpoints via Web Unlocker.
// Fallback: reddit content via the SERP zone (site:reddit.com queries) — this
// works on any plan, because reddit.com itself may require residential IPs
// that trial Web Unlocker zones don't have enabled.
// ---------------------------------------------------------------------------

const REDDIT_SEARCHES = [
  { sub: 'Meditation', q: 'beginner overwhelmed OR quit OR "gave up" OR simple' },
  { sub: 'Meditation', q: 'app OR calm OR headspace frustrating OR annoying OR subscription' },
  { sub: 'getdisciplined', q: 'meditation habit stick OR failed' },
];

export async function collectRedditThreads({ limit = 25 } = {}) {
  const threads = [];
  const seen = new Set();
  let usedFallback = false;

  for (const s of REDDIT_SEARCHES) {
    const url =
      `https://www.reddit.com/r/${s.sub}/search.json?q=${encodeURIComponent(s.q)}` +
      `&restrict_sr=1&sort=relevance&t=year&limit=${limit}`;
    try {
      const data = await unlockJson(url);
      for (const child of data?.data?.children ?? []) {
        const p = child.data;
        if (seen.has(p.permalink)) continue;
        seen.add(p.permalink);
        threads.push({
          sub: s.sub,
          title: p.title,
          text: (p.selftext ?? '').slice(0, 800),
          score: p.score,
          permalink: `https://reddit.com${p.permalink}`,
        });
      }
    } catch (err) {
      console.warn(`  ! reddit r/${s.sub} direct: ${err.message}`);
      // Fallback: mine reddit through Google via the SERP zone.
      try {
        const data = await serp(`site:reddit.com/r/${s.sub} ${s.q}`);
        for (const r of (data.organic ?? []).slice(0, 10)) {
          if (!r.link || seen.has(r.link)) continue;
          seen.add(r.link);
          threads.push({
            sub: s.sub,
            title: r.title ?? '',
            text: (r.description ?? '').slice(0, 800),
            score: null,
            permalink: r.link,
            via: 'serp-fallback',
          });
        }
        usedFallback = true;
      } catch (err2) {
        console.warn(`  ! reddit r/${s.sub} serp fallback: ${err2.message}`);
      }
    }
  }
  if (usedFallback) console.log('  (reddit collected via SERP fallback — snippets, not full threads)');
  console.log(`  ✓ ${threads.length} reddit threads`);
  return threads;
}

// ---------------------------------------------------------------------------
// 3. SEARCH LANDSCAPE  (story credit: "SERP API")
// What beginners actually type, and who owns the answers today.
// ---------------------------------------------------------------------------

const QUERIES = [
  'how to start meditating',
  'how to start meditating without an app',
  'meditation for people who hate meditation',
  'simple breathing exercise timer',
  'why can\'t I stick with meditation',
];

export async function collectSerpLandscape() {
  const results = [];
  for (const q of QUERIES) {
    try {
      const data = await serp(q);
      const organic = (data.organic ?? []).slice(0, 8).map((r, i) => ({
        query: q,
        rank: r.rank ?? i + 1,
        title: r.title,
        link: r.link,
        snippet: (r.description ?? '').slice(0, 300),
      }));
      results.push(...organic);
      const related = (data.related ?? []).map((r) => r.text ?? r.query).filter(Boolean);
      if (related.length) results.push({ query: q, related });
    } catch (err) {
      console.warn(`  ! serp "${q}": ${err.message}`);
    }
  }
  console.log(`  ✓ ${results.length} SERP rows across ${QUERIES.length} queries`);
  return results;
}
