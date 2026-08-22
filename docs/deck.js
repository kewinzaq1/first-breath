// Moment — "hypothesis → tried to break it → what held → what pushed back → the fix → how" deck. Rebuild: node docs/deck.js (needs pptxgenjs).
const pptxgen = require('pptxgenjs');
const p = new pptxgen();
p.layout = 'LAYOUT_16x9'; // 10 x 5.625
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
const chapter = (s, n) => s.addText(n, { x: 7.4, y: 0.5, w: 2.0, h: 0.3, fontFace: MONO, fontSize: 9, color: FAINT, align: 'right', charSpacing: 1.5, margin: 0 });

const code = (s, t, x, y, w, h, size=9.5) => { s.addShape(p.ShapeType.rect, { x, y, w, h, fill: { color: S }, line: { color: DATAD, width: 0.75 } }); s.addText(t, { x: x + 0.18, y: y + 0.12, w: w - 0.36, h: h - 0.24, fontFace: MONO, fontSize: size, color: INK, margin: 0, valign: 'top', lineSpacingMultiple: 1.15 }); };

// 1 · TITLE
{ const s = p.addSlide(); bg(s, G);
  orb(s, 4.5, 0.9, 0.9);
  s.addText('Break your own hypothesis\nwith Bright Data — in one evening', { x: 0.5, y: 2.1, w: 9, h: 1.4, fontFace: DISP, fontSize: 34, color: INK, align: 'center', margin: 0 });
  s.addText('SERP API · Web Unlocker · a Node script · a product idea I was too attached to', { x: 1, y: 3.55, w: 8, h: 0.5, fontFace: DISP, fontSize: 16, italic: true, color: EMBER, align: 'center', margin: 0 });
  s.addText('Worked example: Moment (moment.szlezingier.com) — meditation inside the day, not beside it', { x: 1.5, y: 4.1, w: 7, h: 0.5, fontFace: BODY, fontSize: 12, color: MUTED, align: 'center', margin: 0 });
  s.addText('BRIGHT DATA GTM EVENT · AUG 22, 2026 · KEW', { x: 1, y: 4.9, w: 8, h: 0.3, fontFace: MONO, fontSize: 9, color: FAINT, align: 'center', charSpacing: 1.5, margin: 0 });
  s.addNotes('This is a how-to. Moment is the example, not the subject. Promise: by the end you can run the same loop on your own idea tonight.');
}

// 2 · THE HYPOTHESIS (the thing to break)
{ const s = p.addSlide(); bg(s, G); chapter(s, 'THE IDEA');
  eyebrow(s, 'the hypothesis · something I believed', 0.6, 0.5, 6);
  title(s, 'Every product starts as a belief. Mine had two parts.', 0.85, 26, 0.7);
  const cols = [
    ['H1 · Overwhelm', 'Meditation apps bury people in content and choice. Ten thousand apps, forty-day challenges, a guru for every mood.', DATA],
    ['H2 · The gap', 'The calm stays in the session. Twenty minutes on the cushion — then the same snap, the same second plate, the same midnight scroll.', DATA],
    ['The bet · Moment', 'One sentence about how you want to move through today. A pause every 30 minutes. One minute to choose again.', EMBER],
  ];
  cols.forEach(([h, t, c], i) => { const x = 0.6 + i * 3.0;
    s.addShape(p.ShapeType.rect, { x, y: 1.85, w: 2.8, h: 2.0, fill: { color: S }, line: { color: c, width: i === 2 ? 0.75 : 0 } });
    s.addText(h, { x: x + 0.25, y: 2.05, w: 2.4, h: 0.4, fontFace: DISP, fontSize: 15, color: c, margin: 0 });
    s.addText(t, { x: x + 0.25, y: 2.5, w: 2.4, h: 1.3, fontFace: BODY, fontSize: 10.5, color: MUTED, margin: 0, valign: 'top' });
  });
  s.addText('The question for tonight is not “is Moment good”. It is: how do you make the web argue with you — cheaply, honestly, before you build?', { x: 0.6, y: 4.2, w: 8.8, h: 0.8, fontFace: DISP, fontSize: 15, italic: true, color: INK, margin: 0 });
}

// 3 · THE THREE CALLS
{ const s = p.addSlide(); bg(s, GD); chapter(s, 'THE APIs');
  eyebrow(s, 'bright data · everything I needed was one endpoint', 0.6, 0.5, 7, DATA);
  title(s, 'Three ways in. I used two, and wired the third.', 0.85, 26, 0.7);
  code(s, '// 1 · SERP API — Google, parsed for you\nPOST api.brightdata.com/request\n{ zone: SERP_ZONE,\n  url: "google.com/search?q=…&brd_json=1",\n  format: "raw" }\n→ { organic:[{rank,title,link,description}],\n    people_also_ask:[…], related:[…] }', 0.6, 1.7, 4.3, 1.75, 8.5);
  code(s, '// 2 · Web Unlocker — any URL, blocks handled\nPOST api.brightdata.com/request\n{ zone: UNLOCKER_ZONE, url, format: "raw" }\n→ the page body. Errors are PLAIN TEXT —\n  always surface a snippet, never JSON.parse blindly.', 0.6, 3.55, 4.3, 1.45, 8.5);
  code(s, '// 3 · Web Scraper API — structured, async\nPOST /datasets/v3/trigger?dataset_id=…\n→ snapshot_id\nGET  /datasets/v3/progress/{id}  (poll)\nGET  /datasets/v3/snapshot/{id}?format=json\n// wired in brightdata.js; the upgrade path for\n// app-store / Play reviews at scale', 5.1, 1.7, 4.3, 1.75, 8.5);
  s.addText([
    { text: 'Why this matters for a hypothesis test\n', options: { fontFace: DISP, fontSize: 13, color: INK, breakLine: true } },
    { text: 'SERP with brd_json=1 means zero HTML parsing anywhere in the pipeline. One Bearer token, one endpoint, ~1.8 s per query. The whole engine is ~300 lines of Node with a single dependency.', options: { fontFace: BODY, fontSize: 10.5, color: MUTED } },
  ], { x: 5.1, y: 3.55, w: 4.3, h: 1.45, margin: 0, valign: 'top' });
}

// 4 · PATTERN 1 — queries written to refute, reddit via site:
{ const s = p.addSlide(); bg(s, G); chapter(s, 'PATTERN 1');
  eyebrow(s, 'pattern · write the queries that would kill your idea', 0.6, 0.5, 7, DATA);
  title(s, 'If you only search for people who agree, the web will happily agree.', 0.85, 24, 0.7);
  code(s, 'const QUERIES = {\n  gap: [ "meditate every day but still reactive",\n         "meditation doesn\'t carry over into daily life",\n         "site:reddit.com/r/Meditation still reactive after years" ],\n  want: [ "how to stay mindful throughout the day",\n          "set an intention for the day and get reminded" ],\n  competition: [ "mindfulness bell app random reminders",\n                 "one minute meditation reminder app" ],  // ← meant to hurt\n};\nfor (const q of all) rows.push(...(await serp(q)).organic);', 0.6, 1.7, 5.4, 2.55, 8.5);
  s.addText([
    { text: 'Two tricks\n', options: { fontFace: DISP, fontSize: 13, color: INK, breakLine: true } },
    { text: 'Bucket your queries: ', options: { fontFace: BODY, fontSize: 10.5, color: EMBER } },
    { text: 'gap / want / competition. A third of them must be able to refute you, or you are doing marketing, not research.\n\n', options: { fontFace: BODY, fontSize: 10.5, color: MUTED, breakLine: true } },
    { text: 'site: through SERP: ', options: { fontFace: BODY, fontSize: 10.5, color: EMBER } },
    { text: 'reddit.com is KYC-gated on Web Unlocker. `site:reddit.com/r/Meditation …` through the SERP zone gives you titles + snippets of the exact threads, no KYC, no HTML.', options: { fontFace: BODY, fontSize: 10.5, color: MUTED } },
  ], { x: 6.3, y: 1.7, w: 3.1, h: 2.6, margin: 0, valign: 'top' });
  s.addText('12 queries · 104 rows · ~25 seconds · src/question.js', { x: 0.6, y: 4.55, w: 8.8, h: 0.3, fontFace: MONO, fontSize: 9, color: FAINT, margin: 0 });
}

// 5 · PATTERN 2 — fallbacks + honest attribution
{ const s = p.addSlide(); bg(s, GD); chapter(s, 'PATTERN 2');
  eyebrow(s, 'pattern · every source gets a fallback, and the page says which path served', 0.6, 0.5, 8, DATA);
  title(s, 'Zones have policies. Design for the “no” before you get it.', 0.85, 24, 0.7);
  const hdr = ['SOURCE', 'PRIMARY', 'FALLBACK', 'WHAT ACTUALLY SERVED'];
  hdr.forEach((h, i) => s.addText(h, { x: 0.6 + i * 2.2, y: 1.7, w: 2.1, h: 0.25, fontFace: MONO, fontSize: 8, color: DATA, charSpacing: 1.2, margin: 0 }));
  const rows = [
    ['Google SERP', 'SERP zone, brd_json=1', '— (base capability)', 'SERP · 146/146 rows'],
    ['reddit threads', 'Unlocker → reddit .json', 'SERP site:reddit.com/r/…', 'SERP · KYC-gated on Unlocker'],
    ['Apple reviews', 'Unlocker → itunes RSS', 'direct fetch (public API)', 'direct · 0 via unlocker, 9 direct'],
    ['Google Play page', 'Unlocker', '—', 'Unlocker · 200 OK, 1.2 MB (untapped)'],
  ];
  rows.forEach((r, ri) => r.forEach((c, ci) => s.addText(c, { x: 0.6 + ci * 2.2, y: 2.05 + ri * 0.55, w: 2.1, h: 0.5, fontFace: ci === 0 ? DISP : BODY, fontSize: ci === 0 ? 12 : 10, color: ci === 3 ? EMBER : (ci === 0 ? INK : MUTED), margin: 0, valign: 'top' })));
  code(s, 'export const pathStats = { unlocker: 0, direct: 0 };\n// … every fetch increments the path that served …\nlog(`${pathStats.unlocker} via unlocker, ${pathStats.direct} via direct`)', 0.6, 4.3, 5.4, 0.95, 8.5);
  s.addText('The page credits whichever path served. At a data event, that honesty is the product.', { x: 6.2, y: 4.3, w: 3.2, h: 0.95, fontFace: DISP, fontSize: 12, italic: true, color: INK, margin: 0, valign: 'top' });
}

// 6 · WHAT HELD
{ const s = p.addSlide(); bg(s, G); chapter(s, 'RESULT · HELD');
  eyebrow(s, 'result · both halves held — in their own words', 0.6, 0.5, 7, DATA);
  title(s, 'H1: people ask for less. H2: the calm really does stay on the cushion.', 0.85, 24, 1.0);
  s.addChart(p.ChartType.bar, [{ name: 'Share of negative reviews', labels: ['Lost simplicity', 'Choice overload', 'Paywall fatigue'], values: [14, 20, 48] }], {
    x: 0.5, y: 1.9, w: 4.2, h: 2.6, barDir: 'bar', chartColors: [EMBER], showLegend: false, showTitle: false,
    showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0"%"', dataLabelColor: INK, dataLabelFontFace: MONO, dataLabelFontSize: 11,
    catAxisLabelColor: INK, catAxisLabelFontFace: DISP, catAxisLabelFontSize: 11, catGridLine: { style: 'none' }, catAxisLineShow: false,
    valAxisHidden: true, valGridLine: { style: 'none' }, valAxisMaxVal: 60, barGapWidthPct: 60,
  });
  s.addText('210 NEGATIVE APP-STORE REVIEWS, CLASSIFIED', { x: 0.6, y: 4.55, w: 4.2, h: 0.3, fontFace: MONO, fontSize: 8, color: FAINT, charSpacing: 1.2, margin: 0 });
  quote(s, 'meditation helps me identify when I am not being present, However, when another same trigger arose, I was still reactive.', 'r/meditation · via serp', 5.2, 1.9, 4.2, 12, 0.85);
  quote(s, 'It\'s been 2years already into meditation. I am still dealing with intrusive thoughts, anxiety.', 'r/meditation · 151 votes · via serp', 5.2, 3.05, 4.2, 12, 0.6);
  quote(s, 'In order to change your behavior, you need to begin to bring your meditative mindset into daily life when you are in the act of making decisions…', 'r/meditation · via serp', 5.2, 3.95, 4.2, 12, 0.85);
}

// 7 · WHAT PUSHED BACK
{ const s = p.addSlide(); bg(s, GD); chapter(s, 'RESULT · REFUTED');
  eyebrow(s, 'result · the competition queries did their job', 0.6, 0.5, 7, DATA);
  title(s, 'The web refuted my positioning. The interrupt and the minute both already exist.', 0.85, 24, 1.0);
  const comp = [
    ['Mindfulness Bell · MindBell · Chill', 'interval or random bells, all day'],
    ['One-Moment Meditation®', 'one-minute exercise + reminders — and a registered mark'],
    ['Insight Timer', 'owns the SERP for “one minute meditation reminder app”'],
  ];
  comp.forEach(([h, t], i) => { const y = 2.05 + i * 0.7;
    s.addShape(p.ShapeType.ellipse, { x: 0.6, y: y + 0.08, w: 0.13, h: 0.13, fill: { color: DATA }, line: { width: 0 } });
    s.addText(h, { x: 0.9, y, w: 2.7, h: 0.3, fontFace: MONO, fontSize: 10.5, color: INK, bold: true, margin: 0 });
    s.addText(t, { x: 0.9, y: y + 0.3, w: 2.9, h: 0.4, fontFace: BODY, fontSize: 10, color: MUTED, margin: 0, valign: 'top' });
  });
  s.addShape(p.ShapeType.rect, { x: 4.3, y: 1.95, w: 5.1, h: 2.75, fill: { color: S }, line: { width: 0 } });
  s.addText('WHAT NO RESULT OFFERS — FOUND BY A “WANT” QUERY', { x: 4.5, y: 2.1, w: 4.7, h: 0.3, fontFace: MONO, fontSize: 8.5, color: EMBER, charSpacing: 1.2, margin: 0 });
  quote(s, 'My morning yoga includes setting an intention for the day… 23 minutes later I\'m in the thick of…', 'r/selfimprovement · #1 organic result · via serp', 4.5, 2.45, 4.7, 13, 0.85);
  s.addText('Remembering your own sentence at the moment it matters. The bell is taken. The minute is taken. The intention is not.', { x: 4.5, y: 3.7, w: 4.7, h: 0.9, fontFace: DISP, fontSize: 13, color: EMBER, margin: 0, valign: 'top' });
  s.addText('This slide is the ROI of the research: a positioning I would have shipped wrong, and a trademark collision, both caught for a few dollars of API calls.', { x: 0.6, y: 4.85, w: 8.8, h: 0.5, fontFace: DISP, fontSize: 12, italic: true, color: INK, margin: 0 });
}

// 8 · LIVE
{ const s = p.addSlide(); bg(s, G); chapter(s, 'LIVE');
  eyebrow(s, 'live · one call, right now', 0.6, 0.5, 6, DATA);
  title(s, 'Let\'s ask the web something I haven\'t asked yet.', 0.85, 26, 0.7);
  code(s, '$ node src/ask.js "how to remember my intention for the day"\n\n▸ POST https://api.brightdata.com/request\n  { zone: SERP, url: google.com/search?q=…&brd_json=1 }\n\n  8 organic results · 1813 ms · parsed by Bright Data, zero HTML touched\n\n  #1  How to remember my set intention for the day?\n      https://www.reddit.com/r/selfimprovement/comments/1llqrl4/…\n      “My morning yoga includes setting an intention for the day … 23 minutes later I\'m in the thick of …”\n  #2  The power of setting intentions & how to set mindful ones — calm.com\n  #3  How do I remember my intention throughout the day? — getstillmind.com', 0.6, 1.7, 8.8, 2.6, 9);
  s.addText('Take a query from the room. Run it. Read the #1 result out loud. That is the whole method — the rest is a loop.', { x: 0.6, y: 4.5, w: 8.8, h: 0.6, fontFace: DISP, fontSize: 14, italic: true, color: INK, margin: 0 });
  s.addNotes('Switch to the terminal. `cd engine && node src/ask.js "<query from the room>"`. If wifi dies, this slide IS the output.');
}

// 9 · THE PAGE — the loop closes
{ const s = p.addSlide(); bg(s, GD); chapter(s, 'OUTPUT');
  eyebrow(s, 'output · research.json → one self-contained page', 0.6, 0.5, 8);
  title(s, 'The research object is injected straight into the landing page. The proof is the pitch.', 0.85, 24, 0.9);
  code(s, '{ "sources": [ { api, what, from } ×3 ],\n  "quotes":  [ { text, src } ×5 ],        // verbatim from corpus\n  "clusters":[ { pct, label, of } ×3 ],    // computed, never typed\n  "hypothesis": { H1, H2, verdict: { H1, H2, pushback } },\n  "counter_evidence": [ … ],\n  "meta": { corpus, method, attribution } }', 0.6, 1.85, 4.6, 1.9, 8.5);
  const scenes = [['The noise', MUTED], ['The hypothesis', EMBER], ['The ask', DATA], ['Half held, half pushed back', DATA], ['The way', EMBER], ['One real Moment', EMBER]];
  scenes.forEach(([h, c], i) => { const y = 1.85 + i * 0.34;
    s.addShape(p.ShapeType.ellipse, { x: 5.6, y: y + 0.07, w: 0.14, h: 0.14, fill: { color: c }, line: { width: 0 } });
    s.addText(h, { x: 5.9, y, w: 3.5, h: 0.3, fontFace: DISP, fontSize: 12, color: INK, margin: 0 });
  });
  s.addText('Every quote and number on the page is this JSON. `node src/run.js --inject-only` swaps the blob; nothing else changes. When the story ends, the room writes one sentence and takes one minute.', { x: 0.6, y: 4.0, w: 8.8, h: 0.9, fontFace: BODY, fontSize: 11.5, color: MUTED, margin: 0, valign: 'top' });
  s.addNotes('If there is time: open the artifact, scroll to the last scene, run the one-minute Moment with the room. If not, skip — the live API call was the demo.');
}

// 10 · THE RECIPE + NEXT
{ const s = p.addSlide(); bg(s, GD);
  orb(s, 4.55, 0.45, 0.9);
  s.addText('Do this to your own idea tonight.', { x: 0.8, y: 1.6, w: 8.4, h: 0.7, fontFace: DISP, fontSize: 26, color: INK, align: 'center', margin: 0 });
  const steps = [
    ['1 · Write the hypothesis in two sentences', 'and three queries that would kill it.'],
    ['2 · SERP API, brd_json=1', 'site: your community. Bucket gap / want / competition.'],
    ['3 · Keep it honest', 'verbatim quotes, computed numbers, credit the path that served.'],
  ];
  steps.forEach(([h, t], i) => { const x = 0.6 + i * 3.0;
    s.addText(h, { x, y: 2.5, w: 2.8, h: 0.6, fontFace: DISP, fontSize: 13, color: EMBER, align: 'center', margin: 0, valign: 'top' });
    s.addText(t, { x, y: 3.1, w: 2.8, h: 0.6, fontFace: BODY, fontSize: 10.5, color: MUTED, align: 'center', margin: 0, valign: 'top' });
  });
  s.addText('Next for me: KYC so Unlocker reaches reddit + Apple directly · Web Scraper API for Play-store reviews at scale · Bright Data MCP so Claude runs this loop in conversation.', { x: 0.8, y: 3.95, w: 8.4, h: 0.6, fontFace: BODY, fontSize: 10.5, color: MUTED, align: 'center', margin: 0 });
  s.addText('github.com/kewinzaq1/first-breath  ·  moment.szlezingier.com  ·  built with Bright Data SERP API · Apple\'s public review feed · Claude', { x: 0.8, y: 4.8, w: 8.4, h: 0.3, fontFace: MONO, fontSize: 8.5, color: FAINT, align: 'center', margin: 0 });
}

p.writeFile({ fileName: require('path').join(__dirname, 'first-breath-how-it-works.pptx') }).then(f => console.log('wrote', f));
