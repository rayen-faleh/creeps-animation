# The Fourth Knock — 15-second gothic POV preview

A new short edit using the provided Gothic POV Kit, adapted from its The Knock template.
1080×1920, 30 fps, exactly 450 frames. Narration freshly synthesized with Kokoro ONNX 0.6.1, model v1.0, bm_lewis / en-gb, normal speed 0.97 and whisper speed 0.86.

## Render with supplied audio

```bash
npm ci
npx remotion browser ensure
npm run typecheck
npx remotion render src/index.ts FourthKnock out/the-fourth-knock-15s.mp4 --codec=h264 --crf=18 --x264-preset=veryfast --audio-codec=aac --audio-bitrate=192k --concurrency=2
```

The source bundle includes the final mix and individual speech takes, so rendering needs no TTS credentials or model download. The original kit is retained and shared components are unchanged. Preview files live in src/episodes/the-fourth-knock. events.json is the common timing authority for the visuals and effects. timing.json stores measured speech and phrase times.

## Edit narration

Install the Python dependencies in requirements-preview.txt. Download the two model files using voice/README.md; model weights are excluded from this source bundle. Change script.json, remove work/the-fourth-knock/synthesis-timing.json if resynthesizing, then run:

```bash
python scripts/narrate.py src/episodes/the-fourth-knock
python scripts/assemble_preview.py
python scripts/build_audio.py the-fourth-knock
```

Adjust the authored line starts in assemble_preview.py and event times in events.json for any new script. Keep the final narration within 15 seconds. Captions are exported by assemble_preview.py. The mix master uses fixed gain and a limiter, without dynamic loudness normalization.

## Provenance and review

See assets-preview.json, brief.md, shotbook.json, research.md and src/episodes/the-fourth-knock/qa.md. Fonts and model license notes from the supplied kit are in README.md. This is fictional horror, with no gore or real-world subject.
