// Distill the raw corpus into the exact JSON shape the landing page renders.
// One Claude call: cluster pain points, pick verbatim receipts, name the gap.
//
// No API credits? run.js catches the failure and writes the same prompt to
// out/analysis-prompt.md — paste it into Claude (claude.ai), save the JSON
// reply as out/research.json, then run `node src/run.js --inject-only`.

const SHAPE = `{
  "sources": [
    { "api": "Web Scraper API", "what": "<N> app-store reviews, structured", "from": "calm · headspace · waking up" },
    { "api": "Crawl API", "what": "<N> forum threads on starting — and quitting", "from": "r/meditation · r/getdisciplined" },
    { "api": "SERP API", "what": "<N> search results for how beginners actually ask", "from": "<most telling query, in quotes>" }
  ],
  "quotes": [
    { "text": "<verbatim quote, lightly trimmed, no invention>", "src": "app-store review · via web scraper api" }
  ],
  "clusters": [
    { "pct": "<NN>%", "label": "<2-4 word pain-point name>", "of": "of negative signal" }
  ],
  "insights": ["<3-5 one-line GTM insights: positioning, messaging language, SERP gaps>"]
}`;

export function buildPrompt({ reviews, threads, serpRows }) {
  // Keep the prompt lean: negative reviews carry the signal.
  const negReviews = reviews.filter((r) => r.rating <= 3).slice(0, 120);
  const corpus = {
    negative_reviews: negReviews,
    review_totals: { all: reviews.length, negative: negReviews.length },
    reddit_threads: threads.slice(0, 60),
    serp: serpRows.slice(0, 60),
  };

  return `You are a GTM researcher for "First Breath" — a pragmatic meditation product
(one timer, count your breaths, nothing else). Below is real market data collected
via Bright Data: negative app-store reviews of incumbent meditation apps, Reddit
threads about starting/quitting meditation, and Google SERP rows for beginner queries.

Analyze it and return ONLY valid JSON in exactly this shape (no markdown fences, no commentary):

${SHAPE}

Rules:
- "quotes": pick the 4 most vivid VERBATIM lines (from reviews or reddit) that support
  pragmatic simplicity. Never invent or paraphrase; light trimming with … is fine.
  Set "src" to "app-store review · via web scraper api" or "r/<sub> · via crawl api".
- "clusters": exactly 3, percentages computed from the negative signal you actually see,
  rounded to whole numbers (they need not sum to 100).
- "sources": fill <N> with the real counts: ${reviews.length} reviews, ${threads.length} threads, ${serpRows.length} SERP rows.
- "insights": concrete and specific to this data, not generic advice.
- If a source is empty, keep its card but say "0" honestly and lean on the others.

DATA:
${JSON.stringify(corpus)}`;
}

export function parseAnalysis(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error(`No JSON in analysis response:\n${text.slice(0, 300)}`);
  return JSON.parse(text.slice(start, end + 1));
}

export async function analyze(data) {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic(); // uses ANTHROPIC_API_KEY
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5';

  const msg = await client.messages.create({
    model,
    max_tokens: 3000,
    messages: [{ role: 'user', content: buildPrompt(data) }],
  });

  const text = msg.content.map((b) => (b.type === 'text' ? b.text : '')).join('');
  return parseAnalysis(text);
}
