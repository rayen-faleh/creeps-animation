# Anytime — revision QA

## Checks completed before final export

- Existing 37-second deliverable inspected via ffprobe and a 9-frame encoded contact sheet. Timestamped design/script diagnosis recorded in revision-notes.md.
- Revised script: 66 words, 13 lines, hook begins at .18 s, culpability line at 2.05 s. The mirror mechanism is withheld from the opening.
- Fresh Kokoro ONNX 0.6.1 bm_lewis narration; en-gb, model v1.0, .97 normal/.86 whisper. Whisper processing inherited from kit. Line durations measured from decoded samples; phrase splits measured from detected silences, with whole-line fallback. Authored inter-line gaps, no speech stretching.
- TypeScript check passed. Transcript, line ordering, phrase bounds, shared event order and exact 32.2-second 48 kHz stereo mix validated.
- 17 composition stills inspected: .7, 2.6, 4.1, 6.5, 8.8, 9.6, 10.8, 13.2, 16.4, 18.5, 20.95, 21.3, 22.9, 25.6, 27.8, 28.8, 31.3 seconds. Full catalog of 18 panels regenerated and inspected.
- Half-resolution encoded pilot: frames 600–879, including lamp approach/contact/release, continuous glance, proof hold, tightening/pull and cut. Inspected 16 ordered encoded samples at global 20.3, 20.8, 20.95, 21.2, 21.6, 21.95, 22.4, 23.4, 25.3, 26.4, 27.4, 28.5, 28.7, 28.83, 28.96 and 29.1 seconds.
- Observed improvements: enlarged reflected forearm and asymmetric grasp; clear chain contact before lamp illumination; the arm and fingers remain attached through the final tug. Whisper ends after black cut; title delayed by 1 s.
- After composition review: removed patina spots that overlapped the reflected skin, added a slow lean toward the whispered voice, and changed the single red proof word to “not.” Final encode inspection covers those changes.
- Master WAV: −15.5 LUFS integrated; −1.6 dBTP. Fixed gain and limiting, no dynamic loudness normalization.

## Limits

No real-time video playback or subjective audio audition was available. The motion assessment uses sequential encoded frames, not a claim to have watched real-time playback. Pronunciation, vocal performance and perceptual balance are not independently auditioned. No independent reviewer. This is stylized code-drawn SVG animation.

## Final export

- H.264 1080×1920, 30 fps, 966 frames; AAC 48 kHz stereo. Video, audio and container durations each exactly 32.200 seconds.
- Entire final MP4 decoded without errors.
- Final AAC measured −15.5 LUFS integrated and −1.6 dBTP.
- 20 final encoded frames inspected at .7, 2.6, 4.1, 6.5, 8.8, 9.6, 10.8, 13.2, 16.4, 18.5, 20.95, 21.3, 22.9, 25.6, 27.8, 28.8, 28.96, 29.1, 30.5 and 31.8 seconds. Confirmed reflection patina removal, increased framing during voice, red “not,” final pull displacement, black cut and legible title.
- SRT follows measured phrases in order; captions and image action remain separate at key proof moments.
- Editable archive excludes node_modules, weights, caches, hidden files and review renders; CRC checked before saving.
