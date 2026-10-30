import React from 'react';
import timing from './timing.json';
import beats from './beats.json';
import {StoryFrame, Grade} from '../../../kit/common/series/StoryFrame';
import {ClockTag, PollCard} from '../../../kit/common/series/Survive';
import {Timing} from '../../../kit/common/series/Captions';
import {B, Badge, Behind, Call, Crawl, Dave, Heartbeat, Offer, Recap, Sky, Stockroom} from './scenes/Story';

/** Graveyard Shift, Part 2: The Call. Viewers chose to call him. Fourteen minutes to sunrise; ends on a viewer poll. */
export const META = {id: 'GraveyardShift02', durationSec: beats.durationSec, audio: 'audio/graveyard-shift-02/mix.wav'};

const sceneAt = (t: number) => {
  if (t < B.recap) return <Call t={t} />; // S01 he picked up on the first ring
  if (t < B.name) return <Recap t={t} />; // S02 coins from 1790; your hand smoking
  if (t < B.sunrise) return <Badge t={t} />; // S03 TRAINEE
  if (t < B.stock) return <Sky t={t} />; // S04 fourteen minutes; he sounds bored
  if (t < B.crawl) return <Stockroom t={t} />; // S05 the stockroom has no windows
  if (t < B.van) return <Crawl t={t} />; // S06 the sun crawls across the floor
  if (t < B.heart) return <Dave t={t} />; // S07-08 Dave, early, banging on the glass
  if (t < B.offer) return <Heartbeat t={t} />; // S09 you can hear his heartbeat
  if (t < B.twice) return <Offer t={t} />; // S10 every rule, for a price; invite me in
  if (t < B.cut) return <Behind t={t} />; // S11-12 his voice twice; the eyes behind you
  return <PollCard t={t} t0={B.cut} series="GRAVEYARD SHIFT · PART 2" a="Invite him home" b="Hang up. Let Dave in. You're starving." />;
};

const gradeAt = (t: number): Grade => (t >= B.cut ? 'none' : 'cold');

const STAMPS = [
  {t: 0, time: '05:58'},
  {t: B.crawl, time: '06:03'},
  {t: B.van, time: '06:05'},
  {t: B.heart, time: '06:07'},
  {t: B.twice, time: '06:09'},
];

export const Episode: React.FC = () => (
  <StoryFrame
    sceneAt={sceneAt}
    gradeAt={gradeAt}
    timing={timing as Timing}
    redWords={['heartbeat.', 'twice.']}
    overlay={(t) => <ClockTag t={t} stamps={STAMPS} until={B.cut} />}
    audio={META.audio}
  />
);
