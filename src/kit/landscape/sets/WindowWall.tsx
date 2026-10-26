import React from 'react';
import {GothicWindow} from '../../common/art/Window';
import {Curtain, Grain, MoonBeam, Sill, Wall, GrainSpec} from '../../common/art/Room';

/** 16:9 window set: same pieces as the portrait WindowWall, laid out for a 1920x1080 frame. */
export const L_SILL_Y = 860;
export const L_WIN = {cx: 960, w: 500, h: 800};

export const WindowWallL: React.FC<{
  id: string;
  t: number;
  mode: 'night' | 'candle' | 'dawn';
  dawn?: number;
  warm?: number;
  open?: number;
  billow?: number;
  wind?: number;
  cloudCover?: number;
  grains?: GrainSpec[];
  grainLit?: number;
  grainWarm?: number;
  extraBelow?: React.ReactNode;
  children?: React.ReactNode;
  beam?: number;
  outside?: React.ReactNode;
}> = ({id, t, mode, dawn = 0, warm = 0, open = 0, billow = 0, wind = 1, cloudCover = 0.25, grains = [], grainLit = 0.6, grainWarm = 0, extraBelow, children, beam = 1, outside}) => {
  const {cx, w, h} = L_WIN;
  const x0 = cx - w / 2;
  return (
    <g>
      <Wall id={`${id}-wall`} x={-500} y={-500} w={2920} h={2100} warm={warm} lit={0.6 + dawn * 0.6} />
      {/* dado rail and dark wainscot below the sill line */}
      <rect x={-500} y={L_SILL_Y + 120} width={2920} height={800} fill="#000" opacity={0.35} />
      <rect x={-500} y={L_SILL_Y + 116} width={2920} height={8} fill={mode === 'candle' ? '#ffb45a' : '#8fa3c0'} opacity={0.12} />
      <ellipse cx={cx} cy={L_SILL_Y - 380} rx={560} ry={620} fill={mode === 'candle' ? '#ff9a3c' : '#6f86a6'} opacity={mode === 'candle' ? 0.08 : 0.07 + dawn * 0.12} />
      <GothicWindow
        id={`${id}-win`}
        cx={cx}
        yb={L_SILL_Y}
        w={w}
        h={h}
        t={t}
        light={mode}
        dawn={dawn}
        open={open}
        wind={wind}
        cloudCover={cloudCover}
        treeSway={1 + billow * 3}
        outside={outside}
      />
      <Sill x={x0 - 80} y={L_SILL_Y} w={w + 160} depth={54} front={40} warm={warm} lit={0.6 + dawn} />
      {grains.map((g, i) => (
        <Grain key={i} x={g.x} y={g.y} rot={g.rot} s={1.0} lit={grainLit} warm={grainWarm} />
      ))}
      {children}
      {extraBelow}
      <Curtain id={`${id}-cl`} x={x0 - 400} y={-460} w={330} h={1500} side={-1} t={t} billow={billow} warm={warm} />
      <Curtain id={`${id}-cr`} x={x0 + w + 70} y={-460} w={330} h={1500} side={1} t={t + 1.3} billow={billow} warm={warm} />
      <rect x={x0 - 480} y={-480} width={w + 960} height={22} fill="#0a0806" />
      {beam > 0 && mode !== 'candle' && (
        <MoonBeam
          id={`${id}-beam`}
          poly={`${cx - 220},${L_SILL_Y - 700} ${cx + 260},${L_SILL_Y - 780} ${cx + 520},${L_SILL_Y + 400} ${cx - 420},${L_SILL_Y + 400}`}
          t={t}
          opacity={0.07 * beam}
          bounds={[cx - 450, L_SILL_Y - 780, 1000, 1200]}
          dust={44}
        />
      )}
    </g>
  );
};
