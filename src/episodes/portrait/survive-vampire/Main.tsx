import React from 'react';
import timing from './timing.json';
import beats from './beats.json';
import {StoryFrame, Grade} from '../../../kit/common/series/StoryFrame';
import {DayTag, SurviveCard} from '../../../kit/common/series/Survive';
import {Timing} from '../../../kit/common/series/Captions';
import {B, Blind, Doorway, FaceId, Knock, Landlord, MirrorHook, NoReflection, Rent, Rule, Sun, WalkHome} from './scenes/Story';

/** Would You Survive? — as a vampire. 30 s second-person short; the reference episode of the format. */
export const META = {id: 'SurviveVampire', durationSec: beats.durationSec, audio: 'audio/survive-vampire/mix.wav'};

// shot list: every cut lands on a phrase start from timing.json (beats.py)
const sceneAt = (t: number) => {
  if (t < B.day1) return <MirrorHook t={t} />; // S01-02 clawed hands on the basin; the mirror shows no one
  if (t < B.phone) return <NoReflection t={t} />; // S03 day one: a hand across the glass, nothing in it
  if (t < B.day2) return <FaceId t={t} />; // S04 Face ID fails
  if (t < B.blind) return <Sun t={t} />; // S05 day two: the sun burns
  if (t < B.day3) return <Blind t={t} />; // S06 blackout blinds. Easy.
  if (t < B.home) return <WalkHome t={t} />; // S07 day three: walking home, keys swinging
  if (t < B.rule) return <Doorway t={t} />; // S08 the door opens; hands hit nothing
  if (t < B.rent) return <Rule t={t} />; // S09 the invitation rule; keys fall
  if (t < B.text) return <Rent t={t} />; // S10 FLAT 2, a letting agent's tag: you rent
  if (t < B.knock) return <Landlord t={t} />; // S11 the landlord: nine a.m., he'll let himself in
  if (t < B.cut) return <Knock t={t} />; // S12 your fist up to knock on your own door; hard cut
  return <SurviveCard t={t} t0={B.cut} subtitle="AS A VAMPIRE" prompt="Would you last the week?" />; // S13
};

const gradeAt = (t: number): Grade => (t >= B.cut ? 'none' : 'cold');

export const Episode: React.FC = () => (
  <StoryFrame
    sceneAt={sceneAt}
    gradeAt={gradeAt}
    timing={timing as Timing}
    redWords={['rent.']}
    chapters={[{t: -0.4, label: 'WOULD YOU SURVIVE?', title: 'As a vampire'}]}
    overlay={(t) => <DayTag t={t} days={[{t: B.day1, n: 1}, {t: B.day2, n: 2}, {t: B.day3, n: 3}]} until={B.cut} />}
    audio={META.audio}
  />
);
