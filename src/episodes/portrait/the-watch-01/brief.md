# The Watch, Part I: story brief

Series: **THE WATCH** (5 episodes; arc in `series/werewolf-brainstorm-v2.md`). Style: gothic-pov-style.

| Field | Value |
| --- | --- |
| Title / subtitle | The Watch / PART I |
| Runtime | 66.2 s (narration 63.1 s incl. 2.7 s cliffhanger silence; title card 4.6 s). Cuts follow timing.json via beats.py |
| Setting | Thornhallow (fictional), a stone-terraced street that ends where the North York moor begins: church tower, gas lamp at the end of the road, gothic-revival bedroom window |
| Presence | Werewolf |
| Folklore (real) | Silver against werewolves; wolfsbane (aconite) hung at doors; the full moon; a werewolf that does not remember its nights |
| Hook | "We used to dare each other to ask Danny's uncle about his arm." |
| Who taught the rule | Mick, Danny's one-armed uncle: silver nails, wolfsbane, kids home before dark on full moons, then he watches the road all night |
| What breaks it | Mick dies. First full moon in twenty years with nobody watching |
| Twist | Mick was never the monster. He watched for a wolf getting OUT, and the narrator is the wolf who took his arm the summer they were ten |
| Clue 1 (spoken) | "First full moon in twenty years, with nobody at the end of the road." |
| Clue 2 (visual) | The silver nails are in OUR sill; the wolfsbane is over OUR door; Mick's torch lands on OUR window; the card reads "He kept watch." |
| Cliffhanger | The lamp dies; a torch clicks on at the end of the road, aimed at our window. Hard cut |
| Whisper | "Mick?" |
| Red words | wolf · you · out. |
| Narrator | Chatterbox cloning the owner's own voice (`tts/voices/narrator_ref_original.wav`, unprocessed recording by choice), exaggeration 0.6, cfg 0.35; whisper line through the house whisper filter. Kokoro bm_lewis takes kept in `work/the-watch-01/kokoro/` |
| Review mode | Straight to a finished Episode 1 (user request) |

## Audience adaptation
Instagram Reels horror viewers, mostly phone, often sound-off: burned-in captions carry every line; the twist reads from pictures (silver in our sill, torch on our window, clawed handprint pointing out, the phone text, the hands). No gore: the arm loss is only told, never shown.

## New kit pieces made for this story
`art/Street.tsx` (MoorStreet, GardenWall), `art/Watcher.tsx` (Watcher, WatcherProfile), `art/Charms.tsx` (Wolfsbane, SilverNails, MudMarks), `art/Modern.tsx` (Phone, FuneralCard), Hand: `STYLES.wolf`, `lerpStyle`, `fur`/`mud` style fields.
