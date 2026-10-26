# Voice references for cloning engines (Chatterbox)

| File | What it is | Use |
| --- | --- | --- |
| `narrator_ref_original.wav` | The project owner's own voice (supplied with consent), the same 11.8 s cut (3.67–15.48 s), level-normalised only (loudnorm −20 LUFS), **not denoised** (owner preferred its character). Used for The Watch 01 | `--ref tts/voices/narrator_ref_original.wav` |
| `narrator_ref_clean.wav` | The project owner's own voice (supplied with consent), 11.8 s of continuous speech cut from a 20.7 s recording, denoised | `--ref tts/voices/narrator_ref_clean.wav` |
| `storyteller_ref.wav` | Synthetic: Kokoro `bm_lewis` reading neutral gothic prose (no real person) | default `--ref` |

Cleaning recipe for `narrator_ref_clean.wav` (noise floor −54.8 → −65.1 dBFS, speech level unchanged):
80 Hz high-pass → `noisereduce` stationary spectral gating with the noise profile taken from the recording's own
pauses (2.75–3.6 s, 15.55–16.8 s), prop_decrease 0.85 → cut 3.67–15.48 s → peak 0.85 → 24 kHz mono.

Chatterbox reads roughly the first 6 s for speaking style and 10 s for timbre, so a clean, continuous,
expressive 10–12 s clip works best. It copies room noise as well as voice, which is why the clip is denoised.
