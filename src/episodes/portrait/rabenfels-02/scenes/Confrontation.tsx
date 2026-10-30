import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera,Stage} from '../../../../kit/rabenfels/fx';
import {ClovesFigure} from '../../../../kit/rabenfels/art/ClovesCharacters';
import {TavernLanding} from '../../../../kit/rabenfels/sets/TavernLanding';
import {WatchLantern} from '../../../../kit/rabenfels/art/ClovesProps';
import {Hand,POSES,lerpPose,wristFor} from '../../../../kit/rabenfels/art/Hand';
import {mix,prog,track,noise1} from '../../../../kit/rabenfels/util';
import {theme} from '../../../../kit/rabenfels/theme';
import {GLOVE} from './Investigation';
import E from '../events.json';

export const Confrontation:React.FC<{t:number}>=({t})=>{
 const firstStep=prog(t,E.stairs+.22,E.stairs+.85),secondStep=prog(t,E.stairs+1.05,E.stairs+1.75),rootX=855-firstStep*65-secondStep*30,rootY=850+firstStep*100,s=.78;
 // Each foot stays on a world-space stair tread until its authored swing.
 const a=prog(t,E.stairs+.22,E.stairs+.85),b=prog(t,E.stairs+1.05,E.stairs+1.75);
 const worldA:[number,number]=[mix(832,717,a),mix(1076,1183,a)-Math.sin(a*Math.PI)*39];
 const worldB:[number,number]=[mix(907,800,b),mix(1022,1129,b)-Math.sin(b*Math.PI)*36];
 const feet:[[number,number],[number,number]]=[[(worldA[0]-rootX)/s,(worldA[1]-rootY)/s],[(worldB[0]-rootX)/s,(worldB[1]-rootY)/s]];
 const toBoy=prog(t,E.target,E.target+.6),demand=prog(t,E.demand,E.demand+1.0),reach=prog(t,E.reach+.12,E.reach+1.8),wHand:[number,number]=[mix(-150-demand*38,-270,reach),mix(-45-demand*80,-160,reach)],sTurn=prog(t,E.turn,E.turn+.8),panic=prog(t,E.what-.15,E.what+.25),whistle=prog(t,E.demand,E.secret);
 const view=t<E.target?'proof':t<E.turn?'villain':t<E.reach?'reaction':'danger';
 // The proof: on him coming down; on "In the mirror" the camera crosses to the glass and holds on the empty stairs;
 // then it pulls back so the man and his missing reflection share one frame before he turns to Safwan.
 const P:[number,number,number,number][]=[[E.stairs,1.3,220,-90],[E.mirror-.05,1.42,240,-100],[E.mirror+.6,1.45,-305,-160],[E.mirror+1.75,1.5,-300,-160],[E.target-.15,1.0,0,0]];
 const at=(k:1|2|3)=>track(t,P.map(p=>[p[0],p[k]] as [number,number]));
 const z=view==='proof'?at(1):view==='villain'?1.38:view==='reaction'?1.55:1.16;
 const x=view==='proof'?at(2):view==='villain'?150:view==='reaction'?-105:0,y=view==='proof'?at(3):view==='villain'?-80:view==='reaction'?-80:0;
 const sHand:[number,number]=[-165+whistle*80,-95-whistle*90],sOther:[number,number]=[90,-60];
 const rise=prog(t,E.question+.3,E.top+1),pose=lerpPose(POSES.relaxed,POSES.reach,rise),[hx,hy]=wristFor(470+rise*30,1350-rise*330,-6,1.08,GLOVE,pose,true);
 return <AbsoluteFill><Camera t={t} zoom={z} x={x} y={y} shake={t>=E.question?1.8:3} seed={439}><Stage overflow>
  <TavernLanding id="witness-staircase" t={t} reflectionPose={t>=E.target?{hand:sHand,otherHand:sOther,turn:.1+sTurn*.9}:undefined} foreground={t>=E.question?<Hand id="elias-interrupt" x={hx} y={hy} rot={-6} scale={1.08} style={GLOVE} pose={pose} mirror/>:undefined}>
   <ClovesFigure id="witness-body" t={t} kind="witness" x={rootX} y={rootY} s={s} feet={feet} hand={wHand} otherHand={[112,-95]} turn={.05+toBoy*.16} lean={reach*.65} claw={demand*.45+reach*.55} mouth={t>=E.demand&&t<E.turn?.22:0}/>
   {t>=E.target&&<g><ClovesFigure id="safwan-danger" t={t} kind="safwan" x={365} y={1190} s={.85} hand={sHand} otherHand={sOther} mirror turn={.1+sTurn*.9} alarm={panic} mouth={t>=E.what&&t<E.reach?.8:0}/><WatchLantern id="danger-lantern" t={t} x={365-sOther[0]*.85} y={1190+sOther[1]*.85+60} s={.62}/>{t>=E.wool&&t<E.demand&&<g transform={`translate(${365-sHand[0]*.85},${1190+sHand[1]*.85})`}><path d="M0,-6 q-14,-40 6,-80 q18,-34 -6,-74" stroke="#07080b" strokeWidth={7} fill="none"/><path d="M0,-6 q-14,-40 6,-80 q18,-34 -6,-74" stroke="#c8d3e3" strokeOpacity={.4} strokeWidth={2} fill="none"/></g>}{whistle>0&&<g transform={`translate(${365-sHand[0]*.85},${1190+sHand[1]*.85}) rotate(-15)`}><path d="M-14,-15 H21 V6 L8,17 H-14Z" fill="#a29270" stroke="#4a4437" strokeWidth={3}/><path d="M2,-12 V10" stroke="#403c34" strokeWidth={3}/></g>}</g>}
  </TavernLanding>
 </Stage></Camera>
 {t>=E.top&&<div style={{position:'absolute',top:1190,left:120,width:840,textAlign:'center',fontFamily:theme.fonts.caption,fontSize:40,letterSpacing:2,color:'#bfb098',textShadow:'0 3px 14px #000'}}>Winning author joins Rabenfels.</div>}
 </AbsoluteFill>;
};
