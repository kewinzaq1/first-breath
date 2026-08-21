// First Breath — "pain → proof → fix → how" deck. Rebuild: node docs/deck.js (needs pptxgenjs).
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

// 1 · TITLE
{ const s = p.addSlide(); bg(s, G);
  orb(s, 4.5, 1.0, 1.0);
  s.addText('First Breath', { x: 0.5, y: 2.3, w: 9, h: 1.0, fontFace: DISP, fontSize: 48, color: INK, align: 'center', margin: 0 });
  s.addText('A pain. A proof. A fix.', { x: 1, y: 3.3, w: 8, h: 0.5, fontFace: DISP, fontSize: 20, italic: true, color: EMBER, align: 'center', margin: 0 });
  s.addText('How I used the web to prove meditation apps have lost the plot — and what I built instead', { x: 1.5, y: 3.85, w: 7, h: 0.6, fontFace: BODY, fontSize: 13, color: MUTED, align: 'center', margin: 0 });
  s.addText('BRIGHT DATA GTM EVENT · AUG 22, 2026 · KEW', { x: 1, y: 4.9, w: 8, h: 0.3, fontFace: MONO, fontSize: 9, color: FAINT, align: 'center', charSpacing: 1.5, margin: 0 });
  s.addNotes('I teach meditation the pragmatic way: start a timer, count your breaths. This is the story of how I proved the world wants that — with data, not opinion.');
}

// 2 · THE PAIN (my claim)
{ const s = p.addSlide(); bg(s, G); chapter(s, 'PAIN');
  eyebrow(s, 'the pain · what I believed', 0.6, 0.5, 6);
  title(s, 'Meditation apps run the social-feed playbook: keep you coming back, give you more, charge you more.', 0.85, 24, 1.1);
  const cols = [
    ['Keep you coming back', 'Streaks. Reminders. Pop-ups. An AI coach you can\'t switch off. The same retention loops as a feed — pointed at your calm.'],
    ['Give you more', 'Five hundred guided sessions. Sleep stories. Masterclasses. Soundscapes. A thousand doors that all say “begin here”.'],
    ['Charge you more', '“Free” trials that bill on day one. Four screens to cancel. $70–$160 a year — for something that used to be a timer.'],
  ];
  cols.forEach(([h, t], i) => { const x = 0.6 + i * 3.0;
    s.addShape(p.ShapeType.rect, { x, y: 2.25, w: 2.8, h: 1.85, fill: { color: S }, line: { width: 0 } });
    s.addText(h, { x: x + 0.25, y: 2.45, w: 2.4, h: 0.4, fontFace: DISP, fontSize: 15, color: EMBER, margin: 0 });
    s.addText(t, { x: x + 0.25, y: 2.9, w: 2.4, h: 1.4, fontFace: BODY, fontSize: 11, color: MUTED, margin: 0, valign: 'top' });
  });
  s.addText('That was my opinion. Opinions don\'t win arguments — and they don\'t build products.', { x: 0.6, y: 4.7, w: 8.8, h: 0.4, fontFace: DISP, fontSize: 14, italic: true, color: INK, margin: 0 });
  s.addNotes('Be explicit that this slide is a claim, not data. The next slides are where the data comes in.');
}

// 3 · THE QUESTION
{ const s = p.addSlide(); bg(s, GD); chapter(s, 'QUESTION');
  eyebrow(s, 'the question', 0.6, 0.5, 6, DATA);
  title(s, 'Is the pain real — or just mine?', 0.85, 30, 0.7);
  s.addText('I teach people to sit with a timer and count breaths. It works for the people in my room. But a room is not a market. Before building anything I wanted proof I couldn\'t argue with: real people, in their own words, counted.', { x: 0.6, y: 1.65, w: 5.2, h: 1.6, fontFace: BODY, fontSize: 13, color: MUTED, margin: 0, valign: 'top' });
  s.addText('So I asked the web — the places where people tell the truth about these apps:', { x: 0.6, y: 3.25, w: 5.2, h: 0.5, fontFace: BODY, fontSize: 13, color: INK, margin: 0 });
  const src = [
    ['450 app-store reviews', 'Calm · Headspace · Waking Up — 210 of them negative'],
    ['30 community threads', 'r/Meditation · r/getdisciplined — starting, and quitting'],
    ['42 search results', 'how beginners actually ask, e.g. “how to start meditating without an app”'],
  ];
  src.forEach(([h, t], i) => { const y = 1.65 + i * 1.05;
    s.addShape(p.ShapeType.rect, { x: 6.1, y, w: 3.3, h: 0.9, fill: { color: S }, line: { width: 0 } });
    s.addText(h, { x: 6.3, y: y + 0.12, w: 3.0, h: 0.3, fontFace: MONO, fontSize: 11, color: DATA, bold: true, margin: 0 });
    s.addText(t, { x: 6.3, y: y + 0.42, w: 3.0, h: 0.45, fontFace: BODY, fontSize: 9.5, color: MUTED, margin: 0, valign: 'top' });
  });
  s.addText('Collected on Aug 21, 2026 via Bright Data SERP API + Apple\'s public review feed. How, on slide 8.', { x: 0.6, y: 4.85, w: 8.8, h: 0.3, fontFace: MONO, fontSize: 8.5, color: FAINT, margin: 0 });
}

// 4 · PROOF 1 — the money
{ const s = p.addSlide(); bg(s, G); chapter(s, 'PROOF 1/3');
  eyebrow(s, 'proof · 210 negative reviews, classified', 0.6, 0.5, 6, DATA);
  title(s, 'Half of the anger is about money. Not one complaint asks for more content.', 0.85, 24, 1.0);
  s.addChart(p.ChartType.bar, [{ name: 'Share of negative reviews', labels: ['Lost simplicity', 'Choice overload', 'Paywall fatigue'], values: [14, 20, 48] }], {
    x: 0.5, y: 1.9, w: 5.0, h: 3.0, barDir: 'bar', chartColors: [EMBER], showLegend: false, showTitle: false,
    showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0"%"', dataLabelColor: INK, dataLabelFontFace: MONO, dataLabelFontSize: 12,
    catAxisLabelColor: INK, catAxisLabelFontFace: DISP, catAxisLabelFontSize: 12, catGridLine: { style: 'none' }, catAxisLineShow: false,
    valAxisHidden: true, valGridLine: { style: 'none' }, valAxisMaxVal: 60, barGapWidthPct: 60,
  });
  quote(s, 'Literally nothing is free. To use anything they make you do a trial of their paid service. I can get all of this on YouTube, why would I pay for it? Greedy greedy greedy.', 'headspace · app-store review', 5.9, 1.95, 3.5, 12, 1.05);
  quote(s, 'A company promoting mental wellness should not create stress through questionable billing practices.', 'headspace · app-store review', 5.9, 3.5, 3.5, 12, 0.7);
  s.addText('Method: keyword-class share of the 210 negative reviews, computed from the corpus and recorded with the result.', { x: 0.6, y: 5.0, w: 8.8, h: 0.3, fontFace: MONO, fontSize: 8, color: FAINT, margin: 0 });
}

// 5 · PROOF 2 — the engagement machine, in their words
{ const s = p.addSlide(); bg(s, GD); chapter(s, 'PROOF 2/3');
  eyebrow(s, 'proof · the retention loop, in their own words', 0.6, 0.5, 7, DATA);
  title(s, 'The “social-feed playbook” wasn\'t my metaphor. Users describe it themselves.', 0.85, 24, 1.0);
  quote(s, 'There\'s constant notifications and pop-ups to engage with their AI chat bot Ebb that you cannot turn off.', 'headspace · app-store review', 0.6, 2.0, 2.7, 13, 1.5);
  quote(s, 'Went through 4 different rounds of asking me if I\'m sure I want to cancel. Then I get to a screen that in LARGE letters says “No problem.” … Two weeks later I see a charge for the app.', 'calm · app-store review', 3.65, 2.0, 2.7, 13, 1.5);
  quote(s, 'Congrats instead of lowering my heart rate I have increased my rage.', 'headspace · app-store review', 6.7, 2.0, 2.7, 13, 1.5);
  s.addText('Reminders, dark-pattern cancellation, rage. The product that promised calm is generating the opposite — and people notice.', { x: 0.6, y: 4.55, w: 8.8, h: 0.5, fontFace: DISP, fontSize: 14, italic: true, color: INK, margin: 0 });
}

// 6 · PROOF 3 — what people actually want
{ const s = p.addSlide(); bg(s, G); chapter(s, 'PROOF 3/3');
  eyebrow(s, 'proof · what people ask for instead', 0.6, 0.5, 7, DATA);
  title(s, 'The market names the product for me: a timer.', 0.85, 26, 0.7);
  quote(s, 'The idea that we now need to pay a $70 yearly subscription for a timer is embarrassingly greedy.', 'r/meditation · via bright data serp', 0.6, 1.7, 5.2, 18, 1.2);
  quote(s, 'It\'s simple enough that I actually use it. Here\'s the practice: Sit or lie down comfortably. Set a timer for 3–5…', 'r/meditation · via bright data serp', 0.6, 3.35, 5.2, 13, 0.75);
  s.addShape(p.ShapeType.rect, { x: 6.2, y: 1.7, w: 3.2, h: 3.2, fill: { color: S }, line: { width: 0 } });
  s.addText('THE SEARCH GAP', { x: 6.45, y: 1.9, w: 2.8, h: 0.3, fontFace: MONO, fontSize: 9, color: DATA, charSpacing: 1.5, margin: 0 });
  s.addText('“how to start meditating without an app”', { x: 6.45, y: 2.25, w: 2.8, h: 0.6, fontFace: DISP, fontSize: 13, italic: true, color: INK, margin: 0 });
  s.addText('9 results. Reddit, blogs, a Facebook group, Quora, a Headspace article.', { x: 6.45, y: 2.95, w: 2.8, h: 0.7, fontFace: BODY, fontSize: 11, color: MUTED, margin: 0, valign: 'top' });
  s.addText('Not one of them is a timer.', { x: 6.45, y: 3.75, w: 2.8, h: 0.4, fontFace: DISP, fontSize: 15, color: EMBER, margin: 0 });
  s.addText('People are searching for the way out. Nobody is standing there.', { x: 6.45, y: 4.2, w: 2.8, h: 0.6, fontFace: BODY, fontSize: 10.5, color: MUTED, margin: 0, valign: 'top' });
}

// 7 · THE FIX
{ const s = p.addSlide(); bg(s, GD); chapter(s, 'FIX');
  eyebrow(s, 'the fix · first breath', 0.6, 0.5, 6);
  title(s, 'The data didn\'t give me a product. It gave me permission to remove everything else.', 0.85, 24, 1.0);
  const rows = [
    ['Paywalls, trials, cancel traps', '48% of the anger', 'Free. No account. Nothing to cancel.'],
    ['Five hundred sessions to choose from', '20% — choice overload', 'One practice. There is nothing to choose.'],
    ['Streaks, reminders, chat bots', 'the retention loop', 'No notifications. It never asks you back.'],
    ['A library that forgot the idea', '14% — lost simplicity', 'A timer and counted breaths. That\'s the whole product.'],
  ];
  s.addText('THE PAIN', { x: 0.6, y: 2.0, w: 4, h: 0.25, fontFace: MONO, fontSize: 8.5, color: MUTED, charSpacing: 1.5, margin: 0 });
  s.addText('WHAT FIRST BREATH DOES', { x: 5.3, y: 2.0, w: 4, h: 0.25, fontFace: MONO, fontSize: 8.5, color: EMBER, charSpacing: 1.5, margin: 0 });
  rows.forEach(([pain, ev, fix], i) => { const y = 2.35 + i * 0.68;
    s.addText(pain, { x: 0.6, y, w: 3.4, h: 0.3, fontFace: DISP, fontSize: 13, color: INK, margin: 0 });
    s.addText(ev, { x: 0.6, y: y + 0.3, w: 3.4, h: 0.25, fontFace: MONO, fontSize: 8.5, color: DATA, margin: 0 });
    s.addText('→', { x: 4.3, y: y + 0.02, w: 0.6, h: 0.35, fontFace: BODY, fontSize: 16, color: FAINT, align: 'center', margin: 0 });
    s.addText(fix, { x: 5.3, y, w: 4.1, h: 0.55, fontFace: BODY, fontSize: 12, color: EMBER, margin: 0, valign: 'top' });
  });
  s.addText('One timer. Counted breaths. Nothing else.', { x: 0.6, y: 5.0, w: 8.8, h: 0.4, fontFace: DISP, fontSize: 15, italic: true, color: INK, margin: 0 });
}

// 8 · HOW — Bright Data
{ const s = p.addSlide(); bg(s, G); chapter(s, 'HOW');
  eyebrow(s, 'how · one node script, wired to bright data', 0.6, 0.5, 7, DATA);
  s.addText('node src/run.js', { x: 0.6, y: 0.85, w: 8, h: 0.5, fontFace: MONO, fontSize: 22, color: INK, margin: 0 });
  const boxes = [
    ['SERP API', 'Google results as JSON (brd_json=1). Also mines reddit via site: searches — the only path that works without KYC.', DATA],
    ['Web Unlocker', 'Tried first for every page. Apple + reddit are policy-gated on this zone, so the run fell back — and says so.', DATA],
    ['Apple review feed', 'Public JSON, fetched directly. 3 apps × 3 pages → 450 reviews.', DATA],
    ['corpus.json', '450 reviews · 30 threads · 42 SERP rows. The raw truth.', DATA],
    ['Claude', 'Distills clusters, verbatim quotes, insights → research.json. Degrades to a paste-in prompt without API credits.', EMBER],
    ['page/index.html', 'research.json injected into one self-contained file. The proof becomes the pitch.', EMBER],
  ];
  boxes.forEach(([h, t, c], i) => { const col = i % 3, row = Math.floor(i / 3); const x = 0.6 + col * 3.0, y = 1.55 + row * 1.6;
    s.addShape(p.ShapeType.rect, { x, y, w: 2.8, h: 1.4, fill: { color: S }, line: { color: c, width: 0.75 } });
    s.addText(h, { x: x + 0.2, y: y + 0.12, w: 2.5, h: 0.35, fontFace: MONO, fontSize: 11.5, color: c, bold: true, margin: 0 });
    s.addText(t, { x: x + 0.2, y: y + 0.48, w: 2.45, h: 0.9, fontFace: BODY, fontSize: 9.5, color: MUTED, margin: 0, valign: 'top' });
  });
  s.addText([
    { text: 'Three rules kept it honest:  ', options: { fontFace: DISP, fontSize: 11, color: INK } },
    { text: 'every quote verbatim from the corpus · every percentage computed, never typed · every source credited by the path that actually served it.', options: { fontFace: BODY, fontSize: 11, color: MUTED } },
  ], { x: 0.6, y: 4.85, w: 8.8, h: 0.5, margin: 0, valign: 'top' });
}

// 9 · THE PAGE
{ const s = p.addSlide(); bg(s, GD); chapter(s, 'PROOF → PITCH');
  eyebrow(s, 'the page · claude.ai/code/artifact/9771a3f5…', 0.6, 0.5, 8);
  title(s, 'The landing page tells the same story — and ends with the product itself.', 0.85, 24, 0.9);
  const scenes = [
    ['The noise', 'the app store as a wall of chips', MUTED], ['The instinct', 'start a timer, count breaths', EMBER],
    ['The ask', 'three sources, live counts', DATA], ['The reveal', 'verbatim quotes → 48 / 20 / 14', DATA],
    ['The way', 'permission to keep it simple', EMBER], ['Breathe', 'ten breaths, together, right now', EMBER],
  ];
  scenes.forEach(([h, t, c], i) => { const x = 0.6 + i * 1.5;
    s.addShape(p.ShapeType.ellipse, { x: x + 0.55, y: 2.2, w: 0.22, h: 0.22, fill: { color: c }, line: { width: 0 } });
    if (i < 5) s.addShape(p.ShapeType.line, { x: x + 0.8, y: 2.31, w: 1.25, h: 0, line: { color: FAINT, width: 0.75 } });
    s.addText(h, { x, y: 2.6, w: 1.35, h: 0.35, fontFace: DISP, fontSize: 13, color: INK, align: 'center', margin: 0 });
    s.addText(t, { x, y: 2.95, w: 1.35, h: 0.8, fontFace: BODY, fontSize: 9.5, color: MUTED, align: 'center', margin: 0, valign: 'top' });
  });
  s.addText('Every quote and number on the page is the same research.json you just saw. When the story ends, the audience does the practice — that is the demo.', { x: 0.6, y: 4.2, w: 8.8, h: 0.8, fontFace: DISP, fontSize: 14, italic: true, color: INK, margin: 0 });
  s.addNotes('Switch to the live page here. Scroll the story, then run the ten-breath timer with the room.');
}

// 10 · CLOSE
{ const s = p.addSlide(); bg(s, GD);
  orb(s, 4.45, 0.55, 1.1);
  s.addText('Stop guessing. Let the web show you the way.', { x: 0.8, y: 2.4, w: 8.4, h: 1.1, fontFace: DISP, fontSize: 28, color: INK, align: 'center', margin: 0 });
  s.addText('Now — ten breaths.', { x: 0.8, y: 3.6, w: 8.4, h: 0.5, fontFace: DISP, fontSize: 18, italic: true, color: EMBER, align: 'center', margin: 0 });
  s.addText('github.com/kewinzaq1/first-breath  ·  built with Bright Data SERP API · Apple\'s public review feed · Claude', { x: 0.8, y: 4.8, w: 8.4, h: 0.3, fontFace: MONO, fontSize: 8.5, color: FAINT, align: 'center', margin: 0 });
}

p.writeFile({ fileName: require('path').join(__dirname, 'first-breath-how-it-works.pptx') }).then(f => console.log('wrote', f));
