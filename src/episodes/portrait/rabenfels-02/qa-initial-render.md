# QA — Rabenfels Part II: Cloves

## Completed before full export

- Approved revised script preserved: 123 spoken words, 22 synthesised lines. Quotation marks omitted only as TTS punctuation; no narration wording changed.
- Local Kokoro ONNX 0.6.1, bm_lewis, en-gb, v1.0 model; normal .97 / whisper .86. All decoded take lengths measured, no speech stretching. Final authored clock is exactly 64.000s, speech finishes59.639s, cut60.2s, title61.2s.
- Line/phrase ordering and bounds checked against original script and real sample durations; clamped a 1ms rounding edge in one phrase. No fabricated equal word divisions; phrase captions use detected internal silences or whole-line bounds.
- TypeScript passed after final animation edits.
- First22-shot/key-moment still review at phone size, followed by corrected details: enlarged winner credit, cobbled stone ground, coat-to-hand contacts, natural head volume on Safwan's turn, explicit human reflection, visible open claw and air gap before contact.
- Half-resolution encoded proof pilot, global33.0–41.2s, inspected at33,33.22,33.5,33.85,34.15,34.75,35.7,36.2,36.7,37.8,39.4,40.5s. Reviewed first/second foot plants and swings, camera widening and simultaneous empty stair reflection. Human reflection is present when Safwan enters the later framing; both vampires remain omitted.
- Half-resolution encoded action pilot, global46.0–55.83s, inspected at46,46.3,46.8,47.2,48.1,48.6,49.2,50.1,50.5,51,51.5,51.9,52.3,53.4,55.5s. Independent head/eye/arm motion, facial reaction, lantern attachment, body grounding, claw extension and incomplete protagonist intervention checked.
- Added3 reusable-art catalog panels; regenerated23-panel catalog. Inspected new characters, props, stair/mirror set and title panels.
- Master64.000s,48kHz stereo; clean narration 64.000s,24kHz mono. FFmpeg ebur128 master measurement −15.6 LUFS integrated, true peak −1.7 dBFS. build_audio.py verifies exact master duration/rate/channel count. Last spoken line fully within audio.

## Review limitations

Inspection used rendered stills and sequential samples extracted from encoded pilots. No real-time video playback, subjective listening/audition or independent reviewer was available; those are not claimed. Audio checks cover duration, active signal, metadata, measured loudness/peaks and exact transcript timing. This is stylised original fiction, not a documented historical event.

## Final export

- Final MP4: 64.000s video/audio/container, H.264 1080x1920 at 30fps, 1920 frames; AAC 48kHz stereo. 16,262,985bytes.
- Full FFmpeg decode completed without errors. Final AAC audio −15.6 LUFS integrated, true peak −1.3 dBFS, within the house delivery limit. Speech, control prompt and title audio are all present through their complete bounds.
- Inspected 30 samples extracted from the actual final encode: 0.6,1.5,3.7,6.8,9,10.6,13.5,16.5,18,21.1,23.8,26.3,28.5,30.2,31.7,33.5,34.75,36.7,38.5,40.5,42,44.5,46.8,48.6,50.5,51.9,54.6,58.2,60.5,62.5s. The final black hold is intentional, followed by the title.
- Verified opening action/credit, supplier association, recruit lantern raise, wool evidence, locked door, tavern approach, coat and glance, simultaneous empty stair reflection, human reflection, threat/reaction, visible gap before contact, incomplete protagonist hand rise, readable prompt and title.
- The first final-container export became incomplete during preparation and was rejected. Rebuilt to a temporary output, decoded it, then atomically replaced the final path. Repeated final metadata/full decode and all 30 frame extractions from the retained file; stable size 16,262,985bytes.
- Source archive CRC and required-content verification are performed by part-two-package.py before saving; no model weights, node_modules, caches or intermediate videos are included.
