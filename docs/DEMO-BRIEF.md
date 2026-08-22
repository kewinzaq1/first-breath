# Demo brief — morning of Aug 22, 2026

You are a coding agent preparing Kew's demo for the Bright Data GTM event tonight. Read `AGENTS.md` first (environments, hard rules, lessons). This file is the plan; it overrides anything in older docs that contradicts it. **The story below is decided. Do not re-litigate it — build it.**

Budget: ~4 hours. Work the steps in order; each ends on a checkable bar. If a step blows its timebox, take its fallback and move on — a finished demo beats a perfect one.

---

## The story (fixed)

**Problem.** Meditation apps sell calm and deliver a marketplace: ten thousand sessions, streaks, paywalls. Worse — even when it works, the calm stays on the cushion. You sit for twenty minutes, feel present, then snap at your kid at 6pm, eat the second plate, scroll until 2am. The practice never reaches the moment where life actually happens.

**Hypothesis.** H1: apps overwhelm people with content and choice. H2: the calm stays in the session; people are still reactive in real life. Bet: **Moment** (https://moment.szlezingier.com) — one sentence about how you want to move through today, a pause every 30 minutes, one minute to breathe and choose again. Meditation inside the day, not beside it.

**Method.** Before pitching it, Kew asked the web to break it. One Node engine wired to Bright Data — three APIs, each used for what it's best at — plus a coding agent that turned raw rows into a research object and injected it into a page. A third of the queries were written to refute the hypothesis.

**Result.** H1 held (48% paywall fatigue, 20% choice overload of 210 negative reviews). H2 held for the people it fails — "when another same trigger arose, I was still reactive" — and they prescribe the bridge themselves. **The web pushed back:** Mindfulness Bell, MindBell, Chill and One-Moment Meditation® already exist; the bell and the minute are taken. What no result offers: remembering *your own intention* at the moment it matters (r/selfimprovement: "23 minutes later I'm in the thick of it").

**The moment that lingers.** The room writes one sentence. Sixty seconds of silence. The sentence comes back mid-breath. "Now choose again." In a night of agent demos, this is the one where 200 people breathe together.

Arc, in order: *pain → the bet → "prove me wrong" → the three calls → what held → what pushed back → the sharpened product → the room does it.* Page, deck and talk all follow this order, beat for beat.

---

## What exists and works (verified Aug 22, 01:00)

- `page/index.html` — the Moment story, published at the artifact URL in `AGENTS.md`. Final scene is a working one-minute Moment (intention input → 6 breaths → intention returns → CTA).
- `engine/src/run.js` — collect (Apple reviews via public feed, reddit via SERP `site:`, 5 SERP queries) → analyze → inject. `--collect-only`, `--inject-only`.
- `engine/src/question.js` — 12-query hypothesis sweep → `out/moment-serp.json` (104 rows, ran fine).
- `engine/src/ask.js` — one SERP call printed for a room. ~1.8 s. The rehearsed live step.
- `engine/src/brightdata.js` — `serp()`, `unlock()`, `unlockJson()`, and `triggerDataset()` / `waitForSnapshot()` for the Web Scraper API (**wired, never run**).
- `engine/out/research.json` — the Moment research object (quotes verbatim, clusters computed, `hypothesis.verdict`, `counter_evidence`). `research.first-breath.json` is the old timer-product version; reference only.
- `docs/first-breath-how-it-works.pptx` ← `docs/deck.js` (pptxgenjs), `docs/TALK.md`.
- Known API facts: SERP zone works for everything. Web Unlocker: **Google Play resolves (200, 1.2 MB)**; Apple hosts and reddit are policy-gated (`destination_ip_prohibited`, needs KYC). Anthropic API key has no credits — analysis is done by *you*, in-session, from the corpus.

---

## Steps

### 1 · Consolidate (30 min)

The project feels scattered because three narratives accumulated (First Breath timer → pain/proof deck → Moment). Leave exactly one.

- Every file in `docs/`, `README.md`, `SPEC.md`, `docs/ARCHITECTURE.md` describes the Moment story above. "First Breath" survives only as the repo/artifact name with a one-line note.
- `engine/out/research.json` has `quotes` (3–5), `clusters` (3), `sources` (3) matching the page blob byte-for-byte after `--inject-only`.
- Delete nothing from `engine/out/` (corpora are irreplaceable). Delete scratch from `docs/` that the arc doesn't use.

**Done when:** `grep -ril "first breath" docs README.md SPEC.md` returns only the naming note, and a stranger reading `README.md` alone can retell the eight beats.

### 2 · Third API: Web Scraper API for Google Play reviews (60 min, hard stop)

The talk claims three APIs. Make the third one real with a source the Unlocker can also reach, so the story has a clean "each API for what it's best at" beat:

1. List datasets: `GET https://api.brightdata.com/datasets/list` (Bearer). Find the Google Play reviews scraper (name contains "Google Play" and "review"). If the list endpoint is unavailable, Kew must copy the `dataset_id` from the control panel (Web Scrapers → Google Play → reviews) — ask once, proceed with the fallback meanwhile.
2. `node src/play.js` (new): `triggerDataset(id, [{url: <play store url>}×3 apps], {limit_per_input: 100})` → `waitForSnapshot` → `out/play-reviews.json`. Apps: `com.calm.android`, `com.getsomeheadspace.android`, `org.wakingup.android`.
3. Record the serving path in the file (`via: "web-scraper-api"`), count negatives (rating ≤ 2), print the one-line summary the talk will quote.

**Fallback** (if no dataset in 30 min or snapshot not ready in 20): `unlock()` the three Play store pages (this works), extract the reviews embedded in the page HTML, save with `via: "web-unlocker"`. Either way, the Unlocker gets a real credit (the Play page fetch) and the story stays honest.

**Done when:** `out/play-reviews.json` exists with ≥ 30 reviews and a `via` field, and the page's first source card reads e.g. `App Store feed · public API + Google Play · Web Scraper API` with real counts. **Clusters stay computed from the 210 Apple negatives** — do not blend corpora into a percentage you didn't compute. If you add Play negatives to the cluster math, recompute and record the method in `research.json.meta`.

### 3 · Page (45 min)

Copy is close; make it final against the arc. Then the checks that matter on a projector:

- Hero subline names the pain in one breath (not the method).
- "Half of it held. Half of it pushed back." reveal keeps the pushback line visible on one 1080p screen with the clusters.
- Final scene: placeholder intention is a real sentence; `Enter` starts; `Escape` aborts; after completion the CTA to moment.szlezingier.com is above the fold at 1080p.
- Headless pass at 1920×1080 and 390×844 (`.claude/launch.json` serves `page/` on :8765; Brave via playwright-core at `/Applications/Brave Browser.app`). Zero `PAGEERROR`.
- Republish to the **same artifact URL**. Kew must unpin the old version in the artifact UI — remind them in your final message.

**Done when:** a full scroll + one completed Moment run headlessly with no console errors at both sizes, and the live URL serves the new title.

### 4 · Deck (45 min)

`docs/deck.js` → ≤ 10 slides in the arc order. Bright Data is the subject; Moment the example. Slide 3 shows the three real request shapes; slide "what pushed back" is the ROI slide; slide "live" shows the exact `ask.js` output as an offline fallback. Build with `node docs/deck.js` (pptxgenjs via `NODE_PATH` or local install), validate with the pptx skill's `validate.py`, and look at every slide in PowerPoint (it's installed; `open -a "Microsoft PowerPoint"`). Fix overflow and collisions before moving on.

**Done when:** validator passes and every slide has been viewed at full size.

### 5 · Talk (30 min)

`docs/TALK.md`: ≤ 5:00 with the live call inside it, beat for beat with the deck. Spoken ≈ 520 words. Include: cut lines if running long, the "wifi dies" fallback, four likely questions. Then **read it aloud with a timer** (use `say` at 170 wpm as a proxy if Kew isn't there) and trim until 4:40.

**Done when:** the proxy read is ≤ 4:40 and every claim in it appears verbatim in `research.json` or `moment-serp.json`.

### 6 · Stage kit (30 min)

- Terminal profile: `cd engine && node src/ask.js "how to remember my intention for the day"` runs green in a fresh shell (proves `.env` loading on this machine). Font ≥ 18pt.
- Optional, only if everything above is done: `claude mcp add brightdata -e API_TOKEN=<from .env> -- npx -y @brightdata/mcp` and rehearse one prompt ("search reddit for people who say meditation didn't change their behavior; quote the top three") so Kew can show a coding agent using Bright Data conversationally. If it's flaky, leave it out — `ask.js` is the demo.
- Offline pack in `docs/stage/`: PNG of each deck slide, PNG of `ask.js` output, PNG of the page's final scene. If the venue network dies, the talk still runs.
- `docs/CHECKLIST.md`: the 10-line pre-stage checklist (artifact unpinned, terminal green, deck open on slide 1, page open on scene 1, phone timer, water).

**Done when:** every item in `CHECKLIST.md` has been executed once by you.

---

## Hard rules (these are the demo's integrity claim — break one and the talk is a lie)

1. Every quote verbatim from `out/corpus.json`, `out/moment-serp.json` or `out/play-reviews.json`; light `…` trimming only.
2. Every percentage computed from a corpus you can point to; method recorded in `research.json.meta`.
3. Every source credited by the path that actually served it. `collect.js` counts it; the page says it.
4. The page stays one self-contained file with the `research-data` blob contract intact; the renderer stays above the observers.
5. Same artifact URL, always.
6. `.env` values are never printed, logged, or committed.

## Final message to Kew

One screen: what is live (URLs), what the three APIs did (with counts), the one thing only they can do (unpin the artifact), and the sentence to open with. Nothing else.
