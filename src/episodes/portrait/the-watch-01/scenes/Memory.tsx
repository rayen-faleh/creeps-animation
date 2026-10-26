import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage} from '../../../../kit/common/fx';
import {MoorStreet, GardenWall, STREET} from '../../../../kit/common/art/Street';
import {Watcher, WatcherProfile} from '../../../../kit/common/art/Watcher';
import {SilverNails, Wolfsbane} from '../../../../kit/common/art/Charms';
import {Hand, POSES, STYLES, lerpPose, wristFor} from '../../../../kit/common/art/Hand';
import {WindowWall, WIN, SILL_Y} from '../../../../kit/portrait/sets/WindowWall';
import {DoorWall, DOOR} from '../../../../kit/portrait/sets/DoorWall';
import {easeIn, easeInOut, easeOut, lin, mix, noise1, prog, track} from '../../../../kit/common/util';
import beats from '../beats.json';

/** Shot boundaries (global seconds), derived from timing.json by beats.py. Shared with Main.tsx and cues.py. */
export const T = beats.T;

/** Silver nails along the inside sill (same positions in the childhood and present-day room). */
export const NAIL_XS = [212, 268, 324, 380, 436, 492, 548, 604, 660, 716, 772, 828, 884];
export const NAIL_Y = SILL_Y + 22;

const FRIEND = {...STYLES.child, sleeve: '#5a1e1e', cuff: '#6e2a24'}; // Danny: red jumper
const KID = STYLES.child;

/* S01 + S03: sitting on the garden wall at dusk; Danny dares us, pointing at his uncle across the road */
export const WallScene: React.FC<{t: number; mock?: boolean}> = ({t, mock}) => {
  const t0 = mock ? T.mock : T.hook;
  const lt = t - t0;
  // the dare: Danny's hand swings in from the left, points, prods twice
  const h = T.profile / 4.37; // hook actions were authored for a 4.37 s hook
  const enter = mock ? 1 : prog(t, 0.7 * h, 1.3 * h, easeOut);
  const prod = mock ? 0 : Math.max(prog(t, 2.0 * h, 2.15 * h, easeOut) - prog(t, 2.15 * h, 2.4 * h), prog(t, 2.55 * h, 2.7 * h, easeOut) - prog(t, 2.7 * h, 2.95 * h));
  // mock: the hand curls into claws and swipes, "rawr"
  const clawK = mock ? prog(t, T.mock + 0.15, T.mock + 0.45, easeOut) : 0;
  const swipe = mock ? Math.sin((t - T.mock) * 9) * 18 * prog(t, T.mock + 0.4, T.mock + 0.6) : 0;
  const dPose = mock ? lerpPose(POSES.point, POSES.claw, clawK) : POSES.point;
  // our own hands grip the coping; the right one tightens when Mick looks over
  const grip = prog(t, 2.9 * h, 3.4 * h);
  const mickTurn = mock ? prog(t, T.mock + 0.6, T.mock + 1.5) : 0;
  const zoom = mock ? 1.18 + lt * 0.02 : 1.0 + lt * 0.022;
  return (
    <Camera t={t} zoom={zoom} x={mock ? 60 : lt * 10} y={mock ? 60 : 0} shake={4} seed={mock ? 12 : 11}>
      <Stage>
        <MoorStreet id="ws" t={t} light="dusk" y={-120} moon={[860, 640]} moonR={46} lamp={0.4} windowsLit={0.35} />
        {/* Mick, across the road at his own gate, hand in pocket, the other sleeve pinned */}
        <g transform={`translate(${mix(0, 40, mickTurn)},0)`}>
          <Watcher id="ws-mick" t={t} x={700} y={1430} s={0.7} torch={0} rim="#ffb070" rimA={0.95} />
        </g>
        <GardenWall y={1560} warm={1} />
        <Hand id="ws-l" x={250} y={1700} rot={-14} scale={1.25} style={KID} pose={lerpPose(POSES.relaxed, POSES.fist, 0.35)} light={0.9} />
        <Hand id="ws-r" x={800} y={1720} rot={12} scale={1.25} style={KID} pose={lerpPose(POSES.relaxed, POSES.fist, 0.35 + grip * 0.5)} mirror light={0.9} />
        <Hand
          id="ws-d"
          x={mix(-260, 150, enter) + prod * 50 + swipe + (mock ? 170 : 0)}
          y={mix(1500, 1180, enter) - prod * 30 + (mock ? Math.abs(swipe) * 0.8 + 40 : 0)}
          rot={mock ? 18 : 62}
          scale={1.35}
          style={FRIEND}
          pose={dPose}
          light={0.9}
        />
      </Stage>
    </Camera>
  );
};

/* S02: Mick in profile at dusk: "A wolf took it. On this street." */
const L03 = T.l03;
export const ProfileScene: React.FC<{t: number}> = ({t}) => {
  const lt = t - T.profile;
  const speaking = t >= L03[0] && t < L03[1];
  const jaw = speaking ? Math.max(0, Math.sin(t * 15) * 0.6 + noise1(t * 11, 4) * 0.5) : 0;
  const turn = prog(t, L03[0] - 0.63, L03[0] - 0.03) * 0.6; // he turns toward the kids before answering
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: 'blur(9px)'}}>
        <Camera t={t} zoom={1.4} shake={2} seed={21}>
          <Stage>
            <MoorStreet id="ps" t={t} light="dusk" y={-60} x={-80} moon={[300, 520]} moonR={60} lamp={0.5} windowsLit={0.4} />
          </Stage>
        </Camera>
      </AbsoluteFill>
      <Camera t={t} zoom={1 + lt * 0.026} y={-lt * 8} shake={3} seed={22}>
        <Stage>
          <rect x={-200} y={-200} width={1480} height={2400} fill="#000" opacity={0.25} />
          <WatcherProfile id="ps-mick" x={600} y={760} s={1.55} t={t} jaw={jaw} turn={-turn} rim="#ffa850" />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S04: macro on the child's sill: a fingertip runs along a row of silver nail heads (candlelight) */
export const NailsMacro: React.FC<{t: number}> = ({t}) => {
  const lt = t - T.nails;
  const k = prog(t, T.nails + 0.25, T.nails + 1.75, easeInOut);
  const tipX = mix(NAIL_XS[2], NAIL_XS[10], k);
  const tipY = NAIL_Y - 8 - Math.abs(Math.sin(k * Math.PI * 8)) * 6; // bumping over each head
  const pose = POSES.point;
  const [wx, wy] = wristFor(tipX, tipY, -62, 1.1, KID, pose);
  const approach = prog(t, T.nails, T.nails + 0.3, easeOut);
  return (
    <Camera t={t} zoom={2.05 + lt * 0.03} x={mix(-120, 120, k)} y={250} shake={3} seed={31}>
      <Stage>
        <WindowWall id="nm" t={t} mode="candle" warm={1} beam={0}>
          <SilverNails xs={NAIL_XS} y={NAIL_Y} warm={1} t={t} />
        </WindowWall>
        <Hand id="nm-h" x={wx - (1 - approach) * 200} y={wy + (1 - approach) * 260} rot={-62} scale={1.1} style={KID} pose={pose} light={0.9} />
      </Stage>
    </Camera>
  );
};

/* S05: wolfsbane hung over the bedroom door; camera tilts up from the ring pull to the bundle */
export const BaneScene: React.FC<{t: number}> = ({t}) => {
  const k = prog(t, T.bane, T.bane + 1.6, easeInOut);
  return (
    <Camera t={t} zoom={mix(1.25, 1.6, k)} y={mix(60, -560, k)} shake={3} seed={41}>
      <Stage>
        <DoorWall id="bd" t={t} mode="candle" />
        <Wolfsbane x={DOOR.cx} y={DOOR.yb - DOOR.h - 70} s={1.15} t={t} warm={1} />
      </Stage>
    </Camera>
  );
};

/* S06: full moon rising over the moor; at the lamp, Mick points the kids home. We hop off the wall and turn. */
export const HomeScene: React.FC<{t: number}> = ({t}) => {
  const lt = t - T.home;
  const lampOn = lin(t, T.home + 0.5, T.home + 0.9) * (t < T.home + 0.75 ? (Math.sin(t * 60) > 0 ? 1 : 0.2) : 1);
  const point = prog(t, T.home + 0.9, T.home + 1.4, easeOut);
  const hop = prog(t, T.window - 0.94, T.window - 0.64, easeIn);
  const turn = prog(t, T.window - 0.69, T.window, easeIn);
  return (
    <Camera t={t} zoom={1.55 + lt * 0.02 - hop * 0.05} x={turn * -520} y={-70 + hop * 90} rot={turn * -4} shake={4} seed={61}>
      <Stage>
        <MoorStreet
          id="hs"
          t={t}
          light="dusk"
          y={-40}
          moon={[700, mix(900, 790, lin(t, T.home, T.window))]}
          moonR={52}
          lamp={lampOn}
          windowsLit={0.55}
          atLamp={<Watcher id="hs-mick" t={t} x={-70} s={0.37} torch={0} point={point} rimA={0.9} />}
        />
        <GardenWall y={1720 + hop * 120} warm={1} />
        <Hand id="hs-l" x={330} y={1830 + hop * 200} rot={-10} scale={1.25} style={KID} pose={POSES.flat} light={0.9} />
        <Hand id="hs-r" x={760} y={1840 + hop * 200} rot={10} scale={1.25} style={KID} pose={POSES.flat} mirror light={0.9} />
      </Stage>
    </Camera>
  );
};

/** Watcher's torch tip in world units, for a Watcher at the lamp of a MoorStreet placed at (sx, sy, ss). */
export const torchWorld = (sx: number, sy: number, ss: number, ws: number, wx: number) => {
  const k = ss * STREET.lampS * ws;
  return [sx + ss * STREET.lampX + (wx - 168) * k, sy + ss * STREET.lampY - 530 * k];
};

/* S07: the child's bedroom window at night: Mick's torch sweeps the houses, then finds our window */
export const ChildWindow: React.FC<{t: number}> = ({t}) => {
  const lt = t - T.window;
  const ss = 0.62, sx = 343, sy = 262, ws = 0.37, wx = -40;
  const on = t > T.window + 0.35 ? 1 : 0;
  // beam target in Watcher local units: left terrace -> right terrace -> straight at us
  const ang = track(t, [
    [T.window + 0.35, 200],
    [mix(T.window + 0.35, T.glare - 0.1, 0.48), 235],
    [mix(T.window + 0.35, T.glare - 0.1, 0.63), 235],
    [mix(T.window + 0.35, T.glare - 0.1, 0.9), 305],
    [T.glare - 0.1, 300],
    [T.glare + 0.25, 270],
  ]);
  const aimed = prog(t, T.glare - 0.05, T.glare + 0.3, easeOut);
  const len = 2600 * (1 - aimed * 0.9);
  const a = (ang * Math.PI) / 180;
  const beamTo: [number, number] = [-168 + Math.cos(a) * len, -530 + Math.sin(a) * len];
  const [tx, ty] = torchWorld(sx, sy, ss, ws, wx);
  const recoil = prog(t, T.glare + 0.12, T.glare + 0.32, easeOut);
  const tremble = recoil > 0 ? noise1(t * 22, 3) * 3 : 0;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.08 + lt * 0.035} y={-60 - lt * 12} shake={4} seed={71}>
        <Stage>
          <WindowWall
            id="cw"
            t={t}
            mode="candle"
            warm={0.85}
            beam={0}
            outside={
              <MoorStreet
                id="cw-st"
                t={t}
                light="night"
                x={sx}
                y={sy}
                s={ss}
                moon={[260, 360]}
                moonR={60}
                windowsLit={0.12}
                atLamp={<Watcher id="cw-mick" t={t} x={wx} s={ws} torch={on} beamTo={on ? beamTo : undefined} beamW={mix(380, 60, aimed)} rimA={0.9} />}
              />
            }
          >
            <SilverNails xs={NAIL_XS} y={NAIL_Y} warm={1} t={t} />
          </WindowWall>
          <Hand id="cw-l" x={330 + tremble} y={SILL_Y + 120 + recoil * 190} rot={-8} scale={1.15} style={KID} pose={lerpPose(POSES.relaxed, POSES.fist, recoil)} light={0.8} />
          <Hand id="cw-r" x={760 + tremble} y={SILL_Y + 130 + recoil * 190} rot={8} scale={1.15} style={KID} pose={lerpPose(POSES.relaxed, POSES.fist, recoil)} mirror light={0.8} />
        </Stage>
      </Camera>
      {/* the torch in our eyes: lens glare in screen space */}
      {aimed > 0 && (
        <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
          <Stage>
            <defs>
              <radialGradient id="cw-flare">
                <stop offset="0" stopColor="#ffffff" stopOpacity={1} />
                <stop offset="0.1" stopColor="#fff2cf" stopOpacity={0.85} />
                <stop offset="0.35" stopColor="#ffcf80" stopOpacity={0.22} />
                <stop offset="1" stopColor="#ffcf80" stopOpacity={0} />
              </radialGradient>
            </defs>
            <circle cx={tx} cy={ty - 60 - lt * 6} r={90 + aimed * 260 + noise1(t * 30, 2) * 8} fill="url(#cw-flare)" opacity={aimed} />
            <path d={`M${tx - 520 * aimed},${ty - 60} L${tx + 520 * aimed},${ty - 60}`} stroke="#fff1cc" strokeOpacity={0.45 * aimed} strokeWidth={5} />
            <rect x={0} y={0} width={1080} height={1920} fill="#ffd9a0" opacity={0.08 * aimed} />
          </Stage>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* S08: Mick under the lamp at night, torch held low: "We called him Wolfman Mick." */
export const LampScene: React.FC<{t: number}> = ({t}) => {
  const lt = t - T.lamp;
  return (
    <Camera t={t} zoom={1 + lt * 0.05} y={-lt * 10} shake={3} seed={81}>
      <Stage>
        <MoorStreet id="ls" t={t} light="night" x={-1420} y={-2380} s={3.4} moon={[700, 520]} moonR={50} windowsLit={0.1} />
        <Watcher id="ls-mick" t={t} x={500} y={1260} s={0.98} torch={1} beamTo={[-500, 600]} beamW={120} rimA={0.85} />
      </Stage>
    </Camera>
  );
};
