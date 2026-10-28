import React from 'react';
import timing from './timing.json';
import beats from './beats.json';
import {StoryFrame, Grade, holdBlack} from '../../../kit/common/series/StoryFrame';
import {PollCard} from '../../../kit/common/series/Survive';
import {Timing} from '../../../kit/common/series/Captions';
import {B, Bar, Door, Envelope, FarEnd, GothNights, Hook, MyTypeShot, Rules, Slide, Sorry, StoryShot, Telly, Votes, Wake, Wine} from './scenes/Story';

/** My Type, Part 1. Vampire horror-comedy: a council votes on whether you live. Ends on a viewer poll. */
export const META = {id: 'MyType01', durationSec: beats.durationSec, audio: 'audio/my-type/mix.wav'};

const sceneAt = (t: number) => {
  if (t < B.hollywood) return <Hook t={t} />; // S01 seven vampires vote tonight
  if (t < B.type) return <Telly t={t} />; // S02 Hollywood started it
  if (t < B.goth) return <MyTypeShot t={t} />; // S03 pale, black lace, hates mornings
  if (t < B.then) return <GothNights t={t} />; // S04 eight years of goth nights
  if (t < B.door) return <Bar t={t} />; // S05 not drinking
  if (t < B.wine) return <Door t={t} />; // S06 invite me in
  if (t < B.sorry) return <Wine t={t} />; // S07 the selfie; the glass breaks
  if (t < B.woke) return <Sorry t={t} />; // S08 she said sorry
  if (t < B.envelope) return <Wake t={t} />; // S09 no pulse
  if (t < B.rules) return <Envelope t={t} />; // S10 made without permission
  if (t < B.eldest) return <Rules t={t} />; // S11 no one finds out
  if (t < B.story) return <Slide t={t} />; // S12 my phone slid across the table
  if (t < B.far) return <StoryShot t={t} />; // S13 nobody next to me; 312 views
  if (t < B.each) return <FarEnd t={t} />; // S14 she hasn't looked at me once
  if (t < B.cut) return <Votes t={t} />; // S15-16 three each; the last is hers
  return <PollCard t={t} t0={B.cut} question="How Does She Vote?" series="MY TYPE · PART 1" a="Spare him" b="Stake him" />;
};

const gradeAt = (t: number): Grade => (t >= B.cut ? 'none' : t >= B.hollywood && t < B.woke ? 'warm' : 'cold');
const dipAt = (t: number) => holdBlack(t, B.black, B.woke);

export const Episode: React.FC = () => (
  <StoryFrame sceneAt={sceneAt} gradeAt={gradeAt} dipAt={dipAt} timing={timing as Timing} redWords={['pulse.', 'Nobody', 'hers.']} audio={META.audio} />
);
