import React from 'react';
import timing from './timing.json';
import beats from './beats.json';
import {StoryFrame, Grade} from '../../../kit/common/series/StoryFrame';
import {TitleCard} from '../../../kit/common/series/TitleCard';
import {Timing} from '../../../kit/common/series/Captions';
import {B, Comb, CradleShot, Door, Filling, GranProfile, IntoFire, JugHook, Lane, Latch, OneRoom, TakeJug, Vigil, WarmHands} from './scenes/Story';

/** The Witch Bottle — Part I. Mardle Fen, 1645. Length follows the narration (beats.json). */
export const META = {id: 'WitchBottle01', durationSec: beats.durationSec, audio: 'audio/witch-bottle-01/mix.wav'};

// shot list: every cut lands on a phrase start from timing.json (beats.py)
const sceneAt = (t: number) => {
  if (t < B.winter) return <JugHook t={t} />; // S01-02 the bearded jug hissing in the embers
  if (t < B.six) return <WarmHands t={t} />; // S03 that winter, I was nine
  if (t < B.lane) return <OneRoom t={t} />; // S04 six in one room, the pig, the smoke
  if (t < B.cough) return <Lane t={t} />; // S05 three small graves
  if (t < B.gran) return <CradleShot t={t} />; // S06 my sister coughs
  if (t < B.jug) return <GranProfile t={t} t0={B.gran} />; // S07 it was someone
  if (t < B.pins) return <TakeJug t={t} />; // S08 the jug with the bearded face
  if (t < B.grey) return <Filling t={t} />; // S09 pins, nails, the baby's hair
  if (t < B.embers) return <Comb t={t} />; // S10 one long grey hair (the clue)
  if (t < B.door) return <IntoFire t={t} />; // S11 into the embers; the rule
  if (t < B.sat) return <Door t={t} />; // S12 our door
  if (t < B.midnight) return <Vigil t={t} />; // S13 we sat up; the jug hisses
  if (t < B.knock) return <CradleShot t={t} still />; // S14 the baby stops coughing
  if (t < B.still) return <Door t={t} knock />; // S15 someone knocked
  if (t < B.open) return <GranProfile t={t} t0={B.still} lean={0.2} />; // S16a Gran didn't move
  if (t < B.cut) return <Latch t={t} />; // S16b the latch; a hand bound in rag; hard cut
  return <TitleCard t={t} t0={B.cut} title="The Witch Bottle" subtitle="PART I" />; // S17
};

const gradeAt = (t: number): Grade => (t >= B.cut ? 'none' : t >= B.lane && t < B.cough ? 'cold' : 'warm');

export const Episode: React.FC = () => (
  <StoryFrame
    sceneAt={sceneAt}
    gradeAt={gradeAt}
    timing={timing as Timing}
    redWords={['someone.', 'knocked.']}
    chapters={[{t: -0.4, label: 'THE WITCH BOTTLE', title: 'Part I'}]}
    audio={META.audio}
  />
);
