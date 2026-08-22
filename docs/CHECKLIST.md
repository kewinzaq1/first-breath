# Pre-stage checklist — Aug 22, 2026

Run top to bottom, ~5 minutes. Terminal font ≥ 18 pt (Terminal → Settings → Profiles → Font).

1. **Unpin the old artifact version** (only Kew can): open https://claude.ai/code/artifact/9771a3f5-ac0a-4d4d-8101-293b0aa82f15 → version picker → unpin, so viewers get "demo-day: three APIs, computed clusters". Reload and check the hero subline reads *"Twenty minutes of calm on the cushion…"* and the clusters read 52 / 17 / 16.
2. `cd ~/Documents/first-breath/engine && node src/verify.js` → "All green".
3. `node src/ask.js "how to remember my intention for the day"` in a **fresh** terminal window → `(env loaded from …/engine/.env)` and 8 organic results. Retries printing is normal; five failures falls back to the cached answer.
4. `node src/ask.js --cached "how to remember my intention for the day"` → prints the same #1 result labelled CACHED (this is the wifi-dies path).
5. `open -a "Microsoft PowerPoint" ~/Documents/first-breath/docs/first-breath-how-it-works.pptx` → slide 1, presenter view off, mirror the projector.
6. Open the artifact URL in Brave, full screen, scrolled to scene 1 (the orb). Keyboard on the table: in the last scene `Enter` starts the Moment, `Escape` aborts.
7. Offline pack present: `ls ~/Documents/first-breath/docs/stage/` → slide-01…10.png, deck.pdf, ask-output.png, page-final-scene-*.png, page-reveal.png.
8. Laptop: Do Not Disturb on, display sleep off, wifi joined, battery > 50 %.
9. Phone timer set to 4:40, face up, silent.
10. Water. First line: *"Twenty minutes of calm on the cushion. Then the day happens — and you snap at your kid anyway."*
