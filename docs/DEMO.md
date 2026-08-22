# The demo — the verdict page, then Bright Data in chat

Decided Aug 22 (Kew + PR): **the page is the demo**, then show that you can use Bright Data *conversationally* — Claude with the Bright Data MCP server — to learn how the APIs work. The room closes with the one-minute Moment.

**Two windows, one keyboard.** Brave full-screen on the page (`⌘⇧F`); behind it, Claude Code opened in `~/Documents/first-breath` with the `brightdata` MCP connected (`/mcp` shows it). A `⌘Tab` between them.

Budget: page story 2:20 · chat 1:40 · the minute 1:00 → 5:00. If you're over when you come back to the page, skip the minute and close on scene 7.

---

## Part 1 · The verdict page — 0:00 → 2:20

https://claude.ai/code/artifact/9771a3f5-ac0a-4d4d-8101-293b0aa82f15 (unpinned, see checklist). Scroll one scene per beat; say one or two sentences each.

| Scene | On screen | Say |
|---|---|---|
| 1 · Hero | *prove me wrong · the verdict on Moment* — "Twenty minutes of calm on the cushion. Then the day happens." | I built a meditation app called Moment. Before telling anyone, I asked the web whether the idea was true. This page is the verdict — every line on it came through Bright Data, verbatim, or was computed. |
| 2 · Noise | the app-store chips | The problem, half one: you decide to meditate and the app store hands you a thousand doors. |
| 3 · Alone | "Calm for twenty minutes. Then the day happens." | Half two: even when it works, the calm stays on the cushion. |
| 4 · Hypothesis | "Two things are broken." H1 · H2 | So those were my two hypotheses — and Moment was the bet: one sentence, a pause every thirty minutes, one minute to choose again. A bet is not a business, so I tried to break it first. |
| 5 · Ask | three source cards | Three Bright Data APIs did the asking. The Web Scraper API pulled three hundred Google Play reviews as structured rows. The SERP API found the reddit threads — via `site:` — and ran twelve questions, a third of them written to refute me. The Web Unlocker read the pages behind the links. Each card says which API served it. |
| 6 · Reveal | quotes → 52 · 17 · 16 → the pushback → the verdict | Half of it held: fifty-two percent paywall fatigue, computed from two hundred and ten negative reviews — "I want a calming app to be calming." Half pushed back: the bell exists, the minute exists — One-Moment Meditation, registered trademark. And one thing no result offers: remembering *your own* intention at the moment it matters. |
| 7 · The way | "The data didn't confirm my product. It sharpened it." | I couldn't ship Moment as a reminder app. I can ship it as the thing that hands your sentence back to you. That's what the web did for me in one evening. *(⌘Tab to Claude Code)* Here's how you'd do it without writing the engine. |

## Part 2 · Bright Data in chat — 2:20 → 4:00

Claude Code, project `~/Documents/first-breath`, MCP server **brightdata** (tools: `search_engine`, `scrape_as_markdown`, `discover`, `search_engine_batch`, `scrape_batch`). Type the prompts; narrate what each tool is under the hood. Rehearsed timings are from Aug 22 runs.

**Prompt 1 — the SERP API (≈ 10 s)**
```
Use the Bright Data tools. Search Google for: meditate every day but still reactive.
Give me the top 3 as: title — link — one verbatim sentence from the snippet.
```
*Say:* That's `search_engine` — the SERP API. Under the hood it's one `POST api.brightdata.com/request` with the SERP zone and `brd_json=1`; Google comes back parsed — rank, title, link, snippet — no HTML. Result #1 should be the r/Meditation thread: "I've been meditating almost every day for a year and feel …" — the same row that's on the page.
*If it answers "Unexpected non-JSON response from Bright Data":* Google captcha'd the zone (it did on 1 of 2 rehearsal runs). Say so — "Bright Data reports the captcha instead of pretending, and locks that query for fifteen seconds" — run **prompt 2** now, then come back and ask again: "try that search once more". The retry succeeded in 4 s.

**Prompt 2 — the Web Unlocker (≈ 5 s)**
```
Now open https://www.headspace.com/meditation-101/trouble-meditating with Bright Data
and list the 17 common issues as short bullets.
```
*Say:* That's `scrape_as_markdown` — the Web Unlocker. Same endpoint, different zone; blocks, fingerprints and captchas handled on their side, and the page comes back as Markdown. The industry's own page admitting the gap — the engine fetched this exact page this morning, 451 KB.

**Prompt 3 — the honest "no" (≈ 5 s)**
```
Do the same for the reddit thread from result 1.
```
*Say:* No thread — you get either an empty body or reddit's login shell ("Sign up · Log in"), never the content. Reddit is policy-gated on the Unlocker without KYC. That's why the engine asks Google for `site:reddit.com/r/Meditation` through the SERP API, and why the page credits the threads to the SERP API, not the Unlocker. Credit the path that served.

**Prompt 4 — if there's time (≈ 8 s): the query written to refute**
```
Use discover with the intent "first-person accounts of people saying daily meditation made them LESS reactive".
That's the opposite of what I believe — what does it find?
```
*Say:* `discover` ranks by intent. Searching for the people who disagree with you is the whole method — the engine ran four of these. Three APIs, one endpoint; the chat just let me use them without writing a line.

*(⌘Tab back to Brave, scroll to the last scene.)*

## Part 3 · The minute — 4:00 → 5:00

Scene 8. *Say:* The page ends the way the product does. Write one sentence about how you want to move through tonight. *(Type yours, or leave the placeholder. `Enter`.)* Six breaths. The sentence comes back halfway. *(silence)* — "Now choose again." Thank you.

`Escape` aborts if something goes wrong. "Again · with a new sentence" re-runs.

---

## Fallbacks

- **MCP not connected in the app** → run in a terminal instead: `cd engine && node src/ask.js "meditate every day but still reactive"` — the same SERP call, printed. The chat outputs captured on Aug 22 are in `docs/stage/chat-outputs.md`; read from them.
- **Google pushes back on the zone** → the MCP says "Unexpected non-JSON response"; say it, run prompt 2, ask again (≥ 15 s later). If it fails twice, `docs/stage/chat-outputs.md` has the real output from this morning — read result #1 from there.
- **Wifi dies** → `docs/stage/page-reveal.png`, `docs/stage/chat-outputs.md`, and the page itself works offline from `page/index.html`.
- **Over time** → drop prompt 4, then drop the minute.

## Setup (already done on this Mac, Aug 22)

- `claude mcp add brightdata -s local -e API_TOKEN=<from engine/.env> -e WEB_UNLOCKER_ZONE=web_unlocker1 -- npx -y @brightdata/mcp` → stored in `~/.claude.json` for this project (not in the repo). `claude mcp list` → `brightdata … ✔ Connected`. On first start the server created a zone named `mcp_browser` in the Bright Data account (its own requirement).
- Alternative for claude.ai on the web: Settings → Connectors → add `https://mcp.brightdata.com/mcp?token=<token>`.
- Verified tool calls (Aug 22): `search_engine` 4–8 s (2.9 KB JSON; 1 in 2 runs hit a Google captcha first — retry works after ~15 s), `scrape_as_markdown` headspace.com 1.4–1.6 s (28 KB Markdown), reddit.com → empty body or login shell (KYC), `discover` 7–19 s (ranked with `relevance_score`). Outputs in `docs/stage/chat-outputs.md`.

## Likely questions

- **"What's the difference between the chat and the engine?"** Same APIs. The MCP server wraps them as tools (`search_engine` = SERP API, `scrape_as_markdown` = Web Unlocker, `discover` = intent-ranked search); the engine calls `POST /request` and `/datasets/v3` directly and records which path served every row. Use the chat to explore; use the engine when you need the rows and the receipts.
- **"Why didn't the Unlocker get reddit / Apple?"** Policy-gated without KYC (`destination_ip_prohibited`, `Residential Failed (bad_endpoint)`); apps.apple.com answered 200 with an empty body. The engine records every one of those and falls back — reddit via `site:` through SERP, Apple via its public feed. The page credits exactly that.
- **"Are the percentages real?"** `engine/src/clusters.js` — negative = rating ≤ 3, three regexes, non-exclusive; `node src/verify.js` checks the page matches.
