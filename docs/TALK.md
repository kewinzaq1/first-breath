# Break your own hypothesis with Bright Data — the 5-minute talk

Audience: Bright Data GTM event. Subject: **how to use the APIs**. Moment is the worked example.
Arc, beat for beat with the deck: pain → the bet → prove me wrong → the three calls → what held → what pushed back → the sharpened product → the room does it.
Target 4:40 total · spoken ≈ 3:50 · live call ≈ 0:45 · buffer to 5:00.
Slides: `first-breath-how-it-works.pptx`. Terminal ready at `engine/` (`.env` auto-loads). Page open on scene 1.

**Open with:** *"Twenty minutes of calm on the cushion. Then the day happens — and you snap at your kid anyway."*

---

## 0:00 — Slide 1 · The pain (20 s)

Twenty minutes of calm on the cushion. Then the day happens — and you snap at your kid anyway. Meditation apps sell calm and deliver a marketplace — and even when they work, the calm stays in the session. I had a product idea about that, and I was too attached to it. Tonight: how I made the web argue with it in one evening, with three Bright Data APIs.

## 0:20 — Slide 2 · The bet (30 s)

My belief had two parts. One: the apps overwhelm people with content and choice. Two: the calm never leaves the cushion — you're still reactive at six pm. The bet is Moment: one sentence about how you want to move through today, a pause every thirty minutes, one minute to breathe and choose again. Meditation inside the day, not beside it. But a bet is not a business. So before telling anyone, I asked the web to break it.

## 0:50 — Slide 3 · Prove me wrong · the three calls (45 s)

Three APIs, each for what it's best at. **SERP API** with `brd_json=1`: Google, parsed for you — rank, title, link, description. No HTML anywhere in my pipeline. A hundred and forty-six search rows, thirty reddit threads. **Web Scraper API**: trigger a dataset, poll, download a snapshot. Three Play-store URLs in, three hundred structured reviews out, in three minutes, zero errors. **Web Unlocker**: any URL, blocks handled — it reached the Play store pages; Apple and reddit are policy-gated on my zone, and the collector wrote that down. Every output file says which path served it.

## 1:35 — Slide 4 · Prove me wrong · the pattern (35 s)

If you only search for people who agree with you, the web will happily agree. So I bucketed twelve queries: *gap* — does the calm carry over? *want* — what do people ask for instead? And *competition* — "mindfulness bell app", "one minute meditation reminder app" — written to hurt. Second trick: reddit is KYC-gated on the Unlocker, so I ask Google for `site:reddit.com/r/Meditation` through the SERP zone and get the exact threads. Twelve queries, a hundred and four rows, twenty-five seconds.

## 2:10 — Slide 5 · What held (30 s)

Both halves held. Two hundred and ten negative App Store reviews, classified by a regex file anyone can rerun: fifty-two percent paywall fatigue, seventeen lost simplicity, sixteen choice overload. The Google Play reviews, pulled through a different API, land on the same shape. From Play, twelve days ago: "I want a calming app to be calming." And the gap, from a daily meditator: "when another same trigger arose, I was still reactive." And the community prescribes the fix themselves: "bring your meditative mindset into daily life when you are in the act of making decisions."

## 2:40 — Slide 6 · What pushed back (35 s)

And here is the slide that paid for the evening. The interrupt already exists — Mindfulness Bell, MindBell, Chill. The minute already exists — One-Moment Meditation holds the top two results for "one minute meditation reminder app", and it's a registered trademark. So I cannot position Moment as a reminder app. But a *want* query found the number-one result on r/selfimprovement: "How to remember my set intention for the day? 23 minutes later I'm in the thick of…" Nobody in a hundred results does that. The bell is taken, the minute is taken, the intention is not. A wrong positioning and a trademark collision, caught for a few dollars of API calls.

## 3:15 — Slide 7 · The sharpened product (20 s)

So the data didn't confirm the product. It sharpened it. Moment is not a reminder app and not a meditation library. It hands you back the sentence you chose this morning, in the middle of real life, with one minute to choose again.

## 3:35 — Slide 8 · Live (45 s)

Let's do one now. Someone give me a question you'd type into Google about your own idea.

[Switch to terminal.]

```bash
cd engine && node src/ask.js "<query from the room>"
```

[Read the request body on screen. Read the #1 result out loud. Point at the ms count.] That's the whole method. The rest is a loop.

## 4:20 — Slide 9 · The room does it (25 s)

The result is one JSON — verbatim quotes, computed clusters, the verdict, the counter-evidence — injected straight into a single-file page. The proof is the pitch. And the page ends the way the product does: write one sentence about how you want to move through tonight. Sixty seconds. Six breaths. The sentence comes back halfway. Then: now choose again.

## 4:45 — Slide 10 · Close (15 s)

Do this to your own idea tonight: two sentences of hypothesis, three queries that would kill it, each API for its job, keep it honest. Repo's public. Thank you.

---

### Timing safety
- **Running long** → cut slide 4 to one sentence ("a third of the queries were written to refute me"), and cut the "community prescribes the fix" quote on slide 5. Saves ~35 s.
- **Way long** → skip slide 7 entirely; slide 6 already ends on "the intention is not".
- **Wifi dies** → slide 8 *is* the output (collected Aug 22, 2026, 1445 ms). Or: `node src/ask.js --cached "how to remember my intention for the day"` prints the same, labelled cached.
- **Google captcha-s the zone** → `ask.js` prints the retries live ("google answered the zone with expect_body — retry 1"). Narrate it: *"this is what an honest data pipeline looks like"*. If all five attempts fail it prints the cached answer.
- **Running short** → open the artifact at the last scene and run the one-minute Moment with the room (60 s).

### Likely questions
- **"Why didn't Web Unlocker serve the reviews?"** Apple hosts and reddit are policy-gated without KYC on my zone (`destination_ip_prohibited`). The Unlocker does reach Google Play — 3/3 pages, 1.2 MB each — but the structured rows are the Web Scraper API's job, so that's what I used. The collector tracks the path; the page credits it.
- **"How did you get 52 percent?"** `engine/src/clusters.js`: negative = rating ≤ 3, three regex classes over title + text, non-exclusive. `node src/clusters.js` reproduces it; `node src/verify.js` checks the page matches. Same regexes on the Play negatives give 54 / 11 / 14.
- **"Cost?"** ~9 Apple-feed fetches, ~150 SERP queries including rehearsals, one Web Scraper snapshot of 300 records, three Unlocker page fetches. Well inside a trial account.
- **"Isn't Moment just a mindfulness bell?"** That's exactly what the competition query asked. The bell rings; Moment hands you *your* sentence. The unmet search is "how do I remember my intention", not "remind me to breathe".
