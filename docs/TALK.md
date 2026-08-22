# Moment — 5-minute talk

Total: 5:00. Spoken ≈ 3:40 · live Moment 1:00 · buffer 0:20.
Slides in `first-breath-how-it-works.pptx`; switch to the page at slide 9.

---

## 0:00 — Slide 1 · Title (20 s)

I teach meditation. And I have a problem with meditation apps — not the meditation, the apps. Tonight: one hypothesis, and how I used Bright Data to try to break it before I pitched it to anyone.

## 0:20 — Slide 2 · The hypothesis (45 s)

Two things are broken.

One: the apps overwhelm you. Ten thousand apps, forty-day challenges, a guru for every mood. The thing that promised peace became one more marketplace to keep up with.

Two — and this is the one I care about: the calm never leaves the session. You sit for twenty minutes, you feel present. Then the day happens. Same snap at the same message. Same second plate. Same midnight scroll. Practice stayed on the cushion. Life didn't.

So I built Moment. One sentence about how you want to move through today. A pause every thirty minutes. One minute to breathe and choose again. Meditation *inside* the day, not beside it.

That was the bet. A bet is not a business.

## 1:05 — Slide 3 · Method (30 s)

So I asked the web to prove me wrong. One Node script, wired to Bright Data. Three sources: 450 app-store reviews of Calm, Headspace and Waking Up; 30 threads from r/Meditation; and a hundred search results from twelve queries — **four of which were written to refute me**: does practice actually carry over? Does this product already exist?

Rules: every quote verbatim, every percentage computed, every source credited by the path that actually served it.

## 1:35 — Slide 4 · H1 holds (25 s)

First half: overwhelm. 210 negative reviews, classified. 48% are billing rage. 20% are choice overload. Zero ask for more content. One user literally requests a button that picks a session at random "to reduce decision fatigue." People aren't asking for more. They're asking to be left alone.

## 2:00 — Slide 5 · H2 holds (35 s)

Second half: the gap. r/Meditation, in their own words. Someone meditating daily for a year: *"when another same trigger arose, I was still reactive."* Someone two years in, 151 upvotes: *"still dealing with intrusive thoughts, anxiety."*

And then the community prescribes the fix itself: *"to change your behavior, you need to bring your meditative mindset into daily life — in the act of making decisions."* That's Moment's sentence, written by a stranger.

Honest caveat: not everyone. Some long-term meditators say they are less reactive. The gap is real for the people who are asking — and they are the market.

## 2:35 — Slide 6 · The pushback (35 s)

Here's the part I didn't want to find. The interrupt is not new. Mindfulness Bell, MindBell, Chill, Remindfulness — bells all day. There is an app called One-Moment Meditation — a registered trademark — one minute, with reminders. And Insight Timer owns the search for "one minute meditation reminder app."

So the web told me: Moment cannot be "a reminder app." The bell is taken. The minute is taken.

But one thread — r/selfimprovement: *"How to remember my set intention for the day? 23 minutes later I'm in the thick of it."* Nobody in a hundred results does that. The intention is not taken.

## 3:10 — Slide 7 · The fix (25 s)

The data didn't confirm my product. It sharpened it. Moment is not the bell — it's the sentence the bell hands back to you. You write it once at seven. You meet it again at nine, nine-thirty, ten — in the act of deciding. No library, no streak, no course. One intention. One minute.

## 3:35 — Slide 8 · How (15 s)

How: Bright Data's SERP API for search and for reddit — the only path that works without KYC. Web Unlocker tried first; Apple and reddit are gated, so the run fell back to Apple's public feed and says so on the page. Claude distills it into one JSON. That JSON is injected into a single HTML file — the proof *is* the pitch.

## 3:50 — Switch to the page · Slide 9 (1:10)

[Open the artifact, scroll to the last scene.]

This is the page. Same quotes, same numbers you just saw. And it ends with the product. Everyone — one sentence: how do you want to move through the rest of tonight?

[Type one. Press Begin. Breathe with the room for 60 seconds. Say nothing. When the sentence comes back mid-minute, let them see it.]

## 5:00 — Close (10 s)

"Now choose again." That's Moment. Stop defending your idea — let the web try to break it. moment.szlezingier.com. Thank you.

---

### If you're running long
Cut slide 8 entirely (say one line: "SERP API, public review feed, Claude, one HTML file") and the H2 caveat. Never cut the minute.

### If asked
- **"Why not Web Unlocker for reviews?"** Apple hosts and reddit are policy-gated without KYC on my zone. The collector tracks which path served and the page credits it honestly — that honesty is the point of the project.
- **"Isn't this just a mindfulness bell?"** That's exactly what the data asked. The bell rings; Moment hands you *your* sentence. The unmet search is "how do I remember my intention," not "remind me to breathe."
- **"The name?"** One-Moment Meditation® exists — found by this research. Naming is on the list.
