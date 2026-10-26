import React from 'react';
import {lerpColor, noise1} from '../util';

/** Pointed-arch path: straight jambs from yb up to ys, two arcs meeting at the apex. */
const arch = (x0: number, w: number, ys: number, yb: number, rFac = 0.82) => {
  const r = w * rFac;
  const ah = Math.sqrt(r * r - (r - w / 2) * (r - w / 2));
  return {d: `M${x0},${yb} L${x0},${ys} A${r},${r} 0 0 1 ${x0 + w / 2},${ys - ah} A${r},${r} 0 0 1 ${x0 + w},${ys} L${x0 + w},${yb} Z`, ah};
};

export type DoorProps = {
  id: string;
  cx: number; // centre x of the doorway
  yb: number; // floor line (bottom of the door)
  w: number; // opening width
  h: number; // apex height above yb
  t: number;
  light?: 'night' | 'candle';
  open?: number; // 0 closed .. 1 swung wide (hinged on the left, opens away from us)
  knock?: number; // 0..1 the leaf jolts in its frame (knocking, something pushing)
  under?: number; // 0..1 light leaking under the door and through the keyhole from the far side
  underColor?: string; // colour of that light
  beyond?: React.ReactNode; // drawn inside the doorway behind the leaf (a corridor, a figure, eyes)
};

/**
 * Gothic oak plank door in a stone surround: pointed arch, iron strap hinges, ring pull, keyhole.
 * Same light vocabulary as GothicWindow: 'night' = cold moonlit rims, 'candle' = warm rims.
 */
export const GothicDoor: React.FC<DoorProps> = ({
  id,
  cx,
  yb,
  w,
  h,
  t,
  light = 'night',
  open = 0,
  knock = 0,
  under = 0,
  underColor = '#ffb45a',
  beyond,
}) => {
  const x0 = cx - w / 2;
  const ys = yb - h + w * 0.42;
  const op = arch(x0, w, ys, yb);
  const f = w * 0.11;
  const frame = arch(x0 - f, w + 2 * f, ys, yb, 0.8);
  const warm = light === 'candle' ? 1 : 0;
  const stone = lerpColor('#0b0d12', '#1c0f07', warm);
  const rim = lerpColor('#8fa3c0', '#ffb45a', warm);
  const wood = lerpColor('#17110c', '#2a170b', warm);
  const woodLit = lerpColor('#3a3027', '#6a3a17', warm);
  const iron = '#0c0c0e';
  const top = ys - op.ah - 12; // true apex of the pointed arch
  const fullH = yb - top;
  const jolt = knock * noise1(t * 40, 3) * 6;
  const ang = open * 1.25;
  const sx = Math.max(0.02, Math.cos(ang));
  const planks = 6;
  const pw = w / planks;
  const leaf = (
    <g transform={`translate(${x0},0) skewY(${-open * 10}) scale(${sx},1) translate(${-x0 + jolt},0)`}>
      <clipPath id={`${id}-leaf`}>
        <path d={op.d} />
      </clipPath>
      <g clipPath={`url(#${id}-leaf)`}>
        {Array.from({length: planks}, (_, i) => (
          <g key={i}>
            <rect x={x0 + i * pw} y={top} width={pw} height={fullH} fill={wood} />
            <rect x={x0 + i * pw} y={top} width={pw * 0.35} height={fullH} fill={woodLit} opacity={0.18 + (i % 2) * 0.06} />
            <line x1={x0 + i * pw} y1={top} x2={x0 + i * pw} y2={yb} stroke="#000" strokeWidth={5} />
            {[0.2, 0.47, 0.81].map((g, j) => (
              <path
                key={j}
                d={`M${x0 + i * pw + pw * g},${top} C${x0 + i * pw + pw * (g + 0.08)},${yb - h * 0.6} ${x0 + i * pw + pw * (g - 0.06)},${yb - h * 0.3} ${x0 + i * pw + pw * g},${yb}`}
                stroke="#000"
                strokeOpacity={0.3}
                strokeWidth={1.5}
                fill="none"
              />
            ))}
          </g>
        ))}
        {/* iron strap hinges reaching across the planks */}
        {[0.28, 0.78].map((p, i) => {
          const y = yb - h * p;
          return (
            <g key={i}>
              <path d={`M${x0 - 4},${y - 16} L${x0 + w * 0.78},${y - 9} Q${x0 + w * 0.86},${y} ${x0 + w * 0.78},${y + 9} L${x0 - 4},${y + 16} Z`} fill={iron} />
              <path d={`M${x0 - 4},${y - 16} L${x0 + w * 0.78},${y - 9}`} stroke={rim} strokeOpacity={0.3} strokeWidth={2} />
              {[0.12, 0.3, 0.48, 0.66].map((q, j) => (
                <circle key={j} cx={x0 + w * q} cy={y} r={5} fill="#222" stroke={rim} strokeOpacity={0.25} />
              ))}
            </g>
          );
        })}
        {/* ring pull and keyhole plate */}
        <g transform={`translate(${x0 + w * 0.8},${yb - h * 0.46})`}>
          <rect x={-22} y={-40} width={44} height={110} rx={10} fill={iron} stroke={rim} strokeOpacity={0.3} strokeWidth={2} />
          <circle cx={0} cy={-14} r={7} fill="#1d1d1d" />
          <path d={`M0,${-6} m-34,0 a34,34 0 1,0 68,0 a34,34 0 1,0 -68,0`} fill="none" stroke="#1a1a1a" strokeWidth={9} transform="translate(0,34)" />
          <path d="M-30,30 a34,34 0 0,1 28,-34" fill="none" stroke={rim} strokeOpacity={0.35} strokeWidth={2} transform="translate(0,34)" />
          {/* keyhole: glows when light is on the far side */}
          <path d="M0,40 m-7,0 a7,7 0 1,1 14,0 l-4,22 h-6 z" fill={under > 0 ? underColor : '#000'} opacity={under > 0 ? 0.35 + under * 0.65 : 1} />
        </g>
        {/* edge darkening */}
        <path d={op.d} fill="none" stroke="#000" strokeWidth={30} opacity={0.6} />
      </g>
      <path d={op.d} fill="none" stroke={rim} strokeWidth={2} opacity={0.25} />
    </g>
  );
  return (
    <g>
      <defs>
        <clipPath id={`${id}-open`}>
          <path d={op.d} />
        </clipPath>
        <linearGradient id={`${id}-void`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" />
          <stop offset="1" stopColor="#05070b" />
        </linearGradient>
        <linearGradient id={`${id}-stone`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={rim} stopOpacity={0.25} />
          <stop offset="0.5" stopColor={stone} />
          <stop offset="1" stopColor="#020203" />
        </linearGradient>
        <radialGradient id={`${id}-spill`} cx="0.5" cy="0" r="0.8">
          <stop offset="0" stopColor={underColor} stopOpacity={0.55 * under} />
          <stop offset="1" stopColor={underColor} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* stone surround */}
      <path d={frame.d} fill={stone} />
      <path d={frame.d} fill={`url(#${id}-stone)`} opacity={0.6} />
      {/* inner chamfer: a lit bevel just inside the stone */}
      <path d={frame.d} fill="none" stroke={rim} strokeWidth={2} opacity={0.18} transform={`translate(${cx * 0.04},${yb * 0.04}) scale(0.96)`} />
      {/* the doorway: darkness, then whatever is beyond */}
      <g clipPath={`url(#${id}-open)`}>
        <rect x={x0} y={top} width={w} height={fullH} fill={`url(#${id}-void)`} />
        {beyond}
      </g>
      {leaf}
      {/* light spilling under the door onto the floor */}
      {under > 0 && (
        <g>
          <rect x={x0 + 6} y={yb - 4} width={w - 12} height={6} fill={underColor} opacity={0.4 + under * 0.6} />
          <ellipse cx={cx} cy={yb + 60} rx={w * 0.75} ry={90} fill={`url(#${id}-spill)`} />
        </g>
      )}
      <path d={op.d} fill="none" stroke={rim} strokeWidth={3} opacity={0.35} />
      <path d={frame.d} fill="none" stroke="#000" strokeWidth={6} opacity={0.8} />
    </g>
  );
};
