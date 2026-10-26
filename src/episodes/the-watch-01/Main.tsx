import React from 'react';
import timing from './timing.json';
import {StoryFrame, Grade, dipAround, holdBlack} from '../../kit/series/StoryFrame';
import {TitleCard} from '../../kit/series/TitleCard';
import {Timing} from '../../kit/series/Captions';
import {BaneScene, ChildWindow, HomeScene, LampScene, NailsMacro, ProfileScene, T, WallScene} from './scenes/Memory';
import {CardScene, HandsScene, LastScene, MudScene, P, PhoneScene, ProofScene, RoomScene, WakeScene} from './scenes/Present';

/** The Watch — Part I. Werewolf series, episode 1. 63.5 s. */
export const META = {id: 'TheWatch01', durationSec: 63.5, audio: 'audio/the-watch-01/mix.wav'};

// shot list (mirrors shots.json): every cut lands on a phrase start from timing.json
const sceneAt = (t: number) => {
  if (t < T.profile) return <WallScene t={t} />; // S01 the dare
  if (t < T.mock) return <ProfileScene t={t} />; // S02 "A wolf took it"
  if (t < T.nails) return <WallScene t={t} mock />; // S03 we thought he was mad
  if (t < T.bane) return <NailsMacro t={t} />; // S04 silver nails (in OUR sill)
  if (t < T.home) return <BaneScene t={t} />; // S05 wolfsbane (over OUR door)
  if (t < T.window) return <HomeScene t={t} />; // S06 sent home before dark
  if (t < T.lamp) return <ChildWindow t={t} />; // S07 the torch finds our window
  if (t < P.card) return <LampScene t={t} />; // S08 Wolfman Mick
  if (t < P.room) return <CardScene t={t} />; // S09 the funeral card
  if (t < P.black) return <RoomScene t={t} />; // S10 nobody at the end of the road
  if (t < P.mud) return <WakeScene t={t} />; // S11 woke at three
  if (t < P.phone) return <MudScene t={t} />; // S12 mud on the sill
  if (t < P.hands) return <PhoneScene t={t} />; // S13 Danny's texts
  if (t < P.proof) return <HandsScene t={t} />; // S14 his own hand
  if (t < P.turn) return <ProofScene t={t} />; // S15 "getting out"
  if (t < P.cut) return <LastScene t={t} />; // S16 a torch at the end of the road
  return <TitleCard t={t} t0={P.cut} title="The Watch" subtitle="PART I" />; // S17
};

const gradeAt = (t: number): Grade => (t >= P.cut ? 'none' : t < P.card ? 'warm' : 'cold');
// dip for the twenty-year jump; hard black before waking at three
const dipAt = (t: number) => dipAround(t, P.card) + holdBlack(t, P.black, P.wake);

export const Episode: React.FC = () => (
  <StoryFrame sceneAt={sceneAt} gradeAt={gradeAt} dipAt={dipAt} timing={timing as Timing} redWords={['wolf', 'you', 'out.']} audio={META.audio} />
);
