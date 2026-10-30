import React from 'react';
import {mix,noise1} from '../util';
import {Hand,STYLES,POSES,lerpPose} from './Hand';
type V=[number,number];
export type FigureKind='safwan'|'witness';
const elbow=(a:V,b:V,L:number,R:number,bend:number):V=>{
 const dx=b[0]-a[0],dy=b[1]-a[1],raw=Math.hypot(dx,dy)||1,d=Math.min(L+R-.01,Math.max(Math.abs(L-R)+.01,raw)),nx=dx/raw,ny=dy/raw,u=(L*L-R*R+d*d)/(2*d),h=Math.sqrt(Math.max(0,L*L-u*u));
 return [a[0]+nx*u-ny*h*bend,a[1]+ny*u+nx*h*bend];
};
/** Original young recruit and lean guest; fixed-length IK, independently authored head and hands. */
export const ClovesFigure:React.FC<{id:string;t:number;kind:FigureKind;x:number;y:number;s?:number;hand?:V;otherHand?:V;feet?:[V,V];turn?:number;lean?:number;mouth?:number;alarm?:number;mirror?:boolean;claw?:number}>=({id,t,kind,x,y,s=1,hand=[-175,-65],otherHand=[120,-60],feet=[[-62,275],[77,275]],turn=0,lean=0,mouth=0,alarm=0,mirror=false,claw=0})=>{
 const v=kind==='witness',skin=v?'#a5a9ad':'#b89b7e',shade=v?'#525c69':'#6c5143',cloth=v?'#171923':'#2a3741',edge=v?'#667185':'#77827f',blink=Math.max(0,1-Math.abs(((t+1.8)%7.6)-.15)/.085),breathe=noise1(t*.6,v?76:65)*1.3;
 // Preview only: screen-right eye recedes while the screen-left eye grows nearer.
 const eyeTurn=Math.max(0,Math.min(1,(turn-.1)/.9));
 const recedingX=v?1:mix(1,.62,eyeTurn),recedingY=v?1:mix(1,.85,eyeTurn);
 const nearerX=v?1:mix(.72,1.55,eyeTurn),nearerY=v?1:mix(.9,1.1,eyeTurn);
 const recedingCx=-42+turn*17;
 const arm=(a:V,b:V,front:boolean)=>{const e=elbow(a,b,142,148,front?-1:1);return <g><path d={`M${a} L${e} L${b}`} fill="none" stroke="#0b0e13" strokeWidth={69} strokeLinecap="round" strokeLinejoin="round"/><path d={`M${a} L${e} L${b}`} fill="none" stroke={cloth} strokeWidth={59} strokeLinecap="round" strokeLinejoin="round"/><path d={`M${a[0]-10},${a[1]-8} L${e[0]-10},${e[1]-7} L${b[0]-9},${b[1]-8}`} fill="none" stroke={edge} strokeOpacity={.28} strokeWidth={4}/><path d={`M${b[0]-27},${b[1]-17} l52,0 l0,20 l-52,0Z`} fill={v?'#312232':'#847252'}/><g transform={`translate(${b})`} opacity={v&&front&&claw>0?0:1}><path d="M-23,-12 Q-30,-35 -18,-42 Q-6,-44 -4,-23 L20,-27 Q37,-25 35,-7 L22,12 L-7,14 Q-28,9 -23,-12Z" fill={skin} stroke={shade} strokeWidth={3}/><path d="M-5,-15 L26,-15 M-7,-5 L25,-5 M-9,5 L18,5" stroke={shade} strokeWidth={2}/>{v&&<path d="M27,-20 l12,-8 l-4,15 M29,-7 l12,-6 l-7,14" fill="#10141b"/>}</g>{v&&front&&claw>0&&<Hand id={`${id}-claw`} x={b[0]} y={b[1]} rot={-82} scale={.48} style={STYLES.creature} pose={lerpPose(POSES.claw,POSES.reach,claw*.6)} showSleeve={false} light={.9}/>}</g>;};
 const leg=(a:V,b:V,k:number)=>{const n=elbow(a,b,155,155,k);return <g><path d={`M${a} L${n} L${b}`} fill="none" stroke="#10151d" strokeWidth={69} strokeLinecap="round"/><path d={`M${a} L${n} L${b}`} fill="none" stroke={v?'#22212b':'#242b31'} strokeWidth={58} strokeLinecap="round"/><path d={`M${b[0]-32},${b[1]-39} L${b[0]+29},${b[1]-38} L${b[0]+30},${b[1]+9} L${b[0]-72},${b[1]+10} Q${b[0]-90},${b[1]-6} ${b[0]-34},${b[1]-13}Z`} fill="#0b0e14" stroke="#73777b" strokeOpacity={.28} strokeWidth={3}/></g>;};
 return <g id={id} transform={`translate(${x},${y}) scale(${mirror?-s:s},${s})`}>
  <ellipse cx={0} cy={293} rx={137} ry={20} fill="#000" opacity={.35}/>
  {leg([-42,-4],feet[0],-1)}{leg([45,-3],feet[1],1)}
  <g transform={`translate(${lean*13},${breathe}) rotate(${lean*3} 0 -160)`}>
   {arm([67,-274],otherHand,false)}
   <path d={v?'M-76,-351 Q-133,-322 -118,-213 L-140,139 L-5,180 L20,32 L56,178 L141,129 L113,-214 Q132,-323 63,-352Z':'M-72,-340 Q-123,-322 -127,-235 L-106,26 Q0,64 110,22 L118,-233 Q124,-323 61,-342Z'} fill={cloth} stroke="#0b0e14" strokeWidth={5}/>
   <path d="M-75,-318 L-91,-80 M88,-298 L92,-72" stroke={edge} strokeOpacity={.22} strokeWidth={5}/>
   {v?<><path d="M-71,-347 L-12,-260 L-39,-213 L-6,124 M57,-347 L14,-262 L42,-215 L18,135" fill="#2d2130" stroke="#706276" strokeOpacity={.3} strokeWidth={3}/><path d="M-23,-352 L0,-301 L25,-354" fill="#a8aaa6"/><path d="M-9,-309 L8,-310 L14,-229 L-8,-242Z" fill="#541a23"/></>:<><path d="M-68,-333 L-34,-353 L87,23 L45,34Z" fill="#877452" stroke="#ab9771" strokeOpacity={.4} strokeWidth={3}/><path d="M-109,-51 L107,-51 L107,-19 L-109,-19Z" fill="#302820"/><rect x={-9} y={-52} width={31} height={32} rx={3} fill="none" stroke="#a38b58" strokeWidth={7}/><path d="M35,-278 L57,-269 L60,-239 L45,-220 L27,-239 L27,-268Z" fill="#a18a56" stroke="#574c31" strokeWidth={3}/><path d="M42,-259 V-237 M34,-248 H51" stroke="#514731" strokeWidth={3}/></>}
   <path d="M-30,-390 L-27,-333 L0,-314 L34,-340 L28,-393Z" fill={shade}/>
   <g transform={`rotate(${turn*5-alarm*3} 0 -430)`}>
    <path d={`M43,-511 Q-10,-542 -56,-502 Q-72,-478 -64,-453 L${mix(-79,-64,turn)},-426 L${mix(-99,-66,turn)},-412 Q${mix(-107,-65,turn)},-401 ${mix(-83,-62,turn)},-397 L${mix(-78,-61,turn)},-379 Q-58,-348 -22,-352 Q25,-358 48,-405 Q69,-461 43,-511Z`} fill={skin} stroke={shade} strokeWidth={3}/>
    <path d="M27,-494 Q57,-462 32,-413 L11,-372 Q40,-387 51,-424 Q62,-463 42,-495Z" fill={shade} opacity={.75}/>
    {/* Ears stay on the side plane and are painted before all eyes. */}
    <g transform={`translate(${v?0:turn*26},0)`}><ellipse cx={31} cy={-430} rx={12} ry={22} fill={skin} stroke={shade} strokeWidth={3}/><path d="M34,-443 Q20,-433 33,-418" stroke={shade} strokeWidth={3} fill="none"/></g>
    <g transform={`translate(${recedingCx},-432) scale(${recedingX},${recedingY}) translate(${-recedingCx},432)`}>
    <path d={`M${-55+turn*12},${-444-alarm*8} Q${-42+turn*13},${-454-alarm*10} ${-26+turn*12},${-445-alarm*3}`} stroke={v?'#282b35':'#392e29'} strokeWidth={v?5:6} fill="none"/>
    <path d={`M${-57+turn*17},-432 Q${-42+turn*17},${-423-blink*7} ${-26+turn*17},-432 Q${-42+turn*17},${-442+blink*10} ${-57+turn*17},-432Z`} fill="#161c24"/>
    <circle cx={-43+turn*18} cy={-432} r={(v?4:3.6)*(1-blink)} fill={v?'#a88f89':'#c2c9bc'}/>
    </g>
    {turn>.35&&<g opacity={(turn-.35)/.65}><g transform={`translate(16,-433) scale(${nearerX},${nearerY}) translate(-16,433)`}><path d="M7,-433 Q17,-442 25,-433 Q17,-426 7,-433Z" fill="#24252a"/><path d="M7,-445 Q17,-452 26,-445" stroke="#392e29" strokeWidth={4} fill="none"/><circle cx={17} cy={-433} r={3} fill="#c4cabc"/></g></g>}
    {!v&&mouth>.3?<ellipse cx={mix(-65,-5,turn)} cy={-382} rx={8} ry={5+mouth*5} fill="#261b1c" stroke="#775449" strokeWidth={2}/>:<path d={`M${mix(-79,-23,turn)},-383 Q${mix(-67,-7,turn)},${!v&&alarm>.5?-389:-380-mouth*8} ${mix(-54,12,turn)},-383`} fill={mouth>0?'#1d151a':'none'} stroke={v?'#4f303a':'#50352e'} strokeWidth={3}/>}
    <path d="M-8,-422 L-14,-398 L0,-396" fill="none" stroke={shade} strokeWidth={3} opacity={turn}/><path d="M-53,-407 L-24,-397" stroke={shade} strokeWidth={3} opacity={.5}/>
    {v?<><path d="M-69,-478 Q-69,-534 -10,-540 Q50,-538 62,-492 L55,-428 L32,-413 L28,-481 Q1,-503 -31,-491 L-60,-454Z" fill="#141821"/><path d="M-55,-505 Q-20,-527 18,-510" stroke="#626a76" strokeOpacity={.35} strokeWidth={5}/></>:<><path d="M-69,-474 Q-84,-516 -42,-534 Q4,-555 47,-524 Q72,-509 60,-470 L36,-443 L30,-480 L-9,-489 L-52,-465Z" fill="#2c2521"/>{[-46,-20,8,32].map((n,i)=><path key={i} d={`M${n-12},${-507-i%2*10} q-6,-22 16,-23 q22,2 14,21`} stroke="#5c4838" strokeWidth={4} strokeOpacity={.55} fill="none"/>)}<path d="M-73,-491 L60,-491 L50,-516 Q-4,-538 -62,-514Z" fill="#263440" stroke="#7e8279" strokeOpacity={.35} strokeWidth={3}/><path d="M-52,-516 L47,-516" stroke="#8f7d54" strokeWidth={6}/></>}
   </g>
   {arm([-74,-280],hand,true)}
  </g>
 </g>;
};
