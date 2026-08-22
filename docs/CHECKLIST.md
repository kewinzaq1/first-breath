# Pre-stage checklist — Aug 22, 2026

Run top to bottom, ~5 minutes. Terminal font ≥ 18 pt (Terminal → Settings → Profiles → Font).

1. **Unpin the old artifact version** (only Kew can): open https://claude.ai/code/artifact/9771a3f5-ac0a-4d4d-8101-293b0aa82f15 → version picker → unpin, so viewers get "prove-me-wrong: verdict fields rendered". Reload and check the hero eyebrow reads *PROVE ME WRONG · THE VERDICT ON MOMENT* and the clusters read 52 / 17 / 16.
2. `cd ~/Documents/first-breath/engine && node src/verify.js` → "All green".
3. `node src/provemewrong.js --quick "Developers want an AI code reviewer that blocks merges" --community reddit.com/r/ExperiencedDevs` in a **fresh** terminal window → `(env loaded from …/engine/.env)`, four bucket lines, a verdict line, under 30 s. Retries printing ("google answered captcha — retry 1") is normal. **This is the live command.** Keep that backup hypothesis on a sticky note in case the room is shy.
4. `node src/ask.js --cached "how to remember my intention for the day"` → prints a cached SERP call labelled CACHED (the wifi-dies path). Slide 9 is the `--quick` fallback.
5. **The show:** `open -a "Brave Browser" ~/Documents/first-breath/docs/show/index.html` → full screen (⌘⇧F), scene 1, press `→` once and `←` back to confirm the keys work, `r` to reset the clock. Script: `docs/SHOW.md`. (The PowerPoint deck is the backup: `open -a "Microsoft PowerPoint" ~/Documents/first-breath/docs/first-breath-how-it-works.pptx`.)
6. Open the artifact URL in Brave, full screen, scrolled to scene 1 (the orb). Keyboard on the table: in the last scene `Enter` starts the Moment, `Escape` aborts.
7. Offline pack present: `ls ~/Documents/first-breath/docs/stage/` → show-scene-1…8.png, slide-01…10.png, deck.pdf, quick-output.png, ask-output.png, page-reveal.png, page-final-scene-*.png. The show itself is one local file — it runs without wifi (system fonts if Google Fonts can't load).
8. Laptop: Do Not Disturb on, display sleep off, wifi joined, battery > 50 %.
9. Phone timer set to 4:40, face up, silent.
10. Water. First line: *"Every founder in this room has shipped a positioning the web could have refuted for five dollars. I built the thing that asks."*
