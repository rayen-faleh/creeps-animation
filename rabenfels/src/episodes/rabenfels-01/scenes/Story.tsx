import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera,Stage} from '../../../kit/fx';
import {Wall,Floor} from '../../../kit/art/Room';
import {Candle,Mirror} from '../../../kit/art/Props';
import {Hand,POSES,STYLES,lerpPose,wristFor} from '../../../kit/art/Hand';
import {Resident,ClayCup,Coin} from '../../../kit/art/Townsfolk';
import {TownStreet,PointedWindow} from '../../../kit/sets/RabenfelsTown';
import {prog,mix,track,noise1,easeOut,easeIn} from '../../../kit/util';
import {theme} from '../../../kit/theme';
import E from '../events.json';

const GLOVE={...STYLES.adult,skin:'#32363b',shade:'#151b22',rim:'#9fb4cf',nail:'#3c4149',nailLen:0,cuff:'#242b35'};
const CaptionLabel:React.FC<{t:number;from:number;name:string;sub?:string}>=({t,from,name,sub})=><AbsoluteFill style={{paddingTop:210,paddingLeft:100,opacity:prog(t,from,from+.3)*(1-prog(t,from+2.3,from+2.7)),pointerEvents:'none'}}><div style={{fontFamily:theme.fonts.caption,color:'#ece4d2',fontSize:55,letterSpacing:5,textShadow:'0 3px 12px #000'}}>{name}</div>{sub&&<div style={{fontFamily:theme.fonts.caption,color:'#ab9d85',fontSize:34,letterSpacing:6,marginTop:7}}>{sub}</div>}</AbsoluteFill>;
const Paper:React.FC<{x:number;y:number;s?:number;commission?:boolean}>=({x,y,s=1,commission=false})=><g transform={`translate(${x},${y}) scale(${s})`}>
 <path d="M-280,-220 Q-20,-230 275,-210 L290,204 Q10,227 -274,210Z" fill="#b7a17c" stroke="#4b3b26" strokeWidth={4}/><path d="M-269,-204 L-254,197 M260,-196 L275,194" stroke="#e7d4ac" strokeOpacity={.4} strokeWidth={4}/>
 <text x={0} y={-151} textAnchor="middle" fontFamily={theme.fonts.caption} fontSize={45} fill="#33291e" letterSpacing={5}>RABENFELS</text><path d="M-191,-123 H188" stroke="#63503a" strokeWidth={2}/>
 {commission?<><text x={0} y={-48} textAnchor="middle" fontFamily={theme.fonts.caption} fontSize={39} fill="#35291f">Find the killer.</text><text x={0} y={8} textAnchor="middle" fontFamily={theme.fonts.caption} fontSize={25} fill="#53422d" letterSpacing={2}>By order of the town watch</text></>:Array.from({length:7},(_,i)=><path key={i} d={`M-190,${-85+i*32} q45,-4 75,0 t89,0 t${i%2?45:73},0`} fill="none" stroke="#5b4630" strokeWidth={2} opacity={.6}/>)}
 {commission&&<g transform="translate(145,119)"><path d="M-12,-30 L-22,75 L1,60 L18,78 L24,-25Z" fill="#5f1517"/><circle r={45} fill="#811b1e" stroke="#a54237" strokeWidth={4}/><path d="M-20,14 Q-15,-21 7,-18 L24,-31 L20,-8 L36,0 L16,6 L0,25 L-7,11Z" fill="#361314"/></g>}
</g>;
const Desk:React.FC<{id:string;t:number}>=({id,t})=><g><Wall id={`${id}-wall`} x={-500} y={-500} w={2100} h={2400} lit={.73}/><PointedWindow x={470} y={-70} w={410} h={780}/><path d="M375,55 L390,850 L490,850 L455,75Z M900,10 L895,850 L991,830 L984,-30Z" fill="#320e14"/><path d="M-500,1170 L1500,1170 L1600,2130 H-500Z" fill="#30231c"/><path d="M-500,1170 H1500" stroke="#9d8060" strokeOpacity={.4} strokeWidth={7}/>{Array.from({length:6},(_,i)=><path key={i} d={`M-500,${1250+i*140} L1600,${1230+i*160}`} stroke="#140f10" strokeWidth={6}/>)}<Candle x={220} y={1120} s={.95} t={t}/><path d="M815,1190 L940,965 L971,978 L843,1204Z" fill="#827f7c" stroke="#c4c4bf" strokeOpacity={.3} strokeWidth={3}/><path d="M810,1185 L856,1211" stroke="#39271a" strokeWidth={16}/><path d="M989,1045 L1020,1280 L1036,1284 L1010,1030Z" fill="#5c3e27"/></g>;

export const Commission:React.FC<{t:number}>=({t})=>{
 const lift=prog(t,.05,1.1,easeOut),y=mix(1530,980,lift),pose=lerpPose(POSES.reach,POSES.claw,prog(t,.5,1.05));
 const [xw,yw]=wristFor(685,y+120,12,1.15,STYLES.creature,pose);
 return <Camera t={t} zoom={1.02+prog(t,0,E.town)*.07} y={40} shake={4} seed={301}><Stage><Desk id="commission" t={t}/><Paper x={540} y={y} commission/><Hand id="accept" x={xw} y={yw} rot={12} scale={1.15} style={STYLES.creature} pose={pose} light={.85}/></Stage></Camera>;
};
export const Town:React.FC<{t:number}>=({t})=><AbsoluteFill><Camera t={t} zoom={1+prog(t,E.town,E.clerk)*.075} y={-20} shake={4} seed={303}><Stage><TownStreet id="establish" t={t}/></Stage></Camera><CaptionLabel t={t} from={E.town} name="RABENFELS" sub="1732 · NIGHT ONE"/></AbsoluteFill>;
export const Clerk:React.FC<{t:number}>=({t})=>{
 const writing=prog(t,E.write,E.rent-.25),tipX=390+writing*210,tipY=1040+Math.sin(writing*31)*3;
 const pose=lerpPose(POSES.relaxed,POSES.claw,.55);
 const [hx,hy]=wristFor(tipX+95,tipY-170,-8,1.1,GLOVE,pose);
 return <Camera t={t} zoom={t<E.write?1.02:1.18} y={t<E.write?20:80} shake={3} seed={307}><Stage><Desk id="clerk" t={t}/><g transform="rotate(-7 540 1030)"><Paper x={540} y={1000} s={.88}/><path d="M370,1055 q45,-8 85,0 t180,0" fill="none" stroke="#39291b" strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1-writing}/></g><Hand id="paper-anchor" x={237} y={1315} rot={-14} scale={.85} mirror style={GLOVE} pose={POSES.relaxed}/>{t>=E.write&&<><path d={`M${tipX},${tipY} L${tipX+162},${tipY-307}`} stroke="#322b25" strokeWidth={7}/><path d={`M${tipX+75},${tipY-150} Q${tipX+55},${tipY-273} ${tipX+194},${tipY-393} Q${tipX+211},${tipY-215} ${tipX+75},${tipY-150}Z`} fill="#bab5a7" stroke="#565754" strokeWidth={3}/><path d={`M${tipX+75},${tipY-150} L${tipX+184},${tipY-366}`} stroke="#6d6a60" strokeWidth={3}/><Hand id="quill-grip" x={hx} y={hy} rot={-8} scale={1.1} style={GLOVE} pose={pose}/></>}</Stage></Camera>;
};

const TavernRoom:React.FC<{t:number;serve:boolean;mirrorCup:boolean}>=({t,serve,mirrorCup})=>{
 const a=prog(t,E.marta+.2,E.serve,easeOut),release=prog(t,E.serve+.25,E.serve+.65),hand:[number,number]=[mix(-130,-255,a)+release*50,mix(-180,-50,a)-release*90];
 const cx=1580+mix(-130,-255,a)*1.05,cy=1080+mix(-180,-50,a)*1.05-50;
 return <svg width={2200} height={1920} viewBox="0 0 2200 1920" style={{position:'absolute',left:0,top:0}}>
 <Wall id="tavern-wall" x={-700} y={-400} w={3500} h={2400} warm={.38} lit={.85}/><Floor id="tavern-floor" x={-700} y={1500} w={3500} h={900} lit={.65}/>
 <path d="M-600,200 L2400,380 M50,-400 L50,1700 M2100,-400 L2100,1700" stroke="#1b1410" strokeWidth={90}/><PointedWindow x={1800} y={190} w={280} h={620}/>
 <Mirror id="tavern-mirror" x={115} y={300} w={670} h={930} ageSpots={false} lit={.9}>
  <rect width={670} height={930} fill="#141b23"/>
  <path d="M0,190 H670 M50,0 V930 M610,0 V930" stroke="#302b25" strokeWidth={30}/><PointedWindow x={70} y={230} w={160} h={310}/>
  <g transform="translate(480,610) scale(.43)"><Resident id="ref-marta" t={t} x={0} y={0} who="marta" hand={[-165,-130]} look={-.3}/></g>
  <path d="M0,690 H670 V735 H0Z" fill="#4b3623"/><path d="M270,930 L260,642 Q390,602 490,640 L478,930Z" fill="#241b16" stroke="#6e5138" strokeWidth={9}/><path d="M281,668 L469,668 M284,722 L465,722 M285,783 L463,783" stroke="#4b3526" strokeWidth={13}/>
  {mirrorCup&&<ClayCup x={206} y={610} s={.65}/>}
 </Mirror>
 <Resident id="marta" t={t} x={1580} y={1080} s={1.05} who="marta" hand={serve?hand:[-160,-130]} look={serve?-a*.55:0} lean={serve?a*.6:0}/>
 <path d="M960,1050 L2200,1050 L2230,1150 L930,1150Z" fill="#503725" stroke="#1f1915" strokeWidth={6}/><path d="M955,1150 H2200 V1700 H955Z" fill="#241d18"/><path d="M985,1180 H2150 V1600 H985Z" stroke="#6e5034" strokeOpacity={.25} strokeWidth={8} fill="none"/>
 <Candle x={1915} y={1040} s={.67} t={t}/>
 {serve&&<ClayCup x={t<E.serve?cx:1312} y={t<E.serve?cy:978} s={.65}/>}
 <path d="M990,1280 H1390 V1300 H990Z M1010,1300 L1000,1900 M1370,1300 L1380,1900" stroke="#251c16" strokeWidth={25} fill="#36271b"/>
 </svg>;
};
export const Rent:React.FC<{t:number}>=({t})=>{
 const p=prog(t,E.rent+.2,E.rent+.8,easeOut),release=prog(t,E.rent+.85,E.rent+1.25),pose=lerpPose(POSES.point,POSES.relaxed,release),x=mix(150,380,p),y=mix(1520,1060,p);
 const [hx,hy]=wristFor(x,y,-25,.95,GLOVE,pose,true);
 return <Camera t={t} x={900} zoom={1.06} y={80} shake={3} seed={311}><TavernRoom t={t} serve={false} mirrorCup={false}/><svg width={2200} height={1920} viewBox="0 0 2200 1920" style={{position:'absolute',left:0,top:0}}><g transform="translate(900,0)"><Coin x={release>0?380:x} y={release>0?1058:y} r={19}/><Coin x={release>0?421:x+41} y={release>0?1061:y+3} r={19}/><Hand id="rent-hand" x={hx-release*180} y={hy+release*280} rot={-25} scale={.95} mirror style={GLOVE} pose={pose}/></g></svg></Camera>;
};
export const Tavern:React.FC<{t:number}>=({t})=>{
 const turn=prog(t,E.mirror,E.mirror+1.25,easeOut),lift=prog(t,E.mirror-.65,E.mirror,easeOut),pose=lerpPose(POSES.reach,POSES.claw,lift);
 const cupX=mix(412,850,lift),cupY=mix(978,1120,lift),[hx,hy]=wristFor(cupX+43,cupY-10,5,1,GLOVE,pose);
 return <AbsoluteFill><Camera t={t} x={mix(900,0,turn)} shake={4} rot={mix(0,-1,turn)} seed={313}><TavernRoom t={t} serve={t<E.mirror-.65} mirrorCup={t>=E.mirror-.65}/></Camera>
 {t>=E.mirror-.65&&<Stage><ClayCup x={cupX} y={cupY} s={.9}/><Hand id="cup-holder" x={hx} y={hy} rot={5} style={GLOVE} pose={pose} light={.9}/></Stage>}
 <CaptionLabel t={t} from={E.marta} name="MARTA" sub="THE BROKEN BELL"/></AbsoluteFill>;
};

const ForgeSet:React.FC<{id:string;t:number}>=({id,t})=><g><Wall id={`${id}-wall`} x={-600} y={-600} w={2400} h={2600} warm={.45} lit={.85}/><path d="M80,1150 V520 Q270,290 460,520 V1150Z" fill="#17171a" stroke="#4b443d" strokeWidth={50}/><path d="M130,1120 V680 Q270,495 410,680 V1120Z" fill="#4c2312"/><path d={`M150,1100 Q190,${850+noise1(t*5,3)*20} 210,1005 Q242,800 280,1070 Q320,${870+noise1(t*6,8)*25} 357,1030 L395,1120Z`} fill="#b26b2d"/><path d="M172,1110 Q250,980 285,1100 Q324,1010 354,1110Z" fill="#d8a957"/>
 <path d="M-400,1410 H1600 V2100 H-400Z" fill="#1d1a18"/><path d="M540,300 H1030 M574,300 V480 M654,300 V452 M747,300 V480 M856,300 V437 M954,300 V493" stroke="#0d1117" strokeWidth={18}/>{[574,654,747,856,954].map((x,i)=><path key={x} d={`M${x-20},${452+i%2*26} l20,-14 l20,14 l-8,62 h-24Z`} fill="#343a40" stroke="#8c9199" strokeOpacity={.25} strokeWidth={3}/>)}
 <path d="M210,1220 L530,1220 L515,1285 L446,1300 L447,1430 L316,1430 L317,1300 L269,1280Z" fill="#323941" stroke="#8e959e" strokeOpacity={.3} strokeWidth={4}/></g>;
export const Friend:React.FC<{t:number}>=({t})=>{
 const greet=prog(t,E.friend+.4,E.friend+1.35,easeOut),settle=prog(t,E.friend+1.6,E.friend+2.3),hand:[number,number]=[mix(-110,-230,greet),mix(-70,-160,greet)+settle*15];
 return <AbsoluteFill><Camera t={t} zoom={1.03+greet*.025} shake={3} seed={317}><Stage><ForgeSet id="friend-forge" t={t}/><Resident id="matthias-greet" t={t} x={730} y={1120} s={1.15} who="matthias" hand={hand} lean={greet*.8} look={-.5}/><Hand id="greet-return" x={300+greet*140} y={mix(1640,1155,greet)} rot={-12} scale={.8} style={GLOVE} pose={lerpPose(POSES.relaxed,POSES.reach,greet)}/></Stage></Camera><CaptionLabel t={t} from={E.friend} name="MATTHIAS" sub="THE BLACKSMITH"/></AbsoluteFill>;
};
export const Repair:React.FC<{t:number}>=({t})=>{
 const tap=track(t,[[E.repair,0],[E.repair+.45,0],[E.repair+.75,-55],[E.repair+.95,0],[E.repair+1.15,-8],[E.repair+1.4,0]]);
 return <Camera t={t} zoom={1.14} y={90} shake={3} seed={319}><Stage><Wall id="repair-wall" x={-600} y={-600} w={2400} h={2600} warm={.75} lit={.85}/><path d="M150,1550 V200 Q460,-160 770,200 V1550Z" fill="#3a2b20" stroke="#181716" strokeWidth={35}/>{[250,355,460,565,670].map(x=><path key={x} d={`M${x},80 V1550`} stroke="#1b1917" strokeWidth={6}/>)}<path d="M180,700 H750 M180,1260 H750" stroke="#171d23" strokeWidth={35}/><rect x={465} y={904} width={75} height={95} rx={7} fill="#2f3339" stroke="#93928b" strokeOpacity={.4} strokeWidth={3}/><path d="M500,944 H574" stroke="#85817a" strokeWidth={12}/><Resident id="matthias-repair" t={t} x={750} y={1190} s={1} who="matthias" hand={[-250,-110+tap]} hammer={.001} otherHand={[-188,-190]} look={.8} lean={.5}/><Candle x={125} y={1250} t={t} s={.65}/></Stage></Camera>;
};
export const Blood:React.FC<{t:number}>=({t})=>{
 const pay=prog(t,E.blood+.1,E.coin,easeOut),back=prog(t,E.coin+.15,E.coin+.5),lift=prog(t,E.cupLift,E.cupLift+.8,easeOut),pose=lerpPose(POSES.point,POSES.claw,lift);
 const [hx,hy]=wristFor(mix(350,732,lift),mix(1035,932,lift),-15,1,GLOVE,pose,true);
 return <Camera t={t} zoom={1.05+lift*.055} y={40} shake={3} seed={323}><Stage><Wall id="butcher-wall" x={-400} y={-600} w={2100} h={2600} lit={.75}/><PointedWindow x={120} y={220} w={300} h={560}/><path d="M330,190 H1050 M470,190 V290 M740,190 V305 M950,190 V270" stroke="#11181e" strokeWidth={19}/><Resident id="otto" t={t} x={840} y={1120} who="otto" s={1.04} hand={[-230,-80]} look={.3}/><path d="M-400,1080 H1600 V1170 H-400Z" fill="#513a28" stroke="#1d1712" strokeWidth={7}/><path d="M-400,1170 H1600 V1920 H-400Z" fill="#2b211a"/>
 <Coin x={350} y={mix(1490,1069,pay)} r={17}/><Coin x={385} y={mix(1490,1070,pay)} r={17}/><ClayCup x={mix(570,670,lift)} y={mix(1015,940,lift)} s={.9} lid={.18+lift*.6} blood/>
 <Hand id="purchase" x={hx-(1-pay)*170-back*(1-lift)*120} y={hy+(1-pay)*470+back*(1-lift)*200} rot={-15} scale={1} mirror style={GLOVE} pose={pose}/>
 </Stage></Camera>;
};
export const Morning:React.FC<{t:number}>=({t})=>{
 const fear=prog(t,E.deny,E.deny+.2,easeOut);
 return <Camera t={t} zoom={1.02+prog(t,E.morning,E.forge)*.12} shake={t<E.deny?4:6} seed={327}><Stage><TownStreet id="morning-square" t={t} dawn body/><path d="M-500,-500 H1600 V0 Q540,-250 0,190 V1920 H-500Z M1080,0 L1080,1920 H1600 V-500Z" fill="#05070c"/><path d="M-150,1920 V250 Q540,-180 1230,250 V1920" fill="none" stroke="#0b1018" strokeWidth={160}/>{t>=E.deny&&<Hand id="dawn-freeze" x={mix(-160,125,fear)} y={1030+noise1(t*18,40)*3} rot={35} scale={1.1} style={STYLES.creature} pose={lerpPose(POSES.reach,POSES.claw,fear)}/>}</Stage></Camera>;
};
export const Hunt:React.FC<{t:number}>=({t})=>{
 const contact=prog(t,E.forge+.2,E.forge+.65,easeOut),angle=(t-E.forge)*3.4;
 return <Camera t={t} zoom={1.16} x={40} y={-30} shake={4} seed={331}><Stage><ForgeSet id="hunt" t={t}/><g transform="translate(500,887)"><path d="M-40,110 L-90,520 H90 L40,110Z" fill="#28231f"/><circle r={112} fill="#535352" stroke="#191b20" strokeWidth={14}/><g transform={`rotate(${angle*180/Math.PI})`}>{[0,60,120].map(a=><path key={a} d="M-98,0 H98" transform={`rotate(${a})`} stroke="#858380" strokeOpacity={.32} strokeWidth={7}/>)}</g><circle r={26} fill="#171e26" stroke="#7a7a76" strokeWidth={5}/></g><Resident id="matthias-hunt" t={t} x={780} y={1100} who="matthias" hand={[-235,-70]} otherHand={[25,-30]} blade look={.7} lean={.2}/>{contact>.8&&Array.from({length:7},(_,i)=>{const q=((t*5+i*.15)%1),dx=-35-i*11;return <path key={i} d={`M${454+q*dx},${797+q*(90+i*12)} l-8,14`} fill="none" stroke={i%2?'#f1c379':'#c87a36'} strokeWidth={2.5} opacity={(1-q)*.75}/>;})}</Stage></Camera>;
};
export const Witness:React.FC<{t:number}>=({t})=>{
 const signal=prog(t,E.witness+.4,E.witness+1.3,easeOut),close=prog(t,E.witness,E.witness+.65,easeOut);
 return <Camera t={t} zoom={1.02+signal*.04} shake={4} seed={337}><Stage><Wall id="stairs-wall" x={-400} y={-600} w={2100} h={2500} warm={.2} lit={.8}/><path d="M60,1520 L60,1340 L140,1340 L140,1220 L220,1220 L220,1100 L300,1100 L300,980 L380,980 L380,860 L460,860 L460,740 L540,740 L540,620 L650,620 L650,1700 H60Z" fill="#251c17" stroke="#5e4836" strokeWidth={5}/><path d="M40,1230 L625,420 M80,1270 V1580 M270,1005 V1420 M470,730 V1150" stroke="#151312" strokeWidth={25} fill="none"/><path d="M505,620 V195 Q610,75 715,195 V620Z" fill="#0a0d13" stroke="#17171a" strokeWidth={30}/><path d={`M505,620 V195 Q${mix(595,610,close)},${mix(88,75,close)} ${mix(650,715,close)},195 V620Z`} fill="#342820" stroke="#665340" strokeWidth={3}/><path d="M510,520 H705" stroke="#131820" strokeWidth={21}/><circle cx={675} cy={465} r={9} fill="#927954"/><Resident id="marta-witness" t={t} x={815} y={1170} s={1.03} who="marta" hand={[mix(-180,-140,signal),mix(-70,-350,signal)]} look={signal*.5} lean={-.2}/><Candle x={152} y={950} t={t} s={.55}/></Stage></Camera>;
};
export const Watch:React.FC<{t:number}>=({t})=><Camera t={t} zoom={1.03+prog(t,E.watch,E.choice)*.04} shake={5} seed={341}><Stage><TownStreet id="watch-square" t={t}/><Resident id="watch-captain" t={t} x={805} y={1130} s={1.08} who="grete" hand={[-220,-80]} otherHand={[90,-100]} look={-.2}/><g transform="translate(565,1050) rotate(-12)"><path d="M-30,-40 H35 V55 H-30Z" fill="#baa88b" stroke="#5d503c" strokeWidth={3}/><path d="M-20,-20 H23 M-20,-4 H21 M-20,12 H24" stroke="#5d503c" strokeWidth={2}/><circle cx={17} cy={35} r={9} fill="#7d2528"/></g><Hand id="watch-commission" x={365} y={1470} rot={-10} scale={.85} style={GLOVE} pose={POSES.relaxed}/></Stage></Camera>;
export const Choice:React.FC<{t:number}>=({t})=>{
 const reach=prog(t,E.choice+.25,E.choice+1.1,easeOut),hesitate=prog(t,E.top,E.top+.4),p=lerpPose(POSES.relaxed,POSES.point,reach);
 return <AbsoluteFill><Camera t={t} zoom={1.08+prog(t,E.choice,E.cut)*.08} rot={noise1(t*.3,39)*.5} shake={4} seed={347}><Stage><TownStreet id="choice-town" t={t} fork/><Hand id="choose-hand" x={mix(560,530,reach)+hesitate*25} y={mix(1870,1250,reach)} rot={mix(0,-16,reach)+hesitate*9} scale={1.1} style={GLOVE} pose={p}/></Stage></Camera>{t>=E.top&&<AbsoluteFill style={{paddingTop:370,alignItems:'center',opacity:prog(t,E.top,E.top+.3)}}><div style={{fontFamily:theme.fonts.caption,fontSize:40,color:'#c7b99b',letterSpacing:5,textShadow:'0 3px 12px #000'}}>ONE ACTION. BEFORE DAWN.</div></AbsoluteFill>}</AbsoluteFill>;
};
