import React from 'react';
import timing from './timing.json';
import E from './events.json';
import {StoryFrame,Grade,dipAround} from '../../kit/series/StoryFrame';
import {TitleCard} from '../../kit/series/TitleCard';
import {Timing} from '../../kit/series/Captions';
import {Supplier,Recruit,Street,Washing} from './scenes/Investigation';
import {SquareWide,CollarClose,ClovesInsert,LanternTeeth,Evidence,ButcherShop,CuffInsert,TwoCups} from './scenes/Revised';
import {Confrontation} from './scenes/Confrontation';
export const META={id:'Rabenfels02',durationSec:E.duration,audio:'episodes/rabenfels-02/mix.wav'};
const sceneAt=(t:number)=>{
 if(t<E.scent)return <SquareWide t={t}/>; // the square, the body under linen
 if(t<E.cloves)return <CollarClose t={t}/>; // you lift the collar
 if(t<E.memory)return <ClovesInsert t={t}/>; // cloves in the bloody wool
 if(t<E.recruit)return <Supplier t={t}/>; // memory: Otto's cup and cloves
 if(t<E.light)return <Recruit t={t}/>; // Safwan, the new recruit
 if(t<E.evidence)return <LanternTeeth t={t}/>; // the lantern, the fangs, you turn away
 if(t<E.door)return <Evidence t={t}/>; // wool under the nails; he fought someone
 if(t<E.street)return <ButcherShop t={t}/>; // Otto's shop, chained and dark
 if(t<E.coat)return <Street t={t}/>; // to the Broken Bell
 if(t<E.torn)return <Washing t={t}/>; // Marta scrubbing the coat
 if(t<E.ask)return <CuffInsert t={t}/>; // the torn cuff; cloves float out
 if(t<E.customer)return <Washing t={t}/>; // whose coat? the witness's
 if(t<E.stairs)return <TwoCups t={t}/>; // memory: Otto's other customer
 if(t<E.cut)return <Confrontation t={t}/>; // the stairs, the mirror, the demand
 return <TitleCard t={t} t0={E.cut} title="Rabenfels" subtitle="PART II · CLOVES"/>;
};
const memory=(t:number)=>(t>=E.memory&&t<E.recruit)||(t>=E.customer&&t<E.stairs);
const gradeAt=(t:number):Grade=>t>=E.cut?'none':memory(t)?'warm':'cold';
const dipAt=(t:number)=>dipAround(t,E.memory,.09)+dipAround(t,E.recruit,.11)+dipAround(t,E.customer,.1)+dipAround(t,E.stairs,.1);
export const Episode:React.FC=()=> <StoryFrame sceneAt={sceneAt} gradeAt={gradeAt} dipAt={dipAt} timing={timing as Timing} redWords={['Cloves.','customer.','empty.','secret.']} audio={META.audio}/>;
