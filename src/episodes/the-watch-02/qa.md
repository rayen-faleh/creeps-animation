# The Watch, Part II: QA record

Render: `out/the-watch-02.mp4`, Chatterbox narration in the owner's voice (`tts/voices/narrator_ref_original.wav`).

## Technical (checked)
- ffprobe: 1080×1920, 30/1 fps, H.264 + AAC stereo, 64.448 s; full decode clean; −15.4 LUFS integrated, peak −1.5 dBFS.
- Narration 61.6 s (3.4 s cliffhanger silence included); cut 59.84 s; title card to 64.4 s. All cuts derived from timing.json by beats.py.
- Captions: 31 phrases, `.srt` from the same timing (tts/make_srt.py).

## Visual (seen)
- One still per shot during the build, and a 1 s contact sheet of the final file (`out/the-watch-02-contact.png`).
- Fixed after review: diary in the hook was off-frame and too small (centred, pushed in); the key showed early and hung in the caption band (now only in S05); three wolfsbane bundles on the door read as grapes (now two smaller, spaced bundles).
- Readable at phone size: "S. at window. Held.", "Both boys in by dark.", the shaky "D. took my arm.", "keep D. away from the boy.", both phone threads.

## Story gate
- Hook in the first 4.4 s; continues directly from Part I's torch; spoken clue ("the same line… Held.") and visual clue ("Both boys in by dark."); reveal readable sound-off (the handwriting); proof page; unfinished action (door opening), hard cut, whisper "He has a key.", title.
- Grade warm only for the memory of Mick at the lamp; cold elsewhere; none on black.

## Not checked / limits
- I cannot play audio here: the narration, pronunciation and mix were measured, not heard.
- Motion judged from frames and a 1 s contact sheet, not watched at full speed.
- Captions sit over the bright notebook pages in S09–S14; they rely on the caption shadow for contrast.
