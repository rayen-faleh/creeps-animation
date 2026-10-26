import React from 'react';
import {Camera} from '../../../../kit/common/fx';
import {Floor, Grain, pileOf10, scatter, GrainSpec} from '../../../../kit/common/art/Room';
import {Hand, POSES, STYLES, lerpPose, wristFor, HandPose} from '../../../../kit/common/art/Hand';
import {WindowWall} from '../../../../kit/portrait/sets/WindowWall';
import {clamp01, easeInOut, easeOut, mix, noise1, prog, track, W} from '../../../../kit/common/util';

const WORLD_H = 3960;
const COLS = [250, 405, 560, 715, 870];
const ROWS = [2330, 2470, 2610, 2750];
const PILES = ROWS.flatMap((y, r) => COLS.map((x, c) => ({x, y, seed: 100 + r * 10 + c})));
const PILE_GRAINS: GrainSpec[][] = PILES.map((p) => pileOf10(p.x, p.y, p.seed, 0.72));
const LOOSE = scatter(70, 140, 2900, 800, 420, 7);

type Move = {from: GrainSpec; pile: number; slot: number; t0: number};
const MOVE_APPROACH = 0.24;
const MOVE_PUSH = 0.34;

// early sequence: piles 0..15 complete, pile 16 has 2 grains, 6 moves before the freeze
const EARLY_MOVES: Move[] = Array.from({length: 6}, (_, i) => ({
  from: LOOSE[i * 3 + 1],
  pile: 16,
  slot: 2 + i,
  t0: 36.62 + i * 0.6,
}));
// late: everything counted but one grain
const LATE_MOVES: Move[] = [{from: {x: 760, y: 3020, rot: 30}, pile: 19, slot: 9, t0: 55.25}];

const grainOnMove = (m: Move, t: number): GrainSpec | null => {
  const dest = PILE_GRAINS[m.pile][m.slot];
  const a = m.t0 + MOVE_APPROACH;
  if (t < a) return m.from;
  const p = easeInOut(clamp01((t - a) / MOVE_PUSH));
  return {x: mix(m.from.x, dest.x, p), y: mix(m.from.y, dest.y, p), rot: mix(m.from.rot, dest.rot, p)};
};

const tipTarget = (moves: Move[], t: number, rest: [number, number], freezeAt: number): [number, number] => {
  const tt = Math.min(t, freezeAt);
  let prev: [number, number] = rest;
  for (const m of moves) {
    const dest = PILE_GRAINS[m.pile][m.slot];
    const a = m.t0;
    const b = m.t0 + MOVE_APPROACH;
    const c = b + MOVE_PUSH;
    if (tt < a) return prev;
    if (tt < b) {
      const p = easeInOut((tt - a) / MOVE_APPROACH);
      // lift slightly between grains: arc in y
      return [mix(prev[0], m.from.x, p), mix(prev[1], m.from.y, p) - Math.sin(p * Math.PI) * 30];
    }
    if (tt < c) {
      const p = easeInOut((tt - b) / MOVE_PUSH);
      return [mix(m.from.x, dest.x, p), mix(m.from.y, dest.y, p)];
    }
    prev = [dest.x + 6, dest.y + 10];
  }
  return prev;
};

export const FloorWorld: React.FC<{t: number}> = ({t}) => {
  const late = t >= 50;
  const moves = late ? LATE_MOVES : EARLY_MOVES;
  const freezeAt = late ? 99 : 40.55;

  // ----- camera -----
  let camY = 0;
  let zoom = 1;
  let camX = 0;
  if (t < 40.44) {
    zoom = track(t, [
      [32.77, 1.0],
      [34.86, 1.07],
      [36.7, 1.12],
    ]);
    camY = track(t, [
      [34.86, 0],
      [36.7, 2060],
    ]);
  } else if (t < 50) {
    const p = prog(t, 40.6, 42.81, easeOut);
    zoom = mix(1.12, 1.4, p);
    camY = mix(2060, 2330, p);
    camX = mix(0, -40, p);
  } else if (t < 56.78) {
    zoom = track(t, [
      [55.05, 1.2],
      [56.78, 1.04],
    ]);
    camY = track(t, [
      [55.05, 2150],
      [56.78, 2030],
    ]);
  } else {
    camY = track(t, [
      [56.85, 2030],
      [57.95, 0],
    ]);
    zoom = track(t, [
      [56.85, 1.04],
      [58.33, 1.1],
    ]);
  }

  // ----- pile contents -----
  const completeBefore = late ? 19 : 16;
  const startCount = late ? 9 : 2;
  const pileEls: React.ReactNode[] = [];
  PILE_GRAINS.forEach((pile, pi) => {
    let count = 0;
    if (pi < completeBefore) count = 10;
    else if (pi === completeBefore) count = startCount;
    pile.slice(0, count).forEach((g, gi) => pileEls.push(<Grain key={`p${pi}-${gi}`} x={g.x} y={g.y} rot={g.rot} s={1.75} lit={0.8} />));
  });
  const movingEls = moves.map((m, i) => {
    if (t < m.t0 - 10) return null;
    const g = grainOnMove(m, Math.min(t, freezeAt));
    return g ? <Grain key={`m${i}`} x={g.x} y={g.y} rot={g.rot} s={1.75} lit={0.9} /> : null;
  });
  const usedLoose = new Set(EARLY_MOVES.map((m) => m.from));
  const looseEls = late
    ? null
    : LOOSE.filter((g) => !usedLoose.has(g)).map((g, i) => <Grain key={`l${i}`} x={g.x} y={g.y} rot={g.rot} s={1.75} lit={0.65} />);

  // ----- hands -----
  const tremble = t > 40.9 && t < 50 ? 1 : 0;
  const curlP = t < 50 ? prog(t, 41.0, 42.6) : 0;
  const rPose: HandPose = lerpPose(POSES.point, POSES.claw, curlP);
  const rRot = -24 + noise1(t * 3, 1) * 2;
  const rScale = 1.25;
  const [tx, ty] = tipTarget(moves, t, late ? [700, 3080] : [720, 2980], freezeAt);
  const [rwx, rwy] = wristFor(tx, ty, rRot, rScale, STYLES.vamp, rPose);
  const tr = tremble * 3;
  // left hand: flat, fingers tapping the count
  const tapping = t < freezeAt && !late;
  const lCurls = [0, 1, 2, 3, 4].map((i) => {
    const tap = tapping ? Math.max(0, Math.sin(t * 9 - i * 1.1)) * 0.45 : 0;
    return 0.08 + tap;
  }) as HandPose['curls'];
  const lPose = lerpPose({curls: lCurls, spread: 1.2}, POSES.claw, curlP);

  const dark = late && t >= 56.78 ? 1 : 0;
  return (
    <Camera t={t} zoom={zoom} x={camX} y={camY} shake={late ? 4 : 5} seed={31}>
      <svg width={W} height={WORLD_H} viewBox={`0 0 ${W} ${WORLD_H}`} style={{position: 'absolute', left: 0, top: 0}}>
        <WindowWall id="fw" t={t} mode="night" grainsVisible={0} wallH={2600} cloudCover={dark ? 1 : 0.35} beam={dark ? 0.3 : 1} />
        {/* wainscot below the sill and skirting */}
        <rect x={-200} y={1300} width={1480} height={600} fill="#07090d" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={40 + i * 260} y={1360} width={220} height={460} fill="none" stroke="#141a24" strokeWidth={6} />
        ))}
        <rect x={-200} y={1880} width={1480} height={80} fill="#040507" />
        <rect x={-200} y={1880} width={1480} height={6} fill="#6f86a6" opacity={0.12} />
        <Floor id="fwf" x={-200} y={1960} w={1480} h={2000} lit={0.9} />
        {/* moonlight pool on the floor where the rice lies */}
        <defs>
          <radialGradient id="fpool">
            <stop offset="0" stopColor="#8aa0c2" stopOpacity={0.22 * (1 - dark * 0.7)} />
            <stop offset="0.6" stopColor="#8aa0c2" stopOpacity={0.08 * (1 - dark * 0.7)} />
            <stop offset="1" stopColor="#8aa0c2" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={560} cy={2800} rx={760} ry={950} fill="url(#fpool)" />
        {PILES.map((p, i) => (
          <ellipse key={i} cx={p.x} cy={p.y + 6} rx={30} ry={16} fill="#000" opacity={i < (late ? 20 : 17) ? 0.35 : 0} />
        ))}
        {pileEls}
        {looseEls}
        {movingEls}
        <Hand
          id="fl-l"
          x={230 + noise1(t * 20, 3) * tr}
          y={3560 + noise1(t * 19, 4) * tr}
          rot={18}
          scale={1.25}
          style={STYLES.vamp}
          pose={lPose}
          mirror
          light={0.9}
        />
        <Hand id="fl-r" x={rwx + noise1(t * 21, 5) * tr} y={rwy + noise1(t * 23, 6) * tr} rot={rRot} scale={rScale} style={STYLES.vamp} pose={rPose} light={0.9} />
      </svg>
    </Camera>
  );
};
