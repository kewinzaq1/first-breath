# First Breath — Specification

Version 1.0 · Bright Data GTM event, Aug 22, 2026

## 1. Problem statement

People who want to start meditating face two compounding problems: **disconnection** (rising anxiety, shrinking attention) and **choice overload** (hundreds of apps, each with hundreds of sessions, subscriptions, and gamified streaks). Most beginners don't fail at meditating — they fail at choosing how to start.

**The product hypothesis:** a radically pragmatic entry point — start a timer, count your breaths, nothing else.

**The GTM question this project answers:** is that hypothesis what the market actually wants, and how would you position, phrase, and channel it? Instead of guessing, the system mines the web for evidence.

## 2. What gets built

Two components in one repo:

1. **The engine** (`engine/`) — a Node.js pipeline that collects market signal via Bright Data, distills it with Claude, and emits a structured research result.
2. **The page** (`page/index.html`) — a scroll-based storytelling landing page that renders that result as a founder-story narrative, ending in an interactive breath timer. The page is simultaneously the *demo* and the *GTM deliverable* (a launch asset built from the research).

## 3. The story (page spec)

Eight full-viewport scroll scenes. Single-theme dark design (ground `#0C0A08`, ink `#EDE4D7`); two accent colors carry the narrative voices — **ember `#D9954A`** for the human/breath thread, **web-blue `#6E9BD1`** for the data/agent thread. Type: Fraunces (human voice), Karla (body), IBM Plex Mono (machine voice — API labels, counts).

| # | Scene | Beat | Mechanic |
|---|---|---|---|
| 1 | Hero | "First Breath" | slow-pulsing amber orb (9s idle-breath loop) |
| 2 | The noise | you opened the app store | ~20 drifting clutter chips fade in around a clear copy corridor |
| 3 | Disconnection | more tools for calm, more disconnected | near-black, one lone dot |
| 4 | The instinct | timer + counted breaths, then founder doubt | amber timer ring; doubt line sets up the research |
| 5 | Asking the web | Bright Data fan-out | 3 source cards **rendered from data**: API name (mono, blue), volume, origin |
| 6 | The reveal | strangers agree; pain points cluster | quotes then clusters **rendered from data**; blue quotes resolve into amber percentages |
| 7 | The way | data gave permission, not a product | positioning statement |
| 8 | Breathe | try it now | working timer: 10 breaths, 4s in / 6s out; ends "That's the whole product." |
| — | Coda | GTM thesis + credits | "Built with Bright Data · Web Scraper API · Crawl API · SERP API" |

Page requirements: one self-contained HTML file (Google Fonts is the only external host), keyboard-focusable CTA, `prefers-reduced-motion` respected, no horizontal scroll, works as a Claude Artifact (no doctype/head/body of its own).

## 4. Data contract (engine → page)

The page renders scenes 5–6 from a single embedded blob: `<script id="research-data" type="application/json">`. The engine's only integration point is replacing that blob's contents. Shape:

```json
{
  "sources": [
    { "api": "Web Scraper API", "what": "12,438 app-store reviews, structured", "from": "calm · headspace · waking up" }
  ],
  "quotes": [
    { "text": "verbatim quote, lightly trimmed, never invented", "src": "app-store review · via web scraper api" }
  ],
  "clusters": [
    { "pct": "31%", "label": "Too much woo", "of": "of negative signal" }
  ]
}
```

Rules: exactly 3 `sources` (one per API) and 3 `clusters`; 3–5 `quotes`; `pct` computed from observed negative signal, whole numbers, need not sum to 100; `quotes[].text` must be verbatim from the corpus (trimming with `…` allowed, invention forbidden). The blob ships with clearly-labeled placeholder values so the page degrades gracefully before the first real run.

## 5. Collection spec (engine)

All collection goes through Bright Data (`POST https://api.brightdata.com/request`, Bearer auth):

| Fan-out | Zone | Targets | Yield |
|---|---|---|---|
| App-store reviews | Web Unlocker | Apple customer-review feeds: Calm `571800810`, Headspace `493145008`, Waking Up `1307736395` (3 pages each) | rating, title, text per review |
| Community threads | Web Unlocker | `reddit.com/r/{Meditation,getdisciplined}/search.json`, 3 curated queries about starting/quitting/frustration | title, selftext, score, permalink |
| Search landscape | SERP API (`brd_json=1`) | 5 beginner queries ("how to start meditating", "…without an app", …) | top-8 organic per query + related searches |

Upgrade path (optional): the structured Web Scraper API (`datasets/v3/trigger` → `progress/{id}` → `snapshot/{id}`) for Google Play / App Store scrapers from the scraper library; helpers are already in `engine/src/brightdata.js`.

Collector behavior: individual fetch failures warn and continue (a partial corpus is acceptable); raw corpus is always persisted to `engine/out/corpus.json` before analysis.

## 6. Analysis spec

One Claude call (`ANTHROPIC_MODEL`, default `claude-sonnet-4-5`). Input: negative reviews (rating ≤ 3, capped 120), threads (capped 60), SERP rows (capped 60), plus true totals. Output: the §4 contract plus `insights` — 3–5 one-line GTM findings (positioning, customer language, SERP gaps) printed to the terminal for the talk track. The prompt forbids invented quotes and requires computed percentages. Response is parsed by extracting the outermost JSON object; a malformed response fails loudly rather than injecting garbage.

## 7. Acceptance criteria

1. `node --env-file=.env src/run.js --collect-only` completes against live Bright Data zones and writes a corpus with ≥ 50 reviews, ≥ 20 threads, ≥ 20 SERP rows.
2. Full run writes `research.json` matching §4 and injects it; the page then shows real counts, quotes, and percentages with correct source attributions.
3. Page scrolls cleanly on a projector (1080p) and a phone; breath timer runs 10 cycles and lands the closing line.
4. Placeholder footer note is removed once real data is in.
5. A stranger can go from `git clone` to a full run using only README instructions.

## 8. Out of scope (v1)

The meditation app itself (the page's timer *is* the MVP gesture), accounts/payments, scheduled re-runs, multi-product configuration UI (generalization is by editing `collect.js` constants), and automated republishing of the artifact.
