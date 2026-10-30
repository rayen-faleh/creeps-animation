import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage, Eyelids} from '../../../kit/fx';
import {DoorWall} from '../../../kit/sets/DoorWall';
import {WindowWall} from '../../../kit/sets/WindowWall';
import {GothicWindow} from '../../../kit/art/Window';
import {Mirror} from '../../../kit/art/Props';
import {Wall,Floor} from '../../../kit/art/Room';
import {Hand,POSES,STYLES,lerpPose,wristFor} from '../../../kit/art/Hand';
import {VisitorShoes,BedsideLamp,HeldArm} from '../../../kit/art/FriendProps';
import {easeIn,easeOut,mix,noise1,prog,track} from '../../../kit/util';
import E from '../events.json';

/** Opening begins in motion: the ring never lifts, but the door opens by itself. */
export const Opening:React.FC<{t:number}>=({t})=> <Camera t={t} zoom={1.04+t*.02} y={-10} shake={5} seed={101}><Stage>
 <DoorWall id="opening" t={t} mode="night" open={mix(.025,.41,prog(t,0,2.8,easeOut))} under={.18} underColor="#9fb4cf"/>
</Stage></Camera>;

/** Warm threshold memory. No visitor face: only planted shoes waiting for permission. */
export const ThresholdMemory:React.FC<{t:number}>=({t})=>{
 const low=prog(t,4.7,5.5,easeOut);
 const beckon=prog(t,E.beckon,E.invitation+.35,easeOut);
 const enter=prog(t,E.enter,12.7,easeIn);
 const swing=prog(t,E.invitation,E.invitation+.75,easeOut);
 const pose=lerpPose(POSES.reach,POSES.relaxed,beckon);
 return <Camera t={t} zoom={mix(1.02,1.13,low)} y={mix(190,465,low)} shake={3} seed={103}><Stage>
  <DoorWall id="memory" t={t} mode="candle" open={mix(.72,.91,swing)} under={.12} beyond={
   <g><rect x={240} y={-20} width={700} height={1700} fill="#08090e"/>
    <path d="M240,1500 L240,1400 L950,1400 L950,1500Z" fill="#171a21"/>

   </g>
  }>
   <VisitorShoes id="visitor" t={t} x={650} y={1420+enter*300} s={1+enter*.16} step={enter} warm/>
   <path d="M230,1506 L890,1506" stroke="#ffc17b" strokeWidth={7} strokeOpacity={.5}/>
   {t>=E.beckon&&<Hand id="welcome" x={mix(1140,830,beckon)} y={mix(1850,1420,beckon)} rot={mix(28,-20,beckon)} scale={1.2} style={STYLES.adult} pose={pose} light={.85}/>}
  </DoorWall>
 </Stage></Camera>;
};

export const UninvitedEntry:React.FC<{t:number}>=({t})=>{
 const u=prog(t,E.coldEntry,E.blackWake,easeOut);
 return <Camera t={t} zoom={1.1+u*.06} y={40} shake={5} seed={107}><Stage>
  <DoorWall id="later" t={t} mode="night" open={mix(.035,.6,u)} under={mix(.4,0,u)} underColor="#9fb4cf"/>
 </Stage></Camera>;
};

/** Held wrist is the single state authority for real and reflected arms. */
export const armState=(t:number)=>{
 const awake=prog(t,E.wake+.25,E.wake+1.6,easeOut);
 const fear=prog(t,E.alone-.2,E.alone+1.2,easeOut);
 const tighten=prog(t,E.tighten,E.cut,easeIn);
 const resist=prog(t,E.held,E.held+.22,easeOut);
 const tremble=(t>E.held?2.2:0)*noise1(t*18,116);
 return {
  x:mix(805,860,prog(t,E.glance,E.mirror+.5,easeOut))+tremble,
  y:mix(1140,980,awake)-resist*12+tighten*13,
  rot:mix(7,-2,awake)+fear*7+tighten*-6,
  grip:.25+resist*.17+tighten*.5,
  pose:lerpPose(POSES.relaxed,POSES.claw,fear*.7),
 };
};

const BedroomWorld:React.FC<{t:number;glance:number;light:number}>=({t,glance,light})=>{
 const a=armState(t);
 return <svg width={2200} height={1920} viewBox="0 0 2200 1920" style={{position:'absolute',left:0,top:0}}>
  <Wall id="bed-wall" x={-600} y={-600} w={3400} h={2200} lit={.64}/>
  <Floor id="bed-floor" x={-600} y={1500} w={3400} h={800} lit={.5}/>
  <GothicWindow id="bed-window" cx={1580} yb={1190} w={500} h={1080} t={t} light="night" cloudCover={.45} treeSway={1}/>
  <path d="M1300,-400 L1300,1500 L1420,1500 Q1380,600 1410,-400Z" fill="#210c10"/>
  <path d="M1860,-400 L1860,1500 L1750,1500 Q1790,600 1760,-400Z" fill="#210c10"/>
  <path d="M1380,-300 Q1340,600 1390,1470 M1810,-300 Q1850,600 1790,1470" fill="none" stroke="#4a222a" strokeOpacity={.35} strokeWidth={6}/>
  <Mirror id="bed-mirror" x={140} y={300} w={740} h={960} lit={.8+light*.15}>
   <rect x={0} y={0} width={740} height={960} fill="#060a11"/>
   <g transform="translate(370,430) scale(.43) translate(-540,-850)"><WindowWall id="reflection-room" t={t} mode="night" beam={.5} cloudCover={.6}/></g>
   {/* Same arm articulation and movement, mirrored, with only the vampire omitted. No face in frame. */}
   <g transform="translate(740,0) scale(-1,1)">
    <HeldArm id="reflected-arm" t={t} x={350+(a.x-805)*.65} y={510+(a.y-980)*.65} s={.84} rot={a.rot} grip={a.grip} pose={a.pose} captor={false} light={.75+light*.15}/>
   </g>
   <rect x={0} y={0} width={740} height={960} fill="#8fa3c0" opacity={.025}/>
  </Mirror>
  <path d="M930,1120 L1380,1120 L1410,1190 L900,1190Z" fill="#241b17" stroke="#080809" strokeWidth={5}/>
  <path d="M938,1190 L958,1800 L1010,1800 L1010,1190 M1330,1190 L1312,1800 L1364,1800 L1380,1190" fill="#100e10"/>
  <BedsideLamp id="lamp" t={t} x={1140} y={1120} s={1.05} on={light} pull={prog(t,E.lampContact,E.lampOn)* (1-prog(t,E.lampOn,E.lampOn+.2))}/>
  <path d="M-600,1690 Q700,1610 1700,1720 L2200,1920 L-600,1920Z" fill="#151d2d"/>
  <path d="M-600,1690 Q700,1610 1700,1720" stroke="#6d7e98" strokeOpacity={.3} strokeWidth={5} fill="none"/>
 </svg>;
};

/** A continuous look from the lamp to the mirror. Foreground grip stays contact-locked. */
export const Bedroom:React.FC<{t:number}>=({t})=>{
 const glance=prog(t,E.glance,E.mirror+.35,easeOut);
 const light=prog(t,E.lampOn,E.lampOn+.14,easeOut);
 const a=armState(t);
 const lift=prog(t,E.lampReach,E.lampContact,easeOut);
 const retreat=prog(t,E.held+.05,E.held+.35,easeOut);
 const pose=lerpPose(lerpPose(POSES.relaxed,POSES.point,lift),POSES.fist,retreat);
 const contactY=1040.2+prog(t,E.lampContact,E.lampOn)*16*(1-prog(t,E.lampOn,E.lampOn+.2));
 // Lamp chain at world (1221.9,1040.2), camera x=800 => screen x=421.9.
 const [hx,hy]=wristFor(421.9,contactY,-16,1.15,STYLES.adult,pose,true);
 const eyelid=track(t,[[E.wake,0],[E.wake+.30,.55],[E.wake+.55,.45],[E.wake+.9,.8],[E.wake+1.1,.2],[E.wake+1.45,.98]]);
 const cameraProps={t,zoom:1,x:mix(800,0,glance),shake:t<E.held?5:6,rot:mix(1.5,-.4,glance),seed:109};
 return <AbsoluteFill>
  <Camera {...cameraProps}>
   <BedroomWorld t={t} glance={glance} light={light}/>
  </Camera>
  <Stage>
   <HeldArm id="held" t={t} x={a.x} y={a.y} s={1.05} rot={a.rot} grip={a.grip} pose={a.pose} light={.65+light*.3}/>
  </Stage>
  {t>=E.lampReach&&t<E.glance+.3&&<Camera {...cameraProps}><svg width={2200} height={1920} viewBox="0 0 2200 1920" style={{position:'absolute',left:0,top:0}}><Hand id="lamp-hand" x={mix(120,hx,lift)+800-retreat*180} y={mix(2150,hy,lift)+retreat*350} rot={-16-retreat*15} scale={1.15} mirror style={STYLES.adult} pose={pose} light={.7+light*.2}/></svg></Camera>}
  {t<E.wake+1.5&&<Eyelids open={eyelid}/>}
 </AbsoluteFill>;
};

/** Final direct view confirms the physical grip after its absence in the mirror. */
export const Tightening:React.FC<{t:number}>=({t})=>{
 const a=armState(t);
 const push=prog(t,E.tighten,E.cut,easeIn);
 return <AbsoluteFill>
  <AbsoluteFill style={{filter:'blur(6px)',opacity:.5}}><Camera t={t} x={0} shake={3} seed={113}><BedroomWorld t={t} glance={1} light={1}/></Camera></AbsoluteFill>
  <Camera t={t} zoom={1.05+push*.09} shake={6} seed={119}><Stage>
   <HeldArm id="final-grip" t={t} x={690+noise1(t*23,114)*2} y={850+push*12} s={1.7} rot={a.rot-8} grip={a.grip} pose={a.pose} light={.95}/>
  </Stage></Camera>
 </AbsoluteFill>;
};
