import React from 'react';
import timing from './timing.json';
import beats from './beats.json';
import {StoryFrame, Grade, dipAround, holdBlack} from '../../../kit/common/series/StoryFrame';
import {TitleCard} from '../../../kit/common/series/TitleCard';
import {Timing} from '../../../kit/common/series/Captions';
import {
  B, CeilingAgain, Climb, ClockShot, DoorWide, EmptySide, Gran, GranStuffs, HairDrift, HairFalls, Hook, IStuff, Morning,
  OpenKeyhole, Points, PullOut, Reach, Ring, Weight, Wife,
} from './scenes/Story';

/** The Keyhole. Standalone, after the Scandinavian mare-wife legend: no death imagery, twist at ~44 s. */
export const META = {id: 'TheKeyhole', durationSec: beats.durationSec, audio: 'audio/the-keyhole/mix.wav'};

const sceneAt = (t: number) => {
  if (t < B.door) return <Hook t={t} />; // S01 the wool breathes
  if (t < B.gran) return <DoorWide t={t} />; // S02 six years
  if (t < B.weight) return <Gran t={t} />; // S03 the mare comes in through keyholes
  if (t < B.block) return <Weight t={t} />; // S04 the weight on your chest
  if (t < B.sixYears) return <GranStuffs t={t} />; // S05 block the hole
  if (t < B.stuffed) return <ClockShot t={t} t0={B.sixYears} />; // S06 every night
  if (t < B.stopped) return <IStuff t={t} />; // S07 I stuffed it shut
  if (t < B.sameWeek) return <Morning t={t} />; // S08a it stopped
  if (t < B.asked) return <Wife t={t} />; // S08b I met my wife
  if (t < B.pulled) return <Points t={t} />; // S09 she asked
  if (t < B.quiet) return <PullOut t={t} />; // S10 a hair comes out with the wool
  if (t < B.three) return <HairDrift t={t} />; // S11 she went quiet
  if (t < B.cantMove) return <ClockShot t={t} t0={B.three} />; // S12a three a.m.
  if (t < B.climb) return <CeilingAgain t={t} />; // S12b I couldn't move
  if (t < B.reach) return <Climb t={t} />; // S13 something climbing
  if (t < B.empty) return <Reach t={t} />; // S14 reach for my wife
  if (t < B.warm) return <EmptySide t={t} />; // S15 empty
  if (t < B.married) return <OpenKeyhole t={t} />; // S15b-16 still warm; never got rid of her
  if (t < B.hair) return <Ring t={t} />; // S17 I married her
  if (t < B.whisper) return <HairFalls t={t} />; // S18 her hair
  if (t < B.title) return null; // S19 black: the whisper
  return <TitleCard t={t} t0={B.title} title="The Keyhole" />;
};

const warmAt = (t: number) => (t >= B.gran && t < B.weight) || (t >= B.block && t < B.sixYears) || (t >= B.stopped && t < B.asked);
const gradeAt = (t: number): Grade => (t >= B.whisper ? 'none' : warmAt(t) ? 'warm' : 'cold');
const dipAt = (t: number) => dipAround(t, B.three, 0.2) + holdBlack(t, B.whisper - 0.05, B.title);

export const Episode: React.FC = () => (
  <StoryFrame
    sceneAt={sceneAt}
    gradeAt={gradeAt}
    dipAt={dipAt}
    timing={timing as Timing}
    redWords={['married']}
    audio={META.audio}
  />
);
