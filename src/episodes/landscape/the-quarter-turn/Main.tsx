import React from 'react';
import timing from './timing.json';
import {AbsoluteFill} from 'remotion';
import {StoryFrame, Grade} from '../../../kit/common/series/StoryFrame';
import {Timing} from '../../../kit/common/series/Captions';
import {LANDSCAPE} from '../../../kit/common/format';
import {CHAPTERS} from './beats';
import {C1, chapterOneAt, chapterOneGrade} from './scenes/ChapterOne';

/**
 * The Quarter Turn: long-form, 16:9. Cold open, title, five chapters with subtle chapter markers.
 * Built and reviewed chapter by chapter; chapters not yet built render black.
 */
const TOTAL = (timing as Timing).total + 9.0; // end card after the last line
export const META = {id: 'TheQuarterTurn', durationSec: Math.ceil(TOTAL), format: LANDSCAPE, audio: 'audio/the-quarter-turn/mix.wav'};

export const sceneAt = (t: number): React.ReactNode => {
  if (t < C1.end) return chapterOneAt(t);
  return <AbsoluteFill style={{background: '#000'}} />;
};
export const gradeAt = (t: number): Grade => (t < C1.end ? chapterOneGrade(t) : 'none');

export const Episode: React.FC = () => (
  <StoryFrame format={LANDSCAPE} sceneAt={sceneAt} gradeAt={gradeAt} timing={timing as Timing} chapters={CHAPTERS} redWords={['quarter.']} audio={META.audio} />
);
