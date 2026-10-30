# QA — Part II revision after user review

## Issues addressed

The user reported an inaudible, harsh “And I'll keep your secret,” a missing spoken decision opening, and Safwan's turning eye disappearing under his ear. The original review missed the eye/ear overlap; its earlier record is retained as qa-initial-render.md.

- Opening now speaks “You decided to smell the body.” while the selected action is underway, then shows its scent result. The master series plan and production script explicitly record that sequel format.
- Stranger lines L16/L17 are regenerated as full regular bm_lewis speech, speed 0.94, pitch −0.8 semitones, mild presence EQ and gentle compression. Normal narration remains 0.97. Matched spoken level is close to surrounding narration. No noise-envelope whisper processing is used in this episode.
- Mix uses unattenuated dry character speech with 14% weighted short early room reflections, ending at 233ms. This replaces the long 50%-wet whisper treatment. Background sound is muted under the demand; the reveal sting is softened.
- Ear geometry moves to the head's side as Safwan turns; it is painted before the eye layers. The second eye is narrowed and stays on the facial plane. A geometry check covers 650 intermediate orientations with the far-eye right edge strictly before the ear's left edge. The same corrected component drives his reflected head.

## Completed checks

- The revised 23-line transcript contains 130 spoken words. All line/phrase boundaries are remeasured from decoded current takes; unchanged takes are reused. No equal-duration word timestamps or speech stretching. Dialogue pitch processing preserves its generated timing.
- Authored 65.000s timeline, speech ending 61.139s, hard cut 61.7s and title 62.7s. Narration 24kHz mono and master 48kHz stereo both contain exactly 65.000s.
- No whisper flags in Part II timing. Both stranger takes carry the explicit voiceStyle=stranger field. Final speech-window RMS: L15 .1401, L16 .1551, L17 .1250, L18 .0785. The replacement secret line is within the narrator's ordinary level range.
- As an engineering check, the secret take's 80–1200Hz energy share changed from 2.15% in the rejected breath/noise take to 78.62% in the regular voiced replacement. This checks that the thin noise treatment was removed; it is not a substitute for subjective listening.
- TypeScript passed. Reviewed 7 close-up turn poses before retiming and 12 revised timeline stills including the opening, turn, question and title.
- Inspected actual half-resolution encoded pilot 42.5–53.5s at 42.9,44,45.3,46.5,47.8,47.96,48.12,48.28,48.44,48.6,49.8,51.6,52.4s. The eyes stay separate from the ear through the turn, including the human reflection; the stranger's claw still stops before contact.
- Updated 23-panel reusable kit catalog regenerated.

## Limits

No real-time playback, subjective audio listening or independent reviewer was available. Checks use decoded audio measurements, waveform/spectral/level checks, original generated transcript and rendered/encoded frame sequences. Do not claim that subjective audition passed.

## Final export

- Retained MP4 is exactly 65.000s,1950frames,1080x1920/30fps H.264, AAC 48kHz stereo. Full FFmpeg decode passes without errors. Encoded audio measures −15.7 LUFS integrated and −1.6 dBTP.
- Inspected 30 samples from the actual final encode: .9,2.8,5.8,8.5,12.6,15.5,20,23,25.8,28.3,30.5,32,33.7,35.5,38.7,41.8,43.3,45.9,47.8,47.96,48.12,48.28,48.44,48.6,50.2,53.3,56.1,59.7,62.2,64.4s. Opening decision and consequence, normal caption treatment on the stranger, corrected real/reflected turn and unfinished reach are intact. The black hold before the title is intentional.
- Final audio was encoded and measured separately, then copied without re-encoding into the final MP4. Muxed to a temporary path, verified, and atomically replaced the final file. Size 16,603,212 bytes.
- The final source archive is CRC-checked by part-two-package.py and includes revised script, series plan, voice settings, measured takes, updated catalog and reproducible source. Weights, dependencies, caches and intermediate renders are excluded.
