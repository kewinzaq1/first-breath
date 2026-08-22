# How it works

End-to-end walkthrough of the Moment research engine: what runs, in what order, and why each piece is shaped the way it is.

## The one-sentence version

A Node.js pipeline fetches raw market signal through three Bright Data APIs (each used for what it is best at) plus Apple's public review feed; a coding agent turns that corpus into a small research object whose numbers are computed by code and whose quotes are verbatim; and a self-contained landing page renders that object as the story *pain → the bet → prove me wrong → the three calls → what held → what pushed back → the sharpened product → the room does it*.

## Stage 0 — access (`engine/src/brightdata.js`)

One Bearer token, two endpoints, ~100 lines over `fetch`, no SDK — so the integration stays legible on a projector.

**`/request`** — synchronous, the zone decides the behavior:

```
POST https://api.brightdata.com/request
Authorization: Bearer $BRIGHTDATA_API_TOKEN
{ "zone": "<zone name>", "url": "<target url>", "format": "raw" }
```

- **SERP zone** (`serp()`) — the URL is a Google search with `brd_json=1` appended; Bright Data returns the SERP already parsed (`organic[]` with rank/title/link/description, `people_also_ask[]`, `related[]`). About 1.8 s a query, zero HTML anywhere in the pipeline.
- **Web Unlocker zone** (`unlock()` / `unlockJson()`) — any URL, blocks and fingerprints handled, the page body comes back. Its errors are **plain text**, not JSON (`destination_ip_prohibited`, `Residential Failed (bad_endpoint) …`) — `brightdata.js` always surfaces a body snippet and never `JSON.parse`s blindly.

**`/datasets/v3`** — asynchronous, the **Web Scraper API** (`triggerDataset()` / `waitForSnapshot()`):

```
POST /datasets/v3/trigger?dataset_id=gd_m6zagkt024uwvvwuyu&limit_per_input=100   [{url}, {url}, {url}]  → { snapshot_id }
GET  /datasets/v3/progress/{snapshot_id}                                           → { status: running | ready, records }
GET  /datasets/v3/snapshot/{snapshot_id}?format=json                               → [ { review_rating, review, reviewer_name, … } ]
```

The dataset id comes from `GET /datasets/list` (1,743 datasets; "Google Play Store reviews" is `gd_m6zagkt024uwvvwuyu`). The poller tolerates transient network errors and re-reads a snapshot that reports `ready` before its rows are flushed.

## Stage 1 — collect

Three scripts, one corpus each, all in `engine/out/` (gitignored; the corpora only exist where a run happened — never delete them).

1. **`collect.js`** → `out/corpus.json` — three fan-outs with fallbacks and honest attribution:
   - *App Store reviews*: Apple's public feed (`itunes.apple.com/…/rss/customerreviews/…/json`), 3 pages × 3 apps (Calm, Headspace, Waking Up) → 450 reviews, 210 negative (rating ≤ 3). The collector tries the Web Unlocker first; Apple hosts are policy-gated without KYC, so `pathStats` records `0 via unlocker, 9 via direct` and the page credits "App Store feed · public API".
   - *reddit threads*: the Unlocker path (`reddit.com/r/…/search.json`) is KYC-gated; the fallback asks Google for `site:reddit.com/r/Meditation …` through the SERP zone → 30 threads (titles + snippets — all a hypothesis test needs).
   - *Landscape*: five beginner-intent queries through the SERP zone → 42 rows.
2. **`question.js`** → `out/moment-serp.json` — the hypothesis sweep. Twelve queries bucketed **gap** (does the calm carry over?), **want** (what do people ask for instead?), **competition** (does this already exist? — written to hurt). 104 rows in ~25 s. This is where the pushback came from.
3. **`play.js`** → `out/play-reviews.json` — Google Play reviews through the Web Scraper API: 300 structured rows (100 per app) in 179 s, `via: "web-scraper-api"`, dataset and snapshot ids recorded. `play.js --unlocker` is the fallback: the three Play pages through the Web Unlocker (3/3 · 200 OK · ~1.2 MB each, verified Aug 22) — it proves the Unlocker reaches Play, but the structured rows are the Scraper API's job.

Every output file says which path served it. At a data event, that honesty is the product.

## Stage 2 — analyze

`run.js` calls the Anthropic API if `ANTHROPIC_API_KEY` has credits; otherwise it writes `out/analysis-prompt.md` and a coding agent produces `out/research.json` in-session from the corpus (that is how the current one was made). Two pieces of code keep the agent honest:

- **`clusters.js`** — the cluster method *is* this file: negative = rating ≤ 3; three classes, one case-insensitive regex each over title + text, non-exclusive. `node src/clusters.js` prints the shares for both review corpora. Result on the 210 App Store negatives: **52% paywall fatigue · 17% lost simplicity · 16% choice overload**; the 153 Google Play negatives, classified with the identical regexes, land on **54 · 11 · 14** — a cross-check, not blended into the page numbers.
- **`verify.js`** — every `quotes[].text` fragment (split on `…`) must be a verbatim substring of a corpus row; every `clusters[].pct` must equal what `clusters.js` computes; the page blob must be byte-identical to `research.json`; the source-card counts must equal the corpora. Exit 1 on any failure. Run it before every republish.

## Stage 3 — inject (`run.js --inject-only`)

The page holds its research data in one embedded blob:

```html
<script id="research-data" type="application/json"> { sources, quotes, clusters } </script>
```

`run.js` regex-replaces the blob's contents in `page/index.html` in place. That's the entire integration surface — no server, no build step, no fetch at view time — which is what lets the page be one self-contained file published as a Claude Artifact.

## The page (`page/index.html`)

- **Rendering:** on load, a small script parses the blob and builds the source cards, quotes and cluster tiles *before* the IntersectionObserver reveal animations register, so injected content animates identically to authored content. If parsing fails, the page logs and shows the rest of the story.
- **Storytelling mechanics:** one IntersectionObserver for reveals; the "noise" scene generates drifting clutter chips in JS with a clear corridor for copy (staggered top/bottom bands on phones); the reveal scene resolves blue evidence into amber conclusions and keeps the pushback line on the same 1080p screen as the clusters.
- **The last scene is a real Moment:** one sentence (placeholder is a real one), `Enter` starts, six breaths at 4 s in / 6 s out, the sentence returns mid-minute, "Now choose again.", then the CTA to moment.szlezingier.com above the fold; `Escape` aborts; "Again · with a new sentence" re-runs.
- **Design system:** single-theme dark; ember = the human voice (Fraunces), web-blue = the machine voice (IBM Plex Mono for API labels, counts, attributions). Nothing neutral, nothing decorative.
- **Accessibility:** `prefers-reduced-motion` disables drift/pulse and swaps reveals to opacity-only; the Moment degrades to text cues; the CTA has a visible focus state.

## The stage (`engine/src/ask.js`)

`node src/ask.js "<query from the room>"` — one SERP call, printed for a room: the request shape, the ms count, the top results, people-also-ask and related searches. ~1.8 s. If the venue network dies, deck slide 8 *is* the output.

## The live-agent variant (Bright Data MCP)

The same research runs agentically: Bright Data's MCP server exposes `search_engine`, `scrape_as_markdown` and structured `web_data_*` tools to any MCP client. `claude mcp add brightdata -e API_TOKEN=<token> -- npx -y @brightdata/mcp`. Bake real data with the pipeline first; show the agent as the "how it was made" moment only if it rehearses cleanly.

## Failure modes & what to do

| Symptom | Likely cause | Fix |
|---|---|---|
| `Bright Data /request 4xx` | wrong zone name or token | zone names in `.env` must match the control panel exactly |
| Unlocker returns `destination_ip_prohibited` / `Residential Failed (bad_endpoint)` | host is KYC-gated on the zone | the collector already falls back (direct feed / SERP `site:`); complete KYC to open the direct path |
| `trigger 4xx` on the Web Scraper API | wrong `dataset_id` or input shape | `GET /datasets/list` → find "Google Play Store reviews"; inputs are `[{url}]` |
| snapshot `ready` but 0 rows | rows not flushed yet | `node src/play.js --snapshot <id>` re-downloads |
| `verify.js` fails on a quote | quote edited or paraphrased | restore the verbatim text from the corpus; only `…` trimming is allowed |
| `verify.js` fails on a cluster | regex changed or research.json stale | rerun `node src/clusters.js`, update `research.json`, `--inject-only`, republish |
| Page shows old numbers after inject | artifact not republished, or old version pinned | republish to the **same** artifact URL and unpin the old version in the artifact UI |
