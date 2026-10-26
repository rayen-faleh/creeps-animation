import React from 'react';
import timing from './timing.json';
import {StoryFrame, Grade} from '../../../kit/common/series/StoryFrame';
import {Timing} from '../../../kit/common/series/Captions';
import {LANDSCAPE} from '../../../kit/common/format';
import {CHAPTERS} from './beats';
import {C1, chapterOneAt, chapterOneGrade} from './scenes/ChapterOne';
import {C3, chaptersTwoThreeAt, chaptersTwoThreeGrade} from './scenes/ChaptersTwoThree';
import {chaptersFourFiveAt, chaptersFourFiveGrade} from './scenes/ChaptersFourFive';

/**
 * The Quarter Turn: long-form, 16:9. Cold open, title, five chapters with subtle chapter markers.
 */
const TOTAL = (timing as Timing).total + 9.0; // end card after the last line
export const META = {id: 'TheQuarterTurn', durationSec: Math.ceil(TOTAL), format: LANDSCAPE, audio: 'audio/the-quarter-turn/mix.wav'};

export const sceneAt = (t: number): React.ReactNode => {
  if (t < C1.end) return chapterOneAt(t);
  if (t < C3.end) return chaptersTwoThreeAt(t);
  return chaptersFourFiveAt(t);
};
export const gradeAt = (t: number): Grade => (t < C1.end ? chapterOneGrade(t) : t < C3.end ? chaptersTwoThreeGrade(t) : chaptersFourFiveGrade(t));

export const Episode: React.FC = () => (
  <StoryFrame format={LANDSCAPE} sceneAt={sceneAt} gradeAt={gradeAt} timing={timing as Timing} chapters={CHAPTERS} redWords={['quarter.', 'circle.', 'name.', 'home.']} audio={META.audio} />
);
