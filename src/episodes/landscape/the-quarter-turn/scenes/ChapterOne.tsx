import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage, Torch} from '../../../../kit/common/fx';
import {Hand, HandStyle, POSES, STYLES, lerpPose, wristFor} from '../../../../kit/common/art/Hand';
import {ElderProfile, Candle, Clock} from '../../../../kit/common/art/Props';
import {Wall} from '../../../../kit/common/art/Room';
import {CottageExterior, GardenView, Rose} from '../../../../kit/common/art/Cottage';
import {HospitalBed, MantelPhoto, Staircase} from '../../../../kit/common/art/Interior';
import {RainOnGlass} from '../../../../kit/common/art/Kitchen';
import {TitleCard} from '../../../../kit/common/series/TitleCard';
import {KitchenSinkL, K, SPOUT, WindowWallL, L_WIN, L_SILL_Y, DoorWallL, L_DOOR} from '../../../../kit/landscape';
import {easeIn, easeInOut, easeOut, lin, mix, noise1, prog, track} from '../../../../kit/common/util';
import {at, end, LEAD, TITLE, DRIP_T0} from '../beats';

export const GRAN: HandStyle = {...STYLES.elder, ring: '#c8a24a'};
export const BOY = STYLES.child;
export const ME = STYLES.adult;
const DRIP = {period: 2.0, t0: DRIP_T0};
const CROSS = {x: K.tapX, y: K.tapY - 252 * K.tapS}; // centre of the crosshead

/** Cut points for the cold open and Chapter I. */
export const C1 = {
  open: 0,
  title: TITLE.start,
  house: TITLE.end,
  garden: at('C1_02'),
  roses: at('C1_03'),
  summers: at('C1_04'),
  grace: at('C1_05'),
  andTap: at('C1_06'),
  clock: at('C1_07'),
  reach: at('C1_07') + 3.0,
  quarter: at('C1_08'),
  drip: at('C1_09'),
  stairs: at('C1_10'),
  asked: at('C1_11'),
  eight: at('C1_14'),
  locked: at('C1_15'),
  face: at('C1_16'),
  grandad: at('C1_17'),
  ring: at('C1_18'),
  eyes: at('C1_19'),
  died: at('C1_20'),
  wrist: at('C1_21'),
  promised: at('C1_23'),
  house2: at('C1_24'),
  end: at('C2_01') - LEAD,
};

/* S00 cold open: the tap in the dark, a drop swelling; slow pull back to the sink */
const ColdOpen: React.FC<{t: number}> = ({t}) => {
  const k = prog(t, C1.title - 3.2, C1.title, easeInOut); // hold on the drop, pull back at the end
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(2.5, 1.6, k) + t * 0.012} x={mix(SPOUT.x - 960 - 70, K.tapX - 960 + 60, k)} y={mix(SPOUT.y - 540 + 30, K.tapY - 540 - 90, k)} shake={2} seed={301}>
        <Stage>
          <KitchenSinkL id="co" t={t} mode="night" drip={DRIP} />
        </Stage>
      </Camera>
      <Torch x={1000} y={600} r={640} ambient={0.2} tint="190,210,240" />
    </AbsoluteFill>
  );
};

/* S02 the house at the end of Moor End, dusk, push in */
const House: React.FC<{t: number; night?: boolean}> = ({t, night}) => {
  const t0 = night ? C1.house2 : C1.house;
  const lt = t - t0;
  return (
    <Camera t={t} zoom={1.05 + lt * 0.018} y={-lt * 4} shake={3} seed={302}>
      <Stage>
        <CottageExterior id={night ? 'hx2' : 'hx'} t={t} light={night ? 'night' : 'dusk'} lamp={night ? 0 : 1} smoke={night ? 0 : 1} />
      </Stage>
    </Camera>
  );
};

/* S03 + S04 the garden: nettles, then the ring of roses, flowering in the snow */
const Garden: React.FC<{t: number; close?: boolean}> = ({t, close}) => {
  const t0 = close ? C1.roses : C1.garden;
  const lt = t - t0;
  return (
    <Camera t={t} zoom={close ? 2.2 + lt * 0.03 : 1.05 + lt * 0.02} x={close ? 0 : -lt * 6} y={close ? 140 : 0} shake={3} seed={close ? 304 : 303}>
      <Stage>
        <GardenView id={close ? 'gc' : 'gw'} t={t} light="dusk" snow={close ? 1 : 0.4} />
      </Stage>
    </Camera>
  );
};

/* the kitchen table (memory, warm): boy's hands; grace with Gran's hands across the table */
const Table: React.FC<{t: number; grace?: boolean}> = ({t, grace}) => {
  const t0 = grace ? C1.grace : C1.summers;
  const lt = t - t0;
  const tap = grace ? 0 : Math.max(0, Math.sin(t * 9)) * 6;
  const join = grace ? prog(t, t0 + 0.6, t0 + 1.4, easeOut) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: 'blur(10px)'}}>
        <Camera t={t} zoom={1.2} y={-160} shake={2} seed={305}>
          <Stage>
            <KitchenSinkL id={grace ? 'tg' : 'ts'} t={t} mode="lamp" />
          </Stage>
        </Camera>
      </AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.02} shake={3} seed={306}>
        <Stage>
          <path d="M-200,640 L2120,640 L2120,1200 L-200,1200 Z" fill="#3a2010" />
          {Array.from({length: 6}, (_, i) => (
            <path key={i} d={`M-200,${660 + i * 80} L2120,${650 + i * 84}`} stroke="#1a0c04" strokeWidth={4} />
          ))}
          <path d="M-200,640 L2120,640" stroke="#ffb45a" strokeOpacity={0.35} strokeWidth={4} />
          {/* plate and a glass of milk */}
          <ellipse cx={960} cy={820} rx={240} ry={70} fill="#d8cdb6" />
          <ellipse cx={960} cy={820} rx={170} ry={46} fill="#c4b79c" />
          <rect x={1260} y={640} width={80} height={140} rx={10} fill="#e8e0cc" opacity={0.85} />
          {grace ? (
            <g>
              {/* Gran's hands across the table, clasped */}
              <Hand id="gr-gl" x={870} y={600} rot={100} scale={0.72} style={{...GRAN, sleeve: '#4a2028'}} pose={POSES.relaxed} light={0.9} />
              <Hand id="gr-gr" x={1050} y={612} rot={-96} scale={0.72} style={{...GRAN, sleeve: '#4a2028'}} pose={POSES.relaxed} mirror light={0.9} />
              {/* the boy's hands come together */}
              <Hand id="gr-bl" x={mix(780, 900, join)} y={1060} rot={mix(-20, 8, join)} scale={1.25} style={BOY} pose={POSES.flat} light={0.9} />
              <Hand id="gr-br" x={mix(1140, 1020, join)} y={1060} rot={mix(20, -8, join)} scale={1.25} style={BOY} pose={POSES.flat} mirror light={0.9} />
            </g>
          ) : (
            <g>
              <Hand id="ts-bl" x={760} y={1020 - tap} rot={-12} scale={1.25} style={BOY} pose={POSES.relaxed} light={0.9} />
              <Hand id="ts-br" x={1180} y={1030} rot={14} scale={1.25} style={BOY} pose={lerpPose(POSES.relaxed, POSES.flat, 0.5)} mirror light={0.9} />
            </g>
          )}
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S07 + S09 + S10: the kitchen at night by lamplight; Gran's hand takes the cross-head; the quarter turn */
const Ritual: React.FC<{t: number; phase: 'wide' | 'reach' | 'quarter'}> = ({t, phase}) => {
  const t0 = phase === 'wide' ? C1.andTap : phase === 'reach' ? C1.reach : C1.quarter;
  const lt = t - t0;
  // the turn lands on "A quarter." (the end of the line); small false starts on "Not a half", "Not a full turn"
  const qEnd = end('C1_08');
  const turn = phase === 'quarter' ? Math.sin(prog(t, t0 + 0.3, t0 + 0.7) * Math.PI) * 6 + Math.sin(prog(t, t0 + 1.1, t0 + 1.6) * Math.PI) * 8 + prog(t, qEnd - 0.75, qEnd - 0.1, easeInOut) * 90 : 0;
  const reach = phase === 'reach' ? prog(t, t0 + 0.4, t0 + 2.0, easeOut) : phase === 'quarter' ? 1 : 0;
  const pose = lerpPose(POSES.reach, lerpPose(POSES.relaxed, POSES.fist, 0.55), prog(reach, 0.8, 1));
  const [wx, wy] = wristFor(CROSS.x + 40, CROSS.y + 6, -58 + turn * 0.25, 1.1, GRAN, pose, true);
  const hx = mix(wx + 380, wx, reach), hy = mix(wy + 420, wy, reach);
  const zoom = phase === 'wide' ? 1.0 + lt * 0.03 : phase === 'reach' ? 1.5 + lt * 0.03 : 2.8 + lt * 0.04;
  const cx = phase === 'wide' ? 0 : CROSS.x - 960 + 60;
  const cy = phase === 'wide' ? 0 : CROSS.y - 540 + (phase === 'reach' ? 120 : 40);
  return (
    <Camera t={t} zoom={zoom} x={cx} y={cy} shake={3} seed={307}>
      <Stage>
        <KitchenSinkL id={`rt-${phase}`} t={t} mode="lamp" turn={turn}>
          {reach > 0 && <Hand id={`rt-h-${phase}`} x={hx} y={hy} rot={-58 + turn * 0.25} scale={1.1} style={{...GRAN, sleeve: '#4a2028', sleeveLen: 520}} pose={pose} mirror light={0.95} />}
        </KitchenSinkL>
      </Stage>
    </Camera>
  );
};

/* S08: the kitchen clock at eleven */
const ClockShot: React.FC<{t: number}> = ({t}) => {
  const lt = t - C1.clock;
  return (
    <Camera t={t} zoom={1.0 + lt * 0.04} shake={2} seed={308}>
      <Stage>
        <Wall id="ck-wall" x={-400} y={-400} w={2720} h={1900} warm={1} lit={0.7} />
        <circle cx={960} cy={540} r={420} fill="#ff9a3c" opacity={0.07} />
        {/* the kit clock face, hung on the wall at 11:00 */}
        <g transform="translate(960,560)">
          <ClockFace t={t} />
        </g>
      </Stage>
    </Camera>
  );
};
const ClockFace: React.FC<{t: number}> = ({t}) => <Clock x={0} y={0} s={1.5} t={t} hour={11} minute={0} lit={0.9} />;

/* S11: the drip begins; Gran beside the sink, very still, watching it */
const DripWatch: React.FC<{t: number}> = ({t}) => {
  const lt = t - C1.drip;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={2.1 + lt * 0.03} x={SPOUT.x - 960 - 220} y={SPOUT.y - 540 + 40} shake={2} seed={309}>
        <Stage>
          <KitchenSinkL id="dw" t={t} mode="lamp" turn={90} drip={{...DRIP, on: prog(t, C1.drip + 1.2, C1.drip + 3.0)}} />
          <ElderProfile x={SPOUT.x - 430} y={SPOUT.y + 120} s={0.62} t={t} finger={0} lean={0.2} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S12 + S15: the stairs; a candle climbing to bed. / The locked back bedroom; the boy rattles the ring */
const Stairs: React.FC<{t: number}> = ({t}) => {
  const k = prog(t, C1.stairs, C1.asked, easeInOut);
  return (
    <Camera t={t} zoom={1.15} y={mix(140, -220, k)} shake={3} seed={310}>
      <Stage>
        <Staircase id="st" t={t} light="candle" glow={1} glowY={k} />
      </Stage>
    </Camera>
  );
};

const RING: [number, number] = [L_DOOR.cx - L_DOOR.w / 2 + L_DOOR.w * 0.8, L_DOOR.yb - L_DOOR.h * 0.46 + 40];
const LockedDoor: React.FC<{t: number; gran?: boolean}> = ({t, gran}) => {
  const t0 = gran ? C1.face : C1.locked;
  const lt = t - t0;
  const reach = gran ? 1 : prog(t, t0 + 2.8, t0 + 3.6, easeOut);
  const rattle = !gran && t > t0 + 3.8 ? Math.max(0, Math.sin((t - t0) * 30)) * (t < t0 + 6.2 ? 1 : 0) : 0;
  const take = gran ? prog(t, t0 + 0.3, t0 + 1.2, easeOut) : 0;
  const away = gran ? prog(t, t0 + 1.6, t0 + 3.2, easeInOut) : 0;
  const [bx, by] = wristFor(RING[0], RING[1], -20, 1.0, BOY, POSES.reach);
  return (
    <Camera t={t} zoom={gran ? 1.6 : 1.1 + lt * 0.05} x={gran ? RING[0] - 960 - 80 : 0} y={gran ? RING[1] - 540 + 140 : -30} shake={3} seed={311}>
      <Stage>
        <DoorWallL id={gran ? 'ldg' : 'ld'} t={t} mode="candle" knock={rattle} />
        <Hand id="ld-b" x={mix(bx + 120, bx, reach) - away * 300} y={mix(by + 500, by, reach) + rattle * 4 + away * 260} rot={-20 - away * 20} scale={1.0} style={BOY} pose={lerpPose(POSES.reach, POSES.fist, gran ? 0.4 : rattle > 0 ? 0.6 : 0)} light={0.9} />
        {gran && <Hand id="ld-g" x={mix(bx - 500, bx - 40, take) - away * 300} y={mix(by + 300, by + 110, take) + away * 260} rot={-40} scale={1.05} style={{...GRAN, sleeve: '#4a2028'}} pose={lerpPose(POSES.reach, POSES.relaxed, take)} light={0.9} />}
      </Stage>
    </Camera>
  );
};

/* S13: Gran in profile by candlelight: "Some things want fixing. Some things want watching." */
const GranSays: React.FC<{t: number}> = ({t}) => {
  const lt = t - C1.asked;
  const lean = prog(t, at('C1_13') - 0.6, at('C1_13') + 0.6);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.02} shake={2} seed={312}>
        <Stage>
          <Wall id="gs-wall" x={-400} y={-400} w={2720} h={1900} warm={1} />
          <rect x={-400} y={-400} width={2720} height={1900} fill="#000" opacity={0.35} />
          <circle cx={520} cy={900} r={700} fill="#ff9a3c" opacity={0.12} />
          <ElderProfile x={1080} y={430} s={1.05} t={t} finger={0} lean={lean * 0.6} />
        </Stage>
      </Camera>
      <AbsoluteFill style={{filter: 'blur(8px)'}}>
        <Stage>
          <Candle x={420} y={1180} t={t} s={1.3} />
        </Stage>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* S14: "I was eight." The boy's hand rises toward the tap and stops short */
const BoyAndTap: React.FC<{t: number}> = ({t}) => {
  const lt = t - C1.eight;
  const up = prog(t, C1.eight + 0.2, C1.eight + 1.6, easeOut) - prog(t, C1.eight + 2.3, C1.eight + 3.2, easeIn) * 0.7;
  return (
    <Camera t={t} zoom={1.8} x={CROSS.x - 960 + 40} y={CROSS.y - 540 + 160} shake={3} seed={313}>
      <Stage>
        <KitchenSinkL id="bt" t={t} mode="lamp" turn={90} drip={DRIP}>
          <Hand id="bt-h" x={mix(1260, 1060, up)} y={mix(1200, 700, up)} rot={-30} scale={0.9} style={BOY} pose={lerpPose(POSES.relaxed, POSES.point, up)} light={0.9} />
        </KitchenSinkL>
      </Stage>
    </Camera>
  );
};

/* S17: the photo on the mantel lies face down. The boy lifts it; Gran's hand lays it down again */
const Photo: React.FC<{t: number}> = ({t}) => {
  const t0 = C1.grandad;
  const lift = prog(t, t0 + 1.6, t0 + 2.4, easeOut) * (1 - prog(t, t0 + 4.8, t0 + 5.6, easeInOut));
  const granIn = prog(t, t0 + 4.0, t0 + 4.8, easeOut) - prog(t, t0 + 6.4, t0 + 7.4, easeIn);
  const down = 1 - lift * 0.42; // never far enough to see the photo
  const lt = t - t0;
  return (
    <Camera t={t} zoom={1.25 + lt * 0.02} y={60} shake={3} seed={314}>
      <Stage>
        <Wall id="mp-wall" x={-400} y={-400} w={2720} h={1900} warm={1} lit={0.7} />
        <circle cx={960} cy={520} r={560} fill="#ff9a3c" opacity={0.08} />
        <MantelPhoto id="mp" x={960} y={700} s={1.2} down={down} warm={1} />
        <Hand id="mp-b" x={mix(1140, 1010, prog(t, t0 + 1.0, t0 + 1.6, easeOut))} y={mix(1300, 760 - lift * 160, prog(t, t0 + 1.0, t0 + 1.6, easeOut)) + granIn * 200} rot={-14} scale={1.0} style={BOY} pose={lerpPose(POSES.relaxed, POSES.fist, 0.4)} light={0.9} />
        <Hand id="mp-g" x={mix(560, 880, granIn)} y={mix(1200, 520, granIn)} rot={40} scale={1.05} style={{...GRAN, sleeve: '#4a2028'}} pose={POSES.flat} light={0.9} />
      </Stage>
    </Camera>
  );
};

/* S18: her ring: the hand that never took it off */
const RingShot: React.FC<{t: number}> = ({t}) => {
  const lt = t - C1.ring;
  return (
    <Camera t={t} zoom={1.9 + lt * 0.03} y={-20} shake={2} seed={315}>
      <Stage>
        <Wall id="rg-wall" x={-400} y={-400} w={2720} h={1900} warm={1} lit={0.5} />
        <rect x={-400} y={-400} width={2720} height={1900} fill="#000" opacity={0.45} />
        <circle cx={960} cy={520} r={420} fill="#ffb45a" opacity={0.1} />
        <Hand id="rg-h" x={960 + noise1(t * 2, 3) * 3} y={760} rot={-8} scale={1.6} style={{...GRAN, sleeve: '#4a2028'}} pose={lerpPose(POSES.relaxed, POSES.flat, 0.4)} light={1} />
      </Stage>
    </Camera>
  );
};

/* S19: now. The moor in the rain, from the bedroom window */
const RainWindow: React.FC<{t: number}> = ({t}) => {
  const lt = t - C1.eyes;
  return (
    <Camera t={t} zoom={1.25 + lt * 0.02} y={-60} shake={3} seed={316}>
      <Stage>
        <WindowWallL id="rw" t={t} mode="night" cloudCover={0.95} beam={0.3} />
        <RainOnGlass id="rw-rain" x={L_WIN.cx - L_WIN.w / 2} y={L_SILL_Y - L_WIN.h} w={L_WIN.w} h={L_WIN.h} t={t} amount={1.2} />
        <Hand id="rw-h" x={1180} y={L_SILL_Y + 160} rot={-10} scale={1.1} style={ME} pose={POSES.relaxed} mirror light={0.6} />
      </Stage>
    </Camera>
  );
};

/* S20-S22: the hospital. Her hand on the sheet; it takes my wrist; I cover it with mine */
const Hospital: React.FC<{t: number}> = ({t}) => {
  const grab = prog(t, C1.wrist + 1.0, C1.wrist + 1.6, easeOut);
  const squeeze = t > C1.wrist + 1.6 ? 0.6 + 0.4 * Math.max(0, Math.sin((t - C1.wrist) * 3)) : grab * 0.6;
  const cover = prog(t, C1.promised + 0.5, C1.promised + 1.6, easeOut);
  const tr = (t > C1.wrist ? 3 : 1) * noise1(t * 18, 2);
  const lt = t - C1.died;
  const push = prog(t, C1.wrist, C1.house2, (x) => x);
  const gStyle: HandStyle = {...GRAN, sleeve: '#8a96a8', cuff: '#c8d0dc', skin: '#c9a890', shade: '#6a5048'};
  return (
    <Camera t={t} zoom={1.05 + lt * 0.01 + push * 0.35} y={40} shake={3} seed={317}>
      <Stage>
        <HospitalBed id="hb" t={t}>
          {/* my forearm across the sheet from the right */}
          <Hand id="hb-me" x={mix(1500, 1080, prog(t, C1.wrist + 0.2, C1.wrist + 0.9, easeOut))} y={720} rot={-92} scale={1.3} style={ME} pose={POSES.relaxed} light={0.8} />
          {/* her hand: on the sheet, then clamped round my wrist */}
          <Hand id="hb-g" x={mix(620, 1210, grab) + tr} y={mix(820, 770, grab) + tr} rot={mix(-60, 6, grab)} scale={1.2} style={gStyle} pose={lerpPose(POSES.relaxed, POSES.fist, squeeze)} light={0.9} />
          {/* my other hand covers hers */}
          {cover > 0 && <Hand id="hb-me2" x={mix(1300, 1220, cover)} y={mix(1300, 860, cover)} rot={-20} scale={1.25} style={ME} pose={POSES.relaxed} mirror light={0.8} />}
        </HospitalBed>
      </Stage>
    </Camera>
  );
};

/** Scene for a time in the cold open or Chapter I. */
export const chapterOneAt = (t: number): React.ReactNode => {
  if (t < C1.title) return <ColdOpen t={t} />;
  if (t < C1.house) return <TitleCard t={t} t0={C1.title - 1.0} title="The Quarter Turn" />;
  if (t < C1.garden) return <House t={t} />;
  if (t < C1.roses) return <Garden t={t} />;
  if (t < C1.summers) return <Garden t={t} close />;
  if (t < C1.grace) return <Table t={t} />;
  if (t < C1.andTap) return <Table t={t} grace />;
  if (t < C1.clock) return <Ritual t={t} phase="wide" />;
  if (t < C1.reach) return <ClockShot t={t} />;
  if (t < C1.quarter) return <Ritual t={t} phase="reach" />;
  if (t < C1.drip) return <Ritual t={t} phase="quarter" />;
  if (t < C1.stairs) return <DripWatch t={t} />;
  if (t < C1.asked) return <Stairs t={t} />;
  if (t < C1.eight) return <GranSays t={t} />;
  if (t < C1.locked) return <BoyAndTap t={t} />;
  if (t < C1.face) return <LockedDoor t={t} />;
  if (t < C1.grandad) return <LockedDoor t={t} gran />;
  if (t < C1.ring) return <Photo t={t} />;
  if (t < C1.eyes) return <RingShot t={t} />;
  if (t < C1.died) return <RainWindow t={t} />;
  if (t < C1.house2) return <Hospital t={t} />;
  return <House t={t} night />;
};

/** Memory (warm) vs present (cold) in Chapter I. */
export const chapterOneGrade = (t: number): 'warm' | 'cold' | 'none' =>
  t >= C1.title && t < C1.house ? 'none' : t >= C1.summers && t < C1.eyes ? 'warm' : 'cold';
