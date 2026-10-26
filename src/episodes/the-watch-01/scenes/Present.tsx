import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Eyelids, Stage, Torch} from '../../../kit/fx';
import {MoorStreet} from '../../../kit/art/Street';
import {Watcher, WatcherProfile} from '../../../kit/art/Watcher';
import {MudMarks, SilverNails} from '../../../kit/art/Charms';
import {FuneralCard, Phone} from '../../../kit/art/Modern';
import {Hand, HandStyle, POSES, STYLES, lerpPose, lerpStyle, wristFor} from '../../../kit/art/Hand';
import {Wall} from '../../../kit/art/Room';
import {Duvet} from '../../../kit/art/Props';
import {WindowWall, SILL_Y} from '../../../kit/sets/WindowWall';
import {easeIn, easeInOut, easeOut, lin, mix, noise1, prog, track} from '../../../kit/util';
import {NAIL_XS, NAIL_Y, torchWorld} from './Memory';
import beats from '../beats.json';

/** Present-day shot boundaries and sync points (global seconds), derived from timing.json by beats.py. */
export const P = beats.P;

/* the present-day street through the old bedroom window (shared framing) */
const SS = {x: 343, y: 262, s: 0.62};
const W_S = 0.37, W_X = 150; // the watcher stands just past the lamp, on the moor's edge

const NightStreet: React.FC<{id: string; t: number; lamp?: number; watcher?: React.ReactNode}> = ({id, t, lamp = 1, watcher}) => (
  <MoorStreet id={id} t={t} light="night" x={SS.x} y={SS.y} s={SS.s} moon={[260, 360]} moonR={60} windowsLit={0.05} lamp={lamp} atLamp={watcher} wind={1.4} />
);

/* S09: the order-of-service card in his hands */
export const CardScene: React.FC<{t: number}> = ({t}) => {
  const lt = t - P.card;
  const tremble = noise1(t * 3, 5) * 2;
  return (
    <Camera t={t} zoom={1.02 + lt * 0.03} y={-lt * 6} shake={4} seed={91}>
      <Stage>
        <Wall id="cs-wall" x={-400} y={-600} w={1880} h={2600} lit={0.5} />
        <rect x={-400} y={-600} width={1880} height={2600} fill="#000" opacity={0.45} />
        <Hand id="cs-l" x={300} y={1330} rot={28} scale={1.3} style={STYLES.adult} pose={POSES.relaxed} light={0.7} />
        <Hand id="cs-r" x={780} y={1340} rot={-28} scale={1.3} style={STYLES.adult} pose={POSES.relaxed} mirror light={0.7} />
        <FuneralCard
          x={540 + tremble}
          y={760}
          s={1.12}
          rot={-2 + tremble * 0.3}
          name="Michael Ashworth"
          dates="1949 – 2026"
          lit={0.6}
          photo={
            <g>
              <rect x={-140} y={-260} width={280} height={340} fill="#8a7a62" />
              <WatcherProfile id="cs-ph" x={30} y={-90} s={0.42} t={0} rim="#e8dcc0" />
            </g>
          }
        />
        {/* thumbs over the card's bottom corners */}
        <ellipse cx={262} cy={1192} rx={30} ry={52} transform="rotate(-30 262 1192)" fill={STYLES.adult.skin} />
        <ellipse cx={262} cy={1192} rx={30} ry={52} transform="rotate(-30 262 1192)" fill="#000" opacity={0.35} />
        <ellipse cx={826} cy={1196} rx={30} ry={52} transform="rotate(30 826 1196)" fill={STYLES.adult.skin} />
        <ellipse cx={826} cy={1196} rx={30} ry={52} transform="rotate(30 826 1196)" fill="#000" opacity={0.35} />
      </Stage>
    </Camera>
  );
};

/* S10: the old room, twenty years on; push in past the rusted nails to the empty end of the road */
export const RoomScene: React.FC<{t: number}> = ({t}) => {
  const k = prog(t, P.room, P.black, easeInOut);
  // his hand touches the rusted nails, then withdraws
  const touch = prog(t, P.room + 0.3, P.room + 0.9, easeOut) - prog(t, P.room + 1.45, P.room + 1.8, easeIn); // gone before the next caption
  const pose = lerpPose(POSES.relaxed, POSES.point, touch);
  const [wx, wy] = wristFor(NAIL_XS[6], NAIL_Y - 6, -40, 1.25, STYLES.adult, pose);
  return (
    <Camera t={t} zoom={mix(1.0, 2.0, k)} x={mix(0, 150, k)} y={mix(120, -60, k)} shake={5} seed={101}>
      <Stage>
        <WindowWall id="rs" t={t} mode="night" cloudCover={0.4} outside={<NightStreet id="rs-st" t={t} />}>
          <SilverNails xs={NAIL_XS} y={NAIL_Y} rust={0.8} t={t} />
        </WindowWall>
        {touch > 0.01 && <Hand id="rs-h" x={mix(wx + 60, wx, touch)} y={mix(wy + 700, wy, touch)} rot={-40} scale={1.25} style={STYLES.adult} pose={pose} light={0.7} />}
      </Stage>
    </Camera>
  );
};

/* S11: waking at three: black, eyelids, the casement swinging open, curtains billowing */
export const WakeScene: React.FC<{t: number}> = ({t}) => {
  const lt = t - P.wake;
  const open = track(t, [
    [P.wake, 0],
    [P.wake + 0.35, 0.55],
    [P.wake + 0.6, 0.45],
    [P.wake + 0.9, 0.8],
    [P.wake + 1.1, 0.15],
    [P.wake + 1.3, 0.95],
  ]);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05} rot={mix(9, 2, lin(t, P.wake, P.mud))} y={40} shake={5} seed={111}>
        <Stage>
          <WindowWall id="wk" t={t} mode="night" open={0.65 + Math.sin(lt * 2.2) * 0.05} billow={1} wind={2} cloudCover={0.5} outside={<NightStreet id="wk-st" t={t} />}>
            <SilverNails xs={NAIL_XS} y={NAIL_Y} rust={0.8} t={t} />
            <MudMarks x={600} y={SILL_Y + 28} s={1.25} lit={0.8} />
          </WindowWall>
        </Stage>
      </Camera>
      <Eyelids open={open} />
    </AbsoluteFill>
  );
};

/* S12: tilt down from the open window to the sill: mud, and claw drags pointing OUT */
export const MudScene: React.FC<{t: number}> = ({t}) => {
  const k = prog(t, P.mud + 0.2, P.mud + 1.4, easeInOut);
  return (
    <Camera t={t} zoom={mix(1.3, 2.1, k)} y={mix(-60, 255, k)} x={mix(0, 20, k)} shake={5} seed={121}>
      <Stage>
        <WindowWall id="md" t={t} mode="night" open={0.65 + Math.sin((t - P.mud) * 2.2) * 0.05} billow={0.8} wind={2} cloudCover={0.5} outside={<NightStreet id="md-st" t={t} />}>
          <SilverNails xs={NAIL_XS} y={NAIL_Y} rust={0.8} t={t} />
          <MudMarks x={600} y={SILL_Y + 24} s={1.15} flat={0.55} lit={0.9} />
        </WindowWall>
      </Stage>
    </Camera>
  );
};

/* S13: Danny's texts, 3:07 a.m. */
export const PhoneScene: React.FC<{t: number}> = ({t}) => {
  const lt = t - P.phone;
  const k = prog(t, P.msgs[0] - 0.5, P.msgs[2] + 0.6, easeInOut);
  const mudHands: HandStyle = {...STYLES.adult, mud: 1};
  return (
    <Camera t={t} zoom={mix(1.0, 1.32, k)} y={mix(0, -170, k)} shake={5} seed={131}>
      <Stage>
        <rect x={-400} y={-600} width={1880} height={2600} fill="#020306" />
        <Duvet y={1500} t={t} grip={0} />
        <Phone
          id="ph"
          t={t}
          x={330}
          y={330 - lt * 2}
          s={1}
          from="Danny"
          clock="03:07"
          buzz={[P.buzz]}
          skin={mudHands.skin}
          shade={mudHands.shade}
          msgs={[
            {lines: ['Mum finally told me', 'how Mick lost his arm'], at: P.msgs[0]},
            {lines: ['The summer we were ten'], at: P.msgs[1]},
            {lines: ['The night you went', 'missing'], at: P.msgs[2]},
            {lines: ['...'], at: P.hands + 1},
          ]}
        />
      </Stage>
    </Camera>
  );
};

const START: HandStyle = {...STYLES.adult, mud: 0.9};

/* S14: the phone torch swings onto his own hand: mud on the knuckles, then the nails, then the fur */
export const HandsScene: React.FC<{t: number}> = ({t}) => {
  const lt = t - P.hands;
  const turnK = prog(t, P.hands + 0.6, P.hands + 4.6, (x) => x * x * (3 - 2 * x));
  const style = lerpStyle(START, STYLES.wolf, turnK);
  const raise = prog(t, P.hands, P.hands + 0.5, easeOut);
  const spread = prog(t, P.hands + 0.4, P.hands + 1.2);
  const freeze = prog(t, P.hands + 3.2, P.hands + 3.3);
  const tremble = 1 + freeze * 2.5;
  const pose = lerpPose(lerpPose(POSES.relaxed, POSES.flat, spread), POSES.claw, prog(t, P.hands + 3.3, P.hands + 4.9) * 0.6);
  const hx = 560 + noise1(t * 21, 2) * tremble;
  const hy = mix(1500, 1090, raise) + noise1(t * 23, 7) * tremble;
  const bx = track(t, [
    [P.hands, 300],
    [P.hands + 0.5, 520],
  ]);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1 + lt * 0.04} y={-lt * 8} shake={5} seed={141}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2600} fill="#06080d" />
          <Wall id="hs-wall" x={-400} y={-600} w={1880} h={2600} lit={0.4} />
          <Hand id="hs-h" x={hx} y={hy} rot={-6} scale={2.3} style={style} pose={pose} light={1} />
        </Stage>
      </Camera>
      <Torch x={bx} y={hy - 260 - lt * 8} r={460} ambient={0.08} />
    </AbsoluteFill>
  );
};

/* S15: both hands in the torchlight, curling to claws; the zoom jolts on "out." */
export const ProofScene: React.FC<{t: number}> = ({t}) => {
  const lt = t - P.proof;
  const curl = prog(t, P.proof + 0.3, P.out, easeIn);
  const jolt = t > P.out ? 0.04 * Math.exp(-(t - P.out) * 7) : 0;
  const pose = lerpPose(POSES.flat, POSES.claw, curl);
  const tr = noise1(t * 24, 4) * 3;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + prog(t, P.proof, P.turn) * 0.3 + jolt} y={-40} shake={6} seed={151}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2600} fill="#06080d" />
          <Wall id="pf-wall" x={-400} y={-600} w={1880} h={2600} lit={0.4} />
          <Hand id="pf-l" x={340 + tr} y={1150 - curl * 30} rot={10} scale={1.9} style={STYLES.wolf} pose={pose} mirror light={1} />
          <Hand id="pf-r" x={760 - tr} y={1160 - curl * 30} rot={-10} scale={1.9} style={STYLES.wolf} pose={pose} light={1} />
        </Stage>
      </Camera>
      <Torch x={550} y={880 - lt * 10} r={520} ambient={0.07} />
    </AbsoluteFill>
  );
};

/* S16: whip-turn to the window. The lamp dies; at the end of the road a torch clicks on, aimed at us. */
export const LastScene: React.FC<{t: number}> = ({t}) => {
  const whip = prog(t, P.turn, P.turn + 0.32, easeOut);
  const blur = (1 - whip) * 26;
  const push = prog(t, P.turn, P.cut, (x) => x);
  const lamp = t < P.lampOff ? 1 : t < P.lampOff + 0.12 ? (Math.sin(t * 90) > 0 ? 0.6 : 0) : 0;
  const on = t >= P.torchOn ? 1 : 0;
  const glare = prog(t, P.torchOn, P.cut, easeIn);
  const [tx, ty] = torchWorld(SS.x, SS.y, SS.s, W_S, W_X);
  // camera centre after the turn sits on the end of the road
  const cx = tx - 540;
  const cy = ty - 960;
  return (
    <AbsoluteFill style={{filter: blur > 0.5 ? `blur(${blur}px)` : undefined}}>
      <Camera t={t} zoom={1.0 + push * 0.38} x={(1 - whip) * 700 + mix(0, cx * 0.6, push)} y={mix(0, cy * 0.6, push)} rot={(1 - whip) * -6} shake={7} seed={161}>
        <Stage>
          <WindowWall
            id="ls"
            t={t}
            mode="night"
            open={0.7}
            billow={0.9}
            wind={2}
            cloudCover={0.6}
            outside={
              <NightStreet
                id="ls-st"
                t={t}
                lamp={lamp}
                watcher={on ? <Watcher id="ls-w" t={t} x={W_X} s={W_S} torch={1} beamTo={[-168, -2200]} beamW={40} rimA={0.15} /> : null}
              />
            }
          >
            <SilverNails xs={NAIL_XS} y={NAIL_Y} rust={0.8} t={t} />
            <MudMarks x={600} y={SILL_Y + 28} s={1.25} lit={0.8} />
          </WindowWall>
        </Stage>
      </Camera>
      {on > 0 && (
        <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
          <Stage>
            <defs>
              <radialGradient id="ls-flare">
                <stop offset="0" stopColor="#ffffff" stopOpacity={1} />
                <stop offset="0.1" stopColor="#e8f0ff" stopOpacity={0.85} />
                <stop offset="0.35" stopColor="#b8c8e8" stopOpacity={0.2} />
                <stop offset="1" stopColor="#b8c8e8" stopOpacity={0} />
              </radialGradient>
            </defs>
            <circle cx={540 + (tx - 540 - cx * 0.6 * push) * (1 + push * 0.38)} cy={960 + (ty - 960 - cy * 0.6 * push) * (1 + push * 0.38)} r={30 + glare * 300} fill="url(#ls-flare)" />
          </Stage>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
