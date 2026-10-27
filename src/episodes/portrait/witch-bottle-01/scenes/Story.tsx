import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage} from '../../../../kit/common/fx';
import {Hand, HandStyle, POSES, STYLES, armPoint, lerpPose} from '../../../../kit/common/art/Hand';
import {ElderProfile} from '../../../../kit/common/art/Props';
import {Bandage, Smoke} from '../../../../kit/common/art/Home';
import {Bellarmine, BentPin, BoneComb, Cradle, HairLock, IronNail, PigHurdle, fireFlicker} from '../../../../kit/common/art/Period';
import {CottageHearth, DaubWall, HEARTH, PLANK, PlankDoor, SmokyRafters} from '../../../../kit/portrait/sets/Cottage';
import {FenLane} from '../../../../kit/portrait/sets/FenLane';
import {easeIn, easeInOut, easeOut, mix, noise1, prog} from '../../../../kit/common/util';
import beats from '../beats.json';

/** Shot boundaries and sync points (global seconds), derived from timing.json by beats.py. */
export const B = beats.B;

/** Me at nine: small hands, a coarse brown wool sleeve. */
const ME: HandStyle = {...STYLES.child, sleeve: '#3e3022', cuff: '#4e3c2a'};
/** Gran: old hands, a grey homespun sleeve. */
const GRAN: HandStyle = {...STYLES.gran, sleeve: '#2a2622', cuff: '#38322c'};
/** Goody Ashe at the door: a woman's hand, bound in rag. */
const ASHE: HandStyle = {...STYLES.gran, wrinkles: false, skin: '#c8a890', sleeve: '#1a1612', cuff: '#24201a'};

const tremble = (t: number, seed: number, amp = 3) => noise1(t * 9, seed) * amp;
const JUG_IN_FIRE = {x: HEARTH.cx + 40, y: HEARTH.y - 230};

/* S01-02 hook: the bearded jug in the embers, hissing; push into its face */
export const JugHook: React.FC<{t: number}> = ({t}) => {
  const face = prog(t, B.boiled - 0.2, B.winter, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.5 + t * 0.03, 3.2, face)} x={mix(40, 40, face)} y={mix(240, -40, face)} shake={4} seed={901}>
        <Stage>
          <CottageHearth id="jh" t={t}>
            <Bellarmine id="jh-j" x={JUG_IN_FIRE.x} y={JUG_IN_FIRE.y} s={0.9} t={t} heat={0.8} hiss={0.9} />
          </CottageHearth>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S03 "That winter, I was nine": my small hands held out to the fire */
export const WarmHands: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.winter;
  const rise = prog(t, B.winter, B.winter + 0.8, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.2 + lt * 0.03} y={200} shake={4} seed={902}>
        <Stage>
          <CottageHearth id="wh" t={t}>
            <Hand id="wh-l" x={380 + tremble(t, 1, 2)} y={mix(1900, 1500, rise)} rot={14} scale={1.25} style={ME} pose={POSES.flat} mirror light={1} />
            <Hand id="wh-r" x={700 + tremble(t, 2, 2)} y={mix(1900, 1480, rise)} rot={-14} scale={1.25} style={ME} pose={POSES.flat} light={1} />
          </CottageHearth>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** the family asleep on the straw pallet: humps under a blanket */
const Pallet: React.FC<{t: number}> = ({t}) => {
  const fl = fireFlicker(t, 11);
  return (
    <g>
      <path d="M-300,1460 L700,1460 L760,1560 L-360,1560 Z" fill="#3a2c14" />
      {[[-160, 1.0], [80, 0.8], [300, 1.1], [520, 0.7]].map(([hx, k], i) => {
        const b = Math.sin(t * 1.5 + i) * 6;
        return (
          <g key={i}>
            {/* a head on the bolster, hair to the fire */}
            <ellipse cx={hx - 150 * k} cy={1400 - b * 0.3} rx={44 * k} ry={38 * k} fill="#1a120a" />
            <path d={`M${hx - 190 * k},${1392} C${hx - 180 * k},${1360} ${hx - 120 * k},${1356} ${hx - 108 * k},${1384}`} stroke="#ffb45a" strokeOpacity={0.35 * fl} strokeWidth={3} fill="none" />
            <path d={`M${hx - 130 * k},1470 C${hx - 110 * k},${1340 - b} ${hx + 150 * k},${1350 - b} ${hx + 170 * k},1470 Z`} fill="#2e2216" />
            <path d={`M${hx - 130 * k},1470 C${hx - 110 * k},${1340 - b} ${hx + 150 * k},${1350 - b} ${hx + 170 * k},1470`} stroke="#ffb45a" strokeOpacity={0.25 * fl} strokeWidth={3} fill="none" />
          </g>
        );
      })}
      <path d="M-300,1460 C-200,1380 600,1380 700,1460" stroke="#ffb45a" strokeOpacity={0.3 * fl} strokeWidth={3} fill="none" />
    </g>
  );
};

/* S04 "Six of us in one room. The pig behind a hurdle. Smoke in the rafters.": a slow pan, then a tilt up */
export const OneRoom: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.six;
  const pan = prog(t, B.six, B.smoke, easeInOut);
  const tilt = prog(t, B.smoke - 0.1, B.lane, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.55 + lt * 0.02} x={mix(-200, 520, pan)} y={mix(470, -1150, tilt)} shake={4} seed={903}>
        <Stage overflow>
          <DaubWall id="or" x={-600} y={-700} w={2300} h={2400} t={t} warm={0.8} />
          <SmokyRafters y={-100} t={t} smoke={1.8} />
          <rect x={-600} y={1450} width={2300} height={900} fill="#100a06" />
          <Pallet t={t} />
          <PigHurdle x={1080} y={1500} s={1.2} t={t} lit={1} />
          <ellipse cx={-400} cy={1200} rx={500} ry={500} fill="#ffb45a" opacity={0.08 * fireFlicker(t, 3)} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S05 "Three babies in our lane had died since harvest.": the churchyard at dusk, three small new graves */
export const Lane: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.lane;
  return (
    <Camera t={t} zoom={1.28 + lt * 0.03} y={420} shake={4} seed={904}>
      <Stage>
        <FenLane id="ln" t={t} graves={3} bell={Math.max(0, Math.sin((t - B.lane) * Math.PI * 0.7)) ** 8} />
      </Stage>
    </Camera>
  );
};

/* S06 + S14: the cradle by the fire; my hand rocks it; she coughs. midnight: she's still; my hand hovers */
export const CradleShot: React.FC<{t: number; still?: boolean}> = ({t, still}) => {
  const t0 = still ? B.midnight : B.cough;
  const lt = t - t0;
  const cough = still ? 0 : [0.9, 1.5, 1.9].reduce((m, c) => m + Math.exp(-Math.abs(lt - c) * 18), 0);
  const rock = still ? 0 : Math.sin(lt * 2.2) * 3;
  const hover = prog(t, t0 + 0.3, t0 + 1.4, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={(still ? 1.6 : 1.3) + lt * 0.04} y={still ? 160 : 120} x={-40} shake={still ? 3 : 4} seed={905}>
        <Stage>
          <CottageHearth id={still ? 'cs2' : 'cs'} t={t} fire={still ? 0.5 : 1}>
            <rect x={-400} y={1100} width={1880} height={900} fill="#000" opacity={0.25} />
            <Cradle x={540} y={1460 - cough * 6} s={1.1} rock={rock} t={t} lit={1} />
            {still ? (
              <Hand id="cs-h" x={mix(760, 520, hover) + tremble(t, 4, 3)} y={mix(1900, 1180, hover)} rot={-20} scale={1.1} style={ME} pose={lerpPose(POSES.relaxed, POSES.reach, hover)} light={0.8} />
            ) : (
              <Hand id="cs-h" x={800 + rock * 6} y={1420} rot={-30} scale={1.1} style={ME} pose={POSES.relaxed} light={0.8} />
            )}
          </CottageHearth>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S07 Gran in profile by the fire: "it wasn't the cold. It was someone." */
export const GranProfile: React.FC<{t: number; t0: number; lean?: number}> = ({t, t0, lean = 0}) => {
  const lt = t - t0;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.2 + lt * 0.03} x={80} y={60} shake={3} seed={906}>
        <Stage>
          <CottageHearth id="gp" t={t}>
            <rect x={-400} y={-200} width={1880} height={2200} fill="#000" opacity={0.3} />
            <ElderProfile x={780} y={900} s={1.0} t={t} finger={0} lean={lean} />
          </CottageHearth>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S08: Gran's hands take the bearded jug down from the shelf */
export const TakeJug: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.jug;
  const reach = prog(t, B.jug + 0.1, B.jug + 1.0, easeOut);
  const lift = prog(t, B.jug + 1.2, B.pins - 0.2, easeInOut);
  const jx = mix(1160, 900, lift), jy = mix(560, 760, lift);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.5 + lt * 0.03} x={420} y={-260} shake={3} seed={907}>
        <Stage overflow>
          <CottageHearth id="tj" t={t} shelf={<Bellarmine id="tj-j" x={jx} y={jy} s={0.5} t={t} lit={0.9} />}>
            <Hand id="tj-l" x={jx - 120} y={mix(1300, jy + 150, reach)} rot={20} scale={1.1} style={GRAN} pose={lerpPose(POSES.relaxed, POSES.claw, reach * 0.6)} mirror light={0.9} />
            <Hand id="tj-r" x={jx + 120} y={mix(1300, jy + 150, reach)} rot={-20} scale={1.1} style={GRAN} pose={lerpPose(POSES.relaxed, POSES.claw, reach * 0.6)} light={0.9} />
          </CottageHearth>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** the table top by the fire, the jug standing open on it */
const TableTop: React.FC<{t: number; children?: React.ReactNode}> = ({t, children}) => {
  const fl = fireFlicker(t, 12);
  return (
    <g>
      <rect x={-400} y={-600} width={1880} height={2700} fill="#0a0604" />
      <ellipse cx={200} cy={600} rx={700} ry={600} fill="#ffb45a" opacity={0.1 * fl} />
      <path d="M-400,1160 L1480,1160 L1480,2100 L-400,2100 Z" fill="#2a1a0e" />
      {Array.from({length: 6}, (_, i) => (
        <path key={i} d={`M-400,${1200 + i * 120} L1480,${1180 + i * 126}`} stroke="#000" strokeOpacity={0.4} strokeWidth={4} />
      ))}
      <path d="M-400,1160 L1480,1160" stroke="#ffb45a" strokeOpacity={0.4 * fl} strokeWidth={3} />
      {children}
    </g>
  );
};

/* S09: into the jug's mouth: bent pins, iron nails, a lock of the baby's hair */
export const Filling: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.pins;
  const drop = (t0: number) => prog(t, t0 + 0.15, t0 + 0.65, easeIn);
  const mouth = {x: 540, y: 820};
  const items = [
    {t0: B.pins, el: (k: number) => [0, 1, 2].map((i) => <BentPin key={i} x={mouth.x - 40 + i * 30} y={mix(420, mouth.y, k) + i * 20} rot={60 + i * 40 + k * 90} s={1.2} bend={40 + i * 15} />)},
    {t0: B.nails, el: (k: number) => [0, 1].map((i) => <IronNail key={i} x={mouth.x - 20 + i * 40} y={mix(420, mouth.y, k) + i * 30} rot={80 + i * 20} s={0.9} />)},
    {t0: B.lock, el: (k: number) => <HairLock x={mouth.x} y={mix(380, mouth.y - 60, k)} rot={k * 30} s={1.3} t={t} />},
  ];
  const active = [...items].reverse().find((it) => t >= it.t0) ?? items[0];
  const k = drop(active.t0);
  const handY = mix(360, 560, prog(t, active.t0, active.t0 + 0.3, easeOut));
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.3 + lt * 0.03} y={60} shake={3} seed={908}>
        <Stage>
          <TableTop t={t}>
            <Bellarmine id="fl-j" x={540} y={1120} s={1.1} t={t} lit={1} cork={false} />
            {k < 1 && active.el(k)}
            <Hand id="fl-h" x={600} y={handY} rot={178} scale={1.1} style={GRAN} pose={lerpPose(POSES.fist, POSES.relaxed, k)} light={0.8} />
          </TableTop>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S10: "and one long grey hair, from a comb I'd never seen": Gran draws it from a bone comb */
export const Comb: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.grey;
  const pull = prog(t, B.grey + 0.3, B.comb + 0.6, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.7 + lt * 0.04} y={-80} shake={3} seed={909}>
        <Stage>
          <TableTop t={t}>
            <rect x={-400} y={-600} width={1880} height={2700} fill="#000" opacity={0.2} />
            <BoneComb x={500} y={900} s={1.4} rot={-6} lit={1} />
            <HairLock x={mix(440, 640, pull)} y={mix(960, 520, pull)} rot={mix(-10, -30, pull)} s={1.1} color="#c8c8c0" long t={t} />
            <Hand id="cb-h" x={mix(460, 660, pull)} y={mix(1060, 600, pull) - 120} rot={170} scale={1.0} style={GRAN} pose={POSES.fist} light={0.9} />
          </TableTop>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S11 continuous: the jug set down into the embers; push in slowly while Gran gives the rule */
export const IntoFire: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.embers;
  const set = prog(t, B.embers + 0.1, B.embers + 1.2, easeInOut);
  const heat = prog(t, B.embers + 1.2, B.door, (x) => x);
  const push = prog(t, B.embers, B.door, easeInOut);
  const jolt = t > B.body ? 0.03 * Math.exp(-(t - B.body) * 6) : 0;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.1, 1.9, push) + jolt} x={mix(80, 40, push)} y={mix(100, 140, push)} shake={4} seed={910}>
        <Stage>
          <CottageHearth id="if" t={t}>
            <Bellarmine id="if-j" cork={set >= 1} x={JUG_IN_FIRE.x} y={mix(JUG_IN_FIRE.y - 260, JUG_IN_FIRE.y, set)} s={0.9} t={t} heat={heat * 0.7} hiss={0} lit={1} />
            {set < 1 && (
              <g>
                <Hand id="if-l" x={JUG_IN_FIRE.x - 170} y={mix(JUG_IN_FIRE.y - 60, JUG_IN_FIRE.y + 200, set)} rot={30} scale={1.1} style={GRAN} pose={POSES.claw} mirror light={1} />
                <Hand id="if-r" x={JUG_IN_FIRE.x + 170} y={mix(JUG_IN_FIRE.y - 60, JUG_IN_FIRE.y + 200, set)} rot={-30} scale={1.1} style={GRAN} pose={POSES.claw} light={1} />
              </g>
            )}
            <g opacity={prog(t, B.rule - 0.2, B.rule + 0.6)}>
              <ElderProfile x={920} y={820} s={0.8} t={t} finger={prog(t, B.body, B.body + 0.5, easeOut)} lean={0.3} />
            </g>
          </CottageHearth>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S12 + S15: our door, latch down. Then the knock: the planks jump. */
export const Door: React.FC<{t: number; knock?: boolean}> = ({t, knock}) => {
  const t0 = knock ? B.knock : B.door;
  const lt = t - t0;
  const k = knock ? [0.45, 0.85, 1.25].reduce((m, c) => m + (t - t0 > c && t - t0 < c + 0.12 ? 1 : 0), 0) : 0;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={(knock ? 1.25 : 1.05) + lt * (knock ? 0.06 : 0.03) + k * 0.015} y={knock ? 0 : 40} shake={knock ? 6 : 4} seed={911}>
        <Stage>
          <PlankDoor id={knock ? 'dk' : 'dr'} t={t} knock={k} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S13: we sat up: the fire, Gran's silhouette, the jug beginning to hiss */
export const Vigil: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.sat;
  const hiss = prog(t, B.hiss, B.hiss + 0.8);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.02} y={140} shake={3} seed={912}>
        <Stage>
          <CottageHearth id="vg" t={t} fire={0.7}>
            <Bellarmine id="vg-j" x={JUG_IN_FIRE.x} y={JUG_IN_FIRE.y} s={0.9} t={t} heat={0.75} hiss={hiss} lit={1} />
            <ElderProfile x={960} y={900} s={0.9} t={t} finger={0} lean={0.1} />
            {/* my knees, hands clasped round them */}
            <path d="M-100,2100 C-60,1700 200,1600 380,1700 C560,1600 820,1700 860,2100 Z" fill="#1a120a" />
            <Hand id="vg-l" x={330} y={1720} rot={60} scale={1.0} style={ME} pose={POSES.fist} mirror light={0.7} />
            <Hand id="vg-r" x={450} y={1720} rot={-60} scale={1.0} style={ME} pose={POSES.fist} light={0.7} />
          </CottageHearth>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S16b cliffhanger: my hand lifts the latch; the door opens a crack; a hand bound in rag curls round the edge */
export const Latch: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.open;
  const reach = prog(t, B.open - 0.6, B.open + 0.05, easeOut);
  const latch = prog(t, B.open + 0.05, B.open + 0.3, easeOut);
  const open = prog(t, B.open + 0.3, B.open + 0.75, easeOut) * 0.34;
  const curl = prog(t, B.open + 0.55, B.cut, easeOut);
  const lx = PLANK.x + PLANK.w - 120, ly = PLANK.y + 560;
  const ex = PLANK.x + PLANK.w * Math.cos(open * 1.25);
  const hx = ex + mix(-40, 20, curl);
  const [bx, by] = armPoint(hx, PLANK.y + 380, -80, 1.2, -60);
  const [cx2, cy2] = armPoint(hx, PLANK.y + 380, -80, 1.2, 20);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.35 + lt * 0.12} x={140} y={-60} shake={6} seed={913}>
        <Stage>
          <PlankDoor id="lt" t={t} open={open} latch={latch}>
            {curl > 0 && (
              <g>
                <Hand id="lt-a" x={hx} y={PLANK.y + 380} rot={-80} scale={1.2} style={ASHE} pose={lerpPose(POSES.flat, POSES.claw, curl)} light={0.6} />
                <Bandage x={cx2} y={cy2} rot={-80} s={1.25} stain={0.2} />
                <Bandage x={bx} y={by} rot={-80} s={1.35} stain={0.9} />
                <Smoke x={bx} y={by - 20} t={t} a={curl * 0.7} w={90} />
              </g>
            )}
            <Hand id="lt-h" x={mix(lx + 80, lx - 10, reach) + tremble(t, 6, 4)} y={mix(ly + 600, ly + 120, reach) - latch * 40} rot={-6} scale={1.1} style={ME} pose={lerpPose(POSES.relaxed, POSES.point, reach)} light={0.8} />
          </PlankDoor>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};
