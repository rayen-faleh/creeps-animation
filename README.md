# Creeps Animation

First-person gothic horror shorts for Instagram Reels / YouTube Shorts (9:16, 1080×1920, 30 fps), built with
Remotion + React + TypeScript on the **Gothic POV kit**. Everything you see is code-drawn SVG, everything you hear is
synthesised, and the narrator is a local TTS model, so there are no stock assets or paid services.

Current series: **THE WATCH**, a werewolf story in five episodes. Episode 1 lives in `src/episodes/the-watch-01`.

## Where everything is

```
creeps-animation/
├── assets/                     Static files the video loads (Remotion's publicDir, see remotion.config.ts)
│   ├── fonts/                  Cormorant Garamond (captions), UnifrakturCook (title card)   SIL OFL 1.1
│   ├── textures/               grain0-7.png film-grain tiles (regenerate: scripts/make_grain.py)
│   ├── audio/<slug>/mix.wav    Mastered soundtrack per episode (narration + score + SFX), made by sound/build_audio.py
│   └── provenance.json         Source and licence of every asset
│
├── tts/                        Narration (text-to-speech)
│   ├── narrate.py              script.json -> per-line takes, narration.wav, timing.json (measured word/phrase times)
│   ├── chatterbox_lines.py     Optional Chatterbox worker (voice cloning), called by narrate.py --engine chatterbox
│   ├── voices/                 Reference clips for cloning engines (storyteller_ref.wav = synthetic bm_lewis)
│   ├── models/                 Kokoro model files (downloaded, not committed): run tts/download_models.sh
│   └── download_models.sh
│
├── sound/                      Synthesised score and effects engine (no samples)
│   ├── sound_lib.py            Music box, drone, wind, tension, knocks, booms, heartbeat... and the house mix
│   └── build_audio.py          Runs an episode's cues.py, mixes with the narration, masters to about -15 LUFS
│
├── scripts/                    Review and render helpers
│   ├── stills.mjs              Render chosen frames to out/stills/<Composition>/
│   ├── contact.sh              Contact sheet of a rendered MP4
│   ├── catalog.sh              Rebuild docs/kit-catalog.png from src/catalog
│   └── make_grain.py           Regenerate assets/textures
│
├── src/
│   ├── index.ts, Root.tsx      Remotion entry; Root registers one composition per episode
│   ├── kit/                    Reusable, story-agnostic art and finishing (extend it, never restyle per story)
│   │   ├── art/                Window, Door, Hand (rig + styles incl. wolf), Room, Props,
│   │   │                       Street (moor-edge street, garden wall), Watcher (one-armed man), Charms
│   │   │                       (wolfsbane, silver nails, mud prints), Modern (phone, funeral card)
│   │   ├── sets/               WindowWall, DoorWall: complete backgrounds
│   │   ├── series/             StoryFrame (grade, grain, captions, audio), Captions, TitleCard, fonts
│   │   ├── fx.tsx              Camera (handheld), Stage, Torch, Eyelids, Vignette, Flicker, Grain
│   │   ├── theme.ts, util.ts   Palette and deterministic helpers (track, prog, rng, noise1)
│   │   └── index.ts            One import for everything
│   ├── episodes/<slug>/        One folder per episode (see below)
│   └── catalog/                A panel per kit component -> docs/kit-catalog.png
│
├── series/                     Series bible: brainstorms, arcs, concepts (werewolf-brainstorm*.md)
├── docs/                       kit-catalog.png (visual index of the kit), SKILL.md (full kit source edition)
├── work/<slug>/                Raw narration takes (keep: the final mix alone cannot be re-edited)
└── out/                        Renders and stills (git-ignored)
```

### An episode folder

```
src/episodes/the-watch-01/
  brief.md          story brief: folklore, hook, clues, twist, cliffhanger
  script.json       narration lines [{id, text, pauseAfter, whisper?}]
  timing.json       written by tts/narrate.py: measured line and caption-phrase times (the timing authority)
  shots.json        shot list: id, start/end seconds, purpose, light, grade
  Main.tsx          META (id, duration, audio path), sceneAt / gradeAt / dipAt, red caption words
  scenes/*.tsx      the shots (Memory.tsx = childhood, Present.tsx = present day)
  cues.py           music and effects cues, same clock as the scenes
  the-watch-01.srt  captions file for upload
  assets.json       provenance notes for this episode
  qa.md             what was checked, seen and heard
```

## TTS: which voice and how

| | |
| --- | --- |
| Default engine | **Kokoro-82M** (kokoro-onnx 0.6.1, model files v1.0), offline on CPU, Apache-2.0 |
| Voice | `bm_lewis`, deep British male, `lang="en-gb"`; speed 0.97, whispers 0.86 plus a breathy whisper filter |
| Optional engine | **Chatterbox** (Resemble AI, MIT): clones `tts/voices/storyteller_ref.wav` with more dramatic delivery. It needs its own Python 3.11 venv (`/root/.venvs/chatterbox`, or set `CHATTERBOX_PYTHON`) and access to huggingface.co for the first weight download. Output carries Chatterbox's imperceptible watermark |

```
# once, for Chatterbox (Python 3.11 venv; setuptools<81 provides pkg_resources for its watermarker):
uv venv -p 3.11 /root/.venvs/chatterbox && VIRTUAL_ENV=/root/.venvs/chatterbox uv pip install chatterbox-tts "setuptools<81"
# the first run downloads weights from huggingface.co plus *.hf.co / *.xethub.hf.co storage hosts
```

```
tts/download_models.sh                                         # once: Kokoro weights into tts/models/
python3 tts/narrate.py src/episodes/the-watch-01               # Kokoro (default)
python3 tts/narrate.py src/episodes/the-watch-01 --engine chatterbox
```

Either engine writes the same outputs (`work/<slug>/line_*.wav`, `narration.wav`, `src/episodes/<slug>/timing.json`), so
everything downstream stays the same. Any change to the narration means re-running `sound/build_audio.py`, and the
cuts in `Main.tsx` may need to move to the new phrase times.

## Setup

```
npm ci
pip install kokoro-onnx==0.6.1 soundfile numpy scipy
tts/download_models.sh
# ffmpeg + ffprobe on PATH. If Remotion cannot download Chrome:
export REMOTION_BROWSER=/path/to/chrome-headless-shell
npx tsc -p .
npx remotion studio src/index.ts        # browse TheWatch01, TheCount01, Template, Catalog
```

## Making an episode

```
cp -r src/episodes/_template src/episodes/<slug>
# write brief.md and script.json; set META in Main.tsx
python3 tts/narrate.py src/episodes/<slug>                 # aim for 60-63 s of narration
# shots.json, scenes/*.tsx, sceneAt/gradeAt/dipAt; register in src/Root.tsx; write cues.py
python3 sound/build_audio.py <slug>
node scripts/stills.mjs <CompositionId> 1 5 9 ...          # one still per shot, check at phone size
npx remotion render src/index.ts <CompositionId> out/<slug>.mp4 --codec=h264 --crf=18 --x264-preset=veryfast --audio-codec=aac --audio-bitrate=192k
scripts/contact.sh out/<slug>.mp4
```

Render Episode 1: `npx remotion render src/index.ts TheWatch01 out/the-watch-01.mp4 --codec=h264 --crf=18 --x264-preset=veryfast --audio-codec=aac --audio-bitrate=192k`

The style rules (POV, palette, shot grammar, captions, sound, QA) come from the `gothic-pov-style` skill.
`docs/SKILL.md` is the kit's full-source edition. It describes the original kit layout, which this repo has since
reorganised:

| Kit original | This repo |
| --- | --- |
| `public/` (fonts, tex, episodes/<slug>/mix.wav) | `assets/` (fonts, textures, audio/<slug>/mix.wav) |
| `voice/` | `tts/models/` |
| `scripts/narrate.py` | `tts/narrate.py` |
| `scripts/sound_lib.py`, `scripts/build_audio.py` | `sound/` |

## Episodes

| Composition | Folder | Length | Notes |
| --- | --- | --- | --- |
| `TheWatch01` | `src/episodes/the-watch-01` | 63.5 s | The Watch, Part I (werewolf series) |
| `TheCount01` | `src/episodes/the-count-01` | 64.0 s | Kit reference film |
| `Template` | `src/episodes/_template` | 18.5 s | "The Knock", starting point for new stories |
| `Catalog` | `src/catalog` | n/a | Every kit component |

## Licences

Art, textures, music and effects are original and generated by this project's code. Fonts are SIL OFL 1.1, Kokoro is
Apache-2.0 and Chatterbox is MIT. Thornhallow, Mick Ashworth and Danny are fictional.
