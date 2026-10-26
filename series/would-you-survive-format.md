# "Would You Survive?" — reusable short format

A 30–35 s, second-person survival test in the gothic POV style. The camera is the viewer's eyes, the hands are
theirs, and the narrator (Kokoro `bm_lewis`) tells them what happens. Reference episode:
`src/episodes/portrait/survive-vampire` (composition `SurviveVampire`).

## The shape (fixed)

| Beat | Time | What happens |
| --- | --- | --- |
| Hook | 0–5 s | Mute-proof image of the new body + "You've just been turned into a ___. Would you survive one week?" |
| Day one | ~5–10 s | A folklore rule meets modern life: a small, funny inconvenience |
| Day two | ~10–14 s | A deadly rule, solved too easily ("Easy.") — false comfort |
| Day three | ~14–22 s | An ordinary errand; the rule nobody thinks about bites, readable on mute |
| Punchline | ~22–24 s | One line, one red word, that makes it modern and relatable ("And you rent.") |
| Sting | ~24–28 s | The next threat arrives on the phone; an unfinished action; hard cut |
| Whisper | over black | ≤ 4 words |
| End card | 5.4 s | WOULD YOU SURVIVE? · AS A ___ · the comment prompt |

About 60–65 spoken words. Only day numbers 1–3 appear; "of 7" keeps the week's promise open.

## The kit pieces

| Piece | File | Use |
| --- | --- | --- |
| `DayTag` | `src/kit/common/series/Survive.tsx` | Upper-left "DAY n of 7" counter; pass it through `StoryFrame`'s `overlay` |
| `SurviveCard` | same | End card: `subtitle="AS A WEREWOLF"`, `prompt="Would you last the week?"`, optional `cta` |
| Series marker | `StoryFrame chapters` | `[{t: -0.4, label: 'WOULD YOU SURVIVE?', title: 'As a ___'}]` for the first 4 s |
| `Phone` + `LockScreen` | `art/Modern.tsx`, `art/Home.tsx` | Modern-life beats (Face ID, texts); `Phone screen={...}` replaces the thread |
| `PedestalBasin`, `RollerBlind`, `Smoke`, `Threshold`, `LettingTag` | `art/Home.tsx` | Everyday-home props |
| `Doorstep` set (+ `WarmHall`) | `kit/portrait/sets/Doorstep.tsx` | Your own front door from outside |

## New episode checklist

```
cp -r src/episodes/portrait/survive-vampire src/episodes/portrait/survive-<monster>
# script.json: keep the line ids L01-L12 so beats.py still works, or edit beats.py's map
python3 tts/narrate.py src/episodes/portrait/survive-<monster>
python3 src/episodes/portrait/survive-<monster>/beats.py
# scenes/Story.tsx: swap the hand style (STYLES.wolf, a ghost...), sets and props; Main.tsx: META.id, subtitle, red word
# register in src/Root.tsx; cues.py; then:
python3 sound/build_audio.py survive-<monster> && python3 tts/make_srt.py src/episodes/portrait/survive-<monster>
```

## Ideas for the next ones

- **Werewolf:** Day one, the dog won't stop staring. Day two, full moon, so you lock yourself in. Easy.
  Day three, the moon app shows a **supermoon** this month… and you've got a smart lock. Your flatmate has the app.
- **Ghost:** Day one, the motion-sensor lights won't see you. Day two, you walk through walls. Easy.
  Day three, the new tenants are moving in… and they've hired someone to **cleanse** the house.
- **Mummy:** Day one, airport scanner. Day two, you can't sleep without the dark. Easy. Day three: a museum wants you **back**.
