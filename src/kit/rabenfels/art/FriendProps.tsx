import React from 'react';
import {Hand, HandPose, POSES, STYLES, lerpPose} from './Hand';
import {mix, noise1} from '../util';

/** Threshold shoes, pointing into the room; soles stay planted until an authored step. */
export const VisitorShoes:React.FC<{id:string;t:number;x:number;y:number;s?:number;step?:number;warm?:boolean}>=({id,t,x,y,s=1,step=0,warm=false})=>{
 const rim=warm?'#ffb45a':'#9fb4cf';
 return <g id={id} transform={`translate(${x},${y}) scale(${s})`}>
  {[-1,1].map((side,i)=>{
   const lift=Math.sin(Math.min(1,Math.max(0,step*2-i*.55))*Math.PI)*17;
   const forward=Math.max(0,Math.min(1,step*2-i*.55))*105;
   return <g key={i} transform={`translate(${side*72},${forward-lift}) rotate(${side*-5})`}>
    <path d="M-35,-270 L35,-270 L40,-60 L-39,-60 Z" fill="#0a0b0f"/>
    <path d="M-35,-265 L-39,-70" fill="none" stroke={rim} strokeOpacity={.23} strokeWidth={3}/>
    <path d="M-38,-95 Q-45,-30 -54,10 Q-63,58 -45,72 Q-18,87 35,75 Q61,68 56,42 L39,-80 Q9,-111 -38,-95Z" fill="#111015" stroke="#030305" strokeWidth={4}/>
    <path d="M-47,15 Q-51,56 -35,60 Q-8,70 40,61" fill="none" stroke={rim} strokeOpacity={.28} strokeWidth={3}/>
    <path d="M-30,-65 Q0,-75 30,-61 L34,-20 Q0,-30 -35,-19Z" fill="#19181d"/>
    {[-51,-34,-17].map((v,j)=><path key={j} d={`M-22,${v} L22,${v+6}`} stroke="#48454a" strokeWidth={3} opacity={.65}/>)}
    <path d="M-45,73 Q8,92 53,69 L53,82 Q0,103 -45,86Z" fill="#050507"/>
   </g>;
  })}
 </g>;
};

/** Brass bedside lamp. Pull-chain and bulb level are controlled by scene contact anchors. */
export const BedsideLamp:React.FC<{id:string;t:number;x:number;y:number;s?:number;on?:number;pull?:number}>=({id,t,x,y,s=1,on=0,pull=0})=>{
 const flick=.94+noise1(t*8,91)*.06;
 return <g transform={`translate(${x},${y}) scale(${s})`}>
  <defs><radialGradient id={`${id}-glow`}><stop offset="0" stopColor="#ffc976" stopOpacity={on*.32*flick}/><stop offset="1" stopColor="#ffc976" stopOpacity={0}/></radialGradient></defs>
  <ellipse cx={0} cy={-255} rx={390} ry={470} fill={`url(#${id}-glow)`}/>
  <ellipse cx={0} cy={0} rx={105} ry={20} fill="#181514" stroke="#8190a5" strokeOpacity={.22} strokeWidth={3}/>
  <path d="M-76,-8 Q-72,-30 -21,-38 L-13,-260 L13,-260 L21,-38 Q72,-30 76,-8Z" fill="#493b24"/>
  <path d="M-13,-38 L-13,-255" stroke="#bba476" strokeOpacity={.38} strokeWidth={4}/>
  <path d="M-72,-400 L72,-400 L155,-220 Q0,-184 -155,-220Z" fill={on>.1?'#9e8055':'#29303c'} stroke="#0b0c12" strokeWidth={4}/>
  <path d="M-72,-400 L-155,-220 Q0,-184 155,-220" fill="none" stroke={on>.1?'#ffd9a0':'#9fb4cf'} strokeOpacity={.45} strokeWidth={3}/>
  <ellipse cx={0} cy={-220} rx={150} ry={21} fill={on>.1?'#e8bc76':'#12141d'}/>
  <path d="M78,-215 L78,-110" stroke="#b9a476" strokeOpacity={.7} strokeWidth={3}/>
  <g transform={`translate(0,${pull*16})`}><path d="M78,-110 L78,-82" stroke="#c7b17e" strokeWidth={3}/><circle cx={78} cy={-76} r={8} fill="#bca77a"/></g>
 </g>;
};

/** Shared state of the held arm. Captor is an optional layer, so mirrors omit it without changing pose. */
export type HeldArmProps={id:string;t:number;x:number;y:number;s?:number;rot?:number;grip?:number;captor?:boolean;pose?:HandPose;light?:number};
export const HeldArm:React.FC<HeldArmProps>=({id,t,x,y,s=1,rot=0,grip=.3,captor=true,pose=POSES.relaxed,light=.8})=>{
 const rim='#c5d2e4';const skin=STYLES.adult.skin;
 const gv=Math.max(0,Math.min(1,grip));
 const squeeze=gv*5;
 return <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
  {captor&&<g>
   <path d="M-1000,460 C-740,390 -510,175 -185,76 L-180,211 C-400,270 -720,620 -1000,650Z" fill="#0b0c10"/>
   <path d="M-1000,460 C-740,390 -510,175 -185,76" stroke="#8295ae" strokeOpacity={.23*light} strokeWidth={3} fill="none"/>
   <path d="M-202,80 Q-146,45 -91,72 Q-65,88 -39,107 L-31,185 Q-90,234 -187,207Z" fill="#757d89"/>
  </g>}
  <path d={`M-39,53 C${-45+squeeze},140 ${-43+squeeze},220 -60,340 L60,340 C${43-squeeze},220 ${45-squeeze},140 38,53Z`} fill={skin}/>
  <path d="M-39,53 C-45,140 -43,220 -60,340" fill="none" stroke={rim} strokeOpacity={.36*light} strokeWidth={4}/>
  <path d="M32,57 C38,170 28,230 39,320" fill="none" stroke="#4c3a31" strokeWidth={16} strokeOpacity={.65}/>
  <path d="M-62,300 Q0,319 61,299 L109,950 L-122,950Z" fill="#121720"/>
  <path d="M-63,300 Q0,320 62,300 L64,334 Q0,356 -65,334Z" fill="#232b37"/>
  <path d="M-63,300 Q0,320 62,300" fill="none" stroke={rim} strokeOpacity={.22*light} strokeWidth={3}/>
  <Hand id={`${id}-hand`} x={0} y={0} style={STYLES.adult} pose={pose} light={light} showSleeve={false}/>
  {captor&&<g>
   {/* Four fingers curl across the same forearm contact band. Their roots stay attached to the palm. */}
   {[0,1,2,3].map(i=>{
    const fy=69+i*30;const end=mix(82,48,gv)-[6,0,3,12][i];
    return <g key={i}>
     <path d={`M-104,${fy+2} C-66,${fy-10} -21,${fy-14} ${end-18},${fy-6} C${end+1},${fy-4} ${end+16},${fy+8} ${end+9},${fy+21} Q${end+2},${fy+33} ${end-12},${fy+25} C8,${fy+13} -40,${fy+24} -99,${fy+29}Z`} fill="#8d939b" stroke="#3c4048" strokeWidth={3}/>
     <path d={`M-85,${fy+2} Q-18,${fy-9} ${end-12},${fy+1}`} fill="none" stroke="#c9d4e2" strokeOpacity={.32*light} strokeWidth={3}/>
     <path d={`M${end-1},${fy+8} Q${end+24+gv*7},${fy+17} ${end+7},${fy+31} L${end-9},${fy+24} Q${end-9},${fy+15} ${end-1},${fy+8}Z`} fill="#0c0d10"/>
     <path d={`M2,${fy-3} q-6,9 1,16`} fill="none" stroke="#3c4048" strokeWidth={2}/>
    </g>;
   })}
   {/* Opposing thumb closes under the finger band. */}
   <path d={`M-110,208 C-72,241 -32,227 ${35-gv*12},195 Q${53-gv*12},177 ${36-gv*12},166 Q20,159 5,180 C-34,200 -60,196 -88,180Z`} fill="#838b97" stroke="#3c4048" strokeWidth={3}/>
   <path d="M-87,208 Q-42,224 5,194" stroke="#c9d4e2" strokeOpacity={.25*light} strokeWidth={3} fill="none"/>
   <path d="M-198,73 Q-191,144 -184,213 L-223,218 Q-235,130 -233,73Z" fill="#1b2029"/>
   <path d="M-198,73 Q-191,144 -184,213" stroke="#9fb4cf" strokeOpacity={.27*light} strokeWidth={3} fill="none"/>
  </g>}
 </g>;
};
