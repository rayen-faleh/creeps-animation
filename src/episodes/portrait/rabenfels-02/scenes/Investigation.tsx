import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera,Stage} from '../../../../kit/rabenfels/fx';
import {Floor,Wall} from '../../../../kit/rabenfels/art/Room';
import {Candle} from '../../../../kit/rabenfels/art/Props';
import {Hand,POSES,STYLES,lerpPose,wristFor} from '../../../../kit/rabenfels/art/Hand';
import {Resident,ClayCup} from '../../../../kit/rabenfels/art/Townsfolk';
import {ClovesFigure} from '../../../../kit/rabenfels/art/ClovesCharacters';
import {Cloves,WatchLantern,BlackCoat,WashBasin} from '../../../../kit/rabenfels/art/ClovesProps';
import {TownStreet,PointedWindow} from '../../../../kit/rabenfels/sets/RabenfelsTown';
import {mix,prog,track,noise1,easeOut} from '../../../../kit/rabenfels/util';
import {theme} from '../../../../kit/rabenfels/theme';
import E from '../events.json';

export const GLOVE={...STYLES.adult,skin:'#353a40',shade:'#171e28',rim:'#adbbcc',nail:'#484b51',nailLen:0,cuff:'#252c36'};
const Label:React.FC<{top?:number;children:React.ReactNode;small?:boolean}>=({top=210,children,small=false})=><div style={{position:'absolute',left:90,top,width:880,fontFamily:theme.fonts.caption,fontSize:small?32:47,letterSpacing:small?2:5,color:small?'#bbad94':'#e2dac9',textShadow:'0 4px 16px #000',lineHeight:1.15}}>{children}</div>;
const CobbleFloor:React.FC<{id:string}>=({id})=><g><defs><pattern id={`${id}-cobbles`} width={285} height={180} patternUnits="userSpaceOnUse"><rect width={285} height={180} fill="#101823"/><path d="M8,10 L134,6 L139,79 L4,84Z M149,8 L277,12 L280,81 L148,78Z M-60,97 L66,91 L71,170 L-58,174Z M81,96 L206,94 L209,172 L78,169Z M220,95 L347,93 L350,171 L219,174Z" fill="#1d2733" stroke="#3d4958" strokeWidth={2}/><path d="M20,20 L123,17 M163,21 L263,23 M91,106 L196,104" stroke="#697481" strokeOpacity={.18} strokeWidth={3}/></pattern></defs><rect x={-500} y={-500} width={2400} height={3000} fill={`url(#${id}-cobbles)`}/></g>;
const Corpse:React.FC<{id:string;collar?:number}>=({id,collar=0})=><g id={id}>
 <ellipse cx={660} cy={1157} rx={570} ry={200} fill="#01040a" opacity={.65}/>
 <path d="M184,1174 Q122,1058 194,962 Q173,843 260,810 Q346,765 435,855 Q596,815 721,872 Q864,855 1039,987 L1283,1102 L1284,1293 Q1038,1377 729,1347 L319,1296Z" fill="#898b85" stroke="#3f464b" strokeWidth={6}/>
 <path d="M191,993 Q276,882 383,913 Q480,990 496,1237 M485,897 Q572,986 526,1264 M679,916 Q782,1029 719,1309 M942,1006 Q1009,1158 1003,1311" stroke="#4f585e" strokeWidth={9} fill="none"/>
 <path d="M334,880 L487,843 L677,903 L644,1107 L457,1101Z" fill="#1b2029" stroke="#090f18" strokeWidth={5}/><path d={`M374,866 L491,${860-collar*44} L569,930 L505,1001Z`} fill="#3a4048" stroke="#8b9295" strokeOpacity={.45} strokeWidth={4}/><path d="M614,902 L534,1005 L609,1040 L681,931Z" fill="#2b313b" stroke="#727f8a" strokeOpacity={.35} strokeWidth={4}/>
 <path d="M447,1090 Q593,1060 700,1110 L829,1116 Q884,1093 892,1120 Q932,1109 934,1141 Q970,1145 954,1172 Q953,1205 912,1198 L830,1187 L683,1211 L472,1192Z" fill="#232b35" stroke="#0d141e" strokeWidth={5}/>
 <path d="M828,1115 Q849,1095 863,1110 L883,1147 L924,1149 Q941,1156 931,1166 L879,1168 L918,1182 Q924,1194 910,1198 L854,1183 L831,1177Z" fill="#a08d7a" stroke="#584b44" strokeWidth={3}/><path d="M885,1148 L913,1150 M877,1167 L910,1180" stroke="#c6b8a1" strokeOpacity={.6} strokeWidth={3}/>
</g>;

export const Scent:React.FC<{t:number}>=({t})=>{
 const p=prog(t,.05,.8,easeOut),lift=prog(t,.85,1.65),cx=475,cy=890-lift*32,pose=lerpPose(POSES.reach,POSES.claw,p*.7);
 const [hx,hy]=wristFor(cx,cy,18,.95,GLOVE,pose);
 return <AbsoluteFill><Camera t={t} zoom={1.12+prog(t,0,E.memory)*.08} y={-30} shake={3} seed={411}><Stage><CobbleFloor id="corpse-stones"/><Corpse id="body" collar={lift}/><Hand id="collar-pinch" x={hx+(1-p)*230} y={hy+(1-p)*330} rot={18} scale={.95} style={GLOVE} pose={pose}/><WatchLantern id="first-lantern" t={t} x={935} y={435} s={.75}/>{t>=E.cloves&&<g transform="translate(602,950) rotate(24)"><path d="M-50,-16 l100,0 l-10,44 l-74,-2Z" fill="#544638" opacity={.5}/><Cloves x={0} y={0} s={.43}/></g>}</Stage></Camera><Label top={185} small>RABENFELS · 1732 · PART II</Label>{t<5.1&&<div style={{position:'absolute',left:90,top:305,width:805,borderLeft:'3px solid #8a7356',padding:'10px 0 10px 23px',fontFamily:theme.fonts.caption,color:'#d1c5b1',textShadow:'0 3px 12px #000',fontSize:42,lineHeight:1.15}}><div style={{fontSize:34,letterSpacing:2,color:'#a79880'}}>@stvry.safwan chose:</div>“smell the body to find a similar scent”</div>}</AbsoluteFill>;
};
export const Supplier:React.FC<{t:number}>=({t})=>{
 const a=prog(t,E.memory+.2,E.memory+1.15,easeOut),hand:[number,number]=[mix(-120,-235,a),mix(-155,-81,a)],cupX=840+hand[0]*1.04-15,cupY=1120+hand[1]*1.04-48;
 return <Camera t={t} zoom={1.07} y={30} shake={3} seed={415}><Stage><Wall id="otto-memory" x={-600} y={-600} w={2400} h={3000} warm={.7} lit={.9}/><PointedWindow x={90} y={180} w={280} h={560}/><path d="M290,140 H1180 M450,140 V290 M720,140 V275" stroke="#1c1b1b" strokeWidth={20}/><Resident id="otto-cloves" t={t} x={840} y={1120} who="otto" s={1.04} hand={hand} look={.2} lean={a*.3}/><path d="M-400,1090 H1600 V1185 H-400Z" fill="#543b29" stroke="#1d1712" strokeWidth={7}/><path d="M-400,1185 H1600 V2150 H-400Z" fill="#2b211a"/><Cloves x={315} y={1050} s={.95}/><ClayCup x={cupX} y={cupY} s={.83} lid={.18} blood/><Candle x={80} y={1082} t={t} s={.75}/></Stage></Camera>;
};
export const Recruit:React.FC<{t:number}>=({t})=>{
 const raise=prog(t,E.recruit+.1,E.recruit+1.4,easeOut),lower=prog(t,E.cover+.65,E.evidence-.2),hx=mix(-150,-210,raise)+lower*25,hy=mix(-25,-310,raise)+lower*130;
 const cover=prog(t,E.cover-.05,E.cover+.4,easeOut),drop=prog(t,E.cover+1.9,E.evidence-.12),hide=cover*(1-drop);
 return <AbsoluteFill><Camera t={t} zoom={1.03+raise*.06} y={-20} shake={3} seed={419}><Stage><TownStreet id="recruit-square" t={t}/><ClovesFigure id="safwan-first" kind="safwan" t={t} x={650} y={1145} s={1.02} hand={[hx,hy]} otherHand={[110,-30]} lean={.2*raise} turn={.28} alarm={hide*.4}/><WatchLantern id="safwan-lantern" t={t} x={650+hx*1.02} y={1145+hy*1.02+65} s={.8}/>{hide>0&&<Hand id="hide-fangs" x={mix(-210,145,hide)} y={mix(1900,1600,hide)} rot={-54} scale={1.8} style={GLOVE} pose={lerpPose(POSES.reach,POSES.flat,hide)} mirror/>}</Stage></Camera><Label top={195}>SAFWAN · WATCH RECRUIT</Label><Label top={265} small>Resident created for @stvry.safwan</Label></AbsoluteFill>;
};
export const Evidence:React.FC<{t:number}>=({t})=>{
 const reach=prog(t,E.evidence+.1,E.evidence+.8,easeOut),lift=prog(t,E.evidence+1.15,E.evidence+2.05,easeOut),x=mix(1120,917,reach)-lift*100,y=mix(1550,1157,reach)-lift*200;
 const skin={...STYLES.adult,skin:'#b89b7e',shade:'#6c5143',cuff:'#83704e',sleeve:'#2a3741'},pose=lerpPose(POSES.point,POSES.claw,reach*.8),[hx,hy]=wristFor(x,y,-22,1.02,skin,pose);
 return <Camera t={t} zoom={1.25} x={180} y={160} shake={3} seed={423}><Stage><CobbleFloor id="evidence-stones"/><Corpse id="corpse-hand"/><path d={lift>.01?`M${x-13},${y+8} q-39,28 -22,62 q22,21 29,48`:'M910,1160 q-39,26 -24,50 q18,22 29,45'} fill="none" stroke="#0b0c11" strokeWidth={7}/><path d={lift>.01?`M${x-13},${y+8} q-39,28 -22,62 q22,21 29,48`:'M910,1160 q-39,26 -24,50 q18,22 29,45'} fill="none" stroke="#737780" strokeOpacity={.7} strokeWidth={1.5}/><Hand id="safwan-wool-pinch" x={hx} y={hy} rot={-22} scale={1.02} style={skin} pose={pose}/></Stage></Camera>;
};
export const LockedShop:React.FC<{t:number}>=({t})=>{
 const reach=prog(t,E.door+.05,E.door+.45,easeOut),pull=track(t,[[E.door+.45,0],[E.door+.7,1],[E.door+.85,0],[E.door+1.05,.7],[E.door+1.2,0]]),pose=lerpPose(POSES.reach,POSES.claw,reach),[hx,hy]=wristFor(666,970+pull*8,9,1,GLOVE,pose);
 return <Camera t={t} zoom={1.03+reach*.04} shake={4} seed={427}><Stage><Wall id="locked-shop" x={-500} y={-600} w={2300} h={3000} lit={.8}/><path d="M185,1710 V290 Q540,-110 895,290 V1710Z" fill="#302821" stroke="#12171e" strokeWidth={40}/>{[240,350,460,570,680,790,850].map(x=><path key={x} d={`M${x},160 V1710`} stroke="#141b23" strokeWidth={7}/>)}<path d="M200,610 H885 M200,1310 H885" stroke="#171e29" strokeWidth={35}/><path d="M260,350 l26,-8 l18,34 l-33,7Z M760,1190 l39,-5 l-8,74 l-29,-4Z" fill="#72604b" opacity={.35}/><path d="M628,879 H700 V1045 H628Z" fill="#1b222d" stroke="#788491" strokeOpacity={.5} strokeWidth={4}/><path d={`M665,930 V${998+pull*8}`} stroke="#919498" strokeWidth={13} strokeLinecap="round"/><path d="M720,1020 L745,1038 L738,1084 L711,1084 L702,1046Z" fill="#2b3036" stroke="#879197" strokeOpacity={.55} strokeWidth={3}/><Hand id="locked-handle" x={hx+(1-reach)*170} y={hy+(1-reach)*400} rot={9} scale={1} style={GLOVE} pose={pose}/><PointedWindow x={940} y={315} w={230} h={610}/></Stage></Camera>;
};
export const Street:React.FC<{t:number}>=({t})=>{
 const p=prog(t,E.street,E.coat),step=noise1(t*1.1,43)*3;
 return <Camera t={t} zoom={1.04+p*.14} x={p*65} y={-15+step} shake={3} seed={431}><Stage><TownStreet id="toward-tavern" t={t}/><ClovesFigure id="safwan-follow" kind="safwan" t={t} x={730-p*25} y={1140} s={.59} hand={[-160,-120]} otherHand={[95,-50]} turn={.1}/><WatchLantern id="walk-lamp" t={t} x={635-p*25} y={1110} s={.46}/></Stage></Camera>;
};
export const Washing:React.FC<{t:number}>=({t})=>{
 const stop=1-prog(t,E.ask,E.ask+.18),u=Math.sin((t-E.coat)*4)*stop,up=prog(t,E.glance+.1,E.glance+.8),hand:[number,number]=[-205,-143+u*7],other:[number,number]=[-108,-143-u*7];
 return <Camera t={t} zoom={1.06+prog(t,E.ask,E.stairs)*.035} y={-20} shake={3} seed={435}><Stage><Wall id="marta-wash" x={-600} y={-600} w={2500} h={3000} warm={.28} lit={.83}/><path d="M-300,140 L1500,310 M1050,-500 V1800" stroke="#211a15" strokeWidth={65}/><PointedWindow x={75} y={280} w={265} h={560}/><path d="M-600,1270 H1700 V1370 H-600Z" fill="#3e2b20" stroke="#171412" strokeWidth={7}/><path d="M-600,1370 H1700 V2100 H-600Z" fill="#211a15"/><Resident id="marta-coat" t={t} x={810} y={1135} s={1.1} who="marta" hand={hand} otherHand={other} look={up*2.1} lean={.25}/><BlackCoat x={639} y={1051} s={.76} twist={u}/><WashBasin x={610} y={1280} s={1} ripple={((t-E.coat)*1.4)%1}/><Candle x={100} y={1250} t={t} s={.7}/><path d="M1055,1210 L1055,1020 L1105,1020 L1105,940 L1155,940 L1155,860 L1260,860 V1400Z" fill="#29201b" stroke="#6f5740" strokeWidth={4}/></Stage></Camera>;
};
