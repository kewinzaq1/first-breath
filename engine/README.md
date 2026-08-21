# engine

The research pipeline: collect (Bright Data) → analyze (Claude) → inject (page).

```bash
npm install
cp .env.example .env            # BRIGHTDATA_API_TOKEN, zone names, ANTHROPIC_API_KEY
node src/run.js                 # full pipeline (.env auto-loaded — no flag needed)
node src/run.js --collect-only  # Bright Data side only
```

See the repo root [README](../README.md) for the full quickstart, [SPEC.md](../SPEC.md) for the data contract, and [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) for how each module works.
