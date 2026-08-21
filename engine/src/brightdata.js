// Thin Bright Data client — everything the demo needs in ~90 lines.
// Two access patterns:
//   1. /request  → Web Unlocker zone (any URL) or SERP zone (search engines)
//   2. /datasets/v3/trigger → Web Scraper API (structured, async) — optional "pro" path

const BASE = 'https://api.brightdata.com';

function env(name) {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `Missing env var ${name}. Put it in engine/.env (copy .env.example). ` +
        `If you're importing this module outside run.js, import './loadenv.js' first ` +
        `or launch node with --env-file=.env.`
    );
  }
  return v;
}

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${env('BRIGHTDATA_API_TOKEN')}`,
});

const snip = (s, n = 140) => (s ?? '').replace(/\s+/g, ' ').slice(0, n);

/** Core: fetch any URL through a Bright Data zone. */
async function bdRequest(zone, url, format = 'raw') {
  const res = await fetch(`${BASE}/request`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ zone, url, format }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Bright Data /request ${res.status}: ${snip(text)}`);
  return text;
}

/** Fetch a URL through your Web Unlocker zone (handles blocks, CAPTCHAs, fingerprints). */
export async function unlock(url) {
  return bdRequest(env('BRIGHTDATA_UNLOCKER_ZONE'), url);
}

/** Same, but parse the body as JSON (for endpoints that return JSON, e.g. reddit .json).
    Surfaces Bright Data's own plain-text errors (e.g. "Residential…" restrictions) readably. */
export async function unlockJson(url) {
  const text = await unlock(url);
  if (!text || !text.trim()) throw new Error('empty body from unlocker');
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`non-JSON body from unlocker: "${snip(text)}"`);
  }
}

/** Google search through the SERP zone. `brd_json=1` asks Bright Data to parse the SERP for you. */
export async function serp(query, { gl = 'us', hl = 'en', num = 20 } = {}) {
  const url =
    `https://www.google.com/search?q=${encodeURIComponent(query)}` +
    `&gl=${gl}&hl=${hl}&num=${num}&brd_json=1`;
  const text = await bdRequest(env('BRIGHTDATA_SERP_ZONE'), url);
  return JSON.parse(text);
}

// ---------- Web Scraper API (datasets) — optional structured path ----------
// e.g. Google Play reviews / app-store scrapers from the scraper library.
// Find the dataset_id for a scraper in the Bright Data control panel → Web Scrapers.

export async function triggerDataset(datasetId, inputs, params = {}) {
  const qs = new URLSearchParams({ dataset_id: datasetId, include_errors: 'true', ...params });
  const res = await fetch(`${BASE}/datasets/v3/trigger?${qs}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(inputs),
  });
  if (!res.ok) throw new Error(`trigger ${res.status}: ${await res.text()}`);
  const { snapshot_id } = await res.json();
  return snapshot_id;
}

export async function waitForSnapshot(snapshotId, { pollMs = 5000, timeoutMs = 600000 } = {}) {
  const started = Date.now();
  for (;;) {
    const prog = await fetch(`${BASE}/datasets/v3/progress/${snapshotId}`, { headers: authHeaders() })
      .then((r) => r.json());
    if (prog.status === 'ready') break;
    if (prog.status === 'failed') throw new Error(`snapshot ${snapshotId} failed`);
    if (Date.now() - started > timeoutMs) throw new Error(`snapshot ${snapshotId} timed out`);
    await new Promise((r) => setTimeout(r, pollMs));
  }
  const res = await fetch(`${BASE}/datasets/v3/snapshot/${snapshotId}?format=json`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`snapshot download ${res.status}: ${await res.text()}`);
  return res.json();
}
