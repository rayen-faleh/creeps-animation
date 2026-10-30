import React from 'react';
import {GothicWindow} from '../art/Window';
import {Curtain, Grain, MoonBeam, Sill, Wall, GrainSpec} from '../art/Room';
import {rng} from '../util';

export const SILL_Y = 1180;
export const WIN = {cx: 540, w: 600, h: 1060};

/** Default line of small grains (rice, salt, seeds) along the inside sill, deterministic. */
export const SILL_GRAINS: GrainSpec[] = (() => {
  const r = rng(321);
  return Array.from({length: 110}, (_, i) => ({
    x: 250 + (i / 110) * 580 + (r() - 0.5) * 14,
    y: SILL_Y + 18 + r() * 34,
    rot: r() * 180,
  }));
})();

export const WindowWall: React.FC<{
  id: string;
  t: number;
  mode: 'night' | 'candle' | 'dawn';
  dawn?: number;
  warm?: number; // 0..1 candle tint on wall
  open?: number;
  billow?: number;
  wind?: number;
  cloudCover?: number;
  grains?: GrainSpec[]; // grains on the sill; defaults to SILL_GRAINS
  grainsVisible?: number; // fraction of sill grains shown (0..1)
  grainLit?: number;
  grainWarm?: number;
  extraBelow?: React.ReactNode; // things drawn on the wall/floor below sill
  children?: React.ReactNode; // drawn on top of sill
  beam?: number;
  wallH?: number;
  outside?: React.ReactNode;
}> = ({
  id,
  t,
  mode,
  dawn = 0,
  warm = 0,
  open = 0,
  billow = 0,
  wind = 1,
  cloudCover = 0.25,
  grains = SILL_GRAINS,
  grainsVisible = 0,
  grainLit = 0.6,
  grainWarm = 0,
  extraBelow,
  children,
  beam = 1,
  wallH = 2400,
  outside,
}) => {
  const n = Math.floor(grains.length * grainsVisible);
  return (
    <g>
      <Wall id={`${id}-wall`} x={-400} y={-600} w={1880} h={wallH} warm={warm} lit={0.6 + dawn * 0.6} />
      {/* moon wash on the wall around the window */}
      <ellipse cx={WIN.cx} cy={SILL_Y - 500} rx={620} ry={760} fill={mode === 'candle' ? '#ff9a3c' : '#6f86a6'} opacity={mode === 'candle' ? 0.08 : 0.07 + dawn * 0.12} />
      <GothicWindow
        id={`${id}-win`}
        cx={WIN.cx}
        yb={SILL_Y}
        w={WIN.w}
        h={WIN.h}
        t={t}
        light={mode}
        dawn={dawn}
        open={open}
        wind={wind}
        cloudCover={cloudCover}
        treeSway={1 + billow * 3}
        outside={outside}
      />
      <Sill x={WIN.cx - WIN.w / 2 - 90} y={SILL_Y} w={WIN.w + 180} depth={64} front={46} warm={warm} lit={0.6 + dawn} />
      {grains.slice(0, n).map((g, i) => (
        <Grain key={i} x={g.x} y={g.y} rot={g.rot} s={1.15} lit={grainLit} warm={grainWarm} />
      ))}
      {children}
      {extraBelow}
      <Curtain id={`${id}-cl`} x={-140} y={-500} w={330} h={1840} side={-1} t={t} billow={billow} warm={warm} />
      <Curtain id={`${id}-cr`} x={890} y={-500} w={330} h={1840} side={1} t={t + 1.3} billow={billow} warm={warm} />
      {/* curtain rod */}
      <rect x={-200} y={-520} width={1480} height={26} fill="#0a0806" />
      {beam > 0 && mode !== 'candle' && (
        <MoonBeam
          id={`${id}-beam`}
          poly={`${WIN.cx - 260},${SILL_Y - 900} ${WIN.cx + 300},${SILL_Y - 1000} ${WIN.cx + 420},${SILL_Y + 900} ${WIN.cx - 380},${SILL_Y + 900}`}
          t={t}
          opacity={0.07 * beam}
          bounds={[WIN.cx - 400, SILL_Y - 1000, 900, 1900]}
          dust={50}
        />
      )}
    </g>
  );
};
