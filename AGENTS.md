# AGENTS.md — coding-agent briefing for First Breath

You are stepping into a **live hackathon project the night before the event** (Bright Data GTM event, Aug 22, 2026, owner: Kew). Read this whole file before touching anything. The demo works *right now* — your job is to improve it without breaking a working thing.

## What this is, in one breath

A go-to-market story told by the web itself. Kew teaches pragmatic meditation ("start a timer, count your breaths"). A Node.js engine collects real market signal through **Bright Data** (app-store reviews of Calm/Headspace/Waking Up, Reddit threads, Google SERPs), distills it into a small research object, and injects it into a **scroll-based storytelling landing page** where every quote and percentage is real and verbatim. The page ends with a working ten-breath timer — the audience meditates together. The page is simultaneously the demo, the deliverable, and the pitch.

## Current status — all of this is DONE and VERIFIED

- ✅ **The page** (`page/index.html`) is finished, data-driven, and published as a Claude Artifact: https://claude.ai/code/artifact/9771a3f5-ac0a-4d4d-8101-293b0aa82f15
- ✅ **The engine ran for real** on Aug 21: **450 app-store reviews (210 negative), 30 reddit threads, 42 SERP rows** → `engine/out/corpus.json` (188 KB, gitignored, exists on Kew's machine).
- ✅ **Real research is injected.** `engine/out/research.json` holds the analyzed result; the page's `research-data` blob carries it. Clusters are computed by **`engine/src/clusters.js`** (negative = rating ≤ 3, three non-exclusive regex classes; the regexes ARE the method): **52% Paywall fatigue · 17% Lost simplicity · 16% Choice overload** of the 210 negative App Store reviews. The earlier 48/20/14 came from an unrecorded classifier and was replaced on Aug 22 — never quote those. Five verbatim quotes, one from Google Play via the Web Scraper API. **`node src/verify.js`** checks quotes-verbatim, clusters-computed, page-blob-identical, card-counts — run it before any republish.
- ✅ **Third API is real (Aug 22).** `engine/src/play.js` → `out/play-reviews.json`: 300 Google Play reviews (100 × Calm/Headspace/Waking Up) via **Web Scraper API** dataset `gd_m6zagkt024uwvvwuyu`, snapshot `sd_mt3vkhhd29jyfi8u7k`, 179 s, 0 errors; 153 negative at ≤ 3 (134 at ≤ 2). Same regexes on Play: 54 / 11 / 14 — a cross-check only, not blended into the page numbers. `play.js --unlocker` fetched the three Play pages through **Web Unlocker** (3/3 · 200 OK · ~1.2 MB) — the Unlocker's honest credit. Page source card 1 reads "App Store feed · public API + Google Play · Web Scraper API".
- ✅ **Attribution verified (Aug 22).** Fresh `--collect-only`: App Store reviews **0 via unlocker, 9 via direct** — Apple hosts are policy-gated (`destination_ip_prohibited`, needs KYC), same as reddit. Footer: "Built with Bright Data SERP API · Web Scraper API · Web Unlocker · Apple's public review feed · Claude" — every credit backed by a run recorded in `research.json.meta.attribution`.
- ✅ **Deck + talk + stage kit (Aug 22).** `docs/deck.js` → 10 slides in the eight-beat arc (validated with the pptx skill's `validate.py`, rendered via LibreOffice); `docs/TALK.md` proxy-timed 3:57 spoken; `docs/stage/` holds slide PNGs, `deck.pdf`, `ask-output.png`, page scene PNGs; `docs/CHECKLIST.md` is the pre-stage list.
- ✅ **Projector pass done (Aug 22).** `@media (min-width:1500px)` scales the type system to 21px root; noise chips keep a clean corridor on wide screens and sit in staggered top/bottom bands on phones; SERP-gap insight rendered as a data-voice line above the verdict; breath timer can be re-run (`Again · ten breaths`) and `Escape` aborts a running session.
- ✅ `.env` auto-loading (`engine/src/loadenv.js`), resilient collectors with fallbacks, `--collect-only` and `--inject-only` modes, offline analysis path.

## Demo-day plan

`docs/DEMO-BRIEF.md` is the plan for the morning of Aug 22. **The product is Prove Me Wrong** — a hypothesis-breaker built on Bright Data's three APIs with a coding agent as analyst; Moment is its worked example, not the subject. Follow the brief before anything below; where this file and the brief disagree, the brief wins.

## The story (the one argument everything serves)

**The product is Moment** (https://moment.szlezingier.com): one intention, a pause every 30 minutes, one minute to choose again — meditation *inside* the day. "First Breath" is the repo's legacy name; the page and deck are about Moment now.

**Hypothesis → tried to break it → what held → what pushed back → the fix → how.** Kew's two-part hypothesis: (H1) meditation apps overwhelm people with content/choice; (H2) the calm stays in the session — people are still reactive in real life. The research exists to *question* that, not confirm it: `engine/src/question.js` runs 12 SERP queries, four of them written to refute (does practice carry over? do bells/one-minute apps already exist?). Result: H1 holds (52% paywall fatigue, 17% lost simplicity, 16% choice overload — computed by `clusters.js`; Google Play agrees); H2 holds for the people it fails, who prescribe the bridge themselves; **pushback**: Mindfulness Bell, MindBell, Chill, One-Moment Meditation® (a registered mark!) all exist; One-Moment Meditation® holds #1–#2 for 'one minute meditation reminder app' (Insight Timer is #3 — the old 'owns the SERP' line was wrong) — so Moment cannot be "a reminder app". What no result offers: remembering *your own intention* at the moment it matters (r/selfimprovement). The page, the deck (`docs/first-breath-how-it-works.pptx` ← `docs/deck.js`) and `engine/out/research.json` all follow this order; keep it when editing any of them. `engine/out/research.first-breath.json` is the previous (timer-product) research, kept for reference.

## The three environments (do not confuse them)

1. **Kew's Mac** — `/Users/kewin/Documents/first-breath` — the canonical working copy. Has `.env` with real credentials (NEVER read, print, or commit its values), `engine/out/corpus.json` with the real run, and a git remote `origin` already configured.
2. **The Claude Artifact** — the published page. Republishing must keep the SAME URL. If you are Claude in the original Cowork session, republish the same file path; from anywhere else, pass the artifact URL explicitly as the update target. Never publish the page as a *new* artifact.
3. **A session/CI checkout** — wherever you are running. Git history is authoritative for code; `engine/out/*` only exists where a run happened.

## File map

```
page/index.html          THE page. Single self-contained file (Google Fonts only external).
                         Renders scenes 5–6 from <script id="research-data" type="application/json">.
engine/src/loadenv.js    Zero-dep .env loader. MUST stay the first import in run.js.
engine/src/brightdata.js Bright Data client: POST api.brightdata.com/request (Bearer token).
                         unlock()/unlockJson() = Web Unlocker zone; serp() = SERP zone (brd_json=1).
                         triggerDataset()/waitForSnapshot() = Web Scraper API (unused, ready).
engine/src/collect.js    3 fan-outs + fallbacks (see "hard-won lessons"). pathStats tracks
                         unlocker-vs-direct so attribution stays honest.
engine/src/analyze.js    buildPrompt() / parseAnalysis() / analyze() (Anthropic SDK).
engine/src/run.js        Orchestrator. Flags: --collect-only, --inject-only.
engine/src/question.js   Hypothesis sweep for Moment: 12 SERP queries (incl. refuting ones) → out/moment-serp.json.
engine/src/ask.js        Stage helper: one SERP call, printed for a room. `node src/ask.js "<query>"`; `--cached` = offline fallback.
engine/src/play.js       Google Play reviews via Web Scraper API (`--snapshot <id>` resume, `--unlocker` fallback) → out/play-reviews.json.
engine/src/clusters.js   THE cluster method (regexes) — `node src/clusters.js` reproduces the page percentages.
engine/src/verify.js     Integrity gate: quotes verbatim · clusters computed · page blob identical · counts match. Run before republish.
docs/CHECKLIST.md        Pre-stage list. docs/stage/ = offline pack (slide PNGs, deck.pdf, ask-output.png, page scenes).
docs/TALK.md             The 5-minute talk (API-centric: Bright Data is the subject, Moment the example).
engine/out/research.json The analyzed result currently live on the page (committed? no — out/ is
                         gitignored, but this file was hand-synced to Kew's Mac; treat as data).
SPEC.md                  Product+technical spec, incl. the data contract. Keep it true.
docs/ARCHITECTURE.md     End-to-end walkthrough + failure-mode table. Keep it true.
```

## Hard rules — breaking these breaks the demo

1. **Never invent or paraphrase a quote.** Every `quotes[].text` must be verbatim (light `…` trimming allowed) from `engine/out/corpus.json`. This is the project's integrity claim on stage.
2. **Never fabricate percentages.** Cluster `pct` values are computed from the corpus (current method: keyword-class share of negative reviews; recorded in `research.json.meta`).
3. **The data contract is frozen** unless you update both sides in the same change: blob shape is `{ sources[3]{api,what,from}, quotes[3–5]{text,src}, clusters[3]{pct,label,of} }`, injected by regex-replacing the `research-data` script block. `run.js inject()` and the page's renderer must always agree.
4. **The page stays one self-contained file.** No build step, no external JS/CSS (Google Fonts is the only allowed external host — Artifact CSP blocks everything else). The artifact publish path wraps the file in the HTML skeleton, so the file has NO doctype/html/head/body tags of its own. Keep it that way.
5. **The renderer runs before the reveal observers.** In the page's script, the research-data rendering block must stay ABOVE the IntersectionObserver setup, or injected content never animates in.
6. **`.env` and `engine/out/` are gitignored.** Keep them so. There are stray files on Kew's Mac (`.env` at repo root, `engine/.env copy`) — harmless, leave them alone.
7. **Respect `prefers-reduced-motion`** and the keyboard-focusable CTA. Accessibility is part of the design spec, not a nice-to-have.

## Hard-won lessons (we already paid for these — don't re-learn them)

- **Node does not read `.env` without `--env-file`.** That cost us an hour. `loadenv.js` exists so plain `node src/run.js` works; keep it the first import.
- **reddit.com is KYC-gated on Bright Data.** Web Unlocker returns plain text: `"Residential Failed (bad_endpoint): Requested site is not available for immediate residential (no KYC) access mode in accordance with robots."` The collector falls back to mining reddit through the SERP zone (`site:reddit.com/r/…`) — snippets, not full threads. If Kew completes KYC, the direct path starts working automatically.
- **Apple's review feed** (`itunes.apple.com/…/rss/customerreviews/…/json`) sometimes returns an empty body through the unlocker. The collector tries two URL orderings and falls back to direct fetch (public API, 20s timeout). `collect.js` logs `X pages via unlocker, Y via direct fallback` — **check this before making claims about which API served the reviews.** The page currently credits "Web Unlocker API"; if a fresh run shows direct-fallback dominated, adjust the source card label or get KYC done.
- **Kew's Anthropic API key has no credits** (separate billing from the Claude subscription). `analyze()` will 400. The run degrades gracefully: it writes `out/analysis-prompt.md` for a paste-into-claude.ai flow → save reply as `out/research.json` → `node src/run.js --inject-only`. The current `research.json` was produced by Claude in-session from the real corpus, not via the API.
- **Bright Data error bodies are plain text**, not JSON — always surface a body snippet in errors (`brightdata.js` does; keep it).
- **The SERP zone answers HTTP 200 even when Google blocked it.** The truth is in headers: `x-brd-status-code: 502` + `x-brd-error-code: expect_body | captcha`, with an empty body. During a captcha wave on Aug 22, 40–60 % of first attempts failed, and a failed query is then locked for 15 s under its exact text (`failed_query_rejected`). `serp()` now retries with text variants (`q?`, `q ?`) and one 16 s wait; `ask.js` caches every success in `out/ask-cache.json` and prints a labelled cached answer if all five attempts fail (`--cached` forces it). The `num` parameter is rejected by the zone — don't add it back.
- **The Web Scraper snapshot can report `ready` before its rows are flushed** — the first download returned `[]` for a 300-record snapshot. `play.js --snapshot <id>` re-downloads.
- **The cluster numbers must be reproducible.** The first research.json carried percentages whose classifier was never saved; reconstructing it was impossible. `clusters.js` is the fix — if you change a regex, rerun clusters → research.json → `--inject-only` → republish, and update deck/talk/README.
- **PowerPoint on this Mac cannot be scripted** (no `save` verb in its AppleScript dictionary, no assistive access) and LibreOffice is not installed in /Applications. A scratchpad cask install (`brew install --cask libreoffice --appdir=<scratchpad>/apps`) rendered the deck for QA. Do not count on PowerPoint for PNG export.

## How to run / verify

```bash
cd engine && npm install               # @anthropic-ai/sdk is the only dep
node src/run.js --collect-only         # needs .env with BRIGHTDATA_API_TOKEN,
                                       # BRIGHTDATA_UNLOCKER_ZONE, BRIGHTDATA_SERP_ZONE
node src/run.js --inject-only          # injects existing out/research.json into ../page/index.html
node --check src/*.js                  # minimum bar before any commit
```

Verify an inject by parsing the blob back out of the page (the regex round-trip is tested; keep it green). Sanity-check the page by opening it — scroll all eight scenes, run the breath timer to completion, confirm quotes/clusters match `research.json`.

## What's genuinely left (priority order)

1. ~~Attribution check~~ — done Aug 22, see status above.
2. **Live-agent side demo (optional, Kew's call)** — `claude mcp add brightdata -e API_TOKEN=<token> -- npx -y @brightdata/mcp` puts the token in Claude's config, so it was left for Kew. `ask.js` is the rehearsed live step; the MCP demo only if it rehearses cleanly.
3. ~~Projector pass~~ — done Aug 22 (headless Brave at 1920×1080 and 390×844; `.claude/launch.json` serves `page/` on :8765 for re-checks).
4. ~~SERP-gap polish~~ — rendered (`.gap` line in the reveal scene; wording verified against the 9 corpus rows for that query).
5. ~~Push to GitHub~~ — pushed Aug 22.

## Tone of the thing

The design is deliberate: single-theme dark meditative world, ember `#D9954A` = the human voice (Fraunces serif), web-blue `#6E9BD1` = the machine voice (IBM Plex Mono for API labels and counts). The reveal scene is where blue evidence resolves into amber conclusions. If you add anything visual, it must pick one of those two voices — nothing neutral, nothing decorative.
