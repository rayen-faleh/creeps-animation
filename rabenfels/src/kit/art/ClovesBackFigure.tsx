import React from 'react';
import {mix,noise1} from '../util';
import {WatchLantern} from './ClovesProps';
type V=[number,number];
const joint=(a:V,b:V):V=>{
 const dx=b[0]-a[0],dy=b[1]-a[1],raw=Math.hypot(dx,dy)||1,d=Math.min(289.99,Math.max(6.01,raw)),u=(142*142-148*148+d*d)/(2*d),h=Math.sqrt(Math.max(0,142*142-u*u));
 return [a[0]+dx/raw*u+dy/raw*h,a[1]+dy/raw*u-dx/raw*h];
};
/** Rear artwork for the same recruit, using the same wrist targets and head-turn clock. */
export const ClovesBackFigure:React.FC<{t:number;hand:V;otherHand:V;turn:number}>=({t,hand,otherHand,turn})=>{
 const arm=(a:V,b:V)=>{const e=joint(a,b);return <g><path d={`M${a} L${e} L${b}`} fill="none" stroke="#10151c" strokeWidth={69} strokeLinecap="round" strokeLinejoin="round"/><path d={`M${a} L${e} L${b}`} fill="none" stroke="#2a3741" strokeWidth={59} strokeLinecap="round" strokeLinejoin="round"/><path d={`M${e[0]-9},${e[1]-4} L${b[0]-9},${b[1]-5}`} fill="none" stroke="#899083" strokeOpacity={.22} strokeWidth={4}/><ellipse cx={b[0]} cy={b[1]} rx={25} ry={20} fill="#a68b72"/></g>;};
 const breathe=noise1(t*.6,65)*1.3;
 return <g>
  <path d="M-91,-8 L-96,253 L-48,280 L-16,266 L-5,28 L31,273 L91,279 L103,241 L91,-8Z" fill="#242b31" stroke="#10151d" strokeWidth={5}/>
  <path d="M-91,247 L-98,282 L-143,294 Q-156,309 -137,314 H-24 V275 M35,271 V313 H147 Q161,302 109,284 L100,247Z" fill="#0b0e14" stroke="#73777b" strokeOpacity={.3} strokeWidth={3}/>
  <g transform={`translate(0,${breathe})`}>
   {arm([-74,-280],hand)}{arm([67,-274],otherHand)}
   <WatchLantern id="back-lantern" t={t} x={otherHand[0]} y={otherHand[1]+70} s={.73}/>
   <path d="M-72,-340 Q-123,-322 -127,-235 L-106,26 Q0,64 110,22 L118,-233 Q124,-323 61,-342Z" fill="#2a3741" stroke="#0b0e14" strokeWidth={5}/>
   <path d="M-98,-257 L-88,-88 M91,-267 L93,-91 M-1,-313 V15" stroke="#748077" strokeOpacity={.22} strokeWidth={5}/>
   <path d="M-61,-337 L-33,-352 L87,23 L46,34Z" fill="#877452" stroke="#ab9771" strokeOpacity={.3} strokeWidth={3}/>
   <path d="M-109,-51 L107,-51 V-19 H-109Z" fill="#302820"/>
   <path d="M-29,-387 L-28,-330 Q0,-309 32,-337 L29,-390Z" fill="#826553"/>
   <g transform={`rotate(${mix(-2,3,turn)} 0 -430) translate(${mix(-8,0,turn)},0) scale(${mix(.86,1,turn)},1)`}>
    <ellipse cx={-62} cy={-429} rx={11} ry={21} fill="#b4977c" stroke="#6c5143" strokeWidth={3}/><ellipse cx={54} cy={-430} rx={10} ry={20} fill="#a88a70" stroke="#6c5143" strokeWidth={3}/>
    <path d="M-54,-499 Q-11,-538 39,-507 Q68,-481 54,-427 L32,-376 Q7,-356 -23,-368 L-57,-405 Q-73,-463 -54,-499Z" fill="#9d8068" stroke="#6c5143" strokeWidth={3}/>
    <path d="M-59,-475 Q-77,-522 -31,-538 Q12,-550 50,-521 Q71,-499 56,-462 L43,-395 L20,-384 L4,-393 L-15,-380 L-37,-393 L-58,-420Z" fill="#2c2521"/>
    <path d="M-49,-454 q17,10 11,32 M-8,-462 q24,21 8,47 M24,-455 q24,18 10,39" fill="none" stroke="#5c4838" strokeOpacity={.55} strokeWidth={4}/>
    <path d="M-69,-491 Q-8,-524 60,-489 L51,-513 Q1,-538 -61,-513Z" fill="#263440" stroke="#7e8279" strokeOpacity={.35} strokeWidth={3}/><path d="M-60,-505 Q0,-521 53,-503" fill="none" stroke="#8f7d54" strokeWidth={6}/>
   </g>
  </g>
 </g>;
};
