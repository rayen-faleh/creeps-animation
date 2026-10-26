import React from 'react';
import timing from './timing.json';
import beats from './beats.json';
import {StoryFrame, Grade} from '../../../kit/common/series/StoryFrame';
import {TitleCard} from '../../../kit/common/series/TitleCard';
import {Timing} from '../../../kit/common/series/Captions';
import {B, DoorHook, MicksWindow, MoonWindow, MumBehindGlass, OutsideSill, Reach, Recap, StreetGlints, StreetWalk, Table} from './scenes/Story';
import {prog} from '../../../kit/common/util';

/** The Watch — Part III. Werewolf series, episode 3. Length follows the narration (beats.json). */
export const META = {id: 'TheWatch03', durationSec: beats.durationSec, audio: 'audio/the-watch-03/mix.wav'};

// shot list (mirrors shots.json): every cut lands on a phrase start from timing.json
const sceneAt = (t: number) => {
  if (t < B.recap) return <DoorHook t={t} />; // S01 a clawed hand round the door
  if (t < B.sat) return <Recap t={t} />; // S02 "D. took my arm."
  if (t < B.moon) return <Table t={t} />; // S03 he sat down
  if (t < B.slid) return <MoonWindow t={t} />; // S04 full moon in an hour
  if (t < B.look) return <Table t={t} slide />; // S05 a silver nail across the table
  if (t < B.two) return <StreetWalk t={t} />; // S06 go and look
  if (t < B.four) return <OutsideSill t={t} t0={B.two} n="2" paint="#22303a" />; // S07 number two
  if (t < B.danny) return <OutsideSill t={t} t0={B.four} n="4" paint="#3a2a22" />; // S08 number four
  if (t < B.every) return <OutsideSill t={t} t0={B.danny} n="6" paint="#5a1c1c" zoom={1.35} y={160} inside={<MumBehindGlass a={prog(t, B.mum - 0.3, B.mum + 0.9)} />} />; // S09 even Danny's; his mum at the window
  if (t < B.except) return <StreetGlints t={t} />; // S10 every house on Moor End
  if (t < B.holes) return <MicksWindow t={t} phase="except" />; // S11 except one: Mick's
  if (t < B.warn) return <MicksWindow t={t} phase="holes" />; // S12 fresh holes
  if (t < B.reach) return <MicksWindow t={t} phase="pull" />; // S13 he pulled them out
  if (t < B.cut) return <Reach t={t} />; // S14 come out
  return <TitleCard t={t} t0={B.cut} title="The Watch" subtitle="PART III" />; // S15
};

const gradeAt = (t: number): Grade => (t >= B.cut ? 'none' : 'cold');

export const Episode: React.FC = () => (
  <StoryFrame
    sceneAt={sceneAt}
    gradeAt={gradeAt}
    timing={timing as Timing}
    redWords={['werewolf.', 'one.', 'out.']}
    chapters={[{t: -0.4, label: 'THE WATCH', title: 'Part III'}]}
    audio={META.audio}
  />
);
