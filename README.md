# First Breath 🌬️

**A go-to-market story told by the web itself** — built for the Bright Data GTM event, Aug 22, 2026.

First Breath is a pragmatic meditation product idea (start a timer, count your breaths, nothing else) and a demonstration of what GTM research looks like when you stop guessing: a research engine collects real market signal through **Bright Data**, **Claude** distills it into positioning evidence, and the result renders as a scroll-based storytelling landing page where every quote and percentage on screen is real, verbatim, and sourced.

**Live page:** https://claude.ai/code/artifact/9771a3f5-ac0a-4d4d-8101-293b0aa82f15

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   Bright Data ──▶  engine/collect.js  ──▶  corpus.json              │
│    │                                                                │
│    ├─ Apple review feed (public API; Unlocker is KYC-gated there)  │
│    ├─ Web Unlocker → reddit threads (r/Meditation, r/getdisciplined)│
│    └─ SERP API     → google results for beginner queries            │
│                                                                     │
│   corpus.json ──▶  engine/analyze.js (Claude)  ──▶  research.json   │
│                     · clusters pain points (real %)                 │
│                     · picks 4 verbatim quotes                       │
│                     · names the search gap                          │
│                                                                     │
│   research.json ──▶  engine/run.js  ──▶  page/index.html            │
│                       injected into <script id="research-data">     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Repo layout

| Path | What it is |
|---|---|
| `page/index.html` | The scrollytelling landing page — one self-contained file, renders its research scene from an embedded JSON blob |
| `engine/` | Node.js research pipeline: collect (Bright Data) → analyze (Claude) → inject (page) |
| `SPEC.md` | Product + technical spec: story scenes, data contract, acceptance criteria |
| `docs/ARCHITECTURE.md` | How everything works end to end, module by module |

## Quickstart

**Prereqs:** Node ≥ 20 · a [Bright Data](https://brightdata.com/cp) account with a **Web Unlocker zone** and a **SERP API zone** · an Anthropic API key.

```bash
cd engine
npm install
cp .env.example .env      # fill in: BRIGHTDATA_API_TOKEN, zone names, ANTHROPIC_API_KEY

# Full pipeline — collect, analyze, inject into ../page/index.html:
node src/run.js          # .env is auto-loaded (src/loadenv.js) — no flag needed

# Or test the Bright Data side alone (no Anthropic key needed):
node src/run.js --collect-only
```

Outputs land in `engine/out/`: `corpus.json` (raw collected signal) and `research.json` (the distilled result). The final step rewrites the `research-data` blob inside `page/index.html` in place. Open the page or republish it — the story now runs on real data. Once it does, delete the "illustrative placeholders" note in the page footer.

## The demo (2½ minutes)

1. **The hook** (say it, don't slide it): *"I teach meditation by starting a timer and telling people to count their breaths. I always wondered if that's a product — so instead of guessing, I asked the web."*
2. **The engine** — run `node src/run.js` on screen: watch it collect reviews, threads, and SERPs through Bright Data, then print Claude's GTM insights to the terminal.
3. **The story** — scroll the landing page: noise → disconnection → instinct → the Bright Data fan-out → real quotes clustering into pain points → positioning.
4. **The close** — the page's ten-breath timer. The room breathes together. *"That's the whole product — and this is what GTM looks like when the web shows you the way."*

**Live-agent variant:** the same research can run agentically through Bright Data's official MCP server (`npx @brightdata/mcp`, or hosted at `https://mcp.brightdata.com/mcp?token=…`), letting Claude drive `search_engine`, `scrape_as_markdown`, and structured `web_data_*` tools live on stage. Recommended flow: bake real data with the deterministic pipeline *before* the demo; show the agent as the "how it was made" moment. See `docs/ARCHITECTURE.md`.

## Generalizing beyond meditation

Nothing in the pipeline is meditation-specific. Swap the app IDs, subreddits, and queries at the top of `engine/src/collect.js`, adjust the product framing in `engine/src/analyze.js`, and the same engine produces the same evidence-backed GTM story for any product idea. That's the pitch: **a repeatable playbook — idea in, sourced go-to-market narrative out.**

## Notes & compliance

- All web access flows through Bright Data's `/request` endpoint — two zones, one token, zero scraping infrastructure of your own.
- A default run is ~9 Apple-feed fetches (Unlocker attempted first) + ~8 SERP queries — well inside a trial account.
- Quotes are used verbatim for research/demo purposes; respect target-site ToS beyond the demo. Bright Data's compliance layer is part of the story.

MIT licensed. Built with Bright Data SERP API · Apple's public review feed · Claude. (Web Unlocker and Web Scraper API paths are wired and ready once the account has KYC.)

## The product

The product is **[Moment](https://moment.szlezingier.com)** — one intention, a pause every thirty minutes, one minute to choose again. This repo is the go-to-market research that tried to break Moment's hypothesis with real web data, and the page that tells that story. ("First Breath" is the repo's original name.)

## Talk deck

`docs/first-breath-how-it-works.pptx` — ten slides, hypothesis → tried to break it → what held → what pushed back → the fix → how. Regenerate with `node docs/deck.js` (needs `pptxgenjs`). Every quote and number on it is the same `research.json`/corpus as the page.
