import React from 'react';
import timing from './timing.json';
import beats from './beats.json';
import {StoryFrame, Grade} from '../../../kit/common/series/StoryFrame';
import {TitleCard} from '../../../kit/common/series/TitleCard';
import {Timing} from '../../../kit/common/series/Captions';
import {B, Barrels, Bolt, Bowed, BreakOpen, Dawn, Eight, Empty, Frozen, Hands, MickProfile, MoorEdge, NeverHome, Page, Trigger, Watch} from './scenes/Story';

/** The Watch — Part V. Werewolf series, the end of the five-part arc. Length follows the narration (beats.json). */
export const META = {id: 'TheWatch05', durationSec: beats.durationSec, audio: 'audio/the-watch-05/mix.wav'};

// shot list: every cut lands on a phrase start from timing.json
const sceneAt = (t: number) => {
  if (t < B.barrels) return <Trigger t={t} />; // S01 the hammer falls; nothing
  if (t < B.nothing) return <Barrels t={t} />; // S02 both barrels, silver
  if (t < B.me) return <Frozen t={t} />; // S03 nothing happened: the tableau holds
  if (t < B.mick) return <Hands t={t} />; // S04 I'm a werewolf, so's Danny
  if (t < B.ran) return <Watch t={t} />; // S05 Mick under the lamp, then her
  if (t < B.broke) return <Bolt t={t} />; // S06 Danny runs; she lowers the gun
  if (t < B.empty) return <BreakOpen t={t} />; // S07 she breaks it open
  if (t < B.never) return <Empty t={t} />; // S08 both barrels empty
  if (t < B.page) return <Bowed t={t} />; // S09 she'd never loaded it
  if (t < B.boy) return <Page t={t} />; // S10-11 Mick's page, August 2006
  if (t < B.arm) return <Eight t={t} />; // S12 I was the boy; I was eight
  if (t < B.dawn) return <MickProfile t={t} />; // S13 he lost it pulling one off me
  if (t < B.home) return <Dawn t={t} />; // S14 by dawn my hands were mine again
  if (t < B.window) return <NeverHome t={t} />; // S15 Danny never came home
  if (t < B.cut) return <MoorEdge t={t} />; // S16 two eyes, and a smaller pair; hard cut
  return <TitleCard t={t} t0={B.cut} title="The Watch" subtitle="PART V" />; // S17
};

const gradeAt = (t: number): Grade => (t >= B.cut ? 'none' : t >= B.boy && t < B.dawn ? 'warm' : 'cold');

export const Episode: React.FC = () => (
  <StoryFrame
    sceneAt={sceneAt}
    gradeAt={gradeAt}
    timing={timing as Timing}
    redWords={['empty.', 'me.', 'pair.']}
    chapters={[{t: -0.4, label: 'THE WATCH', title: 'Part V'}]}
    audio={META.audio}
  />
);
