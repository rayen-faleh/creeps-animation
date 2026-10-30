# The Friend Who Never Knocks — Come In

37.000-second Instagram Reel. Original approved script, Gothic POV Kit, 1080×1920, 30 fps. Fresh Kokoro ONNX 0.6.1 bm_lewis narration, en-gb, normal speed 0.97, whisper 0.86. Burned-in serif captions, measured SRT and entirely synthesised sound.

## Render with included audio

```bash
npm ci
npx remotion browser ensure
npm run typecheck
npx remotion render src/index.ts NeverKnocks out/friend-who-never-knocks-render.mp4 --codec=h264 --crf=18 --x264-preset=veryfast --audio-codec=aac --audio-bitrate=192k --concurrency=2
ffmpeg -y -i out/friend-who-never-knocks-render.mp4 -i public/episodes/friend-who-never-knocks/mix.wav -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -t 37 -movflags +faststart out/friend-who-never-knocks.mp4
```

The final mix and individual narration takes are included; rendering does not require TTS credentials or model weights. The second command sources AAC directly from the lossless final mix and gives both streams an exact 37-second duration.

## Edit

Episode source: src/episodes/friend-who-never-knocks. Main.tsx chooses scenes, scenes/Story.tsx authors motion, script.json holds the approved narration, timing.json contains measured speech/phrase times, and events.json shares cut and effect times with cues.py. scripts/assemble_friend.py inserts authored suspense pauses and exports SRT. For changes to scene timing, update its events dictionary rather than maintaining separate audio and scene values.

To resynthesise: install requirements-preview.txt, download model v1.0 files into voice/ using voice/README.md, remove work/friend-who-never-knocks/synthesis-timing.json, run narrate.py, assemble_friend.py, then build_audio.py. Recheck every changed caption and animation cue. Model weights, node_modules, caches and intermediate renders are deliberately omitted.

## Updated reusable kit

New src/kit/art/FriendProps.tsx adds VisitorShoes, BedsideLamp, and HeldArm. HeldArm has an optional captor layer: the mirror uses the same articulated arm state while omitting the vampire. The lamp pull-chain and free-hand fingertip share the same camera transform. Existing kit components and their fixed styles are retained. The catalog includes the new props in docs/kit-catalog.png.

The original kit episodes and previous preview are preserved. This bundle is both the editable film project and an updated kit. For provenance, read the episode's assets.json and research.md; for actual inspection and playback limitations, read qa.md. Original font/model license notes are retained in README.md.

Post caption:

> To the friend who never knocks: we need to talk.
