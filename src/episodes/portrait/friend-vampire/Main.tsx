import React from 'react';
import timing from './timing.json';
import beats from './beats.json';
import {StoryFrame, Grade} from '../../../kit/common/series/StoryFrame';
import {DayTag, SurviveCard} from '../../../kit/common/series/Survive';
import {Timing} from '../../../kit/common/series/Captions';
import {B, ColdHands, Door, Garlic, Hook, SentYou, Sugar, TakePhoto, TheirPlace} from './scenes/Story';

/** "You could be friends with a vampire without knowing it": seven signs, subtle to sinister, a meta twist. */
export const META = {id: 'FriendVampire', durationSec: beats.durationSec, audio: 'audio/friend-vampire/mix.wav'};

const sceneAt = (t: number) => {
  if (t < B.s1) return <Hook t={t} />; // the group selfie, nobody holding the phone
  if (t < B.s2) return <TakePhoto t={t} />; // 1 they always take the photo
  if (t < B.s3) return <Door t={t} />; // 2 they wait to be invited in
  if (t < B.s4) return <Garlic t={t} />; // 3 garlic bread; an empty chair
  if (t < B.s5) return <Sugar t={t} />; // 4 counting sugar sachets, twice
  if (t < B.s6) return <ColdHands t={t} />; // 5 cold hands, frost
  if (t < B.s7) return <TheirPlace t={t} />; // 6 never been to their place
  if (t < B.cut) return <SentYou t={t} />; // 7 they sent you this video
  return <SurviveCard t={t} t0={B.cut} title="Tag the Friend" subtitle="WHO TAKES ALL THE PHOTOS" prompt="How many signs does yours have?" />;
};

const gradeAt = (t: number): Grade => (t >= B.cut ? 'none' : (t >= B.s6 && t < B.s7) || (t >= B.s2 && t < B.s3) ? 'cold' : 'warm');
const SIGNS = Array.from({length: 7}, (_, i) => ({t: (B as Record<string, number>)[`s${i + 1}`], n: i + 1}));

export const Episode: React.FC = () => (
  <StoryFrame
    sceneAt={sceneAt}
    gradeAt={gradeAt}
    timing={timing as Timing}
    redWords={['Twice.', 'once.', 'video.']}
    overlay={(t) => <DayTag t={t} days={SIGNS} until={B.cut} label="SIGN" />}
    audio={META.audio}
  />
);
