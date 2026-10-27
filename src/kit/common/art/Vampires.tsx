import React from 'react';
import {lerpColor, noise1} from '../util';

/* Two vampires for comedy contrast: the Hollywood one (cheekbones, slicked hair, a high-collared velvet coat, a rose) and
   the folklore one (a swollen, ruddy corpse in a shroud, a smear at the mouth). Plus a caped standing silhouette and a
   crate of grave soil. Generic designs: no recognisable film character. */

/** Hollywood vampire, head-and-shoulders profile facing left. Origin at the neck. warm 0..1 = candle rim. */
export const HollywoodVampire: React.FC<{x: number; y: number; s?: number; t: number; warm?: number; rose?: boolean}> = ({x, y, s = 1, t, warm = 1, rose = true}) => {
  const rim = lerpColor('#9fb4cf', '#ffb45a', warm);
  const breathe = Math.sin(t * 1.4) * 2;
  return (
    <g transform={`translate(${x},${y + breathe}) scale(${s})`}>
      {/* velvet coat with a high stiff collar */}
      <path d="M-360,700 C-340,420 -200,300 -40,280 L180,280 C330,300 440,420 460,700 Z" fill="#14070c" />
      <path d="M-60,300 L-150,60 L-40,170 L20,290 Z" fill="#2a0c14" />
      <path d="M200,300 L300,40 L150,190 L120,290 Z" fill="#1c0810" />
      <path d="M-150,60 L-40,170" stroke={rim} strokeOpacity={0.6} strokeWidth={4} />
      <path d="M-360,700 C-340,420 -200,300 -40,280" stroke={rim} strokeOpacity={0.45} strokeWidth={4} fill="none" />
      {/* white shirt and cravat */}
      <path d="M-10,290 L60,420 L120,290 Z" fill="#d8d0c4" />
      {/* neck */}
      <path d="M0,300 L10,140 L110,140 L120,300 Z" fill="#c8c0b8" />
      {/* head in profile: high cheekbone, strong jaw, slicked-back hair with a widow's peak */}
      <path d="M40,150 C10,150 -40,120 -60,80 L-74,40 L-96,30 L-84,6 L-104,-30 L-90,-40 C-92,-80 -80,-130 -40,-160 C10,-196 100,-196 140,-150 C170,-110 172,-40 150,20 C140,70 120,120 110,150 Z" fill="#d8d0c8" />
      <path d="M-46,-10 C-26,14 6,30 46,32" stroke="#8a7a76" strokeOpacity={0.5} strokeWidth={6} fill="none" />
      <path d="M-104,-30 L-90,-40 C-92,-80 -80,-130 -40,-160" stroke={rim} strokeOpacity={0.8} strokeWidth={4} fill="none" />
      <path d="M-60,80 L-74,40 L-96,30 L-84,6 L-104,-30" stroke={rim} strokeOpacity={0.7} strokeWidth={3} fill="none" />
      {/* hair */}
      <path d="M-90,-110 C-80,-170 0,-214 80,-200 C150,-190 190,-140 180,-70 C176,-40 160,-10 150,10 C150,-60 120,-120 60,-140 C20,-150 -20,-130 -50,-150 C-60,-130 -76,-118 -90,-110 Z" fill="#0c0a0c" />
      <path d="M-90,-110 C-80,-170 0,-214 80,-200" stroke={rim} strokeOpacity={0.5} strokeWidth={3} fill="none" />
      {/* eye and a dark brow */}
      <path d="M-62,-70 L-30,-78" stroke="#1a1214" strokeWidth={7} strokeLinecap="round" />
      <ellipse cx={-48} cy={-56} rx={9} ry={5} fill="#f2e8e0" />
      <circle cx={-52} cy={-56} r={3.5} fill="#7a0a10" />
      {/* a rose pinned at the lapel */}
      {rose && (
        <g transform="translate(-150,330)">
          <circle r={26} fill="#7a0a12" />
          <path d="M-14,-6 C-6,-20 10,-18 14,-4 C6,-10 -6,-10 -14,-6 Z" fill="#c4161c" />
          <path d="M-20,8 C-4,18 12,16 20,6" stroke="#4a0408" strokeWidth={3} fill="none" />
        </g>
      )}
    </g>
  );
};

/**
 * The folklore vampire, front-on bust: a swollen, ruddy corpse in a burial shroud, hair loose, a dark smear at the
 * mouth, nails grown long. wave 0..1 lifts a bloated hand in a friendly wave. Origin at the chin.
 */
export const FolkloreVampire: React.FC<{x: number; y: number; s?: number; t: number; wave?: number; lit?: number}> = ({x, y, s = 1, t, wave = 0, lit = 1}) => {
  const bob = Math.sin(t * 1.1) * 3;
  const wv = wave > 0 ? Math.sin(t * 9) * 18 * wave : 0;
  return (
    <g transform={`translate(${x},${y + bob}) scale(${s})`}>
      {/* shroud */}
      <path d="M-380,800 C-380,460 -280,300 -140,250 L140,250 C280,300 380,460 380,800 Z" fill="#b8b2a2" />
      {[-200, -90, 30, 160].map((k) => (
        <path key={k} d={`M${k},280 C${k + 20},460 ${k - 10},620 ${k + 10},800`} stroke="#7a7466" strokeWidth={6} fill="none" opacity={0.7} />
      ))}
      <path d="M-380,800 C-380,460 -280,300 -140,250" stroke="#9fb4cf" strokeOpacity={0.4 * lit} strokeWidth={4} fill="none" />
      {/* the swollen head: round, ruddy, puffy cheeks, a hood of shroud */}
      <path d="M-230,60 C-260,-160 -150,-320 0,-320 C150,-320 260,-160 230,60 C200,200 100,260 0,260 C-100,260 -200,200 -230,60 Z" fill="#a8b0a0" />
      <ellipse cx={0} cy={-20} rx={180} ry={200} fill="#b0524a" />
      <ellipse cx={-110} cy={30} rx={70} ry={56} fill="#c0605a" />
      <ellipse cx={110} cy={30} rx={70} ry={56} fill="#c0605a" />
      <path d="M-180,-60 C-160,-180 -60,-230 0,-226 C60,-230 160,-180 180,-60" stroke="#2a1a14" strokeWidth={14} fill="none" opacity={0.7} />
      {/* loose dark hair under the hood */}
      <path d="M-170,-120 C-140,-210 -40,-240 0,-236 C60,-240 150,-200 176,-110 C120,-170 40,-190 0,-180 C-50,-180 -120,-170 -170,-120 Z" fill="#1a1210" />
      {/* small sunken eyes, a fat nose, a mouth with a dark smear */}
      <ellipse cx={-62} cy={-50} rx={16} ry={10} fill="#1a0a08" />
      <ellipse cx={62} cy={-50} rx={16} ry={10} fill="#1a0a08" />
      <circle cx={-58} cy={-52} r={3} fill="#e8d8b0" opacity={0.8} />
      <circle cx={66} cy={-52} r={3} fill="#e8d8b0" opacity={0.8} />
      <ellipse cx={0} cy={10} rx={30} ry={22} fill="#9a3e38" />
      <path d="M-50,80 C-20,96 20,96 50,80" stroke="#3a0a08" strokeWidth={8} fill="none" />
      <path d="M-10,90 C-14,120 -6,140 -16,170 C0,150 6,124 10,92 Z" fill="#5a0a0c" />
      {/* the wave: a puffy hand with long yellowed nails */}
      <g transform={`translate(260,260) rotate(${-20 + wv})`} opacity={wave > 0.01 ? 1 : 0}>
        <path d="M-50,120 L-40,-10 C-40,-60 40,-60 44,-10 L54,120 Z" fill="#b8b2a2" />
        <ellipse cx={0} cy={-60} rx={58} ry={50} fill="#b0524a" />
        {[-36, -12, 12, 36].map((fx, i) => (
          <g key={i}>
            <rect x={fx - 11} y={-150 + Math.abs(i - 1.5) * 10} width={22} height={80} rx={11} fill="#b0524a" />
            <path d={`M${fx - 6},${-150 + Math.abs(i - 1.5) * 10} l3,-26 l6,0 l3,26 Z`} fill="#c8b880" />
          </g>
        ))}
      </g>
      <path d="M-180,-20 C-200,-140 -120,-220 0,-220" stroke="#ffb45a" strokeOpacity={0.15 * lit} strokeWidth={4} fill="none" />
    </g>
  );
};

/** A caped man standing, full silhouette, facing camera, feet at the origin (~1000 tall). */
export const CapedFigure: React.FC<{x: number; y: number; s?: number; t: number; rim?: string; rimA?: number}> = ({x, y, s = 1, t, rim = '#9fb4cf', rimA = 0.5}) => {
  const flap = noise1(t * 1.5, 4) * 10;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d={`M-60,-860 L60,-860 L120,-780 C${300 + flap},-500 ${330 + flap},-200 ${340 + flap},0 L-${340 - flap},0 C-${330 - flap},-200 -${300 - flap},-500 -120,-780 Z`} fill="#050306" />
      {/* collar points and head */}
      <path d="M-120,-780 L-200,-960 L-60,-860 Z M120,-780 L200,-960 L60,-860 Z" fill="#050306" />
      <ellipse cx={0} cy={-930} rx={62} ry={78} fill="#050306" />
      <path d="M-62,-930 C-60,-990 -20,-1010 0,-1008 C30,-1010 60,-990 62,-930" stroke={rim} strokeOpacity={rimA} strokeWidth={4} fill="none" />
      <path d={`M120,-780 C${300 + flap},-500 ${330 + flap},-200 ${340 + flap},0`} stroke={rim} strokeOpacity={rimA * 0.8} strokeWidth={4} fill="none" />
      <path d="M-200,-960 L-120,-780 M200,-960 L120,-780" stroke={rim} strokeOpacity={rimA} strokeWidth={3} />
      <circle cx={-22} cy={-934} r={5} fill="#c4161c" opacity={0.9} />
      <circle cx={22} cy={-934} r={5} fill="#c4161c" opacity={0.9} />
    </g>
  );
};

/** A wooden crate heaped with grave soil. Origin at the bottom centre. */
export const SoilCrate: React.FC<{x: number; y: number; s?: number; lit?: number}> = ({x, y, s = 1, lit = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-200,-60 C-150,-130 -40,-150 20,-140 C100,-150 170,-120 200,-60 Z" fill="#2a1e14" />
    {Array.from({length: 14}, (_, i) => (
      <circle key={i} cx={-170 + i * 26} cy={-70 - (i % 3) * 12} r={6 + (i % 4) * 2} fill="#1a120c" />
    ))}
    <rect x={-220} y={-80} width={440} height={80} fill="#4a3220" />
    {[-180, -60, 60, 180].map((px) => (
      <rect key={px} x={px - 4} y={-80} width={8} height={80} fill="#2a1c10" />
    ))}
    <path d="M-220,-40 L220,-40" stroke="#2a1c10" strokeWidth={6} />
    <path d="M-220,-80 L220,-80" stroke="#9fb4cf" strokeOpacity={0.3 * lit} strokeWidth={3} />
    <text x={0} y={-20} textAnchor="middle" fontFamily="CountCaption, serif" fontWeight={600} fontSize={26} fill="#1a1008" opacity={0.7}>
      EARTH · FRAGILE
    </text>
  </g>
);
