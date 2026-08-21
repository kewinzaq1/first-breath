const pptxgen = require('pptxgenjs');
const p = new pptxgen();
p.layout = 'LAYOUT_16x9'; // 10 x 5.625
const G='0C0A08', GD='070605', S='161210', INK='EDE4D7', MUTED='93867A', FAINT='4A423A', EMBER='D9954A', EMBERD='8A5F30', DATA='6E9BD1', DATAD='3D5573';
const DISP='Cambria', BODY='Calibri', MONO='Courier New';
const bg = (s, c=G) => s.background = { color: c };
const eyebrow = (s, t, x, y, w, color=MUTED) => s.addText(t.toUpperCase(), { x, y, w, h: 0.3, fontFace: MONO, fontSize: 9, color, charSpacing: 1.5, margin: 0 });
const orb = (s, x, y, d) => { s.addShape(p.ShapeType.ellipse, { x: x-d*0.35, y: y-d*0.35, w: d*1.7, h: d*1.7, fill: { color: EMBER, transparency: 93 }, line: { width: 0 } }); s.addShape(p.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: EMBER }, line: { width: 0 } }); };

// 1 · title
{ const s = p.addSlide(); bg(s, G);
  orb(s, 4.5, 1.05, 1.0);
  s.addText('First Breath', { x: 0.5, y: 2.35, w: 9, h: 1.0, fontFace: DISP, fontSize: 48, color: INK, align: 'center', margin: 0 });
  s.addText('How it works — a go-to-market story told by the web itself', { x: 1, y: 3.35, w: 8, h: 0.5, fontFace: BODY, fontSize: 16, color: MUTED, align: 'center', margin: 0 });
  s.addText('BRIGHT DATA GTM EVENT · AUG 22, 2026 · KEW', { x: 1, y: 4.9, w: 8, h: 0.3, fontFace: MONO, fontSize: 9, color: FAINT, align: 'center', charSpacing: 1.5, margin: 0 });
  s.addNotes('Open on the page itself if possible; this deck is the "how it was made" companion.');
}

// 2 · the idea
{ const s = p.addSlide(); bg(s, G);
  eyebrow(s, 'the idea in one breath', 0.6, 0.5, 6);
  s.addText('Instead of guessing what beginners want from meditation, I asked the web — then built only what it asked for.', { x: 0.6, y: 0.9, w: 8.8, h: 1.3, fontFace: DISP, fontSize: 26, color: INK, margin: 0 });
  const steps = [
    ['The problem', 'Beginners don\'t fail at meditating. They fail at choosing how to start — 500-session libraries, paywalls, streaks.', MUTED],
    ['The research', 'One Node.js agent collects real reviews, threads and searches, and distills them into a tiny research object.', DATA],
    ['The page', 'A scroll-based story where every quote and percentage is verbatim from that corpus. The page is the pitch.', DATA],
    ['The product', 'A ten-breath timer at the end. The audience meditates together. That\'s the whole product.', EMBER],
  ];
  steps.forEach(([h, t, c], i) => { const x = 0.6 + i * 2.25;
    s.addShape(p.ShapeType.rect, { x, y: 2.55, w: 2.05, h: 2.15, fill: { color: S }, line: { width: 0 } });
    s.addShape(p.ShapeType.ellipse, { x: x + 0.2, y: 2.75, w: 0.18, h: 0.18, fill: { color: c }, line: { width: 0 } });
    s.addText(h, { x: x + 0.2, y: 3.05, w: 1.7, h: 0.4, fontFace: DISP, fontSize: 15, color: INK, margin: 0 });
    s.addText(t, { x: x + 0.2, y: 3.45, w: 1.7, h: 1.5, fontFace: BODY, fontSize: 10.5, color: MUTED, margin: 0, valign: 'top' });
  });
}

// 3 · pipeline
{ const s = p.addSlide(); bg(s, GD);
  eyebrow(s, 'architecture · one command, no build step', 0.6, 0.5, 8, DATA);
  s.addText('node src/run.js', { x: 0.6, y: 0.85, w: 8, h: 0.5, fontFace: MONO, fontSize: 22, color: INK, margin: 0 });
  const boxes = [
    ['Bright Data', 'SERP API · Web Unlocker\n(zones via /request)', DATA],
    ['collect.js', '3 fan-outs,\neach with a fallback', DATA],
    ['corpus.json', '450 reviews · 30 threads\n· 42 SERP rows', DATA],
    ['analyze', 'Claude distills clusters,\nverbatim quotes, insights', DATA],
    ['research.json', 'sources · quotes · clusters\n(frozen contract)', EMBER],
    ['page/index.html', 'blob injected by regex;\none self-contained file', EMBER],
  ];
  boxes.forEach(([h, t, c], i) => { const col = i % 3, row = Math.floor(i / 3); const x = 0.6 + col * 3.05, y = 1.75 + row * 1.75;
    s.addShape(p.ShapeType.rect, { x, y, w: 2.7, h: 1.35, fill: { color: S }, line: { color: c, width: 0.75 } });
    s.addText(h, { x: x + 0.2, y: y + 0.15, w: 2.4, h: 0.4, fontFace: MONO, fontSize: 12, color: c, bold: true, margin: 0 });
    s.addText(t, { x: x + 0.2, y: y + 0.55, w: 2.4, h: 0.7, fontFace: BODY, fontSize: 10.5, color: MUTED, margin: 0, valign: 'top' });
    if (col < 2) s.addText('→', { x: x + 2.7, y: y + 0.45, w: 0.35, h: 0.4, fontFace: BODY, fontSize: 18, color: FAINT, align: 'center', margin: 0 });
  });
  s.addText('↓', { x: 8.3, y: 3.1, w: 0.4, h: 0.4, fontFace: BODY, fontSize: 18, color: FAINT, align: 'center', margin: 0 });
  s.addText('Blue = the machine voice (APIs, counts). Ember = the human voice (the story). The reveal scene is where blue evidence resolves into amber conclusions.', { x: 0.6, y: 5.05, w: 8.8, h: 0.35, fontFace: BODY, fontSize: 10, color: FAINT, italic: true, margin: 0 });
}

// 4 · sources
{ const s = p.addSlide(); bg(s, G);
  eyebrow(s, 'what was collected · aug 21, 2026', 0.6, 0.5, 8, DATA);
  s.addText('Three places where people tell the truth about meditation apps.', { x: 0.6, y: 0.85, w: 8.8, h: 0.8, fontFace: DISP, fontSize: 24, color: INK, margin: 0 });
  const src = [
    ['App Store review feed · public API', '450 reviews — 210 of them negative', 'Calm · Headspace · Waking Up. Apple\'s feed is KYC-gated on Web Unlocker, so the collector fell back to the public API. Credited honestly.'],
    ['SERP API · Bright Data', '30 community threads on starting — and quitting', 'r/Meditation · r/getdisciplined, mined as site: searches (reddit itself is KYC-gated without residential access).'],
    ['SERP API · Bright Data', '42 search results for how beginners actually ask', '"how to start meditating without an app", "why can\'t I stick with meditation", "simple breathing exercise timer"…'],
  ];
  src.forEach(([api, what, from], i) => { const y = 1.85 + i * 1.15;
    s.addShape(p.ShapeType.rect, { x: 0.6, y, w: 8.8, h: 1.0, fill: { color: S }, line: { width: 0 } });
    s.addText(api.toUpperCase(), { x: 0.85, y: y + 0.12, w: 8.3, h: 0.25, fontFace: MONO, fontSize: 8.5, color: DATA, charSpacing: 1, margin: 0 });
    s.addText(what, { x: 0.85, y: y + 0.37, w: 8.3, h: 0.3, fontFace: BODY, fontSize: 14, color: INK, margin: 0 });
    s.addText(from, { x: 0.85, y: y + 0.65, w: 8.3, h: 0.3, fontFace: BODY, fontSize: 9.5, color: MUTED, margin: 0 });
  });
}

// 5 · what came back (chart)
{ const s = p.addSlide(); bg(s, GD);
  eyebrow(s, 'what came back · 210 negative reviews', 0.6, 0.5, 8, DATA);
  s.addText('Thousands of strangers. One message.', { x: 0.6, y: 0.85, w: 8.8, h: 0.6, fontFace: DISP, fontSize: 24, color: INK, margin: 0 });
  s.addChart(p.ChartType.bar, [{ name: 'Share of negative reviews', labels: ['Lost simplicity', 'Choice overload', 'Paywall fatigue'], values: [14, 20, 48] }], {
    x: 0.5, y: 1.55, w: 5.4, h: 3.5, barDir: 'bar', chartColors: [EMBER], showLegend: false, showTitle: false,
    showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0"%"', dataLabelColor: INK, dataLabelFontFace: MONO, dataLabelFontSize: 12,
    catAxisLabelColor: INK, catAxisLabelFontFace: DISP, catAxisLabelFontSize: 12, catGridLine: { style: 'none' }, catAxisLineShow: false,
    valAxisHidden: true, valGridLine: { style: 'none' }, valAxisMaxVal: 60, barGapWidthPct: 60,
  });
  s.addText([
    { text: 'How the numbers were made\n', options: { fontFace: DISP, fontSize: 14, color: INK, breakLine: true } },
    { text: 'Keyword-class share of the 210 negative reviews, computed from corpus.json. Recorded in research.json.meta so it can be re-run.\n\n', options: { fontFace: BODY, fontSize: 11, color: MUTED, breakLine: true } },
    { text: 'The SERP gap\n', options: { fontFace: DISP, fontSize: 14, color: INK, breakLine: true } },
    { text: '9 results for "how to start meditating without an app": reddit, blogs, a Facebook group, Quora. Not one of them is a timer.', options: { fontFace: BODY, fontSize: 11, color: MUTED } },
  ], { x: 6.1, y: 1.7, w: 3.3, h: 3.3, margin: 0, valign: 'top' });
}

// 6 · quotes
{ const s = p.addSlide(); bg(s, G);
  eyebrow(s, 'verbatim · nothing paraphrased', 0.6, 0.5, 8, DATA);
  s.addText('“The idea that we now need to pay a $70 yearly subscription for a timer is embarrassingly greedy.”', { x: 0.8, y: 1.1, w: 8.4, h: 1.5, fontFace: DISP, fontSize: 26, italic: true, color: DATA, align: 'center', margin: 0 });
  s.addText('R/MEDITATION · VIA BRIGHT DATA SERP', { x: 0.8, y: 2.6, w: 8.4, h: 0.3, fontFace: MONO, fontSize: 8.5, color: DATAD, align: 'center', charSpacing: 1, margin: 0 });
  const qs = [
    ['“Congrats instead of lowering my heart rate I have increased my rage.”', 'HEADSPACE · APP-STORE REVIEW'],
    ['“Now I just feel overwhelmed with the amount of content. A feature that randomly selects a session would reduce decision fatigue.”', 'HEADSPACE · APP-STORE REVIEW'],
    ['“It was and should be a simple app following the idea itself.”', 'HEADSPACE · APP-STORE REVIEW'],
  ];
  qs.forEach(([t, c], i) => { const x = 0.6 + i * 3.0;
    s.addText(t, { x, y: 3.3, w: 2.8, h: 1.3, fontFace: DISP, fontSize: 12, italic: true, color: DATA, margin: 0, valign: 'top' });
    s.addText(c, { x, y: 4.65, w: 2.8, h: 0.25, fontFace: MONO, fontSize: 7.5, color: DATAD, charSpacing: 0.8, margin: 0 });
  });
}

// 7 · integrity + resilience
{ const s = p.addSlide(); bg(s, GD);
  eyebrow(s, 'the rules that make it trustworthy', 0.6, 0.5, 8);
  s.addText('Real data is only a weapon if it stays real.', { x: 0.6, y: 0.85, w: 8.8, h: 0.6, fontFace: DISP, fontSize: 24, color: INK, margin: 0 });
  const rules = [
    ['Verbatim or nothing', 'Every quote on the page is copied from corpus.json. Light “…” trimming only.'],
    ['Computed, never typed', 'Cluster percentages come from the corpus; the method is recorded alongside the result.'],
    ['Honest attribution', 'collect.js tracks unlocker-vs-direct for every fetch. The page credits whichever path actually served.'],
    ['A fallback for every source', 'Unlocker → direct fetch for public APIs; reddit → site: search through SERP. A zone restriction never zeroes a source.'],
    ['Degrades without an LLM', 'No API credits? The engine writes the analysis prompt to a file; paste into Claude, save the JSON, --inject-only.'],
    ['One file, no build', 'The page is a single HTML file — the artifact, the deliverable and the pitch are the same thing.'],
  ];
  rules.forEach(([h, t], i) => { const col = i % 2, row = Math.floor(i / 2); const x = 0.6 + col * 4.5, y = 1.7 + row * 1.2;
    s.addShape(p.ShapeType.ellipse, { x, y: y + 0.07, w: 0.14, h: 0.14, fill: { color: EMBER }, line: { width: 0 } });
    s.addText(h, { x: x + 0.3, y, w: 3.9, h: 0.3, fontFace: DISP, fontSize: 14, color: INK, margin: 0 });
    s.addText(t, { x: x + 0.3, y: y + 0.32, w: 3.9, h: 0.8, fontFace: BODY, fontSize: 10.5, color: MUTED, margin: 0, valign: 'top' });
  });
}

// 8 · close
{ const s = p.addSlide(); bg(s, GD);
  orb(s, 4.45, 0.55, 1.1);
  s.addText('The data didn\'t give me a product.\nIt gave me permission.', { x: 0.8, y: 2.5, w: 8.4, h: 1.2, fontFace: DISP, fontSize: 28, color: INK, align: 'center', margin: 0 });
  s.addText('One timer. Counted breaths. Nothing else.', { x: 0.8, y: 3.7, w: 8.4, h: 0.5, fontFace: DISP, fontSize: 18, italic: true, color: EMBER, align: 'center', margin: 0 });
  s.addText('github.com/kewinzaq1/first-breath  ·  built with Bright Data SERP API · Apple\'s public review feed · Claude', { x: 0.8, y: 4.8, w: 8.4, h: 0.3, fontFace: MONO, fontSize: 8.5, color: FAINT, align: 'center', margin: 0 });
  s.addNotes('Switch back to the live page and run the ten-breath timer with the room.');
}

p.writeFile({ fileName: '/Users/kewin/Documents/first-breath/docs/first-breath-how-it-works.pptx' }).then(f => console.log('wrote', f));
