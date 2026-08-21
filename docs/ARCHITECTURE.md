# How First Breath works

End-to-end walkthrough of the system: what runs, in what order, and why each piece is shaped the way it is.

## The one-sentence version

A Node.js pipeline fetches raw market signal through Bright Data's proxy/unblocking network, a single Claude call turns that corpus into a small structured research object, and a self-contained landing page renders that object as a scroll-driven founder story.

## Stage 0 — access (engine/src/brightdata.js)

Everything network-shaped goes through one Bright Data endpoint:

```
POST https://api.brightdata.com/request
Authorization: Bearer $BRIGHTDATA_API_TOKEN
{ "zone": "<zone name>", "url": "<target url>", "format": "raw" }
```

The `zone` decides the behavior:

- **Web Unlocker zone** (`unlock()` / `unlockJson()`) — Bright Data handles IP rotation, browser fingerprints, and CAPTCHAs; you get the target page's body back. We use it for endpoints that return JSON directly, so there is no HTML parsing anywhere in the pipeline.
- **SERP zone** (`serp()`) — the target URL is a Google search; appending `brd_json=1` makes Bright Data return the SERP already parsed (organic results, related searches) as JSON.

The module also implements the **Web Scraper API** async flow for the structured scraper library: `triggerDataset()` posts inputs to `datasets/v3/trigger?dataset_id=…` and returns a `snapshot_id`; `waitForSnapshot()` polls `datasets/v3/progress/{id}` until `ready`, then downloads `datasets/v3/snapshot/{id}?format=json`. The demo doesn't need it (see below), but it's the production path for e.g. Google Play reviews at scale.

Design choice: no SDK, no scraping framework — the whole client is ~90 lines over `fetch`, which keeps the Bright Data integration legible on a projector.

## Stage 1 — collect (engine/src/collect.js)

Three fan-outs, matching the three source cards in the page's "asking the web" scene:

1. **App-store reviews** — Apple publishes a customer-review feed per app (`itunes.apple.com/…/rss/customerreviews/…/json`). We fetch 3 pages × 3 apps (Calm, Headspace, Waking Up) and keep rating, title, and text. The collector tries Web Unlocker first, but `itunes.apple.com` and `apps.apple.com` are policy-gated without KYC (`destination_ip_prohibited`, verified on the 2026-08-21 and 2026-08-22 runs: 0 pages via unlocker, 9 via direct), so in practice the public feed is fetched directly. The page therefore credits this source as "App Store review feed · public API" — not Bright Data. (Google Play *does* resolve through the Unlocker; a Play-reviews collector or the `triggerDataset()` Web Scraper path is the honest upgrade if Bright Data-sourced reviews matter.)
2. **Reddit threads** — Reddit exposes `search.json` per subreddit. Three curated queries target the moments people start, struggle with, and quit meditation (r/Meditation, r/getdisciplined). Fetched through Web Unlocker because Reddit rate-limits and blocks datacenter traffic aggressively.
3. **SERP landscape** — five beginner-intent queries through the SERP zone. This answers the channel question: who owns the results a beginner sees, and which queries have no pragmatic answer ranking (the content gap First Breath could take).

Failures warn and continue — a partial corpus still tells the story. Everything raw lands in `engine/out/corpus.json` so collection and analysis can be iterated independently.

## Stage 2 — analyze (engine/src/analyze.js)

One Claude Messages API call. The prompt:

- frames the product hypothesis (pragmatic simplicity) so insights are decision-relevant, not generic;
- passes negative reviews (rating ≤ 3), threads, and SERP rows, capped to keep the context lean;
- demands the page's exact data contract back (see `SPEC.md` §4), with two hard rules: **quotes must be verbatim** from the corpus, and **cluster percentages must be computed** from the negative signal actually present;
- additionally returns `insights` — one-liners for the talk track, printed to the terminal during the demo.

The response is parsed by slicing the outermost `{…}` — tolerant of stray prose, but a malformed result throws rather than injecting bad data into the page.

## Stage 3 — inject (engine/src/run.js)

The page holds its research data in one embedded blob:

```html
<script id="research-data" type="application/json"> { sources, quotes, clusters } </script>
```

`run.js` regex-replaces the blob's contents inside `page/index.html` in place. That's the entire integration surface between engine and page — no server, no build step, no fetch at view time. The page stays a single self-contained file, which is what lets it be published as a Claude Artifact (or hosted anywhere) with zero infrastructure.

## The page (page/index.html)

- **Rendering:** on load, a small script parses the blob and builds the source cards, quote list, and cluster tiles *before* the IntersectionObserver-driven reveal animations register, so injected content animates identically to authored content. If parsing fails, the page logs and shows the rest of the story.
- **Storytelling mechanics:** scroll reveals via one IntersectionObserver; the "noise" scene generates its drifting clutter chips in JS with randomized positions/rotations, keeping a clear corridor for copy; the finale is a real breath timer (10 cycles, 4s in / 6s out) driven by timeouts + CSS scale transitions on the orb.
- **Design system:** deliberately single-theme dark (the calm is the aesthetic). Two accents encode the two narrative voices — ember for the human thread, web-blue for the data thread — and the reveal scene is where blue evidence resolves into amber conclusions. Mono type marks every place the machine is speaking (API labels, counts, quote attributions).
- **Accessibility:** `prefers-reduced-motion` disables drift/pulse and swaps reveals to opacity-only; the timer degrades to text cues; the CTA has a visible focus state.

## The live-agent variant (Bright Data MCP)

The deterministic pipeline exists so the demo cannot fail on stage. The same research also runs agentically: Bright Data's official MCP server exposes `search_engine`, `scrape_as_markdown`, and ~60 structured `web_data_*` tools (Apple App Store, Google Play, Reddit posts, …) to any MCP client.

```bash
claude mcp add brightdata -e API_TOKEN=<token> -- npx -y @brightdata/mcp
# hosted alternative: https://mcp.brightdata.com/mcp?token=<token>
```

Stage flow that uses both: bake real data with the pipeline beforehand → demo the page → then show Claude + MCP re-deriving one insight live ("find me three more verbatim complaints about meditation apps being overwhelming") as the "how it was made" moment.

## Failure modes & what to do

| Symptom | Likely cause | Fix |
|---|---|---|
| `Bright Data /request 4xx` | wrong zone name or token | zone names in `.env` must match the control panel exactly |
| Empty review set | app ID wrong/region-locked | verify the ID in the app's App Store URL; try another `page=` |
| Reddit returns HTML | endpoint blocked without unlocker, or old path | confirm the URL ends in `.json` and goes through `unlock()` |
| `No JSON in analysis response` | model returned prose | rerun; keep `max_tokens` ≥ 3000; check corpus isn't empty |
| Page shows placeholders after run | injection target missing | run from `engine/`; page must contain the `research-data` block |
