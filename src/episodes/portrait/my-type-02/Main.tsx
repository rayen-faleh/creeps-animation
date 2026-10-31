import React from 'react';
import timing from './timing.json';
import beats from './beats.json';
import {StoryFrame, Grade} from '../../../kit/common/series/StoryFrame';
import {ClockTag, PollCard} from '../../../kit/common/series/Survive';
import {Timing} from '../../../kit/common/series/Captions';
import {B, Bar, Dm, LastLine, List, Montage, Pizza, Profile, Sorry, Still, StoryShot, Teach, Terms, Vote} from './scenes/Story';

/** My Type, Part 2. Viewers chose A: she spares him, on one condition. Ends on a viewer poll. */
export const META = {id: 'MyType02', durationSec: beats.durationSec, audio: 'audio/my-type-02/mix.wav'};

const sceneAt = (t: number) => {
  if (t < B.vote) return <Bar t={t} />; // S01 three weeks ago, a girl I met at a goth night bit me
  if (t < B.terms) return <Vote t={t} />; // S02 she voted to spare me
  if (t < B.story) return <Terms t={t} />; // S03 by sunrise, the selfie never happened
  if (t < B.list) return <StoryShot t={t} />; // S04 312 people saw it
  if (t < B.teach) return <List t={t} />; // S05-06 the list; number one, my mum
  if (t < B.pizza) return <Teach t={t} />; // S07 eye contact, slowly, forget
  if (t < B.montage) return <Pizza t={t} />; // S08 the pizza guy forgot his own name
  if (t < B.door) return <Montage t={t} />; // S09 two hundred people by four a.m.
  if (t < B.last) return <Sorry t={t} />; // S10 at every door, she said sorry
  if (t < B.profile) return <LastLine t={t} />; // S11 number three hundred and twelve
  if (t < B.dm) return <Profile t={t} />; // S12 no name, no photo
  if (t < B.shoulder) return <Dm t={t} />; // S13 I know what she is. Do you?
  if (t < B.cut) return <Still t={t} />; // S14 she stopped apologising
  return <PollCard t={t} t0={B.cut} series="MY TYPE · PART 2" a="Reply to them" b="Hand it to the council" />;
};

const gradeAt = (t: number): Grade => (t >= B.cut ? 'none' : t < B.vote || (t >= B.teach && t < B.last) ? 'warm' : 'cold');

const STAMPS = [
  {t: B.terms, time: '00:40'},
  {t: B.teach, time: '01:15'},
  {t: B.montage, time: '04:02'},
  {t: B.last, time: '05:31'},
  {t: B.know, time: '05:47'},
];

export const Episode: React.FC = () => (
  <StoryFrame
    sceneAt={sceneAt}
    gradeAt={gradeAt}
    timing={timing as Timing}
    redWords={['twelve.', 'you?']}
    overlay={(t) => <ClockTag t={t} stamps={STAMPS} until={B.cut} label="UNTIL SUNRISE" />}
    audio={META.audio}
  />
);
