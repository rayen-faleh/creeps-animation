# Production and review record

Film: The Friend Who Never Knocks. Title card: Come In. Planned delivery: 37.000 seconds, 1110 frames at 1080×1920 / 30 fps.

## Technical and caption checks
TypeScript compilation passed after the final scene changes. Final narration preserves all thirteen approved lines. Every decoded take was measured; phrase boundaries use detected internal silences, with whole-line fallback. Authored silence, not accelerated speech, creates the suspense edit. Timing/SRT ordering, line text, boundaries and total timeline validated. Main.tsx and cues.py share events.json.

Final full-resolution render completed (1110 picture frames). Delivery remux sources AAC directly from the lossless final mix, without re-encoding video. ffprobe confirms H.264 1080×1920 at 30 fps, AAC stereo at 48 kHz, both streams and container exactly 37.000 seconds. Final delivery fully decoded with FFmpeg at error verbosity and produced no errors.

## Visual/time and art/direction
Seventeen composition stills were inspected across all ten editorial beats, including waking, lamp reach, mirror proof, tightening, black whisper and title. Four revised stills checked shoes after removing accidental threshold clipping and refined grip artwork. Existing gothic SVG kit style, warm/cold grade, serif captions, blackletter title, grain and vignette retained. Narrator face never shown; reflection contains only his arm and room. No gore. Signature motifs: iron-strapped oak door, pointed window/tree, oxblood curtains and an ornate mirror.

The warm threshold shot establishes the visitor's hesitation and the explicit invitation before crossing. Repetition in the cold door shot changes that gesture's meaning. The mirror proof is held through Alone before a macro grip view and hard cut.

## Motion craft and interaction
Rendered a half-resolution pilot covering global 22.0–33.13 s. Inspected fifteen extracted encoded frames around approach, fingertip contact, chain pull, lamp on, resistance, continuous mirror glance, same-arm/no-captor reflection, final close shot and tightening. A revised lamp pilot covering 22.1–25.17 s was inspected at six closely spaced encoded frames (22.7, 23.0, 23.1, 23.3, 23.55, 24.25 s) after changing layer order for hand visibility.

Lamp fingertip and chain share one camera transform; wristFor solves the contact. Held arm and captor share a single coordinate hierarchy, so the grasp remains attached as the arm reacts. Real and reflected arm use armState(t), with identical finger articulation and related mirrored motion; only the captor layer is omitted in the mirror. The tightening shot changes finger curl rather than sliding a rigid hand. Outcome is withheld at the black cut.

## Sound and editorial
Fresh Kokoro ONNX 0.6.1 / model v1.0 / bm_lewis / en-gb. Normal speed .97, whisper .86; no voice substitution or time stretching. Voiceover and captions preserve the approved script. Quotes and the ending use the supplied whisper processing. Score/SFX synthesised by the kit sound engine, with no borrowed music. Restrained sound and a quiet mirror reveal; cliffhanger has voice-only silence before the title boom.

WAV master measured −15.4 LUFS integrated and −1.6 dB true peak; final AAC delivery measured −15.4 LUFS integrated and −1.4 dB true peak. No dynamic loudness normalization was used. Post caption stays outside spoken narration.

## Scope and limitations
This is an original fictional vampire story based on Stoker's invitation and reflection rules, not universal historical folklore. No reach or virality prediction is claimed. Inspection used stills and sequential encoded frames; no realtime playback or subjective listening was available, so vocal performance/pronunciation and perceptual mix were not personally auditioned. No independent reviewer was used.

## Updated kit
Added reusable VisitorShoes, BedsideLamp and HeldArm in FriendProps.tsx, with one catalog panel. Updated catalog rendered successfully (17 panels). Prior episodes and kit style components preserved.

## Final encoded picture review
Seventeen final-resolution encoded frames were extracted and inspected at global .8, 4, 6.5, 10.45, 10.9, 11.5, 13.8, 16.8, 19.7, 23.1, 23.55, 26.9, 28.8, 30.4, 32.6, 33.5 and 36 s. They cover each editorial beat, invitation/steps, lamp contact/on-state, reflection comparison, grip close-up, black whisper and completed title. Captions are legible at phone size; no material framing/font/media issue found in these samples. This check supplements the earlier encoded motion pilots; it is not a claim of realtime viewing or subjective listening.
