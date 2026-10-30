# Anytime — revised Reel

32.2 seconds · 1080×1920 · 30 fps · Kokoro bm_lewis · English

The revised composition is `AnytimeRevised`. The original `NeverKnocks` composition remains for comparison. New episode files are under `src/episodes/anytime-revised/`.

## Render from included audio

```sh
npm ci
npx remotion browser ensure
npx tsc -p .
npx remotion render src/index.ts AnytimeRevised out/anytime.mp4 --codec=h264 --crf=18 --x264-preset=veryfast --audio-codec=aac --audio-bitrate=192k --concurrency=2
```

Narration and the finished mix are included. Regenerating speech requires `kokoro-onnx==0.6.1`, numpy, scipy, soundfile, FFmpeg and the Kokoro v1.0 model/voice files in `voice/` (not bundled). See README.md for model download links. Normal speech speed .97; whisper .86.

```sh
OMP_NUM_THREADS=2 python scripts/narrate.py src/episodes/anytime-revised
# When intentionally regenerating speech, remove the prior cached baseline before reassembly:
# work/anytime-revised/synthesis-timing.json
python scripts/assemble_anytime.py
python scripts/build_audio.py anytime-revised
```

`timing.json` is measured speech plus authored gaps; `events.json` supplies shared picture and sound landmarks. Update the starts and events in assemble_anytime.py if wording/duration changes. Do not stretch the speech. Captions use detected silent phrase boundaries or whole-line fallback, not guessed word timing.

New reusable `ClaspedWrist` art and its catalog panel are included. `Mirror.ageSpots` defaults true for original scenes and is false in the revised proof image. Source art, fonts, existing notices, prior episodes and mix files retained. Dependencies, model weights, render caches and review intermediates excluded.

See the episode’s `revision-notes.md`, `brief.md`, `research.md` and `qa.md` for rationale, source grounding and actual verification limits.
