# QA — approved mirror and eye integration

The user approved the 3-second mirror/eye preview and requested integration into the full episode. The prior production review is retained as qa-before-approved-mirror.md.

## Integration and scope

Six approved candidate files were copied exactly and verified byte-for-byte before integration. The full script, measured line/phrase timing, 65-second edit, narration and approved audio treatment remain unchanged.

Safwan's screen-left eye grows as his farther screen-right eye narrows during the turn. The far eye stays separate from the ear. His reflection uses matching rear artwork with the same head, wrist and lantern pose. Actual/reflected stair treads/posts share geometric scene data. The vampire actors remain absent by the story rule.

This is a calibrated 2.5D illustration system: planar reflection and projective placement for defined scene proxies, with view-specific character artwork. It is not a general ray tracer or a full three-dimensional body model. Method and limits are documented in docs/planar-mirror-method.md.

## Completed checks before the full export

- TypeScript passed after merging and registering the reusable components.
- Reviewed all affected scene modes at 35,35.5,36.7,38.7,41.5,43.6,45.9,48.3,50.4,53.3,56.1,60.9s: stepping, empty stair proof, demand, head turn, reflected back, threat and control prompt.
- Reused the approved encoded 3-second motion review and its numeric checks: point reflection involution, plane fixed points, exact illustration homography, rear body/head selection, mirror-plane clipping and inclusion of the hypothetical human witness in the mirror field. The same six source files are used in the full render.
- New rear-view kit component is exported and shown in the regenerated 24-panel catalog. The mirror catalog view uses the integrated geometric pass.
- The approved AAC audio stream's SHA256 fingerprint is retained before remuxing, so the final file can be checked for byte-identical audio. No TTS generation, new speech processing or caption retiming occurs in this revision.

## Review limits

Checks use rendered stills and sequential encoded samples. No real-time playback, subjective listening or independent reviewer is claimed. The user's approval refers to the actual delivered preview.

## Final export

- Final MP4: exactly 65.000s, 1950 frames, 1080x1920/30fps H.264; AAC 48kHz stereo, 65.000s. Full FFmpeg decode passes. File size 15,943,262 bytes.
- The final AAC stream is byte-identical to the previously approved full episode, confirmed by SHA256 of copied ADTS packets. Its approved measurements remain −15.7 LUFS integrated and −1.6 dBTP. Metadata and fingerprint are in final-verification.json.
- Inspected 34 encoded samples from the retained final MP4: .9,2.8,8.5,12.6,15.5,20,23,25.8,28.3,32,35,35.22,35.5,35.85,36.15,36.75,38.7,41.8,43.3,45.9,47.8,47.96,48.12,48.28,48.44,48.6,50.2,51.7,52.2,53.3,56.1,59.7,62.2,64.4s.
- Confirmed the decision-led opening, established earlier scenes, stepping sequence, missing-vampire stair proof, regular-voice dialogue captions, corrected head-turn perspective, human back reflection, shared prop motion, incomplete grab/intervention, control prompt and title. The hard black hold before the title is intentional.
- The final video was muxed to a temporary file, verified, then atomically replaced at the delivery path. The source archive is subsequently CRC-checked and verified to include all new mirror/back-view components, method documentation and updated catalog.
