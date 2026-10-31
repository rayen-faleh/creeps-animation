import React from 'react';
import timing from './timing.json';
import E from './events.json';
import {StoryFrame, Grade} from '../../../kit/rabenfels/series/StoryFrame';
import {TitleCard} from '../../../kit/rabenfels/series/TitleCard';
import {Timing} from '../../../kit/rabenfels/series/Captions';
import {Asks, BacksUp, Burst, Door, EmptyGrip, Grab, Hook, Key, Looks, Mouth, NoStranger, Point, StepBack, Taunt, Whistle} from './scenes/Story';

/** Rabenfels, Part III. @stvry.safwan won again: Safwan is shown the mirror. The mirror then turns on Elias. */
export const META = {id: 'Rabenfels03', durationSec: E.duration, audio: 'audio/rabenfels-03/mix.wav'};

const sceneAt = (t: number) => {
  if (t < E.answer) return <Hook t={t} />; // the gold mirror; it worked, that was the problem
  if (t < E.stepback) return <Point t={t} />; // Safwan, look at the mirror
  if (t < E.looks) return <StepBack t={t} />; // out of the glass
  if (t < E.nostranger) return <Looks t={t} />; // stairs, railing, candle, his own face
  if (t < E.whistle) return <NoStranger t={t} />; // no stranger
  if (t < E.smiles) return <Whistle t={t} />; // his hand finds his whistle
  if (t < E.screams) return <Taunt t={t} />; // clever; let's see how long
  if (t < E.falls) return <BacksUp t={t} />; // the whistle screams; he backs up the stairs
  if (t < E.slam) return <Key t={t} />; // Otto's shop key
  if (t < E.grab) return <Door t={t} />; // a room you were never invited into
  if (t < E.pulled) return <Grab t={t} />; // you knew; how did you know?
  if (t < E.burst) return <EmptyGrip t={t} />; // in the glass, his hand is gripping nothing
  if (t < E.asks) return <Burst t={t} />; // Captain Grete, three lanterns
  if (t < E.mouth) return <Asks t={t} />; // where is he?
  if (t < E.cut) return <Mouth t={t} />; // he opens his mouth, and looks at the mirror
  return <TitleCard t={t} t0={E.cut} title="Rabenfels" subtitle="PART III" />;
};

const gradeAt = (t: number): Grade => (t >= E.cut ? 'none' : 'cold');

export const Episode: React.FC = () => (
  <StoryFrame sceneAt={sceneAt} gradeAt={gradeAt} dipAt={() => 0} timing={timing as Timing} redWords={['stranger.', 'key.', 'nothing.']} audio={META.audio} />
);
