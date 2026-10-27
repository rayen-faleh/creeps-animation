import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage} from '../../../../kit/common/fx';
import {Hand, HandStyle, POSES, STYLES, lerpPose} from '../../../../kit/common/art/Hand';
import {MoorStreet, LampPostClose} from '../../../../kit/common/art/Street';
import {Watcher, WatcherProfile} from '../../../../kit/common/art/Watcher';
import {FuneralCard} from '../../../../kit/common/art/Modern';
import {Wall} from '../../../../kit/common/art/Room';
import {Dog} from '../../../../kit/common/art/Animals';
import {Shotgun, TriggerClose, WomanAiming, WomanProfileAim} from '../../../../kit/common/art/Hunter';
import {OutsideSill, DANNY_WOLF} from '../../the-watch-03/scenes/Story';
import {easeIn, easeInOut, easeOut, mix, noise1, prog, rng} from '../../../../kit/common/util';
import beats from '../beats.json';

/** Shot boundaries and sync points (global seconds), derived from timing.json by beats.py. */
export const B = beats.B;

/** Me, turned: wolf hands, my sleeve torn. */
const ME_WOLF: HandStyle = {...STYLES.wolf, sleeve: '#15171c', cuff: '#22252c'};

const tremble = (t: number, seed: number, amp = 3) => noise1(t * 9, seed) * amp;

/** A torch blazing into the lens: hot core, soft halo, a few streaks. */
const Glare: React.FC<{x: number; y: number; r?: number; a?: number; t: number}> = ({x, y, r = 260, a = 1, t}) => {
  const fl = 0.94 + noise1(t * 6, 2) * 0.06;
  return (
    <g opacity={a} style={{mixBlendMode: 'screen'}}>
      <circle cx={x} cy={y} r={r * 2.4 * fl} fill="#fff6e0" opacity={0.08} />
      <circle cx={x} cy={y} r={r * fl} fill="#fff6e0" opacity={0.35} style={{filter: 'blur(30px)'}} />
      <circle cx={x} cy={y} r={r * 0.35} fill="#ffffff" style={{filter: 'blur(8px)'}} />
      {[-30, 10, 60].map((ang, i) => (
        <rect key={i} x={x - r * 2} y={y - 3} width={r * 4} height={6} fill="#fff6e0" opacity={0.15} transform={`rotate(${ang},${x},${y})`} style={{filter: 'blur(4px)'}} />
      ))}
    </g>
  );
};

/** the night road at the end of Moor End: wet tarmac, the lamp post's foot, the moor beyond */
const LampNight: React.FC<{id: string; t: number; children?: React.ReactNode}> = ({id, t, children}) => (
  <g>
    <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
    <rect x={-400} y={1300} width={1880} height={800} fill="#0b0d12" />
    <path d="M-400,1300 L1480,1300" stroke="#9fb4cf" strokeOpacity={0.2} strokeWidth={3} />
    <ellipse cx={360} cy={1320} rx={500} ry={70} fill="#ffb45a" opacity={0.08} />
    {/* lamp light caught in the mist behind her, so her shape reads */}
    <g style={{filter: 'blur(40px)'}}>
      <ellipse cx={660} cy={640} rx={440} ry={560} fill="#6f7a8a" opacity={0.28} />
      <ellipse cx={420} cy={520} rx={300} ry={380} fill="#ffb45a" opacity={0.12} />
    </g>
    <LampPostClose id={id} x={330} y={1320} s={1.0} t={t} torch={1} glare={0.9} />
    {children}
  </g>
);

/* S01 hook: the torch at the lamp blazing into our eyes; in its glare, two barrels aimed at us; my clawed hands up */
export const Hook: React.FC<{t: number}> = ({t}) => {
  const up = prog(t, 0.1, 0.7, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1 + t * 0.03} y={-40} shake={6} seed={1101}>
        <Stage>
          <LampNight id="hk" t={t}>
            <WomanAiming x={640} y={780} s={1.0} t={t} lit={0.9} />
            <Glare x={330} y={560} r={240} t={t} />
          </LampNight>
          <Hand id="hk-l" x={200 + tremble(t, 1, 4)} y={mix(2000, 1420, up)} rot={18} scale={1.4} style={ME_WOLF} pose={POSES.claw} mirror light={1} />
          <Hand id="hk-r" x={900 + tremble(t, 2, 4)} y={mix(2000, 1440, up)} rot={-18} scale={1.4} style={ME_WOLF} pose={POSES.claw} light={1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S02: for twenty years, Mick under the lamp at the end of our road */
export const MickMemory: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.mick;
  return (
    <Camera t={t} zoom={1.15 + lt * 0.04} y={20} shake={3} seed={1102}>
      <Stage>
        <MoorStreet id="mm" t={t} light="night" moon={[800, 520]} moonR={50} windowsLit={0.35} atLamp={<Watcher id="mm-w" t={t} x={-70} s={0.37} torch={1} beamTo={[-700, -160]} rimA={0.9} />} />
      </Stage>
    </Camera>
  );
};

/* S03: Mick died this spring: the order of service */
export const Card: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.died;
  return (
    <Camera t={t} zoom={1.05 + lt * 0.03} shake={3} seed={1103}>
      <Stage>
        <Wall id="cd" x={-400} y={-600} w={1880} h={2600} lit={0.5} />
        <rect x={-400} y={-600} width={1880} height={2600} fill="#000" opacity={0.5} />
        <FuneralCard
          x={540}
          y={820}
          s={1.12}
          rot={-2}
          name="Michael Ashworth"
          dates="1949 – 2026"
          lit={0.6}
          photo={
            <g>
              <rect x={-140} y={-260} width={280} height={340} fill="#8a7a62" />
              <WatcherProfile id="cd-ph" x={30} y={-90} s={0.42} t={0} rim="#e8dcc0" />
            </g>
          }
        />
      </Stage>
    </Camera>
  );
};

/* S04 recap: Mick's sill, eight empty holes; then the window: so we could get out */
export const Recap: React.FC<{t: number}> = ({t}) => <OutsideSill t={t} t0={B.recap} n="11" paint="#1c1410" nails={false} holes zoom={mix(2.6, 1.4, prog(t, B.out - 0.4, B.out + 0.6, easeInOut))} y={mix(268, 200, prog(t, B.out - 0.4, B.out + 0.6, easeInOut))} />;

/* S05: we ran: the moor at a gallop, my clawed hands striking the heather; Danny a wolf beside me */
export const Run: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.ran;
  const gait = lt * Math.PI * 3.2;
  const lStrike = Math.max(0, Math.sin(gait));
  const rStrike = Math.max(0, Math.sin(gait + Math.PI * 0.6));
  const bob = Math.abs(Math.sin(gait)) * 22;
  const r = rng(41);
  const tufts = Array.from({length: 60}, () => [r() * 1880 - 400, r(), r() * 6]);
  const dannyIn = prog(t, B.miles - 0.4, B.miles + 0.6, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1} y={bob - 40} rot={Math.sin(gait * 0.5) * 2} shake={8} seed={1105}>
        <Stage>
          <defs>
            <linearGradient id="rn-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#04060a" />
              <stop offset="1" stopColor="#24304a" />
            </linearGradient>
          </defs>
          <rect x={-400} y={-600} width={1880} height={1500} fill="url(#rn-sky)" />
          <circle cx={760} cy={420} r={70} fill="#e8eef6" />
          <circle cx={760} cy={420} r={200} fill="#9fb4cf" opacity={0.08} />
          <path d="M-400,880 C0,860 400,900 1480,870 L1480,2100 L-400,2100 Z" fill="#0a0d12" />
          {/* heather streaming past toward us */}
          {tufts.map(([x0, d, ph], i) => {
            const k = (d + lt * 0.9) % 1; // 0 far .. 1 near
            const y = 900 + k * k * 1200;
            const x = 540 + (x0 - 540) * (0.3 + k * 1.6);
            return <path key={i} d={`M${x},${y} l${-8 - k * 20},${-14 - k * 50} M${x + 6},${y} l${4 + k * 10},${-18 - k * 60}`} stroke="#2a3040" strokeWidth={2 + k * 5} opacity={0.4 + k * 0.5} />;
          })}
          <path d="M-400,880 C0,860 400,900 1480,870" stroke="#9fb4cf" strokeOpacity={0.25} strokeWidth={3} fill="none" />
          <g opacity={dannyIn}>
            <Dog x={mix(1300, 820, dannyIn)} y={890} s={0.8} t={t} run={1} wolf light={1} />
          </g>
          <Hand id="rn-l" x={300} y={1500 - lStrike * 260} rot={8} scale={1.45} style={ME_WOLF} pose={lerpPose(POSES.claw, POSES.reach, lStrike)} mirror light={0.9} />
          <Hand id="rn-r" x={780} y={1500 - rStrike * 260} rot={-8} scale={1.45} style={ME_WOLF} pose={lerpPose(POSES.claw, POSES.reach, rStrike)} light={0.9} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S06: coming back down Moor End; at the far end, under Mick's lamp, a torch clicks on */
export const StreetTorch: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.street;
  const on = t >= B.click + 0.05 ? 1 : 0;
  const step = Math.abs(Math.sin(lt * Math.PI * 1.6)) * 8;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.2 + lt * 0.05 + (on ? 0.03 * Math.exp(-(t - B.click) * 6) : 0)} y={20 + step} shake={5} seed={1106}>
        <Stage>
          <MoorStreet id="st" t={t} light="night" moon={[800, 520]} moonR={50} windowsLit={0.05} lamp={0.6} />
          {on > 0 && <Glare x={560} y={900} r={70} t={t} />}
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S07: under Mick's lamp, where nobody should be: the torch lashed to the post, blazing */
export const PostGlare: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.lamp;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.15 + lt * 0.05} y={-60} shake={5} seed={1107}>
        <Stage>
          <LampNight id="pg" t={t} />
          <Glare x={330} y={560} r={200} t={t} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S08-09: someone had been keeping his watch: a shape steps out of the glare. Danny's mum. */
export const Reveal: React.FC<{t: number; named?: boolean}> = ({t, named}) => {
  const t0 = named ? B.mum : B.someone;
  const lt = t - t0;
  const step = named ? 1 : prog(t, B.someone + 0.2, B.mum, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={(named ? 1.45 : 1.1) + lt * 0.04} y={named ? -160 : -60} x={named ? 100 : 0} shake={5} seed={1108}>
        <Stage>
          <LampNight id={named ? 'rv2' : 'rv'} t={t}>
            <g opacity={step}>
              <WomanAiming x={mix(470, 640, step)} y={780} s={1.0} t={t} lit={0.4 + step * 0.6} />
            </g>
            <Glare x={330} y={560} r={named ? 160 : 210} t={t} />
          </LampNight>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S10: Mick's old shotgun. Both barrels. Silver: close on the muzzles, a silver gleam deep inside */
export const Barrels: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.gun;
  const glint = prog(t, B.silver, B.silver + 0.3, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.08 + (glint > 0 ? 0.04 * Math.exp(-(t - B.silver) * 6) : 0)} shake={4} seed={1110}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
          <Glare x={-60} y={300} r={200} t={t} a={0.8} />
          <Shotgun x={380} y={880} s={2.6} aim={0.2} glint={glint} lit={1} len={520} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S11: "I've watched you since you were eight, love": her, aiming at me, still */
export const Aiming: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.said;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.6 + lt * 0.03} x={100} y={-200} shake={4} seed={1111}>
        <Stage>
          <LampNight id="am" t={t}>
            <WomanAiming x={640} y={780} s={1.0} t={t} lit={1} />
            <Glare x={330} y={560} r={150} t={t} a={0.8} />
          </LampNight>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S12: she turns the gun: the muzzles swing off me into profile */
export const Turn: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.turned;
  const aim = prog(t, B.turned + 0.3, B.away + 0.6, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.04} x={mix(0, 200, aim)} shake={4} seed={1112}>
        <Stage overflow>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
          <Glare x={-80} y={300} r={200} t={t} a={0.8} />
          <Shotgun x={mix(380, 300, aim)} y={860} s={mix(2.6, 1.6, aim)} aim={mix(0.2, 1, aim)} lit={1} len={620} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S13: onto Danny: the barrels in profile, and in the torchlight on the road a wolf, snarling */
export const OntoDanny: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.danny;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1 + lt * 0.05} y={40} shake={5} seed={1113}>
        <Stage overflow>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
          <rect x={-400} y={1250} width={1880} height={900} fill="#0b0d12" />
          <ellipse cx={700} cy={1260} rx={520} ry={90} fill="#fff6e0" opacity={0.12} />
          <ellipse cx={700} cy={1000} rx={420} ry={360} fill="#fff6e0" opacity={0.06} />
          <Dog x={760} y={1270} s={1.45} t={t} fear={0.9} wolf flip light={1} warm={0.6} />
          <Shotgun x={-140} y={760} s={1.3} aim={1} lit={0.8} len={620} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S14: "it runs in our family. Not yours.": her in profile, cheek to the stock */
export const ProfileLine: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.family;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.3 + lt * 0.03} x={-60} y={-80} shake={3} seed={1114}>
        <Stage overflow>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
          <ellipse cx={300} cy={500} rx={700} ry={500} fill="#ffb45a" opacity={0.06} />
          <WomanProfileAim x={420} y={860} s={1.2} t={t} lit={1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S15: Danny's claws come up */
export const Claws: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.claws;
  const up = prog(t, B.claws + 0.1, B.claws + 0.7, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.2 + lt * 0.08} shake={7} seed={1115}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
          <ellipse cx={540} cy={800} rx={520} ry={600} fill="#fff6e0" opacity={0.08} />
          <Hand id="cl-h" x={560 + tremble(t, 7, 5)} y={mix(1900, 1000, up)} rot={mix(-10, 6, up)} scale={1.7} style={DANNY_WOLF} pose={lerpPose(POSES.relaxed, POSES.claw, up)} light={1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S16: her finger tightens on the trigger: hard cut on the click */
export const Trigger: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.finger;
  const squeeze = prog(t, B.finger + 0.3, B.cut - 0.05, easeIn);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.3 + lt * 0.2} shake={5} seed={1116}>
        <Stage overflow>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
          <ellipse cx={540} cy={900} rx={600} ry={400} fill="#ffb45a" opacity={0.06} />
          <TriggerClose x={560} y={880} s={1.3} squeeze={squeeze} lit={1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

