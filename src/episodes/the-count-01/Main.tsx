import React from 'react';
import timing from './timing.json';
import {StoryFrame, Grade, dipAround, holdBlack} from '../../kit/series/StoryFrame';
import {TitleCard} from '../../kit/series/TitleCard';
import {Timing} from '../../kit/series/Captions';
import {lin, prog} from '../../kit/util';
import {BedView, CountMacro, GranScene, PourScene} from './scenes/Childhood';
import {CeilingScene, ClockScene, CoveredMirror, SweepScene, TorchRoom} from './scenes/Adult';
import {FloorWorld} from './scenes/Floor';
import {MirrorReveal, OpenWindow, ScratchScene} from './scenes/Reveal';

/** The Count — Part I. Reference episode for the Gothic POV style. 64.0 s. */
export const META = {id: 'TheCount01', durationSec: 64.0, audio: 'episodes/the-count-01/mix.wav'};

const sceneAt = (t: number) => {
  if (t < 3.3) return <BedView t={t} t0={0} dawn={0} rice={0} grip={0.6 + lin(t, 1.6, 2.2) * 0.4} flit />;
  if (t < 6.73) return <PourScene t={t} />;
  if (t < 8.945) return <GranScene t={t} />;
  if (t < 11.08) return <CountMacro t={t} />;
  if (t < 13.5) return <BedView t={t} t0={11.08} dawn={prog(t, 11.1, 13.2)} rice={1} grip={1 - prog(t, 11.6, 13) * 0.7} />;
  if (t < 17.9) return <TorchRoom t={t} />;
  if (t < 20.09) return <CoveredMirror t={t} />;
  if (t < 24.55) return <SweepScene t={t} />;
  if (t < 27.3) return <ClockScene t={t} />;
  if (t < 32.77) return <CeilingScene t={t} />;
  if (t < 42.81) return <FloorWorld t={t} />;
  if (t < 49.99) return <MirrorReveal t={t} />;
  if (t < 55.05) return <ScratchScene t={t} />;
  if (t < 58.33) return <FloorWorld t={t} />;
  if (t < 61.0) return <OpenWindow t={t} />;
  return <TitleCard t={t} t0={61.0} title="The Count" subtitle="PART I" />;
};

const gradeAt = (t: number): Grade => (t >= 61.0 ? 'none' : t < 13.5 ? 'warm' : 'cold');
// dip to black for the 26-year time jump; a hard black hold before 3 a.m.
const dipAt = (t: number) => dipAround(t, 13.5) + holdBlack(t, 24.55, 24.75);

export const Episode: React.FC = () => (
  <StoryFrame
    sceneAt={sceneAt}
    gradeAt={gradeAt}
    dipAt={dipAt}
    timing={timing as Timing}
    redWords={['real.', 'mine.', "wasn't.", 'in.', 'open.', 'One.', 'Counting.']}
    audio={META.audio}
  />
);
