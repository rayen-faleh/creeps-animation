import React from 'react';
import timing from './timing.json';
import beats from './beats.json';
import {StoryFrame, Grade} from '../../../kit/common/series/StoryFrame';
import {DayTag, SurviveCard} from '../../../kit/common/series/Survive';
import {Timing} from '../../../kit/common/series/Captions';
import {B, Counting, Dinner, Doorway, Folklore, HoldHands, Hollywood, Kitchen, Marks, MirrorRose, Pale, Photo, RiceDrop, Soil, Split, Sunny, Taped} from './scenes/Story';

/** "Have you ever thought about dating a vampire?" Horror-comedy, a week day by day. */
export const META = {id: 'DatingVampire', durationSec: beats.durationSec, audio: 'audio/dating-vampire/mix.wav'};

const sceneAt = (t: number) => {
  if (t < B.hollywood) return <Split t={t} />; // S01 Hollywood | folklore
  if (t < B.folklore) return <Hollywood t={t} />; // S02 cheekbones and a velvet coat
  if (t < B.anyway) return <Folklore t={t} />; // S03 a swollen corpse who died last Tuesday; he waves
  if (t < B.day1) return <HoldHands t={t} />; // S04 you date one anyway
  if (t < B.expire) return <Doorway t={t} />; // S05 day one: waiting to be invited
  if (t < B.day2) return <Kitchen t={t} />; // S06 your kitchen at four a.m.
  if (t < B.day3) return <Photo t={t} />; // S07 day two: you and a floating rose
  if (t < B.day4) return <Dinner t={t} />; // S08 day three: he watches you eat
  if (t < B.count) return <RiceDrop t={t} />; // S09 day four: the rice
  if (t < B.day5) return <Counting t={t} />; // S10 counting every grain
  if (t < B.day6) return <Soil t={t} />; // S11 day five: a crate of soil
  if (t < B.film) return <Sunny t={t} />; // S12 day six: noon in the novel
  if (t < B.day7) return <Taped t={t} />; // S13 the curtains taped shut
  if (t < B.marks) return <Pale t={t} />; // S14 day seven: pale
  if (t < B.mirror) return <Marks t={t} />; // S15 two small marks
  if (t < B.cut) return <MirrorRose t={t} />; // S16 the rose floating in the mirror; hard cut
  return <SurviveCard t={t} t0={B.cut} title="Would You Date Him?" subtitle="A WEEK WITH A VAMPIRE" prompt="Hollywood or folklore?" />;
};

const gradeAt = (t: number): Grade => (t >= B.cut ? 'none' : (t >= B.folklore && t < B.anyway) || (t >= B.film && t < B.day7) || (t >= B.expire && t < B.day2) ? 'cold' : 'warm');

const DAYS = [B.day1, B.day2, B.day3, B.day4, B.day5, B.day6, B.day7].map((d, i) => ({t: d, n: i + 1}));

export const Episode: React.FC = () => (
  <StoryFrame
    sceneAt={sceneAt}
    gradeAt={gradeAt}
    timing={timing as Timing}
    redWords={['Tuesday.', 'place.', 'be.']}
    overlay={(t) => <DayTag t={t} days={DAYS} until={B.cut} />}
    audio={META.audio}
  />
);
