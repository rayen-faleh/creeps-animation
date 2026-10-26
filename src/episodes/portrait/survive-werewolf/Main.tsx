import React from 'react';
import timing from './timing.json';
import beats from './beats.json';
import {StoryFrame, Grade} from '../../../kit/common/series/StoryFrame';
import {DayTag, SurviveCard} from '../../../kit/common/series/Survive';
import {Timing} from '../../../kit/common/series/Captions';
import {B, Buzz, DogCorner, KeyOut, Lock, MoonRise, Route, TableHook, Wake, WatchReveal} from './scenes/Story';

/** Would You Survive? — as a werewolf. Second episode of the format (series/would-you-survive-format.md). */
export const META = {id: 'SurviveWerewolf', durationSec: beats.durationSec, audio: 'audio/survive-werewolf/mix.wav'};

// shot list: every cut lands on a phrase start from timing.json (beats.py)
const sceneAt = (t: number) => {
  if (t < B.day1) return <TableHook t={t} />; // S01-02 bandaged bite, fitness watch; the hand curls into a claw
  if (t < B.day2) return <DogCorner t={t} />; // S03 day one: the dog won't come near you
  if (t < B.lock) return <MoonRise t={t} />; // S04 day two: full moon
  if (t < B.key) return <Lock t={t} />; // S05 lock the door
  if (t < B.day3) return <KeyOut t={t} />; // S06 key out of the window; the watch starts a workout. Easy.
  if (t < B.watch) return <Wake t={t} />; // S07 day three: waking on your doorstep, mud, claw marks
  if (t < B.miles) return <WatchReveal t={t} />; // S08 your watch logged the whole night
  if (t < B.farm) return <WatchReveal t={t} stats />; // S09 thirty-one miles. Personal best.
  if (t < B.buzz) return <Route t={t} />; // S10 forty minutes at a sheep farm
  if (t < B.cut) return <Buzz t={t} />; // S11 full moon again tonight; the hand curls; hard cut
  return <SurviveCard t={t} t0={B.cut} subtitle="AS A WEREWOLF" prompt="Would you last the week?" />; // S12
};

const gradeAt = (t: number): Grade => (t >= B.cut ? 'none' : 'cold');

export const Episode: React.FC = () => (
  <StoryFrame
    sceneAt={sceneAt}
    gradeAt={gradeAt}
    timing={timing as Timing}
    redWords={['best.']}
    chapters={[{t: -0.4, label: 'WOULD YOU SURVIVE?', title: 'As a werewolf'}]}
    overlay={(t) => <DayTag t={t} days={[{t: B.day1, n: 1}, {t: B.day2, n: 2}, {t: B.day3, n: 3}]} until={B.cut} />}
    audio={META.audio}
  />
);
