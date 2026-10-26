# The Quarter Turn: QA record

Deliverable: `out/the-quarter-turn/the-quarter-turn.mp4` (not committed; 152 MB), plus chapter parts `part1.mp4` to `part5.mp4`.

## Technical (checked)
- ffprobe: 1920x1080, 30/1 fps, H.264 + AAC stereo, 613.000 s; exactly 18,390 video frames (sum of the five parts); full decode clean.
- Loudness of the final file: -16.1 LUFS integrated; sample peak -1.1 dBFS after AAC encoding (mix master measured -1.3 dBTP before encoding; the 0.2 dB overshoot is the AAC encoder, acceptable for YouTube, which normalises).
- First join attempt (stream-copy concat) dropped 3 frames at part boundaries and a raw-bitstream join gave 18,388; fixed by decoding the parts and encoding the join once (scripts/render_parts.sh now does this).
- Narration 603.3 s; 120 lines; 311 caption phrases (max 65 characters) from measured silences; `.srt` from the same timing.
- Long-form soundtrack `assets/audio/the-quarter-turn/mix.wav` is git-ignored (112 MB > GitHub limit); rebuild with `python3 sound/build_audio.py the-quarter-turn --target -15.8`.

## Visual (seen)
- Stills of every shot during the build; contact sheets of each finished part at one frame per 4 s.
- Fixed before rendering: cold open framing (crosshead, spout and the drop's fall in frame); snow-capped roses read as strawberries (redrawn); Gran's clasped hands formed a V; Chapter IV continuity (the back bedroom door showed ajar before it was found open: now his own closed door at "A sound, downstairs"); MantelPhoto clip hid the top half of the wedding photo (clip moved outside the offset); Grandad's reflection too faint; the boots on the stairs lost in the dark; oversized sleeve in the burial flashback.
- Known soft spots: Chapter IV is very dark by design (phone torch only); the push on the wedding photo crops the groom's face low; faces in the photo are simple.

## Story / style gate
- Hook in the first 9 s (cold open); title; five chapters with subtle markers; clues planted (December roses, "her eyes", faster drip on dark nights, frost except the rose bed, "she kept the water moving", 1974 joint); the reveal is read in Gran's own voice; open ending; whispered last line in a different voice; hard cut to black and title.
- First person throughout: only hands on screen (plus Mr Haworth in profile, Gran in profile and in a photo, Grandad as a silhouette and a reflection).
- Grade: warm for memories and Gran's flashbacks, cold for the present, none on black.

## Not checked / limits
- I cannot play audio in this environment: the voices (bm_lewis, bf_emma, bm_george), the drip sync and the mix were measured, not heard.
- Motion judged from stills and contact sheets, not watched at full speed.
