// Moment — the demo deck, in the fixed arc:
//   pain → the bet → "prove me wrong" → the three calls → what held → what pushed back → the sharpened product → the room does it
// Bright Data is the subject; Moment is the worked example. Every number is from engine/out/research.json
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

// 1 · TITLE — the pain in one breath
{ const s = p.addSlide(); bg(s, G);
  orb(s, 4.5, 0.75, 0.9);
  s.addText('Break your own hypothesis\nwith Bright Data — in one evening', { x: 0.5, y: 1.95, w: 9, h: 1.4, fontFace: DISP, fontSize: 34, color: INK, align: 'center', margin: 0 });
  s.addText('Twenty minutes of calm on the cushion. Then the day happens — and you snap at your kid anyway.', { x: 1, y: 3.45, w: 8, h: 0.75, fontFace: DISP, fontSize: 16, italic: true, color: EMBER, align: 'center', margin: 0 });
  s.addText('SERP API · Web Scraper API · Web Unlocker · a Node script · a coding agent · a product idea I was too attached to', { x: 1, y: 4.2, w: 8, h: 0.4, fontFace: BODY, fontSize: 12, color: MUTED, align: 'center', margin: 0 });
  s.addText('BRIGHT DATA GTM EVENT · AUG 22, 2026 · KEW · MOMENT.SZLEZINGIER.COM', { x: 1, y: 4.9, w: 8, h: 0.3, fontFace: MONO, fontSize: 9, color: FAINT, align: 'center', charSpacing: 1.5, margin: 0 });
  s.addNotes('Beat 1 — the pain. Meditation apps sell calm and deliver a marketplace; even when it works, the calm stays on the cushion. Then: this is a how-to. Moment is the example, Bright Data is the subject.');
}

// 2 · THE BET
{ const s = p.addSlide(); bg(s, G); beat(s, 'THE BET');
  eyebrow(s, 'the hypothesis · something I believed', 0.6, 0.5, 6);
  title(s, 'Every product starts as a belief. Mine had two parts.', 0.85, 26, 0.7);
  const cols = [
    ['H1 · Overwhelm', 'Meditation apps bury people in content and choice. Ten thousand sessions, streaks, paywalls, a guru for every mood.', DATA],
    ['H2 · The gap', 'The calm stays in the session. Twenty minutes on the cushion — then the same snap, the same second plate, the same 2am scroll.', DATA],
    ['The bet · Moment', 'One sentence about how you want to move through today. A pause every 30 minutes. One minute to breathe and choose again.', EMBER],
  ];
  cols.forEach(([h, t, c], i) => { const x = 0.6 + i * 3.0;
    card(s, x, 1.85, 2.8, 2.0, i === 2 ? c : null);
    s.addText(h, { x: x + 0.25, y: 2.05, w: 2.4, h: 0.4, fontFace: DISP, fontSize: 15, color: c, margin: 0 });
    s.addText(t, { x: x + 0.25, y: 2.5, w: 2.4, h: 1.3, fontFace: BODY, fontSize: 10.5, color: MUTED, margin: 0, valign: 'top' });
  });
  s.addText('Meditation inside the day, not beside it. That was the bet. But a bet is not a business — so before telling anyone, I asked the web to break it.', { x: 0.6, y: 4.2, w: 8.8, h: 0.8, fontFace: DISP, fontSize: 15, italic: true, color: INK, margin: 0 });
  s.addNotes('Beat 2 — the bet. Two sentences of hypothesis, one product. The question for tonight is not "is Moment good" — it is how you make the web argue with you before you build.');
}

// 3 · PROVE ME WRONG · THE THREE CALLS — real request shapes + what each actually served
{ const s = p.addSlide(); bg(s, GD); beat(s, 'THE THREE CALLS');
  eyebrow(s, 'bright data · three apis, each for what it is best at', 0.6, 0.5, 7, DATA);
  title(s, 'I asked the web to prove me wrong. Three calls did the asking.', 0.85, 24, 0.7);
  code(s, '// 1 · SERP API — Google, parsed for you\nPOST api.brightdata.com/request\n{ zone: SERP_ZONE, format: "raw",\n  url: "google.com/search?q=…&brd_json=1" }\n→ { organic:[{rank,title,link,description}],\n    people_also_ask:[…], related:[…] }\n\n# served: 146 search rows (17 queries) +\n# 30 reddit threads via site:reddit.com/r/…', 0.6, 1.65, 4.3, 2.15, 8.5);
  code(s, '// 2 · Web Scraper API — structured, async\nPOST /datasets/v3/trigger?dataset_id=gd_m6zagkt…\n  [{ url: "…/details?id=com.calm.android" }, ×3]\n→ { snapshot_id }\nGET /datasets/v3/progress/{id}           (poll)\nGET /datasets/v3/snapshot/{id}?format=json\n→ [{ review_rating, review, reviewer_name, … }]\n\n# served: 300 reviews · 100 per app · 179 s · 0 errors', 5.1, 1.65, 4.3, 2.15, 8.5);
  code(s, '// 3 · Web Unlocker — any URL, blocks handled\nPOST api.brightdata.com/request\n{ zone: UNLOCKER_ZONE, url, format: "raw" } → body\n# served: play.google.com 3/3 · 200 OK · ~1.2 MB\n# refused: apple + reddit hosts (KYC) → fallbacks', 0.6, 3.95, 4.3, 1.35, 8.5);
  s.addText([
    { text: 'The rule that makes it a test\n', options: { fontFace: DISP, fontSize: 13, color: INK, breakLine: true } },
    { text: 'Every output file records which path served it (`via`). Apple\'s 450 reviews came from Apple\'s public feed, not Bright Data — and the page says so. Errors arrive as HTTP 200 with the truth in x-brd-error-code; surface it, never JSON.parse blindly.', options: { fontFace: BODY, fontSize: 10.5, color: MUTED } },
  ], { x: 5.1, y: 3.95, w: 4.3, h: 1.35, margin: 0, valign: 'top' });
  s.addNotes('Beat 3 + 4 — prove me wrong, the three calls. One Bearer token. SERP with brd_json=1: zero HTML. Web Scraper API: trigger, poll, snapshot — structured rows. Unlocker: the page body, and an honest "no" where the zone is policy-gated.');
}

// 4 · PROVE ME WRONG · THE PATTERN — queries written to refute
{ const s = p.addSlide(); bg(s, G); beat(s, 'PROVE ME WRONG · THE PATTERN');
  eyebrow(s, 'pattern · write the queries that would kill your idea', 0.6, 0.5, 7, DATA);
  title(s, 'Search only for people who agree, and the web will agree.', 0.85, 24, 0.7);
  code(s, 'const QUERIES = {\n  gap: [ "meditate every day but still reactive",\n         "meditation doesn\'t carry over into daily life",\n         "site:reddit.com/r/Meditation still reactive after years" ],\n  want: [ "how to stay mindful throughout the day",\n          "set an intention for the day and get reminded" ],\n  competition: [ "mindfulness bell app random reminders",\n                 "one minute meditation reminder app" ], // ← to hurt\n};\nfor (const q of all) rows.push(...(await serp(q)).organic);', 0.6, 1.7, 5.4, 2.55, 8.5);
  s.addText([
    { text: 'Two tricks\n', options: { fontFace: DISP, fontSize: 13, color: INK, breakLine: true } },
    { text: 'Bucket the queries: ', options: { fontFace: BODY, fontSize: 10.5, color: EMBER } },
    { text: 'gap / want / competition. A third of them must be able to refute you, or you are doing marketing, not research.\n\n', options: { fontFace: BODY, fontSize: 10.5, color: MUTED, breakLine: true } },
    { text: 'site: through SERP: ', options: { fontFace: BODY, fontSize: 10.5, color: EMBER } },
    { text: 'reddit.com is KYC-gated on the Unlocker. `site:reddit.com/r/Meditation …` through the SERP zone gives you titles + snippets of the exact threads — no KYC, no HTML.', options: { fontFace: BODY, fontSize: 10.5, color: MUTED } },
  ], { x: 6.3, y: 1.7, w: 3.1, h: 2.6, margin: 0, valign: 'top' });
  s.addText('12 queries · 104 rows · ~25 seconds · engine/src/question.js', { x: 0.6, y: 4.55, w: 8.8, h: 0.3, fontFace: MONO, fontSize: 9, color: FAINT, margin: 0 });
  s.addNotes('Still beat 3. The pattern is the thing to take home: bucket the queries, a third written to refute, reddit via site: through SERP.');
}

// 5 · WHAT HELD
{ const s = p.addSlide(); bg(s, GD); beat(s, 'WHAT HELD');
  eyebrow(s, 'result · both halves held — in their own words', 0.6, 0.5, 7, DATA);
  title(s, 'H1: people ask for less. H2: the calm really does stay on the cushion.', 0.85, 24, 1.0);
  s.addChart(p.ChartType.bar, [{ name: 'Share of negative reviews', labels: ['Choice overload', 'Lost simplicity', 'Paywall fatigue'], values: [16, 17, 52] }], {
    x: 0.5, y: 1.85, w: 4.2, h: 2.35, barDir: 'bar', chartColors: [EMBER], showLegend: false, showTitle: false,
    showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0"%"', dataLabelColor: INK, dataLabelFontFace: MONO, dataLabelFontSize: 11,
    catAxisLabelColor: INK, catAxisLabelFontFace: DISP, catAxisLabelFontSize: 11, catGridLine: { style: 'none' }, catAxisLineShow: false,
    valAxisHidden: true, valGridLine: { style: 'none' }, valAxisMaxVal: 65, barGapWidthPct: 60,
  });
  s.addText('210 NEGATIVE APP STORE REVIEWS · SRC/CLUSTERS.JS', { x: 0.6, y: 4.25, w: 4.2, h: 0.25, fontFace: MONO, fontSize: 7.5, color: FAINT, charSpacing: 1, margin: 0 });
  s.addText('Google Play, second API, same regexes: 54% · 11% · 14% of 153 negatives. Two stores, two APIs, one shape.', { x: 0.6, y: 4.55, w: 4.2, h: 0.6, fontFace: BODY, fontSize: 10, color: MUTED, margin: 0, valign: 'top' });
  quote(s, 'Some days I don\'t want to discover something new, I just want to return to a old favorite. … I want a calming app to be calming.', 'headspace · google play · aug 2026 · via web scraper api', 5.2, 1.9, 4.2, 12, 0.62);
  quote(s, 'meditation helps me identify when I am not being present, However, when another same trigger arose, I was still reactive.', 'r/meditation · via serp', 5.2, 2.95, 4.2, 12, 0.62);
  quote(s, 'In order to change your behavior, you need to begin to bring your meditative mindset into daily life when you are in the act of making decisions…', 'r/meditation · via serp', 5.2, 4.0, 4.2, 12, 0.62);
  s.addNotes('Beat 5 — what held. 52 / 17 / 16, computed by a regex file anyone can rerun. Play agrees. H2 from a daily meditator: still reactive. And the community prescribes the bridge themselves.');
}

// 6 · WHAT PUSHED BACK — the ROI slide
{ const s = p.addSlide(); bg(s, G); beat(s, 'WHAT PUSHED BACK');
  eyebrow(s, 'result · the competition queries did their job', 0.6, 0.5, 7, DATA);
  title(s, 'The web refuted my positioning. The interrupt and the minute both already exist.', 0.85, 24, 1.0);
  const comp = [
    ['Mindfulness Bell · MindBell · Chill', 'interval or random bells, all day'],
    ['One-Moment Meditation®', 'one-minute exercise + reminders — and a registered mark'],
    ['Insight Timer', 'owns the SERP for “one minute meditation reminder app”'],
  ];
  comp.forEach(([h, t], i) => { const y = 2.05 + i * 0.7;
    s.addShape(p.ShapeType.ellipse, { x: 0.6, y: y + 0.08, w: 0.13, h: 0.13, fill: { color: DATA }, line: { width: 0 } });
    s.addText(h, { x: 0.9, y, w: 3.3, h: 0.3, fontFace: MONO, fontSize: 9.5, color: INK, bold: true, margin: 0 });
    s.addText(t, { x: 0.9, y: y + 0.3, w: 3.0, h: 0.4, fontFace: BODY, fontSize: 10, color: MUTED, margin: 0, valign: 'top' });
  });
  card(s, 4.3, 1.95, 5.1, 2.75, null);
  s.addText('WHAT NO RESULT OFFERS — FOUND BY A “WANT” QUERY', { x: 4.5, y: 2.1, w: 4.7, h: 0.3, fontFace: MONO, fontSize: 8.5, color: EMBER, charSpacing: 1.2, margin: 0 });
  quote(s, 'My morning yoga includes setting an intention for the day… 23 minutes later I\'m in the thick of…', 'r/selfimprovement · #1 organic result · via serp', 4.5, 2.45, 4.7, 13, 0.85);
  s.addText('Remembering your own sentence at the moment it matters. The bell is taken. The minute is taken. The intention is not.', { x: 4.5, y: 3.7, w: 4.7, h: 0.9, fontFace: DISP, fontSize: 13, color: EMBER, margin: 0, valign: 'top' });
  s.addText('This slide is the ROI of the research: a positioning I would have shipped wrong, and a trademark collision, both caught for a few dollars of API calls.', { x: 0.6, y: 4.85, w: 8.8, h: 0.5, fontFace: DISP, fontSize: 12, italic: true, color: INK, margin: 0 });
  s.addNotes('Beat 6 — what pushed back. The slide that paid for the evening. A wrong positioning and a trademark collision caught before launch.');
}

// 7 · THE SHARPENED PRODUCT
{ const s = p.addSlide(); bg(s, GD); beat(s, 'THE SHARPENED PRODUCT');
  eyebrow(s, 'the way · the data sharpened the product', 0.6, 0.5, 6);
  title(s, 'Not a reminder app. Not a meditation library.', 0.85, 26, 0.7);
  const rows = [
    ['What the web said', 'What Moment became'],
  ];
  s.addText(rows[0][0].toUpperCase(), { x: 0.6, y: 1.8, w: 4, h: 0.25, fontFace: MONO, fontSize: 8.5, color: DATA, charSpacing: 1.5, margin: 0 });
  s.addText(rows[0][1].toUpperCase(), { x: 5.3, y: 1.8, w: 4, h: 0.25, fontFace: MONO, fontSize: 8.5, color: EMBER, charSpacing: 1.5, margin: 0 });
  const pairs = [
    ['52% paywall fatigue · 17% lost simplicity · 16% choice overload', 'One sentence. Nothing to choose, nothing to unlock.'],
    ['“when another same trigger arose, I was still reactive”', 'A pause every thirty minutes — inside the day, not beside it.'],
    ['the bell is taken · the minute is taken (One-Moment Meditation®)', 'Not a bell. It hands you back your own sentence.'],
    ['“23 minutes later I\'m in the thick of…”', 'One minute to breathe — and choose again.'],
  ];
  pairs.forEach(([a, b], i) => { const y = 2.2 + i * 0.62;
    s.addText(a, { x: 0.6, y, w: 4.0, h: 0.55, fontFace: DISP, fontSize: 11.5, italic: true, color: DATA, margin: 0, valign: 'top' });
    s.addText('→', { x: 4.6, y: y + 0.02, w: 0.6, h: 0.35, fontFace: BODY, fontSize: 16, color: FAINT, align: 'center', margin: 0 });
    s.addText(b, { x: 5.3, y, w: 4.1, h: 0.55, fontFace: BODY, fontSize: 12, color: EMBER, margin: 0, valign: 'top' });
  });
  s.addText('One intention. One minute. In the moment it matters.', { x: 0.6, y: 4.8, w: 8.8, h: 0.45, fontFace: DISP, fontSize: 15, italic: true, color: INK, margin: 0 });
  s.addNotes('Beat 7 — the sharpened product. Every line on the right is a response to a verbatim line on the left.');
}

// 8 · LIVE — exact ask.js output (offline fallback)
{ const s = p.addSlide(); bg(s, G); beat(s, 'LIVE');
  eyebrow(s, 'live · one call, right now', 0.6, 0.5, 6, DATA);
  title(s, 'Let\'s ask the web something from this room.', 0.85, 26, 0.7);
  code(s, '$ node src/ask.js "how to remember my intention for the day"\n\n▸ POST https://api.brightdata.com/request\n  { zone: SERP, url: google.com/search?q="how to remember my intention for the day"&brd_json=1 }\n\n  8 organic results · 1445 ms · parsed by Bright Data, zero HTML touched\n\n  #1  How to remember my set intention for the day?\n      https://www.reddit.com/r/selfimprovement/comments/1llqrl4/how_to_remember_my_set_intention_for_the_day/\n      “My morning yoga includes setting an intention for the day (a one-word mantra, or guiding\n       principle, if you will). 23 minutes later I\'m in the thick of ...…”\n  #2  How do I remember my intention throughout the day? - StillMind\n  #3  The power of setting intentions & how to set mindful ones — calm.com\n\n  people also ask → How do I set my intention for the day? · What are my intentions for the day?', 0.6, 1.7, 8.8, 2.75, 8.5);
  s.addText('Take a query from the room. Run it. Read the #1 result out loud. That is the whole method — the rest is a loop.', { x: 0.6, y: 4.6, w: 8.8, h: 0.55, fontFace: DISP, fontSize: 14, italic: true, color: INK, margin: 0 });
  s.addNotes('Switch to the terminal: cd engine && node src/ask.js "<query from the room>". If Google captcha-s the zone you will see retries; if it fails, `node src/ask.js --cached "how to remember my intention for the day"` prints this exact output, labelled cached. If wifi dies, this slide IS the output (collected Aug 22, 2026).');
}

// 9 · THE ROOM DOES IT — research.json → page → one minute together
{ const s = p.addSlide(); bg(s, GD); beat(s, 'THE ROOM DOES IT');
  eyebrow(s, 'output · research.json → one self-contained page → one real moment', 0.6, 0.5, 8);
  title(s, 'The research object is injected straight into the page. Then the page asks you for one sentence.', 0.85, 24, 0.9);
  code(s, '{ "sources": [ { api, what, from } ×3 ],\n  "quotes":  [ { text, src } ×5 ],     // verbatim\n  "clusters":[ { pct, label, of } ×3 ], // computed\n  "hypothesis": { H1, H2,\n                  verdict: { H1, H2, pushback } },\n  "counter_evidence": [ … ],\n  "meta": { corpus, method, attribution } }\n// verify.js checks all of it before a republish', 0.6, 1.85, 4.6, 1.9, 8.5);
  const scenes = [['The noise', MUTED], ['The bet', EMBER], ['Prove me wrong · three calls', DATA], ['Half held, half pushed back', DATA], ['The sharpened product', EMBER], ['One sentence · six breaths · choose again', EMBER]];
  scenes.forEach(([h, c], i) => { const y = 1.85 + i * 0.34;
    s.addShape(p.ShapeType.ellipse, { x: 5.6, y: y + 0.07, w: 0.14, h: 0.14, fill: { color: c }, line: { width: 0 } });
    s.addText(h, { x: 5.9, y, w: 3.5, h: 0.3, fontFace: DISP, fontSize: 12, color: INK, margin: 0 });
  });
  s.addText('Write one sentence about how you want to move through tonight. Sixty seconds. Six breaths. Halfway through, the sentence comes back. Then: now choose again.', { x: 0.6, y: 4.0, w: 8.8, h: 0.9, fontFace: DISP, fontSize: 13, italic: true, color: EMBER, margin: 0, valign: 'top' });
  s.addNotes('Beat 8 — the room does it. Open the artifact at the last scene. Ask the room to write one sentence. Press Enter. Silence for a minute. Escape aborts if needed.');
}

// 10 · CLOSE — the recipe
{ const s = p.addSlide(); bg(s, GD);
  orb(s, 4.55, 0.45, 0.9);
  s.addText('Do this to your own idea tonight.', { x: 0.8, y: 1.6, w: 8.4, h: 0.7, fontFace: DISP, fontSize: 26, color: INK, align: 'center', margin: 0 });
  const steps = [
    ['1 · Two sentences of hypothesis', 'and three queries that would kill it.'],
    ['2 · Three APIs, each for its job', 'SERP with brd_json=1 · site: your community · Web Scraper for the rows · Unlocker for the page.'],
    ['3 · Keep it honest', 'verbatim quotes, computed numbers, credit the path that served.'],
  ];
  steps.forEach(([h, t], i) => { const x = 0.6 + i * 3.0;
    s.addText(h, { x, y: 2.5, w: 2.8, h: 0.6, fontFace: DISP, fontSize: 13, color: EMBER, align: 'center', margin: 0, valign: 'top' });
    s.addText(t, { x, y: 3.1, w: 2.8, h: 0.8, fontFace: BODY, fontSize: 10.5, color: MUTED, align: 'center', margin: 0, valign: 'top' });
  });
  s.addText('github.com/kewinzaq1/first-breath · moment.szlezingier.com · Bright Data SERP API · Web Scraper API · Web Unlocker · Apple\'s public feed · Claude', { x: 0.4, y: 4.85, w: 9.2, h: 0.3, fontFace: MONO, fontSize: 7.5, color: FAINT, align: 'center', margin: 0 });
  s.addNotes('Close. Repo is public. Thank you.');
}

p.writeFile({ fileName: require('path').join(__dirname, 'first-breath-how-it-works.pptx') }).then(f => console.log('wrote', f));
