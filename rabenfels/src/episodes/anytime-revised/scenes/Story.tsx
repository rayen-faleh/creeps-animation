import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage, Eyelids} from '../../../kit/fx';
import {DoorWall} from '../../../kit/sets/DoorWall';
import {WindowWall} from '../../../kit/sets/WindowWall';
import {GothicWindow} from '../../../kit/art/Window';
import {Mirror} from '../../../kit/art/Props';
import {Wall,Floor} from '../../../kit/art/Room';
import {Hand,POSES,STYLES,lerpPose,wristFor} from '../../../kit/art/Hand';
import {VisitorShoes,BedsideLamp} from '../../../kit/art/FriendProps';
import {ClaspedWrist as HeldArm} from '../../../kit/art/ClaspedWrist';
import {MoonBeam} from '../../../kit/art/Room';
import {Clock} from '../../../kit/art/Props';
import {easeIn,easeOut,mix,noise1,prog,track} from '../../../kit/util';
import E from '../events.json';

/** Opening begins in motion: the ring never lifts, but the door opens by itself. */
export const Opening:React.FC<{t:number}>=({t})=> <Camera t={t} zoom={1.35+t*.035} x={55} y={190} shake={5} seed={101}><Stage>
 <DoorWall id="opening" t={t} mode="night" beam={1.5} open={mix(.08,.61,prog(t,0,E.memory,easeOut))} under={.5} underColor="#9fb4cf"/>
</Stage></Camera>;

/** Warm threshold memory. No visitor face: only planted shoes waiting for permission. */
export const ThresholdMemory:React.FC<{t:number}>=({t})=>{
 const low=prog(t,E.memory+.8,E.openDoor+.25,easeOut);
 const beckon=prog(t,E.beckon,E.enter+.2,easeOut);
 const enter=prog(t,E.enter,E.coldEntry-.15,easeIn);
 const swing=prog(t,E.invitation,E.invitation+.75,easeOut);
 const pose=lerpPose(POSES.reach,POSES.relaxed,beckon);
 return <Camera t={t} zoom={mix(1.06,1.18,low)} y={mix(220,480,low)} shake={3} seed={103}><Stage>
  <DoorWall id="memory" t={t} mode="candle" open={mix(.72,.91,swing)} under={.12} beyond={
   <g><rect x={240} y={-20} width={700} height={1700} fill="#08090e"/>
    <path d="M240,1500 L240,1400 L950,1400 L950,1500Z" fill="#171a21"/>

   </g>
  }>
   <VisitorShoes id="visitor" t={t} x={650} y={1420+enter*300} s={1+enter*.16} step={enter} warm/>
   <path d="M230,1506 L890,1506" stroke="#ffc17b" strokeWidth={7} strokeOpacity={.5}/>
   {t>=E.beckon&&<Hand id="welcome" x={mix(1140,820,beckon)} y={mix(1850,1390,beckon)} rot={mix(28,-20,beckon)} scale={1.2} style={STYLES.adult} pose={pose} light={.85}/>}
  </DoorWall>
 </Stage></Camera>;
};

export const UninvitedEntry:React.FC<{t:number}>=({t})=>{
 const u=prog(t,E.coldEntry,E.blackWake,easeOut);
 return <Camera t={t} zoom={1.28+u*.16} y={180} x={30} shake={5} seed={107}><Stage>
  <DoorWall id="later" t={t} mode="night" open={mix(.035,.6,u)} under={mix(.4,0,u)} underColor="#9fb4cf"/>
 </Stage></Camera>;
};

/** Held wrist is the single state authority for real and reflected arms. */
export const armState=(t:number)=>{
 const awake=prog(t,E.wake+.25,E.wake+1.6,easeOut);
 const fear=prog(t,E.alone-.2,E.alone+1.2,easeOut);
 const recognition=prog(t,E.voice-.45,E.voice+.7,easeOut);
 const recoil=track(t,[[E.voice-.1,0],[E.voice+.14,-13],[E.voice+.5,-4]]);
 const tighten=prog(t,E.tighten,E.cut,easeIn);
 const resist=prog(t,E.held,E.held+.22,easeOut);
 const tremble=(t>E.held?2.2:0)*noise1(t*18,116);
 return {
  x:mix(810,875,prog(t,E.glance,E.mirror+.5,easeOut))+tremble,
  y:mix(1140,950,awake)-resist*12+tighten*13+recoil,
  rot:mix(9,-8,awake)+fear*9+tighten*-12,
  grip:.15+recognition*.08+resist*.16+tighten*.56,
  pose:lerpPose(POSES.relaxed,POSES.claw,recognition*.25+fear*.5),
 };
};

const BedroomWorld:React.FC<{t:number;glance:number;light:number}>=({t,glance,light})=>{
 const a=armState(t);
 return <svg width={2200} height={1920} viewBox="0 0 2200 1920" style={{position:'absolute',left:0,top:0}}>
  <Wall id="bed-wall" x={-600} y={-600} w={3400} h={2200} lit={.77}/>
  <Floor id="bed-floor" x={-600} y={1500} w={3400} h={800} lit={.5}/>
  <GothicWindow id="bed-window" cx={1580} yb={1190} w={500} h={1080} t={t} light="night" cloudCover={.45} treeSway={1}/>
  <path d="M1300,-400 L1300,1500 L1420,1500 Q1380,600 1410,-400Z" fill="#210c10"/>
  <path d="M1860,-400 L1860,1500 L1750,1500 Q1790,600 1760,-400Z" fill="#210c10"/>
  <path d="M1380,-300 Q1340,600 1390,1470 M1810,-300 Q1850,600 1790,1470" fill="none" stroke="#4a222a" strokeOpacity={.35} strokeWidth={6}/>
  <MoonBeam id="bed-beam" t={t} poly="1450,240 1830,800 800,1900 300,1900" bounds={[300,200,1530,1700]} dust={34} opacity={.045}/>
  <Mirror id="bed-mirror" ageSpots={false} x={90} y={240} w={740} h={1040} lit={.85+light*.15}>
   <rect x={0} y={0} width={740} height={1040} fill="#060a11"/>
   <g transform="translate(370,430) scale(.43) translate(-540,-850)"><WindowWall id="reflection-room" t={t} mode="night" beam={.5} cloudCover={.6}/></g>
   {/* Same arm articulation and movement, mirrored, with only the vampire omitted. No face in frame. */}
   <g transform="translate(740,0) scale(-1,1)">
    <HeldArm id="reflected-arm" t={t} x={400+(a.x-810)*.75} y={620+(a.y-950)*.75} s={1.16} rot={a.rot} grip={a.grip} pose={a.pose} captor={false} light={.75+light*.15}/>
   </g>
   <rect x={0} y={0} width={740} height={1040} fill="#8fa3c0" opacity={.025}/>
  </Mirror>
  <ellipse cx={1130} cy={1070} rx={420} ry={450} fill="#ffc976" opacity={light*.035}/>
  <path d="M930,1120 L1380,1120 L1410,1190 L900,1190Z" fill="#241b17" stroke="#080809" strokeWidth={5}/>
  <path d="M938,1190 L958,1800 L1010,1800 L1010,1190 M1330,1190 L1312,1800 L1364,1800 L1380,1190" fill="#100e10"/>
  <BedsideLamp id="lamp" t={t} x={1140} y={1120} s={1.05} on={light} pull={prog(t,E.lampContact,E.lampOn)* (1-prog(t,E.lampOn,E.lampOn+.2))}/>
  <Clock x={1020} y={1100} s={.38} t={t} lit={.6+light*.3}/>
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
 const lean=track(t,[[E.wake,0],[E.wake+2.8,0],[E.voice-.2,1],[E.voice+1.7,1],[E.lampReach,0]]);
 const cameraProps={t,zoom:1+prog(t,E.mirror,E.alone+.5)*.035,x:mix(800,0,glance),shake:t<E.held?5:6,rot:mix(1.5,-.4,glance),seed:109};
 return <AbsoluteFill style={{transform:`scale(${1+lean*.13})`,transformOrigin:'73% 49%'}}>
  <Camera {...cameraProps}>
   <BedroomWorld t={t} glance={glance} light={light}/>
  </Camera>
  <Stage>
   <HeldArm id="held" t={t} x={a.x} y={a.y} s={1.16} rot={a.rot} grip={a.grip} pose={a.pose} light={.72+light*.27}/>
  </Stage>
  {t>=E.lampReach&&t<E.glance+.3&&<Camera {...cameraProps}><svg width={2200} height={1920} viewBox="0 0 2200 1920" style={{position:'absolute',left:0,top:0}}><Hand id="lamp-hand" x={mix(120,hx,lift)+800-retreat*180} y={mix(2150,hy,lift)+retreat*350} rot={-16-retreat*15} scale={1.15} mirror style={STYLES.adult} pose={pose} light={.7+light*.2}/></svg></Camera>}
  {t<E.wake+1.5&&<Eyelids open={eyelid}/>}
 </AbsoluteFill>;
};

/** Anticipation, contact-locked pull and a camera recoil. Cut before the outcome. */
export const Tightening:React.FC<{t:number}>=({t})=>{
 const a=armState(t);
 const squeeze=prog(t,E.tighten,E.pull,easeOut);
 const pull=prog(t,E.pull,E.cut,easeIn);
 return <AbsoluteFill>
  <AbsoluteFill style={{filter:'blur(5px)',opacity:.45}}><Camera t={t} x={-pull*240} y={pull*120} rot={-pull*9} shake={3} seed={113}><BedroomWorld t={t} glance={1} light={1}/></Camera></AbsoluteFill>
  <Camera t={t} zoom={1.03+squeeze*.04+pull*.12} rot={pull*-7} shake={5} seed={119}><Stage>
   <HeldArm id="final-grip" t={t} x={680-pull*230+noise1(t*23,114)*2} y={820-pull*145} s={1.6} rot={-10-squeeze*6-pull*22} grip={.4+squeeze*.55} pose={lerpPose(POSES.claw,POSES.reach,pull)} light={.95}/>
  </Stage></Camera>
 </AbsoluteFill>;
};
