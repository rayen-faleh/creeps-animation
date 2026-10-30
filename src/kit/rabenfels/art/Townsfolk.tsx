import React from 'react';
import {mix,noise1} from '../util';

type V=[number,number];
const joint=(a:V,b:V,L=155,R=155):V=>{
 const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.min(L+R-.1,Math.max(Math.abs(L-R)+.1,Math.hypot(dx,dy)));
 const nx=dx/(Math.hypot(dx,dy)||1),ny=dy/(Math.hypot(dx,dy)||1),u=(L*L-R*R+d*d)/(2*d),h=Math.sqrt(Math.max(0,L*L-u*u));
 return [a[0]+nx*u+ny*h,a[1]+ny*u-nx*h];
};
export const ClayCup:React.FC<{x:number;y:number;s?:number;lid?:number;blood?:boolean}>=({x,y,s=1,lid=0,blood=false})=><g transform={`translate(${x},${y}) scale(${s})`}>
 <path d="M43,-56 Q106,-69 104,-18 Q103,21 48,21" fill="none" stroke="#4d3424" strokeWidth={16}/>
 <path d="M-61,-65 L-49,69 Q0,90 49,69 L61,-65Z" fill="#6d4a31" stroke="#170f0c" strokeWidth={4}/>
 <path d="M-47,-55 L-36,61 Q-22,72 -10,66 L-17,-59Z" fill="#a17e52" opacity={.5}/>
 <ellipse cx={0} cy={-64} rx={60} ry={14} fill={blood?'#651015':'#1c130e'} stroke="#b39467" strokeOpacity={.55} strokeWidth={4}/>
 {lid>0&&<g transform={`translate(${lid*18},${-lid*43}) rotate(${lid*8})`}><ellipse cx={0} cy={-70} rx={67} ry={17} fill="#2c241c" stroke="#88775b" strokeWidth={3}/><path d="M-15,-76 Q0,-105 15,-76" fill="none" stroke="#9a8560" strokeWidth={7}/></g>}
</g>;
export const Coin:React.FC<{x:number;y:number;r?:number}>=({x,y,r=14})=><g><ellipse cx={x} cy={y} rx={r} ry={r*.55} fill="#a08b61" stroke="#3a3020" strokeWidth={3}/><ellipse cx={x} cy={y-2} rx={r*.7} ry={r*.3} fill="none" stroke="#d7c69a" strokeOpacity={.6} strokeWidth={2}/></g>;

/** Human residents with original profile art and fixed-length two-bone arm articulation. Coordinates are relative to hips. */
export const Resident:React.FC<{id:string;t:number;x:number;y:number;s?:number;who:'marta'|'matthias'|'otto'|'grete';hand?:V;otherHand?:V;lean?:number;look?:number;cup?:boolean;hammer?:number;blade?:boolean;mirror?:boolean}>=({id,t,x,y,s=1,who,hand=[-210,-120],otherHand=[100,-20],lean=0,look=0,cup=false,hammer=0,blade=false,mirror=false})=>{
 const m=who==='marta',smith=who==='matthias',grete=who==='grete';
 const cloth=grete?'#293849':m?'#29332d':smith?'#27272a':'#353739',apron=grete?'#35485a':m?'#a5967b':smith?'#634631':'#8f8877',skin=m?'#b99a80':smith?'#ad896e':'#aa907c',shade=m?'#6f5142':'#674b3e';
 const blink=Math.max(0,1-Math.abs((t%6.8)-.2)/.09),breath=noise1(t*.5,76)*1.4;
 const arm=(a:V,b:V,front:boolean)=>{const e=joint(a,b);return <g><path d={`M${a} Q${e[0]},${e[1]-8} ${b}`} stroke="#141414" strokeWidth={77} fill="none" strokeLinecap="round"/><path d={`M${a} L${e} L${b}`} stroke={cloth} strokeWidth={66} fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d={`M${a[0]-14},${a[1]-18} L${e[0]-14},${e[1]-15} L${b[0]-10},${b[1]-12}`} stroke="#778077" strokeOpacity={.16} strokeWidth={6} fill="none"/><path d={`M${b[0]-28},${b[1]-20} L${b[0]+20},${b[1]-18} L${b[0]+23},${b[1]+10} L${b[0]-29},${b[1]+10}Z`} fill={m?'#b8ad97':'#473d33'}/><g transform={`translate(${b})`}><path d="M-25,-19 Q-41,-42 -19,-48 Q-10,-47 -4,-25 Q24,-34 35,-16 Q43,1 27,13 L-12,18 Q-31,9 -25,-19Z" fill={skin} stroke={shade} strokeWidth={2}/><path d="M-9,-18 Q2,-10 28,-13 M-8,-7 Q10,1 29,-3 M-9,5 Q8,12 23,7" stroke={shade} strokeWidth={2.5} fill="none"/>{front&&cup&&<ClayCup x={-16} y={-48} s={.57}/>} {front&&hammer!==0&&<g transform={`rotate(${hammer})`}><path d="M0,5 L0,-136" stroke="#705035" strokeWidth={15}/><path d="M-55,-166 L51,-166 L54,-116 L-55,-113Z" fill="#343944" stroke="#89909b" strokeOpacity={.45} strokeWidth={3}/></g>}{front&&blade&&<g transform="rotate(-22)"><path d="M-8,-20 L-13,-217 L0,-254 L13,-217 L8,-20Z" fill="#7a8794" stroke="#c4ccd1" strokeOpacity={.7} strokeWidth={2}/><path d="M-28,-23 L28,-23 M0,-20 L0,24" stroke="#3f3428" strokeWidth={13}/></g>}</g></g>;};
 return <g id={id} transform={`translate(${x},${y}) scale(${mirror?-s:s},${s})`}>
  <ellipse cx={0} cy={320} rx={155} ry={24} fill="#000" opacity={.45}/>
  <path d="M-100,-10 L-105,245 L-60,290 L-13,282 L-5,30 L30,280 L88,287 L112,251 L90,-12Z" fill="#121821"/>
  <path d="M-110,260 L-120,306 Q-170,317 -161,333 L-44,334 L-40,285 M31,279 L33,331 L154,331 Q163,313 105,301 L100,267Z" fill="#0b0c10" stroke="#64666b" strokeOpacity={.3} strokeWidth={3}/>
  <g transform={`translate(${lean*14},${breath}) rotate(${lean*3} 0 -120)`}>
   {arm([65,-270],otherHand,false)}
   <path d="M-86,-350 Q-137,-314 -140,-215 L-110,4 Q-12,43 112,9 L117,-205 Q133,-316 58,-348Z" fill={cloth} stroke="#111518" strokeWidth={4}/>
   <path d="M-73,-319 L-104,-80 M82,-285 L92,-60" stroke="#80877e" strokeOpacity={.12} strokeWidth={5}/>
   <path d="M-55,-300 L-71,-157 L-100,8 Q0,48 104,7 L72,-146 L54,-303Z" fill={apron} stroke="#1b1917" strokeWidth={3}/>
   <path d="M-44,-300 L-33,-213 M37,-300 L42,-216 M-59,-133 Q-11,-122 39,-139 M-62,-54 L-63,-9 M61,-75 L72,-18" stroke="#211b17" strokeOpacity={.35} strokeWidth={4} fill="none"/>
   <path d="M-74,-321 L-53,-167 M49,-321 L66,-159" stroke={apron} strokeWidth={17}/>
   <path d="M-35,-365 L-31,-316 Q1,-297 34,-325 L31,-390Z" fill={shade}/>
   <g transform={`rotate(${look*5} -3 -405)`}>
    {m&&<ellipse cx={57} cy={-461} rx={36} ry={48} fill="#211c1b" stroke="#79634e" strokeOpacity={.25} strokeWidth={4}/>}
    <path d="M44,-512 Q-8,-546 -52,-505 Q-73,-486 -67,-453 L-82,-425 L-102,-409 Q-107,-400 -84,-397 L-80,-380 Q-63,-376 -76,-363 Q-49,-335 -13,-353 Q39,-367 54,-414 Q72,-457 44,-512Z" fill={skin} stroke={shade} strokeWidth={3}/>
    <path d="M-49,-502 Q-67,-471 -55,-439 L-69,-413 L-50,-405 Q-48,-375 -24,-365" stroke="#dfc1a0" strokeOpacity={.35} strokeWidth={4} fill="none"/>
    <path d="M25,-493 Q61,-458 32,-404 L11,-376 Q36,-387 49,-419 Q63,-458 44,-491Z" fill={shade} opacity={.7}/>
    <path d="M-56,-442 Q-42,-450 -29,-441" stroke="#352a27" strokeWidth={5} fill="none"/>
    <path d={`M-56,-430 Q-42,${-424-blink*6} -30,-430 Q-43,${-439+blink*9} -56,-430Z`} fill="#242326"/>
    <circle cx={-47+look*2} cy={-431} r={3.3*(1-blink)} fill="#ced3c6"/>
    <path d="M-82,-383 L-58,-381" stroke="#4b2927" strokeWidth={3.5} strokeLinecap="round"/>
    <path d="M-44,-404 Q-32,-393 -21,-396" stroke={shade} opacity={.5} strokeWidth={3} fill="none"/>
    <path d={m?'M-70,-474 Q-50,-528 1,-527 Q64,-523 64,-452 L37,-426 Q47,-469 24,-484 Q-14,-474 -70,-474Z':'M-69,-477 Q-75,-524 -28,-533 Q39,-546 60,-495 L59,-427 L35,-409 L31,-470 Q-14,-488 -69,-477Z'} fill={m?'#29211d':smith?'#35251e':'#62615c'}/>
    {m||grete?<path d="M-64,-488 Q-28,-535 30,-501 L58,-464 Q27,-495 -8,-492Z" fill={grete?'#292b2c':'#b4aa92'}/>:<g><path d="M33,-426 Q25,-382 -28,-373 L-77,-389 Q-89,-358 -62,-340 Q6,-319 40,-378 L54,-424Z" fill={smith?'#453127':'#666158'}/><path d="M-76,-387 Q-40,-397 -12,-383" stroke={smith?'#2c1d18':'#373a3a'} strokeWidth={13} fill="none"/><path d="M-45,-354 Q-14,-350 13,-374" stroke="#b99876" strokeOpacity={.18} strokeWidth={3} fill="none"/></g>}
    {grete&&<g><path d="M-84,-486 Q-34,-512 72,-485 L60,-514 Q5,-537 -59,-518Z" fill="#1a202a" stroke="#718092" strokeOpacity={.35} strokeWidth={3}/><path d="M-68,-509 L-47,-565 L25,-568 L58,-508Z" fill="#293443"/><path d="M-58,-515 L50,-515" stroke="#9b8763" strokeWidth={7}/></g>}
    <ellipse cx={31} cy={-428} rx={13} ry={23} fill={skin} stroke={shade} strokeWidth={3}/><path d="M33,-441 Q18,-428 34,-416" fill="none" stroke={shade} strokeWidth={3}/>
   </g>
   {arm([-77,-280],hand,true)}
  </g>
 </g>;
};
