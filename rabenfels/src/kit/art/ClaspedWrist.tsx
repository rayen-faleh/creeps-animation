import React from 'react';
import {HeldArm,HeldArmProps} from './FriendProps';
import {mix} from '../util';

/** Organic wrist grasp. One shared transform keeps all contact surfaces locked during a pull. */
export const ClaspedWrist:React.FC<HeldArmProps>=(p)=>{
 const {id,x,y,s=1,rot=0,grip=.3,captor=true,light=.8}=p;
 const g=Math.max(0,Math.min(1,grip));
 return <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
  {captor&&<g>
   <path d="M-1000,570 C-670,410 -390,195 -159,99 L-132,210 C-350,288 -650,560 -1000,740Z" fill="#080b10"/>
   <path d="M-1000,570 C-670,410 -390,195 -159,99" stroke="#9fb4cf" strokeOpacity={light*.28} strokeWidth={3} fill="none"/>
   <path d="M-215,121 Q-149,77 -91,77 C-54,78 -26,97 -7,128 L-19,193 C-60,218 -110,236 -169,220Z" fill="#707985"/>
   <path d="M-207,124 Q-162,106 -120,107 Q-81,99 -49,119" fill="none" stroke="#c9d4e2" strokeOpacity={light*.28} strokeWidth={4}/>
  </g>}
  <HeldArm {...p} id={`${id}-human`} x={0} y={0} s={1} rot={0} captor={false}/>
  {captor&&<g>
   {/* Angled knuckles, unequal phalanges and tapered nails avoid the appearance of stacked bands. */}
   {[{y:58,len:70,w:24,ang:-11},{y:91,len:83,w:27,ang:-5},{y:127,len:72,w:25,ang:1},{y:164,len:49,w:21,ang:8}].map((f,i)=>{
    const end=f.len-g*(18+i*2);const k=f.y;const w=f.w;
    return <g key={i} transform={`rotate(${f.ang-g*2} -82 ${k})`}>
     <path d={`M-104,${k+3} C-72,${k-8} -37,${k-14} -6,${k-9} Q27,${k-14} ${end-9},${k-1} Q${end+9},${k+10} ${end-1},${k+w} Q${end-10},${k+w+8} ${end-22},${k+w-1} C8,${k+10} -36,${k+19} -96,${k+w+4}Z`} fill="#818a95" stroke="#343d4b" strokeWidth={2.5}/>
     <path d={`M-91,${k+2} Q-53,${k-9} -13,${k-3} Q18,${k-8} ${end-12},${k+2}`} stroke="#c9d4e2" strokeOpacity={light*.4} strokeWidth={3} fill="none"/>
     <path d={`M-92,${k+w} Q-35,${k+15} 4,${k+12} Q29,${k+11} ${end-19},${k+w-2}`} stroke="#495565" strokeWidth={6} strokeOpacity={.6} fill="none"/>
     <path d={`M${end-10},${k+7} Q${end+1},${k+5} ${end+6},${k+18} L${end-2},${k+w+5} Q${end-14},${k+w-3} ${end-10},${k+7}Z`} fill="#0c1018"/>
     <path d={`M-26,${k-6} q-5,5 -2,12 M8,${k-6} q-3,6 0,12`} stroke="#3c4654" strokeWidth={1.8} fill="none"/>
    </g>;
   })}
   <path d={`M-131,196 C-111,220 -75,233 -40,218 Q-10,203 ${27-g*12},177 Q${43-g*12},166 ${40-g*12},151 Q${31-g*12},138 ${17-g*12},153 C-11,181 -30,183 -55,180 Q-96,171 -131,196Z`} fill="#78828e" stroke="#343d4b" strokeWidth={2.5}/>
   <path d="M-112,199 Q-77,222 -43,206 Q-11,190 13,166" fill="none" stroke="#c9d4e2" strokeOpacity={light*.27} strokeWidth={3}/>
   <path d={`M${19-g*12},153 Q${32-g*12},145 ${36-g*12},157 L${29-g*12},172 Q${18-g*12},174 ${19-g*12},153Z`} fill="#121621"/>
   <path d="M-211,123 Q-198,161 -168,219 L-195,230 Q-225,185 -238,137Z" fill="#171d27"/>
   <path d="M-211,123 Q-198,161 -168,219" fill="none" stroke="#9fb4cf" strokeOpacity={light*.24} strokeWidth={3}/>
   <path d="M-186,143 Q-153,139 -133,155 Q-115,166 -100,158 M-152,143 Q-158,163 -143,183" stroke="#465368" strokeWidth={2} opacity={.55} fill="none"/>
  </g>}
 </g>;
};
