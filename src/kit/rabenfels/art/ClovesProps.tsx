import React from 'react';
import {Candle} from './Props';

export const Cloves:React.FC<{x:number;y:number;s?:number}>=({x,y,s=1})=><g transform={`translate(${x},${y}) scale(${s})`}>
 {[-42,-8,24,55].map((n,i)=><g key={i} transform={`translate(${n},${i%2*15}) rotate(${-35+i*29})`}><path d="M0,0 L0,46" stroke="#6b4328" strokeWidth={9}/><path d="M-14,-4 L-7,-18 L7,-17 L17,-3 L8,9 L-8,8Z" fill="#302017" stroke="#ad7950" strokeOpacity={.65} strokeWidth={3}/></g>)}
</g>;
export const WatchLantern:React.FC<{id:string;t:number;x:number;y:number;s?:number}>=({id,t,x,y,s=1})=><g id={id} transform={`translate(${x},${y}) scale(${s})`}>
 <path d="M-20,-13 C-50,-90 50,-90 20,-13" fill="none" stroke="#4e4e48" strokeWidth={9}/><path d="M-55,0 L55,0 L70,26 L57,150 L-57,150 L-70,26Z" fill="#b68b4d" fillOpacity={.21} stroke="#1a1b1b" strokeWidth={12}/><path d="M-55,0 L0,-27 L55,0Z M-70,150 H70 L48,173 H-48Z" fill="#272b2b" stroke="#757565" strokeOpacity={.6} strokeWidth={4}/><Candle x={0} y={138} s={.4} t={t}/><path d="M-35,10 V145 M35,10 V145 M-63,77 H63" stroke="#35372f" strokeWidth={8}/><path d="M-51,13 L-59,139" stroke="#e2c693" strokeOpacity={.45} strokeWidth={3}/>
</g>;
export const BlackCoat:React.FC<{x:number;y:number;s?:number;twist?:number}>=({x,y,s=1,twist=0})=><g transform={`translate(${x},${y}) scale(${s}) rotate(${twist*4})`}>
 <path d={`M-70,-95 L-125,-74 L-206,${110+twist*12} L-140,144 L-81,38 L-98,255 Q-3,288 96,254 L78,36 L141,145 L207,109 L125,-75 L70,-95Z`} fill="#1d2026" stroke="#080b10" strokeWidth={5}/><path d="M-70,-95 L-18,-38 L-39,15 L0,235 L34,16 L18,-38 L70,-95" fill="#282c32" stroke="#6b6e70" strokeOpacity={.4} strokeWidth={3}/><path d="M0,0 V250 M-76,88 L-64,234 M76,84 L63,234" stroke="#080c12" strokeWidth={5}/><path d="M-183,111 l13,8 l-9,12 l13,2 l-8,15" stroke="#9b998b" strokeWidth={3} fill="none"/>
</g>;
export const WashBasin:React.FC<{x:number;y:number;s?:number;ripple?:number}>=({x,y,s=1,ripple=0})=><g transform={`translate(${x},${y}) scale(${s})`}><ellipse cx={0} cy={0} rx={230} ry={67} fill="#514438" stroke="#b9a17d" strokeWidth={8}/><ellipse cx={0} cy={0} rx={210} ry={52} fill="#263239"/><ellipse cx={20} cy={2} rx={65+ripple*95} ry={15+ripple*22} fill="none" stroke="#8da3ad" strokeOpacity={.3*(1-ripple)} strokeWidth={3}/><path d="M-231,0 Q-215,154 0,153 Q214,153 231,0 L221,63 Q203,170 0,172 Q-206,170 -221,64Z" fill="#3c3027" stroke="#15110f" strokeWidth={5}/><path d="M-190,65 Q0,153 190,65 M-155,105 Q0,173 155,105" fill="none" stroke="#877052" strokeOpacity={.5} strokeWidth={6}/></g>;
