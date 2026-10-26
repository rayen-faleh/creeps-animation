import React from 'react';
import timing from './timing.json';
import beats from './beats.json';
import {StoryFrame, Grade, dipAround} from '../../../kit/common/series/StoryFrame';
import {TitleCard} from '../../../kit/common/series/TitleCard';
import {Timing} from '../../../kit/common/series/Captions';
import {B, HookPages, MemoryLamp, PostClose, StreetApproach, WindowBeam} from './scenes/Outside';
import {BackDoor, Cliffhanger, LastPage, LogPage, Notebook2006, ShelfScene, ToldScene} from './scenes/Inside';

/** The Watch — Part II. Werewolf series, episode 2. Length follows the narration (beats.json). */
export const META = {id: 'TheWatch02', durationSec: beats.durationSec, audio: 'audio/the-watch-02/mix.wav'};

// shot list (mirrors shots.json): every cut lands on a phrase start from timing.json
const sceneAt = (t: number) => {
  if (t < B.street) return <HookPages t={t} />; // S01 a dead man's diary
  if (t < B.post) return <StreetApproach t={t} />; // S02 the torch still on
  if (t < B.window) return <PostClose t={t} />; // S03 lashed to the post
  if (t < B.key) return <WindowBeam t={t} />; // S04 pointed at my window
  if (t < B.door) return <PostClose t={t} withKey />; // S05 a key: back door
  if (t < B.shelf) return <BackDoor t={t} />; // S06 Mick's house, wolfsbane
  if (t < B.memory) return <ShelfScene t={t} />; // S07 twenty notebooks
  if (t < B.page) return <MemoryLamp t={t} />; // S08 memory: Mick writing at the lamp
  if (t < B.y2006) return <LogPage t={t} />; // S09 "S. at window. Held."
  if (t < B.open2006) return <ShelfScene t={t} pick />; // S10 pulling 2006
  if (t < B.told) return <Notebook2006 t={t} />; // S11 one-handed: "D. took my arm."
  if (t < B.last) return <ToldScene t={t} />; // S12 Danny's texts
  if (t < B.text - 0.4) return <LastPage t={t} />; // S13-14 the last page
  if (t < B.cut) return <Cliffhanger t={t} />; // S15 "Coming round" / the door
  return <TitleCard t={t} t0={B.cut} title="The Watch" subtitle="PART II" />; // S16
};

const gradeAt = (t: number): Grade => (t >= B.cut ? 'none' : t >= B.memory && t < B.page ? 'warm' : 'cold');
const dipAt = (t: number) => dipAround(t, B.memory, 0.14) + dipAround(t, B.page, 0.14);

export const Episode: React.FC = () => (
  <StoryFrame sceneAt={sceneAt} gradeAt={gradeAt} dipAt={dipAt} timing={timing as Timing} redWords={['Held.', "Danny's.", 'out.']} audio={META.audio} />
);
