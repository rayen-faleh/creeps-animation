import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage} from '../../../../kit/common/fx';
import {Hand, HandStyle, POSES, STYLES, lerpPose} from '../../../../kit/common/art/Hand';
import {MoorStreet} from '../../../../kit/common/art/Street';
import {Candle, Mirror} from '../../../../kit/common/art/Props';
import {Tiles} from '../../../../kit/common/art/Kitchen';
import {Phone} from '../../../../kit/common/art/Modern';
import {LettingTag, LockScreen, PedestalBasin, RollerBlind, Smoke, Threshold} from '../../../../kit/common/art/Home';
import {WindowWall, SILL_Y, WIN} from '../../../../kit/portrait/sets/WindowWall';
import {Doorstep, STEP} from '../../../../kit/portrait/sets/Doorstep';
import {easeIn, easeInOut, easeOut, mix, noise1, prog} from '../../../../kit/common/util';
import beats from '../beats.json';

/** Shot boundaries and sync points (global seconds), derived from timing.json by beats.py. */
export const B = beats.B;

/** You, a few days dead: grey skin, black claws, a dark hoodie sleeve. */
export const YOU: HandStyle = {...STYLES.vamp, sleeve: '#14161c', cuff: '#1d2028'};
const PHONE_SKIN = {skin: '#8d939b', shade: '#3c4048', nail: '#0c0d10', sleeve: '#14161c'};
const TAG = {flat: 'FLAT 2', agent: 'Moor End Lettings'};

/** tremble in px, seeded */
const tremble = (t: number, seed: number, amp = 3) => noise1(t * 9, seed) * amp;

/** The bathroom wall: cold tiles, the gilt mirror, a candle on the shelf. `reflect` is what the glass shows. */
const Bathroom: React.FC<{id: string; t: number; children?: React.ReactNode}> = ({id, t, children}) => (
  <g>
    <rect x={-400} y={-600} width={1880} height={2700} fill="#07090d" />
    <Tiles id={`${id}-tiles`} x={-400} y={-600} w={1880} h={2700} lit={0.5} />
    <rect x={-400} y={-600} width={1880} height={2700} fill="#000" opacity={0.35} />
    {/* warm pool from the candle on the right */}
    <ellipse cx={900} cy={1000} rx={520} ry={620} fill="#ff9a3c" opacity={0.07} />
    <Mirror id={`${id}-mir`} x={290} y={240} w={500} h={680} lit={0.8}>
      {/* the reflection: the wall behind you, an open door onto a dark landing, the candle, the basin rim. Nobody. */}
      <rect x={0} y={0} width={500} height={680} fill="#0b0d12" />
      <Tiles id={`${id}-rtiles`} x={-60} y={-40} w={620} h={760} lit={0.35} />
      <rect x={0} y={0} width={500} height={680} fill="#000" opacity={0.3} />
      <path d="M150,620 L150,250 C150,190 250,170 250,170 C250,170 350,190 350,250 L350,620 Z" fill="#020305" stroke="#1a1d24" strokeWidth={12} />
      <ellipse cx={110} cy={460} rx={160} ry={220} fill="#ff9a3c" opacity={0.08} />
      <g transform="translate(-480,-100) scale(1)">
        <Candle x={560} y={560} t={t + 0.7} s={0.5} glow={0.6} />
      </g>
      <path d="M-20,700 C40,640 460,640 520,700" fill="#2a2e36" />
      <path d="M-20,700 C40,640 460,640 520,700" fill="none" stroke="#9fb4cf" strokeOpacity={0.3} strokeWidth={3} />
    </Mirror>
    {/* the shelf candle (its reflection is in the glass, on the left) */}
    <rect x={850} y={980} width={200} height={16} fill="#1a1d23" />
    <Candle x={940} y={980} t={t} s={0.6} glow={0.8} />
    <PedestalBasin x={540} y={1180} s={1} lit={0.8} />
    {children}
  </g>
);

/* S01 hook: your clawed hands grip the basin; the mirror shows the room and not you. S02: push into the glass. */
export const MirrorHook: React.FC<{t: number}> = ({t}) => {
  const grip = prog(t, 0.0, 0.5, easeOut);
  const push = prog(t, B.week - 0.3, B.day1, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.08 + t * 0.02, 1.55, push)} y={mix(-20, -320, push)} shake={5} seed={701}>
        <Stage>
          <Bathroom id="mh" t={t}>
            <Hand id="mh-l" x={300 + tremble(t, 1)} y={1240} rot={62} scale={1.3} style={YOU} pose={lerpPose(POSES.relaxed, POSES.claw, grip)} mirror light={0.8} />
            <Hand id="mh-r" x={780 + tremble(t, 2)} y={1240} rot={-62} scale={1.3} style={YOU} pose={lerpPose(POSES.relaxed, POSES.claw, grip)} light={0.8} />
          </Bathroom>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S03 Day one: your hand passes in front of the glass. Nothing moves in it. */
export const NoReflection: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.day1;
  const rise = prog(t, B.day1 + 0.1, B.day1 + 0.6, easeOut);
  const sweep = prog(t, B.noRef - 0.1, B.phone, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.6 + lt * 0.03} y={-300} shake={4} seed={702}>
        <Stage>
          <Bathroom id="nr" t={t}>
            <Hand id="nr-h" x={mix(380, 700, sweep)} y={mix(1500, 640, rise) + Math.sin(lt * 3) * 8} rot={mix(-14, 10, sweep)} scale={1.25} style={YOU} pose={POSES.flat} light={0.9} />
          </Bathroom>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S04: the phone won't unlock. Face ID scans, fails, buzzes; your thumb jabs at it. */
export const FaceId: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.phone;
  const raise = prog(t, B.phone, B.phone + 0.35, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.03} y={-80} shake={4} seed={703}>
        <Stage>
          <Bathroom id="fi" t={t} />
          <rect x={-400} y={-600} width={1880} height={2700} fill="#000" opacity={0.55} />
          <Phone
            id="fi-ph"
            t={t}
            x={330}
            y={mix(1300, 420, raise)}
            s={1}
            rot={-3}
            from=""
            clock=""
            msgs={[]}
            buzz={[B.fail, B.fail + 0.55]}
            {...PHONE_SKIN}
            screen={<LockScreen t={t} time="23:47" date="Monday 3 November" scan={B.phone + 0.45} fail={B.fail} />}
          />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S05 Day two: dawn through the window; your hand strays into the sunlight, smokes, snaps back. */
export const Sun: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.day2;
  const reach = prog(t, B.day2 + 0.1, B.sun + 0.15, easeInOut);
  const burn = prog(t, B.sun + 0.1, B.sun + 0.35);
  const recoil = prog(t, B.sun + 0.35, B.sun + 0.6, easeIn);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.03} y={-40} shake={mix(4, 8, recoil)} seed={704}>
        <Stage>
          <WindowWall id="sn" t={t} mode="dawn" dawn={0.6 + lt * 0.15} cloudCover={0.2} beam={2.4}>
            <Hand
              id="sn-h"
              x={mix(820, 640, reach) + recoil * 160 + tremble(t, 5, burn * 6)}
              y={mix(1700, 1230, reach) + recoil * 380}
              rot={mix(-30, -14, reach)}
              scale={1.3}
              style={YOU}
              pose={recoil > 0 ? lerpPose(POSES.reach, POSES.fist, recoil) : POSES.reach}
              light={1}
            />
            <Smoke x={mix(640, 800, recoil)} y={mix(1080, 1400, recoil)} t={t} a={burn * (1 - recoil * 0.4)} />
          </WindowWall>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S06: the blackout blind comes down hard; the room goes cold blue. Easy. */
export const Blind: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.blind;
  const drop = prog(t, B.blind + 0.05, B.blind + 0.5, easeIn);
  const settle = drop >= 1 ? Math.exp(-(t - B.blind - 0.5) * 9) * Math.sin((t - B.blind - 0.5) * 40) * 0.015 : 0;
  const barY = 60 + 24 + (drop + settle) * 1130;
  const dawn = 0.8 * (1 - drop * 0.85);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.02} y={-40} shake={drop > 0.95 && drop < 1 ? 8 : 4} seed={705}>
        <Stage>
          <WindowWall id="bl" t={t} mode="dawn" dawn={dawn} cloudCover={0.2} beam={2.4 * (1 - drop)}>
            <RollerBlind id="bl-b" x={WIN.cx - WIN.w / 2 - 60} y={60} w={WIN.w + 120} h={SILL_Y - 90} drop={drop + settle} t={t} leak={0.7} />
            {/* your hand rides the bottom bar down, then lets go and drops away */}
            <Hand
              id="bl-h"
              x={mix(560, 600, prog(t, B.easy - 0.2, B.easy + 0.4))}
              y={barY + 130 + prog(t, B.easy - 0.2, B.easy + 0.5, easeIn) * 900}
              rot={0}
              scale={1.2}
              style={YOU}
              pose={drop < 1 ? POSES.fist : lerpPose(POSES.fist, POSES.relaxed, prog(t, B.easy - 0.3, B.easy))}
              light={0.7}
            />
          </WindowWall>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S07 Day three: out after dark; walking home, your keys swinging from a claw. */
export const WalkHome: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.day3;
  const step = Math.abs(Math.sin(lt * Math.PI * 1.9)) * 10;
  const swing = Math.sin(lt * Math.PI * 1.9) * 14;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.12 + lt * 0.05} y={30 + step} shake={6} seed={706}>
        <Stage>
          <MoorStreet id="wh" t={t} light="night" moon={[800, 520]} moonR={52} windowsLit={0.25} />
          <rect x={-400} y={-600} width={1880} height={2700} fill="#000" opacity={0.15} />
          <Hand id="wh-h" x={660} y={1060 + step * 0.6} rot={-12} scale={1.2} style={YOU} pose={POSES.fist} light={0.8} />
          <LettingTag x={668} y={900 + step * 0.6} s={1.25} rot={swing} {...TAG} lit={0.7} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

const DOORWAY = {x: STEP.cx - STEP.w / 2, y: 340, w: STEP.w, h: STEP.yb - 340};

/* S08: your door swings open on a warm hall; you step in and your hands hit nothing. Hard. */
export const Doorway: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.home;
  const open = prog(t, B.home + 0.1, B.home + 1.0, easeOut) * 0.85;
  const walk = prog(t, B.home + 0.6, B.cant, easeIn);
  const hit = t >= B.cant ? Math.exp(-(t - B.cant) * 8) : 0;
  const pressK = prog(t, B.cant - 0.25, B.cant, easeIn);
  const handY = mix(1500, 980, pressK);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + walk * 0.35 - hit * 0.05 + lt * 0.01} y={-60 + walk * 40} shake={4 + hit * 12} seed={707}>
        <Stage>
          <Doorstep id="dw" t={t} open={open}>
            <Threshold {...DOORWAY} t={t} a={t >= B.cant ? 1 : 0} touches={[{x: 400, y: 900, at: B.cant}, {x: 690, y: 880, at: B.cant + 0.04}]} />
            {pressK > 0 && (
              <g>
                <Hand id="dw-l" x={400 + tremble(t, 7)} y={handY + 40} rot={-4} scale={1.25} style={YOU} pose={POSES.flat} mirror light={0.9} />
                <Hand id="dw-r" x={690 + tremble(t, 8)} y={handY + 20} rot={4} scale={1.25} style={YOU} pose={POSES.flat} light={0.9} />
                <LettingTag x={712} y={handY + 70} s={1.1} rot={6} {...TAG} lit={0.8} warm={0.6} />
              </g>
            )}
          </Doorstep>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S09: hands flat on the invisible pane, sliding, curling; the keys slip and fall to the step. */
export const Rule: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.rule;
  const slide = prog(t, B.rule, B.rent, easeInOut);
  const curl = prog(t, B.rule + 0.8, B.drop, easeInOut);
  const fall = prog(t, B.drop, B.drop + 0.35, easeIn);
  const bounce = t > B.drop + 0.35 ? Math.abs(Math.sin((t - B.drop - 0.35) * 14)) * 30 * Math.exp(-(t - B.drop - 0.35) * 8) : 0;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.35 + lt * 0.04} y={40} shake={6} seed={708}>
        <Stage>
          <Doorstep id="ru" t={t} open={0.85}>
            <Threshold {...DOORWAY} t={t} a={1} touches={[{x: 400, y: 900 + slide * 160, at: B.cant}, {x: 690, y: 880 + slide * 160, at: B.cant + 0.04}]} />
            <Hand id="ru-l" x={400 + tremble(t, 9, 4)} y={940 + slide * 160} rot={-4 - curl * 6} scale={1.25} style={YOU} pose={lerpPose(POSES.flat, POSES.claw, curl * 0.8)} mirror light={0.9} />
            <Hand id="ru-r" x={690 + tremble(t, 10, 4)} y={900 + slide * 160} rot={4 + curl * 6} scale={1.25} style={YOU} pose={lerpPose(POSES.flat, POSES.claw, curl * 0.8)} light={0.9} />
            <LettingTag x={mix(712, 640, fall)} y={mix(970 + slide * 160, STEP.yb - 40, fall) - bounce} s={1.1} rot={mix(6, 72, fall)} {...TAG} lit={0.8} warm={0.6} />
          </Doorstep>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S10: close on the keys on the step. FLAT 2. A letting agent's tag. You rent. */
export const Rent: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.rent;
  const jolt = 0.05 * Math.exp(-lt * 6);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={2.5 + lt * 0.06 + jolt} x={150} y={460} shake={4} seed={709}>
        <Stage>
          <Doorstep id="re" t={t} open={0.85}>
            <LettingTag x={600} y={1420} s={1.1} rot={-4} {...TAG} lit={1} warm={0.7} />
          </Doorstep>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S11: the phone lights up on the step: the landlord. Inspection at nine. He'll let himself in and open up. */
export const Landlord: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.text;
  const raise = prog(t, B.text, B.text + 0.35, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.03} y={-80} shake={4} seed={710}>
        <Stage>
          <Doorstep id="ll" t={t} open={0.85} />
          <rect x={-400} y={-600} width={1880} height={2700} fill="#000" opacity={0.5} />
          <Phone
            id="ll-ph"
            t={t}
            x={300}
            y={mix(1300, 300, raise)}
            s={1.15}
            rot={2}
            from="Landlord"
            clock="04:52"
            msgs={[
              {lines: ['Hi! Inspection', 'tomorrow at 9am.'], at: B.text + 0.5},
              {lines: ["I'll let myself in", 'and open up :)'], at: B.nine + 0.25},
            ]}
            buzz={[B.text + 0.5, B.nine + 0.25]}
            {...PHONE_SKIN}
          />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S12 cliffhanger: your fist comes up to knock on your own open door. Hard cut on the knock. */
export const Knock: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.knock;
  const up = prog(t, B.knock, B.cut - 0.12, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.3 + lt * 0.3} x={-60} y={-40} shake={7} seed={711}>
        <Stage>
          <Doorstep id="kn" t={t} open={0.85}>
            <Threshold {...DOORWAY} t={t} a={0.8} />
            <Hand id="kn-h" x={mix(560, 470, up)} y={mix(1700, 900, up)} rot={mix(10, -8, up)} scale={1.35} style={YOU} pose={POSES.fist} mirror light={0.9} />
          </Doorstep>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};
