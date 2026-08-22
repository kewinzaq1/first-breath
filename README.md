# Moment — the web tried to break it first

**A go-to-market story told by the web itself.** Built for the Bright Data GTM event, Aug 22, 2026.

> Repo name note: this repository (and the published artifact) is still called **First Breath**, the project's original working title. The product, the page, the deck and the talk are all about **Moment**.

**Live page:** https://claude.ai/code/artifact/9771a3f5-ac0a-4d4d-8101-293b0aa82f15 · **Product:** https://moment.szlezingier.com

## The story, in eight beats

1. **The pain.** Meditation apps sell calm and deliver a marketplace — ten thousand sessions, streaks, paywalls. And even when it works, the calm stays on the cushion: you sit for twenty minutes, feel present, then snap at your kid at 6pm, eat the second plate, scroll until 2am. The practice never reaches the moment where life actually happens.
2. **The bet.** Two hypotheses — **H1:** apps overwhelm people with content and choice; **H2:** the calm stays in the session, people are still reactive in real life. The product that follows is **Moment**: one sentence about how you want to move through today, a pause every 30 minutes, one minute to breathe and choose again. Meditation *inside* the day, not beside it.
3. **"Prove me wrong."** Before pitching it, Kew asked the web to break it. One Node engine wired to Bright Data, plus a coding agent that turned raw rows into a research object and injected it into a page. A third of the queries were written to *refute* the hypothesis.
4. **The three calls.** Each Bright Data API used for what it's best at — **SERP API** (`brd_json=1`) for Google and for reddit via `site:`; **Web Scraper API** for structured Google Play reviews; **Web Unlocker** for reaching the Play page. Apple's reviews came from Apple's public feed, and the page says so.
5. **What held.** H1: of 210 negative App Store reviews, 52% are paywall fatigue, 17% lost simplicity, 16% choice overload — and 300 Google Play reviews pulled through a second API land on the same shape. H2: held for the people it fails — *"when another same trigger arose, I was still reactive"* — and they prescribe the bridge themselves.
6. **What pushed back.** Mindfulness Bell, MindBell, Chill and One-Moment Meditation® already exist; Insight Timer owns the SERP. The bell and the minute are taken. What no result offers: remembering *your own intention* at the moment it matters (r/selfimprovement: *"23 minutes later I'm in the thick of…"*).
7. **The sharpened product.** Moment is not a reminder app and not a meditation library. It hands you back the sentence you chose this morning, in the middle of real life, with one minute to choose again.
8. **The room does it.** The page ends in a working one-minute Moment: write one sentence, six breaths, the sentence returns mid-breath — *"Now choose again."*

## How it works

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Bright Data ──▶  engine/src/{collect,question,play}.js  ──▶  engine/out/  │
│    ├─ SERP API         google queries (12 written to break H1/H2) +        │
│    │                   reddit threads via site:reddit.com/r/…              │
│    ├─ Web Scraper API  Google Play reviews (Calm · Headspace · Waking Up)  │
│    └─ Web Unlocker     the Play store page itself (Apple/reddit hosts are  │
│                        KYC-gated — the collector records what served)      │
│  Apple public feed ──▶ 450 App Store reviews (210 negative)                │
│                                                                            │
│  corpus ──▶ analysis (a coding agent, in-session) ──▶ out/research.json     │
│              · verbatim quotes · computed clusters · verdict · pushback    │
│                                                                            │
│  research.json ──▶ engine/src/run.js --inject-only ──▶ page/index.html     │
│                    (replaces <script id="research-data"> in place)         │
└──────────────────────────────────────────────────────────────────────────┘
```

| Path | What it is |
|---|---|
| `page/index.html` | The scrollytelling page — one self-contained file; scenes 5–6 render from the embedded `research-data` blob; the last scene is the one-minute Moment |
| `engine/src/run.js` | Orchestrator: collect → analyze → inject (`--collect-only`, `--inject-only`) |
| `engine/src/question.js` | The 12-query hypothesis sweep (gap / want / competition) → `out/moment-serp.json` |
| `engine/src/play.js` | Google Play reviews through the Web Scraper API (Unlocker fallback) → `out/play-reviews.json` |
| `engine/src/ask.js` | The live step: one SERP call, printed for a room |
| `engine/out/research.json` | The research object currently on the page (quotes verbatim, clusters computed, verdicts, counter-evidence, method in `meta`) |
| `docs/deck.js` → `docs/first-breath-how-it-works.pptx` | The talk deck, same eight beats |
| `docs/TALK.md` | The five-minute talk with the live call inside it |
| `SPEC.md` · `docs/ARCHITECTURE.md` | Data contract and end-to-end walkthrough |

## Quickstart

**Prereqs:** Node ≥ 20 · a [Bright Data](https://brightdata.com/cp) account with a **SERP API zone**, a **Web Unlocker zone**, and access to the **Web Scraper API** (dataset `Google Play Store reviews`).

```bash
cd engine
npm install
cp .env.example .env            # BRIGHTDATA_API_TOKEN + zone names (.env is auto-loaded by src/loadenv.js)

node src/run.js --collect-only  # reviews, reddit-via-SERP, 5 landscape queries → out/corpus.json
node src/question.js            # 12 hypothesis queries → out/moment-serp.json
node src/play.js                # Google Play reviews via Web Scraper API → out/play-reviews.json
node src/ask.js "how to remember my intention for the day"   # the live step

node src/run.js --inject-only   # out/research.json → page/index.html
```

Analysis: `run.js` will call the Anthropic API if `ANTHROPIC_API_KEY` has credits; otherwise it writes `out/analysis-prompt.md` and a coding agent (or you, in claude.ai) produces `out/research.json` from the corpus. That is how the current research object was made.

## Integrity rules

Every quote on the page is verbatim from `engine/out/corpus.json`, `moment-serp.json` or `play-reviews.json` (light `…` trimming only). Every percentage is computed from a corpus you can point to, with the method in `research.json.meta`. Every source is credited by the path that actually served it. These are the demo's claim on stage — see `AGENTS.md` for the full rules.

## Generalizing

Nothing here is meditation-specific. Change the app IDs in `collect.js`/`play.js`, the query buckets in `question.js`, and the same loop — *two sentences of hypothesis, a third of the queries written to kill it, keep it honest* — produces an evidence-backed GTM story for any idea.

MIT licensed. Built with Bright Data SERP API · Web Scraper API · Web Unlocker · Apple's public review feed · Claude.
