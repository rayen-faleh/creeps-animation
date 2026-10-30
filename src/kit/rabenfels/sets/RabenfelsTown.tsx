import React from 'react';
import {staticFile} from 'remotion';
import {noise1,rng} from '../util';

export const PointedWindow:React.FC<{x:number;y:number;w?:number;h?:number;lit?:boolean}>=({x,y,w=80,h=145,lit=false})=><g><path d={`M${x},${y+h} V${y+w*.65} Q${x},${y+w*.25} ${x+w/2},${y} Q${x+w},${y+w*.25} ${x+w},${y+w*.65} V${y+h}Z`} fill={lit?'#7e6039':'#0c1522'} stroke="#0c1016" strokeWidth={9}/><path d={`M${x+w/2},${y+20} V${y+h} M${x+4},${y+h*.58} H${x+w-4}`} fill="none" stroke={lit?'#211a15':'#364253'} strokeWidth={5}/><path d={`M${x+4},${y+h} V${y+w*.65} Q${x},${y+w*.25} ${x+w/2},${y+6}`} fill="none" stroke="#94a7be" strokeOpacity={.23} strokeWidth={3}/></g>;

export const TownHouse:React.FC<{id:string;x:number;y:number;w:number;h:number;lit?:boolean;roof?:number;warm?:boolean}>=({id,x,y,w,h,lit=false,roof=.47,warm=false})=><g>
 <path d={`M${x},${y} L${x+w*.49},${y-w*roof} L${x+w},${y}Z`} fill="#101927" stroke="#070c14" strokeWidth={7}/>
 {Array.from({length:7},(_,i)=>{const u=(i+1)/8;return <path key={i} d={`M${x+w*.5*(1-u)},${y-w*roof*(1-u)} L${x+w-w*.5*(1-u)},${y-w*roof*(1-u)}`} stroke="#71829b" strokeOpacity={.1} strokeWidth={2}/>;})}
 <path d={`M${x-18},${y+5} L${x+w*.49},${y-w*roof-13} L${x+w+18},${y+5}`} fill="none" stroke="#7f94af" strokeOpacity={.31} strokeWidth={7}/>
 <rect x={x} y={y} width={w} height={h} fill={warm?'#3b302b':'#2b3540'} stroke="#090e16" strokeWidth={7}/>
 <path d={`M${x+8},${y+16} H${x+w-8} M${x+w*.5},${y} V${y+h} M${x},${y+h*.45} H${x+w} M${x+5},${y+h*.45} L${x+w*.47},${y+h*.78} M${x+w-5},${y+h*.45} L${x+w*.55},${y+h*.78}`} stroke="#151b23" strokeWidth={16}/>
 <path d={`M${x+12},${y+22} V${y+h}`} fill="none" stroke="#a5b7c8" strokeOpacity={.15} strokeWidth={5}/>
 <PointedWindow x={x+w*.14} y={y+40} w={w*.22} h={h*.24} lit={lit}/><PointedWindow x={x+w*.64} y={y+40} w={w*.22} h={h*.24}/>
 <path d={`M${x+w*.3},${y+h} V${y+h*.67} Q${x+w*.5},${y+h*.46} ${x+w*.7},${y+h*.67} V${y+h}Z`} fill="#100f11" stroke="#0c1118" strokeWidth={9}/>
 <path d={`M${x+w*.5},${y+h*.59} V${y+h}`} stroke="#3b352e" strokeWidth={3}/><circle cx={x+w*.62} cy={y+h*.82} r={w*.014} fill="#8f8168"/>
 <rect x={x+w*.75} y={y-w*.36} width={w*.095} height={w*.27} fill="#26303c" stroke="#111720" strokeWidth={5}/>
</g>;

/** Stable town geography: church uphill, north forge left of square, western tavern right of view. */
export const TownStreet:React.FC<{id:string;t:number;dawn?:boolean;fork?:boolean;body?:boolean}>=({id,t,dawn=false,fork=false,body=false})=>{
 const r=rng(51);
 return <g>
  <image href={staticFile(`episodes/rabenfels-01/art/town-${dawn?'dawn':'night'}.png`)} x={-8} y={-8} width={1096} height={1940} preserveAspectRatio="xMidYMid slice"/>
  <defs><linearGradient id={`${id}-mist`} x2="0" y2="1"><stop stopColor="#b0c0cf" stopOpacity={0}/><stop offset=".5" stopColor="#9eb0bd" stopOpacity={dawn?.09:.035}/><stop offset="1" stopColor="#9eb0bd" stopOpacity={0}/></linearGradient></defs>
  <rect x={-300} y={850+noise1(t*.25,9)*16} width={1700} height={430} fill={`url(#${id}-mist)`}/>
  {Array.from({length:16},(_,i)=>{const x=100+r()*950,y=450+r()*950;return <circle key={i} cx={x+noise1(t*.35,i)*7} cy={y+noise1(t*.22,i+9)*7} r={.8+r()*1.3} fill="#d5e1eb" opacity={.11}/>;})}
  {body&&<g><ellipse cx={535} cy={1175} rx={200} ry={24} fill="#0b1016" opacity={.7}/><path d="M350,1157 Q365,1106 400,1096 Q428,1046 472,1090 Q511,1082 561,1122 Q636,1120 690,1157 L693,1191 L350,1191Z" fill="#a39d92" stroke="#514d4a" strokeWidth={4}/><path d="M441,1101 Q459,1135 445,1163 M507,1120 Q533,1140 522,1184 M589,1140 L610,1180" stroke="#615f5d" strokeWidth={5} fill="none"/><g fill="#17212c"><path d="M317,835 Q355,825 368,860 L390,1080 L298,1080Z"/><ellipse cx={340} cy={809} rx={25} ry={33}/><path d="M299,797 L381,797 L367,778 L316,778Z"/><path d="M701,811 Q738,801 752,836 L774,1075 L682,1075Z"/><ellipse cx={725} cy={785} rx={26} ry={33}/><path d="M688,775 L771,775 L756,755 L707,755Z"/></g></g>}
  {fork&&<g opacity={.8}><path d="M490,1170 L180,1010 M585,1170 L940,1050" stroke="#92a2ad" strokeOpacity={.13} strokeWidth={4} fill="none"/></g>}
 </g>;
};
