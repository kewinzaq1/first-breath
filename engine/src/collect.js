// The three research fan-outs from the landing page's "asking the web" scene.
// Each returns plain JS objects ready for the analysis step.

import { unlock, unlockJson, serp } from './brightdata.js';

// ---------------------------------------------------------------------------
// 1. APP-STORE REVIEWS  (story credit: "Web Scraper API")
// Pragmatic hackathon path: Apple's public customer-review feed, fetched
// through Web Unlocker so it works at volume and never blocks.
// (Upgrade path: trigger the App-Store/Google-Play scraper from the Web
//  Scraper API library via triggerDataset() in brightdata.js.)
// ---------------------------------------------------------------------------

const APPS = [
  { name: 'Calm', id: '571800810' },
  { name: 'Headspace', id: '493145008' },
  { name: 'Waking Up', id: '1307736395' },
];
// ^ verify IDs once: the number in each app's App Store URL (apps.apple.com/us/app/xxx/idNNNNNNNNN)

export async function collectAppReviews({ pages = 3 } = {}) {
  const reviews = [];
  for (const app of APPS) {
    for (let page = 1; page <= pages; page++) {
      const url = `https://itunes.apple.com/us/rss/customerreviews/page=${page}/id=${app.id}/sortby=mostrecent/json`;
      try {
        const data = await unlockJson(url);
        const entries = data?.feed?.entry ?? [];
        for (const e of entries) {
          if (!e['im:rating']) continue; // first entry is app metadata on some pages
          reviews.push({
            app: app.name,
            rating: Number(e['im:rating'].label),
            title: e.title?.label ?? '',
            text: (e.content?.label ?? '').slice(0, 600),
          });
        }
      } catch (err) {
        console.warn(`  ! reviews ${app.name} p${page}: ${err.message}`);
      }
    }
  }
  console.log(`  ✓ ${reviews.length} app-store reviews (${APPS.map((a) => a.name).join(', ')})`);
  return reviews;
}

// ---------------------------------------------------------------------------
// 2. REDDIT THREADS  (story credit: "Crawl API")
// Reddit's public .json endpoints, fetched through Web Unlocker.
// ---------------------------------------------------------------------------

const REDDIT_SEARCHES = [
  { sub: 'Meditation', q: 'beginner overwhelmed OR quit OR "gave up" OR simple' },
  { sub: 'Meditation', q: 'app OR calm OR headspace frustrating OR annoying OR subscription' },
  { sub: 'getdisciplined', q: 'meditation habit stick OR failed' },
];

export async function collectRedditThreads({ limit = 25 } = {}) {
  const threads = [];
  for (const s of REDDIT_SEARCHES) {
    const url =
      `https://www.reddit.com/r/${s.sub}/search.json?q=${encodeURIComponent(s.q)}` +
      `&restrict_sr=1&sort=relevance&t=year&limit=${limit}`;
    try {
      const data = await unlockJson(url);
      for (const child of data?.data?.children ?? []) {
        const p = child.data;
        threads.push({
          sub: s.sub,
          title: p.title,
          text: (p.selftext ?? '').slice(0, 800),
          score: p.score,
          permalink: `https://reddit.com${p.permalink}`,
        });
      }
    } catch (err) {
      console.warn(`  ! reddit r/${s.sub}: ${err.message}`);
    }
  }
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
