# Prove Me Wrong · The Show — script (v3: one story, three ways of knowing)

The story is told by the three Bright Data APIs themselves, each a different way of knowing the same question — **where** the conversation lives (SERP API), **what** is actually written there (Web Unlocker), **how many** people feel it (Web Scraper API) — handing off to each other until they reach one verdict. Moment is the question they answer: ~1 minute. The APIs: ~3 minutes. The live run and close: ~1 minute.

Cast: **the Owl** (SERP API), **the Bouncer** (Web Unlocker), **the Harvester** (Web Scraper API); **the Founder** (me) and **the Web** appear only at the edges.

**Open:** `docs/show/index.html` in Brave, full screen (`⌘⇧F`). `n` shows your lines at the bottom. Keys: `→`/space/click next · `←` back · `1–8` jump · `r` reset the clock (top right; starts when you leave scene 1; ember at 4:30, red at 5:00).
**Live run:** scene 7. Terminal open behind the browser at `engine/`, font ≥ 18 pt.

Every quote, id, count and error string on screen is verbatim from `engine/out/` (`verify.js` + the fragment check in the commit).

---

## 1 · The question — 0:00 → 0:20

**On screen:** `hypothesis.json` (H1, H2, community, competitors) beside the one endpoint: `POST api.brightdata.com/request` → SERP zone = *where* · Unlocker zone = *what* · `/datasets/v3` = *how many*. The Web and the Founder wait at the sides.

> I built a meditation app called Moment, and I believed two things about it: the apps overwhelm people with content and choice — and the calm stays in the session.
> Before telling anyone, I asked the web whether that was true. Three Bright Data APIs did the asking.
> Everything starts at one endpoint: `POST api.brightdata.com/request` — a token, a zone, a URL. The zone decides which way of knowing you get.

`→`

## 2 · Way of knowing one · SERP API · where — 0:20 → 1:20

**On screen:** The request (`zone: serp_api1`, Google URL + `&brd_json=1`) → the Owl flies → the parsed response. Then the map: six real places — r/Meditation (gap #1), One-Moment Meditation (#1 · #2), mindful.org, Chill (#2), r/selfimprovement (#1), Mindfulness Bell on Play (#4).

> Way of knowing one: breadth. The SERP API. You POST to `/request` with the SERP zone and a Google URL — plus one parameter, `brd_json=1` — and Bright Data hands you the results page already parsed: organic results with rank, title, link and snippet, people-also-ask, related searches. No HTML, no scraping, about a second and a half a query.
> I sent it twelve questions in three bags: the pain in the users' words, the opposite of what I believe, and the competitors I hoped didn't exist.
> Two details that matter. Reddit is gated on the Unlocker without KYC — so I ask Google for `site:reddit.com/r/Meditation` and the owl brings back the exact threads. And when Google pushes back, Bright Data doesn't hide it: you get a 200 with `x-brd-error-code` in the headers, and that query is locked for fifteen seconds — so the code retries with a fresh key.
> The map came back. r/Meditation: still reactive after a year. The competitors: full. And one door nobody had walked through — r/selfimprovement, *how to remember my set intention for the day?*

`→`

## 3 · Way of knowing two · Web Unlocker · what — 1:20 → 2:20

**On screen:** Hand-off line: *the owl's top links → the bouncer's inputs*. The request (same endpoint, `zone: web_unlocker1`). Four doors with their real headers: play.google.com (Mindfulness Bell · 1.2 MB · 200), headspace.com (Trouble Meditating? · 451 KB · 200), apps.apple.com (nobody home · 0 bytes), reddit.com (502 · Residential Failed … no KYC). The bouncer's notebook.

> Way of knowing two: depth. A map is not a reading. The Web Unlocker is the same endpoint with a different zone: give it any URL and you get the page body back — proxies, blocks, fingerprints, captchas handled on their side. Its inputs are the owl's links.
> It opened the Mindfulness Bell page on Google Play — 1.2 megabytes — so the competitor the owl ranked is now a page I can read. It opened Headspace's own article, *Trouble Meditating? Advice for seventeen common issues* — the industry admitting the gap. From each page I keep the title, the meta description, the first fifteen hundred characters, the bytes and the status.
> And it's honest about the rest. Apple answered 200 with an empty body. Reddit came back policy-gated — *Residential Failed, no KYC* — in plain text. Bright Data says 200 either way; the truth is in `x-brd-status-code`. Read it. Write every refusal down, and design the fallback before you need it.

`→`

## 4 · Way of knowing three · Web Scraper API · how many — 2:20 → 3:20

**On screen:** Hand-off line: *the app ids → the harvester's inputs · the owl's sentence → a number*. Four cards: `GET /datasets/list` → `POST /trigger` → `progress` (spinner → ready · 300 · 0 errors · 179 s) → `snapshot` (a real row). The Harvester rolls the track; rows pile up.

> Way of knowing three: volume. One person saying *still reactive* is a story; the Web Scraper API makes it a number. It's asynchronous — four calls.
> `GET datasets/list`: seventeen hundred ready-made scrapers; the Google Play reviews one is `gd_m6zagkt`. `POST trigger` with that dataset id, a hundred per input, and the three app URLs from hypothesis.json — Bright Data returns a snapshot id. Poll `progress` until it says ready: three hundred records, zero errors, a hundred and seventy-nine seconds. Then `GET` the snapshot as JSON, and every row is a structured review — rating, text, date, helpful votes.
> One gotcha worth knowing: the first download raced the ready flag and came back empty. The code re-downloads.
> Now the owl's one sentence has three hundred neighbours — and when I ran the same classifier on those rows as on the App Store reviews, they landed on the same shape. Two stores, two APIs, one answer.

`→`

## 5 · What held — 3:20 → 3:40

**On screen:** *Half of it held.* Three contribution cards tagged by API: how many (bars 52 · 17 · 16 + the Play quote), where (the r/Meditation quote), what (Headspace's own page).

> Put the three together, and the first half held. The harvester's count: of two hundred and ten negative App Store reviews, fifty-two percent paywall fatigue, seventeen lost simplicity, sixteen choice overload. The owl's stranger: *when another same trigger arose, I was still reactive.*
> Where, what, how many — one answer.

`→`

## 6 · What pushed back — 3:40 → 4:00

**On screen:** Four bells ring — Mindfulness Bell (found by the owl · read by the bouncer), Chill, Plum Village, One-Moment Meditation with the ® stamp. The unclaimed card: r/selfimprovement #1.

> The second half pushed back. The competition bag came back ringing: Mindfulness Bell, Chill, Plum Village — and the bouncer opened Mindfulness Bell's page to make sure. The minute exists: One-Moment Meditation, top two results, and — *(stamp)* — a registered trademark.
> But the map had one door nobody had walked through: *how to remember my set intention for the day?*
> The bell is taken. The minute is taken. The intention is not.

`→`

## 7 · Your turn — 4:00 → 4:40 (live)

**On screen:** *One sentence you believe.* The command, and what happens under the hood (4 × `POST /request` in parallel; captcha → headers → 15-s lock → fresh key).

> Now yours. One sentence you believe, and the community where your users tell the truth. The owl goes first: four SERP calls, in parallel.
> *[Take one. Repeat it back. Run it. Read the opposite-bag #1, the competitor #1, then the verdict line.]*
> Thirty seconds for the map. The full run takes four more minutes.

```bash
cd engine && node src/provemewrong.js --quick "<their sentence>" --community reddit.com/r/<their sub>
```
*Room is shy →* `"Developers want an AI code reviewer that blocks merges"` with `reddit.com/r/ExperiencedDevs` (rehearsed: held · pushback on page one · mechanism exists — sourcegraph.com). *Wifi dies →* `docs/stage/quick-output.png`: "here's the one I ran this morning." *Retries print →* "Google just pushed back on the zone — Bright Data says so in the headers, and the code retries with a fresh key."

`→`

## 8 · Three ways of knowing — 4:40 → 5:00

**On screen:** Where · What · How many, one card each with the exact calls. The Owl, the Bouncer and the Harvester side by side.

> Three ways of knowing. The SERP API tells you where the conversation lives — if you let it search for the people who disagree with you. The Unlocker tells you what's actually written there. The Scraper API tells you how many.
> None of them is the answer alone. Ask the web first. Thank you.



---

### Timing
Moment (scenes 1, 5, 6) + close ≈ 1:10 · the three APIs (scenes 2–4) ≈ 2:55 · live ≈ 0:40. Total ≈ 4:45 at a relaxed pace. The proxy read (`say`, 170 wpm) says 4:40 because it sounds out every id and URL; you will be quicker on those.

### Cuts if you're long
- Scene 2: drop the captcha/15-second sentence (it comes back in scene 7). −12 s
- Scene 3: drop "From each page I keep…" −8 s
- Scene 4: drop the gotcha. −7 s

### Bright Data facts you can say with a straight face (all from today's runs)
- One endpoint: `POST https://api.brightdata.com/request`, Bearer token, `{ zone, url, format }`; the zone selects SERP vs Unlocker behaviour. The Web Scraper API is the async family under `/datasets/v3`.
- SERP: `&brd_json=1` returns parsed JSON (`organic`, `people_also_ask`, `related`); ≈1.4–3 s; failures arrive as HTTP 200 with `x-brd-status-code: 502` and `x-brd-error-code: captcha | expect_body`; a failed query is locked ~15 s (`failed_query_rejected`). 12 queries · 92 rows · 12/12 answered.
- Unlocker (today's run, inputs = the owl's top links): play.google.com (Mindfulness Bell page) 1.2 MB OK · headspace.com 451 KB OK · healthline.com 589 KB OK · lynnrossy.com 71 KB OK · apps.apple.com → 200 + empty body (recorded as failed). Known gates: itunes.apple.com → `destination_ip_prohibited`; reddit.com → `Residential Failed (bad_endpoint): … no KYC access mode`.
- Scraper: `GET /datasets/list` → 1,743 datasets; Google Play reviews = `gd_m6zagkt024uwvvwuyu`; `limit_per_input=100`; snapshot `sd_mt3vkhhd29jyfi8u7k` → 300 records, 0 errors, 179 s; same regexes as the App Store corpus → 54 · 11 · 14 of 153 negatives.

### Likely questions
- **"Why three APIs and not one?"** They answer different questions. SERP is breadth (where, ranked); the Unlocker is depth (the page itself, with the refusals recorded); the Scraper is volume (structured rows at scale). Each one's output is the next one's input.
- **"What does the `--quick` verdict decide?"** Nothing final — four SERP calls and three explicit rules (echo / pushback / product-in-top-3), labelled "first pass". The full run adds the Unlocker text and the review corpus; a coding agent writes the verdict from the rows.
- **"Are the percentages real?"** `engine/src/clusters.js` — negative = rating ≤ 3, three regexes, non-exclusive. `node src/clusters.js` prints them; `node src/verify.js` checks the page matches.
- **"Can I run it?"** `github.com/kewinzaq1/first-breath` — `hypothesis.json` in, `node src/provemewrong.js` out. Bring your own Bright Data token.
