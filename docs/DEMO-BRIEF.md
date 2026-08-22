# Demo brief — morning of Aug 22, 2026

You are a coding agent preparing Kew's demo for the Bright Data GTM event tonight. Read `AGENTS.md` for environments, hard rules and hard-won lessons. This file is the plan and overrides every older narrative doc. **The product below is decided. Build it; do not redesign it.**

Budget: ~5 hours. Work the steps in order; each ends on a checkable bar. When a step blows its timebox, take its fallback and move on.

---

## The product: Prove Me Wrong

**What it is.** A tool for founders who are too attached to their idea. You give it your hypothesis in two sentences, the community where your users tell the truth, and the names of your would-be competitors. It goes to the web through Bright Data and comes back with a verdict page: *what held, what was refuted, what nobody is doing* — every line a verbatim quote or a computed number, every source credited by the path that served it.

**Why it lands at a Bright Data event.** It is not "an AI agent". It is a product whose only moving part is Bright Data — three APIs, each doing the job it's best at — with a coding agent as the analyst. The audience leaves with a loop they can run on their own idea tonight.

**The pain (real, and the emotional arc).** Every founder in the room has shipped a positioning that the web could have refuted for five dollars. We don't check, because we're afraid of the answer. Prove Me Wrong makes the web the honest friend: it searches for the people who disagree with you first.

**The worked example (Kew's own idea).** Moment — "meditation inside the day, not beside it." Hypothesis H1: apps overwhelm; H2: the calm stays on the cushion. The tool found: H1 held (48% paywall fatigue, 20% choice overload of 210 negative reviews). H2 held for the people it fails ("when another same trigger arose, I was still reactive"). **Refuted:** Mindfulness Bell, MindBell, Chill, One-Moment Meditation® already exist — the bell and the minute are taken. **Unclaimed:** remembering *your own intention* at the moment it matters ("23 minutes later I'm in the thick of it", r/selfimprovement #1). A wrong positioning and a trademark collision, caught before launch. That is the demo's proof that the product works.

**The lingering moment.** Kew runs it live on his own idea and reads the refutation out loud. Then takes one hypothesis from the room and runs it — 30 seconds, real results, on stage. Founders watching their idea get argued with, in public, by the web. That beats "AI agent" #99999.

Arc, in order: *the founder's fear → "give it your idea" → the three calls (what each API does) → Moment: what held → Moment: what was refuted → the unclaimed job → live on a stranger's idea → the recipe.*

---

## What exists (verified Aug 22, 01:00) — reuse, don't rebuild

- `engine/src/brightdata.js` — `serp()` (SERP zone, `brd_json=1`), `unlock()`/`unlockJson()` (Web Unlocker), `triggerDataset()`/`waitForSnapshot()` (Web Scraper API; wired, never run).
- `engine/src/collect.js` — Apple reviews (public feed; Unlocker is policy-gated there), reddit via SERP `site:` (KYC workaround), SERP landscape. `pathStats` tracks which path served.
- `engine/src/question.js` — the 12-query hypothesis sweep for Moment (buckets: gap / want / competition). **This is the seed of the product.**
- `engine/src/ask.js` — one SERP call printed for a room (~1.8 s).
- `engine/out/corpus.json`, `moment-serp.json`, `research.json` — Moment's real run. Irreplaceable; never overwrite.
- `page/index.html` — a data-driven scroll story, single file, renders `research-data` blob (sources/quotes/clusters). Final scene is a one-minute Moment.
- API facts: SERP works for everything. Unlocker: Google Play resolves (200, 1.2 MB); Apple hosts + reddit need KYC. Anthropic API key has no credits — *you* are the analyst, in-session.

---

## Steps

### 1 · Generalize the engine into the product (90 min)

Input file `engine/hypothesis.json`:

```json
{ "product": "Moment", "url": "https://moment.szlezingier.com",
  "hypotheses": { "H1": "…", "H2": "…" },
  "community": ["reddit.com/r/Meditation", "reddit.com/r/selfimprovement"],
  "competitors": ["Calm", "Headspace", "Waking Up"],
  "apps": { "apple": ["571800810", "493145008", "1307736395"], "play": ["com.calm.android", "com.getsomeheadspace.android", "org.wakingup.android"] } }
```

`node src/provemewrong.js` (new; `loadenv.js` first import) runs three phases and writes `out/verdict-input.json`:

1. **SERP API — the argument.** Generate queries from the hypotheses in three buckets: *gap* (phrases that would confirm), *refute* (the opposite: "…actually works", "…does carry over"), *competition* ("<category> app", "<mechanism> app"). Plus `site:<community>` variants. Record `bucket`, `query`, rank, title, link, snippet, `people_also_ask`, `related`. Bar: ≥ 12 queries, ≥ 4 in *refute*.
2. **Web Unlocker — the full text.** For the top 5 non-reddit organic links in *gap* and *competition* (blogs, competitor landing pages, app-store pages that resolve), `unlock()` the page and keep `<title>`, meta description, and the first 1,500 chars of visible text. Record `via: "web-unlocker"` and, for policy-gated hosts, the error string verbatim. Bar: ≥ 5 pages fetched, failures recorded not hidden.
3. **Web Scraper API — reviews at scale.** `GET /datasets/list`, find the Google Play reviews scraper, `triggerDataset` for `apps.play` with `limit_per_input: 100`, `waitForSnapshot` → `out/play-reviews.json` (`via: "web-scraper-api"`). **Timebox 40 min.** Fallback: `unlock()` the three Play store pages and extract embedded reviews (`via: "web-unlocker"`). Either way the Apple public-feed path from `collect.js` still runs for the 450 reviews that the clusters are computed from.

Then the **coding agent as analyst**: write `out/analysis-prompt.md` (reuse `analyze.js buildPrompt` shape) and produce `out/research.json` yourself from the rows: `sources[3]`, `quotes[3–5]`, `clusters[3]`, `hypothesis.verdict {H1,H2,pushback,unclaimed}`, `counter_evidence[]`, `meta.attribution`. Moment's existing `research.json` is the reference answer — the new run must reproduce its verdicts from fresh rows or explain the difference in `meta`.

**Done when:** `node src/provemewrong.js` runs green from `hypothesis.json`, prints a one-line path summary per API (`serp 104 rows · unlocker 5/7 pages (2 policy-gated) · scraper 287 reviews`), and `research.json` is regenerated with all quotes traceable to a row in `out/`.

### 2 · The verdict page (60 min)

`page/index.html` becomes the product's output template. Keep the design system (dark, ember = human voice, blue = machine voice), the single-file rule and the blob contract — extend the blob with `product`, `hypotheses`, `verdict`, `counter_evidence`, and render them:

- Hero: `product` + "Prove Me Wrong" eyebrow + the two hypotheses as the fear ("this is what I believed").
- The ask: three source cards, one per API, with the path that actually served.
- The reveal: quotes (held), clusters, then the **pushback block** (counter-evidence list, blue) and the **unclaimed job** (ember).
- Final scene: the product's own CTA from `hypothesis.json` (for Moment: the one-minute Moment, already built; for any other product: a link). Keep the Moment scene as the example's ending — it's the emotional close.
- `run.js --inject-only` round-trips byte-identical. Headless pass at 1920×1080 and 390×844, zero `PAGEERROR`. Republish to the **same artifact URL**.

**Done when:** the page renders entirely from the blob (no Moment-specific copy outside `hypothesis.json`/`research.json`), and the live URL shows it.

### 3 · Live run on a stranger's idea (45 min)

The stage needs a 30-second path. `node src/ask.js "<query>"` already exists; add `node src/provemewrong.js --quick "<hypothesis sentence>" --community reddit.com/r/<sub>` which runs **SERP only** (4 queries: 2 gap, 1 refute, 1 competition) and prints: top result per bucket with snippet, then one line — `held / refuted / unclaimed` — derived by simple rules (competition bucket has a product in top 3 → "mechanism exists"; refute bucket top result agrees with you → "held"). Label it honestly on screen as *"first pass — the full run takes four minutes"*. Bar: runs in < 30 s on three different hypotheses you invent; never throws on an empty bucket.

### 4 · Deck + talk (60 min)

`docs/deck.js` → ≤ 10 slides in the arc order, Bright Data as the subject: (1) the founder's fear, (2) give it your idea — `hypothesis.json`, (3) the three calls with real request shapes, (4) SERP: queries written to refute + `site:`, (5) Unlocker: full text + policy gates designed for, (6) Scraper API: reviews at scale, (7) Moment: what held, (8) Moment: refuted + unclaimed (the ROI slide), (9) live — `--quick` output as offline fallback, (10) recipe + links. Validate with the pptx skill, view every slide in PowerPoint.

`docs/TALK.md` → ≤ 5:00 including one live run (≈ 40 s). Proxy-read ≤ 4:40. Every claim traceable to `research.json`.

### 5 · Stage kit (30 min)

Fresh-shell smoke test of `ask.js` and `--quick`; offline PNGs of every slide, both live outputs and the page's reveal + final scene in `docs/stage/`; `docs/CHECKLIST.md` (artifact unpinned, terminal font ≥ 18pt, deck on slide 1, page on scene 1, a second hypothesis ready in case the room is shy: *"Developers want an AI code reviewer that blocks merges"* with `r/ExperiencedDevs`).

---

## Hard rules (the product's integrity claim)

1. Every quote verbatim from a row in `engine/out/`; light `…` trimming only.
2. Every percentage computed from a corpus you can point to; method in `research.json.meta`.
3. Every source credited by the path that actually served it — including the gated ones, with the error text.
4. Page stays one self-contained file; blob contract extended in `run.js inject()` **and** the renderer in the same change; renderer above the observers.
5. Same artifact URL, always. `.env` values never printed or committed.
6. Moment's original run (`corpus.json`, `moment-serp.json`, `research.json` as of this morning) is preserved under `out/moment-2026-08-21/` before any new run writes to `out/`.

## Final message to Kew

One screen: the live URL; the three APIs with real counts from today's run; the `--quick` command to type on stage; the one thing only Kew can do (unpin the artifact; `dataset_id` if the list endpoint failed); the opening sentence: *"Every founder in this room has shipped a positioning the web could have refuted for five dollars. I built the thing that asks."*
