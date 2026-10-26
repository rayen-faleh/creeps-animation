# QA log — The Count, Part I

## What was actually inspected
- Contact sheets of every shot (two rounds, 27 + 16 frames) at 0.4 scale; fixes applied between rounds:
  Gran redrawn as a candle-lit profile (front-on version read as a bald ball), pour arm rebuilt from the wrist
  (was a stiff plank), torch-room framing corrected (window was off-frame), ceiling light reshaped to read as
  the gothic window (read as a heart), claw marks redrawn as curved four-gouge swipes (read as tally marks),
  latch redrawn, rice grains made plumper, piles tightened, floor moon-pool softened, captions lowered.
- Pilot render 34.5–44.6 s at half resolution; inspected a frame strip across the grain-sorting moves,
  the freeze/claw curl and the cloth pull. Fingertip-to-grain contact holds during pushes.
- Audio: measured loudness (−14.9 LUFS integrated, −1.4 dBTP) and section levels; dynamic loudnorm was
  rejected because it flattened the stings.

## Limits
- I cannot listen to audio in this environment. Voice choice was made by measured pitch (bm_lewis, median
  ~98 Hz, deepest British candidate); pronunciation, chunk joins and the whisper treatment are unheard.
- Caption timing uses measured line boundaries plus measured in-line pauses (silence detection), not
  word-level alignment.
- Motion was checked through frame strips, not real-time playback.
