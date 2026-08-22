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

/** Core: fetch any URL through a Bright Data zone.
    Bright Data answers HTTP 200 even when the upstream fetch failed — the truth is in the headers
    (`x-brd-status-code: 502`, `x-brd-error-code: captcha | expect_body | …`). Surface it. */
async function bdRequest(zone, url, format = 'raw') {
  const res = await fetch(`${BASE}/request`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ zone, url, format }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Bright Data /request ${res.status}: ${snip(text)}`);
  const brdCode = res.headers.get('x-brd-error-code');
  if (brdCode) {
    const err = new Error(`Bright Data upstream ${res.headers.get('x-brd-status-code') ?? ''} ${brdCode}: ${res.headers.get('x-brd-error') ?? ''} ${snip(text, 80)}`.trim());
    err.brdCode = brdCode;
    throw err;
  }
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

/** Google search through the SERP zone. `brd_json=1` asks Bright Data to parse the SERP for you.
    Resilience (measured Aug 22 during a Google captcha wave: ~40–60 % of first attempts failed with
    x-brd-error-code expect_body / captcha): a failed query is locked for 15 s under its exact text, so
    retries vary the text in ways Google treats identically (trailing "?"), then wait out the lock once. */
export async function serp(query, { gl = 'us', hl = 'en', onRetry } = {}) {
  const url = (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}&gl=${gl}&hl=${hl}&brd_json=1`;
  const plan = [
    { q: query, waitMs: 0 }, { q: `${query}?`, waitMs: 0 }, { q: `${query} ?`, waitMs: 0 },
    { q: query, waitMs: 16000 }, { q: `${query}?`, waitMs: 0 },
  ];
  let last;
  for (let i = 0; i < plan.length; i++) {
    if (plan[i].waitMs) await new Promise((r) => setTimeout(r, plan[i].waitMs));
    try {
      const text = await bdRequest(env('BRIGHTDATA_SERP_ZONE'), url(plan[i].q));
      if (text.trim().startsWith('{')) return JSON.parse(text);
      last = new Error(`non-JSON body: ${snip(text, 80) || '(empty)'}`);
    } catch (err) {
      last = err;
    }
    if (i < plan.length - 1) onRetry?.({ attempt: i + 1, reason: last.brdCode ?? last.message, waitMs: plan[i + 1].waitMs });
  }
  throw new Error(`SERP zone failed ${plan.length}× for "${query}" — last: ${last.message}`);
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

export async function waitForSnapshot(snapshotId, { pollMs = 5000, timeoutMs = 600000, onProgress } = {}) {
  const started = Date.now();
  for (;;) {
    let prog;
    try {
      prog = await fetch(`${BASE}/datasets/v3/progress/${snapshotId}`, { headers: authHeaders() })
        .then((r) => r.json());
    } catch (err) {
      prog = { status: 'network-error', error: err.cause?.code ?? err.message }; // transient: keep polling
    }
    onProgress?.(prog, Date.now() - started);
    if (prog.status === 'ready') break;
    if (prog.status === 'failed') throw new Error(`snapshot ${snapshotId} failed`);
    if (Date.now() - started > timeoutMs) throw new Error(`snapshot ${snapshotId} timed out (last status: ${prog.status})`);
    await new Promise((r) => setTimeout(r, pollMs));
  }
  const res = await fetch(`${BASE}/datasets/v3/snapshot/${snapshotId}?format=json`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`snapshot download ${res.status}: ${snip(await res.text())}`);
  return res.json();
}
