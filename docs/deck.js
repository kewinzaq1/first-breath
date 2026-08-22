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

// 1 · TITLE
{ const s = p.addSlide(); bg(s, G);
  orb(s, 4.5, 1.0, 1.0);
  s.addText('Moment', { x: 0.5, y: 2.3, w: 9, h: 1.0, fontFace: DISP, fontSize: 48, color: INK, align: 'center', margin: 0 });
  s.addText('I had a hypothesis. I asked the web to break it.', { x: 1, y: 3.3, w: 8, h: 0.5, fontFace: DISP, fontSize: 20, italic: true, color: EMBER, align: 'center', margin: 0 });
  s.addText('Meditation inside the day, not beside it — and what Bright Data said about that', { x: 1.5, y: 3.85, w: 7, h: 0.6, fontFace: BODY, fontSize: 13, color: MUTED, align: 'center', margin: 0 });
  s.addText('BRIGHT DATA GTM EVENT · AUG 22, 2026 · KEW · MOMENT.SZLEZINGIER.COM', { x: 1, y: 4.9, w: 8, h: 0.3, fontFace: MONO, fontSize: 9, color: FAINT, align: 'center', charSpacing: 1.5, margin: 0 });
  s.addNotes('Open with the pain in one breath: you meditate, you feel calm, then you snap at the same message. Then: I built Moment for that — and before pitching it, I tried to prove myself wrong.');
}

// 2 · THE PAIN + HYPOTHESIS
{ const s = p.addSlide(); bg(s, G); chapter(s, 'HYPOTHESIS');
  eyebrow(s, 'the pain · what I believed', 0.6, 0.5, 6);
  title(s, 'Two things are broken. Meditation apps overwhelm you. And the calm never leaves the session.', 0.85, 24, 1.1);
  const cols = [
    ['H1 · Overwhelm', 'Ten thousand apps. Forty-day challenges. A guru for every mood. The product that promised peace became one more marketplace to keep up with.', DATA],
    ['H2 · The gap', 'Calm for twenty minutes on the cushion — then the same snap, the same second plate, the same midnight scroll. The practice stays in the session. Life doesn\'t.', DATA],
    ['The bet · Moment', 'One sentence about how you want to move through today. A pause every thirty minutes. One minute to breathe and choose again. Meditation inside the day.', EMBER],
  ];
  cols.forEach(([h, t, c], i) => { const x = 0.6 + i * 3.0;
    s.addShape(p.ShapeType.rect, { x, y: 2.25, w: 2.8, h: 2.05, fill: { color: S }, line: { color: c, width: i === 2 ? 0.75 : 0 } });
    s.addText(h, { x: x + 0.25, y: 2.45, w: 2.4, h: 0.4, fontFace: DISP, fontSize: 15, color: c, margin: 0 });
    s.addText(t, { x: x + 0.25, y: 2.9, w: 2.4, h: 1.35, fontFace: BODY, fontSize: 10.5, color: MUTED, margin: 0, valign: 'top' });
  });
  s.addText('That was the bet. A bet is not a business — so before telling anyone, I tried to break it.', { x: 0.6, y: 4.6, w: 8.8, h: 0.5, fontFace: DISP, fontSize: 14, italic: true, color: INK, margin: 0 });
}

// 3 · THE METHOD — queries written to refute
{ const s = p.addSlide(); bg(s, GD); chapter(s, 'METHOD');
  eyebrow(s, 'the question · can the web prove me wrong?', 0.6, 0.5, 7, DATA);
  title(s, 'Three sources. Twelve questions — half of them written to refute the hypothesis.', 0.85, 24, 1.0);
  const src = [
    ['450 app-store reviews', 'Calm · Headspace · Waking Up — 210 negative. Tests H1.'],
    ['30 community threads', 'r/Meditation · r/getdisciplined — starting, quitting, sticking.'],
    ['104 search results · 12 queries', '“meditate every day but still reactive” · “meditation doesn\'t carry over into daily life” · “mindfulness bell app” · “one minute meditation reminder app”'],
  ];
  src.forEach(([h, t], i) => { const y = 2.0 + i * 0.95;
    s.addShape(p.ShapeType.rect, { x: 0.6, y, w: 5.4, h: 0.82, fill: { color: S }, line: { width: 0 } });
    s.addText(h, { x: 0.8, y: y + 0.1, w: 5.0, h: 0.3, fontFace: MONO, fontSize: 11, color: DATA, bold: true, margin: 0 });
    s.addText(t, { x: 0.8, y: y + 0.4, w: 5.0, h: 0.4, fontFace: BODY, fontSize: 9.5, color: MUTED, margin: 0, valign: 'top' });
  });
  s.addText([
    { text: 'Why refuting queries?\n', options: { fontFace: DISP, fontSize: 14, color: INK, breakLine: true } },
    { text: 'If I only searched for people who agree with me, the web would happily agree. So four of the twelve queries looked for the opposite: people saying meditation does carry over, and products that already do what Moment does.\n\n', options: { fontFace: BODY, fontSize: 11, color: MUTED, breakLine: true } },
    { text: 'Rules\n', options: { fontFace: DISP, fontSize: 14, color: INK, breakLine: true } },
    { text: 'Every quote verbatim. Every percentage computed. Every source credited by the path that actually served it.', options: { fontFace: BODY, fontSize: 11, color: MUTED } },
  ], { x: 6.3, y: 2.0, w: 3.1, h: 2.9, margin: 0, valign: 'top' });
  s.addText('Bright Data SERP API + Apple\'s public review feed · Aug 21–22, 2026', { x: 0.6, y: 5.0, w: 8.8, h: 0.3, fontFace: MONO, fontSize: 8.5, color: FAINT, margin: 0 });
}

// 4 · H1 HOLDS
{ const s = p.addSlide(); bg(s, G); chapter(s, 'H1 · HOLDS');
  eyebrow(s, 'result · overwhelm · 210 negative reviews, classified', 0.6, 0.5, 7, DATA);
  title(s, 'H1 holds. People are not asking for more. They are asking for less — and to be left alone.', 0.85, 24, 1.0);
  s.addChart(p.ChartType.bar, [{ name: 'Share of negative reviews', labels: ['Lost simplicity', 'Choice overload', 'Paywall fatigue'], values: [14, 20, 48] }], {
    x: 0.5, y: 1.9, w: 5.0, h: 3.0, barDir: 'bar', chartColors: [EMBER], showLegend: false, showTitle: false,
    showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0"%"', dataLabelColor: INK, dataLabelFontFace: MONO, dataLabelFontSize: 12,
    catAxisLabelColor: INK, catAxisLabelFontFace: DISP, catAxisLabelFontSize: 12, catGridLine: { style: 'none' }, catAxisLineShow: false,
    valAxisHidden: true, valGridLine: { style: 'none' }, valAxisMaxVal: 60, barGapWidthPct: 60,
  });
  quote(s, 'Now I just feel overwhelmed with the amount of content. A feature that randomly selects a session would reduce decision fatigue.', 'headspace · app-store review', 5.9, 1.95, 3.5, 12, 1.05);
  quote(s, 'There\'s constant notifications and pop-ups to engage with their AI chat bot Ebb that you cannot turn off.', 'headspace · app-store review', 5.9, 3.5, 3.5, 12, 0.85);
  s.addText('Method: keyword-class share of the 210 negative reviews, computed from the corpus and recorded with the result.', { x: 0.6, y: 5.0, w: 8.8, h: 0.3, fontFace: MONO, fontSize: 8, color: FAINT, margin: 0 });
}

// 5 · H2 HOLDS
{ const s = p.addSlide(); bg(s, GD); chapter(s, 'H2 · HOLDS');
  eyebrow(s, 'result · the gap · r/meditation, in their own words', 0.6, 0.5, 7, DATA);
  title(s, 'H2 holds — for the people it fails. And they prescribe the bridge themselves.', 0.85, 24, 1.0);
  quote(s, 'meditation helps me identify when I am not being present, However, when another same trigger arose, I was still reactive.', 'r/meditation · via bright data serp', 0.6, 2.0, 2.7, 13, 1.5);
  quote(s, 'It\'s been 2years already into meditation. I am still dealing with intrusive thoughts, anxiety.', 'r/meditation · 151 votes', 3.65, 2.0, 2.7, 13, 1.5);
  quote(s, 'In order to change your behavior, you need to begin to bring your meditative mindset into daily life when you are in the act of making decisions…', 'r/meditation · via bright data serp', 6.7, 2.0, 2.7, 13, 1.5);
  s.addText('Honest caveat: not universal. Some long-term meditators report being less reactive. The gap is real for the people who are asking — and they are the market.', { x: 0.6, y: 4.45, w: 8.8, h: 0.6, fontFace: DISP, fontSize: 13, italic: true, color: INK, margin: 0 });
}

// 6 · THE PUSHBACK
{ const s = p.addSlide(); bg(s, G); chapter(s, 'PUSHBACK');
  eyebrow(s, 'result · what the web refuted', 0.6, 0.5, 7, DATA);
  title(s, 'The interrupt is not new. The minute is not new. Moment cannot be “a reminder app”.', 0.85, 24, 1.0);
  const comp = [
    ['Mindfulness Bell', 'interval or random bells, all day'],
    ['MindBell · Chill · Remindfulness', 'reminder apps, quotes, gentle pings'],
    ['One-Moment Meditation®', 'a one-minute exercise + reminders — and a registered mark'],
    ['Insight Timer', 'owns the SERP for “one minute meditation reminder app”'],
  ];
  comp.forEach(([h, t], i) => { const y = 2.0 + i * 0.62;
    s.addShape(p.ShapeType.ellipse, { x: 0.6, y: y + 0.08, w: 0.13, h: 0.13, fill: { color: DATA }, line: { width: 0 } });
    s.addText(h, { x: 0.9, y, w: 2.6, h: 0.3, fontFace: MONO, fontSize: 10.5, color: INK, bold: true, margin: 0 });
    s.addText(t, { x: 3.5, y, w: 2.6, h: 0.55, fontFace: BODY, fontSize: 10, color: MUTED, margin: 0, valign: 'top' });
  });
  s.addShape(p.ShapeType.rect, { x: 6.4, y: 1.95, w: 3.0, h: 2.75, fill: { color: S }, line: { width: 0 } });
  s.addText('WHAT NO RESULT OFFERS', { x: 6.6, y: 2.1, w: 2.7, h: 0.3, fontFace: MONO, fontSize: 8.5, color: EMBER, charSpacing: 1.5, margin: 0 });
  quote(s, 'My morning yoga includes setting an intention for the day… 23 minutes later I\'m in the thick of…', 'r/selfimprovement · via serp', 6.6, 2.45, 2.6, 12, 0.85);
  s.addText('Remembering your own sentence at the moment it matters.', { x: 6.6, y: 3.85, w: 2.6, h: 0.7, fontFace: DISP, fontSize: 13, color: EMBER, margin: 0, valign: 'top' });
  s.addText('The bell is taken. The minute is taken. The intention is not.', { x: 0.6, y: 4.85, w: 8.8, h: 0.4, fontFace: DISP, fontSize: 14, italic: true, color: INK, margin: 0 });
}

// 7 · WHAT'S LEFT STANDING — Moment, sharpened
{ const s = p.addSlide(); bg(s, GD); chapter(s, 'THE FIX');
  eyebrow(s, 'moment · sharpened by the data', 0.6, 0.5, 6);
  title(s, 'The data didn\'t confirm the product. It sharpened it.', 0.85, 26, 0.7);
  const rows = [
    ['Overwhelm — 20% choice overload, 48% billing rage', 'No library. No course. No streak. One sentence and one minute.'],
    ['The gap — calm in the session, reactive in life', 'The pause happens inside the day: every 30 minutes, in the hours you pick.'],
    ['The pushback — bells and minutes already exist', 'Moment is not the bell. It is the sentence the bell hands back to you.'],
    ['The unclaimed job — “how to remember my intention?”', 'Write it once at 7. Meet it again at 9, 9:30, 10… in the act of deciding.'],
  ];
  s.addText('WHAT THE WEB SAID', { x: 0.6, y: 1.7, w: 4, h: 0.25, fontFace: MONO, fontSize: 8.5, color: DATA, charSpacing: 1.5, margin: 0 });
  s.addText('WHAT MOMENT DOES', { x: 5.3, y: 1.7, w: 4, h: 0.25, fontFace: MONO, fontSize: 8.5, color: EMBER, charSpacing: 1.5, margin: 0 });
  rows.forEach(([pain, fix], i) => { const y = 2.05 + i * 0.72;
    s.addText(pain, { x: 0.6, y, w: 3.6, h: 0.6, fontFace: BODY, fontSize: 11.5, color: INK, margin: 0, valign: 'top' });
    s.addText('→', { x: 4.3, y: y + 0.02, w: 0.6, h: 0.35, fontFace: BODY, fontSize: 16, color: FAINT, align: 'center', margin: 0 });
    s.addText(fix, { x: 5.3, y, w: 4.1, h: 0.6, fontFace: BODY, fontSize: 11.5, color: EMBER, margin: 0, valign: 'top' });
  });
  s.addText('One intention. One minute. In the moment it matters.', { x: 0.6, y: 5.0, w: 8.8, h: 0.4, fontFace: DISP, fontSize: 15, italic: true, color: INK, margin: 0 });
}

// 8 · HOW — Bright Data
{ const s = p.addSlide(); bg(s, G); chapter(s, 'HOW');
  eyebrow(s, 'how · one node script, wired to bright data', 0.6, 0.5, 7, DATA);
  s.addText('node src/run.js · node src/question.js', { x: 0.6, y: 0.85, w: 8.8, h: 0.5, fontFace: MONO, fontSize: 20, color: INK, margin: 0 });
  const boxes = [
    ['SERP API', 'Google results as JSON (brd_json=1). Mines reddit via site: searches — the only path that works without KYC. Ran the 12 hypothesis queries.', DATA],
    ['Web Unlocker', 'Tried first for every page. Apple + reddit are policy-gated on this zone, so the run fell back — and says so.', DATA],
    ['Apple review feed', 'Public JSON, fetched directly. 3 apps × 3 pages → 450 reviews.', DATA],
    ['corpus.json · moment-serp.json', '450 reviews · 30 threads · 146 SERP rows across 17 queries. The raw truth.', DATA],
    ['Claude', 'Distills clusters, verbatim quotes, verdicts → research.json. Degrades to a paste-in prompt without API credits.', EMBER],
    ['page/index.html', 'research.json injected into one self-contained file. The proof becomes the pitch — and ends in a live Moment.', EMBER],
  ];
  boxes.forEach(([h, t, c], i) => { const col = i % 3, row = Math.floor(i / 3); const x = 0.6 + col * 3.0, y = 1.55 + row * 1.6;
    s.addShape(p.ShapeType.rect, { x, y, w: 2.8, h: 1.4, fill: { color: S }, line: { color: c, width: 0.75 } });
    s.addText(h, { x: x + 0.2, y: y + 0.12, w: 2.5, h: 0.35, fontFace: MONO, fontSize: 10.5, color: c, bold: true, margin: 0 });
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
  title(s, 'The landing page tells the same story — and ends with one real Moment.', 0.85, 24, 0.9);
  const scenes = [
    ['The noise', 'the app store as a wall of chips', MUTED], ['The hypothesis', 'two things are broken', EMBER],
    ['The ask', 'three sources, queries built to refute', DATA], ['The reveal', 'half held, half pushed back', DATA],
    ['The way', 'one intention, one minute', EMBER], ['One moment', 'write a sentence, breathe 60 s, meet it again', EMBER],
  ];
  scenes.forEach(([h, t, c], i) => { const x = 0.6 + i * 1.5;
    s.addShape(p.ShapeType.ellipse, { x: x + 0.55, y: 2.2, w: 0.22, h: 0.22, fill: { color: c }, line: { width: 0 } });
    if (i < 5) s.addShape(p.ShapeType.line, { x: x + 0.8, y: 2.31, w: 1.25, h: 0, line: { color: FAINT, width: 0.75 } });
    s.addText(h, { x, y: 2.6, w: 1.35, h: 0.35, fontFace: DISP, fontSize: 13, color: INK, align: 'center', margin: 0 });
    s.addText(t, { x, y: 2.95, w: 1.35, h: 0.8, fontFace: BODY, fontSize: 9.5, color: MUTED, align: 'center', margin: 0, valign: 'top' });
  });
  s.addText('Every quote and number on the page is the same research.json you just saw. When the story ends, the room writes one sentence and takes one minute — that is the demo.', { x: 0.6, y: 4.2, w: 8.8, h: 0.8, fontFace: DISP, fontSize: 14, italic: true, color: INK, margin: 0 });
  s.addNotes('Switch to the live page here. Scroll the story, then type an intention and run the one-minute Moment with the room.');
}

// 10 · CLOSE
{ const s = p.addSlide(); bg(s, GD);
  orb(s, 4.45, 0.55, 1.1);
  s.addText('Stop defending your idea.\nLet the web try to break it.', { x: 0.8, y: 2.3, w: 8.4, h: 1.2, fontFace: DISP, fontSize: 28, color: INK, align: 'center', margin: 0 });
  s.addText('Now — one sentence, one minute.', { x: 0.8, y: 3.6, w: 8.4, h: 0.5, fontFace: DISP, fontSize: 18, italic: true, color: EMBER, align: 'center', margin: 0 });
  s.addText('moment.szlezingier.com  ·  github.com/kewinzaq1/first-breath  ·  built with Bright Data SERP API · Apple\'s public review feed · Claude', { x: 0.8, y: 4.8, w: 8.4, h: 0.3, fontFace: MONO, fontSize: 8.5, color: FAINT, align: 'center', margin: 0 });
}

p.writeFile({ fileName: require('path').join(__dirname, 'first-breath-how-it-works.pptx') }).then(f => console.log('wrote', f));
