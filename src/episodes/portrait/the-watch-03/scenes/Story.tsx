import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage, Torch} from '../../../../kit/common/fx';
import {Hand, HandStyle, POSES, STYLES, lerpPose, lerpStyle} from '../../../../kit/common/art/Hand';
import {MoorStreet, STREET} from '../../../../kit/common/art/Street';
import {SilverNails, NailHoles, HousePlate} from '../../../../kit/common/art/Charms';
import {NotebookOpen} from '../../../../kit/common/art/Notebook';
import {KitchenTable} from '../../../../kit/common/art/Interior';
import {Candle} from '../../../../kit/common/art/Props';
import {Wall} from '../../../../kit/common/art/Room';
import {DoorWall, DOOR} from '../../../../kit/portrait/sets/DoorWall';
import {WindowWall} from '../../../../kit/portrait/sets/WindowWall';
import {easeIn, easeInOut, easeOut, lerpColor, mix, noise1, prog, rng, track} from '../../../../kit/common/util';
import {PAGES_2006_LEFT, PAGES_2006_RIGHT} from '../../the-watch-02/scenes/Inside';
import beats from '../beats.json';

/** Shot boundaries and sync points (global seconds), derived from timing.json by beats.py. */
export const B = beats.B;

/** Danny: a man's hands in a green parka; tonight, already turning. */
export const DANNY: HandStyle = {...STYLES.adult, skin: '#b0907a', sleeve: '#26301f', cuff: '#323d29'};
export const DANNY_WOLF: HandStyle = {...STYLES.wolf, sleeve: '#26301f', cuff: '#323d29'};
const ME = STYLES.adult;

/* S01 hook: Mick's back door swings in; a clawed hand curls round its edge */
export const DoorHook: React.FC<{t: number}> = ({t}) => {
  const open = prog(t, 0.15, 1.4, easeOut) * 0.32;
  const curl = prog(t, 0.6, 1.6, easeOut);
  const lt = t;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.25 + lt * 0.035} x={90} y={-20} shake={6} seed={601}>
        <Stage>
          <DoorWall id="dh" t={t} mode="night" open={open} under={0.2} underColor="#9fb4cf" beyond={<rect x={0} y={0} width={1080} height={1920} fill="#050608" />}>
            <Hand id="dh-h" x={mix(560, 610, curl)} y={980} rot={-96} scale={1.45} style={lerpStyle(DANNY, DANNY_WOLF, 0.85)} pose={lerpPose(POSES.flat, POSES.claw, curl)} light={0.9} />
          </DoorWall>
        </Stage>
      </Camera>
      <Torch x={640} y={900} r={560} ambient={0.14} />
    </AbsoluteFill>
  );
};

/* S02 recap: Mick's 2006 notebook, the one-handed line */
export const Recap: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.recap;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={2.1 + lt * 0.05} x={290} y={-150} rot={-2} shake={4} seed={602}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2600} fill="#06070a" />
          <NotebookOpen id="rc" x={540} y={560} s={0.95} rot={-2} t={t} left={PAGES_2006_LEFT} right={PAGES_2006_RIGHT} heading={['2006', '']} lit={1} highlight={1} size={38} />
        </Stage>
      </Camera>
      <Torch x={700} y={760} r={420} ambient={0.06} />
    </AbsoluteFill>
  );
};

/** a silver nail lying on its side */
const Nail: React.FC<{x: number; y: number; rot?: number; s?: number; glint?: number}> = ({x, y, rot = 0, s = 1, glint = 1}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-70,-4 L60,-3 L74,0 L60,3 L-70,4 Z" fill="#aab4c2" />
    <path d="M-70,-3 L60,-2" stroke="#ffffff" strokeOpacity={0.6 * glint} strokeWidth={1.5} />
    <rect x={-80} y={-12} width={10} height={24} rx={3} fill="#c8d0dc" />
  </g>
);

/* S03 + S05: across Mick's kitchen table. Danny sits; later his finger slides a silver nail to me */
export const Table: React.FC<{t: number; slide?: boolean}> = ({t, slide}) => {
  const t0 = slide ? B.slid : B.sat;
  const lt = t - t0;
  const k = slide ? prog(t, t0 + 0.4, t0 + 2.4, easeInOut) : 0;
  const sit = slide ? 1 : prog(t, t0 + 0.2, t0 + 1.4, easeOut);
  const nx = mix(520, 560, k), ny = mix(1140, 1560, k);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={slide ? 1.25 + lt * 0.03 : 1.0 + lt * 0.02} y={slide ? 220 : 0} shake={4} seed={603}>
        <Stage>
          <Wall id={slide ? 'tb2' : 'tb'} x={-400} y={-600} w={1880} h={2000} lit={0.4} />
          <rect x={-400} y={-600} width={1880} height={2600} fill="#000" opacity={0.4} />
          <KitchenTable y={1000}>
            <Candle x={860} y={1110} t={t} s={0.55} glow={0.8} />
            {slide && <Nail x={nx} y={ny} rot={80} s={1.3} glint={0.5 + 0.5 * Math.sin(t * 6)} />}
            {/* Danny's hands across the table, fingers toward me */}
            <Hand id="tb-l" x={mix(340, 400, sit)} y={mix(700, 1080, sit)} rot={172} scale={0.95} style={DANNY} pose={POSES.relaxed} light={0.7} />
            <Hand id="tb-r" x={slide ? nx + 30 : 690} y={slide ? ny - 210 : mix(700, 1090, sit)} rot={slide ? 176 : -172} scale={0.95} style={DANNY} pose={slide ? POSES.point : POSES.relaxed} mirror light={0.7} />
          </KitchenTable>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S04: "a full moon in an hour": the moon low behind cloud through Mick's window */
export const MoonWindow: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.moon;
  return (
    <Camera t={t} zoom={1.1 + lt * 0.03} y={-120} shake={4} seed={604}>
      <Stage>
        <WindowWall id="mw" t={t} mode="night" cloudCover={0.95} wind={1.6} beam={0.4} />
      </Stage>
    </Camera>
  );
};

/* S06: out into the street, walking (go and look) */
export const StreetWalk: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.look;
  const step = Math.abs(Math.sin(lt * Math.PI * 1.9)) * 9;
  return (
    <Camera t={t} zoom={1.15 + lt * 0.05} y={40 + step} shake={6} seed={605}>
      <Stage>
        <MoorStreet id="sw" t={t} light="night" moon={[800, 520]} moonR={50} windowsLit={0.12} />
      </Stage>
    </Camera>
  );
};

/**
 * A terrace window from outside: stone wall, the enamel number, dark glass, a stone sill.
 * nails: silver nail heads in the sill; holes: fresh holes instead; inside: something behind the glass.
 */
export const OutsideSill: React.FC<{t: number; t0: number; n: string; paint: string; nails?: boolean; holes?: boolean; inside?: React.ReactNode; zoom?: number; y?: number; children?: React.ReactNode}> = ({
  t,
  t0,
  n,
  paint,
  nails = true,
  holes = false,
  inside,
  zoom = 1.6,
  y = 260,
  children,
}) => {
  const lt = t - t0;
  const r = rng(n.charCodeAt(0));
  const xs = [300, 360, 420, 480, 540, 600, 660, 720];
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={zoom + lt * 0.04} y={y} shake={5} seed={606 + n.charCodeAt(0)}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2600} fill="#0a0c10" />
          {Array.from({length: 22}, (_, i) => (
            <rect key={i} x={-400 + (i % 6) * 320 + (Math.floor(i / 6) % 2) * 160} y={-400 + Math.floor(i / 6) * 260 + 700} width={300} height={240} fill="none" stroke="#000" strokeWidth={6} opacity={0.6} />
          ))}
          {/* window: frame, dark glass, glazing bars */}
          <rect x={220} y={500} width={640} height={700} fill={paint} />
          <rect x={250} y={530} width={580} height={640} fill="#05070b" />
          {inside}
          <path d="M540,530 L540,1170 M250,850 L830,850" stroke={paint} strokeWidth={14} />
          <rect x={250} y={530} width={580} height={640} fill="#9fb4cf" opacity={0.04} />
          {/* stone sill */}
          <path d="M200,1200 L880,1200 L900,1262 L180,1262 Z" fill="#2a2e36" />
          <path d="M200,1200 L880,1200" stroke="#c8d3e3" strokeOpacity={0.3} strokeWidth={3} />
          <rect x={180} y={1262} width={720} height={40} fill="#14171d" />
          {nails && <SilverNails xs={xs} y={1228} t={t + r() * 3} rust={0.15} />}
          {holes && <NailHoles xs={xs} y={1228} />}
          <HousePlate x={960} y={760} s={1.2} n={n} />
          {children}
        </Stage>
      </Camera>
      <Torch x={540} y={1180 - y * 0.0} r={420} ambient={0.12} />
    </AbsoluteFill>
  );
};

/* S10: the whole street: a pinprick of silver at every sill */
export const StreetGlints: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.every;
  const r = rng(99);
  const pts = Array.from({length: 26}, () => [r() < 0.5 ? 60 + r() * 380 : 640 + r() * 380, 760 + r() * 600, r() * 6]);
  return (
    <Camera t={t} zoom={1.05 + lt * 0.02} y={60} shake={4} seed={607}>
      <Stage>
        <MoorStreet id="sg" t={t} light="night" moon={[800, 520]} moonR={50} windowsLit={0.06} />
        {pts.map(([x, y, ph], i) => {
          const g = Math.max(0, Math.sin(t * 2.4 + ph)) ** 6;
          return (
            <g key={i} opacity={g}>
              <path d={`M${x - 14},${y} L${x + 14},${y} M${x},${y - 14} L${x},${y + 14}`} stroke="#e8f0ff" strokeWidth={2} />
            </g>
          );
        })}
      </Stage>
    </Camera>
  );
};

/** Danny's silhouette behind Mick's glass, head and shoulders. */
const BehindGlass: React.FC<{a: number}> = ({a}) => (
  <g opacity={a}>
    <path d="M330,1170 C340,1000 420,940 480,930 L470,880 C430,860 420,800 430,760 C440,700 500,680 540,682 C590,684 640,720 640,780 C640,830 620,860 600,880 L600,930 C660,940 740,1000 750,1170 Z" fill="#000" />
    <path d="M430,760 C440,700 500,680 540,682 C590,684 640,720 640,780" stroke="#9fb4cf" strokeOpacity={0.35} strokeWidth={4} fill="none" />
  </g>
);

/* S11-S13: Mick's window: bare sill, Danny behind the glass; the fresh holes; his fist opens and the nails fall */
export const MicksWindow: React.FC<{t: number; phase: 'except' | 'holes' | 'pull'}> = ({t, phase}) => {
  const t0 = phase === 'except' ? B.except : phase === 'holes' ? B.holes : B.warn;
  const whip = phase === 'except' ? prog(t, t0, t0 + 0.3, easeOut) : 1;
  const open = phase === 'pull' ? prog(t, B.pull - 0.6, B.pull + 0.2, easeOut) : 0;
  const drop = phase === 'pull' ? prog(t, B.out - 0.3, B.out + 0.4, easeIn) : 0;
  const jolt = phase === 'pull' && t > B.out ? 0.04 * Math.exp(-(t - B.out) * 7) : 0;
  const nailXs = [300, 360, 420, 480, 540, 600, 660, 720];
  return (
    <AbsoluteFill style={{filter: whip < 0.98 ? `blur(${(1 - whip) * 22}px)` : undefined}}>
      <OutsideSill
        t={t}
        t0={t0}
        n="11"
        paint="#1c1410"
        nails={false}
        holes={phase !== 'except' || t > B.micks + 0.6}
        zoom={phase === 'holes' ? 3.0 + jolt : 1.5 + jolt}
        y={phase === 'holes' ? 680 : 240}
        inside={<BehindGlass a={phase === 'except' ? 0.9 : 0.6} />}
      >
        {phase === 'pull' && (
          <g>
            {/* his hand through the opened casement: fist over the sill, opening; the nails fall */}
            <Hand id="mw-h" x={560} y={mix(820, 1060, open)} rot={180} scale={1.2} style={lerpStyle(DANNY, DANNY_WOLF, 0.9)} pose={lerpPose(POSES.fist, POSES.flat, drop)} light={0.8} />
            {drop > 0 && nailXs.map((nx, i) => <Nail key={i} x={mix(540 + (i - 3.5) * 14, nx, drop)} y={mix(980, 1222, Math.min(1, drop * (1.2 - i * 0.03)))} rot={mix(80, (i % 2 ? 6 : -8), drop)} s={0.6} />)}
          </g>
        )}
      </OutsideSill>
    </AbsoluteFill>
  );
};

/* S14 cliffhanger: the moon comes clear; Danny's clawed hand reaches out to me; mine reaches back, changing */
export const Reach: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.reach;
  const clear = prog(t, B.reach, B.reach + 1.4, easeInOut);
  const his = prog(t, B.reach + 0.3, B.reach + 1.4, easeOut);
  const mine = prog(t, B.reach + 1.0, B.cut - 0.1, easeInOut);
  const turnK = prog(t, B.reach + 1.2, B.cut, (x) => x);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.15 + lt * 0.08} y={-60} shake={6} seed={608}>
        <Stage>
          <MoorStreet id="rc-st" t={t} light="night" x={-300} y={-420} s={1.5} moon={[700, mix(780, 560, clear)]} moonR={70} windowsLit={0.05} />
          <rect x={-400} y={-600} width={1880} height={2600} fill="#000" opacity={0.25} />
          <Hand id="rc-d" x={mix(760, 640, his)} y={mix(600, 820, his)} rot={196} scale={1.5} style={DANNY_WOLF} pose={POSES.reach} light={0.9} />
          <Hand id="rc-m" x={mix(560, 470, mine)} y={mix(2000, 1260, mine)} rot={12} scale={1.5} style={lerpStyle(ME, STYLES.wolf, turnK * 0.8)} pose={lerpPose(POSES.relaxed, POSES.reach, mine)} light={0.9} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};
export const _u = [track, noise1, lerpColor, DOOR, STREET];
