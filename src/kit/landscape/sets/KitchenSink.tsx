import React from 'react';
import {GothicWindow} from '../../common/art/Window';
import {Wall} from '../../common/art/Room';
import {Candle} from '../../common/art/Props';
import {BelfastSink, DripSpec, Tap, Tiles} from '../../common/art/Kitchen';
import {GardenView} from '../../common/art/Cottage';
import {lerpColor} from '../../common/util';

/** 16:9 kitchen: Belfast sink and pillar tap under a small gothic window onto the garden and its ring of roses. */
export const K = {
  sinkY: 770, // top edge of the sink opening
  tapX: 900, // tap base
  tapY: 772,
  tapS: 1.0,
  win: {cx: 960, yb: 560, w: 380, h: 470},
};
/** Where the drop leaves the spout, in set units (for close-ups). */
export const SPOUT = {x: K.tapX + 117 * K.tapS, y: K.tapY - 142 * K.tapS};

export const KitchenSinkL: React.FC<{
  id: string;
  t: number;
  mode: 'night' | 'lamp';
  turn?: number;
  drip?: DripSpec;
  candle?: boolean;
  garden?: {snow?: number; frost?: number; frostRing?: boolean; trench?: number};
  children?: React.ReactNode; // hands, drawn over the sink
}> = ({id, t, mode, turn = 0, drip, candle = mode === 'lamp', garden = {}, children}) => {
  const warm = mode === 'lamp' ? 1 : 0;
  const wood = lerpColor('#141210', '#3a2412', warm);
  const rim = lerpColor('#8fa3c0', '#ffb45a', warm);
  const {win} = K;
  return (
    <g>
      <Wall id={`${id}-wall`} x={-500} y={-500} w={2920} h={1100} warm={warm} lit={0.6} />
      <Tiles id={`${id}-tiles`} x={-500} y={560} w={2920} h={210} warm={warm} lit={0.8} />
      <GothicWindow
        id={`${id}-win`}
        cx={win.cx}
        yb={win.yb}
        w={win.w}
        h={win.h}
        t={t}
        light={mode === 'lamp' ? 'candle' : 'night'}
        cloudCover={0.4}
        outside={
          <g transform={`translate(${win.cx - 960 * 0.42},${win.yb - win.h + 20}) scale(0.42)`}>
            <GardenView id={`${id}-gdn`} t={t} light="night" {...garden} />
          </g>
        }
      />
      {/* sill with a jar and a cup */}
      <rect x={win.cx - win.w / 2 - 50} y={win.yb} width={win.w + 100} height={22} fill={wood} />
      <rect x={win.cx - win.w / 2 - 50} y={win.yb} width={win.w + 100} height={4} fill={rim} opacity={0.3} />
      <rect x={win.cx + 90} y={win.yb - 70} width={56} height={70} rx={8} fill="#2a3a30" opacity={0.8} />
      <rect x={win.cx + 96} y={win.yb - 80} width={44} height={12} rx={3} fill="#3a2a18" />
      {/* worktop, cupboard fronts */}
      <rect x={-500} y={K.sinkY - 12} width={2920} height={30} fill={wood} />
      <rect x={-500} y={K.sinkY - 12} width={2920} height={4} fill={rim} opacity={0.3} />
      <rect x={-500} y={K.sinkY + 18} width={2920} height={600} fill={lerpColor('#07080b', '#1a0e06', warm)} />
      {[-200, 260, 1660, 2120].map((cx) => (
        <g key={cx}>
          <rect x={cx - 200} y={K.sinkY + 60} width={400} height={400} fill="none" stroke="#000" strokeWidth={6} opacity={0.7} />
          <circle cx={cx + 160} cy={K.sinkY + 120} r={8} fill="#0c0c0e" stroke={rim} strokeOpacity={0.35} />
        </g>
      ))}
      {/* draining board, right */}
      <path d={`M1340,${K.sinkY - 10} L1720,${K.sinkY - 30} L1720,${K.sinkY + 10} L1340,${K.sinkY + 10} Z`} fill={wood} />
      {Array.from({length: 8}, (_, i) => (
        <path key={i} d={`M${1360 + i * 44},${K.sinkY - 10} L${1370 + i * 44},${K.sinkY + 6}`} stroke="#000" strokeOpacity={0.5} strokeWidth={3} />
      ))}
      {/* shelf, left: jars and the candle */}
      <rect x={160} y={420} width={420} height={18} fill={wood} />
      <rect x={160} y={420} width={420} height={3} fill={rim} opacity={0.3} />
      {[200, 290, 380].map((jx, i) => (
        <g key={jx}>
          <rect x={jx} y={420 - 90 - i * 10} width={70} height={90 + i * 10} rx={10} fill="#1e2a26" opacity={0.85} />
          <rect x={jx + 6} y={420 - 102 - i * 10} width={58} height={14} rx={4} fill="#2a1e12" />
          <rect x={jx + 10} y={420 - 70 - i * 10} width={8} height={50} rx={4} fill={rim} opacity={0.15} />
        </g>
      ))}
      {candle && <Candle x={510} y={420} t={t} s={0.6} />}
      <BelfastSink x={960} y={K.sinkY} w={720} warm={warm} lit={0.8} />
      <Tap id={`${id}-tap`} x={K.tapX} y={K.tapY} s={K.tapS} t={t} turn={turn} drip={drip ? {fall: 190, ...drip} : undefined} light={mode === 'lamp' ? 'warm' : 'night'} />
      {children}
    </g>
  );
};
