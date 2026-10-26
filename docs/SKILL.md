---
name: "gothic-pov-style"
description: "Gothic first-person horror animation style for remotion-video-studio: moonlit SVG sets, hands-only acting, Kokoro bm_lewis narrator, serif captions, reusable kit. Use alongside it for any story in this style."
---

# Gothic POV Style

A style layer, not a replacement. Run the full `remotion-video-studio` workflow (brief → script →
narration → timing → shotbook → build → five-pass QA → delivery) and let this file override only:
look, camera, characters, voice, captions, title card, pacing, sound and the extra QA gate. On facts,
rights, honesty about what was checked, and verification, the core skill always wins.

Origin: extracted from "The Count — Part I" (64 s vampire short, 2026) and its template sibling "The Knock".
Use it for ANY short horror, folklore, ghost or supernatural-mystery story that should look like
them — not only vampires and not only that series.

## 1. The style in one paragraph

A 9:16 short told entirely through the narrator's eyes in a dark gothic house. We never see his face,
only his hands. Light comes from the moon, a candle or a phone torch, and everything outside that
light falls to near-black. Memories are warm amber, the present is cold blue. A quiet British man
narrates in short sentences. Burned-in serif captions carry the story for sound-off viewers, with
one blood-red word on each reveal. The film ends on an unfinished action, a hard cut to black, a
whispered last word, then a blackletter title card. All art is code-drawn SVG from a shared kit,
and all sound is synthesised.

| Fixed for every story | Chosen per story |
| --- | --- |
| Format, POV rules, palette, grade, grain, vignette, light modes | Folklore rule, monster or presence, twist, clues |
| Narrator voice + settings, caption design, title-card design | Script, title text, subtitle (PART II, a tagline) |
| Sound engine, mix rules, loudness | Which kit sets/props appear; new props the story needs |
| Shot grammar, hand-acting rules, QA gate | Shot list, cue list, runtime (30–65 s) |

## 2. Get the kit first

The reusable assets ship as **`gothic-pov-kit.zip`**: art kit, two sets, series layer, sound engine,
narrator script, fonts, grain, The Count Part I (reference) and The Knock (template).

1. Look for `gothic-pov-kit.zip` in the conversation's attachments or uploads (also check
   `/mnt/user-data/uploads`). If it is not there, ask the user to attach it once. If they no longer
   have it, rebuild it from the appendices (§15), then continue.
2. Unzip into the working directory; `npm ci` (Remotion 4.0.538, React 18.3.1, TypeScript 7.0.2).
3. `pip install kokoro-onnx==0.6.1 soundfile numpy scipy` (add `--break-system-packages` where needed).
   Download `kokoro-v1.0.onnx` and `voices-v1.0.bin` from
   `https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0` into `voice/`.
4. FFmpeg and ffprobe must be on PATH.
5. Remotion fetches its own headless Chrome. If that download is blocked, set
   `REMOTION_BROWSER=/path/to/chrome-headless-shell` (the sandbox has one under `/opt/pw-browsers/`).
6. Smoke test: `npx tsc -p .` then `node scripts/stills.mjs Template 1 7.8 12.6`.

Never restyle kit components per story. Extend the kit instead (new props in `src/kit/art/`, new sets in
`src/kit/sets/`, one panel added to `src/catalog/Catalog.tsx`), and return the updated kit zip at delivery
so the user's copy stays current.

## 3. Inquiry shortcut

Format, look, voice, captions and sound are fixed, so do not ask about them. Ask only what the Story
Brief needs, in one round, and offer to choose for the user (most users will say "surprise me"):

```markdown
STORY BRIEF
Title card text:                 Subtitle: [PART n | tagline | none]
Series / standalone:             Runtime: [60–65 s default | 30–35 s]
Presence: [vampire | ghost | thing in the walls | doppelganger | fae | other]
Folklore rule (real, nameable):
Childhood belief / hook line idea:
Who taught the rule, and the ritual:
What the narrator does that breaks it:
Twist (who the rule really protected, or from whom):
Clue 1 (spoken, innocent-sounding):     Clue 2 (visual only):
Cliffhanger action:                      Whispered last word:
New sets or props needed:                Avoid:
Review mode: [straight to final | script + sample first]
```

Fill any blank inside these rules and state the choice at the top of the work.

## 4. Story formula

Default 60–65 s: 130–150 spoken words in about 61 s, plus a 3–4 s title card. Seven beats:

| Beat | 60 s timing | Job |
| --- | --- | --- |
| 1 Hook | 0–3 s | One line stating a belief or fear ("When I was eight, I knew vampires were real.") |
| 2 Rule | 3–13 s | The ritual and who taught it; warm memory grade; plant the visual clue |
| 3 Disbelief | 13–25 s | Time jump to the cold present; spoken clue; he breaks the rule |
| 4 The night | 25–36 s | A sign wakes him; misdirect toward the outside |
| 5 Turn | 36–48 s | The rule turns on him, revealed through his own hands or his own voice |
| 6 Proof | 48–55 s | One undeniable image, then ONE line that reinterprets the ritual |
| 7 Cliffhanger | 55–61 s | Unfinished action, hard cut to black, whispered last word, title |

A 30–35 s short merges beats 2+3 and 5+6: hook, rule, broken rule, turn with proof, then the cliffhanger
(The Knock does this in 14 s of story).

Rules:
- The twist inverts who the ritual protected, or from whom: the protector was the jailer, the warning
  was an invitation, the threat was never where we looked.
- The twist must read with the sound off: hands, a reflection, an object where it should not be.
- Plant two clues before the turn: one spoken but innocent-sounding, one visual only.
- Use a real folklore rule that can be named in the comments (counting grains, invitation to enter,
  no reflection, running water, salt lines, iron, covered mirrors, knocks at midnight, church bells).
- Never explain the twist beyond one line. Never show the outcome of the cliffhanger.
- No gore, bites, victims' faces, real people or places, or recognisable film/game characters.

Script rules: mostly 3–10 word sentences, one image each; contractions; plain British wording; numbers
spelled out ("thirty-four"); no sound-effect words; each reveal line stands alone with a long pause
after it; whispered lines have 8 words or fewer and `"whisper": true`.

`script.json`:

```json
[
  {"id": "L01", "text": "When I was eight, I knew vampires were real.", "pauseAfter": 0.35},
  {"id": "L10", "text": "Four hundred and six. Four hundred and seven.", "whisper": true, "pauseAfter": 0.35},
  {"id": "L17", "text": "I wasn't.", "pauseAfter": 1.1}
]
```

Pause guide: 0.2–0.35 s between ordinary lines, 0.6–0.9 s before a scene change, 1.1–1.2 s after a reveal.
The narrator script multiplies every pause by 0.8.

## 5. Narrator (pinned)

`scripts/narrate.py src/episodes/<slug>` → `work/<slug>/line_*.wav`, `work/<slug>/narration.wav`,
`src/episodes/<slug>/timing.json` (measured line times plus caption phrases split on internal silences of 90 ms or more).

| Setting | Value |
| --- | --- |
| Engine / model | kokoro-onnx 0.6.1, model files v1.0, offline CPU |
| Voice | `bm_lewis` (deepest British male, median pitch about 98 Hz), `lang="en-gb"` |
| Speed | 0.97 normal, 0.86 whispered |
| Lead-in / pauses | 0.35 s lead-in; `pauseAfter × 0.8` |
| Levels | normal lines peak 0.8; whisper = envelope-shaped 1.5–7 kHz noise + 300 Hz-high-passed voice, peak 0.6 |
| Runtime | total 60–63 s for a 64 s film; if long, cut words before raising speed (cap 1.0) |

A female narrator is not part of the tested style. If a story needs one, audition `bf_emma` at the same
settings and say it is untested. Voices were picked by measured pitch; if you cannot listen, say so. Fix
mispronunciations by respelling in `script.json`.

## 6. Visual bible

POV rules:
- The camera is his eyes. Show only his hands and sleeves, entering from the bottom or sides. Never his face.
- Handheld drift on every shot (`Camera shake` 3–4 in memories, 5–7 in fear).
- A glance is a camera move (pan/tilt/roll on `Camera`), not a cut. A fast look behind is a whip turn:
  `x` offset about 700 → 0 and `rot` -6 → 0 over 0.32 s with a CSS blur of 26 → 0 px.
- Waking = black, then `Eyelids` 0 → 0.55 → 0.45 → 0.8 → 0.15 → 0.95 (blink) over 1.8 s.
- Searching a dark room = `Torch` (screen space, after the `Camera`).
- His hands change with the story (child → adult → creature) and carry the acting.

Light modes and grade (`StoryFrame.gradeAt` returns `'warm' | 'cold' | 'none'`):

| Mode | Use | Colours (`theme.ts`) | Finishing |
| --- | --- | --- | --- |
| Candle / memory | childhood, the person who taught the rule | candle `#ffb45a`, warmWall `#2a1508` | grade `warm`: soft-light rgba(255,140,60,.05), flicker 7%, vignette .75, grain .20 |
| Dawn | relief beats only | sky to `#e08a4c`, grains glow warm | `warm` |
| Night / moon | the present | night0 `#04060b`, night1 `#0a1220`, coldLight `#9fb4cf`, moon `#d9e2ec` | grade `cold`: rgba(40,70,120,.08), flicker 5%, vignette .85, grain .15 |
| Torch | dark-room search | disc r 380–470, ambient .12–.14 | `cold` |
| Black | cliffhanger cut, title card | `#000` | `none` |

Accent: blood `#8a0f12` / bloodBright `#c4161c`, used only for the title and at most one caption word per
beat. Creature skin `#8d939b`, shade `#3c4048`, black claws `#0c0d10`.

Signature motifs (use at least two per story): the pointed gothic window with tracery and a swaying tree;
oxblood curtains; dust in a moonbeam; small countable grains; a covered or lying mirror; the oak door
with iron straps.

Making new art in this style (sets and props):
- An SVG React component in `src/kit/art/` (props) or `src/kit/sets/` (whole backgrounds), deterministic,
  taking `t` (seconds) plus light props (`lit`, `warm`, `light: 'night'|'candle'`), and an `id` prefix for every `<defs>` id.
- Shape language: pointed arches (the kit's arch helper), straight verticals, iron, oak, stone, velvet,
  damask. Silhouettes in `#000`–`#0b0d12`, with one rim-light stroke on the edge facing the light, cold
  `#8fa3c0` or warm `#ffb45a`, at 0.25–0.5 opacity.
- Put detail only where light falls; let the rest fall to black. No gradients on characters except rim light.
- Randomness only through `rng(seed)` or `noise1(t, seed)`. Never `Math.random` or wall-clock time.
- Check every new piece at phone size (stills at 0.3–0.4 scale) and redraw anything that reads as
  something else. In The Count, a front-on face read as a bald ball (redrawn in profile), claw marks
  read as tally marks (given curves), and a skewed ceiling light read as a heart (sharpened arches).
- Add a panel to `src/catalog/Catalog.tsx` and re-run `scripts/catalog.sh`.

## 7. Shot grammar and pacing

16–20 shots in 61 s (average 3–3.5 s), with one long continuous move (6–10 s) into the turn.

| Shot | Length | Camera |
| --- | --- | --- |
| Establishing POV | 2.5–3.5 s | push-in, zoom +0.02–0.025/s |
| Ritual close-up | 3–3.5 s | scale 1.9 on the action, shake 4 |
| Person in memory | 2–3 s | profile, lean-in scale ×1.15 |
| Macro insert | 2 s | lateral pan 140 px/s, glints one by one |
| Torch search | 4–4.5 s | camera follows the beam at 0.2–0.25 of its offset |
| Wake-up | 2.5–3 s | 0.2 s black hold, then Eyelids |
| Lying awake | 5–5.5 s | slow roll, then a head-turn pan that carries into the next shot |
| Continuous reveal | 7–10 s | tilt over a tall world (`Stage h` up to 3960), e.g. window down to floor |
| Proof | 6–7 s | push +0.3 zoom, a 0.04 zoom jolt decaying on the reveal word |
| Cliffhanger | 2.5–3 s | push +0.38 toward the opening |

Cuts: hard cuts on phrase starts from `timing.json`; one 0.36 s dip for a time jump (`dipAround`); a 0.2 s
`holdBlack` before a wake-up; a hard cut to black for the cliffhanger; a memory flash = screen-blend sepia
double exposure at 40%. No cross-dissolves between incompatible poses.

Hand acting (`Hand`, `POSES`, `lerpPose`, `wristFor`):
- Every action = approach (about 0.24 s) → contact (0.3–0.85 s) → settle or hold.
- Contact with an object: solve the wrist with `wristFor()` so the nail tip stays on the object.
- Fear: freeze within 0.1 s of the trigger word, tremble ±3 px (`noise1`), curl to `claw` over about 1.6 s.
  A recoil goes to `fist` and drops 160–200 px in 0.2 s.
- Idle hands are never dead still (tapping, drift, breathing). A grab = `reach` → `fist` in 0.25 s, then
  the hand and the object move together.
- Keep hands and key action out of the caption band (y 1330–1560) and the bottom 360 px.

Pacing: memories breathe (longer holds, music box); the present tightens (heartbeat from 1.0 s to 0.48 s per
beat); the last 6 s cut fastest.

## 8. Captions and title card

`StoryFrame` draws captions from `timing.json` (also export an `.srt`).

| | Normal | Whisper |
| --- | --- | --- |
| Font | Cormorant Garamond 600 (`CountCaption`) | same, italic |
| Size / colour | 78 px, `#ece4d2` | 70 px, `#c9b8b0` at 85%, letter-spacing 3 |
| Position | text top at y 1330, width 900, centred | same |
| Motion | fade + 10 px rise over 0.17 s, out 0.13 s; hold to end + 0.25 s, never overlapping | same |

`redWords`: the exact reveal words with punctuation (e.g. `'mine.'`), one per beat at most.

`TitleCard`: pure black; title in UnifrakturCook 700 (`CountTitle`), up to 190 px (auto-shrinks for long
titles), blood `#8a0f12`, 40 px red glow, candle flicker, 1.06 → 1.00 settle, fading in from cut + 1.0 s;
subtitle in Cormorant 48 px `#8a8478`, letter-spacing 18, 0.7 s later. A boom lands with the title. No
call to action unless asked.

## 9. Sound bible

`src/episodes/<slug>/cues.py` defines `DUR` and `cues(S)`; `python3 scripts/build_audio.py <slug>`
mixes and masters to `public/episodes/<slug>/mix.wav`. Everything is synthesised (`scripts/sound_lib.py`).

| Layer | Call | When |
| --- | --- | --- |
| Music-box lullaby (A minor) | `S.music_box(start, notes, bass, stop=)` | memory beats; stops dead at the time jump |
| Dawn chord | `S.dawn_chord(t0, t1)` | relief only |
| Cold drone (41.2 + 55 Hz) | `S.drone([(t, gain), …])` | the present; rises with dread; 0 at the wake-up |
| Tension cluster | `S.tension([...])` | swells into each reveal, cut on the reveal word |
| Night wind | `S.wind([...])` | the present; doubles for the cliffhanger |
| Room tone | `S.room_tone(t0, t1)` | candle-lit interiors |

| SFX | Use |
| --- | --- |
| `click` | grain placed, latch, torch switch; `S.ticks()` for a clock |
| `knock` / `S.knocks()` | knuckles on oak |
| `whoosh` | something past the window, cloth pulled, a sweep, a whip turn |
| `boom` (+ `sting` on big reveals) | time jump, each reveal, title card |
| `S.heartbeat_run(t0, t1)` | misdirect → turn, period 1.0 → 0.48 s |
| `S.patter(t0, span)` | pouring or scattering grains |
| `creak`, `scratch`, `breath`, `chime` | hinges and casements, claws on wood, waking, counting glints |

Mix (in `Score.mix`): voice 1.2 s room at 12% wet; whispers 3.2 s at 50%, ×1.25; music and ambience duck
up to 55% under speech, SFX 30%; `S.silence(a, b)` cuts everything but the voice (the cliffhanger: cut → title
boom). Master: gain to about −15 LUFS integrated, `alimiter` 0.82, true peak about −1.5 dBTP. Never use
dynamic `loudnorm` on the mix; it flattens the stings. Keep cue times in the same seconds as the scenes
(share constants such as knock times between `Story.tsx` and `cues.py`).

## 10. Kit reference

All components draw in 1080×1920 world units, take time `t` in seconds, and are deterministic.

| Component | File | Key props |
| --- | --- | --- |
| `StoryFrame` | series/StoryFrame.tsx | `sceneAt(t)`, `gradeAt(t)`, `dipAt(t)`, `timing`, `redWords`, `audio`; helpers `dipAround`, `holdBlack` |
| `TitleCard` | series/TitleCard.tsx | `t, t0` (cut time), `title`, `subtitle` |
| `Captions`, `useStyleFonts` | series/ | used by StoryFrame |
| `Camera` | fx.tsx | `zoom, x, y, rot, shake, seed` (handheld drift) |
| `Stage` | fx.tsx | full-frame SVG; `h` for tall worlds |
| `Torch`, `Eyelids`, `Vignette`, `Flicker`, `FilmGrain` | fx.tsx | `x,y,r,ambient,tint`; `open`; … |
| `WindowWall` (set) | sets/WindowWall.tsx | `mode 'night'|'candle'|'dawn'`, `dawn, warm, open, billow, wind, cloudCover, grains, grainsVisible, grainLit, grainWarm, beam, outside, children`; constants `WIN`, `SILL_Y`, `SILL_GRAINS` |
| `DoorWall` (set) | sets/DoorWall.tsx | `mode 'night'|'candle'`, `open, knock, under, underColor, sconce, beam, beyond, children`; `DOOR` |
| `GothicWindow`, `Sky`, `Tree` | art/Window.tsx | window `open` swings casements; `outside` draws behind the glass |
| `GothicDoor` | art/Door.tsx | `open` (hinged left), `knock` jolt, `under` light + keyhole glow, `beyond` |
| `Hand` | art/Hand.tsx | `x, y, rot, scale, style, pose, mirror, light, showSleeve` |
| `STYLES` | art/Hand.tsx | `creature` (=`vamp`), `adult`, `elder` (=`gran`), `child`; spread one to make a new look |
| `POSES`, `lerpPose`, `wristFor`, `indexTip` | art/Hand.tsx | `flat, relaxed, point, claw, fist, reach`; blending; fingertip contact |
| `Wall`, `Sill`, `Curtain`, `Floor`, `MoonBeam` | art/Room.tsx | `warm, lit`, `billow`, dust motes |
| `Grain`, `pileOf10`, `scatter` | art/Room.tsx | `lit, warm, glint` (rice, salt, seeds) |
| `Candle`, `Clock`, `Portrait`, `Mirror`, `Cloth` | art/Props.tsx | flame flicker; 3:00 ticking; mourning ribbon; reflection `children`; `pull, grabX` |
| `ElderProfile`, `CupHand`, `Duvet` | art/Props.tsx | `finger, lean`; `tilt`; `grip` |
| `track`, `prog`, `lin`, `mix`, `rng`, `noise1`, easings | util.ts | keyframes in seconds; eased progress; seeded random |

Part I-only scene code (`src/episodes/the-count-01/scenes/`) is a pattern library: the pour with a
grain stream, a sweep that throws grains, sorting with fingertip contact, the mirror reveal with a cloth
held by nothing, claw marks on a frame, and a window swinging open.

## 11. Making a new story

```markdown
cp -r src/episodes/_template src/episodes/<slug>        # slug: kebab-case
# edit: brief.md, script.json, META in Main.tsx (id, durationSec, audio path)
python3 scripts/narrate.py src/episodes/<slug>          # -> timing.json; check 60-63 s
# write shots.json (cuts on phrase starts), scenes/*.tsx, sceneAt/gradeAt/dipAt in Main.tsx
# register in src/Root.tsx: import * as X from './episodes/<slug>/Main'; add X to STORIES
# write cues.py, then:
python3 scripts/build_audio.py <slug>
npx tsc -p .
node scripts/stills.mjs <Id> <t1> <t2> ...               # one still per shot -> contact review
npx remotion render src/index.ts <Id> out/<slug>-pilot.mp4 --frames=<a>-<b> --scale=0.5   # the turn
npx remotion render src/index.ts <Id> out/<slug>.mp4 --codec=h264 --crf=18 --x264-preset=veryfast --audio-codec=aac --audio-bitrate=192k
scripts/contact.sh out/<slug>.mp4
```

Write captions to `.srt` from `timing.json` phrases. On a 2-core machine, a 64 s film renders in about 9
minutes, the 18.5 s template in about 2.5. Deliver the MP4, `.srt`, the story folder, and the updated
kit zip if the kit changed.

## 12. Style QA gate (in addition to the core's five passes)

- [ ] Hook within 3 s; real folklore rule; two clues; twist readable with sound off; unfinished-action ending
- [ ] Narration 60–63 s (or the agreed short length); reveal lines isolated with long pauses
- [ ] Contact sheet of every shot at phone size; every silhouette reads as what it is
- [ ] No narrator face; hands act (freeze, tremble, curl, contact) rather than slide
- [ ] Grade correct per beat (`warm` memories, `cold` present, `none` on black)
- [ ] Key action clear of y 1330–1560 and the bottom 360 px
- [ ] At least two signature motifs; nothing brighter than the light source allows
- [ ] Half-res pilot of the turn checked frame by frame
- [ ] Silence before a wake-up and at the cliffhanger; −15 ± 1 LUFS, true peak ≤ −1.3 dBTP
- [ ] ffprobe 1080×1920, 30 fps, H.264 + AAC; full decode clean; `.srt` order matches
- [ ] Record in `qa.md` what was actually seen and heard, and what could not be checked

## 13. Lessons from the reference stories

- Profiles read far better than front-on faces at phone size.
- Anything resembling a mark pattern (tally marks, asterisks) gets misread; give it curves, depth or scale.
- A continuous camera move into the reveal lands harder than a cut.
- Find one sound-off proof image per story (the cloth hanging from nothing in the mirror; the hand behind the glass).
- A door arch must fill to its true apex (`ys − ah`), not to `yb − h`.
- Limit, don't loudness-normalise dynamically.

## 14. Reference stories in the kit

| Story | Folder | Length | What it demonstrates |
| --- | --- | --- | --- |
| The Count — Part I | `src/episodes/the-count-01` | 64.0 s, 18 shots | full 7-beat film: pour, torch search, wake-up, tall-world tilt reveal, sorting with contact, mirror proof, window cliffhanger |
| The Knock (template) | `src/episodes/_template` | 18.5 s, 6 shots | short form on the DoorWall set: knocks synced to sound, memory beat, reach → recoil, whip turn, hand behind glass |
| Kit catalog | `src/catalog/Catalog.tsx` | 16 panels | every set, prop, hand style/pose, effect, caption and title, rendered to `docs/kit-catalog.png` |

## 15. Rebuilding the kit without the zip

Only when `gothic-pov-kit.zip` is unavailable. Create every file in the appendices at the path in its heading, then:
`npm install`; copy `cormorant-garamond-latin-600-normal.woff2`, `cormorant-garamond-latin-600-italic.woff2`
(from `@fontsource/cormorant-garamond`) and `unifrakturcook-latin-700-normal.woff2`
(from `@fontsource/unifrakturcook`) into `public/fonts/`; run `python3 scripts/make_grain.py`. The rebuilt kit
has the kit, the catalog and the template story, but not The Count's scenes or audio (those are only in
the zip): delete the `TheCount01` import and its `STORIES` entry in `src/Root.tsx`, then build the template's
audio with `narrate.py` and `build_audio.py _template`.

## Appendices: kit source

Each appendix is one file of `gothic-pov-kit` v1.0, verbatim. Paths are relative to the project root.

### Appendix 1: `package.json`

```json
{
  "name": "gothic-pov-kit",
  "version": "1.0.0",
  "private": true,
  "description": "Gothic first-person horror animation kit for Remotion: art kit, sets, series layer, sound engine, narrator.",
  "scripts": {
    "studio": "remotion studio src/index.ts",
    "typecheck": "tsc -p .",
    "render": "remotion render src/index.ts",
    "stills": "node scripts/stills.mjs"
  },
  "dependencies": {
    "@remotion/bundler": "4.0.538",
    "@remotion/cli": "4.0.538",
    "@remotion/renderer": "4.0.538",
    "remotion": "4.0.538",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@types/react": "19.3.0",
    "typescript": "7.0.2"
  }
}
```

### Appendix 2: `tsconfig.json`

```json
{"compilerOptions":{"target":"ES2020","module":"ESNext","moduleResolution":"bundler","jsx":"react-jsx","strict":true,"skipLibCheck":true,"resolveJsonModule":true,"esModuleInterop":true,"noEmit":true},"include":["src"]}
```

### Appendix 3: `remotion.config.ts`

```ts
import {Config} from '@remotion/cli/config';

// Remotion downloads its own headless Chrome on first render.
// If that download is blocked, point REMOTION_BROWSER at a local Chrome / chrome-headless-shell binary.
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
  Config.setChromeMode('headless-shell');
}
Config.setConcurrency(2);
```

### Appendix 4: `src/index.ts`

```ts
import {registerRoot} from 'remotion';
import {RemotionRoot} from './Root';
registerRoot(RemotionRoot);
```

### Appendix 5: `src/Root.tsx`

```tsx
import React from 'react';
import {Composition} from 'remotion';
import {FPS, W, H} from './kit/util';
import * as TheCount01 from './episodes/the-count-01/Main';
import * as Template from './episodes/_template/Main';
import * as Catalog from './catalog/Catalog';

/* Every story registers here: {META: {id, durationSec}, Episode}. Add one line per new story. */
const STORIES = [TheCount01, Template, Catalog];

export const RemotionRoot: React.FC = () => (
  <>
    {STORIES.map((s) => (
      <Composition key={s.META.id} id={s.META.id} component={s.Episode} durationInFrames={Math.round(s.META.durationSec * FPS)} fps={FPS} width={W} height={H} />
    ))}
  </>
);
```

### Appendix 6: `src/kit/index.ts`

```ts
/* Gothic POV kit — one import for everything a scene needs. */
export * from './util';
export {theme} from './theme';
export {Camera, Stage, Torch, Eyelids, Vignette, Flicker, Grain as FilmGrain} from './fx';
export * from './art/Window';
export * from './art/Door';
export * from './art/Hand';
export * from './art/Room';
export * from './art/Props';
export * from './sets/WindowWall';
export * from './sets/DoorWall';
export * from './series/Captions';
export * from './series/TitleCard';
export * from './series/StoryFrame';
export * from './series/fonts';
```

### Appendix 7: `src/kit/theme.ts`

```ts
export const theme = {
  // night / moonlight
  ink: '#030407',
  night0: '#04060b',
  night1: '#0a1220',
  night2: '#16243a',
  moon: '#d9e2ec',
  moonGlow: '#8fa6c4',
  coldLight: '#9fb4cf',
  wall: '#0c1017',
  wallLit: '#1f2a3a',
  wood: '#141210',
  woodLit: '#3a3530',
  // candle / memory
  candle: '#ffb45a',
  candleDeep: '#7a3a12',
  warmWall: '#2a1508',
  warmWallLit: '#6e3a17',
  sepia: '#c89a64',
  // skin
  granSkin: '#c99a7a',
  granSkinShade: '#6e4636',
  childSkin: '#e2b493',
  adultSkin: '#b89a86',
  vampSkin: '#8d939b',
  vampSkinShade: '#3c4048',
  nail: '#14161b',
  // accent
  blood: '#8a0f12',
  bloodBright: '#c4161c',
  rice: '#efe8d6',
  riceShade: '#9a917e',
  caption: '#ece4d2',
  fonts: {
    caption: 'CountCaption',
    title: 'CountTitle',
  },
};
```

### Appendix 8: `src/kit/util.ts`

```ts
import {Easing, interpolate} from 'remotion';

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const sec = (s: number) => Math.round(s * FPS);

/** Seeded PRNG (mulberry32). */
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Smooth deterministic 1D noise in [-1,1] from summed incommensurate sines. */
export const noise1 = (t: number, seed = 0) =>
  (Math.sin(t * 1.13 + seed * 12.9) * 0.5 +
    Math.sin(t * 2.71 + seed * 4.1) * 0.3 +
    Math.sin(t * 5.37 + seed * 7.7) * 0.2);

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const C = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

/** Eased 0..1 progress between two times in seconds, given a time t in seconds. */
export const prog = (
  t: number,
  a: number,
  b: number,
  ease: (x: number) => number = Easing.bezier(0.45, 0, 0.2, 1),
) => interpolate(t, [a, b], [0, 1], {...C, easing: ease});

export const lin = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], C);

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Multi-key track with per-segment easing (times in seconds). */
export const track = (
  t: number,
  keys: Array<[number, number]>,
  ease: (x: number) => number = easeInOut,
) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1];
      const [t1, v1] = keys[i];
      return mix(v0, v1, ease((t - t0) / (t1 - t0)));
    }
  }
  return keys[keys.length - 1][1];
};

/** Hex color lerp. */
export const lerpColor = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (p: number, s: number) => (p >> s) & 255;
  const r = Math.round(mix(ch(pa, 16), ch(pb, 16), t));
  const g = Math.round(mix(ch(pa, 8), ch(pb, 8), t));
  const bl = Math.round(mix(ch(pa, 0), ch(pb, 0), t));
  return `#${((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1)}`;
};
```

### Appendix 9: `src/kit/fx.tsx`

```tsx
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {noise1, W, H} from './util';

/** First-person camera: zoom/pan/roll around a focal point plus handheld drift. */
export const Camera: React.FC<{
  t: number;
  zoom?: number;
  x?: number; // world-space offset in px (positive moves view right)
  y?: number;
  rot?: number; // degrees
  shake?: number; // handheld amplitude px
  seed?: number;
  children: React.ReactNode;
}> = ({t, zoom = 1, x = 0, y = 0, rot = 0, shake = 6, seed = 1, children}) => {
  const hx = noise1(t * 0.9, seed) * shake;
  const hy = noise1(t * 0.75, seed + 3) * shake * 0.8;
  const hr = noise1(t * 0.6, seed + 9) * shake * 0.04;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transformOrigin: '50% 50%',
          transform: `scale(${zoom}) rotate(${rot + hr}deg) translate(${-x + hx}px, ${-y + hy}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{frame: number; opacity?: number}> = ({frame, opacity = 0.16}) => {
  const i = Math.floor(frame / 2) % 8;
  const ox = ((frame * 37) % 7) * 10;
  return (
    <AbsoluteFill style={{mixBlendMode: 'overlay', opacity, pointerEvents: 'none'}}>
      <Img
        src={staticFile(`tex/grain${i}.png`)}
        style={{width: W + 80, height: H + 80, marginLeft: -ox, marginTop: -ox * 0.6, imageRendering: 'auto'}}
      />
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{strength?: number; color?: string}> = ({strength = 0.85, color = '0,0,0'}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 72% 58% at 50% 46%, rgba(${color},0) 40%, rgba(${color},${strength * 0.6}) 75%, rgba(${color},${strength}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

/** Slow luminance flicker, like an old projector / candle unsteadiness. */
export const Flicker: React.FC<{t: number; amount?: number}> = ({t, amount = 0.05}) => {
  const f = (noise1(t * 9, 4) * 0.5 + 0.5) * amount;
  return <AbsoluteFill style={{background: '#000', opacity: f, pointerEvents: 'none'}} />;
};

/** Eyelids closing/opening; open=0 fully shut, 1 fully open. */
export const Eyelids: React.FC<{open: number}> = ({open}) => {
  const o = Math.max(0, Math.min(1, open));
  const gap = o * 1150; // half-height of the visible lens
  const curve = 260 * (1 - o * 0.4);
  const top = H / 2 - gap;
  const bot = H / 2 + gap;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <filter id="lidblur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={40 - o * 18} />
          </filter>
        </defs>
        <g filter="url(#lidblur)">
          <path d={`M-200,-200 H${W + 200} V${top} Q${W / 2},${top + curve} -200,${top} Z`} fill="#000" />
          <path d={`M-200,${H + 200} H${W + 200} V${bot} Q${W / 2},${bot - curve} -200,${bot} Z`} fill="#000" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Full-frame 1080x1920 SVG stage; scenes draw in these world units. Set h for taller worlds (camera tilts). */
export const Stage: React.FC<{children: React.ReactNode; h?: number}> = ({children, h = H}) => (
  <svg width={W} height={h} viewBox={`0 0 ${W} ${h}`} style={{position: 'absolute', left: 0, top: 0}}>
    {children}
  </svg>
);

/**
 * Phone-torch / lantern darkness: everything black except a soft disc at screen position (x, y).
 * Render it AFTER the Camera (it is in screen space). ambient 0.06–0.14 keeps the room faintly readable.
 */
export const Torch: React.FC<{x: number; y: number; r?: number; ambient?: number; tint?: string}> = ({
  x,
  y,
  r = 380,
  ambient = 0.12,
  tint = '210,225,255',
}) => (
  <>
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle ${r * 1.6}px at ${x}px ${y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,${0.35 - ambient}) 45%, rgba(0,0,0,${1 - ambient}) 100%)`,
      }}
    />
    <AbsoluteFill
      style={{
        mixBlendMode: 'screen',
        background: `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(${tint},0.16) 0%, rgba(${tint},0.05) 55%, rgba(0,0,0,0) 100%)`,
      }}
    />
  </>
);
```

### Appendix 10: `src/kit/art/Window.tsx`

```tsx
import React from 'react';
import {lerpColor, mix, rng} from '../util';
import {theme} from '../theme';

/* ---------------- Tree silhouette (procedural, seeded, sways) ---------------- */
type BranchSpec = {len: number; ang: number; w: number; kids: BranchSpec[]};
const makeTree = (seed: number, depth: number, len: number, w: number): BranchSpec => {
  const r = rng(seed);
  const build = (d: number, l: number, wd: number, a: number): BranchSpec => {
    const kids: BranchSpec[] = [];
    if (d > 0) {
      const n = d > 3 ? 2 + (r() > 0.6 ? 1 : 0) : 2;
      for (let i = 0; i < n; i++) {
        const spread = (i / (n - 1 || 1) - 0.5) * (0.9 + r() * 0.5) + (r() - 0.5) * 0.35;
        kids.push(build(d - 1, l * (0.66 + r() * 0.16), wd * 0.66, spread));
      }
    }
    return {len: l, ang: a, w: wd, kids};
  };
  return build(depth, len, w, 0);
};
const TREES = [makeTree(11, 7, 260, 34), makeTree(29, 6, 220, 26)];

const Branch: React.FC<{b: BranchSpec; t: number; depth: number; sway: number; color: string}> = ({
  b,
  t,
  depth,
  sway,
  color,
}) => {
  const wob = Math.sin(t * 0.9 + depth * 1.3) * sway * depth * 0.6 + Math.sin(t * 2.3 + depth) * sway * 0.25 * depth;
  const deg = (b.ang * 180) / Math.PI + wob;
  // slightly crooked branch: quadratic with offset control point
  const bend = Math.sin(depth * 7.1 + b.len) * b.len * 0.12;
  return (
    <g transform={`rotate(${deg})`}>
      <path
        d={`M0,0 Q${bend},${-b.len / 2} 0,${-b.len}`}
        stroke={color}
        strokeWidth={b.w}
        strokeLinecap="round"
        fill="none"
      />
      <g transform={`translate(0,${-b.len})`}>
        {b.kids.map((k, i) => (
          <Branch key={i} b={k} t={t} depth={depth + 1} sway={sway} color={color} />
        ))}
      </g>
    </g>
  );
};

export const Tree: React.FC<{x: number; y: number; scale: number; rot: number; t: number; which?: number; sway?: number; color?: string}> = ({
  x,
  y,
  scale,
  rot,
  t,
  which = 0,
  sway = 1,
  color = '#000000',
}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${scale})`}>
    <Branch b={TREES[which]} t={t} depth={0} sway={sway} color={color} />
  </g>
);

/* ---------------- Sky ---------------- */
export const Sky: React.FC<{
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  t: number;
  dawn?: number;
  moonX: number;
  moonY: number;
  moonR?: number;
  cloudCover?: number; // 0..1 how much clouds hide the moon
  wind?: number;
}> = ({id, x, y, w, h, t, dawn = 0, moonX, moonY, moonR = 70, cloudCover = 0.2, wind = 1}) => {
  const top = lerpColor('#03050a', '#1d2140', dawn);
  const mid = lerpColor('#0b1424', '#6b3f52', dawn);
  const bot = lerpColor('#13213a', '#e08a4c', dawn);
  const r = rng(77);
  const stars = Array.from({length: 40}, () => [x + r() * w, y + r() * h * 0.7, r() * 1.6 + 0.4, r()]);
  const clouds = Array.from({length: 6}, (_, i) => ({
    y: moonY - 160 + i * 70 + r() * 40,
    w: 380 + r() * 360,
    h: 50 + r() * 50,
    speed: (14 + r() * 18) * wind,
    off: r() * 1400,
  }));
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.6" stopColor={mid} />
          <stop offset="1" stopColor={bot} />
        </linearGradient>
        <radialGradient id={`${id}-moonglow`}>
          <stop offset="0" stopColor={theme.moonGlow} stopOpacity={0.55 * (1 - dawn)} />
          <stop offset="0.35" stopColor={theme.moonGlow} stopOpacity={0.18 * (1 - dawn)} />
          <stop offset="1" stopColor={theme.moonGlow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-sun`} cx="0.5" cy="1">
          <stop offset="0" stopColor="#ffcf8a" stopOpacity={0.9 * dawn} />
          <stop offset="0.5" stopColor="#ff9a55" stopOpacity={0.35 * dawn} />
          <stop offset="1" stopColor="#ff9a55" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-cblur`} x="-50%" y="-100%" width="200%" height="300%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-sky)`} />
      {stars.map(([sx, sy, sr, ph], i) => (
        <circle
          key={i}
          cx={sx}
          cy={sy}
          r={sr}
          fill="#cfd8e6"
          opacity={(0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 2 + ph * 20))) * (1 - dawn)}
        />
      ))}
      <circle cx={moonX} cy={moonY} r={moonR * 6} fill={`url(#${id}-moonglow)`} />
      <g opacity={1 - dawn * 0.9}>
        <circle cx={moonX} cy={moonY} r={moonR} fill={theme.moon} />
        {/* maria */}
        <circle cx={moonX - moonR * 0.3} cy={moonY - moonR * 0.2} r={moonR * 0.28} fill="#b9c3cf" opacity={0.6} />
        <circle cx={moonX + moonR * 0.25} cy={moonY + moonR * 0.25} r={moonR * 0.2} fill="#b9c3cf" opacity={0.5} />
        <circle cx={moonX + moonR * 0.35} cy={moonY - moonR * 0.35} r={moonR * 0.12} fill="#b9c3cf" opacity={0.5} />
      </g>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-sun)`} />
      <g filter={`url(#${id}-cblur)`}>
        {clouds.map((c, i) => {
          const cx = x - 400 + ((c.off + t * c.speed) % (w + 900));
          return (
            <ellipse
              key={i}
              cx={cx}
              cy={c.y}
              rx={c.w / 2}
              ry={c.h / 2}
              fill={lerpColor('#070b14', '#3a2a3a', dawn)}
              opacity={0.55 + cloudCover * 0.45}
            />
          );
        })}
      </g>
    </g>
  );
};

/* ---------------- Gothic window ---------------- */
const archPath = (x0: number, w: number, ys: number, yb: number, rFac: number) => {
  const r = w * rFac;
  const ah = Math.sqrt(r * r - (r - w / 2) * (r - w / 2));
  return {
    d: `M${x0},${yb} L${x0},${ys} A${r},${r} 0 0 1 ${x0 + w / 2},${ys - ah} A${r},${r} 0 0 1 ${x0 + w},${ys} L${x0 + w},${yb} Z`,
    ah,
  };
};

const Lattice: React.FC<{x: number; y: number; w: number; h: number; step?: number; color?: string; width?: number}> = ({
  x,
  y,
  w,
  h,
  step = 52,
  color = '#05070b',
  width = 3,
}) => {
  const lines: string[] = [];
  for (let k = -h; k < w + h; k += step) {
    lines.push(`M${x + k},${y} l${h},${h}`);
    lines.push(`M${x + k},${y + h} l${h},${-h}`);
  }
  return <path d={lines.join(' ')} stroke={color} strokeWidth={width} fill="none" />;
};

export type WindowProps = {
  id: string;
  cx: number;
  yb: number; // bottom of glass (top of sill)
  w: number;
  h: number; // apex height above yb
  t: number;
  light: 'night' | 'candle' | 'dawn';
  dawn?: number;
  open?: number; // 0..1 casement opening
  moon?: [number, number];
  cloudCover?: number;
  wind?: number;
  treeSway?: number;
  outside?: React.ReactNode;
};

export const GothicWindow: React.FC<WindowProps> = ({
  id,
  cx,
  yb,
  w,
  h,
  t,
  light,
  dawn = 0,
  open = 0,
  moon,
  cloudCover = 0.2,
  wind = 1,
  treeSway = 1,
  outside,
}) => {
  const x0 = cx - w / 2;
  const outer = archPath(x0, w, yb - h + w * 0.7, yb, 0.82);
  const ys = yb - h + outer.ah;
  const opening = archPath(x0, w, ys, yb, 0.82);
  const f = w * 0.09; // frame thickness
  const frame = archPath(x0 - f, w + 2 * f, ys, yb + f * 0.4, 0.8);
  const m = w * 0.06; // mullion
  const lw = (w - 3 * m) / 2;
  const lys = ys + w * 0.16;
  const lanL = archPath(x0 + m, lw, lys, yb - m * 0.6, 0.9);
  const lanR = archPath(x0 + 2 * m + lw, lw, lys, yb - m * 0.6, 0.9);
  const ocR = w * 0.155;
  const ocY = lys - lanL.ah - ocR * 0.55;
  const qr = ocR * 0.5;
  const quat = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ].map(([a, b]) => [cx + a * qr * 0.92, ocY + b * qr * 0.92]);

  const stone = light === 'candle' ? '#1c0f07' : lerpColor('#0b0d12', '#2a1c18', dawn);
  const stoneLit = light === 'candle' ? '#8a4b1e' : lerpColor('#5d6b80', '#d58a55', dawn);
  const glassTint = light === 'candle' ? 'rgba(255,170,90,0.10)' : `rgba(150,170,200,${0.06 + dawn * 0.05})`;
  const [mx, my] = moon ?? [cx + w * 0.24, yb - h * 0.5];

  // casement leaves swing inward (towards camera) around outer hinges
  const leaf = (side: -1 | 1, p: {d: string}, lx: number) => {
    const hingeX = side < 0 ? lx : lx + lw;
    const ang = open * 1.25; // radians
    const sx = Math.cos(ang);
    const skew = side * open * 9;
    return (
      <g transform={`translate(${hingeX},0) skewY(${skew}) scale(${sx},1) translate(${-hingeX},0)`}>
        <clipPath id={`${id}-leafclip${side}`}>
          <path d={p.d} />
        </clipPath>
        <path d={p.d} fill={glassTint} />
        {/* faint reflection sheen; brighter as the leaf turns toward us */}
        <path d={p.d} fill="#c8d6ea" opacity={0.03 + open * 0.12} />
        <g clipPath={`url(#${id}-leafclip${side})`}>
          <Lattice x={lx} y={yb - h} w={lw} h={h} />
        </g>
        <path d={p.d} fill="none" stroke="#06080c" strokeWidth={10} />
        <path d={p.d} fill="none" stroke={stoneLit} strokeWidth={2} opacity={0.35} />
      </g>
    );
  };

  return (
    <g>
      <defs>
        <clipPath id={`${id}-open`}>
          <path d={opening.d} />
        </clipPath>
        <mask id={`${id}-holes`} maskUnits="userSpaceOnUse" x={x0 - 500} y={yb - h - 500} width={w + 1000} height={h + 1000}>
          <rect x={x0 - 500} y={yb - h - 500} width={w + 1000} height={h + 1000} fill="#fff" />
          <path d={lanL.d} fill="#000" />
          <path d={lanR.d} fill="#000" />
          {quat.map(([qx, qy], i) => (
            <circle key={i} cx={qx} cy={qy} r={qr * 0.62} fill="#000" />
          ))}
          <circle cx={cx} cy={ocY} r={qr * 0.55} fill="#000" />
        </mask>
        <linearGradient id={`${id}-stone`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={stoneLit} stopOpacity={0.35} />
          <stop offset="0.5" stopColor={stone} />
          <stop offset="1" stopColor="#020203" />
        </linearGradient>
      </defs>
      {/* hood moulding (dripstone) with label stops and finial */}
      {(() => {
        const hood = archPath(x0 - f * 1.7, w + 3.4 * f, ys, ys + f * 0.2, 0.79);
        return (
          <g>
            <path d={hood.d} fill="none" stroke={stone} strokeWidth={f * 0.55} />
            <path d={hood.d} fill="none" stroke={stoneLit} strokeWidth={2} opacity={0.35} transform="translate(-2,-2)" />
            <rect x={x0 - f * 2.1} y={ys + f * 0.1} width={f * 0.8} height={f * 0.9} fill={stone} />
            <rect x={x0 + w + f * 1.3} y={ys + f * 0.1} width={f * 0.8} height={f * 0.9} fill={stone} />
            <path
              d={`M${cx},${ys - hood.ah - f * 1.4} q${f * 0.35},${f * 0.6} 0,${f * 1.2} q${-f * 0.35},${-f * 0.6} 0,${-f * 1.2}`}
              fill={stone}
              stroke={stoneLit}
              strokeOpacity={0.3}
            />
          </g>
        );
      })()}
      {/* outer moulding */}
      <path d={frame.d} fill={stone} />
      <path d={frame.d} fill={`url(#${id}-stone)`} opacity={0.6} />
      {/* the night beyond */}
      <g clipPath={`url(#${id}-open)`}>
        <Sky
          id={id}
          x={x0}
          y={yb - h}
          w={w}
          h={h}
          t={t}
          dawn={dawn}
          moonX={mx}
          moonY={my}
          moonR={w * 0.085}
          cloudCover={cloudCover}
          wind={wind}
        />
        <Tree x={x0 + w * 1.05} y={yb + 120} scale={1.5} rot={-28} t={t} which={0} sway={treeSway} />
        <Tree x={x0 - w * 0.1} y={yb + 260} scale={1.2} rot={22} t={t + 3} which={1} sway={treeSway} />
        {outside}
      </g>
      {/* tracery plate with glass holes */}
      <path d={opening.d} fill={stone} mask={`url(#${id}-holes)`} />
      <path d={opening.d} fill={`url(#${id}-stone)`} opacity={0.5} mask={`url(#${id}-holes)`} />
      {/* carved recesses in the spandrels */}
      {[-1, 1].map((sd) => (
        <g key={sd} opacity={0.75}>
          <path
            d={`M${cx + sd * w * 0.36},${ys - w * 0.05} q${-sd * w * 0.08},${-w * 0.14} ${-sd * w * 0.04},${-w * 0.3} q${sd * w * 0.06},${w * 0.12} ${sd * w * 0.04},${w * 0.3} Z`}
            fill="#020203"
          />
          <path
            d={`M${cx + sd * w * 0.36},${ys - w * 0.05} q${-sd * w * 0.08},${-w * 0.14} ${-sd * w * 0.04},${-w * 0.3}`}
            fill="none"
            stroke={stoneLit}
            strokeWidth={1.5}
            opacity={0.35}
          />
        </g>
      ))}
      {/* oculus glass + leading */}
      {quat.map(([qx, qy], i) => (
        <circle key={i} cx={qx} cy={qy} r={qr * 0.62} fill={glassTint} stroke="#05070b" strokeWidth={4} />
      ))}
      <circle cx={cx} cy={ocY} r={ocR} fill="none" stroke={stoneLit} strokeWidth={2} opacity={0.4} />
      {/* casement leaves */}
      {leaf(-1, lanL, x0 + m)}
      {leaf(1, lanR, x0 + 2 * m + lw)}
      {/* moonlit bevel on the opening */}
      <path d={opening.d} fill="none" stroke={stoneLit} strokeWidth={3} opacity={0.5} />
      <path d={frame.d} fill="none" stroke="#000" strokeWidth={6} opacity={0.8} />
    </g>
  );
};
```

### Appendix 11: `src/kit/art/Door.tsx`

```tsx
import React from 'react';
import {lerpColor, noise1} from '../util';

/** Pointed-arch path: straight jambs from yb up to ys, two arcs meeting at the apex. */
const arch = (x0: number, w: number, ys: number, yb: number, rFac = 0.82) => {
  const r = w * rFac;
  const ah = Math.sqrt(r * r - (r - w / 2) * (r - w / 2));
  return {d: `M${x0},${yb} L${x0},${ys} A${r},${r} 0 0 1 ${x0 + w / 2},${ys - ah} A${r},${r} 0 0 1 ${x0 + w},${ys} L${x0 + w},${yb} Z`, ah};
};

export type DoorProps = {
  id: string;
  cx: number; // centre x of the doorway
  yb: number; // floor line (bottom of the door)
  w: number; // opening width
  h: number; // apex height above yb
  t: number;
  light?: 'night' | 'candle';
  open?: number; // 0 closed .. 1 swung wide (hinged on the left, opens away from us)
  knock?: number; // 0..1 the leaf jolts in its frame (knocking, something pushing)
  under?: number; // 0..1 light leaking under the door and through the keyhole from the far side
  underColor?: string; // colour of that light
  beyond?: React.ReactNode; // drawn inside the doorway behind the leaf (a corridor, a figure, eyes)
};

/**
 * Gothic oak plank door in a stone surround: pointed arch, iron strap hinges, ring pull, keyhole.
 * Same light vocabulary as GothicWindow: 'night' = cold moonlit rims, 'candle' = warm rims.
 */
export const GothicDoor: React.FC<DoorProps> = ({
  id,
  cx,
  yb,
  w,
  h,
  t,
  light = 'night',
  open = 0,
  knock = 0,
  under = 0,
  underColor = '#ffb45a',
  beyond,
}) => {
  const x0 = cx - w / 2;
  const ys = yb - h + w * 0.42;
  const op = arch(x0, w, ys, yb);
  const f = w * 0.11;
  const frame = arch(x0 - f, w + 2 * f, ys, yb, 0.8);
  const warm = light === 'candle' ? 1 : 0;
  const stone = lerpColor('#0b0d12', '#1c0f07', warm);
  const rim = lerpColor('#8fa3c0', '#ffb45a', warm);
  const wood = lerpColor('#17110c', '#2a170b', warm);
  const woodLit = lerpColor('#3a3027', '#6a3a17', warm);
  const iron = '#0c0c0e';
  const top = ys - op.ah - 12; // true apex of the pointed arch
  const fullH = yb - top;
  const jolt = knock * noise1(t * 40, 3) * 6;
  const ang = open * 1.25;
  const sx = Math.max(0.02, Math.cos(ang));
  const planks = 6;
  const pw = w / planks;
  const leaf = (
    <g transform={`translate(${x0},0) skewY(${-open * 10}) scale(${sx},1) translate(${-x0 + jolt},0)`}>
      <clipPath id={`${id}-leaf`}>
        <path d={op.d} />
      </clipPath>
      <g clipPath={`url(#${id}-leaf)`}>
        {Array.from({length: planks}, (_, i) => (
          <g key={i}>
            <rect x={x0 + i * pw} y={top} width={pw} height={fullH} fill={wood} />
            <rect x={x0 + i * pw} y={top} width={pw * 0.35} height={fullH} fill={woodLit} opacity={0.18 + (i % 2) * 0.06} />
            <line x1={x0 + i * pw} y1={top} x2={x0 + i * pw} y2={yb} stroke="#000" strokeWidth={5} />
            {[0.2, 0.47, 0.81].map((g, j) => (
              <path
                key={j}
                d={`M${x0 + i * pw + pw * g},${top} C${x0 + i * pw + pw * (g + 0.08)},${yb - h * 0.6} ${x0 + i * pw + pw * (g - 0.06)},${yb - h * 0.3} ${x0 + i * pw + pw * g},${yb}`}
                stroke="#000"
                strokeOpacity={0.3}
                strokeWidth={1.5}
                fill="none"
              />
            ))}
          </g>
        ))}
        {/* iron strap hinges reaching across the planks */}
        {[0.28, 0.78].map((p, i) => {
          const y = yb - h * p;
          return (
            <g key={i}>
              <path d={`M${x0 - 4},${y - 16} L${x0 + w * 0.78},${y - 9} Q${x0 + w * 0.86},${y} ${x0 + w * 0.78},${y + 9} L${x0 - 4},${y + 16} Z`} fill={iron} />
              <path d={`M${x0 - 4},${y - 16} L${x0 + w * 0.78},${y - 9}`} stroke={rim} strokeOpacity={0.3} strokeWidth={2} />
              {[0.12, 0.3, 0.48, 0.66].map((q, j) => (
                <circle key={j} cx={x0 + w * q} cy={y} r={5} fill="#222" stroke={rim} strokeOpacity={0.25} />
              ))}
            </g>
          );
        })}
        {/* ring pull and keyhole plate */}
        <g transform={`translate(${x0 + w * 0.8},${yb - h * 0.46})`}>
          <rect x={-22} y={-40} width={44} height={110} rx={10} fill={iron} stroke={rim} strokeOpacity={0.3} strokeWidth={2} />
          <circle cx={0} cy={-14} r={7} fill="#1d1d1d" />
          <path d={`M0,${-6} m-34,0 a34,34 0 1,0 68,0 a34,34 0 1,0 -68,0`} fill="none" stroke="#1a1a1a" strokeWidth={9} transform="translate(0,34)" />
          <path d="M-30,30 a34,34 0 0,1 28,-34" fill="none" stroke={rim} strokeOpacity={0.35} strokeWidth={2} transform="translate(0,34)" />
          {/* keyhole: glows when light is on the far side */}
          <path d="M0,40 m-7,0 a7,7 0 1,1 14,0 l-4,22 h-6 z" fill={under > 0 ? underColor : '#000'} opacity={under > 0 ? 0.35 + under * 0.65 : 1} />
        </g>
        {/* edge darkening */}
        <path d={op.d} fill="none" stroke="#000" strokeWidth={30} opacity={0.6} />
      </g>
      <path d={op.d} fill="none" stroke={rim} strokeWidth={2} opacity={0.25} />
    </g>
  );
  return (
    <g>
      <defs>
        <clipPath id={`${id}-open`}>
          <path d={op.d} />
        </clipPath>
        <linearGradient id={`${id}-void`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" />
          <stop offset="1" stopColor="#05070b" />
        </linearGradient>
        <linearGradient id={`${id}-stone`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={rim} stopOpacity={0.25} />
          <stop offset="0.5" stopColor={stone} />
          <stop offset="1" stopColor="#020203" />
        </linearGradient>
        <radialGradient id={`${id}-spill`} cx="0.5" cy="0" r="0.8">
          <stop offset="0" stopColor={underColor} stopOpacity={0.55 * under} />
          <stop offset="1" stopColor={underColor} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* stone surround */}
      <path d={frame.d} fill={stone} />
      <path d={frame.d} fill={`url(#${id}-stone)`} opacity={0.6} />
      {/* inner chamfer: a lit bevel just inside the stone */}
      <path d={frame.d} fill="none" stroke={rim} strokeWidth={2} opacity={0.18} transform={`translate(${cx * 0.04},${yb * 0.04}) scale(0.96)`} />
      {/* the doorway: darkness, then whatever is beyond */}
      <g clipPath={`url(#${id}-open)`}>
        <rect x={x0} y={top} width={w} height={fullH} fill={`url(#${id}-void)`} />
        {beyond}
      </g>
      {leaf}
      {/* light spilling under the door onto the floor */}
      {under > 0 && (
        <g>
          <rect x={x0 + 6} y={yb - 4} width={w - 12} height={6} fill={underColor} opacity={0.4 + under * 0.6} />
          <ellipse cx={cx} cy={yb + 60} rx={w * 0.75} ry={90} fill={`url(#${id}-spill)`} />
        </g>
      )}
      <path d={op.d} fill="none" stroke={rim} strokeWidth={3} opacity={0.35} />
      <path d={frame.d} fill="none" stroke="#000" strokeWidth={6} opacity={0.8} />
    </g>
  );
};
```

### Appendix 12: `src/kit/art/Hand.tsx`

```tsx
import React from 'react';
import {theme} from '../theme';

/**
 * Articulated hand seen from the back (dorsal view), wrist at (0,0), fingers toward -y.
 * Finger curl is faked by foreshortening: projected segment length = L * cos(cumulative curl).
 */
export type HandStyle = {
  skin: string;
  shade: string;
  rim: string;
  nail: string;
  nailLen: number; // px beyond fingertip (vampire claws ~ 26)
  thin: number; // 1 = normal, <1 bonier
  fingerLen?: number;
  veins?: boolean;
  wrinkles?: boolean;
  sleeve?: string;
  sleeveLen?: number;
  cuff?: string;
};

const BASE_STYLES: Record<'vamp' | 'adult' | 'gran' | 'child', HandStyle> = {
  vamp: {
    skin: theme.vampSkin,
    shade: theme.vampSkinShade,
    rim: '#c9d4e2',
    nail: '#0c0d10',
    nailLen: 30,
    thin: 0.82,
    fingerLen: 1.2,
    veins: true,
    sleeve: '#0b0c10',
    sleeveLen: 520,
    cuff: '#1a1c22',
  },
  adult: {
    skin: theme.adultSkin,
    shade: '#4c3a31',
    rim: '#c5d2e4',
    nail: '#d8c0b0',
    nailLen: 2,
    thin: 1,
    sleeve: '#15171c',
    sleeveLen: 520,
    cuff: '#22252c',
  },
  gran: {
    skin: theme.granSkin,
    shade: theme.granSkinShade,
    rim: '#ffd3a0',
    nail: '#e8cdb8',
    nailLen: 3,
    thin: 0.88,
    wrinkles: true,
    veins: true,
    sleeve: '#3a1f19',
    sleeveLen: 460,
    cuff: '#4e2a20',
  },
  child: {
    skin: theme.childSkin,
    shade: '#7a4e3a',
    rim: '#f1c9a0',
    nail: '#f2d7c6',
    nailLen: 1,
    thin: 1.05,
    sleeve: '#2b3448',
    sleeveLen: 300,
    cuff: '#3a4560',
  },
};

/**
 * Hand looks. creature = grey, long black claws, veins (alias vamp). adult = ordinary man, dark sleeve.
 * elder = old woman, wrinkles, burgundy sleeve (alias gran). child = small, blue pyjama sleeve.
 * Make a new look by spreading one: {...STYLES.adult, skin: '#...', sleeve: '#...'}.
 */
export const STYLES = {
  ...BASE_STYLES,
  creature: BASE_STYLES.vamp,
  elder: BASE_STYLES.gran,
};

type Pt = [number, number];
const FINGERS = [
  // base x, base y, splay (deg), segment lengths, width
  {bx: -40, by: -118, splay: -9, segs: [50, 31, 24], w: 25}, // index
  {bx: -13, by: -126, splay: -2, segs: [55, 35, 26], w: 26}, // middle
  {bx: 14, by: -122, splay: 5, segs: [51, 32, 24], w: 24}, // ring
  {bx: 39, by: -108, splay: 13, segs: [40, 25, 21], w: 21}, // pinky
];

export type HandPose = {
  curls: [number, number, number, number, number]; // thumb, index, middle, ring, pinky (radians, 0 = straight)
  spread?: number; // multiplies splay
  thumbOut?: number; // radians extra thumb abduction
};

const outline = (pts: Pt[], widths: number[]) => {
  const L: Pt[] = [];
  const R: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    let dx = b[0] - a[0];
    let dy = b[1] - a[1];
    const n = Math.hypot(dx, dy) || 1;
    dx /= n;
    dy /= n;
    const hw = widths[i] / 2;
    L.push([pts[i][0] + dy * hw, pts[i][1] - dx * hw]);
    R.push([pts[i][0] - dy * hw, pts[i][1] + dx * hw]);
  }
  const last = pts.length - 1;
  const tipR = widths[last] / 2;
  let d = `M${R[0][0]},${R[0][1]} L${L[0][0]},${L[0][1]}`;
  for (let i = 1; i <= last; i++) d += ` L${L[i][0]},${L[i][1]}`;
  d += ` A${tipR},${tipR} 0 0 1 ${R[last][0]},${R[last][1]}`;
  for (let i = last - 1; i >= 0; i--) d += ` L${R[i][0]},${R[i][1]}`;
  return {d: d + ' Z', L, R};
};

const seg = (p: Pt, ang: number, len: number): Pt => [p[0] + Math.sin(ang) * len, p[1] - Math.cos(ang) * len];

export const Hand: React.FC<{
  x: number;
  y: number;
  rot?: number; // degrees, direction fingers point (0 = up)
  scale?: number;
  style: HandStyle;
  pose: HandPose;
  mirror?: boolean; // left hand
  light?: number; // 0..1 rim light strength
  id: string;
  showSleeve?: boolean;
}> = ({x, y, rot = 0, scale = 1, style, pose, mirror = false, light = 1, id, showSleeve = true}) => {
  const k = style.thin;
  const spread = pose.spread ?? 1;
  const palm = `M${-40 * k},70 C${-44 * k},30 ${-62 * k},-10 ${-62 * k},-50 C${-62 * k},-90 ${-56 * k},-112 ${-48 * k},-122 C${-30 * k},-136 ${30 * k},-136 ${46 * k},-116
    C${58 * k},-90 ${60 * k},-50 ${54 * k},-14 C${48 * k},20 ${40 * k},40 ${38 * k},70 Z`;

  const fingerEls = FINGERS.map((f, i) => {
    const curl = pose.curls[i + 1];
    let p: Pt = [f.bx * k, f.by];
    const ang = (f.splay * spread * Math.PI) / 180;
    const pts: Pt[] = [p];
    let cum = 0;
    f.segs.forEach((L, j) => {
      cum += curl * (j === 0 ? 0.8 : 1.05);
      const proj = L * (style.fingerLen ?? 1) * Math.max(0.06, Math.cos(Math.min(cum, 1.5)));
      p = seg(p, ang, proj);
      pts.push(p);
    });
    const wBase = f.w * k;
    const tip = pts[pts.length - 1];
    const tipCurl = Math.min(cum, 1.5);
    const nailL = style.nailLen * Math.max(0.05, Math.cos(tipCurl));
    const nailTip = seg(tip, ang, nailL + 4);
    const nw = wBase * 0.42;
    const perp: Pt = [Math.cos(ang), Math.sin(ang)];
    const curledDark = Math.min(1, cum / 2.2);
    return (
      <g key={i}>
        {(() => {
          const widths = pts.map((_, j) => wBase * (1 - j * 0.11) * (j === 0 ? 1.08 : 1));
          const o = outline(pts, widths);
          const hl = o.L.map((q, j) => [q[0] + (pts[j][0] - q[0]) * 0.3, q[1] + (pts[j][1] - q[1]) * 0.3]);
          const sh = o.R.map((q, j) => [q[0] + (pts[j][0] - q[0]) * 0.25, q[1] + (pts[j][1] - q[1]) * 0.25]);
          return (
            <g>
              <path d={o.d} fill={style.shade} stroke={style.shade} strokeWidth={4} strokeLinejoin="round" />
              <path d={o.d} fill={style.skin} />
              <polyline points={sh.map((q) => q.join(',')).join(' ')} stroke={style.shade} strokeOpacity={0.7} strokeWidth={wBase * 0.28} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points={hl.map((q) => q.join(',')).join(' ')} stroke={style.rim} strokeOpacity={0.4 * light} strokeWidth={Math.max(1.5, wBase * 0.14)} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {pts.slice(1, -1).map((q, j) => (
                <ellipse key={j} cx={q[0]} cy={q[1]} rx={wBase * 0.34} ry={wBase * 0.2} fill={style.rim} opacity={(style.thin < 0.9 ? 0.22 : 0.1) * light} transform={`rotate(${(ang * 180) / Math.PI} ${q[0]} ${q[1]})`} />
              ))}
            </g>
          );
        })()}
        {/* knuckle creases */}
        {pts.slice(1, -1).map((q, j) => (
          <path
            key={j}
            d={`M${q[0] - perp[0] * wBase * 0.3},${q[1] - perp[1] * wBase * 0.3} q${-Math.sin(ang) * 4},${Math.cos(ang) * 4} ${perp[0] * wBase * 0.6},${perp[1] * wBase * 0.6}`}
            stroke={style.shade}
            strokeWidth={style.wrinkles ? 2.4 : 1.6}
            fill="none"
            opacity={0.8}
          />
        ))}
        {/* darkening when curled under */}
        <line
          x1={pts[1][0]}
          y1={pts[1][1]}
          x2={tip[0]}
          y2={tip[1]}
          stroke="#000"
          strokeOpacity={curledDark * 0.45}
          strokeWidth={wBase}
          strokeLinecap="round"
        />
        {/* nail */}
        <path
          d={`M${tip[0] - perp[0] * nw},${tip[1] - perp[1] * nw} Q${nailTip[0] - perp[0] * nw * 0.4},${nailTip[1] - perp[1] * nw * 0.4} ${nailTip[0]},${nailTip[1]} Q${nailTip[0] + perp[0] * nw * 0.4},${nailTip[1] + perp[1] * nw * 0.4} ${tip[0] + perp[0] * nw},${tip[1] + perp[1] * nw} Q${tip[0]},${tip[1] + 6} ${tip[0] - perp[0] * nw},${tip[1] - perp[1] * nw} Z`}
          fill={style.nail}
          stroke="#000"
          strokeOpacity={0.5}
          strokeWidth={1}
        />
        {style.nailLen > 10 && (
          <path
            d={`M${tip[0] - perp[0] * nw * 0.4},${tip[1] - perp[1] * nw * 0.4} L${nailTip[0]},${nailTip[1]}`}
            stroke={style.rim}
            strokeOpacity={0.5 * light}
            strokeWidth={1.4}
          />
        )}
      </g>
    );
  });

  // thumb from side of palm (left side for a right hand seen from back)
  const tc = pose.curls[0];
  const tAng = -0.62 - (pose.thumbOut ?? 0) + tc * 0.55;
  let tp: Pt = [-36 * k, -8];
  const tpts: Pt[] = [tp];
  [58, 36].forEach((L, j) => {
    tp = seg(tp, tAng + j * 0.25 + tc * 0.4, L * Math.max(0.2, Math.cos(tc * (j + 1) * 0.6)));
    tpts.push(tp);
  });
  const tperp: Pt = [Math.cos(tAng), Math.sin(tAng)];
  const tTip = tpts[2];
  const tNail = seg(tTip, tAng + 0.25, style.nailLen * 0.8 + 4);

  const tendon = FINGERS.map((f, i) => (
    <path
      key={i}
      d={`M${f.bx * k * 0.5},-10 Q${f.bx * k * 0.8},-60 ${f.bx * k},${f.by + 6}`}
      stroke={style.shade}
      strokeOpacity={0.5}
      strokeWidth={style.thin < 0.9 ? 3 : 2}
      fill="none"
    />
  ));

  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${mirror ? -scale : scale},${scale})`}>
      <defs>
        <linearGradient id={`${id}-palm`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={style.rim} stopOpacity={0.4 * light} />
          <stop offset="0.25" stopColor={style.skin} />
          <stop offset="1" stopColor={style.shade} />
        </linearGradient>
      </defs>
      {/* thumb, rooted inside the palm */}
      {(() => {
        const o = outline(tpts, [42 * k, 30 * k, 23 * k]);
        return (
          <g>
            <path d={o.d} fill={style.shade} stroke={style.shade} strokeWidth={4} strokeLinejoin="round" />
            <path d={o.d} fill={style.skin} />
            <path
              d={`M${tTip[0] - tperp[0] * 8},${tTip[1] - tperp[1] * 8} Q${tNail[0]},${tNail[1]} ${tTip[0] + tperp[0] * 8},${tTip[1] + tperp[1] * 8} Z`}
              fill={style.nail}
            />
          </g>
        );
      })()}
      <path d={palm} fill={style.shade} transform="translate(0,3) scale(1.03)" />
      <path d={palm} fill={`url(#${id}-palm)`} />
      {tendon}
      {style.veins && (
        <path
          d={`M${-20 * k},2 C${-26 * k},-30 ${-6 * k},-50 ${-18 * k},-82 M${-6 * k},-50 C${10 * k},-70 ${16 * k},-80 ${22 * k},-104 M${14 * k},4 C${18 * k},-26 ${30 * k},-46 ${34 * k},-70`}
          stroke={style.nailLen > 10 ? '#2b3550' : '#7a4f62'}
          strokeOpacity={style.nailLen > 10 ? 0.8 : 0.45}
          strokeWidth={3}
          fill="none"
        />
      )}
      {style.wrinkles && (
        <g stroke={style.shade} strokeOpacity={0.55} strokeWidth={1.4} fill="none">
          <path d="M-36,-96 q8,-4 16,0 M-10,-104 q8,-4 16,0 M18,-100 q8,-4 14,0" />
          <path d="M-30,-20 q20,6 40,-2 M-24,-8 q16,4 30,0" />
        </g>
      )}
      {/* knuckle bumps */}
      {FINGERS.map((f, i) => (
        <ellipse key={i} cx={f.bx * k} cy={f.by + 8} rx={f.w * k * 0.5} ry={7} fill={style.rim} opacity={0.12 * light} />
      ))}
      {fingerEls}
      {showSleeve && style.sleeve && (
        <g>
          <path
            d={`M${-80},60 C${-100},${style.sleeveLen! * 0.5} ${-110},${style.sleeveLen} ${-120},${style.sleeveLen! + 40} L${120},${style.sleeveLen! + 40} C${110},${style.sleeveLen} ${104},${style.sleeveLen! * 0.5} ${84},40 Z`}
            fill={style.sleeve}
          />
          <path d={`M${-84},54 Q0,78 ${86},54 L${86},82 Q0,106 ${-84},82 Z`} fill={style.cuff} />
          <path d={`M${-84},54 Q0,78 ${86},54`} stroke={style.rim} strokeOpacity={0.2 * light} strokeWidth={2} fill="none" />
        </g>
      )}
    </g>
  );
};

export const POSES = {
  flat: {curls: [0.1, 0.05, 0.05, 0.08, 0.1], spread: 1} as HandPose,
  relaxed: {curls: [0.3, 0.35, 0.4, 0.5, 0.55], spread: 0.9} as HandPose,
  point: {curls: [0.5, 0.0, 1.1, 1.2, 1.25], spread: 0.8} as HandPose,
  claw: {curls: [0.4, 0.7, 0.75, 0.8, 0.85], spread: 1.5} as HandPose,
  fist: {curls: [0.9, 1.45, 1.5, 1.5, 1.45], spread: 0.7} as HandPose,
  reach: {curls: [0.2, 0.15, 0.12, 0.2, 0.28], spread: 1.35, thumbOut: 0.2} as HandPose,
};

export const lerpPose = (a: HandPose, b: HandPose, t: number): HandPose => ({
  curls: a.curls.map((c, i) => c + (b.curls[i] - c) * t) as HandPose['curls'],
  spread: (a.spread ?? 1) + ((b.spread ?? 1) - (a.spread ?? 1)) * t,
  thumbOut: (a.thumbOut ?? 0) + ((b.thumbOut ?? 0) - (a.thumbOut ?? 0)) * t,
});

/** Local (pre-transform) position of the index nail tip for a given style/pose. */
export const indexTip = (style: HandStyle, pose: HandPose): [number, number] => {
  const k = style.thin;
  const f = FINGERS[0];
  const ang = (f.splay * (pose.spread ?? 1) * Math.PI) / 180;
  let p: [number, number] = [f.bx * k, f.by];
  let cum = 0;
  f.segs.forEach((L, j) => {
    cum += pose.curls[1] * (j === 0 ? 0.8 : 1.05);
    const proj = L * (style.fingerLen ?? 1) * Math.max(0.06, Math.cos(Math.min(cum, 1.5)));
    p = [p[0] + Math.sin(ang) * proj, p[1] - Math.cos(ang) * proj];
  });
  const nl = style.nailLen * Math.max(0.05, Math.cos(Math.min(cum, 1.5))) + 4;
  return [p[0] + Math.sin(ang) * nl, p[1] - Math.cos(ang) * nl];
};

/** World position of the wrist so that the index nail tip lands on (tx, ty). */
export const wristFor = (tx: number, ty: number, rotDeg: number, scale: number, style: HandStyle, pose: HandPose, mirror = false): [number, number] => {
  const [lx0, ly] = indexTip(style, pose);
  const lx = mirror ? -lx0 : lx0;
  const a = (rotDeg * Math.PI) / 180;
  const wx = (lx * Math.cos(a) - ly * Math.sin(a)) * scale;
  const wy = (lx * Math.sin(a) + ly * Math.cos(a)) * scale;
  return [tx - wx, ty - wy];
};
```

### Appendix 13: `src/kit/art/Room.tsx`

```tsx
import React from 'react';
import {rng, lerpColor} from '../util';
import {theme} from '../theme';

/* ---------------- Wall with faint damask ---------------- */
export const Wall: React.FC<{id: string; x: number; y: number; w: number; h: number; warm?: number; lit?: number}> = ({
  id,
  x,
  y,
  w,
  h,
  warm = 0,
  lit = 1,
}) => {
  const base = lerpColor(theme.wall, theme.warmWall, warm);
  const pat = lerpColor('#151b26', '#3d200d', warm);
  return (
    <g>
      <defs>
        <pattern id={`${id}-dam`} width="120" height="170" patternUnits="userSpaceOnUse">
          <path
            d="M60,10 C80,40 100,50 96,80 C92,104 72,100 66,118 C62,132 70,150 60,160 C50,150 58,132 54,118 C48,100 28,104 24,80 C20,50 40,40 60,10 Z
               M60,52 C66,64 74,70 72,84 C70,92 64,92 60,100 C56,92 50,92 48,84 C46,70 54,64 60,52 Z"
            fill={pat}
            fillRule="evenodd"
            opacity={0.55 * lit}
          />
          <circle cx="0" cy="85" r="5" fill={pat} opacity={0.5 * lit} />
          <circle cx="120" cy="85" r="5" fill={pat} opacity={0.5 * lit} />
        </pattern>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={base} />
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-dam)`} />
    </g>
  );
};

/* ---------------- Window sill (inside) ---------------- */
export const Sill: React.FC<{x: number; y: number; w: number; depth: number; front: number; warm?: number; lit?: number}> = ({
  x,
  y,
  w,
  depth,
  front,
  warm = 0,
  lit = 1,
}) => {
  const top = lerpColor('#2b2f38', '#8a5228', warm);
  const face = lerpColor('#0d0f13', '#3a1c0b', warm);
  return (
    <g>
      {/* top face in perspective: back edge narrower */}
      <path d={`M${x + 20},${y} L${x + w - 20},${y} L${x + w},${y + depth} L${x},${y + depth} Z`} fill={top} opacity={0.6 + 0.4 * lit} />
      <path d={`M${x},${y + depth} L${x + w},${y + depth}`} stroke="#c8d3e3" strokeOpacity={0.25 * lit} strokeWidth={3} />
      <rect x={x - 8} y={y + depth} width={w + 16} height={front} fill={face} />
      <rect x={x - 8} y={y + depth + front} width={w + 16} height={10} fill="#000" opacity={0.6} />
      {/* wood grain */}
      {[0.25, 0.5, 0.75].map((f, i) => (
        <path key={i} d={`M${x + 30},${y + depth * f} C${x + w * 0.4},${y + depth * f - 3} ${x + w * 0.6},${y + depth * f + 3} ${x + w - 30},${y + depth * f}`} stroke="#000" strokeOpacity={0.25} strokeWidth={1.5} fill="none" />
      ))}
    </g>
  );
};

/* ---------------- Heavy curtains ---------------- */
export const Curtain: React.FC<{id: string; x: number; y: number; w: number; h: number; side: -1 | 1; t: number; billow?: number; warm?: number}> = ({
  id,
  x,
  y,
  w,
  h,
  side,
  t,
  billow = 0,
  warm = 0,
}) => {
  const folds = 6;
  const c1 = lerpColor('#120609', '#3a0e0a', warm);
  const c2 = lerpColor('#2a0d14', '#6a1c10', warm);
  // inner edge sways; billow pushes bottom inward toward window center
  const inner = side < 0 ? x + w : x;
  const outer = side < 0 ? x : x + w;
  const pts: string[] = [];
  const N = 12;
  for (let i = 0; i <= N; i++) {
    const v = i / N;
    const sway = Math.sin(t * 2.4 + v * 5) * (6 + billow * 60) * v + billow * 140 * v * v;
    pts.push(`${inner - side * sway},${y + v * h}`);
  }
  const d = `M${outer},${y} L${pts.join(' L')} L${outer},${y + h} Z`;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-fold`} x1="0" y1="0" x2={1 / folds} y2="0" spreadMethod="repeat">
          <stop offset="0" stopColor={c1} />
          <stop offset="0.45" stopColor={c2} />
          <stop offset="0.7" stopColor={c1} />
          <stop offset="1" stopColor="#050203" />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id}-fold)`} />
      <path d={`M${inner},${y} L${pts.join(' L')}`} stroke="#9fb4cf" strokeOpacity={0.12 + billow * 0.15} strokeWidth={3} fill="none" />
    </g>
  );
};

/* ---------------- Moonlight shaft & dust ---------------- */
export const MoonBeam: React.FC<{id: string; poly: string; t: number; opacity?: number; color?: string; dust?: number; bounds: [number, number, number, number]}> = ({
  id,
  poly,
  t,
  opacity = 0.18,
  color = theme.coldLight,
  dust = 40,
  bounds,
}) => {
  const r = rng(5);
  const [bx, by, bw, bh] = bounds;
  return (
    <g style={{mixBlendMode: 'screen'}}>
      <defs>
        <filter id={`${id}-bb`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <clipPath id={`${id}-bc`}>
          <polygon points={poly} />
        </clipPath>
      </defs>
      <polygon points={poly} fill={color} opacity={opacity} filter={`url(#${id}-bb)`} />
      <g clipPath={`url(#${id}-bc)`}>
        {Array.from({length: dust}, (_, i) => {
          const sx = r() * bw;
          const sy = r() * bh;
          const sp = 6 + r() * 14;
          const px = bx + ((sx + Math.sin(t * 0.4 + i) * 30 + t * sp * 0.5) % bw);
          const py = by + ((sy + t * sp) % bh);
          return <circle key={i} cx={px} cy={py} r={0.8 + r() * 2.2} fill="#e8eef7" opacity={0.25 + 0.4 * Math.abs(Math.sin(t + i))} />;
        })}
      </g>
    </g>
  );
};

/* ---------------- Floorboards (seen from above at a slant) ---------------- */
export const Floor: React.FC<{id: string; x: number; y: number; w: number; h: number; lit?: number}> = ({id, x, y, w, h, lit = 1}) => {
  const r = rng(91);
  const boards = 9;
  const bw = w / boards;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#0b0a09" />
      {Array.from({length: boards}, (_, i) => {
        const shade = 0.75 + r() * 0.5;
        const c = lerpColor('#0e0c0a', '#2a241e', (shade - 0.75) * lit);
        const seams = [r() * h * 0.5, h * 0.5 + r() * h * 0.5];
        return (
          <g key={i}>
            <rect x={x + i * bw} y={y} width={bw - 4} height={h} fill={c} />
            <line x1={x + i * bw - 2} y1={y} x2={x + i * bw - 2} y2={y + h} stroke="#000" strokeWidth={5} />
            {seams.map((sy, j) => (
              <line key={j} x1={x + i * bw} y1={y + sy} x2={x + (i + 1) * bw - 4} y2={y + sy} stroke="#000" strokeWidth={3} opacity={0.8} />
            ))}
            {Array.from({length: 3}, (_, j) => (
              <path
                key={j}
                d={`M${x + i * bw + 12 + j * bw * 0.28},${y} C${x + i * bw + 20 + j * bw * 0.28},${y + h * 0.3} ${x + i * bw + 4 + j * bw * 0.28},${y + h * 0.6} ${x + i * bw + 14 + j * bw * 0.28},${y + h}`}
                stroke="#000"
                strokeOpacity={0.22}
                strokeWidth={1.4}
                fill="none"
              />
            ))}
          </g>
        );
      })}
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-ff)`} />
      <defs>
        <linearGradient id={`${id}-ff`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
    </g>
  );
};

/* ---------------- Rice ---------------- */
export const Grain: React.FC<{x: number; y: number; rot: number; s?: number; lit?: number; warm?: number; glint?: number}> = ({
  x,
  y,
  rot,
  s = 1,
  lit = 1,
  warm = 0,
  glint = 0,
}) => {
  const body = lerpColor(lerpColor('#6f7684', theme.rice, lit), '#f3c98a', warm);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx={1.2} cy={1.8} rx={7.6} ry={3.2} fill="#000" opacity={0.6} />
      <path d="M-7.5,0 C-6,-3.4 5,-3.4 7.5,-0.4 C6,3 -5,3 -7.5,0 Z" fill={body} />
      <path d="M-5.5,-0.6 C-2,-1.8 3,-1.8 5.5,-0.6" stroke="#fff" strokeOpacity={0.35 + glint * 0.65} strokeWidth={1.1} fill="none" />
      <path d="M-5,1.4 C-1,2.2 3,2.2 5.5,1" stroke="#000" strokeOpacity={0.25} strokeWidth={0.8} fill="none" />
      {glint > 0 && <circle cx={-2} cy={-1} r={6 + glint * 10} fill="#fff6e0" opacity={glint * 0.35} />}
    </g>
  );
};

export type GrainSpec = {x: number; y: number; rot: number};
/** A tidy mound of ten grains centred at (cx, cy). */
export const pileOf10 = (cx: number, cy: number, seed: number, spread = 1): GrainSpec[] => {
  const r = rng(seed);
  const out: GrainSpec[] = [];
  const ring = [
    [0, 0],
    [-9, -4],
    [9, -3],
    [-6, 6],
    [7, 7],
    [0, -10],
    [-14, 3],
    [15, 4],
    [-3, 13],
    [4, -2],
  ];
  ring.forEach(([dx, dy]) => out.push({x: cx + dx * spread + (r() - 0.5) * 3, y: cy + dy * spread * 0.8 + (r() - 0.5) * 3, rot: r() * 180}));
  return out;
};

/** Loose scatter of grains in a rectangle. */
export const scatter = (n: number, x: number, y: number, w: number, h: number, seed: number): GrainSpec[] => {
  const r = rng(seed);
  return Array.from({length: n}, () => ({x: x + r() * w, y: y + r() * h, rot: r() * 180}));
};
```

### Appendix 14: `src/kit/art/Props.tsx`

```tsx
import React from 'react';
import {noise1, rng} from '../util';
import {theme} from '../theme';

/* ---------------- Candle ---------------- */
export const Candle: React.FC<{x: number; y: number; t: number; s?: number; glow?: number}> = ({x, y, t, s = 1, glow = 1}) => {
  const fl = noise1(t * 7, 2);
  const fl2 = noise1(t * 11, 5);
  const fh = 58 + fl * 8;
  const lean = fl2 * 5;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <radialGradient id="candle-glow">
          <stop offset="0" stopColor="#ffd28a" stopOpacity={0.55 * glow} />
          <stop offset="0.3" stopColor="#ff9a3c" stopOpacity={0.2 * glow} />
          <stop offset="1" stopColor="#ff7a20" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="candle-wax" x1="0" x2="1">
          <stop offset="0" stopColor="#f6d9a8" />
          <stop offset="0.5" stopColor="#d9b07a" />
          <stop offset="1" stopColor="#6e4a26" />
        </linearGradient>
      </defs>
      <circle cx={0} cy={-150} r={520 + fl * 30} fill="url(#candle-glow)" />
      {/* holder */}
      <ellipse cx={0} cy={6} rx={78} ry={18} fill="#2a160a" />
      <ellipse cx={0} cy={0} rx={70} ry={14} fill="#6a4020" />
      <path d="M-26,-4 L-26,-150 Q0,-160 26,-150 L26,-4 Z" fill="url(#candle-wax)" />
      <path d="M-26,-150 Q-24,-120 -30,-100 Q-22,-110 -20,-148 Z" fill="#f4dcae" />
      <ellipse cx={0} cy={-150} rx={26} ry={6} fill="#f8e2b6" />
      <line x1={0} y1={-152} x2={0} y2={-166} stroke="#1a0e06" strokeWidth={3} />
      {/* flame */}
      <path d={`M0,-160 C-14,-172 -10,${-180 - fh * 0.4} ${lean},${-160 - fh} C10,${-180 - fh * 0.4} 14,-172 0,-160 Z`} fill="#ffb347" opacity={0.95} />
      <path d={`M0,-162 C-7,-170 -5,${-176 - fh * 0.3} ${lean * 0.7},${-166 - fh * 0.6} C5,${-176 - fh * 0.3} 7,-170 0,-162 Z`} fill="#fff3c8" />
      <ellipse cx={0} cy={-164} rx={4} ry={6} fill="#3a6aff" opacity={0.5} />
    </g>
  );
};

/* ---------------- Clock (brass twin-bell alarm) ---------------- */
export const Clock: React.FC<{x: number; y: number; s?: number; t: number; lit?: number}> = ({x, y, s = 1, t, lit = 1}) => {
  const secAng = Math.floor(t) * 6; // ticking second hand
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <path d={`M${sd * 70},-150 A60,60 0 0 1 ${sd * 70 + 20 * sd},-150`} fill="none" />
          <circle cx={sd * 92} cy={-158} r={42} fill="#3a2c18" />
          <circle cx={sd * 92 - 10} cy={-170} r={16} fill="#c8a96a" opacity={0.25 * lit} />
          <rect x={sd * 70 - 6} y={-128} width={12} height={22} fill="#2a1f10" transform={`rotate(${sd * -30} ${sd * 70} -118)`} />
        </g>
      ))}
      <path d="M-30,-182 Q0,-212 30,-182" stroke="#2a1f10" strokeWidth={10} fill="none" />
      <rect x={-80} y={110} width={20} height={34} rx={6} fill="#1f170c" transform="rotate(20 -70 120)" />
      <rect x={60} y={110} width={20} height={34} rx={6} fill="#1f170c" transform="rotate(-20 70 120)" />
      <circle cx={0} cy={0} r={135} fill="#2c2214" />
      <circle cx={0} cy={0} r={135} fill="none" stroke="#b08f55" strokeOpacity={0.35 * lit} strokeWidth={4} />
      <circle cx={0} cy={0} r={112} fill="#b9b2a0" />
      <circle cx={0} cy={0} r={112} fill="#0b0d12" opacity={0.55} />
      {Array.from({length: 12}, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={Math.sin(a) * 92} y1={-Math.cos(a) * 92} x2={Math.sin(a) * 104} y2={-Math.cos(a) * 104} stroke="#101010" strokeWidth={i % 3 === 0 ? 7 : 3} />;
      })}
      {['XII', 'III', 'VI', 'IX'].map((n, i) => {
        const a = (i / 4) * Math.PI * 2;
        return (
          <text key={n} x={Math.sin(a) * 72} y={-Math.cos(a) * 72 + 10} fontSize={26} textAnchor="middle" fill="#111" fontFamily={theme.fonts.caption} fontWeight={600}>
            {n}
          </text>
        );
      })}
      {/* hands at 3:00 */}
      <line x1={0} y1={0} x2={0} y2={-86} stroke="#080808" strokeWidth={7} strokeLinecap="round" />
      <line x1={0} y1={0} x2={58} y2={0} stroke="#080808" strokeWidth={10} strokeLinecap="round" />
      <line x1={0} y1={14} x2={0} y2={-96} stroke={theme.blood} strokeWidth={2.5} transform={`rotate(${secAng})`} />
      <circle cx={0} cy={0} r={8} fill="#111" />
      {/* glass glint */}
      <path d="M-80,-60 A100,100 0 0 1 -20,-100" stroke="#dfe8f5" strokeOpacity={0.3 * lit} strokeWidth={6} fill="none" strokeLinecap="round" />
    </g>
  );
};

/* ---------------- Portrait with mourning ribbon ---------------- */
export const Portrait: React.FC<{x: number; y: number; s?: number; lit?: number}> = ({x, y, s = 1, lit = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <defs>
      <radialGradient id="ptr-bg">
        <stop offset="0" stopColor="#8a7458" />
        <stop offset="1" stopColor="#2a2016" />
      </radialGradient>
      <clipPath id="ptr-clip">
        <ellipse cx={0} cy={0} rx={70} ry={92} />
      </clipPath>
    </defs>
    {/* easel back */}
    <path d="M-20,90 L-60,170 M20,90 L60,170" stroke="#1a140e" strokeWidth={8} />
    <ellipse cx={0} cy={0} rx={98} ry={122} fill="#3b2a12" />
    <ellipse cx={0} cy={0} rx={98} ry={122} fill="none" stroke="#c9a35a" strokeOpacity={0.5 * lit} strokeWidth={5} />
    <ellipse cx={0} cy={0} rx={84} ry={106} fill="none" stroke="#1a1006" strokeWidth={12} />
    <g clipPath="url(#ptr-clip)">
      <ellipse cx={0} cy={0} rx={70} ry={92} fill="url(#ptr-bg)" />
      {/* sitter: old woman, hair in a bun, high collar */}
      <circle cx={0} cy={-58} r={18} fill="#2e2418" />
      <ellipse cx={0} cy={-22} rx={30} ry={38} fill="#3a2d1e" />
      <path d="M-30,-30 Q0,-70 30,-30 Q24,-56 0,-60 Q-24,-56 -30,-30 Z" fill="#cfc4b0" opacity={0.6} />
      <path d="M-70,100 Q-60,30 -26,18 Q0,30 26,18 Q60,30 70,100 Z" fill="#1c150d" />
      <path d="M-12,16 L0,40 L12,16" fill="#d8ccb8" opacity={0.5} />
      <ellipse cx={-10} cy={-24} rx={4} ry={2} fill="#120c06" />
      <ellipse cx={10} cy={-24} rx={4} ry={2} fill="#120c06" />
    </g>
    <ellipse cx={-20} cy={-40} rx={30} ry={60} fill="#fff" opacity={0.06 * lit} transform="rotate(-20)" />
    {/* black ribbon across the corner */}
    <path d="M40,-122 L100,-62 L84,-46 L24,-106 Z" fill="#050505" />
    <path d="M62,-84 l-30,40 l10,6 z M62,-84 l40,30 l-8,8 z" fill="#0a0a0a" />
    <path d="M40,-122 L100,-62" stroke="#666" strokeOpacity={0.3 * lit} strokeWidth={2} />
  </g>
);

/* ---------------- Ornate mirror with optional reflection content ---------------- */
export const Mirror: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  lit?: number;
  id: string;
  children?: React.ReactNode; // reflection, drawn in mirror-local coords (0..w, 0..h)
}> = ({x, y, w, h, lit = 1, id, children}) => {
  const glass = `M${x},${y + w * 0.35} A${w / 2},${w * 0.35} 0 0 1 ${x + w},${y + w * 0.35} L${x + w},${y + h} L${x},${y + h} Z`;
  const f = 46;
  const outer = `M${x - f},${y + w * 0.35} A${w / 2 + f},${w * 0.35 + f} 0 0 1 ${x + w + f},${y + w * 0.35} L${x + w + f},${y + h + f} L${x - f},${y + h + f} Z`;
  const gold = '#6b5326';
  const goldLit = '#d9b66a';
  return (
    <g>
      <defs>
        <clipPath id={`${id}-glass`}>
          <path d={glass} />
        </clipPath>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={goldLit} stopOpacity={0.6 * lit} />
          <stop offset="0.4" stopColor={gold} />
          <stop offset="1" stopColor="#120c04" />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dfe8f5" stopOpacity={0.12 * lit} />
          <stop offset="0.35" stopColor="#dfe8f5" stopOpacity="0" />
          <stop offset="0.6" stopColor="#dfe8f5" stopOpacity={0.05 * lit} />
          <stop offset="1" stopColor="#dfe8f5" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* crest */}
      <path
        d={`M${x + w / 2},${y - f - 110} C${x + w / 2 + 60},${y - f - 90} ${x + w / 2 + 120},${y - f - 40} ${x + w / 2 + 170},${y - f + 10}
           C${x + w / 2 + 120},${y - f + 0} ${x + w / 2 + 70},${y - f - 30} ${x + w / 2 + 30},${y - f - 20}
           L${x + w / 2},${y - f + 20} L${x + w / 2 - 30},${y - f - 20}
           C${x + w / 2 - 70},${y - f - 30} ${x + w / 2 - 120},${y - f + 0} ${x + w / 2 - 170},${y - f + 10}
           C${x + w / 2 - 120},${y - f - 40} ${x + w / 2 - 60},${y - f - 90} ${x + w / 2},${y - f - 110} Z`}
        fill={`url(#${id}-gold)`}
      />
      <circle cx={x + w / 2} cy={y - f - 50} r={22} fill="#120c04" stroke={goldLit} strokeOpacity={0.4 * lit} strokeWidth={3} />
      <path d={outer} fill={`url(#${id}-gold)`} />
      <path d={outer} fill="none" stroke="#000" strokeWidth={4} />
      {/* beading */}
      <path d={outer} fill="none" stroke={goldLit} strokeOpacity={0.35 * lit} strokeWidth={6} strokeDasharray="4 12" transform={`translate(${w * 0.0},0)`} />
      <path d={glass} fill="#06080c" stroke="#120c04" strokeWidth={14} />
      <g clipPath={`url(#${id}-glass)`}>
        <g transform={`translate(${x},${y})`}>{children}</g>
        <path d={glass} fill={`url(#${id}-sheen)`} />
        {/* age spots / desilvering */}
        {(() => {
          const r = rng(4);
          return Array.from({length: 18}, (_, i) => (
            <circle key={i} cx={x + r() * w} cy={y + h * 0.75 + r() * h * 0.25} r={3 + r() * 14} fill="#000" opacity={0.12 + r() * 0.15} style={{filter: 'blur(3px)'}} />
          ));
        })()}
      </g>
      <path d={glass} fill="none" stroke={goldLit} strokeOpacity={0.3 * lit} strokeWidth={2} />
    </g>
  );
};

/* ---------------- Mourning cloth draped over the mirror ---------------- */
export const Cloth: React.FC<{x: number; y: number; w: number; h: number; t: number; pull?: number; grabX?: number; id: string; lit?: number}> = ({
  x,
  y,
  w,
  h,
  t,
  pull = 0,
  grabX,
  id,
  lit = 1,
}) => {
  if (pull >= 1) return null;
  const gx = grabX ?? x + w / 2;
  const drop = pull * pull * (h + 900); // accelerates down as it slides off
  const pinch = Math.min(1, pull * 3); // gathers toward the grabbing hand
  const N = 14;
  const top: string[] = [];
  for (let i = 0; i <= N; i++) {
    const v = i / N;
    const px = x - 40 + v * (w + 80);
    const sag = Math.sin(v * Math.PI) * -30;
    const gathered = px + (gx - px) * pinch * 0.5;
    top.push(`${gathered},${y - 60 + sag + drop - Math.abs(px - gx) * pinch * 0.25}`);
  }
  const bottom: string[] = [];
  for (let i = N; i >= 0; i--) {
    const v = i / N;
    const px = x - 70 + v * (w + 140);
    const wave = Math.sin(v * 9 + t * 1.5) * 16 + Math.sin(v * 23) * 8;
    const gathered = px + (gx - px) * pinch * 0.35;
    bottom.push(`${gathered},${y + h * 0.82 + wave + drop * 1.05}`);
  }
  const d = `M${top.join(' L')} L${bottom.join(' L')} Z`;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-cf`} x1="0" y1="0" x2="0.085" y2="0" spreadMethod="repeat">
          <stop offset="0" stopColor="#030304" />
          <stop offset="0.4" stopColor="#15161b" />
          <stop offset="0.55" stopColor="#25272e" stopOpacity={lit} />
          <stop offset="0.8" stopColor="#08080a" />
          <stop offset="1" stopColor="#030304" />
        </linearGradient>
        <linearGradient id={`${id}-cv`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id}-cf)`} />
      <path d={d} fill={`url(#${id}-cv)`} />
      <path d={`M${top.join(' L')}`} stroke="#8fa3c0" strokeOpacity={0.18 * lit} strokeWidth={3} fill="none" />
    </g>
  );
};

/* ---------------- Gran: candle-lit profile silhouette, finger to lips ---------------- */
const GRAN_PROFILE = `M120,330 C112,250 118,190 150,120 C180,60 190,-20 176,-90 C160,-160 110,-215 30,-222
  C-40,-228 -95,-195 -112,-130 C-120,-100 -124,-75 -126,-58 C-128,-46 -120,-40 -122,-28
  C-126,-12 -150,14 -176,40 C-184,50 -172,60 -150,60 C-142,62 -138,70 -144,78
  C-150,84 -152,90 -142,96 C-136,100 -148,106 -146,114 C-142,122 -128,124 -128,134
  C-132,150 -134,166 -122,180 C-104,196 -78,196 -62,214 C-54,240 -56,280 -58,330 Z`;

/** Elderly woman in profile, hair in a bun, half-moon glasses, rim-lit by a candle at her left; raises a finger to her lips. */
export const ElderProfile: React.FC<{x: number; y: number; s: number; t: number; finger: number; lean: number}> = ({x, y, s, t, finger, lean}) => {
  const breathe = Math.sin(t * 1.6) * 3;
  const fl = 0.85 + noise1(t * 8, 3) * 0.15;
  return (
    <g transform={`translate(${x},${y + breathe}) rotate(${lean * -7}) scale(${s})`}>
      <defs>
        <linearGradient id="gran-rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffc070" stopOpacity={0.95 * fl} />
          <stop offset="0.18" stopColor="#ff8a2a" stopOpacity={0.45 * fl} />
          <stop offset="0.45" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <clipPath id="gran-clip">
          <path d={GRAN_PROFILE} />
          <circle cx={128} cy={-196} r={64} />
        </clipPath>
      </defs>
      {/* shawl & shoulders */}
      <path d="M-260,760 C-250,520 -170,380 -70,330 L150,320 C300,360 420,520 460,760 Z" fill="#090403" />
      <path d="M-260,760 C-250,520 -170,380 -70,330" stroke="#ff9a40" strokeOpacity={0.5 * fl} strokeWidth={5} fill="none" />
      {/* knitted texture on shawl */}
      {Array.from({length: 6}, (_, i) => (
        <path key={i} d={`M${-200 + i * 30},${760} C${-180 + i * 34},${560} ${-120 + i * 40},${420} ${-40 + i * 40},${350}`} stroke="#2a1208" strokeWidth={3} fill="none" opacity={0.7} />
      ))}
      {/* bun with hairpins */}
      <circle cx={128} cy={-196} r={64} fill="#0b0503" />
      <path d="M100,-250 l40,30 M150,-250 l-20,40" stroke="#c89a64" strokeOpacity={0.5} strokeWidth={3} />
      <path d={GRAN_PROFILE} fill="#0b0503" />
      {/* candle rim on the face edge (inner stroke) */}
      <g clipPath="url(#gran-clip)">
        <path d={GRAN_PROFILE} fill="none" stroke="url(#gran-rim)" strokeWidth={18} />
        <circle cx={128} cy={-196} r={64} fill="none" stroke="url(#gran-rim)" strokeWidth={12} />
      </g>
      {/* hair strands */}
      <path d="M-100,-150 C-60,-215 40,-232 120,-200 M-110,-120 C-80,-190 0,-222 80,-214" stroke="#ffcf9a" strokeOpacity={0.35 * fl} strokeWidth={2} fill="none" />
      {/* half-moon spectacles glint & a wet eye */}
      <path d="M-128,-34 Q-108,-18 -86,-30" stroke="#ffd9a8" strokeOpacity={0.75 * fl} strokeWidth={3} fill="none" />
      <circle cx={-104} cy={-44} r={3.5} fill="#ffe2b8" opacity={0.9} />
      <line x1={-86} y1={-32} x2={40} y2={-60} stroke="#3a1a0c" strokeWidth={2} />
      {/* finger raised to the lips */}
      <g transform={`translate(0,${(1 - finger) * 460})`}>
        <path d="M-196,300 C-200,200 -196,110 -186,80 C-180,64 -162,62 -158,80 C-152,120 -150,220 -146,300 Z" fill="#0d0604" />
        <path d="M-196,300 C-200,200 -196,110 -186,80 C-182,70 -174,66 -168,68" stroke="#ffb45a" strokeOpacity={0.85 * fl} strokeWidth={5} fill="none" />
        <path d="M-236,290 C-250,350 -240,430 -200,470 L-90,470 C-80,420 -90,330 -130,290 Z" fill="#0d0604" />
        <path d="M-236,290 C-250,350 -240,430 -200,470" stroke="#ffb45a" strokeOpacity={0.55 * fl} strokeWidth={5} fill="none" />
        <path d="M-226,330 q20,-6 36,4 M-232,372 q22,-6 40,4" stroke="#ffb45a" strokeOpacity={0.3} strokeWidth={3} fill="none" />
      </g>
    </g>
  );
};

/** Alias kept for The Count episodes. */
export const GranSilhouette = ElderProfile;

/* ---------------- Duvet edge with a child's small fingers gripping it ---------------- */
export const Duvet: React.FC<{y: number; t: number; warm?: number; grip?: number}> = ({y, t, warm = 0, grip = 1}) => {
  const top = (x: number) => y + Math.sin(x * 0.012 + 1) * 18 + Math.sin(x * 0.031) * 8;
  const pts = Array.from({length: 28}, (_, i) => -40 + i * 45).map((x) => `${x},${top(x)}`);
  const fingers = (cx: number, side: number) =>
    [0, 1, 2, 3].map((i) => {
      const fx = cx + side * i * 34;
      const fy = top(fx) - 20 * grip + Math.sin(t * 3 + i) * 1.5 * grip;
      return (
        <g key={i} transform={`translate(${fx},${fy}) rotate(${side * (i - 1.5) * 4})`}>
          <rect x={-15} y={-6} width={30} height={64} rx={15} fill={warm > 0.5 ? '#d9a27a' : '#7d8090'} />
          <rect x={-15} y={-6} width={30} height={64} rx={15} fill="#000" opacity={0.35} />
          <ellipse cx={0} cy={4} rx={9} ry={8} fill={warm > 0.5 ? '#f0cdb0' : '#a5a9b8'} opacity={0.9} />
          <path d="M-10,22 q10,4 20,0" stroke="#000" strokeOpacity={0.35} strokeWidth={2} fill="none" />
          <path d="M-13,0 q-2,20 0,40" stroke={warm > 0.5 ? '#ffd2a0' : '#c5d2e4'} strokeOpacity={0.5} strokeWidth={3} fill="none" />
        </g>
      );
    });
  return (
    <g>
      <defs>
        <linearGradient id="duvet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={warm > 0.5 ? '#6a4630' : '#3a4256'} />
          <stop offset="0.15" stopColor={warm > 0.5 ? '#3a2416' : '#1a1f2c'} />
          <stop offset="1" stopColor="#040508" />
        </linearGradient>
      </defs>
      <path d={`M-40,2100 L${pts.join(' L')} L1300,2100 Z`} fill="url(#duvet)" />
      {/* quilting */}
      {[0.12, 0.3, 0.5].map((f, i) => (
        <path key={i} d={`M-40,${y + 140 + i * 130} Q540,${y + 110 + i * 130} 1300,${y + 150 + i * 130}`} stroke="#000" strokeOpacity={0.35} strokeWidth={4} fill="none" />
      ))}
      <path d={`M${pts.join(' L')}`} stroke={warm > 0.5 ? '#ffcf9a' : '#9fb4cf'} strokeOpacity={0.35} strokeWidth={4} fill="none" />
      {fingers(330, -1)}
      {fingers(750, 1)}
    </g>
  );
};

/* ---------------- Gran's hand tipping a tin cup ---------------- */
export const CupHand: React.FC<{x: number; y: number; tilt: number; s?: number; warm?: number}> = ({x, y, tilt, s = 1, warm = 1}) => {
  const skin = warm > 0.5 ? theme.granSkin : '#8d8a86';
  const shade = warm > 0.5 ? theme.granSkinShade : '#3a3836';
  const rim = warm > 0.5 ? '#ffd3a0' : '#c5d2e4';
  const a = (tilt * Math.PI) / 180;
  const rot = (px: number, py: number) => [px * Math.cos(a) - py * Math.sin(a), px * Math.sin(a) + py * Math.cos(a)];
  const [wx, wy] = rot(95, 10);
  // forearm: from the wrist out to the upper right, off frame
  const ex = wx + 520;
  const ey = wy - 560;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d={`M${wx - 30},${wy - 70} C${wx + 120},${wy - 200} ${ex - 200},${ey + 120} ${ex - 60},${ey - 60} L${ex + 120},${ey + 80} C${ex - 60},${ey + 260} ${wx + 160},${wy + 40} ${wx + 40},${wy + 80} Z`} fill={skin} />
      <path d={`M${wx + 40},${wy - 100} C${wx + 160},${wy - 230} ${ex - 160},${ey + 60} ${ex - 40},${ey - 100} L${ex + 220},${ey + 120} C${ex},${ey + 300} ${wx + 230},${wy + 30} ${wx + 110},${wy + 70} Z`} fill="#3a1f19" />
      <path d={`M${wx + 40},${wy - 100} C${wx + 160},${wy - 230} ${ex - 160},${ey + 60} ${ex - 40},${ey - 100}`} stroke={rim} strokeOpacity={0.35} strokeWidth={5} fill="none" />
      <path d={`M${wx + 40},${wy - 100} L${wx + 110},${wy + 70}`} stroke="#4e2a20" strokeWidth={26} strokeLinecap="round" />
      <g transform={`rotate(${tilt})`}>
        <defs>
          <linearGradient id="cup-sheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.6" />
            <stop offset="0.35" stopColor={rim} stopOpacity="0.5" />
            <stop offset="0.5" stopColor="#000" stopOpacity="0.1" />
            <stop offset="1" stopColor="#000" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path d="M-150,-70 L50,-70 L40,90 L-140,90 Z" fill="#6d6a66" />
        <path d="M-150,-70 L50,-70 L40,90 L-140,90 Z" fill="url(#cup-sheen)" />
        <ellipse cx={-50} cy={-70} rx={100} ry={18} fill="#1d1b19" />
        <ellipse cx={-50} cy={-70} rx={100} ry={18} fill="none" stroke={rim} strokeOpacity={0.6} strokeWidth={4} />
        <ellipse cx={-50} cy={-66} rx={80} ry={10} fill={theme.rice} opacity={0.8} />
        {/* back of the hand */}
        <path d="M40,-60 C90,-70 120,-30 120,20 C120,60 90,80 50,76 Z" fill={skin} stroke={shade} strokeWidth={4} />
        <path d="M60,-40 C80,-20 84,20 70,50 M80,-46 C100,-20 102,20 92,50" stroke={shade} strokeOpacity={0.5} strokeWidth={2.5} fill="none" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <path
              d={`M60,${-40 + i * 34} C20,${-48 + i * 34} -40,${-46 + i * 34} -70,${-30 + i * 34} C-80,${-20 + i * 34} -70,${-6 + i * 34} -56,${-10 + i * 34} C-30,${-20 + i * 34} 20,${-16 + i * 34} 60,${-8 + i * 34} Z`}
              fill={skin}
              stroke={shade}
              strokeWidth={4}
            />
            <path d={`M30,${-38 + i * 34} C0,${-42 + i * 34} -40,${-40 + i * 34} -64,${-28 + i * 34}`} stroke={rim} strokeOpacity={0.5} strokeWidth={3} fill="none" />
            <path d={`M-20,${-38 + i * 34} q2,10 0,18 M14,${-38 + i * 34} q2,10 0,18`} stroke={shade} strokeWidth={2} fill="none" />
            <ellipse cx={-64} cy={-20 + i * 34} rx={9} ry={7} fill="#e8cdb8" />
          </g>
        ))}
        <path d="M70,-60 C40,-100 0,-104 -20,-92 C-30,-84 -20,-74 -8,-78 C20,-84 40,-80 60,-50 Z" fill={skin} stroke={shade} strokeWidth={4} />
        <circle cx={90} cy={0} r={5} fill="#6e4636" opacity={0.6} />
        <circle cx={100} cy={30} r={4} fill="#6e4636" opacity={0.5} />
      </g>
    </g>
  );
};
```

### Appendix 15: `src/kit/sets/WindowWall.tsx`

```tsx
import React from 'react';
import {GothicWindow} from '../art/Window';
import {Curtain, Grain, MoonBeam, Sill, Wall, GrainSpec} from '../art/Room';
import {rng} from '../util';

export const SILL_Y = 1180;
export const WIN = {cx: 540, w: 600, h: 1060};

/** Default line of small grains (rice, salt, seeds) along the inside sill, deterministic. */
export const SILL_GRAINS: GrainSpec[] = (() => {
  const r = rng(321);
  return Array.from({length: 110}, (_, i) => ({
    x: 250 + (i / 110) * 580 + (r() - 0.5) * 14,
    y: SILL_Y + 18 + r() * 34,
    rot: r() * 180,
  }));
})();

export const WindowWall: React.FC<{
  id: string;
  t: number;
  mode: 'night' | 'candle' | 'dawn';
  dawn?: number;
  warm?: number; // 0..1 candle tint on wall
  open?: number;
  billow?: number;
  wind?: number;
  cloudCover?: number;
  grains?: GrainSpec[]; // grains on the sill; defaults to SILL_GRAINS
  grainsVisible?: number; // fraction of sill grains shown (0..1)
  grainLit?: number;
  grainWarm?: number;
  extraBelow?: React.ReactNode; // things drawn on the wall/floor below sill
  children?: React.ReactNode; // drawn on top of sill
  beam?: number;
  wallH?: number;
  outside?: React.ReactNode;
}> = ({
  id,
  t,
  mode,
  dawn = 0,
  warm = 0,
  open = 0,
  billow = 0,
  wind = 1,
  cloudCover = 0.25,
  grains = SILL_GRAINS,
  grainsVisible = 0,
  grainLit = 0.6,
  grainWarm = 0,
  extraBelow,
  children,
  beam = 1,
  wallH = 2400,
  outside,
}) => {
  const n = Math.floor(grains.length * grainsVisible);
  return (
    <g>
      <Wall id={`${id}-wall`} x={-400} y={-600} w={1880} h={wallH} warm={warm} lit={0.6 + dawn * 0.6} />
      {/* moon wash on the wall around the window */}
      <ellipse cx={WIN.cx} cy={SILL_Y - 500} rx={620} ry={760} fill={mode === 'candle' ? '#ff9a3c' : '#6f86a6'} opacity={mode === 'candle' ? 0.08 : 0.07 + dawn * 0.12} />
      <GothicWindow
        id={`${id}-win`}
        cx={WIN.cx}
        yb={SILL_Y}
        w={WIN.w}
        h={WIN.h}
        t={t}
        light={mode}
        dawn={dawn}
        open={open}
        wind={wind}
        cloudCover={cloudCover}
        treeSway={1 + billow * 3}
        outside={outside}
      />
      <Sill x={WIN.cx - WIN.w / 2 - 90} y={SILL_Y} w={WIN.w + 180} depth={64} front={46} warm={warm} lit={0.6 + dawn} />
      {grains.slice(0, n).map((g, i) => (
        <Grain key={i} x={g.x} y={g.y} rot={g.rot} s={1.15} lit={grainLit} warm={grainWarm} />
      ))}
      {children}
      {extraBelow}
      <Curtain id={`${id}-cl`} x={-140} y={-500} w={330} h={1840} side={-1} t={t} billow={billow} warm={warm} />
      <Curtain id={`${id}-cr`} x={890} y={-500} w={330} h={1840} side={1} t={t + 1.3} billow={billow} warm={warm} />
      {/* curtain rod */}
      <rect x={-200} y={-520} width={1480} height={26} fill="#0a0806" />
      {beam > 0 && mode !== 'candle' && (
        <MoonBeam
          id={`${id}-beam`}
          poly={`${WIN.cx - 260},${SILL_Y - 900} ${WIN.cx + 300},${SILL_Y - 1000} ${WIN.cx + 420},${SILL_Y + 900} ${WIN.cx - 380},${SILL_Y + 900}`}
          t={t}
          opacity={0.07 * beam}
          bounds={[WIN.cx - 400, SILL_Y - 1000, 900, 1900]}
          dust={50}
        />
      )}
    </g>
  );
};
```

### Appendix 16: `src/kit/sets/DoorWall.tsx`

```tsx
import React from 'react';
import {GothicDoor} from '../art/Door';
import {Floor, MoonBeam, Wall} from '../art/Room';
import {Candle} from '../art/Props';

export const DOOR = {cx: 540, yb: 1500, w: 560, h: 1160};

/**
 * Standard door set, standing in a corridor or bedroom facing a door: damask wall, gothic door,
 * floorboards, optional candle sconce on the left and a cold moonbeam from an unseen window on the right.
 */
export const DoorWall: React.FC<{
  id: string;
  t: number;
  mode: 'night' | 'candle';
  open?: number;
  knock?: number;
  under?: number;
  underColor?: string;
  sconce?: boolean;
  beam?: number;
  beyond?: React.ReactNode;
  children?: React.ReactNode; // drawn in front of the door (hands, props on the floor)
}> = ({id, t, mode, open = 0, knock = 0, under = 0, underColor, sconce = mode === 'candle', beam = mode === 'night' ? 1 : 0, beyond, children}) => (
  <g>
    <Wall id={`${id}-wall`} x={-400} y={-600} w={1880} h={2200} warm={mode === 'candle' ? 1 : 0} lit={0.7} />
    <Floor id={`${id}-floor`} x={-400} y={DOOR.yb} w={1880} h={900} lit={0.7} />
    <rect x={-400} y={DOOR.yb - 70} width={1880} height={70} fill="#050608" />
    <GothicDoor
      id={`${id}-door`}
      cx={DOOR.cx}
      yb={DOOR.yb}
      w={DOOR.w}
      h={DOOR.h}
      t={t}
      light={mode}
      open={open}
      knock={knock}
      under={under}
      underColor={underColor}
      beyond={beyond}
    />
    {sconce && (
      <g>
        <rect x={60} y={980} width={120} height={22} fill="#1a120a" />
        <path d="M120,1002 L120,1060 Q120,1080 100,1090" stroke="#1a120a" strokeWidth={10} fill="none" />
        <Candle x={120} y={980} t={t} s={0.7} />
      </g>
    )}
    {beam > 0 && (
      <MoonBeam
        id={`${id}-beam`}
        poly="1180,200 1300,420 640,2000 240,2000"
        t={t}
        opacity={0.06 * beam}
        bounds={[200, 200, 1100, 1800]}
        dust={40}
      />
    )}
    {children}
  </g>
);
```

### Appendix 17: `src/kit/series/fonts.ts`

```ts
import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {theme} from '../theme';

/** Loads the style's three faces before the first frame renders. Call once in each composition. */
export const useStyleFonts = () => {
  const [handle] = useState(() => delayRender('style-fonts'));
  useEffect(() => {
    const faces = [
      new FontFace(theme.fonts.caption, `url(${staticFile('fonts/cormorant-garamond-latin-600-normal.woff2')})`, {weight: '600', style: 'normal'}),
      new FontFace(theme.fonts.caption, `url(${staticFile('fonts/cormorant-garamond-latin-600-italic.woff2')})`, {weight: '600', style: 'italic'}),
      new FontFace(theme.fonts.title, `url(${staticFile('fonts/unifrakturcook-latin-700-normal.woff2')})`, {weight: '700'}),
    ];
    Promise.all(faces.map((f) => f.load()))
      .then((loaded) => {
        loaded.forEach((f) => document.fonts.add(f));
        continueRender(handle);
      })
      .catch((e) => {
        console.error(e);
        continueRender(handle);
      });
  }, [handle]);
};
```

### Appendix 18: `src/kit/series/Captions.tsx`

```tsx
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {theme} from '../theme';
import {lin} from '../util';

/** Shape of timing.json written by scripts/narrate.py. Times are global seconds. */
export type TimingLine = {
  id: string;
  text: string;
  start: number;
  end: number;
  whisper: boolean;
  phrases: {text: string; start: number; end: number}[];
};
export type Timing = {unit: string; total: number; lines: TimingLine[]};

type Phrase = {text: string; start: number; end: number; whisper: boolean};
export const phrasesOf = (timing: Timing): Phrase[] =>
  timing.lines.flatMap((l) => l.phrases.map((p) => ({...p, whisper: !!l.whisper})));

/**
 * Burned-in phrase captions. One phrase at a time, fade + 10 px rise in, never overlapping the next.
 * redWords: exact words (with punctuation) drawn in blood red — at most one per beat.
 */
export const Captions: React.FC<{t: number; timing: Timing; redWords?: string[]; top?: number}> = ({t, timing, redWords = [], top = 1330}) => {
  const phrases = phrasesOf(timing);
  const red = new Set(redWords);
  const idx = phrases.findIndex(
    (p, i) => t >= p.start - 0.05 && t < Math.max(p.end + 0.25, p.start + 0.6) && (i === phrases.length - 1 || t < phrases[i + 1].start - 0.05),
  );
  if (idx < 0) return null;
  const p = phrases[idx];
  const inP = lin(t, p.start - 0.05, p.start + 0.12);
  const out = 1 - lin(t, p.end + 0.12, p.end + 0.25);
  const words = p.text.split(' ');
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: top}}>
      <div
        style={{
          width: 900,
          textAlign: 'center',
          fontFamily: theme.fonts.caption,
          fontWeight: 600,
          fontStyle: p.whisper ? 'italic' : 'normal',
          fontSize: p.whisper ? 70 : 78,
          lineHeight: 1.08,
          color: p.whisper ? '#c9b8b0' : theme.caption,
          opacity: inP * out * (p.whisper ? 0.85 : 1),
          transform: `translateY(${(1 - inP) * 10}px)`,
          textShadow: '0 0 18px rgba(0,0,0,0.95), 0 4px 6px rgba(0,0,0,0.9), 0 0 2px #000',
          letterSpacing: p.whisper ? 3 : 0.5,
        }}
      >
        {words.map((w, i) => (
          <span key={i} style={{color: red.has(w) ? theme.bloodBright : undefined}}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
```

### Appendix 19: `src/kit/series/TitleCard.tsx`

```tsx
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {theme} from '../theme';
import {noise1, prog} from '../util';

/**
 * End card on pure black. The title fades in from t0 + 1.0 s with candle flicker and a 1.06 -> 1.00 settle;
 * the subtitle (e.g. "PART II", or a tagline) follows 0.7 s later. Long titles shrink to fit.
 */
export const TitleCard: React.FC<{t: number; t0: number; title: string; subtitle?: string}> = ({t, t0, title, subtitle}) => {
  const ti = prog(t, t0 + 1.0, t0 + 2.0);
  const sub = prog(t, t0 + 1.7, t0 + 2.4);
  const flick = 0.85 + noise1(t * 14, 9) * 0.15;
  const size = Math.min(190, Math.floor(1700 / Math.max(6, title.length)));
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: theme.fonts.title,
          fontSize: size,
          color: theme.blood,
          opacity: ti * flick,
          letterSpacing: 4,
          textAlign: 'center',
          maxWidth: 980,
          lineHeight: 1.05,
          textShadow: `0 0 40px rgba(196,22,28,${0.35 * ti})`,
          transform: `scale(${1.06 - ti * 0.06})`,
          marginTop: -120,
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div style={{fontFamily: theme.fonts.caption, fontSize: 48, color: '#8a8478', opacity: sub, letterSpacing: 18, marginTop: 10, textAlign: 'center'}}>
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
```

### Appendix 20: `src/kit/series/StoryFrame.tsx`

```tsx
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Flicker, Grain as FilmGrain, Vignette} from '../fx';
import {FPS} from '../util';
import {useStyleFonts} from './fonts';
import {Captions, Timing} from './Captions';

/** 'warm' = memories / candle, 'cold' = the present / moonlight, 'none' = black screens and the title card. */
export type Grade = 'warm' | 'cold' | 'none';

/**
 * Wraps any story in the style's fixed finishing layers:
 * scene -> grade -> flicker -> vignette -> film grain -> black dip -> captions -> audio.
 * Every scene function receives global time t in seconds.
 */
export const StoryFrame: React.FC<{
  sceneAt: (t: number) => React.ReactNode;
  gradeAt: (t: number) => Grade;
  dipAt?: (t: number) => number; // 0..1 black overlay (time jumps, wake-ups)
  timing: Timing;
  redWords?: string[];
  audio?: string; // path under public/, e.g. 'episodes/my-story/mix.wav'
}> = ({sceneAt, gradeAt, dipAt, timing, redWords, audio}) => {
  useStyleFonts();
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const g = gradeAt(t);
  const dip = Math.min(1, Math.max(0, dipAt ? dipAt(t) : 0));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {sceneAt(t)}
      {g !== 'none' && (
        <>
          <AbsoluteFill style={{background: g === 'warm' ? 'rgba(255,140,60,0.05)' : 'rgba(40,70,120,0.08)', mixBlendMode: 'soft-light'}} />
          <Flicker t={t} amount={g === 'warm' ? 0.07 : 0.05} />
          <Vignette strength={g === 'warm' ? 0.75 : 0.85} />
        </>
      )}
      <FilmGrain frame={frame} opacity={g === 'warm' ? 0.2 : 0.15} />
      <AbsoluteFill style={{background: '#000', opacity: dip}} />
      <Captions t={t} timing={timing} redWords={redWords} />
      {audio && <Audio src={staticFile(audio)} />}
    </AbsoluteFill>
  );
};

/** A short dip to black centred on time c (seconds), half-width w. */
export const dipAround = (t: number, c: number, w = 0.18) => Math.max(1 - Math.abs(t - c) / w, 0);
/** A hard black hold from a to b (seconds). */
export const holdBlack = (t: number, a: number, b: number) => (t >= a && t < b ? 1 : 0);
```

### Appendix 21: `scripts/narrate.py`

```python
#!/usr/bin/env python3
"""Gothic POV narrator: Kokoro bm_lewis, per-line synthesis, measured timings and caption phrases.

usage: python3 scripts/narrate.py src/episodes/<slug> [--models voice] [--work work/<slug>]
reads   <story>/script.json   [{"id","text","pauseAfter", "whisper"?}]
writes  <work>/line_<id>.wav, <work>/narration.wav (24 kHz), <story>/timing.json (seconds)
"""
import argparse, json, os, re
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt

VOICE, LANG = "bm_lewis", "en-gb"
SPEED_NORMAL, SPEED_WHISPER = 0.97, 0.86
LEAD_IN, PAUSE_SCALE = 0.35, 0.8
SR = 24000

def trim(x, thr=0.008):
    idx = np.where(np.abs(x) > thr)[0]
    a = max(0, idx[0] - int(0.03 * SR)); b = min(len(x), idx[-1] + int(0.08 * SR))
    y = x[a:b].copy(); f = int(0.01 * SR)
    y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f)
    return y

def whisperize(x):
    """Dry breathy whisper: speech envelope drives band-passed noise, plus a thin copy of the voice."""
    rng = np.random.default_rng(7)
    env = sosfilt(butter(2, 40, 'low', fs=SR, output='sos'), np.abs(x)) * 3
    breath = sosfilt(butter(4, [1500, 7000], 'band', fs=SR, output='sos'), rng.standard_normal(len(x))) * env
    hp = sosfilt(butter(2, 300, 'high', fs=SR, output='sos'), x)
    y = 0.55 * hp + 1.6 * breath
    return y / np.abs(y).max() * 0.6

def phrases_for(x, line):
    """Split a line at , . … and place boundaries on the longest internal silences (>= 90 ms)."""
    parts = [p.strip() for p in re.split(r'(?<=[.,!?])\s+|(?<=\.\.\.)\s*', line['text']) if p.strip()]
    hop = int(0.01 * SR)
    e = np.array([np.sqrt((x[i:i + hop] ** 2).mean()) for i in range(0, len(x) - hop, hop)])
    quiet = e < 0.012; gaps = []; i = 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]: j += 1
            if j - i >= 9 and i > 5 and j < len(quiet) - 5: gaps.append(((i + j) / 2 * 0.01, (j - i) * 0.01))
            i = j
        else:
            i += 1
    need = len(parts) - 1
    if need > 0 and len(gaps) >= need:
        chosen = sorted(sorted(gaps, key=lambda g: -g[1])[:need])
        cuts = [0] + [g[0] for g in chosen] + [len(x) / SR]
        return [{"text": p, "start": round(line['start'] + cuts[k], 3), "end": round(line['start'] + cuts[k + 1], 3)} for k, p in enumerate(parts)], 'measured-silence'
    return [{"text": line['text'], "start": line['start'], "end": line['end']}], 'whole-line' if need == 0 else 'whole-line(fallback)'

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('story'); ap.add_argument('--models', default='voice'); ap.add_argument('--work')
    a = ap.parse_args()
    slug = os.path.basename(os.path.normpath(a.story))
    work = a.work or os.path.join('work', slug); os.makedirs(work, exist_ok=True)
    from kokoro_onnx import Kokoro
    k = Kokoro(os.path.join(a.models, 'kokoro-v1.0.onnx'), os.path.join(a.models, 'voices-v1.0.bin'))
    lines = json.load(open(os.path.join(a.story, 'script.json')))
    out = np.zeros(int(LEAD_IN * SR)); timing = []
    for L in lines:
        s, _ = k.create(L['text'], voice=VOICE, speed=SPEED_WHISPER if L.get('whisper') else SPEED_NORMAL, lang=LANG)
        s = trim(np.asarray(s, dtype=np.float64))
        s = whisperize(s) if L.get('whisper') else s / np.abs(s).max() * 0.8
        sf.write(os.path.join(work, f"line_{L['id']}.wav"), s, SR)
        start = len(out) / SR; out = np.concatenate([out, s]); end = len(out) / SR
        rec = {"id": L['id'], "text": L['text'], "start": round(start, 3), "end": round(end, 3), "whisper": bool(L.get('whisper'))}
        rec['phrases'], rec['phraseSource'] = phrases_for(s, rec)
        timing.append(rec)
        out = np.concatenate([out, np.zeros(int(L.get('pauseAfter', 0.3) * PAUSE_SCALE * SR))])
    sf.write(os.path.join(work, 'narration.wav'), out, SR, subtype='PCM_16')
    json.dump({"unit": "seconds", "total": round(len(out) / SR, 3),
               "provenance": f"kokoro {VOICE} per-line synthesis; times measured from decoded samples", "lines": timing},
              open(os.path.join(a.story, 'timing.json'), 'w'), indent=1)
    print(f"narration {len(out) / SR:.2f} s, {len(lines)} lines -> {work}/narration.wav, {a.story}/timing.json")
    for r in timing: print(f"  {r['id']} {r['start']:6.2f}-{r['end']:6.2f}  {r['text']}")

if __name__ == '__main__':
    main()
```

### Appendix 22: `scripts/sound_lib.py`

```python
"""Gothic POV sound engine. Everything is synthesised (no samples, no licences).

A story's cues.py defines DUR (seconds) and cues(S) which places score and effects on a Score.
scripts/build_audio.py runs it, mixes the narration under the house rules and masters the result.
All times are global seconds, the same clock as timing.json and the scene code.
"""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
_rng = np.random.default_rng(1234)

# ---------------------------------------------------------------- filters & helpers
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def secs(n): return np.arange(n) / SR

def reverb(x, sec=2.5, wet=0.35, damp=3500, seed=0):
    r = np.random.default_rng(seed); n = int(sec * SR)
    ir = r.standard_normal(n) * np.exp(-np.linspace(0, 7, n)); ir = lp(ir, damp); ir /= np.sqrt(np.sum(ir ** 2))
    return x * (1 - wet) + fftconvolve(x, ir)[: len(x)] * wet

def note(semitones_from_a4): return 440 * 2 ** (semitones_from_a4 / 12)

# ---------------------------------------------------------------- one-shot sounds
def pluck(freq, dur=2.2, bright=0.996):
    """Music-box tine: Karplus-Strong string plus a decaying octave sine."""
    n = int(dur * SR); p = int(SR / freq); buf = _rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = bright * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    tine = np.sin(2 * np.pi * freq * 2 * secs(n)) * np.exp(-secs(n) * 3)
    return (out * 0.6 + tine * 0.5) * np.exp(-secs(n) * 1.2)

def click(gain=1.0, f=4500):
    """30 ms tick: a grain landing, a latch, a torch switch, a clock tick."""
    n = int(0.03 * SR); x = _rng.standard_normal(n) * np.exp(-secs(n) * 260)
    return bp(x, f * 0.6, min(f * 1.6, 20000)) * gain

def whoosh(dur, lo=200, hi=2500, gain=1.0):
    """Air movement: something passing the window, cloth pulled, a sweep."""
    n = int(dur * SR); e = np.sin(np.linspace(0, np.pi, n)) ** 2
    return bp(_rng.standard_normal(n), lo, hi) * e * gain

def boom(dur=2.5, f=42, gain=1.0):
    """Pitch-dropping sub hit: time jumps, reveals, the title card."""
    n = int(dur * SR); tt = secs(n); fr = f * (1 + 1.5 * np.exp(-tt * 9))
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt * 2.2) + lp(_rng.standard_normal(n), 120) * np.exp(-tt * 6) * 0.5
    return x * gain

def heartbeat():
    n = int(0.35 * SR); tt = secs(n)
    a = np.sin(2 * np.pi * 55 * tt) * np.exp(-tt * 28)
    b = np.zeros(n); k = int(0.17 * SR); b[k:] = np.sin(2 * np.pi * 48 * tt[: n - k]) * np.exp(-tt[: n - k] * 30) * 0.7
    return lp(a + b, 150)

def knock(gain=1.0):
    """Knuckle on oak: a damped low body thump plus a short wood click."""
    n = int(0.25 * SR); tt = secs(n)
    body = np.sin(2 * np.pi * 110 * tt) * np.exp(-tt * 38) + np.sin(2 * np.pi * 180 * tt) * np.exp(-tt * 55) * 0.5
    return (lp(body, 900) + np.concatenate([click(0.5, 1400), np.zeros(n - int(0.03 * SR))])) * gain

def creak(dur=1.5, gain=0.12):
    """Hinge / casement creak: a pitch-swept square wave, band-passed."""
    n = int(dur * SR); tt = secs(n); fr = 420 + 160 * np.sin(tt * 3.1) + 60 * np.sin(tt * 17)
    cr = np.sign(np.sin(2 * np.pi * np.cumsum(fr) / SR)) * (0.5 + 0.5 * np.sin(2 * np.pi * 23 * tt))
    return bp(cr, 300, 3000) * np.sin(np.linspace(0, np.pi, n)) * gain

def scratch(dur=0.16, gain=0.12):
    """Claw on wood: noise gated at 38 Hz."""
    n = int(dur * SR); sc = bp(_rng.standard_normal(n), 1500, 6000) * np.sin(np.linspace(0, np.pi, n))
    return sc * (1 + 0.8 * np.sign(np.sin(secs(n) * 2 * np.pi * 38))) * gain

def breath(dur=0.7, gain=0.12):
    n = int(dur * SR); return bp(_rng.standard_normal(n), 500, 3000) * np.sin(np.linspace(0, np.pi, n)) ** 2 * gain

def chime(freq, dur=0.4, gain=0.05):
    n = int(dur * SR); return np.sin(2 * np.pi * freq * secs(n)) * np.exp(-secs(n) * 14) * gain

def sting(dur=2.2, gain=0.04):
    """High dissonant cluster that rings over a reveal (pair it with a boom)."""
    n = int(dur * SR); x = np.zeros(n); tt = secs(n)
    for f in [1244, 1318, 1396, 1864]: x += np.sin(2 * np.pi * f * tt * (1 + 0.01 * np.sin(tt * 30)))
    return x * np.exp(-tt * 1.8) * gain

# ---------------------------------------------------------------- the score
class Score:
    def __init__(self, dur):
        self.dur = dur; self.N = int(dur * SR); self.T = np.arange(self.N) / SR
        self.music = np.zeros(self.N); self.sfx = np.zeros(self.N); self.amb = np.zeros(self.N)
        self.silences = []  # (a, b): everything but the voice is cut
        self.music_reverb = (3.0, 0.4)

    # placement
    def place(self, buf, sig, t, gain=1.0):
        b = getattr(self, buf); i = int(t * SR); j = min(self.N, i + len(sig))
        if 0 <= i < self.N: b[i:j] += sig[: j - i] * gain
    def sfx_at(self, sig, t, gain=1.0): self.place('sfx', sig, t, gain)
    def curve(self, points):
        """Piecewise-linear gain over time: [(t, g), ...]."""
        ts, gs = zip(*points); return np.interp(self.T, ts, gs)
    def env(self, t0, t1, a=0.05, r=0.3):
        e = np.zeros(self.N); i0, i1 = int(t0 * SR), min(self.N, int(t1 * SR)); seg = np.ones(i1 - i0)
        na, nr = int(a * SR), int(r * SR)
        if na: seg[:na] = np.linspace(0, 1, na)
        if nr: seg[-nr:] *= np.linspace(1, 0, nr)
        e[i0:i1] = seg; return e
    def silence(self, a, b): self.silences.append((a, b))

    # memory: music-box lullaby (A minor). notes = [(t_offset, semitone), ...]
    def music_box(self, start, notes, bass=(), stop=None, gain=0.22):
        cache = {}
        for t0, s in notes:
            if s not in cache: cache[s] = pluck(note(s))
            self.place('music', cache[s], start + t0, gain); self.place('music', cache[s], start + t0 + 0.012, gain * 0.23)
        for t0, s in bass: self.place('music', pluck(note(s), 3.0, 0.998), start + t0, gain * 0.8)
        if stop is not None:  # music box stops dead (time jump)
            m = np.clip((stop - self.T) / 0.25, 0, 1); self.music *= np.where(self.T < stop, 1, 0) * m

    def dawn_chord(self, t0, t1, gain=0.035):
        for f in [note(3), note(7), note(10), note(15)]: self.music += np.sin(2 * np.pi * f * self.T) * self.env(t0, t1, 1.2, 0.5) * gain

    # present: cold drone + tension cluster + night wind
    def drone(self, points, gain=1.0):
        g = self.curve(points)
        for f0, w in [(41.2, 0.35), (55.0, 0.15)]:
            x = np.zeros(self.N)
            for d in [0, 0.13, -0.17, 0.31]:
                ph = 2 * np.pi * (f0 + d) * self.T; x += np.sign(np.sin(ph)) * 0.25 + np.sin(ph * 2) * 0.2
            self.music += lp(x, 220) * g * w * gain
    def tension(self, points, gain=0.03):
        x = np.zeros(self.N)
        for f in [622.3, 659.3, 698.5, 932.3, 987.8]: x += np.sin(2 * np.pi * f * self.T * (1 + 0.004 * np.sin(2 * np.pi * 5.1 * self.T + f)))
        self.music += bp(x, 300, 4000) * self.curve(points) * gain
    def wind(self, points, gain=0.25):
        w = bp(_rng.standard_normal(self.N), 180, 900) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * self.T))
        self.amb += w * self.curve(points) * gain
    def room_tone(self, t0, t1, gain=0.05):
        self.amb += lp(_rng.standard_normal(self.N), 400) * self.env(t0, t1, 0.05, 0.1) * gain

    # patterns
    def patter(self, t0, span, n=900, gain=0.35, tail=0.0):
        """Many grains falling: pouring, scattering, sweeping."""
        for _ in range(n): self.sfx_at(click(_rng.uniform(0.2, 0.6), _rng.uniform(2500, 7000)), t0 + _rng.uniform(0, span) + (_rng.exponential(tail) if tail else 0), gain)
    def heartbeat_run(self, t0, t1, period=1.0, shrink=0.9, fastest=0.48, gain=0.9):
        t = t0
        while t < t1: self.sfx_at(heartbeat(), t, gain); t += period; period = max(fastest, period * shrink)
    def ticks(self, t0, t1, every=1.0, gain=0.55):
        for s in np.arange(t0, t1, every):
            tk = click(1.0, 3200) + np.concatenate([np.zeros(int(0.008 * SR)), click(0.6, 1800)])[: int(0.03 * SR)]
            self.sfx_at(tk, s, gain)
    def knocks(self, t0, count=3, gap=0.42, gain=0.9):
        for i in range(count): self.sfx_at(knock(), t0 + i * gap, gain)

    # ------------------------------------------------------------ final mix
    def mix(self, narration, timing_lines, narration_sr):
        """House mix: dry voice, wet whispers, music/ambience ducked 55% under speech, SFX 30%."""
        from scipy.signal import resample_poly
        nar = resample_poly(narration, SR, narration_sr)
        voice = np.zeros(self.N); voice[: min(self.N, len(nar))] = nar[: self.N]
        wmask = np.zeros(self.N)
        for l in timing_lines:
            if l.get('whisper'): wmask[int(l['start'] * SR): int((l['end'] + 0.05) * SR)] = 1
        voice = reverb(voice * (1 - wmask), 1.2, 0.12, 5000) + reverb(voice * wmask, 3.2, 0.5, 2500) * 1.25
        venv = lp(np.abs(voice), 6); sp = np.clip(venv / (venv.max() * 0.25 + 1e-9), 0, 1)
        music = reverb(self.music, *self.music_reverb)
        bed = (music + self.amb) * (1 - 0.55 * sp) + self.sfx * (1 - 0.3 * sp)
        cut = np.ones(self.N)
        for a, b in self.silences: cut[int(a * SR): int(b * SR)] = 0
        bed *= cut * 0.7
        L = voice + bed; R = voice + np.roll(bed, int(0.0006 * SR))
        st = np.stack([L, R], 1); return st / np.abs(st).max() * 0.89
```

### Appendix 23: `scripts/build_audio.py`

```python
#!/usr/bin/env python3
"""Build a story's soundtrack: cues -> mix -> master.

usage: python3 scripts/build_audio.py <slug> [--target -15]
reads   src/episodes/<slug>/cues.py (DUR, cues(S)), src/episodes/<slug>/timing.json, work/<slug>/narration.wav
writes  work/<slug>/mix_raw.wav, public/episodes/<slug>/mix.wav  (48 kHz stereo, about -15 LUFS, <= -1.3 dBTP)
"""
import argparse, importlib.util, json, os, re, subprocess, sys
import soundfile as sf
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sound_lib as SL

def loudness(path):
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    summ = out[out.rfind('Summary:'):]
    I = float(re.search(r'I:\s+(-?[\d.]+) LUFS', summ).group(1)); P = float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', summ).group(1))
    return I, P

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('slug'); ap.add_argument('--target', type=float, default=-15.0)
    a = ap.parse_args()
    story = os.path.join('src', 'episodes', a.slug); work = os.path.join('work', a.slug); pub = os.path.join('public', 'episodes', a.slug)
    os.makedirs(work, exist_ok=True); os.makedirs(pub, exist_ok=True)
    spec = importlib.util.spec_from_file_location('cues', os.path.join(story, 'cues.py')); cues = importlib.util.module_from_spec(spec); spec.loader.exec_module(cues)
    S = SL.Score(cues.DUR); cues.cues(S)
    nar, nsr = sf.read(os.path.join(work, 'narration.wav'))
    lines = json.load(open(os.path.join(story, 'timing.json')))['lines']
    raw = os.path.join(work, 'mix_raw.wav'); sf.write(raw, S.mix(nar, lines, nsr), SL.SR, subtype='PCM_24')
    I0, _ = loudness(raw); gain = a.target - I0
    final = os.path.join(pub, 'mix.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', f'volume={gain:.2f}dB,alimiter=limit=0.82:attack=3:release=80:level=false',
                    '-ar', '48000', '-c:a', 'pcm_s16le', final], check=True)
    I, P = loudness(final)
    print(f'{final}: {cues.DUR:.1f} s, {I:.1f} LUFS integrated, true peak {P:.1f} dBFS (gain {gain:+.1f} dB)')

if __name__ == '__main__':
    main()
```

### Appendix 24: `scripts/stills.mjs`

```js
// Render review stills of a composition at chosen times (seconds) into out/stills/<id>/.
// usage: node scripts/stills.mjs <CompositionId> <t1> <t2> ... [--scale=0.4]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const id = args.shift();
const scale = Number((args.find((a) => a.startsWith('--scale=')) || '--scale=0.4').split('=')[1]);
const times = args.filter((a) => !a.startsWith('--')).map(Number);
const exe = process.env.REMOTION_BROWSER;
const outDir = path.join('out', 'stills', id);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', exe ? {browserExecutable: exe, chromeMode: 'headless-shell'} : {});
const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser});
for (const t of times) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(t * composition.fps));
  await renderStill({composition, serveUrl, frame, scale, puppeteerInstance: browser, output: path.join(outDir, `f${String(frame).padStart(5, '0')}.png`)});
}
await browser.close({silent: true});
console.log(`${times.length} stills -> ${outDir}`);
```

### Appendix 25: `scripts/make_grain.py`

```python
#!/usr/bin/env python3
"""Regenerate public/tex/grain0-7.png (seeded 540x960 film-grain tiles) if they are ever lost."""
import numpy as np, os, struct, zlib
def png(path, arr):
    h, w = arr.shape[:2]; raw = b''.join(b'\x00' + arr[y].tobytes() for y in range(h))
    def chunk(t, d): c = struct.pack('>I', len(d)) + t + d; return c + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    open(path, 'wb').write(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 4, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw, 6)) + chunk(b'IEND', b''))
os.makedirs('public/tex', exist_ok=True); rng = np.random.default_rng(13)
for i in range(8):
    v = np.clip(128 + rng.normal(0, 1, (960, 540)) * 60, 0, 255).astype(np.uint8)
    png(f'public/tex/grain{i}.png', np.stack([v, v, v, np.full_like(v, 255)], -1))
print('8 grain tiles -> public/tex/')
```

### Appendix 26: `scripts/contact.sh`

```bash
#!/usr/bin/env bash
# Contact sheet of a rendered video: one frame every N seconds (default 2), 8 columns.
# usage: scripts/contact.sh out/<file>.mp4 [every_seconds]
set -e
f="$1"; every="${2:-2}"; o="${f%.mp4}-contact.png"
ffmpeg -v error -y -i "$f" -vf "fps=1/${every},scale=216:384,tile=8x8:padding=3:color=gray" -frames:v 1 "$o"
echo "$o"
```

### Appendix 27: `scripts/catalog.sh`

```bash
#!/usr/bin/env bash
# Render every kit panel (one frame each) and tile them into docs/kit-catalog.png
set -e
n=$(grep -c "name: '" src/catalog/Catalog.tsx)
times=$(python3 -c "import sys; n=int(sys.argv[1]); print(' '.join(str(round(i/30+0.001,4)) for i in range(n)))" "$n")
rm -rf out/stills/Catalog
node scripts/stills.mjs Catalog $times --scale=0.3
mkdir -p docs
cols=4; rows=$(( (n + cols - 1) / cols ))
ffmpeg -v error -y -pattern_type glob -i 'out/stills/Catalog/f*.png' -vf "tile=${cols}x${rows}:padding=6:color=0x222222" -frames:v 1 docs/kit-catalog.png
echo "docs/kit-catalog.png ($n panels)"
```

### Appendix 28: `src/catalog/Catalog.tsx`

```tsx
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Camera, Eyelids, FilmGrain, Flicker, Stage, Torch, Vignette} from '../kit';
import {WindowWall} from '../kit/sets/WindowWall';
import {DoorWall} from '../kit/sets/DoorWall';
import {Hand, POSES, STYLES} from '../kit/art/Hand';
import {Candle, Clock, Cloth, CupHand, Duvet, ElderProfile, Mirror, Portrait} from '../kit/art/Props';
import {Floor, Grain, Wall, pileOf10, scatter} from '../kit/art/Room';
import {TitleCard} from '../kit/series/TitleCard';
import {Captions, Timing} from '../kit/series/Captions';
import {useStyleFonts} from '../kit/series/fonts';
import {theme} from '../kit/theme';

/** One frame per panel. Render with: node scripts/stills.mjs Catalog 0 0.0334 0.0667 ... or scripts/catalog.sh */
const T = 2.0;

const Label: React.FC<{name: string; note: string}> = ({name, note}) => (
  <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 60}}>
    <div style={{fontFamily: theme.fonts.caption, fontWeight: 600, fontSize: 64, color: '#ece4d2', textShadow: '0 0 16px #000, 0 2px 4px #000'}}>{name}</div>
    <div style={{fontFamily: theme.fonts.caption, fontWeight: 600, fontStyle: 'italic', fontSize: 40, color: '#a89c8a', textShadow: '0 0 12px #000', marginTop: 6, width: 960, textAlign: 'center'}}>
      {note}
    </div>
  </AbsoluteFill>
);

const Finish: React.FC<{warm?: boolean}> = ({warm}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{background: warm ? 'rgba(255,140,60,0.05)' : 'rgba(40,70,120,0.08)', mixBlendMode: 'soft-light'}} />
      <Flicker t={T} amount={0.05} />
      <Vignette strength={warm ? 0.75 : 0.85} />
      <FilmGrain frame={frame} opacity={0.15} />
    </>
  );
};

const SAMPLE: Timing = {
  unit: 'seconds',
  total: 4,
  lines: [
    {id: 'a', text: 'And the voice... was mine.', start: 0, end: 3.5, whisper: false, phrases: [{text: 'And the voice... was mine.', start: 0, end: 3.5}]},
  ],
};
const WHISPER: Timing = {
  unit: 'seconds',
  total: 4,
  lines: [{id: 'b', text: 'Four hundred and six.', start: 0, end: 3.5, whisper: true, phrases: [{text: 'Four hundred and six.', start: 0, end: 3.5}]}],
};

const PANELS: Array<{name: string; note: string; warm?: boolean; body: React.ReactNode}> = [
  {name: 'WindowWall · night', note: 'GothicWindow, curtains, sill, moonbeam + dust', body: <Stage><g transform="translate(540,1000) scale(0.82) translate(-540,-1000)"><WindowWall id="c0" t={T} mode="night" grainsVisible={1} grainLit={0.4} /></g></Stage>},
  {name: 'WindowWall · candle', note: "mode='candle' warm=1 — memories", warm: true, body: <Stage><g transform="translate(540,1000) scale(0.82) translate(-540,-1000)"><WindowWall id="c1" t={T} mode="candle" warm={1} grainsVisible={0.6} grainWarm={1} grainLit={1} /></g></Stage>},
  {name: 'WindowWall · dawn', note: 'dawn 0..1 — relief beats only', warm: true, body: <Stage><g transform="translate(540,1000) scale(0.82) translate(-540,-1000)"><WindowWall id="c2" t={T} mode="dawn" dawn={0.85} grainsVisible={1} grainWarm={1} grainLit={1} /></g></Stage>},
  {name: 'WindowWall · open', note: 'open, billow, wind, outside={…}', body: <Stage><g transform="translate(540,1000) scale(0.82) translate(-540,-1000)"><WindowWall id="c3" t={T} mode="night" open={0.8} billow={0.8} wind={3} cloudCover={0.8} /></g></Stage>},
  {name: 'DoorWall · night', note: 'GothicDoor: knock, under-light, keyhole glow', body: <Stage><g transform="translate(540,1000) scale(0.82) translate(-540,-1000)"><DoorWall id="c4" t={T} mode="night" under={0.6} underColor="#ffb45a" /></g></Stage>},
  {
    name: 'DoorWall · candle, ajar',
    note: "open=0.62, sconce, beyond={…} (eyes in the gap)",
    warm: true,
    body: (
      <Stage>
        <g transform="translate(540,1000) scale(0.82) translate(-540,-1000)">
          <DoorWall
            id="c5"
            t={T}
            mode="candle"
            open={0.62}
            beyond={
              <g>
                <ellipse cx={712} cy={980} rx={11} ry={5} fill="#e8f0ff" opacity={0.9} />
                <ellipse cx={762} cy={980} rx={11} ry={5} fill="#e8f0ff" opacity={0.9} />
              </g>
            }
          />
        </g>
      </Stage>
    ),
  },
  {
    name: 'Hand · styles',
    note: 'creature · adult · elder · child',
    body: (
      <Stage>
        <Wall id="c6" x={0} y={0} w={1080} h={1920} />
        <Hand id="h1" x={290} y={900} scale={1.3} style={STYLES.creature} pose={POSES.relaxed} />
        <Hand id="h2" x={790} y={900} scale={1.3} style={STYLES.adult} pose={POSES.relaxed} />
        <Hand id="h3" x={290} y={1650} scale={1.3} style={STYLES.elder} pose={POSES.relaxed} />
        <Hand id="h4" x={790} y={1650} scale={1.3} style={STYLES.child} pose={POSES.relaxed} />
      </Stage>
    ),
  },
  {
    name: 'Hand · poses',
    note: 'flat · relaxed · point · claw · fist · reach',
    body: (
      <Stage>
        <Wall id="c7" x={0} y={0} w={1080} h={1920} />
        {(['flat', 'relaxed', 'point', 'claw', 'fist', 'reach'] as const).map((p, i) => (
          <Hand key={p} id={`p${i}`} x={200 + (i % 3) * 340} y={i < 3 ? 900 : 1600} scale={1.05} style={STYLES.creature} pose={POSES[p]} showSleeve={false} />
        ))}
      </Stage>
    ),
  },
  {
    name: 'Props',
    note: 'Candle · Clock (3:00) · Portrait (mourning ribbon)',
    warm: true,
    body: (
      <Stage>
        <Wall id="c8" x={0} y={0} w={1080} h={1920} warm={0.6} />
        <Portrait x={300} y={760} s={1.6} />
        <Clock x={760} y={820} s={1.2} t={T} />
        <rect x={0} y={1500} width={1080} height={420} fill="#120c08" />
        <Candle x={540} y={1560} t={T} s={1.4} />
      </Stage>
    ),
  },
  {
    name: 'Mirror + Cloth',
    note: 'children = reflection; Cloth pull 0..1',
    body: (
      <Stage>
        <Wall id="c9" x={0} y={0} w={1080} h={1920} />
        <Mirror x={240} y={520} w={600} h={1100} id="cm">
          <rect x={0} y={0} width={600} height={1100} fill="#0b1220" />
        </Mirror>
        <Cloth x={240} y={520} w={600} h={1100} t={T} pull={0.35} grabX={540} id="cc" />
      </Stage>
    ),
  },
  {
    name: 'ElderProfile + CupHand',
    note: 'candle-rimmed profile; hand tipping a tin cup',
    warm: true,
    body: (
      <Stage>
        <Wall id="c10" x={0} y={0} w={1080} h={1920} warm={1} />
        <ElderProfile x={640} y={640} s={1.15} t={T} finger={1} lean={0.3} />
        <CupHand x={380} y={1560} tilt={-36} s={0.75} warm={1} />
      </Stage>
    ),
  },
  {
    name: 'Grains + Duvet',
    note: 'pileOf10 · scatter · glint; child grip on duvet',
    body: (
      <Stage>
        <Floor id="c11" x={0} y={0} w={1080} h={1920} lit={0.9} />
        {[0, 1, 2].map((k) => pileOf10(300 + k * 240, 520, 40 + k, 0.9).map((g, i) => <Grain key={`${k}-${i}`} x={g.x} y={g.y} rot={g.rot} s={2.4} lit={0.9} glint={k === 1 && i === 0 ? 1 : 0} />))}
        {scatter(40, 160, 700, 760, 360, 3).map((g, i) => <Grain key={i} x={g.x} y={g.y} rot={g.rot} s={2.2} lit={0.7} />)}
        <Duvet y={1400} t={T} grip={1} />
      </Stage>
    ),
  },
  {
    name: 'Torch',
    note: 'screen-space light disc after the Camera',
    body: (
      <>
        <Camera t={T} shake={0}>
          <Stage>
            <WindowWall id="c12" t={T} mode="night" />
          </Stage>
        </Camera>
        <Torch x={420} y={980} r={380} ambient={0.12} />
      </>
    ),
  },
  {
    name: 'Eyelids',
    note: 'open 0..1 — waking, blinking',
    body: (
      <>
        <Stage>
          <rect x={0} y={0} width={1080} height={1920} fill="#05070b" />
          <Clock x={540} y={1000} s={1.6} t={T} />
        </Stage>
        <Eyelids open={0.4} />
      </>
    ),
  },
  {
    name: 'Captions',
    note: 'normal + red reveal word · whisper (italic)',
    body: (
      <>
        <Stage>
          <WindowWall id="c14" t={T} mode="night" beam={0.4} />
        </Stage>
        <Captions t={1.5} timing={SAMPLE} redWords={['mine.']} top={1180} />
        <Captions t={1.5} timing={WHISPER} top={1420} />
      </>
    ),
  },
  {name: 'TitleCard', note: 'title + subtitle on black', body: <TitleCard t={4} t0={0} title="Story Title" subtitle="PART I" />},
];

export const META = {id: 'Catalog', durationSec: PANELS.length / 30};

export const Episode: React.FC = () => {
  useStyleFonts();
  const frame = useCurrentFrame();
  const p = PANELS[Math.min(PANELS.length - 1, frame)];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {p.body}
      {p.name !== 'TitleCard' && <Finish warm={p.warm} />}
      <Label name={p.name} note={p.note} />
    </AbsoluteFill>
  );
};

export const PANEL_COUNT = PANELS.length;
```

### Appendix 29: `src/episodes/_template/script.json`

```json
[
  {"id": "L01", "text": "Every night at midnight, something knocks on my bedroom door.", "pauseAfter": 0.3},
  {"id": "L02", "text": "Three times. Never more.", "pauseAfter": 0.5},
  {"id": "L03", "text": "Mother always said, never answer it.", "pauseAfter": 0.6},
  {"id": "L04", "text": "Tonight, it knocked four times.", "pauseAfter": 0.6},
  {"id": "L05", "text": "The fourth came from behind me.", "pauseAfter": 0.9},
  {"id": "L06", "text": "Don't turn around.", "whisper": true, "pauseAfter": 0.8}
]
```

### Appendix 30: `src/episodes/_template/shots.json`

```json
{
  "fps": 30,
  "durationSec": 18.5,
  "shots": [
    {"id": "S01", "start": 0.0, "end": 4.16, "purpose": "Hook. Facing the bedroom door at midnight; three knocks jolt it", "light": "night"},
    {"id": "S02", "start": 4.16, "end": 6.42, "purpose": "Close on the ring pull; cold light breathing under the door", "light": "night"},
    {"id": "S03", "start": 6.42, "end": 9.38, "purpose": "Memory: Mother by candle, finger to lips (the rule)", "light": "candle"},
    {"id": "S04", "start": 9.38, "end": 11.75, "purpose": "Three knocks; his hand reaches for the ring, then recoils at a fourth knock from behind", "light": "night"},
    {"id": "S05", "start": 11.75, "end": 14.25, "purpose": "Whip-turn to the window: a grey clawed hand on the outside of the glass", "light": "night"},
    {"id": "S06", "start": 14.25, "end": 18.5, "purpose": "Cut to black. Whisper 'Don't turn around.' Title", "light": "black"}
  ]
}
```

### Appendix 31: `src/episodes/_template/Main.tsx`

```tsx
import React from 'react';
import timing from './timing.json';
import {StoryFrame, Grade, dipAround} from '../../kit/series/StoryFrame';
import {TitleCard} from '../../kit/series/TitleCard';
import {Timing} from '../../kit/series/Captions';
import {BehindScene, DoorScene, MemoryScene} from './scenes/Story';

/**
 * TEMPLATE STORY — "The Knock". Copy this folder to start a new story:
 *   cp -r src/episodes/_template src/episodes/<slug>   then edit META, script.json, scenes, cues.py,
 *   and add one import + one array entry in src/Root.tsx.
 */
export const META = {id: 'Template', durationSec: 18.5, audio: 'episodes/_template/mix.wav'};

const CUT = 14.25; // cliffhanger: hard cut to black, whisper, title

// shot list (mirrors shots.json): every cut lands on a phrase start from timing.json
const sceneAt = (t: number) => {
  if (t < 4.16) return <DoorScene t={t} t0={0} />; // S01 knocks
  if (t < 6.42) return <DoorScene t={t} t0={4.16} close />; // S02 ring pull, light under the door
  if (t < 9.38) return <MemoryScene t={t} />; // S03 Mother: never answer it
  if (t < 11.75) return <DoorScene t={t} t0={9.38} reach />; // S04 four knocks; hand reaches, recoils
  if (t < CUT) return <BehindScene t={t} />; // S05 whip-turn: a hand on the glass
  return <TitleCard t={t} t0={CUT} title="The Knock" subtitle="A GOTHIC POV STORY" />; // S06
};

const gradeAt = (t: number): Grade => (t >= CUT ? 'none' : t >= 6.42 && t < 9.38 ? 'warm' : 'cold');
const dipAt = (t: number) => dipAround(t, 6.42, 0.12) + dipAround(t, 9.38, 0.12);

export const Episode: React.FC = () => (
  <StoryFrame sceneAt={sceneAt} gradeAt={gradeAt} dipAt={dipAt} timing={timing as Timing} redWords={['four', 'behind', 'around.']} audio={META.audio} />
);
```

### Appendix 32: `src/episodes/_template/scenes/Story.tsx`

```tsx
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage} from '../../../kit/fx';
import {DoorWall} from '../../../kit/sets/DoorWall';
import {WindowWall, WIN, SILL_Y} from '../../../kit/sets/WindowWall';
import {Hand, POSES, STYLES, lerpPose} from '../../../kit/art/Hand';
import {Candle, ElderProfile} from '../../../kit/art/Props';
import {Wall} from '../../../kit/art/Room';
import {easeIn, easeOut, mix, noise1, prog} from '../../../kit/util';

/** Knock times (seconds). The same list drives the door jolt here and the knock sounds in cues.py. */
export const DOOR_KNOCKS = [2.4, 2.8, 3.2, 10.2, 10.55, 10.9];
export const BEHIND_KNOCK = 11.5;

const knockJolt = (t: number) => DOOR_KNOCKS.reduce((m, k) => Math.max(m, t >= k && t < k + 0.18 ? 1 - (t - k) / 0.18 : 0), 0);

/* S01 + S02 + S04: facing the bedroom door at midnight */
export const DoorScene: React.FC<{t: number; t0: number; close?: boolean; reach?: boolean}> = ({t, t0, close, reach}) => {
  const lt = t - t0;
  const zoom = close ? 1.55 + lt * 0.03 : 1.0 + lt * 0.02;
  const camY = close ? 120 : 0;
  // the adult hand rises toward the ring pull, then freezes and pulls back on the knock from behind
  const up = reach ? prog(t, 9.6, 10.9, easeOut) : 0;
  const recoil = reach ? prog(t, BEHIND_KNOCK, BEHIND_KNOCK + 0.2, easeOut) : 0;
  const pose = lerpPose(lerpPose(POSES.relaxed, POSES.reach, up), POSES.fist, recoil);
  const tremble = reach && t > BEHIND_KNOCK ? 3 : 0;
  return (
    <Camera t={t} zoom={zoom} y={camY} x={close ? 150 : 0} shake={close ? 4 : 6} seed={51}>
      <Stage>
        <DoorWall id="door" t={t} mode="night" knock={knockJolt(t)} under={0.25 + 0.15 * Math.sin(t * 3)} underColor="#9fb4cf">
          {reach && (
            <Hand
              id="reach"
              x={mix(840, 800, up) + noise1(t * 20, 2) * tremble}
              y={mix(2200, 1240, up) + recoil * 200 + noise1(t * 22, 3) * tremble}
              rot={-8}
              scale={1.3}
              style={STYLES.adult}
              pose={pose}
              light={0.8}
            />
          )}
        </DoorWall>
      </Stage>
    </Camera>
  );
};

/* S03: memory — Mother by candlelight, finger to her lips */
export const MemoryScene: React.FC<{t: number}> = ({t}) => {
  const a = 6.42;
  const lean = prog(t, a, a + 1.8);
  const finger = prog(t, a + 1.1, a + 1.6, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1 + lean * 0.05} shake={3} seed={53}>
        <Stage>
          <Wall id="memwall" x={-200} y={-200} w={1480} h={2400} warm={1} />
          <radialGradient id="memglow" cx="0.15" cy="0.85" r="0.9">
            <stop offset="0" stopColor="#ffa040" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#7a3a12" stopOpacity="0.2" />
            <stop offset="1" stopColor="#000" stopOpacity="0.6" />
          </radialGradient>
          <rect x={0} y={0} width={1080} height={1920} fill="url(#memglow)" />
          <ElderProfile x={640} y={800} s={mix(1.45, 1.65, lean)} t={t} finger={finger} lean={lean} />
        </Stage>
      </Camera>
      <AbsoluteFill style={{filter: 'blur(10px)'}}>
        <Stage>
          <Candle x={170} y={2010} t={t} s={1.6} />
        </Stage>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* S05: whip-turn to the window behind him — a grey hand on the outside of the glass */
export const BehindScene: React.FC<{t: number}> = ({t}) => {
  const a = 11.75;
  const whip = prog(t, a, a + 0.32, easeOut); // 0 = still turning, 1 = settled
  const blur = (1 - whip) * 26;
  const slide = prog(t, a + 0.6, 14.2, (x) => x);
  const curl = prog(t, 12.8, 13.6, easeIn);
  const push = prog(t, a, 14.25, (x) => x);
  return (
    <AbsoluteFill style={{filter: blur > 0.5 ? `blur(${blur}px)` : undefined}}>
      <Camera t={t} zoom={1.02 + push * 0.22} x={(1 - whip) * 700} rot={(1 - whip) * -6} y={-80 * push} shake={7} seed={57}>
        <Stage>
          <WindowWall
            id="behind"
            t={t}
            mode="night"
            cloudCover={0.6}
            outside={
              <Hand
                id="glass"
                x={WIN.cx - 120}
                y={mix(SILL_Y - 230, SILL_Y - 120, slide)}
                rot={6}
                scale={1.5}
                style={STYLES.creature}
                pose={lerpPose(POSES.flat, POSES.claw, curl)}
                light={0.7}
                showSleeve={false}
              />
            }
          />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};
```

### Appendix 33: `src/episodes/_template/cues.py`

```python
"""The Knock (template): score and effects cues. Times = global seconds, shared with scenes/Story.tsx."""
from sound_lib import boom, breath, click, whoosh, knock, sting

DUR = 18.5
DOOR_KNOCKS = [2.4, 2.8, 3.2, 10.2, 10.55, 10.9]   # keep in sync with scenes/Story.tsx
BEHIND_KNOCK = 11.5
CUT = 14.25

def cues(S):
    S.drone([(0, 0.35), (4, 0.5), (6.4, 0.0), (9.38, 0.45), (11.5, 0.9), (CUT, 1.0), (CUT + 0.01, 0), (DUR, 0)])
    S.wind([(0, 0.3), (6.4, 0.1), (9.38, 0.3), (11.75, 0.8), (CUT, 1.2), (CUT + 0.01, 0), (DUR, 0)])
    S.music_box(6.5, [(0, 12), (0.45, 15), (0.9, 19), (1.35, 17), (1.8, 15)], bass=[(0, -9)], stop=9.38)   # memory
    S.room_tone(6.42, 9.38)
    S.tension([(0, 0), (9.38, 0), (11.45, 1.0), (11.5, 0), (12.0, 0.3), (CUT, 1.0), (CUT + 0.01, 0)])
    for k in DOOR_KNOCKS: S.sfx_at(knock(), k, 0.9)
    S.sfx_at(knock(1.2), BEHIND_KNOCK, 1.0)                     # the fourth: from behind
    S.sfx_at(breath(0.5, 0.15), BEHIND_KNOCK + 0.15)
    S.sfx_at(whoosh(0.4, 300, 4000), 11.72, 0.7)                 # whip-turn
    S.sfx_at(boom(2.5, 40), 11.85, 0.8); S.sfx_at(sting(), 11.85)
    S.sfx_at(boom(2.5, 40), CUT + 1.0, 0.8)                      # title
    S.silence(CUT, CUT + 0.98)                                   # only the whisper survives the cut
```
