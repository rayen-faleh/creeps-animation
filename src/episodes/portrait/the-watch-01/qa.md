# The Watch, Part I: QA record

Current render: `out/the-watch-01.mp4`, Chatterbox narration in the owner's voice (original recording as reference), from commit 95d7f87.
- ffprobe: 1080×1920, 30/1 fps, H.264 + AAC stereo, 66.240 s; full decode clean; −15.1 LUFS integrated, peak −1.5 dBFS.
- Narration 63.1 s (2.7 s cliffhanger silence included), so the film is 66.2 s: about 1 s over the style's 65 s ceiling, accepted for the owner's voice.
- Cuts re-derived from timing.json by beats.py; contact sheet at 1 s checked: every shot sits under its caption; the S10 hand now clears "First full moon…".
- Not heard: I cannot play audio here. Chatterbox pronunciation, accent and the whisper line were checked by the owner's ear only (auditions), not by me.

Earlier render (Kokoro bm_lewis, 63.5 s, kept as `out/the-watch-01-kokoro.mp4`), from commit 56bb077 plus layout move:

## Technical (checked)
- ffprobe: 1080×1920, 30/1 fps, H.264 + AAC stereo, 63.509 s. Full decode with ffmpeg: no errors.
- Loudness of the final MP4: −15.3 LUFS integrated; mix master reported true peak −1.4 dBFS (target ≤ −1.3).
- Captions: 28 phrases from measured silences in timing.json, never overlapping; `.srt` written from the same phrases.
- Narration 60.4 s of 63.5 s (includes 2.7 s cliffhanger silence before the whisper); hook spoken by 4.1 s.

## Visual (seen)
- Contact sheet at 1 s intervals across the whole film (`out/the-watch-01-contact.png`), plus full/half-res stills of every shot during the build.
- Phone-size readability fixes made after review: Mick's pinned sleeve (first read as a dial), mud marks (first read as a comb, then flames, then a crab; now a clawed handprint pointing out), phone fingers (read as pegs), fur (read as straw), lamp hidden behind the window mullion (moved into the right lancet), street too canyon-like (roofs lowered, windows widened).
- Found in the final render: in S10 the hand withdrew slowly through the caption band at 30.6–31.8 s. Fixed in code (withdraws before the caption); needs the next re-render.

## Style gate
- Hook within 3 s; real folklore (silver, wolfsbane, full moon); spoken clue (S10) and visual clues (silver in OUR sill, wolfsbane over OUR door, torch on OUR window, "He kept watch."); twist readable sound-off (text on phone, clawed print pointing out, the hands); unfinished ending, hard cut, whisper, title.
- Grade: warm 0–25.14 s (memory), cold after the dip, none on black. No narrator face; hands act (point, prod, mock claws, trace nails, recoil, touch, turn, freeze, curl).
- Signature motifs: gothic window with tracery and tree, oxblood curtains, dust in the moonbeam, the moon.

## Not checked / limits
- I could not listen to the audio (no playback in this environment). Pronunciation, chunk joins, music balance and the whisper were not heard; levels were measured only.
- Motion was judged from frames and a 1 s contact sheet, not watched at full speed.
- Known soft spot: in wide shots Mick's standing silhouette does not make the missing arm obvious; the profile close-up (S02) carries it.
