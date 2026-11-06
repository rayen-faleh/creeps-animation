# Proposal: a "viral-shorts" skill

## What we have and what's missing

- **What we have:**
  - `short-form-horror` (project skill) covers story craft: hooks, open loops, twists, captions, voice, a pre-render checklist.
  - `series/hook-playbook.md` holds the early research.
  - `gothic-pov-style` and `remotion-video-studio` cover the look and the production.
- **What's missing:** nothing tells us how a short is **judged by the platform**, how to **pre-check it for reach**, or how to **learn from each post's numbers**. The Count went viral and The Shroud Eater stalled. We worked out why by hand, and those lessons live only in chat.

**Recommendation:** make a separate project skill, `viral-shorts`, for distribution, data and the post-mortem loop. It should defer to `short-form-horror` for story craft and not repeat it. Pair it with a running **performance log** (`series/performance-log.md`) so every post adds data.

## Proposed contents

### 1. The scoreboard: what Instagram ranks

- **Three signals:** Mosseri's stated top signals are **watch time**, **likes per reach** and **sends per reach**. Sends correlate most with reach to non-followers. These are second-hand reports of his statements, not official documentation.
- **Reading Insights:**
  - **Skip rate:** the share of viewers who leave in the first ~3 s. This tests the hook.
  - **Average watch time ÷ runtime:** how much of the film people saw.
  - **Shares and saves per view:** whether the video gives people something to send or keep.
  - **"How long people watched" graph:** where people leave.
- **How trial reels work:**
  - A trial reel is shown to non-followers first, in a small test batch.
  - It widens only if that batch responds well.
  - Engagement data lands after about 24 h, and Instagram can auto-share a strong one to followers after about 72 h.
  - **Our practice:** post every reel as a trial, then share it to everyone after a couple of hours.
- **Our baseline:** about 1.5k views 2 h after a trial post. A reel stuck near 150 failed its first batch.

### 2. The eligibility gate (before rendering)

- **What gets limited:** content that goes against Instagram's Recommendation Guidelines is still shown to followers but not recommended to non-followers. That kills a trial reel. Repeated hits can make the whole account ineligible.
- **House visual rules, learned from The Shroud Eater:**
  - No on-screen corpses, coffins with bodies, burial close-ups, blood, injury, suffocation or self-harm cues.
  - The monster is implied (breath, weight, hair, light), never drawn.
  - The thumbnail and first frame are calm and mysterious, not grim.
- **Our evidence is limited:** account status was green and the Shroud Eater stall remains unexplained. Treat this gate as a cheap precaution, not a proven cause.
- **When a reel stalls:** check Settings → Account Status → content that can't be recommended.

### 3. The formula that went viral (THE COUNT, 16k+ likes)

| Ingredient | Rule |
| --- | --- |
| Hook | Monster plus a childhood certainty, or an impossible rule, spoken over the most charged image in the first 3 s. |
| Folklore | Real, little-known and testable, with a physical ritual. Our comments show novelty is the draw ("This better be a book", "this is smth NEW"). |
| Elder | A loved, slightly eerie grandparent teaches the rule in candlelight. |
| Skeptic | The adult breaks the rule. The viewer knows it's a mistake, which creates dread. |
| Misdirect | Point at the obvious suspect ("I thought Gran would be the vampire"), then flip it. |
| Twist | Readable on mute, with one quotable line. |
| Ending | The top comment, with 20× the next comment's likes, was "Should've ended at 'the voice was mine'". After the twist: a consequence, an echo and a whisper, and nothing that explains. |

### 4. Timing budget

- **Runtime:** 50–60 s.
- **Twist placement:** the twist lands **before average watch time + 10 s**. As a rule of thumb, aim for 40–45 s, or about 75% of runtime.
  - The Shroud Eater's twist at 53 s missed most viewers (average watch 33 s).
  - The Keyhole moved its twist to 44 s.
- **After the twist:** 10 s or less.
- **Open loops:** a new question every 5–10 s (see `short-form-horror` §3).

### 5. Visual density spec (measured from THE COUNT)

- **Shot length:** median about 2.7 s, about 18–22 shots a minute. Longer shots only for continuous camera moves where something new arrives every 1.5–2 s.
- **Holds:** a still hold may run longer than 2 s only on a reveal (1.0–1.2 s).
- **Action:** one action per shot, done by hands. No faces.
- **Recurring anchor:** for example, the window or the keyhole.
- **Colour-coded timeline:** candle amber for the past, moonlit blue for the present, a cold or torch white for the reveal.
- **Phone-size check:** check every new drawing on a stills sheet. Misreads we caught: cake, tally marks, spiders, a plate, a flower.

### 6. Sound spec

- A **memory motif** (Gran's music box) that comes back detuned in the present.
- **Foley for every hand action** and every on-screen event, from the earshot kit or the house synths.
- **Silence before the whisper**, then a title boom.
- Mix at about −15 LUFS integrated, true peak −1.5 dBFS or lower.
- **Listening checks:** run earshot's listening checks (`sound/earshot_listen.py`, `earshot timeline`). A human listens before posting.

### 7. Share and comment engineering

- **Share triggers:**
  - "Wait, is this real?" folklore, with a source in the pinned comment;
  - relatability (sleep paralysis);
  - a line people screenshot.
- **Comment triggers:**
  - a caption question;
  - guess-the-monster;
  - polls and "you decide" for series.
- **Creator replies:** "follow the series", "check the other parts". These are what drove our replies under The Count.

### 8. The post package

- A caption template: a question hook, then two lines of real folklore, then a question, then 6–8 hashtags.
- A cover frame.
- **Trial flow:** post as a trial, then share to everyone after the 2-hour check.
- Log the posting time.

### 9. Post-mortem loop: performance log

Record each post at 2 h and 24 h:

- views and viewers;
- skip rate;
- average watch time and its % of runtime;
- like, save, share and comment rates;
- a screenshot of the retention graph;
- notable comments.

Compare against the baseline, write down one hypothesis, and change one variable in the next film.

**Starting rows:**

| Film | Views @2 h | Skip | Avg watch | Shares | Note |
| --- | --- | --- | --- | --- | --- |
| The Count, Part I | viral (16.3k likes) | n/a | n/a | n/a | Top comment: "should've ended at the twist" |
| The Shroud Eater | ~150 | 30.8% (lower than usual) | 33 s / 64.6 s | 0 | Stalled at the first batch; twist at 53 s; corpse and coffin imagery |
| The Keyhole | (pending) | | | | No death imagery; twist at 44 s; 54.9 s |

### 10. Pre-post checklist

- Hook frame works on mute.
- Eligibility gate passed.
- Twist placed before average watch time + 10 s.
- Post-twist section 10 s or less.
- Density spec met.
- Foley on every action.
- Loudness on target.
- Caption question written.
- Source ready for a pinned comment.
- Performance log row opened.

## Sources

- Ranking signals: [Social Media Today](https://www.socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/), [Dataslayer](https://www.dataslayer.ai/blog/instagram-algorithm-2025-complete-guide-for-marketers)
- Recommendation eligibility: [Instagram Help Center](https://help.instagram.com/313829416281232), [Instagram creators blog](https://creators.instagram.com/blog/instagram-recommendations-eligibility-tips-creators), [Meta: recommendation guidelines](https://about.fb.com/news/2020/08/recommendation-guidelines/)
- Trial reels: [PetaPixel](https://petapixel.com/2024/12/13/instagram-launches-trial-reels-so-you-can-test-content-with-non-followers), [9to5Mac](https://9to5mac.com/2024/12/10/instagrams-new-trial-reels-feature-lets-creators-test-content-with-non-followers), [Planoly](https://www.planoly.com/blog/instagram-trial-reels.md)
- Our own evidence: `series/count-successor.md`, `series/the-shroud-eater.md`, `series/the-keyhole.md`, the insights screenshots and comment screenshots in this session.
