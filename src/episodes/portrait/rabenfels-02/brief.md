# Rabenfels, Part II: Cloves (revised, v2)

- Interactive series YOU ARE THE VAMPIRE · Rabenfels, 1732. The winning comment by @stvry.safwan, "smell the body to
  find a similar scent", opens the episode: "You decided to smell the body." Safwan, the watch recruit, is his resident.
- Runtime ~66 s plus the title (69.3 s), narrated by `bm_lewis`. The stranger's line keeps the approved treatment:
  speed 0.94, −0.8 semitone, presence EQ and a short room.
- Story improvements over v1:
  - The scent sits "under the blood", and the lantern on the wet blood is what makes the fangs drop.
  - "He fought someone." turns the wool into an inference.
  - Marta's coat has a torn cuff, and cloves float out of its pocket: a mute-readable link between coat, corpse and Otto.
  - New beat "Otto has another customer.", shown as a warm memory of two covered cups, one going to a pale,
    long-nailed hand.
  - The stranger looks at the wool in Safwan's hand, which motivates "Give me the boy".
- Visual improvements:
  - The square opens wide and cranes down to a readable body (linen draped over the face, coat, boots, a pale hand).
  - The collar and cloves are shown close up.
  - A lantern-lit fang beat, with a whip-pan away.
  - A wool-under-the-nails insert with drag marks.
  - Otto's shopfront: chained door, cleaver sign, a dark window, a drifting shutter.
  - A torn-cuff insert in the basin.
  - The two-cups memory.
  - Mirror reveal: push in on the man, cross to the glass and hold on the empty reflected stairs, then a two-shot of
    him and his missing reflection. The reflection is warmer and brighter. The approved planar-reflection geometry is
    unchanged.
  - The demand opens on Safwan, the mirror and the stranger together, then pushes in on the stranger.
  - The reach drifts toward the glass, where Safwan's reflection stands alone and nothing reaches for him, while the
    real pale hand does.
  - Your hand rises between them, clear of the captions.
- Red words: `Cloves.` · `customer.` · `empty.` · `secret.`
- Code: `scenes/Revised.tsx` holds the new shots. `scenes/Investigation.tsx` and `scenes/Confrontation.tsx` are reused.
  `events.py` derives `events.json` from `timing.json`. `cues.py` uses the house `sound/sound_lib.py`.
