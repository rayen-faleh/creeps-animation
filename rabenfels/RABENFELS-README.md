> **Source-only edition:** generated audio/video is omitted. Read [RABENFELS-SOURCE-ONLY.md](RABENFELS-SOURCE-ONLY.md) first for the current story map and audio regeneration steps. Statements below about included recordings describe the earlier full-media package.

# Rabenfels — Night One: The Wrong Hunter

62.5 seconds · 1080×1920 · 30 fps · Kokoro bm_lewis · portrait Instagram Reel

Composition: `Rabenfels01`. Story source: `src/episodes/rabenfels-01/`. Previous compositions remain included.

## Re-render using the included finished audio

```sh
npm ci
npx remotion browser ensure
npx tsc -p .
npx remotion render src/index.ts Rabenfels01 out/rabenfels-night-one.mp4 --codec=h264 --crf=18 --x264-preset=veryfast --audio-codec=aac --audio-bitrate=192k --concurrency=2
```

The full mix and measured narration takes are included, so no TTS access is needed to render. For speech regeneration, install the Python packages in the requirements file and obtain the Kokoro model v1.0 and voices in `voice/`, as described in the original README. Model weights, node_modules and browser caches are not included.

```sh
OMP_NUM_THREADS=2 python scripts/narrate.py src/episodes/rabenfels-01
# For a deliberate new synthesis, remove the old baseline before reassembly:
# work/rabenfels-01/synthesis-timing.json
python scripts/assemble_rabenfels.py
python scripts/build_audio.py rabenfels-01
```

The supplied 21-line script is unchanged. Speech durations and silent phrase boundaries are measured; authored inter-line gaps provide action and reading time. `scripts/assemble_rabenfels.py` sets the starts and events. If wording changes, update that edit after measuring the new takes. No word timestamps are fabricated.

The town/year, resident relationships and comment/casting rules are in `series-bible.md` and `series-ledger.json`. The selection rule is the most-liked comment after twenty-four hours, one action within the established world, ties to the earlier comment. No winner has yet been selected and no post was published.

The user requested flat, cozy Gothic backgrounds. Final image_gen night/morning plates reside at `public/episodes/rabenfels-01/art/town-night.png` and `town-dawn.png`. Final prompts, references and generation provenance are in `final-background-prompts.json` and `assets.json`. Earlier flat-style development prompts are preserved separately. The final refinement adds a little darkness and building wear using two extracted frames from the previous Anytime film. Superseded realistic plates are excluded. Layers of mist, resident articulation, object contacts and hand acting remain separately animated.

New kit art: `Resident`, `ClayCup`, `Coin`, `TownStreet`, `TownHouse`, `PointedWindow`. `Resident` supports Marta, Matthias, Otto and Grete, fixed-length two-bone arms, authored hand targets, lean, glance and blinking. Source stages also include the letter commission, writing desk, tavern/mirror, door-repair memory, forge wheel, witness staircase and shaded crime-scene view. Updated kit catalog included.

See `qa.md` for observed checks and listening/playback limits. Prior story README files describe their respective compositions. The original style skill document is unchanged; this story's brief records the user's image-generation and cozy-background overrides.
