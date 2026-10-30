# Rabenfels — Night One QA

## Completed before export

- User-approved series bible read from its current Library file. All 21 spoken lines retained, including comment and casting ending. 121 words.
- Fresh Kokoro bm_lewis takes, ONNX 0.6.1/model v1.0/en-gb, .97 normal/.86 on isolated denial. Measured decoded sample durations, silence-based phrase boundaries or whole-line fallback. Authored pauses, no speech stretching. Speech begins .35 s and ends 58.716 s; composition 62.5 s.
- TypeScript passed. Script equals timing transcript; caption bounds and ordered line intervals validated. Stereo master checked at exactly 3,000,000 samples / 48 kHz.
- An early mastered WAV was found shorter than the composition. Re-mastered from the complete 62.5-second PCM raw mix and verified exact duration, including the final narration. Added a runtime duration/channel/rate guard to build_audio.py. Final delivery will use this verified full-length master directly.
- Initial 19 styleframes inspected at 1.2, 5.6, 8.9, 11.5, 14.1, 16.9, 20.4, 23.8, 26.8, 30, 32.5, 37.6, 40.3, 43.6, 47.4, 50.5, 53.8, 57.6 and 61.8 seconds.
- Rendered 400-frame half-resolution resident pilot, global 15.1–28.43 s. Inspected 20 encoded samples at 15.3, 15.9, 16.25, 16.6, 17, 18, 18.6, 19, 19.5, 20.4, 21.6, 22.6, 23.2, 23.8, 24.8, 25.7, 26.3, 26.5, 26.65 and 27.1 s. This covers the cup approach/placement/release, mirror turn, greeting and door-repair stroke.
- Corrections from review: widened rent foreground SVG to keep payment visible; moved held purchase contact onto cup; raised reflected cup clear of the counter; completed Grete's character design.
- The first generated town plates were too realistic; user rejected them. Replaced night and dawn with flat cel-shaded, cozy Gothic versions using an actual Marta animation frame as style reference. Superseded plates are outside delivered source. Inspected final night/dawn composites with actors and body; continuity uses the same architecture and camera.
- Twenty-panel reusable kit catalog regenerated and inspected after the final weathered background refinement. Includes all four resident variants and final town artwork.

- Final user-directed refinement: use two actual encoded Anytime frames (6.5 s and 25.6 s) as image-generation references; modestly darken and weather building surfaces, preserving layout and flat animation style. Final plate composites rechecked before replacing the exterior scenes.

## Limits

No real-time playback or subjective audio listening was available. Motion review uses sequential encoded frames; it is not a claim to have watched a real-time playback. Pronunciation (including invented town/name readings), vocal performance and perceptual mix balance were not personally auditioned. No independent reviewer. This is a layered illustration/cel animation, not a fully three-dimensional town.

## Final deliverable

- Final MP4 is H.264, 1080×1920, 30 fps, 1,875 frames. AAC is 48 kHz stereo. Video, audio and container durations are each exactly 62.500 seconds.
- Full final MP4 decoded cleanly with FFmpeg.
- Final encoded AAC: −15.7 LUFS integrated; true peak −1.5 dBTP.
- Inspected 28 final encoded frames at 1.2, 3.3, 5.7, 8.9, 11.5, 14.1, 15.4, 16.25, 17, 18.2, 19.3, 20.4, 23.8, 26.3, 26.5, 29.8, 32.5, 35, 37.6, 40.3, 43.6, 47.4, 50.5, 53.8, 55.5, 57.6, 59.3 and 61.8 seconds. Covers every shot, revised background treatments, contact poses, mirror proof, body view, question, casting prompt, black hold and end title.
- Confirmed all final three narration chunks contain nonzero speech at the measured positions before export; full-length audio master is included in source.
- Editable archive checked for CRC errors and required source/prompts; dependencies, weights, caches, rejected artwork and intermediate renders excluded.
