import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage} from '../../../kit/fx';
import {DoorWall} from '../../../kit/sets/DoorWall';
import {WindowWall, WIN, SILL_Y} from '../../../kit/sets/WindowWall';
import {Hand, POSES, STYLES, lerpPose, wristFor} from '../../../kit/art/Hand';
import {easeIn, easeOut, mix, noise1, prog} from '../../../kit/util';
import E from '../events.json';

const jolt = (t:number) => E.knocks.reduce((m,k)=>Math.max(m,t>=k&&t<k+.18?1-(t-k)/.18:0),0);

export const RememberedRule:React.FC<{t:number}>=({t}) => {
 const stop=prog(t,.6,1.3,easeOut);
 return <Camera t={t} zoom={1.02+t*.02} shake={3} seed={71}><Stage>
  <DoorWall id="rule" t={t} mode="candle" beam={0} under={.12}>
   <Hand id="child" x={810+noise1(t,8)*3} y={mix(1640,1230,stop)} rot={-8} scale={1.1} style={STYLES.child} pose={lerpPose(POSES.relaxed,POSES.flat,stop)} light={.8}/>
  </DoorWall>
 </Stage></Camera>;
};

export const DoorApproach:React.FC<{t:number}>=({t})=>{
 const up=prog(t,E.reachStart,E.contact,easeOut);
 const touch=prog(t,6.2,6.65,easeOut);
 const recoil=prog(t,E.fourthKnock,E.fourthKnock+.2,easeOut);
 const pose=lerpPose(lerpPose(lerpPose(POSES.relaxed,POSES.reach,up),POSES.point,touch),POSES.fist,recoil);
 const [wx,wy]=wristFor(708,994,-8,1.25,STYLES.adult,pose);
 const settle=prog(t,6.2,6.65);
 const fright=t>=E.fourthKnock?3:0;
 return <Camera t={t} zoom={1.03+prog(t,3.05,7.55)*.14} x={mix(0,80,settle)} y={mix(0,100,settle)} shake={t<E.fourthKnock?5:7} seed={73}><Stage>
  <DoorWall id="present" t={t} mode="night" knock={jolt(t)} under={.24+.07*Math.sin(t*3)} underColor="#9fb4cf">
   <Hand id="adult" x={mix(970,wx,up)+noise1(t*20,2)*fright} y={mix(2300,wy,up)+recoil*1000} rot={-8+recoil*18} scale={1.25} style={STYLES.adult} pose={pose} light={.75}/>
  </DoorWall>
 </Stage></Camera>;
};

export const WindowReveal:React.FC<{t:number}>=({t})=>{
 const whip=prog(t,E.turn,E.turn+.32,easeOut);
 const push=prog(t,E.turn,E.cut,(v)=>v);
 const curl=prog(t,9.2,10.8,easeIn);
 const opening=prog(t,11.1,E.cut,easeIn)*.10;
 return <AbsoluteFill style={{filter:whip<.99?`blur(${(1-whip)*26}px)`:undefined}}>
  <Camera t={t} zoom={1.02+push*.24} x={(1-whip)*700} y={-80*push} rot={(1-whip)*-6} shake={7} seed={77}><Stage>
   <WindowWall id="proof" t={t} mode="night" cloudCover={.6} billow={.18+opening*2} open={opening} outside={
    <Hand id="outside" x={WIN.cx-120} y={mix(SILL_Y-230,SILL_Y-135,push)} rot={6} scale={1.5} style={STYLES.creature} pose={lerpPose(POSES.flat,POSES.claw,curl)} light={.7} showSleeve={false}/>
   }/>
  </Stage></Camera>
 </AbsoluteFill>;
};
