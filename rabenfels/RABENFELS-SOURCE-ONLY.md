# Rabenfels — complete source-only archive

Start here. This compact edition preserves every non-audio file from the latest
approved Part II editable project. It includes the complete Rabenfels Night One
and Part II source, all packaged visual assets, previous scripts, and the reusable
Gothic POV kit. The approved eye perspective and geometric rear-view mirror fixes
are integrated in the source.

Generated videos, narration takes, soundtracks, sound-effect recordings and other
audio files are deliberately excluded. No audio/video is hidden in another archive.
Dependencies, browser caches and downloadable Kokoro weights are not bundled.
Audio must be regenerated before an ordinary narrated render. The earlier README
files describe full-media deliveries; this guide takes precedence for this edition.
Historical QA describes those prior renders, not a fresh render of this archive.

## Story strategy and script map

- `story/rabenfels-series-bible-and-pilot.md`: current master strategy, town/year,
  Elias's cover and vampire rules, human cast and roles, viewer participation,
  selection/casting rules, episode format, pilot script and future story guidance.
- `story/rabenfels-part-two-script.md`: approved Part II script and direction.
- `src/episodes/rabenfels-01/script.md` and `script.json`: Night One spoken script.
- `src/episodes/rabenfels-02/script.md` and `script.json`: current 23-line Part II
  script, including the spoken opening, “You decided to smell the body.”
- `src/episodes/rabenfels-02/series-ledger.json`: latest canon, winning comment,
  Safwan's role/knowledge, clues, relationships and unresolved choices. Episode 01's
  ledger and local bible remain historical snapshots; prefer the master above.
- Each episode's `shots.json`, `brief.md`, `events.json`, `timing.json`, `.srt` and
  post caption preserve its edit, staging and publication copy.
- Previous standalone stories are retained under `src/episodes/anytime-revised`,
  `friend-who-never-knocks`, `the-fourth-knock` and `the-count-01`; `_template`
  remains a starting point. These are reference projects, not Rabenfels canon.

The current story ends before the stranger touches Safwan. Safwan is alive and has
not identified Elias as a vampire; no next winning action has been selected. Start
future episodes with “You decided to <winning action>.” Use the latest ledger and
master strategy rather than resolving the cliffhanger without the next comment.

## Visual assets and reflection implementation

- `public/episodes/rabenfels-01/art/`: approved weathered night and dawn town plates.
- `public/episodes/rabenfels-01/reference/`: retained reference frames.
- `public/fonts/`, `public/tex/`: all packaged fonts and grain textures.
- `src/kit/`, episode `scenes/`: editable SVG characters, hands, props, sets, motion,
  captions and finishing. Many assets are drawn in code rather than image files.
- `docs/kit-catalog.png`: 24-panel kit catalog, including Safwan's front/rear views.
- `docs/planar-mirror-method.md`: calibrated 2.5D geometry, shared staircase,
  reflected viewpoint, rear artwork and known limits. See `ClovesBackFigure.tsx`,
  `PlanarReflection.ts`, `ProjectedMirror.tsx` and `TavernLanding.tsx` in `src/kit/`.
- Episode `assets.json` and prompt JSON files preserve provenance and style notes.
  Rejected background experiments were already excluded from the approved project.

## Install and regenerate audio

Use Node/npm, Python 3, FFmpeg and ffprobe. From this project's root:

```sh
npm ci
npx remotion browser ensure
python3 -m venv .venv
. .venv/bin/activate
python3 -m pip install -r requirements-preview.txt
mkdir -p voice
```

Download `kokoro-v1.0.onnx` and `voices-v1.0.bin` from
https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
and put them directly in `voice/`. Narration uses Kokoro ONNX 0.6.1, bm_lewis,
en-gb. The audio engine and all original synthesized SFX recipes are in `scripts/`;
external sample recordings are not required.

Rebuild Night One. Replace its retained synthesis baseline with the newly measured
one before assembly, so old phrase timestamps are not applied to fresh takes:

```sh
OMP_NUM_THREADS=2 python3 scripts/narrate.py src/episodes/rabenfels-01 --models voice
cp src/episodes/rabenfels-01/timing.json work/rabenfels-01/synthesis-timing.json
python3 scripts/assemble_rabenfels.py
python3 scripts/build_audio.py rabenfels-01
```

Rebuild Part II, including the regular-voice stranger treatment:

```sh
OMP_NUM_THREADS=2 python3 scripts/narrate.py src/episodes/rabenfels-02 --models voice
python3 scripts/revise_cloves_voice.py --models voice
python3 scripts/assemble_cloves.py
python3 scripts/build_audio.py rabenfels-02
npx tsc -p .
```

Keep the stranger's mild pitch/pace/EQ/compression and mostly dry short room reverb;
`voice-settings.json`, `revise_cloves_voice.py` and `sound_lib.py` record the settings.
Fresh synthesis can differ from the delivered recording. Remeasure and review it;
assembly asserts that takes fit their authored slots. If a slot fails, adjust the
edit deliberately and propagate changed timing to pictures, captions and sound.
Retained timing/SRT files document the approved prior edit, not guaranteed alignment
for every future synthesis. Previous standalone stories have their own README and
assembly scripts; regenerate their audio separately if rendering them.

## Open and render

After rebuilding the chosen episode's audio:

```sh
npx remotion studio src/index.ts
# Choose Rabenfels01 (62.5 s) or Rabenfels02 (65 s).
npx remotion render src/index.ts Rabenfels02 out/rabenfels-part-two.mp4 --codec=h264 --crf=18 --x264-preset=veryfast --audio-codec=aac --audio-bitrate=192k --concurrency=2
```

Locked Remotion/React/TypeScript versions remain in `package-lock.json`. Inspect
motion around the head turn and reflection, plus neighboring shots, in the actual
export. Do not treat historical QA or a successful typecheck as fresh playback QA.

`SOURCE-MANIFEST.json` inventories every packaged file with its SHA-256 and lists
removed media paths/sizes. All original scripts, source, fonts and image assets
are byte-identical to the approved project; only these setup notes and the three
entry-point README notices are added. This source-only packaging does not change
the finished episode or the unresolved next action.
