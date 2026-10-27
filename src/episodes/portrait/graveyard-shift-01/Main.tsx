import React from 'react';
import timing from './timing.json';
import beats from './beats.json';
import {StoryFrame, Grade, holdBlack} from '../../../kit/common/series/StoryFrame';
import {ClockTag, PollCard} from '../../../kit/common/series/Survive';
import {Timing} from '../../../kit/common/series/Captions';
import {B, Button, Cctv, Coffee, Coins, Counting, DawnHand, Knock, Lean, Mop, Outside, Pump, ReceiptShot, Sensor, ShiftClock, Wake} from './scenes/Story';

/** Graveyard Shift — Part 1: The Customer. Interactive vampire series; ends on a viewer poll. */
export const META = {id: 'GraveyardShift01', durationSec: beats.durationSec, audio: 'audio/graveyard-shift-01/mix.wav'};

const sceneAt = (t: number) => {
  if (t < B.doors) return <Outside t={t} />; // S01 a man in a long coat outside the glass doors
  if (t < B.knock) return <Sensor t={t} />; // S02 the sensor won't see him
  if (t < B.yes) return <Knock t={t} />; // S03 he knocks; no breath on the glass
  if (t < B.rice) return <Button t={t} />; // S04 you said yes. It's a shop.
  if (t < B.cctv) return <Coins t={t} />; // S05 rice; coins from 1790
  if (t < B.lean) return <Cctv t={t} />; // S06 the CCTV: serving nobody
  if (t < B.black) return <Lean t={t} />; // S07 you look tired (badge glint)
  if (t < B.count) return <Wake t={t} />; // S08-09 black, then waking at 3:33
  if (t < B.dozed) return <Counting t={t} />; // S10 counting the rice
  if (t < B.five) return <Mop t={t} />; // S11 you dozed off; finish the shift
  if (t < B.pump) return <Coffee t={t} />; // S12 coffee smells like burning hair
  if (t < B.dawn) return <Pump t={t} />; // S13 the heartbeat of the man at pump four
  if (t < B.ends) return <DawnHand t={t} />; // S14 grey sky; your hand smokes
  if (t < B.receipt) return <ShiftClock t={t} />; // S15 six; sunrise six twelve
  if (t < B.cut) return <ReceiptShot t={t} />; // S16 his number on the receipt
  return <PollCard t={t} t0={B.cut} series="GRAVEYARD SHIFT · PART 1" a="Hide in the walk-in freezer until dark" b="Call him" />;
};

const gradeAt = (t: number): Grade => (t >= B.cut ? 'none' : 'cold');
const dipAt = (t: number) => holdBlack(t, B.black, B.wake);

const STAMPS = [
  {t: 0, time: '02:47'},
  {t: B.wake, time: '03:33'},
  {t: B.five, time: '05:02'},
  {t: B.dawn, time: '05:50'},
  {t: B.ends, time: '05:58'},
];

export const Episode: React.FC = () => (
  <StoryFrame
    sceneAt={sceneAt}
    gradeAt={gradeAt}
    dipAt={dipAt}
    timing={timing as Timing}
    redWords={['nobody.', 'four.']}
    overlay={(t) => <ClockTag t={t} stamps={STAMPS} until={B.cut} />}
    audio={META.audio}
  />
);
