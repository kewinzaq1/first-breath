# engine

The Moment research pipeline: collect (Bright Data) → analyze (a coding agent, or the Anthropic API when it has credits) → inject (page).

```bash
npm install
cp .env.example .env            # BRIGHTDATA_API_TOKEN + zone names (.env is auto-loaded by src/loadenv.js)

node src/run.js --collect-only  # App Store feed + reddit-via-SERP + 5 landscape queries → out/corpus.json
node src/question.js            # 12 hypothesis queries (gap / want / competition)        → out/moment-serp.json
node src/play.js                # Google Play reviews via the Web Scraper API             → out/play-reviews.json
node src/clusters.js            # the cluster method, reproduced from the corpora
node src/verify.js              # quotes verbatim · clusters computed · page blob in sync · counts match
node src/run.js --inject-only   # out/research.json → ../page/index.html
node src/ask.js "<query>"       # the live step: one SERP call, printed for a room
```

See the repo root [README](../README.md) for the story, [SPEC.md](../SPEC.md) for the data contract, and [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) for how each module works.
