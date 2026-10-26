import React from 'react';
import {GothicWindow} from '../../common/art/Window';
import {Curtain, Floor, Wall} from '../../common/art/Room';
import {WeddingPhoto} from '../../common/art/Interior';
import {lerpColor} from '../../common/util';

/**
 * 16:9 set: the back bedroom, kept exactly as it was in December 1974. Bed with a man's coat laid out and a
 * dent where someone sat, a letter on the pillow, a brown armchair, a wall calendar, a photo on the bedside table.
 */
export const BB = {bed: {x: 560, y: 760}, pillow: {x: 330, y: 640}, calendar: {x: 1560, y: 330}, photo: {x: 140, y: 600}, chair: {x: 1450, y: 820}};

export const BackBedroomL: React.FC<{id: string; t: number; dent?: number; letter?: boolean; coat?: boolean}> = ({id, t, dent = 1, letter = true, coat = true}) => {
  const rim = '#8fa3c0';
  const wood = '#120d09';
  return (
    <g>
      <Wall id={`${id}-wall`} x={-500} y={-500} w={2920} h={1300} warm={0.15} lit={0.55} />
      <Floor id={`${id}-floor`} x={-500} y={800} w={2920} h={700} lit={0.5} />
      {/* small window, right of centre, moon in it */}
      <GothicWindow id={`${id}-win`} cx={1060} yb={560} w={260} h={360} t={t} light="night" cloudCover={0.5} />
      <Curtain id={`${id}-cl`} x={840} y={-200} w={170} h={800} side={-1} t={t} warm={0.2} />
      <Curtain id={`${id}-cr`} x={1110} y={-200} w={170} h={800} side={1} t={t + 1} warm={0.2} />
      {/* wall calendar, December 1974 */}
      <g transform={`translate(${BB.calendar.x},${BB.calendar.y})`}>
        <rect x={-120} y={-150} width={240} height={300} fill="#b8b0a0" />
        <rect x={-120} y={-150} width={240} height={110} fill="#5a6a5a" />
        <text x={0} y={-6} textAnchor="middle" fontFamily="CountCaption, serif" fontWeight={600} fontSize={30} fill="#1a1a1a" letterSpacing={3}>
          DECEMBER
        </text>
        <text x={0} y={26} textAnchor="middle" fontFamily="CountCaption, serif" fontWeight={600} fontSize={26} fill="#1a1a1a">
          1974
        </text>
        {Array.from({length: 35}, (_, i) => (
          <rect key={i} x={-104 + (i % 7) * 30} y={40 + Math.floor(i / 7) * 20} width={24} height={14} fill="#8a8270" opacity={0.5} />
        ))}
        <circle cx={-104 + 4 * 30 + 12} cy={40 + 2 * 20 + 7} r={14} fill="none" stroke="#8a0f12" strokeWidth={3} />
      </g>
      {/* bedside table with the photo */}
      <rect x={BB.photo.x - 100} y={BB.photo.y + 70} width={200} height={240} fill={wood} />
      <rect x={BB.photo.x - 100} y={BB.photo.y + 70} width={200} height={5} fill={rim} opacity={0.3} />
      <g transform={`translate(${BB.photo.x},${BB.photo.y}) scale(0.32)`}>
        <rect x={-150} y={-180} width={300} height={360} rx={6} fill="#2a1a0e" />
        <WeddingPhoto lit={0.6} />
      </g>
      {/* the bed: iron headboard, pillow, eiderdown */}
      <g transform={`translate(${BB.bed.x},${BB.bed.y})`}>
        <path d="M-360,-300 L-360,40 M-360,-300 Q-200,-360 -40,-300 L-40,40" stroke="#1a1c22" strokeWidth={14} fill="none" />
        {[-300, -240, -180, -120].map((bx) => (
          <path key={bx} d={`M${bx},-320 L${bx},-90`} stroke="#1a1c22" strokeWidth={8} />
        ))}
        <path d="M-380,-80 L560,-60 L620,120 L-420,120 Z" fill="#3a3448" />
        <path d="M-380,-80 L560,-60" stroke={rim} strokeOpacity={0.3} strokeWidth={3} />
        <ellipse cx={-230} cy={-110} rx={150} ry={50} fill="#9aa0ae" />
        {/* the dent where someone sat */}
        <ellipse cx={330} cy={-30} rx={150} ry={38} fill="#000" opacity={0.45 * dent} />
        {coat && (
          <g>
            <path d="M-60,-70 C40,-96 200,-92 300,-70 L320,40 C200,30 40,34 -80,40 Z" fill="#14100c" />
            <path d="M-60,-70 C40,-96 200,-92 300,-70" stroke={rim} strokeOpacity={0.3} strokeWidth={3} fill="none" />
            <path d="M120,-86 L140,40" stroke="#000" strokeWidth={4} />
            {[0, 1, 2].map((k) => (
              <circle key={k} cx={156} cy={-60 + k * 30} r={5} fill="#2a2420" />
            ))}
          </g>
        )}
        {letter && (
          <g transform="translate(-230,-128) rotate(-6)">
            <rect x={-70} y={-24} width={140} height={60} fill="#cfc7b2" />
            <path d="M-70,-24 L0,10 L70,-24" stroke="#8a8270" strokeWidth={2} fill="none" />
          </g>
        )}
      </g>
      {/* brown armchair, right */}
      <g transform={`translate(${BB.chair.x},${BB.chair.y})`}>
        <path d="M-170,0 L-170,-260 Q0,-320 170,-260 L170,0 Z" fill="#2e1c10" />
        <rect x={-210} y={-150} width={80} height={170} rx={30} fill="#3a2414" />
        <rect x={130} y={-150} width={80} height={170} rx={30} fill="#3a2414" />
        <rect x={-150} y={-110} width={300} height={100} rx={20} fill="#3a2414" />
        <path d="M-170,-260 Q0,-320 170,-260" stroke={rim} strokeOpacity={0.25} strokeWidth={3} fill="none" />
      </g>
      <rect x={-500} y={-500} width={2920} height={2000} fill={lerpColor('#000', '#102030', 0.2)} opacity={0.25} />
    </g>
  );
};
