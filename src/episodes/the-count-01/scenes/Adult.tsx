import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Eyelids, Torch} from '../../../kit/fx';
import {Clock, Cloth, Mirror, Portrait} from '../../../kit/art/Props';
import {Floor, Grain, Wall} from '../../../kit/art/Room';
import {Hand, POSES, STYLES} from '../../../kit/art/Hand';
import {Tree} from '../../../kit/art/Window';
import {WindowWall, SILL_GRAINS} from '../../../kit/sets/WindowWall';
import {easeIn, easeOut, lin, mix, prog, rng, track, W, H} from '../../../kit/util';

const Svg: React.FC<{children: React.ReactNode; h?: number}> = ({children, h = H}) => (
  <svg width={W} height={h} viewBox={`0 0 ${W} ${h}`} style={{position: 'absolute', left: 0, top: 0}}>
    {children}
  </svg>
);

const Boxes: React.FC = () => (
  <g>
    {[
      [700, 1500, 300, 220, -3],
      [760, 1290, 240, 200, 4],
      [560, 1560, 200, 160, 2],
    ].map(([x, y, w, h, r], i) => (
      <g key={i} transform={`rotate(${r} ${x + w / 2} ${y + h / 2})`}>
        <rect x={x} y={y} width={w} height={h} fill="#3b2c1c" />
        <rect x={x} y={y} width={w} height={h * 0.18} fill="#4c3a25" />
        <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h * 0.18} stroke="#000" strokeWidth={3} />
        <rect x={x} y={y + h * 0.1} width={w} height={14} fill="#a89878" opacity={0.25} />
        {i === 0 && (
          <text x={x + w / 2} y={y + h * 0.62} textAnchor="middle" fontSize={34} fill="#0a0806" opacity={0.8} fontFamily="CountCaption" fontWeight={600} transform={`rotate(-2 ${x + w / 2} ${y + h * 0.6})`}>
            GRAN — BEDROOM
          </text>
        )}
      </g>
    ))}
  </g>
);

const Dresser: React.FC = () => (
  <g>
    <rect x={20} y={1300} width={420} height={500} fill="#1a120c" />
    <rect x={0} y={1280} width={460} height={30} fill="#2a1c12" />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={45} y={1335 + i * 150} width={370} height={130} fill="#120c08" stroke="#2c1e14" strokeWidth={4} />
        <circle cx={230} cy={1400 + i * 150} r={10} fill="#5a4630" />
      </g>
    ))}
  </g>
);

/* S06: years later, torch beam across Gran's room */
export const TorchRoom: React.FC<{t: number}> = ({t}) => {
  const bx = track(t, [
    [13.5, 830],
    [14.6, 830],
    [15.2, 240],
    [15.95, 240],
    [16.5, 560],
  ]);
  const by0 = track(t, [
    [13.5, 1420],
    [14.6, 1400],
    [15.2, 1080],
    [15.95, 1080],
    [16.5, 960],
  ]);
  const by = by0;
  // camera follows the beam a little (first person looking where the light goes)
  const cx = (bx - 540) * 0.25;
  const cy = (by - 960) * 0.2;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05} x={cx} y={cy} shake={7} seed={13}>
        <Svg>
          <g transform="translate(560,1235) scale(0.5) translate(-540,-1180)">
            <WindowWall id="tr" t={t} mode="night" grainsVisible={1} grainLit={0.25} beam={0.6} />
          </g>
          <Wall id="trw" x={-200} y={1240} w={1480} h={60} />
          <Floor id="trf" x={-200} y={1800} w={1480} h={300} lit={0.6} />
          <Dresser />
          <Portrait x={230} y={1100} s={0.95} />
          <Boxes />
        </Svg>
      </Camera>
      <Torch x={bx - cx * 1.05} y={by - cy * 1.05} r={380} ambient={0.14} />
    </AbsoluteFill>
  );
};

/* S07: the covered mirror */
export const CoveredMirror: React.FC<{t: number}> = ({t}) => {
  const a = 17.9;
  const lt = t - a;
  const bx = 540 + Math.sin(lt * 0.9) * 60;
  const by = 900 + lt * 30;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.06} shake={6} seed={17}>
        <Svg>
          <Wall id="cmw" x={-200} y={-200} w={1480} h={2400} />
          <Mirror x={250} y={500} w={580} h={1080} id="cm" />
          <Cloth x={250} y={500} w={580} h={1080} t={t} id="cmc" />
          <Floor id="cmf" x={-200} y={1700} w={1480} h={400} lit={0.5} />
        </Svg>
      </Camera>
      <Torch x={bx} y={by} r={470} ambient={0.12} />
    </AbsoluteFill>
  );
};

/* S08: sweeping the rice off the sill */
const SWEEP_START = 22.4;
const SWEEP_END = 22.95;
const handXAt = (t: number) =>
  track(t, [
    [20.09, 1200],
    [21.4, 1200],
    [21.95, 905],
    [SWEEP_START, 900],
    [SWEEP_END, 120],
    [23.6, -500],
  ]);

export const SweepScene: React.FC<{t: number}> = ({t}) => {
  const hx = handXAt(t);
  const handY = 1215;
  const r = rng(99);
  const fly = SILL_GRAINS.map((g) => {
    // time at which the fingertips (at hx) reach this grain: invert the monotonic sweep
    let tg = Infinity;
    if (g.x >= handXAt(SWEEP_END) && t > SWEEP_START) {
      let lo = SWEEP_START;
      let hi = SWEEP_END;
      for (let k = 0; k < 18; k++) {
        const mid = (lo + hi) / 2;
        if (handXAt(mid) > g.x) lo = mid;
        else hi = mid;
      }
      tg = hi;
    }
    const vx = -(500 + r() * 900);
    const vy = -(200 + r() * 500);
    const spin = (r() - 0.5) * 1400;
    if (t < tg) return {...g, s: 1.15};
    const dt = t - tg;
    return {x: g.x + vx * dt, y: g.y + vy * dt + 0.5 * 2600 * dt * dt, rot: g.rot + spin * dt, s: 1.15};
  });
  return (
    <Camera t={t} zoom={1} shake={4} seed={19}>
      <Svg>
        <g transform="translate(540,1060) scale(1.9) translate(-540,-1180)">
          <WindowWall id="sw" t={t} mode="night" grainsVisible={0} beam={0.8} />
          {fly.map((g, i) => (g.y < 1600 ? <Grain key={i} x={g.x} y={g.y} rot={g.rot} s={g.s} lit={0.3} /> : null))}
          <Hand id="swh" x={hx + 165} y={handY} rot={-96} scale={0.62} style={STYLES.adult} pose={POSES.flat} light={0.8} />
        </g>
      </Svg>
    </Camera>
  );
};

/* S09: 3 a.m. — eyes open on the clock */
export const ClockScene: React.FC<{t: number}> = ({t}) => {
  const open = track(t, [
    [24.55, 0],
    [24.75, 0],
    [25.15, 0.55],
    [25.6, 0.45],
    [25.9, 0.8],
    [26.15, 0.15],
    [26.35, 0.95],
  ]);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.04} rot={-4} shake={3} seed={23}>
        <Svg>
          <rect x={0} y={0} width={W} height={H} fill="#05070b" />
          <g transform="translate(150,520) scale(0.42)" opacity={0.55} style={{filter: 'blur(6px)'}}>
            <WindowWall id="ck" t={t} mode="night" beam={0} />
          </g>
          {/* nightstand */}
          <rect x={-100} y={1420} width={1300} height={600} fill="#0d0a08" />
          <rect x={-100} y={1400} width={1300} height={34} fill="#22180f" />
          <Clock x={640} y={1180} s={1.5} t={t} />
          <ellipse cx={640} cy={1418} rx={260} ry={22} fill="#000" opacity={0.6} />
        </Svg>
      </Camera>
      <Eyelids open={open} />
    </AbsoluteFill>
  );
};

/* S10: lying awake; window-shaped moonlight on the ceiling; head turns */
export const CeilingScene: React.FC<{t: number}> = ({t}) => {
  const turn = prog(t, 31.5, 32.77, easeIn);
  return (
    <Camera t={t} zoom={1.08 + (t - 27.3) * 0.012} rot={mix(-8, 14, turn)} x={turn * 360} shake={4} seed={29}>
      <Svg>
        <defs>
          <clipPath id="ceilwin">
            <path d="M260,700 L260,440 A230,230 0 0 1 395,240 A230,230 0 0 1 530,440 L530,700 Z M560,700 L560,440 A230,230 0 0 1 695,240 A230,230 0 0 1 830,440 L830,700 Z" />
          </clipPath>
          <filter id="ceilblur">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <linearGradient id="ceilg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0b0f17" />
            <stop offset="1" stopColor="#020305" />
          </linearGradient>
        </defs>
        <rect x={-600} y={-400} width={2400} height={2800} fill="url(#ceilg)" />
        {/* crown moulding */}
        <path d="M-600,1560 L1800,1420 L1800,1480 L-600,1630 Z" fill="#05060a" />
        <path d="M-600,1560 L1800,1420" stroke="#6f86a6" strokeOpacity={0.15} strokeWidth={3} />
        {/* light patch shaped like the gothic window, skewed onto the ceiling */}
        <g filter="url(#ceilblur)">
          <g transform="translate(60,260) skewX(-24) rotate(-14) scale(1.05,1.25)">
            <path d="M260,700 L260,440 A230,230 0 0 1 395,240 A230,230 0 0 1 530,440 L530,700 Z" fill="#8094b4" opacity={0.42} />
            <path d="M560,700 L560,440 A230,230 0 0 1 695,240 A230,230 0 0 1 830,440 L830,700 Z" fill="#8094b4" opacity={0.42} />
            <circle cx={545} cy={170} r={70} fill="#8094b4" opacity={0.32} />
            {/* lattice shadows */}
            {Array.from({length: 16}, (_, i) => (
              <g key={i} stroke="#05070b" strokeWidth={6} opacity={0.75} clipPath="url(#ceilwin)">
                <line x1={100 + i * 56} y1={220} x2={100 + i * 56 + 480} y2={700} />
                <line x1={100 + i * 56} y1={700} x2={100 + i * 56 + 480} y2={220} />
              </g>
            ))}
            {/* swaying branch shadows */}
            <g opacity={0.85}>
              <Tree x={880} y={760} scale={1.1} rot={-40} t={t * 1.3} which={0} sway={2.2} color="#020305" />
            </g>
          </g>
        </g>
        <rect x={-600} y={-400} width={2400} height={2800} fill="#000" opacity={0.15} />
      </Svg>
    </Camera>
  );
};
