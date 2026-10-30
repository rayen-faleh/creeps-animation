import React from 'react';
import {ProjectedMirror,SpatialStairs,MirrorPose} from './ProjectedMirror';
import {Wall,Floor} from '../art/Room';
import {Candle,Mirror} from '../art/Props';
import {PointedWindow} from './RabenfelsTown';

/** Identical stair architecture is used for the real view and its mirrored view. */
export const LandingStairs:React.FC<{id:string;t:number;front?:boolean}>=({id,t,front=false})=>front?<g>
 <path d="M610,1060 L1170,649" fill="none" stroke="#171514" strokeWidth={27} strokeLinecap="round"/><path d="M610,1050 L1170,638" fill="none" stroke="#9c7956" strokeOpacity={.64} strokeWidth={6}/>
 {[0,1,2,3,4,5,6,7].map(i=><g key={i}><path d={`M${615+i*74},${1060-i*54} V${1225-i*54}`} stroke="#211b18" strokeWidth={18}/><path d={`M${611+i*74},${1060-i*54} V${1215-i*54}`} stroke="#927252" strokeOpacity={.33} strokeWidth={3}/></g>)}
 <path d="M599,1270 L599,1002 L624,988 L644,1002 V1252Z" fill="#2e241d" stroke="#8e7452" strokeOpacity={.42} strokeWidth={4}/><path d="M594,1008 L647,1008 L647,980 L620,968 L594,980Z" fill="#4e3c2a"/>
</g>:<g id={id}>
 <path d="M567,1277 L1175,826 L1270,875 L687,1350Z" fill="#1c1b1d"/>
 {[0,1,2,3,4,5,6,7,8].map(i=>{const x=592+i*74,y=1245-i*54;return <g key={i}><path d={`M${x},${y} L${x+203},${y} L${x+259},${y-40} L${x+56},${y-40}Z`} fill={i%2?'#493b30':'#42352c'} stroke="#100f10" strokeWidth={4}/><path d={`M${x},${y} H${x+203} V${y+36} H${x}Z`} fill="#2a2522" stroke="#171516" strokeWidth={3}/><path d={`M${x+10},${y+3} H${x+190}`} stroke="#b08f65" strokeOpacity={.44} strokeWidth={3}/><path d={`M${x+69},${y-11} l56,-3`} stroke="#151313" strokeOpacity={.6} strokeWidth={3}/></g>;})}
 <path d="M1020,763 V330 Q1160,185 1300,330 V763Z" fill="#0a0d14" stroke="#3b3028" strokeWidth={20}/><path d="M1042,742 V340 Q1158,217 1275,340" fill="none" stroke="#95918b" strokeOpacity={.22} strokeWidth={4}/>
 <Candle x={991} y={718} s={.63} t={t}/><path d="M963,735 H1023 V752 H963Z" fill="#2a2523"/>
</g>;

/** Broken Bell's public stairs viewed from the counter; actors are separate precise SVG layers. */
export const TavernLanding:React.FC<{id:string;t:number;children?:React.ReactNode;foreground?:React.ReactNode;reflectionHuman?:React.ReactNode;reflectionPose?:MirrorPose}>=({id,t,children,foreground,reflectionHuman,reflectionPose})=><g>
 <Wall id={`${id}-wall`} x={-700} y={-600} w={3000} h={2700} warm={.25} lit={.8}/><Floor id={`${id}-floor`} x={-700} y={1320} w={3000} h={1000} lit={.64}/>
 <path d="M-500,160 L1700,340 M503,-400 L503,565 M1420,-400 V1600" stroke="#211b18" strokeWidth={70}/><path d="M-400,185 L1700,365 M481,-400 V530" stroke="#917459" strokeOpacity={.19} strokeWidth={5}/>
 <path d="M-200,1160 H590 M-200,1200 H589" stroke="#26201b" strokeWidth={40}/><path d="M20,550 l18,21 l-11,39 l18,23 M555,470 l-28,35 l10,35 l-21,37 M1300,930 l-45,26 l10,41" stroke="#756e63" strokeOpacity={.18} strokeWidth={4} fill="none"/>
 <PointedWindow x={-170} y={400} w={210} h={500}/><path d="M-210,383 L-185,1030 L-80,1030 L-120,393Z" fill="#350e18"/>
 <path d="M1020,763 V330 Q1160,185 1300,330 V763Z" fill="#0a0d14" stroke="#3b3028" strokeWidth={20}/><path d="M1042,742 V340 Q1158,217 1275,340" fill="none" stroke="#95918b" strokeOpacity={.22} strokeWidth={4}/><Candle x={991} y={718} s={.63} t={t}/><path d="M963,735 H1023 V752 H963Z" fill="#2a2523"/>
 <SpatialStairs/>
 <ProjectedMirror id={`${id}-mirror`} t={t} pose={reflectionPose}/>
 {children}
 <SpatialStairs front/>
 <path d="M-500,1354 L490,1354 L520,1450 H-500Z" fill="#4c3626" stroke="#161310" strokeWidth={7}/><path d="M-500,1450 H500 V2100 H-500Z" fill="#211b18"/><path d="M-400,1490 H446 V1870 H-400Z" fill="none" stroke="#6e5034" strokeOpacity={.32} strokeWidth={7}/>
 <Candle x={28} y={1339} s={.65} t={t}/>
 {foreground}
</g>;
