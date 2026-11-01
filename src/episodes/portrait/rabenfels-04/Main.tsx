import React from 'react';
import timing from './timing.json';
import E from './events.json';
import {StoryFrame, Grade, dipAround} from '../../../kit/rabenfels/series/StoryFrame';
import {TitleCard} from '../../../kit/rabenfels/series/TitleCard';
import {Timing} from '../../../kit/rabenfels/series/Captions';
import {Climb, DoorOpen, Glare, Gone, Grete, Hook, Lida, LidaLooks, Memory, Otto, OttoEyes, Threshold, WavesIn, Whisper} from './scenes/Story';

/** Rabenfels, Part IV. @lidssparrowlove: point the watch upstairs. New resident Lida Sperling. Otto is in the room. */
export const META = {id: 'Rabenfels04', durationSec: E.duration, audio: 'audio/rabenfels-04/mix.wav'};

const sceneAt = (t: number) => {
  if (t < E.stepback) return <Hook t={t} />; // your hand jerks out of the glass
  if (t < E.grete) return <Glare t={t} />; // you look at Safwan; he closes his mouth
  if (t < E.lida) return <Grete t={t} />; // the man you want is upstairs
  if (t < E.climb) return <Lida t={t} />; // Lida runs for the keys
  if (t < E.bolt) return <Climb t={t} />; // three lanterns climb the stairs
  if (t < E.gone) return <DoorOpen t={t} />; // the bolt, the key, the door
  if (t < E.otto) return <Gone t={t} />; // the window open; a hand on the floor
  if (t < E.waves) return <Otto t={t} />; // Otto. Alive. Barely
  if (t < E.cant) return <WavesIn t={t} />; // clerk, bring your pen
  if (t < E.eyes) return <Threshold t={t} />; // you can't; your foot stops at the doorway
  if (t < E.only) return <OttoEyes t={t} />; // he sees you in the doorway
  if (t < E.pulls) return <Memory t={t} />; // the only man who knows what you buy
  if (t < E.looksup) return <Whisper t={t} />; // he whispers to Lida
  if (t < E.cut) return <LidaLooks t={t} />; // Lida looks up. At you
  return <TitleCard t={t} t0={E.cut} title="Rabenfels" subtitle="PART IV" />;
};

const gradeAt = (t: number): Grade => (t >= E.cut ? 'none' : t >= E.only && t < E.pulls ? 'warm' : 'cold');
const dipAt = (t: number) => dipAround(t, E.only, 0.09) + dipAround(t, E.pulls, 0.09);

export const Episode: React.FC = () => (
  <StoryFrame sceneAt={sceneAt} gradeAt={gradeAt} dipAt={dipAt} timing={timing as Timing} redWords={['Otto.']} audio={META.audio} />
);
