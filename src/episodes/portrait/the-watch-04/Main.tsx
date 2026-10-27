import React from 'react';
import timing from './timing.json';
import beats from './beats.json';
import {StoryFrame, Grade} from '../../../kit/common/series/StoryFrame';
import {TitleCard} from '../../../kit/common/series/TitleCard';
import {Timing} from '../../../kit/common/series/Captions';
import {Aiming, B, Barrels, Card, Claws, Hook, MickMemory, OntoDanny, PostGlare, ProfileLine, Recap, Reveal, Run, StreetTorch, Trigger, Turn} from './scenes/Story';

/** The Watch — Part IV. Werewolf series, episode 4. Length follows the narration (beats.json). */
export const META = {id: 'TheWatch04', durationSec: beats.durationSec, audio: 'audio/the-watch-04/mix.wav'};

// shot list: every cut lands on a phrase start from timing.json
const sceneAt = (t: number) => {
  if (t < B.mick) return <Hook t={t} />; // S01 the torch, two barrels aimed at us, my clawed hands
  if (t < B.died) return <MickMemory t={t} />; // S02 twenty years of Mick under the lamp
  if (t < B.recap) return <Card t={t} />; // S03 Mick died this spring
  if (t < B.ran) return <Recap t={t} />; // S04 eight empty holes in Mick's sill
  if (t < B.street) return <Run t={t} />; // S05 the moor at a gallop; Danny beside me
  if (t < B.lamp) return <StreetTorch t={t} />; // S06 down Moor End; a torch clicks on
  if (t < B.someone) return <PostGlare t={t} />; // S07 under Mick's lamp
  if (t < B.mum) return <Reveal t={t} />; // S08 someone had been keeping his watch
  if (t < B.gun) return <Reveal t={t} named />; // S09 Danny's mum
  if (t < B.said) return <Barrels t={t} />; // S10 both barrels; silver
  if (t < B.turned) return <Aiming t={t} />; // S11 I've watched you since you were eight
  if (t < B.danny) return <Turn t={t} />; // S12 she turned the gun, away from me
  if (t < B.family) return <OntoDanny t={t} />; // S13 onto Danny
  if (t < B.claws) return <ProfileLine t={t} />; // S14 it runs in our family
  if (t < B.finger) return <Claws t={t} />; // S15 Danny's claws come up
  if (t < B.cut) return <Trigger t={t} />; // S16 her finger tightens; hard cut
  return <TitleCard t={t} t0={B.cut} title="The Watch" subtitle="PART IV" />; // S17
};

const gradeAt = (t: number): Grade => (t >= B.cut ? 'none' : 'cold');

export const Episode: React.FC = () => (
  <StoryFrame
    sceneAt={sceneAt}
    gradeAt={gradeAt}
    timing={timing as Timing}
    redWords={['mum.', 'Danny.']}
    chapters={[{t: -0.4, label: 'THE WATCH', title: 'Part IV'}]}
    audio={META.audio}
  />
);
