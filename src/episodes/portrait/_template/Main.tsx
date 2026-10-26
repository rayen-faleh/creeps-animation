import React from 'react';
import timing from './timing.json';
import {StoryFrame, Grade, dipAround} from '../../../kit/common/series/StoryFrame';
import {TitleCard} from '../../../kit/common/series/TitleCard';
import {Timing} from '../../../kit/common/series/Captions';
import {BehindScene, DoorScene, MemoryScene} from './scenes/Story';

/**
 * TEMPLATE STORY — "The Knock". Copy this folder to start a new story:
 *   cp -r src/episodes/_template src/episodes/<slug>   then edit META, script.json, scenes, cues.py,
 *   and add one import + one array entry in src/Root.tsx.
 */
export const META = {id: 'Template', durationSec: 18.5, audio: 'audio/_template/mix.wav'};

const CUT = 14.25; // cliffhanger: hard cut to black, whisper, title

// shot list (mirrors shots.json): every cut lands on a phrase start from timing.json
const sceneAt = (t: number) => {
  if (t < 4.16) return <DoorScene t={t} t0={0} />; // S01 knocks
  if (t < 6.42) return <DoorScene t={t} t0={4.16} close />; // S02 ring pull, light under the door
  if (t < 9.38) return <MemoryScene t={t} />; // S03 Mother: never answer it
  if (t < 11.75) return <DoorScene t={t} t0={9.38} reach />; // S04 four knocks; hand reaches, recoils
  if (t < CUT) return <BehindScene t={t} />; // S05 whip-turn: a hand on the glass
  return <TitleCard t={t} t0={CUT} title="The Knock" subtitle="A GOTHIC POV STORY" />; // S06
};

const gradeAt = (t: number): Grade => (t >= CUT ? 'none' : t >= 6.42 && t < 9.38 ? 'warm' : 'cold');
const dipAt = (t: number) => dipAround(t, 6.42, 0.12) + dipAround(t, 9.38, 0.12);

export const Episode: React.FC = () => (
  <StoryFrame sceneAt={sceneAt} gradeAt={gradeAt} dipAt={dipAt} timing={timing as Timing} redWords={['four', 'behind', 'around.']} audio={META.audio} />
);
