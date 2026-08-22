# Prove Me Wrong · The Show — script

A 5-minute animated demo with a cast: **the Founder** (an ember blob in an "I ♥ MY IDEA" shirt — any resemblance to the speaker is intentional), **the Web** (a blue cloud with too many eyes; honest, unimpressed), and three Bright Data couriers — **the Owl** (SERP API), **the Bouncer** (Web Unlocker) and **the Harvester** (Web Scraper API).

**Open:** `docs/show/index.html` in Brave, full screen (`⌘⇧F`). Press `n` once to see your lines at the bottom (only you see them if you mirror a second display; on a single mirrored screen, keep notes off and use this page on your phone).
**Keys:** `→` / space / click = next scene · `←` back · `1–9` jump · `n` notes · `r` reset the clock. The clock (top right) starts when you leave the title; it turns ember at 4:30 and red at 5:00.
**Live run:** scene 8 is the hand-off to the terminal. Have it open behind the browser at `engine/`, font ≥ 18 pt.

Everything the characters say about the data is verbatim from `engine/out/research.json` (quotes) and computed by `engine/src/clusters.js` (numbers). The jokes are yours; the numbers are the web's.

---

## 1 · Title — 0:00 → 0:20

**On screen:** the Founder floats in, glowing lightbulb, "I ♥ MY IDEA" shirt. *Prove Me Wrong.*

> Every founder in this room has shipped a positioning the web could have refuted for five dollars.
> We don't check. We're scared of the answer.
> So I built the thing that asks. This is Prove Me Wrong — and the only moving part is Bright Data.

`→`

## 2 · The disease — 0:20 → 0:45

**On screen:** the Founder: "Users are going to LOVE this." The Web drifts in: "will they, though?"

> Meet the Founder. Any resemblance to the speaker is purely intentional.
> He has an idea. He loves it. And he has never once asked anyone who might disagree.
> That's the disease. We ship first and find out later — from a tweet.
> The web knew. The web always knew. We just never asked it the uncomfortable question.

`→`

## 3 · Give it your idea — 0:45 → 1:15

**On screen:** `hypothesis.json` — two sentences, a community, three competitors. The Founder: "Two sentences? I have a deck."

> So here's the deal. You give it what you believe — two sentences, no more. *(beat)* I know. He had a deck.
> The community where your users tell the truth. And the competitors you're secretly scared of. That's the whole input.
> Mine was Moment, a meditation app. I believed the apps overwhelm people, and that the calm never leaves the session.
> Confident. Unverified. Perfect test subject.

`→`

## 4 · The three couriers — 1:15 → 2:05

**On screen:** three lanes. The Owl flies off and comes back with a JSON scroll. The Bouncer opens three doors — Play (1.2 MB), Apple (200 OK, nobody home), reddit (KYC ONLY, shakes) — and writes it down. The Harvester rolls across three app icons and rows pile up: 300 reviews · 179 s · 0 errors.

> Then three couriers go out.
> The **SERP API** — the owl — reads Google so I don't have to. Rank, title, link, snippet, already parsed. Zero HTML in my life. Twelve queries, ninety-two rows.
> The **Web Unlocker** is the bouncer. He opens doors. Google Play? Open — 1.2 megabytes. Apple? Door opens… nobody home. 200 OK, empty body. Reddit? Not on the list without KYC.
> And he writes every refusal down. That's the point. The "no" goes in the file, verbatim.
> The **Web Scraper API** is the harvester. Three app-store URLs in, three hundred structured reviews out. Three minutes. Zero errors. No drama.

`→`

## 5 · The pattern — 2:05 → 2:30

**On screen:** three bags of queries — gap, refute (the opposite), competition (to hurt). The Founder: "Why would you search for *that*?" The Owl: "because you won't."

> Here's the trick that makes it research instead of marketing. The queries come in three bags.
> Gap — the pain, in the user's words. Competition — written to hurt. And refute — the *opposite* of what I believe: "meditation made me less reactive."
> The Founder hates this bag. *Why would you search for that?* Because you won't.
> Search only for people who agree with you, and the web will happily agree.

`→`

## 6 · What held — 2:30 → 2:55

**On screen:** bars grow — 52 % paywall fatigue · 17 % lost simplicity · 16 % choice overload. Two quotes. The Founder: "Told you. Genius." The Web: "half."

> So what did the web say about my idea? Half of it held.
> Two hundred and ten negative App Store reviews, classified by a regex file anyone can rerun — not vibes, rows. Fifty-two percent paywall fatigue. Seventeen lost simplicity. Sixteen choice overload.
> And the Google Play reviews — different store, different API — land on the same shape. Headspace, twelve days ago: "I want a calming app to be calming."
> The Founder is thrilled. The web says: *half.*

`→`

## 7 · What pushed back — 2:55 → 3:30

**On screen:** four bells ring — Mindfulness Bell, Chill, Plum Village, One-Moment Meditation — then the ® stamp slams down; the Founder deflates. A card rises: the #1 result on r/selfimprovement.

> And then the web did its job.
> The interrupt already exists: Mindfulness Bell, Chill, Plum Village — all ringing.
> The minute already exists: One-Moment Meditation holds the top two results for "one minute meditation reminder app", and it is — *(stamp)* — a registered trademark.
> *(point at the deflating Founder)* That's me. I cannot position Moment as a reminder app.
> But the gap bag found the number-one result on r/selfimprovement: "How to remember my set intention for the day? 23 minutes later I'm in the thick of…" Nobody in a hundred results does that.
> The bell is taken. The minute is taken. The intention is not.
> A wrong positioning and a trademark collision, caught for a few dollars. That slide paid for the evening.

`→`

## 8 · Your turn — 3:30 → 4:20 (the live run)

**On screen:** "Give me *your* hypothesis." The command. The Web: "go on. I've got all day."

> Now yours. Someone give me a hypothesis about your product — one sentence — and the subreddit where your users complain.

*[Take one. Repeat it back so the room hears it. Switch to the terminal.]*

```bash
cd engine && node src/provemewrong.js --quick "<their sentence>" --community reddit.com/r/<their sub>
```

> Four calls go out in parallel… *(if retries print: "Google is captcha-ing us — this is what an honest pipeline looks like")*
> *[Read the **refute** result's title out loud, then the **competition** #1, then the verdict line.]*
> First pass — the full run takes four minutes. But you just watched the web argue with your idea, in public, for thirty seconds. That's the whole product.

*Room is shy →* `"Developers want an AI code reviewer that blocks merges"` with `reddit.com/r/ExperiencedDevs` (rehearsed: held · pushback on page one · mechanism exists — sourcegraph.com).
*Wifi dies →* `docs/stage/quick-output.png` is that exact output; say "here's the one I ran this morning".

`→` (back to the show)

## 9 · The recipe — 4:20 → 4:40

**On screen:** three steps; the Founder and the Web side by side. The Web: "the honest friend you didn't ask for."

> Do this to your own idea tonight. Two sentences of hypothesis. A third of the queries written to refute you. Each API for its job — the owl for search, the harvester for rows, the bouncer for pages. And keep it honest: verbatim quotes, computed numbers, credit the path that served — including the doors that stayed shut.
> The web is the honest friend you didn't ask for. Ask it first. Repo's public. Thank you.

---

### Timing
Spoken ≈ 3:50 at a relaxed pace + 40 s live = 4:30. The clock on screen tells you where you are; if it's ember (4:30+) when you reach scene 9, say only the last two lines.

### Cuts if you're long
- Scene 4: drop the Harvester sentence — the lane says it ("300 reviews · 179 s · 0 errors"). −10 s
- Scene 6: drop the Google Play sentence. −8 s
- Scene 7: drop "That slide paid for the evening." −3 s

### If a joke dies
Keep moving — the characters are doing the work. The only line that must land is the bold one at the bottom of each scene; read it if you have to.

### Likely questions (after)
- **"What does the verdict line actually decide?"** Nothing final — four SERP calls and three explicit rules (echo / pushback / product-in-top-3), labelled "first pass". The full run adds the Unlocker text and the review corpus; a coding agent writes the verdict from the rows.
- **"Why didn't the Unlocker get the Apple reviews?"** apps.apple.com answered 200 with an empty body; itunes.apple.com and reddit are policy-gated without KYC on my zone. It did get Google Play, Headspace, Healthline. Every outcome is in `out/verdict-input.json`.
- **"Are the percentages real?"** `engine/src/clusters.js` — negative = rating ≤ 3, three regexes, non-exclusive. `node src/clusters.js` prints them; `node src/verify.js` checks the page matches.
- **"Can I run it?"** `github.com/kewinzaq1/first-breath` — `hypothesis.json` in, `node src/provemewrong.js` out. Bring your own Bright Data token.
