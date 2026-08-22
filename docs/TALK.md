# Break your own hypothesis with Bright Data — 5-minute talk

Audience: Bright Data GTM event. Subject: **how to use the APIs**. Moment is the worked example.
Total 5:00 · spoken ≈ 3:50 · live API call ≈ 0:45 · buffer 0:25.
Slides: `first-breath-how-it-works.pptx`. Terminal ready at `engine/` with `.env` loaded.

---

## 0:00 — Slide 1 · Title (20 s)

Everyone in this room has a product idea they're too attached to. I'll show you how I made the web argue with mine in one evening, using two Bright Data endpoints and about three hundred lines of Node — and what it cost me to be wrong.

## 0:20 — Slide 2 · The idea (30 s)

The example: I build Moment. My belief had two parts. One: meditation apps overwhelm people with content. Two: the calm stays in the session — you're present for twenty minutes, then snap at the same message at lunch. Moment is one sentence, a pause every thirty minutes, one minute to choose again.

Fine. But tonight's question isn't "is Moment good". It's: how do you get real people to argue with you *before* you build?

## 0:50 — Slide 3 · The APIs (45 s)

Everything I needed is one endpoint: `POST api.brightdata.com/request`, a zone, a URL, a Bearer token.

**SERP API** with `brd_json=1` — Google, parsed for you: organic results with rank, title, link, description; people-also-ask; related searches. No HTML in my pipeline anywhere. About 1.8 seconds a query.

**Web Unlocker** — same endpoint, any URL, blocks and fingerprints handled. One thing to know: its errors come back as plain text, not JSON. Surface a snippet; never `JSON.parse` blindly.

**Web Scraper API** — trigger a dataset, poll, download a snapshot. I wired it but didn't need it; it's the upgrade path for reviews at scale.

## 1:35 — Slide 4 · Pattern 1: queries that would kill you (40 s)

First pattern. If you only search for people who agree with you, the web will happily agree. So I bucketed twelve queries: *gap* — does the calm really stay on the cushion? *want* — what do people ask for instead? And *competition* — "mindfulness bell app", "one minute meditation reminder app" — written specifically to hurt.

Second trick: reddit is KYC-gated on the Unlocker. So I don't fetch reddit. I ask Google for `site:reddit.com/r/Meditation …` through the SERP zone and get titles and snippets of the exact threads. No KYC, no parsing. Twelve queries, a hundred rows, twenty-five seconds.

## 2:15 — Slide 5 · Pattern 2: design for the "no" (30 s)

Zones have policies; design for the refusal before you get it. Every source has a primary path and a fallback: Unlocker → reddit JSON falls back to SERP `site:`; Unlocker → Apple's review feed falls back to the public API. And a counter records which path actually served — zero pages via Unlocker, nine direct, for Apple. The landing page credits exactly that. At a data event, that honesty *is* the product.

## 2:45 — Slide 6 · What held (25 s)

Results. Both halves held. 210 negative reviews classified: 48% billing rage, 20% choice overload — people asking for less. And the gap, in their own words: a daily meditator, one year in — "when another same trigger arose, I was still reactive." The community even prescribes the fix: "bring your meditative mindset into daily life, in the act of making decisions."

## 3:10 — Slide 7 · What was refuted (35 s)

And here is the slide that paid for the evening. The competition queries worked: the interrupt already exists — Mindfulness Bell, MindBell, Chill. The minute already exists — there's an app called One-Moment Meditation, and it's a registered trademark. Insight Timer owns the search.

So: I cannot position Moment as "a reminder app". But a *want* query found the #1 result on r/selfimprovement: "How to remember my set intention for the day? 23 minutes later I'm in the thick of it." Nobody in a hundred results does that. The bell is taken, the minute is taken, the intention is not. A wrong positioning and a trademark collision — caught for a few dollars of API calls.

## 3:45 — Slide 8 · Live (45 s)

Let's do one now. Someone give me a question you'd type into Google about your own idea.

[Switch to terminal.]

```bash
cd engine && node src/ask.js "<query from the room>"
```

[Read the request body on screen, then the #1 result out loud. Point at the ms count.]

That's the whole method. The rest is a loop.

## 4:30 — Slide 9 · Output (15 s)

The result is one JSON: sources, verbatim quotes, computed clusters, the verdict, the counter-evidence. It's injected straight into a single-file landing page — the proof is the pitch. If we have time, the page ends with a real one-minute Moment.

## 4:45 — Slide 10 · Close (15 s)

Do this to your own idea tonight: two sentences of hypothesis, three queries that would kill it, SERP API with `brd_json=1`, `site:` your community, keep it honest. Repo's public. Thank you.

---

### Timing safety
- Running long → cut slide 9 entirely; say "the JSON goes into a page, link's on the last slide."
- Wifi dies → slide 8 *is* the output; read it.
- Running short → open the artifact and run the one-minute Moment with the room (60 s).

### Likely questions
- **"Why didn't Web Unlocker serve the reviews?"** Apple hosts and reddit are policy-gated without KYC on my zone (`destination_ip_prohibited`). The collector tracks the serving path and the page credits it. Google Play *does* resolve through the Unlocker — that's next.
- **"Cost?"** ~9 Apple-feed fetches, ~17 SERP queries, two runs. Well inside a trial account.
- **"Why not just scrape reddit?"** I could with KYC. Without it, `site:` through SERP gives the thread titles and snippets — which is all a hypothesis test needs.
- **"Isn't Moment just a mindfulness bell?"** That's exactly what the competition query asked. The bell rings; Moment hands you *your* sentence. The unmet search is "how do I remember my intention", not "remind me to breathe".
