import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera} from '../../../../kit/common/fx';
import {Candle, CupHand, Duvet, GranSilhouette} from '../../../../kit/common/art/Props';
import {Grain, Wall} from '../../../../kit/common/art/Room';
import {WindowWall, SILL_GRAINS, SILL_Y} from '../../../../kit/portrait/sets/WindowWall';
import {easeOut, lin, mix, prog, rng, track, W, H} from '../../../../kit/common/util';

const Svg: React.FC<{children: React.ReactNode; h?: number}> = ({children, h = H}) => (
  <svg width={W} height={h} viewBox={`0 0 ${W} ${h}`} style={{position: 'absolute', left: 0, top: 0}}>
    {children}
  </svg>
);

/* S01 + S05: child in bed looking at the window. dawn=0 night, ->1 sunrise */
export const BedView: React.FC<{t: number; t0: number; dawn: number; rice: number; grip: number; flit?: boolean}> = ({t, t0, dawn, rice, grip, flit}) => {
  const lt = t - t0;
  // a dark shape flits across the moon
  const fp = lin(t, 1.75, 2.25);
  return (
    <Camera t={t} zoom={1.02 + lt * 0.025} shake={5} seed={2}>
      <Svg>
        <g transform="translate(540,760) scale(0.62) translate(-540,-760)">
          <WindowWall
            id="bed"
            t={t}
            mode={dawn > 0 ? 'dawn' : 'night'}
            dawn={dawn}
            grainsVisible={rice}
            grainLit={0.5 + dawn * 0.5}
            grainWarm={dawn}
            outside={
              flit && fp > 0 && fp < 1 ? (
                <g transform={`translate(${mix(200, 900, fp)},${mix(380, 300, fp)}) rotate(${-12 + fp * 20})`} opacity={0.9}>
                  <ellipse cx={0} cy={0} rx={90} ry={150} fill="#000" />
                  <path d="M-90,-40 C-200,-140 -260,-60 -330,-120 C-280,-20 -220,30 -90,20 Z M90,-40 C200,-140 260,-60 330,-120 C280,-20 220,30 90,20 Z" fill="#000" />
                </g>
              ) : null
            }
          />
        </g>
        {/* bedroom darkness around */}
        <rect x={0} y={0} width={W} height={H} fill="url(#bedfade)" />
        <defs>
          <radialGradient id="bedfade" cx="0.5" cy="0.4" r="0.75">
            <stop offset="0.45" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.85" />
          </radialGradient>
        </defs>
        <Duvet y={1430} t={t} warm={dawn} grip={grip} />
      </Svg>
    </Camera>
  );
};

/* S02: Gran pours rice along the inside sill, candle-lit */
export const PourScene: React.FC<{t: number}> = ({t}) => {
  const a = 3.3;
  const pour = prog(t, a + 0.35, a + 3.1, (x) => x); // linear travel while pouring
  const frontier = mix(240, 840, pour);
  const n = SILL_GRAINS.filter((g) => g.x < frontier).length / SILL_GRAINS.length;
  const tilt = track(t, [
    [a, -8],
    [a + 0.35, -38],
    [a + 3.0, -40],
    [a + 3.4, -12],
  ]);
  const lipX = frontier;
  const lipY = 1035;
  const r = rng(8);
  const stream = Array.from({length: 22}, (_, i) => {
    const ph = (t * 3.2 + i / 22) % 1;
    const jitter = (r() - 0.5) * 16;
    return {x: lipX + jitter + ph * 6, y: lipY + ph * ph * 170, rot: r() * 180 + t * 300};
  });
  const pouring = t > a + 0.3 && t < a + 3.05;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1} shake={4} seed={5}>
        <Svg>
          <g transform="translate(540,1060) scale(1.9) translate(-540,-1180)">
            <WindowWall id="pour" t={t} mode="candle" warm={1} grainsVisible={n} grainWarm={1} grainLit={1} />
            {pouring && stream.map((g, i) => <Grain key={i} x={g.x} y={g.y} rot={g.rot} s={1.1} warm={1} />)}
            <CupHand x={frontier + 75} y={lipY - 45} tilt={tilt} s={0.6} warm={1} />
          </g>
          {/* warm candle wash */}
          <rect x={0} y={0} width={W} height={H} fill="#ff8a2a" opacity={0.06} />
        </Svg>
      </Camera>
      <AbsoluteFill style={{filter: 'blur(14px)'}}>
        <Svg>
          <Candle x={150} y={2050} t={t} s={1.5} />
        </Svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* S03: Gran leans in and whispers */
export const GranScene: React.FC<{t: number}> = ({t}) => {
  const a = 6.73;
  const lean = prog(t, a, a + 1.6);
  const finger = prog(t, a + 0.2, a + 0.8, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1 + lean * 0.06} shake={3} seed={7}>
        <Svg>
          <Wall id="granwall" x={-200} y={-200} w={1480} h={2400} warm={1} />
          <radialGradient id="granglow" cx="0.15" cy="0.85" r="0.9">
            <stop offset="0" stopColor="#ffa040" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#7a3a12" stopOpacity="0.2" />
            <stop offset="1" stopColor="#000" stopOpacity="0.6" />
          </radialGradient>
          <rect x={0} y={0} width={W} height={H} fill="url(#granglow)" />
          <GranSilhouette x={640} y={800} s={mix(1.45, 1.7, lean)} t={t} finger={finger} lean={lean} />
        </Svg>
      </Camera>
      <AbsoluteFill style={{filter: 'blur(10px)'}}>
        <Svg>
          <Candle x={170} y={2010} t={t} s={1.6} />
        </Svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* S04: macro of grains being counted, one glint at a time */
const MACRO = (() => {
  const r = rng(55);
  return Array.from({length: 26}, (_, i) => ({
    x: 60 + i * 52 + (r() - 0.5) * 30,
    y: 900 + Math.sin(i * 0.9) * 90 + (r() - 0.5) * 120,
    rot: -20 + r() * 40,
    s: 4.2 + r() * 1.4,
  }));
})();
export const CountMacro: React.FC<{t: number}> = ({t}) => {
  const a = 8.945;
  const pan = (t - a) * 140;
  return (
    <Camera t={t} zoom={1.05} x={pan - 120} shake={2} seed={11}>
      <Svg>
        <defs>
          <linearGradient id="mwood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a0b04" />
            <stop offset="0.45" stopColor="#5a2e12" />
            <stop offset="0.6" stopColor="#7a4420" />
            <stop offset="1" stopColor="#120804" />
          </linearGradient>
          <filter id="mblur">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        <rect x={-600} y={0} width={2600} height={H} fill="url(#mwood)" />
        {Array.from({length: 9}, (_, i) => (
          <path key={i} d={`M-600,${700 + i * 70} C0,${690 + i * 72} 900,${712 + i * 68} 2000,${700 + i * 70}`} stroke="#000" strokeOpacity={0.2} strokeWidth={3} fill="none" />
        ))}
        {/* out-of-focus far grains */}
        <g filter="url(#mblur)" opacity={0.7}>
          {MACRO.map((g, i) => (
            <Grain key={i} x={g.x + 30} y={g.y - 260} rot={g.rot + 40} s={g.s * 0.6} warm={1} />
          ))}
        </g>
        {MACRO.map((g, i) => {
          const gt = a + 0.2 + i * 0.11;
          const glint = Math.max(0, 1 - Math.abs(t - gt) / 0.18);
          return <Grain key={i} x={g.x} y={g.y} rot={g.rot} s={g.s} warm={1} glint={glint} />;
        })}
        <rect x={-600} y={1250} width={2600} height={700} fill="#000" opacity={0.45} />
      </Svg>
    </Camera>
  );
};
