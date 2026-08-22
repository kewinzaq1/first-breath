// Hypothesis check for Moment: does meditation practice fail to carry into daily life,
// and is anyone already solving that? Deliberately includes queries that could REFUTE it.
//   node src/question.js  → out/moment-serp.json
import './loadenv.js';
import { serp } from './brightdata.js';
import { writeFile, mkdir } from 'node:fs/promises';

const QUERIES = {
  // H2 · the gap: calm in the session, reactive in life
  gap: [
    'meditate every day but still reactive',
    'meditation doesn\'t carry over into daily life',
    'calm during meditation but anxious the rest of the day',
    'site:reddit.com/r/Meditation still reactive after years of meditation',
    'site:reddit.com/r/Meditation meditation not changing my behavior',
    'meditation not helping with overeating or scrolling',
  ],
  // what people ask for: practice inside the day
  want: [
    'how to stay mindful throughout the day',
    'site:reddit.com/r/Meditation how to bring mindfulness into daily life',
    'set an intention for the day and get reminded',
  ],
  // refutation: does this already exist?
  competition: [
    'mindfulness reminder app throughout the day',
    'mindfulness bell app random reminders',
    'one minute meditation reminder app',
  ],
};

await mkdir('out', { recursive: true });
const rows = [];
for (const [bucket, qs] of Object.entries(QUERIES)) {
  for (const q of qs) {
    try {
      const data = await serp(q);
      const organic = (data.organic ?? []).slice(0, 8).map((r, i) => ({ bucket, query: q, rank: r.rank ?? i + 1, title: r.title, link: r.link, snippet: (r.description ?? '').slice(0, 400) }));
      const related = (data.related ?? []).map((r) => r.text ?? r.query).filter(Boolean);
      const paa = (data.people_also_ask ?? []).map((r) => r.question ?? r.text).filter(Boolean);
      rows.push(...organic, { bucket, query: q, related, people_also_ask: paa });
      console.log(`  ✓ [${bucket}] ${q} — ${organic.length} results`);
    } catch (err) { console.warn(`  ! ${q}: ${err.message}`); }
  }
}
await writeFile('out/moment-serp.json', JSON.stringify({ collected: new Date().toISOString().slice(0, 10), rows }, null, 2));
console.log(`→ out/moment-serp.json (${rows.length} rows)`);
