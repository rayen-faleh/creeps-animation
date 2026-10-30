import React from 'react';
import {ClovesBackFigure} from '../art/ClovesBackFigure';
import {CAMERA,REFLECTION_CAMERA,V3,MIRROR,add,sub,dot,project,framePath,vertexPath,reflectedArtMatrix,SAFWAN_ROOT,SAFWAN_U,SAFWAN_V,onMirror,frontOfMirror,clipToMirror} from './PlanarReflection';
type V=[number,number];
export type MirrorPose={hand:V;otherHand:V;turn:number};
type Face={p:V3[];color:string;normal:V3};
const middle=(p:V3[]):V3=>[p.reduce((s,v)=>s+v[0],0)/p.length,p.reduce((s,v)=>s+v[1],0)/p.length,p.reduce((s,v)=>s+v[2],0)/p.length];
const distance=(p:V3,c:V3)=>dot(sub(p,c),sub(p,c));
const box=(x0:number,y0:number,z0:number,x1:number,y1:number,z1:number,c:string):Face[]=>[
 {p:[[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]],color:c,normal:[0,1,0]},
 {p:[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0]],color:'#302921',normal:[0,0,-1]},
 {p:[[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],color:'#2a2522',normal:[0,0,1]},
 {p:[[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0]],color:'#3d3027',normal:[-1,0,0]},
 {p:[[x1,y0,z0],[x1,y0,z1],[x1,y1,z1],[x1,y1,z0]],color:'#241f1c',normal:[1,0,0]}
];
const stairFaces=(rail=false):Face[]=>{
 const faces:Face[]=[];
 for(let i=0;i<9;i++){
  const x=.10+i*.22,y=.385+i*.14;
  if(!rail){
   faces.push({p:[[x,y,2],[x+.22,y,2],[x+.22,y,3.12],[x,y,3.12]],color:i%2?'#69523c':'#5b4633',normal:[0,1,0]});
   const prev=i===0?.18:y-.14;
   faces.push({p:[[x,prev,2],[x,prev,3.12],[x,y,3.12],[x,y,2]],color:'#493525',normal:[-1,0,0]});
  }
  else{
   faces.push(...box(x-.025,y,3.14,x+.025,y+.78,3.19,'#74583e'));
   const nextX=x+.22,nextY=y+.14;
   faces.push({p:[[x,y+.76,3.13],[nextX,nextY+.76,3.13],[nextX,nextY+.83,3.18],[x,y+.83,3.18]],color:'#72563b',normal:[0,0,1]});
   faces.push({p:[[x,y+.83,3.13],[nextX,nextY+.83,3.13],[nextX,nextY+.83,3.21],[x,y+.83,3.21]],color:'#a07f59',normal:[0,1,0]});
  }
 }
 if(!rail){
  const shape=(z:number):V3[]=>{const p:V3[]=[[.1,.18,z],[2.08,.18,z],[2.08,1.505,z]];
   for(let i=8;i>=0;i--){const x=.1+i*.22,y=.385+i*.14;p.push([x,y,z]);if(i>0)p.push([x,y-.14,z]);}return p;};
  faces.push({p:shape(3.12),color:'#30251e',normal:[0,0,1]},{p:shape(2),color:'#352b23',normal:[0,0,-1]});
 }
 return faces;
};
const visibleFaces=(faces:Face[],reflected:boolean)=>{
 const c=reflected?REFLECTION_CAMERA:CAMERA;
 return faces.map(f=>reflected?{...f,p:clipToMirror(f.p)}:f).filter(f=>f.p.length>=3&&dot(f.normal,sub(c,middle(f.p)))>0).sort((a,b)=>distance(middle(b.p),c)-distance(middle(a.p),c));
};
const drawFace=(f:Face,i:string|number,reflected:boolean)=><path key={i} d={vertexPath(f.p,reflected)} fill={f.color} stroke={reflected?'#555345':'#120f0e'} strokeOpacity={reflected?.37:.9} strokeWidth={reflected?1.5:3} strokeLinejoin="round"/>;
/** Both passes use these same real three-dimensional stair treads and posts. */
export const SpatialStairs:React.FC<{front?:boolean}>=({front=false})=><g>{visibleFaces(stairFaces(front),false).map((f,i)=>drawFace(f,i,false))}</g>;

export const ProjectedMirror:React.FC<{id:string;t:number;pose?:MirrorPose}>=({id,t,pose})=>{
 const glass=framePath(0),outer=framePath(.14);
 // Room surfaces visible from the virtual camera face the opposite direction to the main shot.
 const room:Face[]=[
  {p:[[-4,0,2.4],[4,0,2.4],[4,0,7.6],[-4,0,7.6]],color:'#252a2b',normal:[0,1,0]},
  {p:[[-4,0,7.6],[4,0,7.6],[4,4.2,7.6],[-4,4.2,7.6]],color:'#252c34',normal:[0,0,-1]},
  ...box(-2.6,0,4.5,-.1,.92,4.9,'#55412d'),
  ...stairFaces(false),...stairFaces(true)
 ];
 // Opposite wall timber beams, seen behind the reflected human instead of repeating the camera view.
 for(const x of [-3,-1.4,.2,1.8,3.4])room.push(...box(x-.045,0,7.52,x+.045,4.1,7.59,'#42372c'));
 room.push(...box(-4,2.8,7.49,4,2.88,7.6,'#4c3928'));
 const c=REFLECTION_CAMERA;
 const layers:Array<{depth:number;node:React.ReactNode}>=visibleFaces(room,true).map((f,i)=>({depth:distance(middle(f.p),c),node:drawFace(f,`rf-${i}`,true)}));
 if(pose){
  const forward:V3=[0,0,1],frontVisible=dot(forward,sub(c,SAFWAN_ROOT))>0;
  if(frontVisible)throw new Error('This shot requires the mirror camera to see Safwan from behind');
  const mat=reflectedArtMatrix(SAFWAN_ROOT,SAFWAN_U,SAFWAN_V,-220,-600);
  layers.push({depth:distance(add(SAFWAN_ROOT,[0,.45,0]),c),node:<foreignObject key="human-back-view" x={0} y={0} width={1080} height={1920}>
   <div style={{position:'relative',width:1080,height:1920,overflow:'visible'}}>
    <svg width={440} height={950} viewBox="-220 -600 440 950" style={{position:'absolute',left:0,top:0,overflow:'visible',transformOrigin:'0 0',transform:mat}}>
     <ClovesBackFigure t={t} hand={pose.hand} otherHand={pose.otherHand} turn={pose.turn}/>
    </svg>
   </div>
  </foreignObject>});
 }
 layers.sort((a,b)=>b.depth-a.depth);
 const crest=[onMirror(-.27,MIRROR.height+.13),onMirror(0,MIRROR.height+.43),onMirror(.28,MIRROR.height+.13),onMirror(.11,MIRROR.height+.08),onMirror(0,MIRROR.height+.2),onMirror(-.11,MIRROR.height+.08)];
 return <g>
  <defs><clipPath id={`${id}-clip`}><path d={glass}/></clipPath><linearGradient id={`${id}-gold`}><stop stopColor="#b99950"/><stop offset=".45" stopColor="#705524"/><stop offset="1" stopColor="#302514"/></linearGradient></defs>
  <path d={vertexPath(crest)} fill={`url(#${id}-gold)`} stroke="#17120b" strokeWidth={4}/>
  <path d={outer} fill={`url(#${id}-gold)`} stroke="#120e08" strokeWidth={5}/><path d={outer} fill="none" stroke="#b79d5c" strokeOpacity={.5} strokeWidth={5} strokeDasharray="4 10"/>
  <path d={glass} fill="#111b27" stroke="#211b13" strokeWidth={9}/>
  <g clipPath={`url(#${id}-clip)`}>
   <path d={glass} fill="#1c2835"/>{layers.map(l=>l.node)}
   <path d={glass} fill="#b9cfdf" opacity={.035}/>
  </g>
 </g>;
};
