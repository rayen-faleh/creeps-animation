# QA: My Type, Part 1

- Stills reviewed at 0.4 scale over three rounds. Fixed after review:
  - The councillors' eyes were too small to read, so they were enlarged.
  - Her hand at the bar sat in a corner. It now rests beside the full glass.
  - On the doorstep the boots read as posts. Legs and a lace hem were added, and the framing lifted the boots off the
    captions.
  - The watch was out of frame and its text was upside down. It is now centred and upright.
  - The club entry stamps were too small, so they were enlarged.
  - The story view showed "Seen by 0" too early. The count now appears only on "Three hundred people watched it".
  - At the far end the table and a candle covered her. Her figure, with head bowed, and her hands are now drawn over
    the table.
- Mute test:
  - six pairs of eyes around a candlelit table
  - a screen vampire on an old telly
  - swiping through pale profiles
  - UV stamps piling up a forearm
  - a pale hand beside a full glass
  - boots stopping at the doormat
  - a selfie with a glass held by nobody
  - a breaking glass and a cut palm
  - wide pupils
  - a watch reading "-- bpm / no pulse found"
  - a black envelope and the card
  - the phone slid across the table, then "Seen by 312"
  - her at the far end, head bowed
  - three white and three black stones, and her hand hovering
- Safety: a small cut and three drops only. The bite stays off screen.
- Not checked: I can't listen to the narration or the mix; levels were measured only. Motion was checked from stills
  and the contact sheet, not at full speed.
- Still rough: the figures are drawn in the existing SVG style. Image-generated cut-out characters are being tested
  separately.

## Revision 2: the rigged character
- She now appears as the image-generated cut-out puppet (`src/kit/common/puppet/Her.tsx`). On the owner's direction she
  only has facial expressions and a slight head bob; the arm rig is not used, because the swapped hand read as
  disconnected in the test.
  - Bar: she sits behind the counter, facing the full glass, and her eyes slide to us on "Not drinking".
  - Doorstep: she waits outside the frame, smiles on the invite, and gives a sly half-lidded look on "flirting".
  - "She said sorry": a close-up of her face with wide eyes and a sad mouth, then lowered eyes.
  - Far end of the table: she sits with her eyes down and her head bowed slightly.
  - "The last one is hers": her hand hovers over the stones, then her face lifts its eyes to us and whispers "Sorry."
    on screen (lip-synced by hand) before the poll. The cut moved to after the whisper (beats.py).
- Her remaining SVG hands (the glass in the selfie shot, the hand over the stones) were recoloured to match the puppet.
- Known: in the face close-ups the hair rim reads as doubled at the top left. This comes from the generated art's
  paper-cut offset rim, and the small head bob makes it slightly more visible.
