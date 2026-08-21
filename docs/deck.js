// Prove Me Wrong — the demo deck, in the fixed arc:
//   the founder's fear → give it your idea → the three calls → SERP pattern → Unlocker: full text + gates → Scraper: reviews at scale
//   → Moment: what held → Moment: refuted + unclaimed → live on a stranger's idea → the recipe
// Bright Data is the subject; Prove Me Wrong is the product; Moment is the worked example. Every number is from engine/out/research.json
// (clusters computed by engine/src/clusters.js); every quote is verbatim from the corpora.
// Rebuild: node docs/deck.js   (needs pptxgenjs — `NODE_PATH=<dir with node_modules> node docs/deck.js` works too)
const pptxgen = require('pptxgenjs');
const p = new pptxgen();
p.layout = 'LAYOUT_16x9'; // 10 x 5.625 in
const G='0C0A08', GD='070605', S='161210', INK='EDE4D7', MUTED='93867A', FAINT='4A423A', EMBER='D9954A', DATA='6E9BD1', DATAD='3D5573';
const DISP='Cambria', BODY='Calibri', MONO='Courier New';
const bg = (s, c=G) => s.background = { color: c };
const eyebrow = (s, t, x, y, w, color=MUTED) => s.addText(t.toUpperCase(), { x, y, w, h: 0.3, fontFace: MONO, fontSize: 9, color, charSpacing: 1.5, margin: 0 });
const title = (s, t, y=0.85, size=26, h=0.9) => s.addText(t, { x: 0.6, y, w: 8.8, h, fontFace: DISP, fontSize: size, color: INK, margin: 0, valign: 'top' });
const orb = (s, x, y, d) => { s.addShape(p.ShapeType.ellipse, { x: x-d*0.35, y: y-d*0.35, w: d*1.7, h: d*1.7, fill: { color: EMBER, transparency: 93 }, line: { width: 0 } }); s.addShape(p.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: EMBER }, line: { width: 0 } }); };
const quote = (s, t, src, x, y, w, size=12, h=size*0.11) => {
  s.addText('“' + t + '”', { x, y, w, h, fontFace: DISP, fontSize: size, italic: true, color: DATA, margin: 0, valign: 'top' });
  s.addText(src.toUpperCase(), { x, y: y + h + 0.05, w, h: 0.25, fontFace: MONO, fontSize: 7.5, color: DATAD, charSpacing: 0.8, margin: 0 });
};
const beat = (s, n) => s.addText(n, { x: 6.4, y: 0.5, w: 3.0, h: 0.3, fontFace: MONO, fontSize: 9, color: FAINT, align: 'right', charSpacing: 1.5, margin: 0 });
const code = (s, t, x, y, w, h, size=9.5) => { s.addShape(p.ShapeType.rect, { x, y, w, h, fill: { color: S }, line: { color: DATAD, width: 0.75 } }); s.addText(t, { x: x + 0.18, y: y + 0.12, w: w - 0.36, h: h - 0.24, fontFace: MONO, fontSize: size, color: INK, margin: 0, valign: 'top', lineSpacingMultiple: 1.15 }); };
const card = (s, x, y, w, h, c) => s.addShape(p.ShapeType.rect, { x, y, w, h, fill: { color: S }, line: c ? { color: c, width: 0.75 } : { width: 0 } });

// 1 · THE FOUNDER'S FEAR
{ const s = p.addSlide(); bg(s, G);
  orb(s, 4.5, 0.75, 0.9);
  s.addText('Prove Me Wrong', { x: 0.5, y: 1.95, w: 9, h: 0.9, fontFace: DISP, fontSize: 40, color: INK, align: 'center', margin: 0 });
  s.addText('Every founder in this room has shipped a positioning the web could have refuted for five dollars. I built the thing that asks.', { x: 1, y: 2.95, w: 8, h: 0.95, fontFace: DISP, fontSize: 17, italic: true, color: EMBER, align: 'center', margin: 0 });
  s.addText('A Bright Data hypothesis-breaker: SERP API · Web Scraper API · Web Unlocker · a coding agent as the analyst', { x: 1, y: 4.05, w: 8, h: 0.4, fontFace: BODY, fontSize: 12, color: MUTED, align: 'center', margin: 0 });
  s.addText('BRIGHT DATA GTM EVENT · AUG 22, 2026 · KEW · WORKED EXAMPLE: MOMENT.SZLEZINGIER.COM', { x: 1, y: 4.9, w: 8, h: 0.3, fontFace: MONO, fontSize: 9, color: FAINT, align: 'center', charSpacing: 1.5, margin: 0 });
  s.addNotes("Beat 1 — the founder's fear. We don't check because we're afraid of the answer. Prove Me Wrong searches for the people who disagree with you first.");
}

// 2 · GIVE IT YOUR IDEA — hypothesis.json
{ const s = p.addSlide(); bg(s, G); beat(s, 'GIVE IT YOUR IDEA');
  eyebrow(s, 'input · two sentences, a community, your would-be competitors', 0.6, 0.5, 7);
  title(s, 'Give it what you believe. It looks for the people who disagree.', 0.85, 24, 0.7);
  code(s, '// engine/hypothesis.json — the worked example\n{ "product": "Moment",\n  "hypotheses": {\n    "H1": "Meditation apps overwhelm people with content and choice.",\n    "H2": "The calm stays in the session: people are still reactive in real life." },\n  "community":   ["reddit.com/r/Meditation", "reddit.com/r/selfimprovement"],\n  "competitors": ["Calm", "Headspace", "Waking Up"],\n  "apps": { "play": ["com.calm.android", "com.getsomeheadspace.android", …] },\n  "queries": { "gap": [5 …], "refute": [4 …], "competition": [3 …] } }', 0.6, 1.7, 5.6, 2.75, 8.5);
  s.addText([
    { text: 'What comes back\n', options: { fontFace: DISP, fontSize: 13, color: INK, breakLine: true } },
    { text: 'A verdict page: ', options: { fontFace: BODY, fontSize: 10.5, color: EMBER } },
    { text: 'what held, what was refuted, what nobody is doing — every line a verbatim quote or a computed number, every source credited by the path that served it.\n\n', options: { fontFace: BODY, fontSize: 10.5, color: MUTED, breakLine: true } },
    { text: 'The only moving part is Bright Data. ', options: { fontFace: BODY, fontSize: 10.5, color: EMBER } },
    { text: 'Three APIs, each doing the job it is best at; a coding agent reads the rows and writes the verdict.', options: { fontFace: BODY, fontSize: 10.5, color: MUTED } },
  ], { x: 6.5, y: 1.7, w: 2.9, h: 2.75, margin: 0, valign: 'top' });
  s.addText('node src/provemewrong.js  →  out/verdict-input.json  →  research.json  →  the page', { x: 0.6, y: 4.65, w: 8.8, h: 0.3, fontFace: MONO, fontSize: 9, color: FAINT, margin: 0 });
  s.addNotes('Beat 2 — give it your idea. The input is small on purpose: two sentences, one community, the competitors you fear. Moment is my own idea, and I was too attached to it.');
}

// 3 · THE THREE CALLS — real request shapes + what each actually served today
{ const s = p.addSlide(); bg(s, GD); beat(s, 'THE THREE CALLS');
  eyebrow(s, 'bright data · three apis, each for what it is best at', 0.6, 0.5, 7, DATA);
  title(s, 'Three calls do the asking. One Bearer token.', 0.85, 26, 0.7);
  code(s, '// 1 · SERP API — Google, parsed for you\nPOST api.brightdata.com/request\n{ zone: SERP_ZONE, format: "raw",\n  url: "google.com/search?q=…&brd_json=1" }\n→ { organic:[{rank,title,link,description}],\n    people_also_ask:[…], related:[…] }\n\n# today: 12 queries · 92 rows · 12/12 answered\n# + 30 reddit threads via site:reddit.com/r/…', 0.6, 1.65, 4.3, 2.15, 8.5);
  code(s, '// 2 · Web Scraper API — structured, async\nPOST /datasets/v3/trigger?dataset_id=gd_m6zagkt…\n  [{ url: "…/details?id=com.calm.android" }, ×3]\n→ { snapshot_id }\nGET /datasets/v3/progress/{id}           (poll)\nGET /datasets/v3/snapshot/{id}?format=json\n→ [{ review_rating, review, reviewer_name, … }]\n\n# served: 300 reviews · 100 per app · 179 s · 0 errors', 5.1, 1.65, 4.3, 2.15, 8.5);
  code(s, '// 3 · Web Unlocker — any URL, blocks handled\nPOST api.brightdata.com/request\n{ zone: UNLOCKER_ZONE, url, format: "raw" } → body\n# today: 4/5 pages · play.google.com 1.2 MB · headspace 451 KB\n# apps.apple.com: HTTP 200, empty body — recorded, not hidden', 0.6, 3.95, 4.3, 1.35, 8.5);
  s.addText([
    { text: 'The rule that makes it a test\n', options: { fontFace: DISP, fontSize: 13, color: INK, breakLine: true } },
    { text: 'Every row records which path served it (`via`). Apple\'s 450 reviews came from Apple\'s public feed, not Bright Data — and the page says so. Errors arrive as HTTP 200 with the truth in x-brd-error-code; surface it, never JSON.parse blindly.', options: { fontFace: BODY, fontSize: 10.5, color: MUTED } },
  ], { x: 5.1, y: 3.95, w: 4.3, h: 1.35, margin: 0, valign: 'top' });
  s.addNotes('Beat 3 — the three calls. SERP with brd_json=1: zero HTML. Web Scraper API: trigger, poll, snapshot — structured rows. Unlocker: the page body, and an honest "no" where the host answers with nothing.');
}

// 4 · SERP — queries written to refute + site:
{ const s = p.addSlide(); bg(s, G); beat(s, 'SERP API · THE PATTERN');
  eyebrow(s, 'serp api · write the queries that would kill your idea', 0.6, 0.5, 7, DATA);
  title(s, 'Search only for people who agree, and the web will agree.', 0.85, 24, 0.7);
  code(s, '"queries": {\n  "gap":    [ "meditate every day but still reactive",\n              "site:reddit.com/r/Meditation still reactive" ],\n  "refute": [ "meditation made me less reactive",        // the opposite\n              "does meditation carry over into daily life",\n              "site:reddit.com/r/Meditation changed how I react" ],\n  "competition": [ "mindfulness bell app random reminders",\n                   "one minute meditation reminder app" ]  // to hurt\n}\nfor (const q of all) rows.push(...(await serp(q)).organic);', 0.6, 1.7, 5.4, 2.55, 8.5);
  s.addText([
    { text: 'Two tricks\n', options: { fontFace: DISP, fontSize: 13, color: INK, breakLine: true } },
    { text: 'Bucket the queries: ', options: { fontFace: BODY, fontSize: 10.5, color: EMBER } },
    { text: 'gap / refute / competition. At least a third must be able to refute you, or you are doing marketing, not research.\n\n', options: { fontFace: BODY, fontSize: 10.5, color: MUTED, breakLine: true } },
    { text: 'site: through SERP: ', options: { fontFace: BODY, fontSize: 10.5, color: EMBER } },
    { text: 'reddit.com is KYC-gated on the Unlocker. `site:reddit.com/r/Meditation …` through the SERP zone gives you titles + snippets of the exact threads — no KYC, no HTML.', options: { fontFace: BODY, fontSize: 10.5, color: MUTED } },
  ], { x: 6.3, y: 1.7, w: 3.1, h: 2.6, margin: 0, valign: 'top' });
  s.addText('12 queries · 4 written to refute · 92 rows · 12/12 answered · ~25 s on a good day, retries on a captcha day', { x: 0.6, y: 4.55, w: 8.8, h: 0.3, fontFace: MONO, fontSize: 9, color: FAINT, margin: 0 });
  s.addNotes('Beat 4 — the SERP pattern. This is the thing to take home: bucket the queries, a third written to refute, reddit via site: through SERP.');
}

// 5 · WEB UNLOCKER — full text + policy gates designed for
{ const s = p.addSlide(); bg(s, GD); beat(s, 'WEB UNLOCKER');
  eyebrow(s, 'web unlocker · the full text behind the top links — and the gates, recorded', 0.6, 0.5, 8, DATA);
  title(s, 'Zones have policies. Design for the “no” before you get it.', 0.85, 24, 0.7);
  const hdr = ['HOST', 'WHAT WE ASKED FOR', 'WHAT CAME BACK', 'RECORDED AS'];
  hdr.forEach((h, i) => s.addText(h, { x: 0.6 + i * 2.2, y: 1.7, w: 2.1, h: 0.25, fontFace: MONO, fontSize: 8, color: DATA, charSpacing: 1.2, margin: 0 }));
  const rows = [
    ['play.google.com', 'the Play store page', '200 OK · 1.2 MB', 'via: web-unlocker · ok'],
    ['headspace.com · healthline.com', 'top gap/competition links', '451 KB · 589 KB', 'title · meta · first 1,500 chars'],
    ['apps.apple.com', 'the App Store page', 'HTTP 200 · empty body', 'status: failed · error text kept'],
    ['itunes.apple.com · reddit.com', 'review feed · thread JSON', 'destination_ip_prohibited · Residential Failed (bad_endpoint) … no KYC', 'fallback: public feed · SERP site:'],
  ];
  rows.forEach((r, ri) => r.forEach((c, ci) => s.addText(c, { x: 0.6 + ci * 2.2, y: 2.05 + ri * 0.62, w: 2.1, h: 0.58, fontFace: ci === 0 ? MONO : BODY, fontSize: ci === 0 ? 9.5 : 10, color: ci === 3 ? EMBER : (ci === 0 ? INK : MUTED), margin: 0, valign: 'top' })));
  code(s, 'const code = res.headers.get(\'x-brd-error-code\');   // captcha · expect_body\nif (code) throw err(code);   if (!html.trim()) throw err(\'empty body\');', 0.6, 4.55, 5.6, 0.7, 8);
  s.addText('At a data event, the honest “no” is part of the product.', { x: 6.4, y: 4.55, w: 3.0, h: 0.8, fontFace: DISP, fontSize: 12, italic: true, color: INK, margin: 0, valign: 'top' });
  s.addNotes('Beat 5 — the Unlocker. It reached Play and the blogs; Apple answered with nothing; reddit and iTunes are policy-gated. Every outcome is in the output file with the error text. Fallbacks are designed, not improvised.');
}

// 6 · WEB SCRAPER API — reviews at scale
{ const s = p.addSlide(); bg(s, G); beat(s, 'WEB SCRAPER API');
  eyebrow(s, 'web scraper api · structured reviews, three urls in', 0.6, 0.5, 7, DATA);
  title(s, 'Three Play-store URLs in. Three hundred structured reviews out. Three minutes.', 0.85, 24, 0.7);
  code(s, 'GET  /datasets/list                → 1,743 datasets · "Google Play Store reviews" = gd_m6zagkt024uwvvwuyu\nPOST /datasets/v3/trigger?dataset_id=gd_m6zagkt024uwvvwuyu&limit_per_input=100\n     [{ url: "…?id=com.calm.android" }, { url: "…?id=com.getsomeheadspace.android" }, { url: "…?id=org.wakingup.android" }]\n→ { snapshot_id: "sd_mt3vkhhd29jyfi8u7k" }\nGET  /datasets/v3/progress/sd_mt3vk…   → { status: "ready", records: 300, errors: 0 }\nGET  /datasets/v3/snapshot/sd_mt3vk…?format=json\n→ [{ review_rating: 2, review: "While I like it to remind me to relax, it is sloooooooow…", found_helpful: 347 }]', 0.6, 1.7, 8.8, 1.8, 7.5);
  s.addText('300 REVIEWS · 179 S · 0 ERRORS · 153 NEGATIVE', { x: 0.6, y: 3.65, w: 4.4, h: 0.25, fontFace: MONO, fontSize: 8, color: FAINT, charSpacing: 1.2, margin: 0 });
  s.addText('Same regex classes as the App Store corpus: 54% paywall fatigue · 11% lost simplicity · 14% choice overload. Two stores, two APIs, one shape — a cross-check, not blended into the page numbers.', { x: 0.6, y: 3.95, w: 4.4, h: 1.2, fontFace: BODY, fontSize: 11, color: MUTED, margin: 0, valign: 'top' });
  quote(s, 'Some days I don\'t want to discover something new, I just want to return to a old favorite. … I want a calming app to be calming.', 'headspace · google play · aug 10, 2026 · via web scraper api', 5.2, 3.7, 4.2, 12.5, 0.9);
  s.addNotes('Beat 6 — the Scraper API. The dataset id comes from /datasets/list. Trigger, poll, snapshot. The first download raced the "ready" status and came back empty — re-download, which play.js does.');
}

// 7 · MOMENT · WHAT HELD
{ const s = p.addSlide(); bg(s, GD); beat(s, 'MOMENT · WHAT HELD');
  eyebrow(s, 'the worked example · both halves held — in their own words', 0.6, 0.5, 7, DATA);
  title(s, 'H1: people ask for less. H2: the calm really does stay on the cushion.', 0.85, 24, 1.0);
  s.addChart(p.ChartType.bar, [{ name: 'Share of negative reviews', labels: ['Choice overload', 'Lost simplicity', 'Paywall fatigue'], values: [16, 17, 52] }], {
    x: 0.5, y: 1.85, w: 4.2, h: 2.35, barDir: 'bar', chartColors: [EMBER], showLegend: false, showTitle: false,
    showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0"%"', dataLabelColor: INK, dataLabelFontFace: MONO, dataLabelFontSize: 11,
    catAxisLabelColor: INK, catAxisLabelFontFace: DISP, catAxisLabelFontSize: 11, catGridLine: { style: 'none' }, catAxisLineShow: false,
    valAxisHidden: true, valGridLine: { style: 'none' }, valAxisMaxVal: 65, barGapWidthPct: 60,
  });
  s.addText('210 NEGATIVE APP STORE REVIEWS · SRC/CLUSTERS.JS', { x: 0.6, y: 4.25, w: 4.2, h: 0.25, fontFace: MONO, fontSize: 7.5, color: FAINT, charSpacing: 1, margin: 0 });
  s.addText('Computed by a regex file anyone can rerun. `node src/verify.js` checks the page matches.', { x: 0.6, y: 4.55, w: 4.2, h: 0.6, fontFace: BODY, fontSize: 10, color: MUTED, margin: 0, valign: 'top' });
  quote(s, 'Now I just feel overwhelmed with the amount of content. A feature that randomly selects a session would reduce decision fatigue.', 'headspace · app store · apple public feed', 5.2, 1.9, 4.2, 12, 0.62);
  quote(s, 'meditation helps me identify when I am not being present, However, when another same trigger arose, I was still reactive.', 'r/meditation · via serp', 5.2, 2.95, 4.2, 12, 0.62);
  quote(s, 'In order to change your behavior, you need to begin to bring your meditative mindset into daily life when you are in the act of making decisions…', 'r/meditation · via serp', 5.2, 4.0, 4.2, 12, 0.62);
  s.addNotes('Beat 7 — Moment, what held. 52 / 17 / 16, computed. H2 from a daily meditator: still reactive. And the community prescribes the bridge themselves.');
}

// 8 · MOMENT · REFUTED + UNCLAIMED — the ROI slide
{ const s = p.addSlide(); bg(s, G); beat(s, 'MOMENT · REFUTED · UNCLAIMED');
  eyebrow(s, 'the worked example · the competition queries did their job', 0.6, 0.5, 7, DATA);
  title(s, 'The web refuted my positioning. The interrupt and the minute both already exist.', 0.85, 24, 1.0);
  const comp = [
    ['Mindfulness Bell · Chill · Plum Village', 'interval or random bells — #1 and #2 for “mindfulness bell app”'],
    ['One-Moment Meditation®', '#1 and #2 for “one minute meditation reminder app” — a registered mark'],
    ['r/Meditation: “LESS reactive”', 'H2 is not universal — recorded as counter-evidence, not hidden'],
  ];
  comp.forEach(([h, t], i) => { const y = 2.05 + i * 0.7;
    s.addShape(p.ShapeType.ellipse, { x: 0.6, y: y + 0.08, w: 0.13, h: 0.13, fill: { color: DATA }, line: { width: 0 } });
    s.addText(h, { x: 0.9, y, w: 3.3, h: 0.3, fontFace: MONO, fontSize: 9.5, color: INK, bold: true, margin: 0 });
    s.addText(t, { x: 0.9, y: y + 0.3, w: 3.2, h: 0.4, fontFace: BODY, fontSize: 10, color: MUTED, margin: 0, valign: 'top' });
  });
  card(s, 4.3, 1.95, 5.1, 2.75, null);
  s.addText('UNCLAIMED — FOUND BY A “GAP” QUERY', { x: 4.5, y: 2.1, w: 4.7, h: 0.3, fontFace: MONO, fontSize: 8.5, color: EMBER, charSpacing: 1.2, margin: 0 });
  quote(s, 'My morning yoga includes setting an intention for the day… 23 minutes later I\'m in the thick of…', 'r/selfimprovement · #1 organic result · via serp', 4.5, 2.45, 4.7, 13, 0.85);
  s.addText('Remembering your own sentence at the moment it matters. The bell is taken. The minute is taken. The intention is not.', { x: 4.5, y: 3.7, w: 4.7, h: 0.9, fontFace: DISP, fontSize: 13, color: EMBER, margin: 0, valign: 'top' });
  s.addText('This slide is the ROI: a positioning I would have shipped wrong and a trademark collision, both caught before launch for a few dollars of API calls.', { x: 0.6, y: 4.85, w: 8.8, h: 0.5, fontFace: DISP, fontSize: 12, italic: true, color: INK, margin: 0 });
  s.addNotes('Beat 8 — Moment, refuted and unclaimed. The slide that paid for the evening.');
}

// 9 · LIVE — on a stranger's idea (exact --quick output as the offline fallback)
{ const s = p.addSlide(); bg(s, GD); beat(s, 'LIVE');
  eyebrow(s, 'live · thirty seconds on an idea from this room', 0.6, 0.5, 7, DATA);
  title(s, 'Give me your hypothesis. Let\'s see who disagrees.', 0.85, 26, 0.7);
  code(s, '$ node src/provemewrong.js --quick "Developers want an AI code reviewer that blocks merges" --community reddit.com/r/ExperiencedDevs\n\n▸ Prove Me Wrong · first pass — the full run takes four minutes\n  4 × POST api.brightdata.com/request { zone: SERP, url: google.com/search?q=…&brd_json=1 }  (in parallel)\n\n  [gap        ] #1 What If Most PR Comments Didn\'t Need to Block the Merge?        drpicox.medium.com\n  [gap        ] #1 Does anyone work on a team that doesn\'t require code ...          r/ExperiencedDevs\n  [refute     ] #1 What If Most PR Comments Didn\'t Need to Block the Merge?        drpicox.medium.com\n  [competition] #1 13 Best Automated Code Review Tools in 2026: AI and ...          sourcegraph.com\n\n  verdict (first pass): held — the web talks about this pain in your words · pushback on page one —\n  "What If Most PR Comments Didn\'t Need to Block the Merge?" · mechanism exists — sourcegraph.com\n  4/4 queries answered · 15659 ms · via Bright Data SERP API', 0.6, 1.7, 8.8, 2.8, 8);
  s.addText('Take a hypothesis from the room. Run it. Read the pushback out loud. Founders watching their idea get argued with, in public, by the web.', { x: 0.6, y: 4.65, w: 8.8, h: 0.55, fontFace: DISP, fontSize: 13, italic: true, color: INK, margin: 0 });
  s.addNotes('Switch to the terminal: cd engine && node src/provemewrong.js --quick "<hypothesis>" --community reddit.com/r/<sub>. Backup hypothesis if the room is shy: "Developers want an AI code reviewer that blocks merges" with r/ExperiencedDevs. If Google captcha-s the zone you will see retries printed; if wifi dies, this slide IS the output (collected Aug 22, 2026).');
}

// 10 · THE RECIPE
{ const s = p.addSlide(); bg(s, GD);
  orb(s, 4.55, 0.45, 0.9);
  s.addText('Do this to your own idea tonight.', { x: 0.8, y: 1.6, w: 8.4, h: 0.7, fontFace: DISP, fontSize: 26, color: INK, align: 'center', margin: 0 });
  const steps = [
    ['1 · Two sentences of hypothesis', 'and the queries that would kill it — a third of them written to refute you.'],
    ['2 · Three APIs, each for its job', 'SERP with brd_json=1 · site: your community · Web Scraper for the rows · Unlocker for the page.'],
    ['3 · Keep it honest', 'verbatim quotes, computed numbers, credit the path that served — including the gated ones.'],
  ];
  steps.forEach(([h, t], i) => { const x = 0.6 + i * 3.0;
    s.addText(h, { x, y: 2.5, w: 2.8, h: 0.6, fontFace: DISP, fontSize: 13, color: EMBER, align: 'center', margin: 0, valign: 'top' });
    s.addText(t, { x, y: 3.1, w: 2.8, h: 0.8, fontFace: BODY, fontSize: 10.5, color: MUTED, align: 'center', margin: 0, valign: 'top' });
  });
  s.addText('github.com/kewinzaq1/first-breath · moment.szlezingier.com · Bright Data SERP API · Web Scraper API · Web Unlocker · Apple\'s public feed · Claude', { x: 0.4, y: 4.85, w: 9.2, h: 0.3, fontFace: MONO, fontSize: 7.5, color: FAINT, align: 'center', margin: 0 });
  s.addNotes('Close. Repo is public. Thank you.');
}

p.writeFile({ fileName: require('path').join(__dirname, 'first-breath-how-it-works.pptx') }).then(f => console.log('wrote', f));
