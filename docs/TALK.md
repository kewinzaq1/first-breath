# Prove Me Wrong — the 5-minute talk

Audience: Bright Data GTM event. Subject: **how people may use the Bright Data APIs**. Product: Prove Me Wrong — a hypothesis-breaker whose only moving part is Bright Data. Worked example: Moment (Kew's own idea).
Arc, beat for beat with the deck: the founder's fear → give it your idea → the three calls → SERP pattern → Unlocker: full text + gates → Scraper: reviews at scale → Moment: what held → Moment: refuted + unclaimed → live on a stranger's idea → the recipe.
Target ≤ 4:40 · spoken ≈ 3:50 · live run ≈ 40 s. Slides: `first-breath-how-it-works.pptx`. Terminal at `engine/`. Page open on scene 1.

**Open with:** *"Every founder in this room has shipped a positioning the web could have refuted for five dollars. I built the thing that asks."*

---

## 0:00 — Slide 1 · The founder's fear (20 s)

Every founder in this room has shipped a positioning the web could have refuted for five dollars. We don't check, because we're afraid of the answer. So I built the thing that asks. It's called Prove Me Wrong, its only moving part is Bright Data, and I'll run it on my own idea — and then on one of yours.

## 0:20 — Slide 2 · Give it your idea (30 s)

The input is small on purpose. Two sentences you believe, the community where your users tell the truth, the competitors you fear. Mine: Moment, a meditation app. I believed the apps overwhelm people with content, and that the calm never leaves the session. What comes back is a verdict page: what held, what was refuted, what nobody is doing — every line a verbatim quote or a computed number, every source credited by the path that served it.

## 0:50 — Slide 3 · The three calls (35 s)

Three APIs, one Bearer token, each for what it's best at. **SERP API** with `brd_json=1`: Google, parsed — rank, title, link, description. No HTML anywhere in the pipeline. **Web Scraper API**: trigger a dataset, poll, download a snapshot — three Play-store URLs in, three hundred structured reviews out. **Web Unlocker**: any URL, blocks handled — the page body behind the top links. And one rule: every row records which path served it, including the ones that said no.

## 1:25 — Slide 4 · SERP: queries written to refute (30 s)

If you only search for people who agree with you, the web will happily agree. So the queries come in three buckets: *gap* — the pain in the user's words; *refute* — the opposite, "meditation made me less reactive"; *competition* — "one minute meditation reminder app", written to hurt. And reddit is KYC-gated on the Unlocker, so I ask Google for `site:reddit.com/r/Meditation` through the SERP zone and get the exact threads. Twelve queries, ninety-two rows.

## 1:55 — Slide 5 · Unlocker: full text and the gates (25 s)

Then the Unlocker fetches the full text behind the top links: the Play store page, 1.2 megabytes; Headspace, Healthline. And it records the refusals: Apple answered with a 200 and an empty body; iTunes and reddit are policy-gated without KYC. Those go in the output file with the error text. At a data event, the honest "no" is part of the product.

## 2:20 — Slide 6 · Scraper: reviews at scale (25 s)

The Scraper API: I found the Google Play reviews dataset with one `GET /datasets/list`, triggered it with three URLs, polled, downloaded. Three hundred reviews, three minutes, zero errors. Twelve days ago on Headspace: "I want a calming app to be calming."

## 2:45 — Slide 7 · Moment: what held (25 s)

So what did the web say about my idea? Both halves held. Two hundred and ten negative App Store reviews, classified by a regex file anyone can rerun: fifty-two percent paywall fatigue, seventeen lost simplicity, sixteen choice overload — and the Play reviews land on the same shape. From a daily meditator: "when another same trigger arose, I was still reactive."

## 3:10 — Slide 8 · Moment: refuted and unclaimed (35 s)

And here is the slide that paid for the evening. The interrupt already exists — Mindfulness Bell, Chill, Plum Village. The minute already exists — One-Moment Meditation holds the top two results, and it's a registered trademark. So I cannot position Moment as a reminder app. But a gap query found the number-one result on r/selfimprovement: "How to remember my set intention for the day? 23 minutes later I'm in the thick of…" Nobody in a hundred results does that. The bell is taken, the minute is taken, the intention is not. A wrong positioning and a trademark collision, caught for a few dollars.

## 3:45 — Slide 9 · Live, on a stranger's idea (40 s)

Now yours. Someone give me a hypothesis about your product, in one sentence, and the subreddit where your users complain.

[Switch to terminal.]

```bash
cd engine && node src/provemewrong.js --quick "<hypothesis>" --community reddit.com/r/<sub>
```

[Four calls in parallel. Read the pushback result out loud, then the verdict line.] First pass — the full run takes four minutes. That's the whole product.

## 4:25 — Slide 10 · The recipe (15 s)

Do this to your own idea tonight: two sentences, a third of the queries written to refute you, each API for its job, keep it honest. Repo's public. Thank you.

---

### Timing safety
- **Running long** → cut slide 6 to one sentence ("three URLs in, three hundred reviews out, zero errors") and drop the Healthline/Headspace detail on slide 5. Saves ~30 s.
- **Way long** → skip slide 7 entirely; slide 8 carries the result.
- **Room is shy** → backup hypothesis: *"Developers want an AI code reviewer that blocks merges"* with `reddit.com/r/ExperiencedDevs` (rehearsed: 3.6–16 s, verdict "held · pushback on page one · mechanism exists — sourcegraph.com").
- **Google captcha-s the zone** → the retries print live ("google answered captcha — retry 1"). Narrate it: *"this is what an honest pipeline looks like."* Four calls run in parallel, so one retry costs seconds, not the demo.
- **Wifi dies** → slide 9 *is* the output (collected Aug 22, 2026). `node src/ask.js --cached "how to remember my intention for the day"` prints a cached SERP call.
- **Running short** → open the artifact at the last scene and run the one-minute Moment with the room (60 s).

### Likely questions
- **"Why didn't Web Unlocker serve the reviews?"** Apple hosts and reddit are policy-gated without KYC on my zone (`destination_ip_prohibited`, `Residential Failed (bad_endpoint)`); apps.apple.com answered 200 with an empty body. The Unlocker does reach Google Play and the blogs; the structured rows are the Web Scraper API's job. Every outcome is in `out/verdict-input.json`.
- **"How did you get 52 percent?"** `engine/src/clusters.js`: negative = rating ≤ 3, three regex classes over title + text, non-exclusive. `node src/clusters.js` reproduces it; `node src/verify.js` checks the page matches. Same regexes on the Play negatives give 54 / 11 / 14.
- **"What does `--quick` actually decide?"** Nothing final. It's four SERP calls and three rules — does the top result echo your words, is there pushback on page one, is there a product in the competition top three — labelled "first pass". The full run adds the Unlocker text and the review corpus, and a coding agent writes the verdict from the rows.
- **"Cost?"** ~9 Apple-feed fetches, ~200 SERP queries including rehearsals, one Web Scraper snapshot of 300 records, eight Unlocker page fetches. Well inside a trial account.
