import React from 'react';
import timing from './timing.json';
import beats from './beats.json';
import {StoryFrame, Grade, dipAround, holdBlack} from '../../../kit/common/series/StoryFrame';
import {TitleCard} from '../../../kit/common/series/TitleCard';
import {Timing} from '../../../kit/common/series/Captions';
import {
  B, Chair, Chewing, DoorCrack, Funeral, GraveNight, GranHush, LastText, LidRain, Mantel, Satins, Soil, StoneHook,
  Texts, Three, ThreadPull, Threads, Tired, TorchDies, TorchOn, Umbrellas,
} from './scenes/Story';

/** The Shroud Eater. Standalone, in THE COUNT's mould: a real burial rule (the Nachzehrer's stone), a self-twist. */
export const META = {id: 'ShroudEater', durationSec: beats.durationSec, audio: 'audio/shroud-eater/mix.wav'};

const FAMILY_OUT = [B.dies + 0.1, B.dies + 0.65, B.oneByOne + 0.0, B.oneByOne + 0.5, B.oneByOne + 1.0];
const MANTEL_CUT = B.aunt + 0.55;

const sceneAt = (t: number) => {
  if (t < B.door) return <StoneHook t={t} />; // S01 the stone goes in
  if (t < B.gran) return <DoorCrack t={t} />; // S02 I watched through the door
  if (t < B.threads) return <GranHush t={t} />; // S03 the dead wake up hungry
  if (t < B.candles) return <Threads t={t} />; // S04 thread by thread
  if (t < B.chair) return <Mantel t={t} t0={B.candles} out={FAMILY_OUT} seed={1} />; // S05 the family dies, one by one
  if (t < B.umbrellas) return <Chair t={t} />; // S06 Gran's been gone for years
  if (t < B.lid) return <Umbrellas t={t} />; // S07 another funeral
  if (t < B.nostone) return <LidRain t={t} />; // S08 Mum's lily, no stone
  if (t < B.phone) return <Soil t={t} />; // S09 there was no stone
  if (t < MANTEL_CUT) return <Texts t={t} />; // S10 Rob. Same as you. June.
  if (t < B.tired) return <Mantel t={t} t0={MANTEL_CUT - 3} out={[MANTEL_CUT - 3, MANTEL_CUT + 0.15]} cold seed={2} push={0.03} />; // S11 two out
  if (t < B.three) return <Tired t={t} />; // S12 so tired
  if (t < B.chew) return <Three t={t} />; // S13 3:00
  if (t < B.grave) return <Chewing t={t} />; // S14 something chewing
  if (t < B.thread) return <GraveNight t={t} />; // S15 from the grave
  if (t < B.torch) return <ThreadPull t={t} />; // S16 thread between my teeth
  if (t < B.satin) return <TorchOn t={t} />; // S17 the torch
  if (t < B.twist) return <Satins t={t} />; // S18 white satin; tilt down the body
  if (t < B.texted) return <Funeral t={t} />; // S19 it was my funeral
  if (t < B.last) return <LastText t={t} />; // S20 I'll come and see you tomorrow
  if (t < B.whisper) return <Mantel t={t} t0={B.last} out={[B.last - 9, B.last - 7, B.last - 5, B.last - 4]} cold seed={3} push={0.12} bend={[0, 0, 0, 0, Math.max(0, Math.sin((t - B.last) * 2.2)) * 0.9]} />; // S21 the last one left
  if (t < B.title) return <TorchDies t={t} />; // S22 still hungry
  return <TitleCard t={t} t0={B.title} title="The Shroud Eater" />;
};

const gradeAt = (t: number): Grade => (t >= B.title ? 'none' : t < B.chair ? 'warm' : 'cold');
const dipAt = (t: number) => dipAround(t, B.chair, 0.22) + dipAround(t, B.phone, 0.2) + holdBlack(t, B.whisper + 0.5, B.title);

export const Episode: React.FC = () => (
  <StoryFrame
    sceneAt={sceneAt}
    gradeAt={gradeAt}
    dipAt={dipAt}
    timing={timing as Timing}
    redWords={['shroud.', 'stone.', 'funeral.']}
    audio={META.audio}
  />
);
