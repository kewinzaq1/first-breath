# Prove Me Wrong · The Show — script (v2, Bright Data first)

Nine scenes, one cast: **the Founder** (an ember blob in an "I ♥ MY IDEA" shirt — any resemblance to the speaker is intentional), **the Web** (a blue cloud with too many eyes; honest, unimpressed), and three Bright Data couriers — **the Owl** (SERP API), **the Bouncer** (Web Unlocker), **the Harvester** (Web Scraper API).

Three of the nine scenes are pure Bright Data mechanics: the real request, the real response, the real headers. The story is the wrapper; the APIs are the subject.

**Open:** `docs/show/index.html` in Brave, full screen (`⌘⇧F`). `n` shows your lines at the bottom. Keys: `→`/space/click next · `←` back · `1–9` jump · `r` reset the clock (top right; starts when you leave the title; ember at 4:30, red at 5:00).
**Live run:** scene 8. Terminal open behind the browser at `engine/`, font ≥ 18 pt.

Every quote and number on screen is verbatim from `engine/out/` (checked by `node src/verify.js` and the fragment check in the commit). The jokes are yours; the numbers are the web's.

---

## 1 · The fear — 0:00 → 0:20

**On screen:** *Prove Me Wrong.* The Founder: "Users are going to LOVE this." The Web drifts in: "will they, though?"

> Every founder in this room has shipped a positioning the web could have refuted for five dollars. We don't check — we're scared of the answer.
> Meet the Founder. Any resemblance to the speaker is intentional.
> I built the thing that asks: Prove Me Wrong. Its only moving part is Bright Data.

`→`

## 2 · Give it your idea · one endpoint — 0:20 → 0:50

**On screen:** `hypothesis.json` on the left; the one endpoint on the right: `POST api.brightdata.com/request`, a Bearer token, `{ zone, url, format }`. The Founder: "Two sentences? I have a deck."

> Two sentences you believe. The community where your users tell the truth. The competitors you're scared of. That's the whole input — *(beat)* he had a deck, I know.
> Mine was Moment, a meditation app: the apps overwhelm people, and the calm never leaves the session.
> Everything that happens next is **one endpoint**: `POST api.brightdata.com/request`. A Bearer token, a zone, a URL. The zone decides the magic.

`→`

## 3 · Courier one · SERP API — 0:50 → 1:35

**On screen:** the request (`zone: serp_api1`, a Google URL with `&brd_json=1`) → the Owl flies → the response: `organic[{rank, title, link, description}]`, `people_also_ask`, `related`, ≈1.5 s. Below: three bags of queries — gap, refute, competition.

> Courier one: the SERP API. Hand Bright Data a Google URL with one extra parameter — `brd_json=1` — and instead of HTML you get the results page as JSON: rank, title, link, snippet. Zero HTML in my life.
> The trick that makes this research: three bags of queries. **Gap** — the pain, in their words. **Competition** — written to hurt. **Refute** — the opposite of what I believe. *Why would you search for that?* Because you won't.
> And reddit is KYC-gated on the Unlocker — so I ask Google for `site:reddit.com/r/Meditation` instead. Twelve queries, ninety-two rows.

`→`

## 4 · Courier two · Web Unlocker — 1:35 → 2:15

**On screen:** the request — same endpoint, `zone: web_unlocker1`, any URL. Three doors: play.google.com opens (1.2 MB, `x-brd-status-code: 200`); apps.apple.com opens on an empty room (HTTP 200, 0 bytes); reddit.com shakes (`x-brd-status-code: 502`, "Residential Failed (bad_endpoint) … no KYC"). The bouncer's notebook.

> Courier two: the Web Unlocker. **Same endpoint, swap the zone** — any URL comes back as the page body, blocks handled.
> Google Play: open, 1.2 megabytes. Apple: door opens, nobody home — HTTP 200, empty body. Reddit: policy-gated without KYC.
> The thing nobody tells you: Bright Data answers 200 either way. **The truth is in the headers** — `x-brd-status-code`, `x-brd-error-code`. Read them.
> The bouncer writes every refusal into the file, with the fallback already designed.

`→`

## 5 · Courier three · Web Scraper API — 2:15 → 2:55

**On screen:** four steps: `GET /datasets/list` (1,743 datasets → `gd_m6zagkt…`) → `POST /datasets/v3/trigger` with three URLs → `GET /progress` (running… ready · 300 · 0 errors · 179 s) → `GET /snapshot?format=json` (rows with `review_rating`, `review`, `found_helpful`). The Harvester rolls along and rows pile up.

> Courier three: the Web Scraper API. Asynchronous, four calls.
> One: `GET datasets/list` — seventeen hundred ready-made scrapers; Google Play reviews is `gd_m6zagkt`. Two: `POST trigger` with that id and three Play-store URLs — you get a snapshot id. Three: poll `progress` until ready — three hundred records, zero errors. Four: download the snapshot as JSON: rating, text, helpful votes.
> Three URLs in. Three hundred rows out. Three minutes. One gotcha: the first download raced the ready flag and came back empty. The code re-downloads. Honest pipelines retry.

`→`

## 6 · What held — 2:55 → 3:15

**On screen:** bars grow — 52 % · 17 % · 16 %. Two quotes. The Founder: "Told you. Genius." The Web: "half."

> So what did the web say? Half of it held. Two hundred and ten negative App Store reviews, computed — not vibes: fifty-two percent paywall fatigue, seventeen lost simplicity, sixteen choice overload.
> Headspace, twelve days ago: "I want a calming app to be calming." The Founder is thrilled. The web says: *half.*

`→`

## 7 · What pushed back — 3:15 → 3:45

**On screen:** four bells ring; the ® stamp slams on One-Moment Meditation; the Founder deflates. The unclaimed card rises.

> The competition bag came back ringing: Mindfulness Bell, Chill, Plum Village. And the minute already exists — One-Moment Meditation holds the top two results, and it is — *(stamp)* — a registered trademark. *(point)* That's me.
> But the gap bag found the number-one result on r/selfimprovement: "How to remember my set intention for the day? 23 minutes later I'm in the thick of…"
> The bell is taken. The minute is taken. The intention is not.

`→`

## 8 · Your turn — 3:45 → 4:30 (live)

**On screen:** "Give me *your* hypothesis." The command. Under the hood: 4 × `POST /request` in parallel; captcha → `x-brd-error-code`, 15-s lock, fresh key.

> Now yours. One sentence about your product, and the subreddit where your users complain.
> *[Take one. Repeat it back. Switch to the terminal and run it.]*
> Four `POST /request` calls to the SERP zone, in parallel. *(if retries print:)* Google just captcha'd the zone — Bright Data says so in the headers and locks the query for fifteen seconds; the code retries with a fresh key.
> *[Read the refute #1 title, the competition #1, then the verdict line.]*
> First pass. The web just argued with your idea in thirty seconds.

```bash
cd engine && node src/provemewrong.js --quick "<their sentence>" --community reddit.com/r/<their sub>
```
*Room is shy →* `"Developers want an AI code reviewer that blocks merges"` with `reddit.com/r/ExperiencedDevs` (rehearsed: held · pushback on page one · mechanism exists — sourcegraph.com). *Wifi dies →* `docs/stage/quick-output.png`: "here's the one I ran this morning."
`→`

## 9 · The recipe — 4:30 → 4:45

**On screen:** three steps. The Web: "the honest friend you didn't ask for."

> Do this to your own idea tonight. Two sentences, a third of the queries written to refute you. One endpoint, three zones: SERP for the search, Unlocker for the page, Scraper for the rows. Keep it honest — verbatim quotes, computed numbers, read the headers.
> The web is the honest friend you didn't ask for. Ask it first. Thank you.

---

### Timing
Spoken ≈ 3:30 at a relaxed pace + 40 s live ≈ 4:10 — the proxy read below counts ids and URLs slowly; a human is faster. If the clock is ember when you reach scene 9, say only the last two lines.

### Cuts if you're long
- Scene 5: drop the "one gotcha" sentence. −8 s
- Scene 4: drop "Headspace. Healthline." and the last sentence. −8 s
- Scene 6: drop the Play sentence. −6 s

### Bright Data facts you can say with a straight face (all from today's runs)
- One endpoint: `POST https://api.brightdata.com/request`, Bearer token, `{ zone, url, format }`; the zone selects SERP vs Unlocker behaviour. The Web Scraper API is the separate async family under `/datasets/v3`.
- SERP: `&brd_json=1` returns parsed JSON (`organic`, `people_also_ask`, `related`); ≈1.4–3 s; `num` is rejected as a parameter. Failures arrive as HTTP 200 with `x-brd-status-code: 502` and `x-brd-error-code: captcha | expect_body`; a failed query is then locked ~15 s (`failed_query_rejected`).
- Unlocker: play.google.com 1.2 MB OK; headspace.com, healthline.com OK; apps.apple.com → 200 + empty body; itunes.apple.com → `destination_ip_prohibited`; reddit.com → `Residential Failed (bad_endpoint): … no KYC access mode`.
- Scraper: `GET /datasets/list` → 1,743 datasets; Google Play reviews = `gd_m6zagkt024uwvvwuyu`; snapshot `sd_mt3vkhhd29jyfi8u7k`, 300 records, 0 errors, 179 s.

### Likely questions
- **"What does the verdict line decide?"** Nothing final — four SERP calls and three explicit rules (echo / pushback / product-in-top-3), labelled "first pass". The full run adds the Unlocker text and the review corpus; a coding agent writes the verdict from the rows.
- **"Why not the Unlocker for everything?"** It reached Play and the blogs; Apple and reddit are policy-gated on my zone without KYC. Each API is the best tool for one job: SERP for the argument, Unlocker for the page, Scraper for structured rows at scale.
- **"Are the percentages real?"** `engine/src/clusters.js` — negative = rating ≤ 3, three regexes, non-exclusive. `node src/clusters.js` prints them; `node src/verify.js` checks the page matches.
- **"Can I run it?"** `github.com/kewinzaq1/first-breath` — `hypothesis.json` in, `node src/provemewrong.js` out. Bring your own Bright Data token.
