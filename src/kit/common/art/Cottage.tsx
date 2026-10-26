import React from 'react';
import {lerpColor, mix, noise1, rng} from '../util';
import {theme} from '../theme';
import {Tree} from './Window';

/* The house at the end of Moor End: exterior, its back garden, the ring of roses. Light: 'dusk' | 'night'. */

type Light = 'dusk' | 'night';

const skyFor = (light: Light) =>
  light === 'dusk' ? ['#1b1426', '#5e2c2c', '#d9824a'] : ['#03050a', '#0a1322', '#152338'];

/** A single rose bloom (layered petals) with an optional cap of snow. */
export const Rose: React.FC<{x: number; y: number; s?: number; snow?: number; lit?: number; light?: Light}> = ({x, y, s = 1, snow = 0, lit = 1, light = 'night'}) => {
  const red = light === 'dusk' ? '#5a0a10' : '#3e060c';
  const mid = light === 'dusk' ? '#8a1820' : '#6a0e16';
  const redLit = light === 'dusk' ? '#c8343a' : '#9a1a24';
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* outer petals, cupped */}
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <path key={a} d="M0,0 C-9,-4 -11,-14 -4,-17 C0,-18 4,-17 6,-12 C7,-6 4,-2 0,0 Z" fill={red} transform={`rotate(${a})`} />
      ))}
      {/* inner cup and a spiral */}
      <circle r={8} fill={mid} />
      <path d="M-5,1 C-6,-5 2,-8 5,-3 C6,1 1,4 -1,1 C-2,-1 0,-3 2,-2" stroke={redLit} strokeOpacity={0.8 * lit} strokeWidth={1.8} fill="none" />
      <path d="M-11,-6 C-8,-12 2,-14 8,-9" stroke={redLit} strokeOpacity={0.35 * lit} strokeWidth={1.5} fill="none" />
      {snow > 0 && <path d="M-10,-13 q6,-3 12,-1" stroke="#e8eef6" strokeOpacity={0.55 * snow} strokeWidth={2} fill="none" />}
    </g>
  );
};

/** A thorny rose bush: dark arching canes, leaves, a few blooms. */
export const RoseBush: React.FC<{x: number; y: number; s?: number; t: number; seed: number; snow?: number; lit?: number; light?: Light}> = ({x, y, s = 1, t, seed, snow = 0, lit = 1, light = 'night'}) => {
  const r = rng(seed);
  const canes = Array.from({length: 6}, () => ({a: (r() - 0.5) * 1.6, l: 90 + r() * 70, b: (r() - 0.5) * 60}));
  const sway = noise1(t * 0.6, seed) * 2;
  const leaf = light === 'dusk' ? '#1a1a0c' : '#0a100c';
  return (
    <g transform={`translate(${x},${y}) scale(${s}) rotate(${sway})`}>
      {canes.map((c, i) => {
        const ex = Math.sin(c.a) * c.l, ey = -Math.cos(c.a) * c.l;
        return (
          <g key={i}>
            <path d={`M0,0 Q${ex * 0.4 + c.b},${ey * 0.7} ${ex},${ey}`} stroke="#0a0806" strokeWidth={5} fill="none" />
            {[0.35, 0.6, 0.85].map((f, k) => (
              <g key={k}><path d={`M${ex * f},${ey * f} l${(k % 2 ? 1 : -1) * 14},-6 l-4,10 Z`} fill={leaf} />{snow > 0 && <path d={`M${ex * f},${ey * f} l${(k % 2 ? 1 : -1) * 14},-6`} stroke="#dfe8f2" strokeOpacity={0.4 * snow} strokeWidth={2} />}</g>
            ))}
            {i % 2 === 0 && <Rose x={ex} y={ey} s={0.9 + r() * 0.4} snow={snow} lit={lit} light={light} />}
          </g>
        );
      })}
    </g>
  );
};

/** Low stone cottage at the end of the road: slate roof, chimney, pointed-arch door, one lit window, moor behind. */
export const CottageExterior: React.FC<{id: string; t: number; light: Light; x?: number; y?: number; s?: number; lamp?: number; smoke?: number; moon?: [number, number]}> = ({
  id,
  t,
  light,
  x = 0,
  y = 0,
  s = 1,
  lamp = 1,
  smoke = 1,
  moon = [1480, 220],
}) => {
  const [c0, c1, c2] = skyFor(light);
  const dusk = light === 'dusk';
  const stone = dusk ? '#140a06' : '#06080d';
  const stoneLit = dusk ? '#c56a2e' : '#7d90ad';
  const hill = dusk ? '#1a0c08' : '#05070c';
  const winLit = dusk ? '#ffb45a' : '#e9b067';
  const flick = 0.85 + noise1(t * 3, 5) * 0.15;
  const r = rng(31);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c0} />
          <stop offset="0.6" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor={winLit} stopOpacity={0.5} />
          <stop offset="1" stopColor={winLit} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={-200} y={-200} width={2320} height={1100} fill={`url(#${id}-sky)`} />
      {!dusk && Array.from({length: 50}, (_, i) => <circle key={i} cx={r() * 1920} cy={r() * 500} r={r() * 1.6 + 0.4} fill="#cfd8e6" opacity={0.3 + 0.3 * Math.sin(t * 2 + i)} />)}
      <circle cx={moon[0]} cy={moon[1]} r={54} fill={dusk ? '#f3d9b0' : theme.moon} opacity={0.95} />
      <circle cx={moon[0]} cy={moon[1]} r={240} fill={dusk ? '#ffb070' : theme.moonGlow} opacity={0.1} />
      {/* moor ridges */}
      <path d="M-200,640 C200,560 560,620 900,580 C1260,540 1560,600 2120,560 L2120,1300 L-200,1300 Z" fill={lerpColor(hill, '#000', 0.2)} />
      <path d="M-200,700 C300,650 700,700 1000,672 C1400,640 1700,690 2120,660 L2120,1300 L-200,1300 Z" fill={hill} />
      <path d="M-200,700 C300,650 700,700 1000,672 C1400,640 1700,690 2120,660" stroke={stoneLit} strokeOpacity={0.22} strokeWidth={2} fill="none" />
      <Tree x={1560} y={672} scale={0.5} rot={16} t={t} which={1} sway={0.6} color={hill} />
      {/* the end of the road and the garden wall */}
      <path d="M760,1200 L900,760 L1020,760 L1160,1200 Z" fill={dusk ? '#120806' : '#05070b'} />
      <path d="M-200,830 L840,790 L840,840 L-200,900 Z" fill={stone} />
      <path d="M1080,790 L2120,830 L2120,900 L1080,840 Z" fill={stone} />
      <path d="M-200,830 L840,790 M1080,790 L2120,830" stroke={stoneLit} strokeOpacity={0.3} strokeWidth={2} />
      {/* cottage */}
      <g transform="translate(960,770)">
        <path d="M-330,0 L-330,-250 L330,-250 L330,0 Z" fill={stone} />
        {Array.from({length: 6}, (_, i) => (
          <path key={i} d={`M-330,${-40 - i * 40} L330,${-40 - i * 40}`} stroke="#000" strokeOpacity={0.45} strokeWidth={2} />
        ))}
        <path d="M-370,-250 L0,-470 L370,-250 Z" fill={lerpColor(stone, '#000', 0.3)} />
        <path d="M-370,-250 L0,-470 L370,-250" stroke={stoneLit} strokeOpacity={0.4} strokeWidth={3} fill="none" />
        {Array.from({length: 7}, (_, i) => (
          <path key={i} d={`M${-340 + i * 20},${-262 - i * 30} L${340 - i * 20},${-262 - i * 30}`} stroke="#000" strokeOpacity={0.4} strokeWidth={2} />
        ))}
        {/* chimney and smoke */}
        <rect x={180} y={-480} width={56} height={150} fill={stone} />
        <rect x={172} y={-492} width={72} height={16} fill={stone} />
        {smoke > 0 &&
          [0, 1, 2, 3, 4].map((k) => {
            const ph = ((t * 0.25 + k * 0.2) % 1);
            return <circle key={k} cx={208 + ph * 120 + noise1(t + k, k) * 10} cy={-500 - ph * 260} r={16 + ph * 50} fill={dusk ? '#3a2a28' : '#1a2230'} opacity={(1 - ph) * 0.35 * smoke} />;
          })}
        {/* pointed-arch door */}
        <path d="M-40,0 L-40,-120 Q0,-178 40,-120 L40,0 Z" fill="#0a0604" />
        <path d="M-40,0 L-40,-120 Q0,-178 40,-120 L40,0" stroke={stoneLit} strokeOpacity={0.35} strokeWidth={3} fill="none" />
        {/* windows: one lit downstairs, one dark upstairs (the back bedroom faces the garden) */}
        {[[-210, -160, lamp], [190, -160, 0.12], [-210, -330 + 90, 0], [190, -330 + 90, 0]].map(([wx, wy, on], i) => (
          <g key={i}>
            {on > 0.2 && <circle cx={wx} cy={wy} r={150} fill={`url(#${id}-glow)`} opacity={on * flick} />}
            <path d={`M${wx - 44},${wy + 50} L${wx - 44},${wy - 30} Q${wx},${wy - 72} ${wx + 44},${wy - 30} L${wx + 44},${wy + 50} Z`} fill={on > 0.2 ? winLit : '#020203'} opacity={on > 0.2 ? 0.85 * flick * on : 1} />
            <path d={`M${wx},${wy - 52} L${wx},${wy + 50} M${wx - 44},${wy + 8} L${wx + 44},${wy + 8}`} stroke="#0a0604" strokeWidth={6} />
          </g>
        ))}
      </g>
      {/* gate */}
      <g transform="translate(960,830)">
        <rect x={-120} y={-20} width={240} height={10} fill="#0a0604" />
        <rect x={-120} y={-60} width={240} height={10} fill="#0a0604" />
        {[-110, -60, -10, 40, 90].map((gx) => (
          <rect key={gx} x={gx} y={-80} width={10} height={80} fill="#0a0604" />
        ))}
      </g>
    </g>
  );
};

/**
 * The back garden from the kitchen step: nettles in the foreground, lawn, and at the bottom a ring of roses,
 * then the wall and the moor. snow 0..1 (December), frost 0..1 on the lawn; frostRing: lawn frosted except
 * inside the ring (the ground over the grave stays warm). trench 0..1 reveals the dug pipe line (Chapter III).
 */
export const GardenView: React.FC<{id: string; t: number; light: Light; snow?: number; frost?: number; frostRing?: boolean; trench?: number; children?: React.ReactNode}> = ({
  id,
  t,
  light,
  snow = 0,
  frost = 0,
  frostRing = false,
  trench = 0,
  children,
}) => {
  const [c0, c1, c2] = skyFor(light);
  const dusk = light === 'dusk';
  const lawn = dusk ? '#1a1608' : '#060a08';
  const ring = {cx: 960, cy: 700, rx: 330, ry: 82};
  const r = rng(77);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c0} />
          <stop offset="0.6" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <mask id={`${id}-noring`}>
          <rect x={-300} y={0} width={2520} height={1400} fill="#fff" />
          {frostRing && <ellipse cx={ring.cx} cy={ring.cy} rx={ring.rx + 30} ry={ring.ry + 14} fill="#000" />}
        </mask>
      </defs>
      <rect x={-300} y={-200} width={2520} height={900} fill={`url(#${id}-sky)`} />
      {!dusk && <circle cx={1500} cy={170} r={46} fill={theme.moon} />}
      <path d="M-300,520 C200,470 700,520 1000,490 C1400,460 1700,510 2220,480 L2220,700 L-300,700 Z" fill={dusk ? '#1a0c08' : '#05070c'} />
      {/* back wall */}
      <path d="M-300,600 L2220,600 L2220,640 L-300,640 Z" fill={dusk ? '#140a06' : '#06080d'} />
      <path d="M-300,600 L2220,600" stroke={dusk ? '#c56a2e' : '#7d90ad'} strokeOpacity={0.3} strokeWidth={2} />
      {/* lawn */}
      <path d="M-300,640 L2220,640 L2220,1400 L-300,1400 Z" fill={lawn} />
      {(frost > 0 || snow > 0) && <path d="M-300,640 L2220,640 L2220,1400 L-300,1400 Z" fill="#cfdbe8" opacity={Math.max(frost * 0.32, snow * 0.55)} mask={`url(#${id}-noring)`} />}
      {/* the pipe's trench, dug round the bed */}
      {trench > 0 && (
        <ellipse cx={ring.cx} cy={ring.cy} rx={ring.rx + 60} ry={ring.ry + 26} fill="none" stroke="#1a120a" strokeWidth={16} strokeDasharray={`${trench * 2400} 2400`} />
      )}
      {trench > 0 && <ellipse cx={ring.cx} cy={ring.cy} rx={ring.rx + 60} ry={ring.ry + 26} fill="none" stroke="#b86a3a" strokeOpacity={0.6} strokeWidth={4} strokeDasharray={`${trench * 2400} 2400`} />}
      {/* the bed inside the ring: dark turned earth */}
      <ellipse cx={ring.cx} cy={ring.cy} rx={ring.rx - 30} ry={ring.ry - 10} fill="#0c0806" />
      {/* the ring of roses, back half then front half */}
      {Array.from({length: 18}, (_, i) => {
        const a = (i / 18) * Math.PI * 2;
        const bx = ring.cx + Math.cos(a) * ring.rx, by = ring.cy + Math.sin(a) * ring.ry;
        return { i, bx, by, front: Math.sin(a) > 0 };
      })
        .sort((p, q) => p.by - q.by)
        .map((p) => (
          <RoseBush key={p.i} x={p.bx} y={p.by} s={0.55 + (p.by - ring.cy + ring.ry) / (2 * ring.ry) * 0.25} t={t} seed={p.i * 7 + 3} snow={snow} light={light} />
        ))}
      {children}
      {/* nettles in the foreground */}
      {Array.from({length: 26}, (_, i) => {
        const nx = -200 + (i / 25) * 2320 + (r() - 0.5) * 60;
        const ny = 1080 + r() * 80;
        const nh = 180 + r() * 220;
        const sw = noise1(t * 0.8 + i, i) * 6;
        return (
          <g key={i} transform={`translate(${nx},${ny}) rotate(${sw})`}>
            <path d={`M0,0 L0,${-nh}`} stroke="#050605" strokeWidth={6} />
            {[0.3, 0.5, 0.7, 0.9].map((f, k) => (
              <path key={k} d={`M0,${-nh * f} q${k % 2 ? 40 : -40},-10 ${k % 2 ? 54 : -54},-36 q${k % 2 ? -24 : 24},6 ${k % 2 ? -54 : 54},36 Z`} fill="#040504" />
            ))}
          </g>
        );
      })}
    </g>
  );
};
