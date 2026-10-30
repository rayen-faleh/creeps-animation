# GRAVEYARD SHIFT — interactive vampire series (brainstorm)

Working title is the pun: the night shift is "the graveyard shift". A multi-part, second-person horror series with a
hint of comedy. You work nights alone at a petrol station; a strange customer comes in; you black out; you wake up
turning. Every part ends on a **decision the viewers vote on**, and the next part follows the majority.

## Status
- **Part 1** made: `src/episodes/portrait/graveyard-shift-01` (composition `GraveyardShift01`). Next: post it, pin the
  A/B comment, then produce the winning Part 2 branch below.
- Kit added: `kit/portrait/sets/PetrolStation.tsx` (ShopDoors, Forecourt, Counter, Receipt, OldCoin, CoffeeMachine),
  `ClockTag` and `PollCard` in `kit/common/series/Survive.tsx`.

## Why this works (from our research)
- **Hook for vampire fans in the first 3 s, readable on mute**: the automatic doors don't open for him (sensors
  can't "see" him, like mirrors), and he knocks on the glass to ask if he can come in. Every vampire fan gets it before
  the narrator says the word.
- **Lore clues fans can spot and comment on**: the invitation, no breath fogging the glass, missing from the CCTV,
  coins from the 1700s, the compulsion to count spilt grains, sunlight. Viewers who catch them feel clever (sends and comments).
- **Comedy as benign violation**: absurd, safe beats ("You said yes. Obviously. It's a shop.") release tension so the
  horror beats hit harder (you on the CCTV serving nobody; hearing a customer's heartbeat).
- **The poll is the cliffhanger**: an unfinished situation with a clock on it, two options, both bad. Two options only
  (clear, easy to comment "A" or "B"; works as an Instagram/TikTok story poll too).
- **Each part stands alone**: hook → one-line recap that names what viewers chose last time → a new situation → new
  signs → new decision.

## Poll mechanics
- End card: **WHAT DO YOU DO?** · A · B · "Comment A or B". Pin a comment with the two options; post the next part within
  48 h; open it with "You chose the freezer." so voters feel heard and newcomers catch up.
- Keep both options survivable but costly, so either branch makes a good next part. Prepare both branches' outlines in
  advance (below) so production can start the moment the vote closes.

## Part 1 · The Customer (draft script, ~150 words, ~60 s + poll card)

| # | Line | Picture |
| --- | --- | --- |
| L01 | Working nights at a petrol station, you learn to spot the weird ones. | Mute-proof hook: through the shop's glass doors, a pale man in a long black coat; the doors stay shut. |
| L02 | This one stood outside the automatic doors. They wouldn't open for him. | The sensor's red light, not blinking. He waves at it. Nothing. |
| L03 | So he knocked on the glass and asked if he could come in. | His knuckles on the glass; no breath fogs it. |
| L04 | You said yes. Obviously. It's a shop. | Your hand presses the door button. Comedy beat. |
| L05 | He bought a bag of rice. Paid in coins from seventeen ninety. | Old coins on the counter, a date legible. |
| L06 | And on the CCTV screen, you were serving nobody. | Mute-proof horror beat: the monitor shows you alone at the till. Red word: `nobody.` |
| L07 | He leaned over the counter and said, you look tired. | His face close, eyes catching the strip light. |
| L08 | Then nothing. | Hard cut to black. Silence. |
| L09 | You wake up on the floor at three thirty-three. The till's full. Nothing's missing. | Eyelids open on the shop floor; clock 3:33. |
| L10 | Except the rice is everywhere. And you're counting it. | Your hands sorting rice into piles of ten (callback to the folklore compulsion). Comedy and dread together. |
| L11 | You decide you dozed off. You finish the shift. | Mopping; a deadpan beat. |
| L12 | By five, coffee smells like burning hair. | The coffee machine; you recoil. |
| L13 | And you can hear the heartbeat of the man at pump four. | Through the window, a man filling up; the sound design swaps to his heartbeat. Red word: `four.` |
| L14 | At ten to six, the sky goes grey. The back of your hand starts to smoke. | Dawn light creeping across the forecourt; smoke off your hand. |
| L15 | Your shift ends at six. Sunrise is six twelve. | The clock; the bus stop outside with no shelter. |
| L16 | And on his receipt, he's left a phone number. | The receipt: handwritten number and "Call me — R." |
| — | Poll card: **WHAT DO YOU DO?** · **A** Hide in the walk-in freezer till dark · **B** Call him · "Comment A or B" | |

Whisper option before the card: "*Call me.*" (his voice, from the receipt) — or leave silence so the vote feels free.

## Branches for Part 2 (outline both now)

**A · The freezer.** Hook: "You spent fourteen hours in a walk-in freezer, and you weren't cold once." The day manager
arrives at nine and stocks the freezer around you; you have to stay hidden and still. Signs: no breath fogging in the
cold, the frozen chicken looks *appetising*. At dusk you get out: your phone has 30 missed calls from one number.
Decision: **A** answer it / **B** go to A&E.

**B · Call him.** Hook: "The man who did this to you answered on the first ring." He talks you to safety (the
stockroom has no windows). He knows your name and your shift pattern. He offers you the rules, for a price. Decision:
**A** take the deal / **B** hang up and figure it out alone.

## Longer arc (4–5 parts; keep the twist in reserve)
1. The customer (turning). 2. Surviving the first day (branch). 3. Hunger: the first time it's a person, not a smell
   (decision: blood bank / the customer's offer). 4. Who is R.? 5. Twist.
- **Reserve twist, planted from Part 1**: R. wears an old staff badge under his coat: "R. — NIGHT MANAGER". He worked
  this exact shift in 1974, was turned on it, and has been trying to hand the night shift over ever since. He didn't
  want your blood. He wanted a replacement. ("Congratulations. You've been promoted.") Plant the badge as a
  one-frame glint in Part 1 (L07), visible only on rewatch.

## Production notes
- Kit: second-person hands (`YOU` style), the `DayTag` replaced by a clock tag (TIME 02:47 → 05:50), a poll end card
  (a variant of `SurviveCard` with two options), `CapedFigure`/`HollywoodVampire` reused for R. (long coat, not a cape:
  a modern look), CCTV monitor (Phone-like screen), petrol-station set (new: glass doors, counter, till, strip lights,
  forecourt and pumps), receipt prop, coins, rice (`Grain`, `pileOf10`), dawn light.
- Voice: `bm_lewis` deadpan, as in the vampire comedy reel. R. never speaks aloud except, optionally, the whisper.
- Length: aim 60 s for Part 1; trim from the comedy beats first, never from the clues.

---

## Part 2 · The Call (viewers chose B: call him). Made: `src/episodes/portrait/graveyard-shift-02` (`GraveyardShift02`)

Final poll: **A** Invite him home · **B** Hang up. Let Dave in. You're starving. R.'s line is the narrator's voice reworked (pitched down, phone band, echo).

### Round 1 brainstorm

**Engine:** a 14-minute countdown to sunrise (clock tag 05:58 → 06:10), with the caller on the line the whole time.
Tension comes from four directions:
- the sun creeping across the floor
- the day manager arriving early
- your new hunger
- the caller himself

**Inversion of Part 1:** last time a stranger stood at the glass asking to come in. Now it's a human, Dave, and *you*
are the danger.

**Callback twist:** you invited R. into the shop in Part 1 ("You said yes. Obviously. It's a shop.") and the
invitation never expires. He's been inside the whole time.

### Draft script (~140 words, ~58 s + poll card)

| # | Line | Picture |
| --- | --- | --- |
| L01 | You chose to call him. He picked up on the first ring. | Mute-readable hook: your smoking hand holding the phone, screen showing "R." connected at 00:01. |
| L02 | Last night, a customer paid in coins from seventeen ninety. By dawn, your hand was smoking. | One-line recap: the 1790 coins on the counter, then grey light on your hand. |
| L03 | He said your name. Your badge just says trainee. | Your name badge reading TRAINEE. Laugh line. |
| L04 | Sunrise is in fourteen minutes. He sounds bored. | Clock tag 05:58. The sky going pale over the forecourt. |
| L05 | He said, the stockroom has no windows. Stay in the shadows. | The STAFF ONLY door at the back of the shop. |
| L06 | The sun is already crawling across the floor. Aisle by aisle. | Set piece: sunlight slats move over the tiles; you crawl along the shadow of the shelves; a fingertip strays into a beam and smokes. |
| L07 | Then a van pulls in. Dave, the day manager. Twenty minutes early. | Headlights through the glass doors, a silhouette climbing out. |
| L08 | He's banging on the glass. He wants to come in. | Dave's palm on the glass, backlit by the dawn. Inversion of Part 1. |
| L09 | And from the stockroom, you can hear his heartbeat. | The stockroom door ajar on a blade of light; the sound shifts to Dave's heartbeat. Red word: `heartbeat.` |
| L10 | Through the phone, he says, I can teach you everything. Every rule. For a price. | Darkness, the phone's glow on your hand. |
| L11 | *Invite me into your home.* (R., phone-filtered) | The call timer ticks. |
| L12 | Then you hear his voice twice. On the phone. And behind you. | The phone glow catches two eyes in the dark behind the crates. Red word: `twice.` |
| L13 | You invited him in last night. It doesn't expire. | Freeze on the eyes. Hard cut. |
| — | Poll card: **WHAT DO YOU DO?** · **A** Invite him home · **B** Hang up and let Dave in · "Comment A or B" | |

**Ladder of open loops:**

| Line | Open question |
| --- | --- |
| L01 | Will he help? |
| L03 | How does he know me? |
| L04 | Can I make it in time? |
| L06 | Will I burn? |
| L07 | Who's that? |
| L09 | Will I attack him? |
| L10 | What's the price? |
| L12 | Where is he? |
| L13 | What do I do? |

**Both options cost something.** A gets you the rules and a mentor, but a vampire gets the key to your home. B keeps
your home safe, but you have no rules and you're shut in with a human whose heartbeat you can hear.

**For first-time viewers:**
- The hook works on its own: anyone understands calling the stranger who did this to you.
- L02 is the recap.
- The countdown makes stakes obvious within seconds.
- The poll names a concrete action, not a mood.

**Comedy beats:** "Your badge just says trainee." · "He sounds bored." · Dave being twenty minutes early, which is the
real horror of retail.

**Plants kept in reserve:** R.'s old staff badge ("R. · NIGHT MANAGER", 1974). One glint of it as the eyes appear
behind the crates.

**New art:**
- phone call screen
- name badge
- shop floor with moving sunlight slats and aisle shadows
- the van and Dave's silhouette at the glass
- the stockroom: crates, a blade of light under the door, eyes in the dark

**Reuse:** `PetrolStation` (ShopDoors, Counter, OldCoin), `ClockTag`, `PollCard`.
