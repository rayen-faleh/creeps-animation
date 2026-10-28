import React from 'react';
import timing from './timing.json';
import beats from './beats.json';
import {StoryFrame, Grade, dipAround, holdBlack} from '../../../kit/common/series/StoryFrame';
import {TitleCard} from '../../../kit/common/series/TitleCard';
import {Timing} from '../../../kit/common/series/Captions';
import {AlongTheBed, B, Burial, DrawerShut, Gone, GranSays, HandBack, Hook, KitchenNight, MyRoom, Prints, Promise, Stairs, Toe} from './scenes/Story';

/** The Sickle. A standalone short in the vein of The Count, Part I. Length follows the narration (beats.json). */
export const META = {id: 'TheSickle', durationSec: beats.durationSec, audio: 'audio/the-sickle/mix.wav'};

const sceneAt = (t: number) => {
  if (t < B.sickle) return <Hook t={t} />; // S01 the sickle across her throat, candlelight
  if (t < B.why) return <AlongTheBed t={t} />; // S02-03 her hand on the blade; pan down the bed to the padlock
  if (t < B.promise) return <GranSays t={t} />; // S04 so I stay where I'm put
  if (t < B.thirty) return <Promise t={t} />; // S05 the promise
  if (t < B.undertaker) return <Burial t={t} />; // S06 the coffin closes
  if (t < B.drawer) return <HandBack t={t} />; // S07 the undertaker won't
  if (t < B.lastnight) return <DrawerShut t={t} />; // S08 into the kitchen drawer
  if (t < B.gone) return <KitchenNight t={t} />; // S09 last night, the drawer open
  if (t < B.soil) return <Gone t={t} />; // S10 the padlock was gone
  if (t < B.stairs) return <Prints t={t} />; // S11 wet bare footprints
  if (t < B.never) return <Stairs t={t} />; // S12 up the stairs, to my room
  if (t < B.cold) return <MyRoom t={t} />; // S13 keeping her in the ground
  if (t < B.cut) return <Toe t={t} />; // S14 the padlock closes on my toe
  return <TitleCard t={t} t0={B.cut} title="The Sickle" />;
};

const gradeAt = (t: number): Grade => (t >= B.cut ? 'none' : t < B.thirty ? 'warm' : 'cold');
// a dip for the years between; a hard black beat before "last night"
const dipAt = (t: number) => dipAround(t, B.thirty) + holdBlack(t, B.lastnight, B.lastnight + 0.2);

export const Episode: React.FC = () => (
  <StoryFrame
    sceneAt={sceneAt}
    gradeAt={gradeAt}
    dipAt={dipAt}
    timing={timing as Timing}
    redWords={['did.', 'gone.', 'ground.']}
    audio={META.audio}
  />
);
