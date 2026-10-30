/** Original 2.5D planar mirror projection. No manually positioned reflection clones. */
export type V3=[number,number,number];
export const CAMERA:V3=[0,1.65,6];
export const LENS={f:1200,cx:540,cy:770};
const yaw=Math.PI/6;
export const MIRROR={origin:[-.925,.4133333333,2] as V3,normal:[Math.sin(yaw),0,Math.cos(yaw)] as V3,u:[Math.cos(yaw),0,-Math.sin(yaw)] as V3,width:1.22,height:2.5266666667};
export const dot=(a:V3,b:V3)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
export const add=(a:V3,b:V3):V3=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
export const sub=(a:V3,b:V3):V3=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
export const mul=(a:V3,s:number):V3=>[a[0]*s,a[1]*s,a[2]*s];
export const reflectPoint=(p:V3):V3=>sub(p,mul(MIRROR.normal,2*dot(sub(p,MIRROR.origin),MIRROR.normal)));
export const reflectVector=(p:V3):V3=>sub(p,mul(MIRROR.normal,2*dot(p,MIRROR.normal)));
export const REFLECTION_CAMERA=reflectPoint(CAMERA);
export const project=(p:V3,reflected=false):[number,number]=>{
 const q=reflected?reflectPoint(p):p,d=CAMERA[2]-q[2];
 return [LENS.cx+LENS.f*(q[0]-CAMERA[0])/d,LENS.cy-LENS.f*(q[1]-CAMERA[1])/d];
};
export const unproject=(x:number,y:number,z:number):V3=>[(x-LENS.cx)*(CAMERA[2]-z)/LENS.f,CAMERA[1]-(y-LENS.cy)*(CAMERA[2]-z)/LENS.f,z];
export const onMirror=(u:number,v:number):V3=>add(MIRROR.origin,add(mul(MIRROR.u,u),[0,v,0]));
export const frontOfMirror=(p:V3)=>dot(sub(p,MIRROR.origin),MIRROR.normal)>0;
export const clipToMirror=(pts:V3[]):V3[]=>{
 const out:V3[]=[];
 for(let i=0;i<pts.length;i++){
  const a=pts[i],b=pts[(i+1)%pts.length],da=dot(sub(a,MIRROR.origin),MIRROR.normal),db=dot(sub(b,MIRROR.origin),MIRROR.normal);
  if(da>=0)out.push(a);
  if((da>=0)!==(db>=0))out.push(add(a,mul(sub(b,a),da/(da-db))));
 }
 return out;
};
export const vertexPath=(pts:V3[],reflected=false)=>pts.map((p,i)=>`${i?'L':'M'}${project(p,reflected).join(',')}`).join(' ')+' Z';
export const framePath=(border=0)=>{
 const w=MIRROR.width+border*2,h=MIRROR.height+border,ry=MIRROR.width*.35+border;
 const p:V3[]=[];
 for(let i=0;i<=32;i++){const a=Math.PI*i/32;p.push(onMirror(-Math.cos(a)*w/2,h-ry+Math.sin(a)*ry));}
 p.push(onMirror(w/2,-border),onMirror(-w/2,-border));return vertexPath(p);
};
/** Exact homography for an illustrated plane viewed through this geometric mirror. */
export const reflectedArtMatrix=(root:V3,ux:V3,uy:V3,minX:number,minY:number)=>{
 const r=reflectPoint(add(root,add(mul(ux,minX),mul(uy,minY)))),a=reflectVector(ux),b=reflectVector(uy);
 const d=CAMERA[2]-r[2],dx=-a[2],dy=-b[2],{f,cx,cy}=LENS;
 const h00=(cx*dx+f*a[0])/d,h01=(cx*dy+f*b[0])/d,h02=cx+f*(r[0]-CAMERA[0])/d;
 const h10=(cy*dx-f*a[1])/d,h11=(cy*dy-f*b[1])/d,h12=cy-f*(r[1]-CAMERA[1])/d;
 return `matrix3d(${[h00,h10,0,dx/d,h01,h11,0,dy/d,0,0,1,0,h02,h12,0,1].join(',')})`;
};
export const SAFWAN_ROOT=unproject(365,1190,3);
export const ART_SCALE=.85/(LENS.f/(CAMERA[2]-SAFWAN_ROOT[2]));
export const SAFWAN_U:V3=[-ART_SCALE,0,0],SAFWAN_V:V3=[0,-ART_SCALE,0];
export const safwanPoint=(x:number,y:number):V3=>add(SAFWAN_ROOT,add(mul(SAFWAN_U,x),mul(SAFWAN_V,y)));
