import React from 'react';
import timing from './timing.json';
import E from './events.json';
import {StoryFrame,Grade,dipAround,holdBlack} from '../../kit/series/StoryFrame';
import {TitleCard} from '../../kit/series/TitleCard';
import {Timing} from '../../kit/series/Captions';
import {Opening,ThresholdMemory,UninvitedEntry,Bedroom,Tightening} from './scenes/Story';
export const META={id:'NeverKnocks',durationSec:E.duration,audio:'episodes/friend-who-never-knocks/mix.wav'};
const sceneAt=(t:number)=>{
 if(t<E.memory)return <Opening t={t}/>;
 if(t<E.coldEntry)return <ThresholdMemory t={t}/>;
 if(t<E.wake)return <UninvitedEntry t={t}/>;
 if(t<E.tighten)return <Bedroom t={t}/>;
 if(t<E.cut)return <Tightening t={t}/>;
 return <TitleCard t={t} t0={E.cut} title="Come In" subtitle="A GOTHIC POV STORY"/>;
};
const gradeAt=(t:number):Grade=>t>=E.cut?'none':t>=E.memory&&t<E.coldEntry?'warm':'cold';
const dipAt=(t:number)=>dipAround(t,E.memory,.10)+dipAround(t,E.coldEntry,.16)+holdBlack(t,E.blackWake,E.wake);
export const Episode:React.FC=()=> <StoryFrame sceneAt={sceneAt} gradeAt={gradeAt} dipAt={dipAt} timing={timing as Timing} redWords={['again.','Alone.']} audio={META.audio}/>;
