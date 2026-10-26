import React from 'react';
import {lerpColor, mix, noise1, rng} from '../util';
import {theme} from '../theme';
import {Tree} from './Window';

/**
 * Moor-edge village street seen from one end, receding to "the end of the road": two stone terraces,
 * a church tower, a gas lamp where the road meets the moor, hills and sky. Drawn in a canonical
 * 1080x1920 box, then placed with (x, y, s). light: 'dusk' (warm memory), 'night' (cold moon).
 * `atLamp` draws at the lamp's foot in local units (scaled with distance), e.g. a Watcher.
 */
export const STREET = {
  lampX: 560, // lamp foot in canonical units
  lampY: 1030,
  lampS: 0.3, // world scale at the lamp's distance
  horizon: 905,
};

type Light = 'dusk' | 'night';

const depth = (d: number) => 1 - 1 / (1 + 4.2 * d); // perspective-ish compression, 0 near .. ~0.8 far

export const MoorStreet: React.FC<{
  id: string;
  t: number;
  light: Light;
  x?: number;
  y?: number;
  s?: number;
  moon?: [number, number]; // canonical position
  moonR?: number;
  lamp?: number; // 0..1 lamp brightness
  windowsLit?: number; // 0..1 fraction of lit windows
  atLamp?: React.ReactNode;
  beyond?: React.ReactNode; // drawn on the moor behind the lamp (e.g. a distant torch)
  wind?: number;
}> = ({id, t, light, x = 0, y = 0, s = 1, moon = [790, 520], moonR = 58, lamp = 1, windowsLit = 0.4, atLamp, beyond, wind = 1}) => {
  const dusk = light === 'dusk';
  const skyTop = dusk ? '#1d1426' : '#03050a';
  const skyMid = dusk ? '#6a2f2a' : '#0b1424';
  const skyLow = dusk ? '#e0884a' : '#16263f';
  const hill = dusk ? '#1a0c08' : '#05070c';
  const hill2 = dusk ? '#2a130b' : '#080c14';
  const stone = dusk ? '#150a06' : '#06080d';
  const stoneLit = dusk ? '#c56a2e' : '#7d90ad';
  const road = dusk ? '#120806' : '#05070b';
  const winLit = dusk ? '#ffb45a' : '#e9b067';
  const r = rng(404);
  const H = STREET.horizon;
  const VPX = 560;

  // terrace geometry: d in [0,1] along the street; left side faces right, right side faces left
  const side = (sgn: -1 | 1) => {
    const nearX = sgn < 0 ? -140 : 1220;
    const farX = sgn < 0 ? 470 : 650;
    const X = (d: number) => mix(nearX, farX, depth(d) / depth(1));
    const roof = (d: number) => mix(620, H - 20, depth(d) / depth(1));
    const ground = (d: number) => mix(1880, H + 60, depth(d) / depth(1));
    return {X, roof, ground};
  };

  const terrace = (sgn: -1 | 1, seed: number) => {
    const g = side(sgn);
    const rr = rng(seed);
    const N = 9;
    const els: React.ReactNode[] = [];
    for (let i = N - 1; i >= 0; i--) {
      const d0 = i / N;
      const d1 = (i + 1) / N;
      const x0 = g.X(d0), x1 = g.X(d1);
      const r0 = g.roof(d0) + (i % 3 === 1 ? 14 * (1 - depth(d0)) : 0), r1 = g.roof(d1);
      const g0 = g.ground(d0), g1 = g.ground(d1);
      const face = `M${x0},${r0} L${x1},${r1} L${x1},${g1} L${x0},${g0} Z`;
      els.push(<path key={`f${i}`} d={face} fill={stone} />);
      // stone courses
      for (let c = 1; c < 6; c++) {
        const f = c / 6;
        els.push(<path key={`c${i}-${c}`} d={`M${x0},${mix(r0, g0, f)} L${x1},${mix(r1, g1, f)}`} stroke="#000" strokeOpacity={0.35} strokeWidth={1.5} />);
      }
      // two windows per house (upper/lower) + a door with pointed arch
      const winAt = (fx: number, fy: number, ww: number, wh: number, lit: boolean, k: string) => {
        const ax = mix(x0, x1, fx), bx = mix(x0, x1, fx + ww);
        const top = (xx: number, fyy: number) => mix(mix(r0, g0, fyy), mix(r1, g1, fyy), (xx - x0) / (x1 - x0 || 1));
        const p = `M${ax},${top(ax, fy)} L${bx},${top(bx, fy)} L${bx},${top(bx, fy + wh)} L${ax},${top(ax, fy + wh)} Z`;
        const flick = 0.85 + 0.15 * noise1(t * 3 + seed + fx * 9, 2);
        return (
          <g key={k}>
            <path d={p} fill={lit ? winLit : '#020203'} opacity={lit ? 0.85 * flick : 1} />
            <path d={p} fill="none" stroke={stoneLit} strokeOpacity={0.25} strokeWidth={1.5} />
            {lit && <path d={`M${(ax + bx) / 2},${top((ax + bx) / 2, fy)} L${(ax + bx) / 2},${top((ax + bx) / 2, fy + wh)}`} stroke="#1a0a04" strokeWidth={Math.max(1, (bx - ax) * 0.08)} />}
          </g>
        );
      };
      els.push(winAt(0.14, 0.2, 0.34, 0.2, rr() < windowsLit, `w1${i}`));
      els.push(winAt(0.14, 0.56, 0.34, 0.2, rr() < windowsLit * 0.7, `w3${i}`));
      els.push(winAt(0.62, 0.2, 0.26, 0.2, rr() < windowsLit * 0.6, `w2${i}`));
      els.push(winAt(0.62, 0.55, 0.22, 0.45, false, `dr${i}`));
      // chimney stack at the party wall
      const cw = (x1 - x0) * 0.16;
      const ch = (g0 - r0) * 0.16;
      els.push(<rect key={`ch${i}`} x={x0 - cw / 2} y={r0 - ch} width={cw} height={ch + 4} fill={stone} />);
      els.push(<rect key={`pt${i}`} x={x0 - cw * 0.3} y={r0 - ch - ch * 0.25} width={cw * 0.22} height={ch * 0.25} fill={stone} />);
      els.push(<rect key={`pt2${i}`} x={x0 + cw * 0.1} y={r0 - ch - ch * 0.2} width={cw * 0.22} height={ch * 0.2} fill={stone} />);
      els.push(<path key={`rl${i}`} d={`M${x0},${r0} L${x1},${r1}`} stroke={stoneLit} strokeOpacity={0.4} strokeWidth={2} />);
      els.push(<path key={`pw${i}`} d={`M${x0},${r0} L${x0},${g0}`} stroke="#000" strokeOpacity={0.6} strokeWidth={2} />);
    }
    // roof slope above the faces
    const roofPoly = `M${g.X(0)},${g.roof(0)} L${g.X(1)},${g.roof(1)} L${g.X(1)},${g.roof(1) - 16} L${g.X(0)},${g.roof(0) - 170} Z`;
    return (
      <g>
        <path d={roofPoly} fill={stone} />
        <path d={`M${g.X(0)},${g.roof(0) - 170} L${g.X(1)},${g.roof(1) - 16}`} stroke={stoneLit} strokeOpacity={0.3} strokeWidth={2} />
        {els}
      </g>
    );
  };

  const lampFlick = lamp * (0.9 + 0.1 * noise1(t * 6, 8));
  const L = STREET;
  const lampH = 560 * L.lampS;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={skyTop} />
          <stop offset="0.65" stopColor={skyMid} />
          <stop offset="1" stopColor={skyLow} />
        </linearGradient>
        <radialGradient id={`${id}-moon`}>
          <stop offset="0" stopColor={dusk ? '#ffd9a0' : theme.moonGlow} stopOpacity={0.5} />
          <stop offset="0.4" stopColor={dusk ? '#ffb070' : theme.moonGlow} stopOpacity={0.14} />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-pool`}>
          <stop offset="0" stopColor="#ffbf6a" stopOpacity={0.55} />
          <stop offset="0.5" stopColor="#ff9a3c" stopOpacity={0.16} />
          <stop offset="1" stopColor="#ff9a3c" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-cb`} x="-50%" y="-100%" width="200%" height="300%">
          <feGaussianBlur stdDeviation="20" />
        </filter>
      </defs>
      <rect x={-600} y={-400} width={2280} height={H + 420} fill={`url(#${id}-sky)`} />
      {/* stars */}
      {!dusk &&
        Array.from({length: 46}, (_, i) => {
          const sx = -200 + r() * 1480, sy = -300 + r() * 1000, sr = r() * 1.6 + 0.5, ph = r();
          return <circle key={i} cx={sx} cy={sy} r={sr} fill="#cfd8e6" opacity={0.25 + 0.3 * (0.5 + 0.5 * Math.sin(t * 2 + ph * 20))} />;
        })}
      {/* full moon */}
      <circle cx={moon[0]} cy={moon[1]} r={moonR * 6} fill={`url(#${id}-moon)`} />
      <circle cx={moon[0]} cy={moon[1]} r={moonR} fill={dusk ? '#f3d9b0' : theme.moon} />
      <circle cx={moon[0] - moonR * 0.3} cy={moon[1] - moonR * 0.2} r={moonR * 0.28} fill={dusk ? '#d9b88a' : '#b9c3cf'} opacity={0.6} />
      <circle cx={moon[0] + moonR * 0.25} cy={moon[1] + moonR * 0.25} r={moonR * 0.2} fill={dusk ? '#d9b88a' : '#b9c3cf'} opacity={0.5} />
      {/* drifting cloud bands */}
      <g filter={`url(#${id}-cb)`}>
        {[0, 1, 2, 3].map((i) => {
          const cy = 380 + i * 110;
          const cx = -500 + ((i * 523 + t * (12 + i * 5) * wind) % 2200);
          return <ellipse key={i} cx={cx} cy={cy} rx={360} ry={34} fill={dusk ? '#3a1a18' : '#070b14'} opacity={0.7} />;
        })}
      </g>
      {/* far moor ridges */}
      <path d={`M-600,${H - 70} C-200,${H - 140} 200,${H - 40} 560,${H - 95} C860,${H - 140} 1200,${H - 60} 1680,${H - 120} L1680,${H + 300} L-600,${H + 300} Z`} fill={hill2} />
      <path d={`M-600,${H - 20} C-100,${H - 60} 300,${H + 10} 620,${H - 40} C900,${H - 75} 1300,${H - 10} 1680,${H - 50} L1680,${H + 300} L-600,${H + 300} Z`} fill={hill} />
      <path d={`M-600,${H - 20} C-100,${H - 60} 300,${H + 10} 620,${H - 40} C900,${H - 75} 1300,${H - 10} 1680,${H - 50}`} fill="none" stroke={stoneLit} strokeOpacity={0.25} strokeWidth={2} />
      {/* lone wind-bent hawthorn on the moor */}
      <Tree x={835} y={H - 52} scale={0.42} rot={14} t={t} which={1} sway={0.6 * wind} color={hill} />
      {/* church tower with spire, left distance */}
      <g transform={`translate(300,${H - 30})`}>
        <rect x={-34} y={-250} width={68} height={250} fill={hill} />
        <path d="M-40,-250 L0,-420 L40,-250 Z" fill={hill} />
        <path d="M-40,-250 L0,-420" stroke={stoneLit} strokeOpacity={0.35} strokeWidth={2} />
        {[-24, -2, 20].map((px) => (
          <path key={px} d={`M${px - 6},-262 l0,-14 l6,-8 l6,8 l0,14 Z`} fill={hill} stroke={stoneLit} strokeOpacity={0.25} />
        ))}
        <path d="M-9,-150 l0,-26 q9,-14 18,0 l0,26 Z" fill={dusk ? '#ffb45a' : '#020203'} opacity={dusk ? 0.6 : 1} />
      </g>
      {beyond}
      {/* road */}
      <path d={`M-200,1920 L${VPX - 50},${H + 40} L${VPX + 50},${H + 40} L1300,1920 Z`} fill={road} />
      {/* wet cobbles: faint moon/lamp sheen along the crown */}
      <path d={`M${VPX - 20},${H + 50} L${VPX - 160},1920 L${VPX + 180},1920 L${VPX + 20},${H + 50} Z`} fill={dusk ? '#ff9a50' : '#9fb4cf'} opacity={0.05} />
      {Array.from({length: 14}, (_, i) => {
        const f = depth(i / 14) / depth(1);
        const yy = mix(1920, H + 50, f);
        const hw = mix(760, 50, f);
        return <path key={i} d={`M${VPX - hw},${yy} L${VPX + hw},${yy}`} stroke="#000" strokeOpacity={0.4} strokeWidth={mix(3, 1, f)} />;
      })}
      {/* lamp pool on the road */}
      <ellipse cx={L.lampX} cy={L.lampY + 8} rx={260 * lampFlick} ry={50 * lampFlick} fill={`url(#${id}-pool)`} opacity={lampFlick} />
      {terrace(-1, 51)}
      {terrace(1, 77)}
      {/* gas lamp at the end of the road */}
      <g transform={`translate(${L.lampX},${L.lampY})`}>
        <rect x={-4} y={-lampH} width={8} height={lampH} fill="#050403" />
        <rect x={-10} y={-10} width={20} height={10} fill="#050403" />
        <path d={`M-14,${-lampH} L14,${-lampH} L10,${-lampH - 26} L-10,${-lampH - 26} Z`} fill="#050403" />
        <path d={`M-10,${-lampH - 4} L10,${-lampH - 4} L8,${-lampH - 22} L-8,${-lampH - 22} Z`} fill="#ffcf7a" opacity={0.9 * lampFlick} />
        <path d={`M-16,${-lampH - 26} L0,${-lampH - 38} L16,${-lampH - 26} Z`} fill="#050403" />
        <circle cx={0} cy={-lampH - 13} r={70} fill={`url(#${id}-pool)`} opacity={lampFlick} />
        <g transform={`scale(${L.lampS})`}>{atLamp}</g>
      </g>
    </g>
  );
};

export const streetLight = (light: Light) => (light === 'dusk' ? lerpColor(theme.candle, '#ffffff', 0.1) : theme.coldLight);

/** Foreground dry-stone garden wall the kids sit on: rounded coping stones, moss, rim light on the top edge. */
export const GardenWall: React.FC<{y: number; warm?: number; lit?: number}> = ({y, warm = 1, lit = 1}) => {
  const r = rng(212);
  const stone = lerpColor('#0b0d12', '#1e120a', warm);
  const stoneLit = lerpColor('#8fa3c0', '#ffb45a', warm);
  const caps = Array.from({length: 9}, (_, i) => ({x: -120 + i * 160 + (r() - 0.5) * 20, w: 150 + r() * 30, h: 70 + r() * 24}));
  const blocks = Array.from({length: 22}, (_, i) => ({x: -150 + (i % 8) * 180 + (Math.floor(i / 8) % 2) * 90, row: Math.floor(i / 8), w: 160 + r() * 30}));
  return (
    <g>
      <rect x={-400} y={y + 40} width={1880} height={1920} fill={stone} />
      {blocks.map((b, i) => (
        <rect key={i} x={b.x} y={y + 70 + b.row * 120} width={b.w} height={110} rx={18} fill="none" stroke="#000" strokeOpacity={0.6} strokeWidth={4} />
      ))}
      {caps.map((c, i) => (
        <g key={i}>
          <path d={`M${c.x},${y + 60} C${c.x},${y - c.h * 0.4} ${c.x + c.w},${y - c.h * 0.4} ${c.x + c.w},${y + 60} Z`} fill={stone} stroke="#000" strokeWidth={4} />
          <path d={`M${c.x + 8},${y + 20} C${c.x + 14},${y - c.h * 0.3} ${c.x + c.w - 14},${y - c.h * 0.3} ${c.x + c.w - 8},${y + 20}`} stroke={stoneLit} strokeOpacity={0.4 * lit} strokeWidth={3} fill="none" />
          {/* moss tufts */}
          <path d={`M${c.x + c.w * 0.3},${y + 40} q10,-16 20,0 q8,-12 16,2`} stroke={lerpColor('#1a2416', '#3a3a14', warm)} strokeWidth={6} fill="none" />
        </g>
      ))}
    </g>
  );
};
