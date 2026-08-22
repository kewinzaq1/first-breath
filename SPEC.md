# Prove Me Wrong — Specification

Version 2.0 · Bright Data GTM event, Aug 22, 2026

## 1. Problem statement

Meditation apps sell calm and deliver a marketplace: ten thousand sessions, streaks, paywalls. Worse — even when the app works, the calm stays on the cushion. You sit for twenty minutes, feel present, then snap at your kid at 6pm, eat the second plate, scroll until 2am. The practice never reaches the moment where life actually happens.

**The hypothesis.** H1: apps overwhelm people with content and choice. H2: the calm stays in the session; people are still reactive in real life.

**The bet.** [Moment](https://moment.szlezingier.com): one sentence about how you want to move through today, a pause every 30 minutes, one minute to breathe and choose again. Meditation inside the day, not beside it.

**The product.** Prove Me Wrong: you give it a hypothesis in two sentences (`engine/hypothesis.json`), the community where your users tell the truth and your would-be competitors; it goes to the web through three Bright Data APIs and returns a verdict — what held, what was refuted, what nobody is doing — every line a verbatim quote or a computed number, every source credited by the path that served it. Moment is the worked example; everything below is specified for the product and verified on the example.

## 2. What gets built

1. **The engine** (`engine/`) — `provemewrong.js` runs three phases from `hypothesis.json` (SERP argument → Unlocker full text → Web Scraper reviews) into `out/verdict-input.json`; a coding agent turns the rows into `research.json`; `run.js --inject-only` injects it. `--quick` is the 30-second stage path (SERP only, 4 queries, a first-pass verdict line, never throws on an empty bucket).
2. **The page** (`page/index.html`) — a scroll-based storytelling page that renders the research object and ends in a working one-minute Moment. The page is the demo, the deliverable and the pitch.
3. **The deck and talk** (`docs/`) — the same eight beats for a Bright Data audience, with one live API call inside.

## 3. The story (page spec)

Eight full-viewport scenes in the fixed arc. Single-theme dark design (ground `#0C0A08`, ink `#EDE4D7`); two accents carry the two voices — **ember `#D9954A`** for the human thread (Fraunces), **web-blue `#6E9BD1`** for the data thread (IBM Plex Mono for API labels and counts); Karla for body.

| # | Beat | Scene | Mechanic |
|---|---|---|---|
| 1 | pain | Hero — "Moment" | slow-pulsing amber orb; subline names the pain in one breath |
| 2 | pain | The noise — you opened the app store | ~20 drifting clutter chips around a clear copy corridor |
| 3 | pain | Calm for twenty minutes. Then the day happens. | near-black, one lone dot |
| 4 | the bet | Two things are broken → Moment, the hypothesis | amber ring reads `01:00`; "before telling anyone, I tried to break it" |
| 5 | prove me wrong | I asked the web to prove me wrong | 3 source cards **rendered from data**: API (mono, blue) · volume · origin |
| 6 | what held / what pushed back | Half of it held. Half of it pushed back. | quotes then clusters **rendered from data**; the pushback line (`.gap`) and the verdict stay on one 1080p screen with the clusters |
| 7 | the sharpened product | The data didn't confirm my product. It sharpened it. | positioning statement |
| 8 | the room does it | Try one moment | intention input → `Enter` starts → 6 breaths (4 s in / 6 s out) → the intention returns mid-minute → "Now choose again." → CTA to moment.szlezingier.com; `Escape` aborts |
| — | coda | credits | "Built with Bright Data SERP API · Web Scraper API · Web Unlocker · Apple's public review feed · Claude" |

Page requirements: one self-contained HTML file (Google Fonts is the only external host), no doctype/html/head/body tags of its own (the artifact publish path adds the skeleton), keyboard-focusable CTA, `prefers-reduced-motion` respected, no horizontal scroll, zero console errors at 1920×1080 and 390×844.

## 4. Data contract (engine → page)

The page renders scenes 5–6 from one embedded blob: `<script id="research-data" type="application/json">`. The engine's only integration point is replacing that blob's contents (`run.js --inject-only`). Shape:

```json
{
  "sources":  [ { "api": "SERP API", "what": "104 search results from 12 questions …", "from": "…" } ],
  "quotes":   [ { "text": "verbatim, lightly trimmed with …, never invented", "src": "r/meditation · via bright data serp" } ],
  "clusters": [ { "pct": "52%", "label": "Paywall fatigue", "of": "of negative reviews" } ],
  "product":  { "name": "Moment", "url": "https://moment.szlezingier.com" },
  "hypotheses": { "H1": "…", "H2": "…" },
  "verdict":  { "H1": "held", "H2": "held for the people it fails", "pushback": "the interrupt is not new", "unclaimed": "remembering your own intention at the moment it matters" },
  "counter_evidence": [ { "kind": "competitor | counter", "name": "One-Moment Meditation® (#1 and #2 for the minute)", "what": "…", "link": "…" } ]
}
```

`product`, `hypotheses`, `verdict` and `counter_evidence` are optional: the renderer shows the hero eyebrow, the hypotheses list, the pushback block (competitors → "all exist", counters → "not everyone agrees") and the unclaimed line when they are present, and falls back to the authored copy when they are not. `run.js inject()` and `verify.js` share one `blobOf()` so the two sides cannot drift.

Rules: exactly 3 `sources` and 3 `clusters`; 3–5 `quotes`. `quotes[].text` must be verbatim from `engine/out/corpus.json`, `moment-serp.json` or `play-reviews.json`. `pct` is computed by `engine/src/clusters.js` (whole numbers; classes are non-exclusive, so shares need not sum to 100). `engine/src/verify.js` enforces all of this and the byte-identity of the blob with `research.json`. The full `research.json` additionally carries `hypothesis.verdict`, `counter_evidence`, `insights` and `meta` (corpus sizes, method, attribution) — those feed the deck and talk, not the page.

## 5. Collection spec (engine)

Three Bright Data APIs, each for what it is best at, plus one public feed. All Bright Data traffic is Bearer-authenticated against `api.brightdata.com`.

| Source | API / path | Script | Yield (verified) |
|---|---|---|---|
| Google search landscape + hypothesis sweep | **SERP API** (`/request`, SERP zone, `brd_json=1`) | `collect.js` (5 queries) · `question.js` (12 queries bucketed gap / want / competition) | 42 + 104 rows |
| reddit threads | **SERP API** via `site:reddit.com/r/…` (reddit.com is KYC-gated on the Unlocker; the collector tries the Unlocker first and records the fallback) | `collect.js` | 30 threads |
| Google Play reviews | **Web Scraper API** (`/datasets/v3/trigger` → `progress` → `snapshot`, dataset `gd_m6zagkt024uwvvwuyu` "Google Play Store reviews") | `play.js` | 300 reviews (100 × Calm, Headspace, Waking Up), 153 negative at ≤ 3 |
| Google Play store pages | **Web Unlocker** (`/request`, Unlocker zone) — proves the Unlocker reaches Play; `play.js --unlocker` is the fallback path | `play.js --unlocker` | 3/3 pages, 200 OK, ~1.2 MB each |
| App Store reviews | Apple's public customer-review feed, direct fetch (Apple hosts are policy-gated on the Unlocker without KYC — `pathStats` records 0 via unlocker, 9 direct) | `collect.js` | 450 reviews, 210 negative |

Collector behavior: individual failures warn and continue; every source records the path that served it; raw corpora are always persisted to `engine/out/` before analysis. `engine/out/` is gitignored and irreplaceable on the machine that ran it — never delete it.

## 6. Analysis spec

`run.js` calls the Anthropic Messages API when `ANTHROPIC_API_KEY` has credits; otherwise it writes `out/analysis-prompt.md` and a coding agent (Claude in-session) produces `out/research.json` from the corpus. The current research object was made that way. Either path obeys the same rules: quotes verbatim, clusters from `clusters.js`, counter-evidence recorded, method in `meta`. `insights` are the one-liners the talk quotes.

## 7. Acceptance criteria

1. `node src/run.js --collect-only`, `node src/question.js` and `node src/play.js` complete against live Bright Data zones and write their corpora.
2. `node src/verify.js` is green: every quote verbatim, clusters equal to `clusters.js`, page blob byte-identical to `research.json`, card counts equal to corpora.
3. The page scrolls cleanly at 1920×1080 and 390×844 with zero console errors; one Moment runs to completion headlessly; after completion the CTA is above the fold at 1080p.
4. The deck (≤ 10 slides) and the talk (≤ 5:00 with the live call) follow the eight beats in order; every number and quote in them exists in `research.json`, `moment-serp.json` or `play-reviews.json`.
5. A stranger can go from `git clone` to a full run using only `README.md`.

## 8. Out of scope (v1)

The Moment app itself (the page's last scene is the gesture; the product lives at moment.szlezingier.com), accounts/payments, scheduled re-runs, multi-product configuration UI (generalization is by editing the constants in `collect.js`, `question.js`, `play.js`), and automated republishing of the artifact.
