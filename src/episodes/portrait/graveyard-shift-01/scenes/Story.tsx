import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Eyelids, Stage} from '../../../../kit/common/fx';
import {Hand, HandStyle, POSES, STYLES, lerpPose} from '../../../../kit/common/art/Hand';
import {Clock} from '../../../../kit/common/art/Props';
import {Grain, pileOf10, scatter} from '../../../../kit/common/art/Room';
import {Smoke} from '../../../../kit/common/art/Home';
import {Watcher} from '../../../../kit/common/art/Watcher';
import {CapedFigure, HollywoodVampire} from '../../../../kit/common/art/Vampires';
import {CoffeeMachine, Counter, Forecourt, OldCoin, Receipt, ShopDoors} from '../../../../kit/portrait/sets/PetrolStation';
import {easeIn, easeInOut, easeOut, mix, noise1, prog, track} from '../../../../kit/common/util';
import beats from '../beats.json';

/** Shot boundaries and sync points (global seconds), derived from timing.json by beats.py. */
export const B = beats.B;

/** You: a night-shift worker's hands, a navy uniform sleeve. */
export const YOU: HandStyle = {...STYLES.adult, sleeve: '#1e3a5a', cuff: '#26486e'};
/** Him: grey, clawed, a black coat sleeve. */
export const HIM: HandStyle = {...STYLES.vamp, sleeve: '#0a0a0e', cuff: '#16161c'};

const tremble = (t: number, seed: number, amp = 3) => noise1(t * 9, seed) * amp;

/* S01 hook: a man in a long black coat outside the glass doors; they stay shut */
export const Outside: React.FC<{t: number}> = ({t}) => {
  const lt = t;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.03} y={60} shake={3} seed={1401}>
        <Stage>
          <ShopDoors id="o" t={t} outside={<CapedFigure x={540} y={1470} s={0.8} t={t} rim="#e8f0f4" rimA={0.7} />} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S02: the door sensor, its red light steady; he waves at it. Nothing */
export const Sensor: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.doors;
  const wave = Math.sin(lt * 7) * prog(t, B.wouldnt - 0.6, B.wouldnt, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.7 + lt * 0.03} y={-280} shake={3} seed={1402}>
        <Stage>
          <ShopDoors id="s" t={t} outside={<g><CapedFigure x={540} y={1470} s={0.8} t={t} rim="#e8f0f4" rimA={0.7} /><Hand id="s-h" x={640 + wave * 30} y={640} rot={10 + wave * 15} scale={0.7} style={HIM} pose={POSES.flat} light={0.8} /></g>} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S03: his knuckles on the glass. No breath fogs it */
export const Knock: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.knock;
  const k = [0.4, 0.75, 1.1].reduce((m, c) => m + Math.exp(-Math.abs(lt - c) * 25), 0);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.25 + lt * 0.03} shake={3} seed={1403}>
        <Stage>
          <Forecourt id="k" t={t} y={-200} s={1.2} />
          <HollywoodVampire x={560} y={980} s={0.95} t={t} warm={0} rose={false} />
          <Hand id="k-h" x={300} y={1150 - k * 20} rot={-10} scale={1.25} style={HIM} pose={POSES.fist} light={0.8} />
          {/* the glass between us: reflections, smudges, and no mist where his mouth is */}
          <rect x={-400} y={-600} width={1880} height={2700} fill="#9fb4cf" opacity={0.07} />
          <path d="M-100,200 L300,1900" stroke="#fff" strokeOpacity={0.08} strokeWidth={60} />
          <path d="M700,-100 L1000,1200" stroke="#fff" strokeOpacity={0.05} strokeWidth={30} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S04: you press the door button. Obviously. It's a shop. The doors slide open */
export const Button: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.yes;
  const press = prog(t, B.yes + 0.2, B.yes + 0.5, easeOut);
  const open = prog(t, B.shop - 0.3, B.shop + 0.6, easeInOut);
  const wide = t >= B.shop - 0.4;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={wide ? 1.0 + (t - B.shop) * 0.02 : 1.6 + lt * 0.03} y={wide ? 60 : 200} shake={3} seed={1404}>
        <Stage>
          {wide ? (
            <ShopDoors id="b" t={t} open={open} sensor={0} outside={<CapedFigure x={540} y={1470} s={0.8} t={t} rim="#e8f0f4" rimA={0.7} />} />
          ) : (
            <g>
              <rect x={-400} y={-600} width={1880} height={2700} fill="#2a2e34" />
              <rect x={300} y={800} width={480} height={300} rx={20} fill="#d8dce2" />
              <circle cx={540} cy={950} r={80} fill={press > 0.5 ? '#2aff6a' : '#1a8a3a'} />
              <text x={540} y={1080} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={40} fontWeight={700} fill="#3a3e46">DOOR</text>
              <Hand id="b-h" x={600} y={mix(1500, 1090, press)} rot={-6} scale={1.3} style={YOU} pose={POSES.point} light={0.9} />
            </g>
          )}
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S05: a bag of rice on the counter; his grey fingers lay down coins. One says 1790 */
export const Coins: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.rice;
  const macro = t >= B.coins;
  const drop = prog(t, B.rice + 0.3, B.rice + 0.9, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={macro ? 2.2 + (t - B.coins) * 0.05 : 1.15 + lt * 0.03} x={macro ? 40 : 0} y={macro ? 300 : 120} shake={3} seed={1405}>
        <Stage>
          <Counter t={t}>
            <g transform="translate(300,960)">
              <path d="M-90,-160 L90,-160 L110,40 L-110,40 Z" fill="#e8e0c8" />
              <text x={0} y={-50} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontWeight={700} fontSize={40} fill="#5a3a2a">RICE</text>
              <text x={0} y={-10} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={26} fill="#5a3a2a">1kg</text>
            </g>
            <OldCoin x={560} y={1150} s={0.9 * drop} date="1790" />
            <OldCoin x={700} y={1170} s={0.75 * drop} date="1788" />
            <Hand id="c-h" x={mix(640, 700, drop)} y={mix(700, 900, drop)} rot={185} scale={1.2} style={HIM} pose={POSES.relaxed} light={0.9} />
          </Counter>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** what CAM 2 sees: the counter from above and behind, you at the till, nobody across from you */
const CctvView: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width={312} height={222} fill="#0c1a10" />
    <rect x={20} y={120} width={272} height={20} fill="#2a4a32" />
    <rect x={20} y={140} width={272} height={82} fill="#1a3020" />
    {/* you: head and shoulders behind the counter */}
    <circle cx={110} cy={152 + Math.sin(t * 2) * 1} r={20} fill="#4a7a54" />
    <path d="M70,222 C72,190 90,172 110,170 C130,172 150,190 152,222 Z" fill="#4a7a54" />
    {/* the bag of rice and coins on the counter, a customer's space with no one in it */}
    <rect x={186} y={104} width={26} height={22} fill="#6a9a74" />
    <circle cx={226} cy={122} r={4} fill="#8aba94" />
    <rect x={0} y={0} width={312} height={222} fill="#9aff9a" opacity={0.05 + noise1(t * 20, 4) * 0.03} />
  </g>
);

/* S06: on the CCTV screen, you were serving nobody */
export const Cctv: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.cctv;
  const push = prog(t, B.cctv, B.nobody + 0.6, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.3, 3.2, push) + lt * 0.02} x={mix(-200, -310, push)} y={mix(-600, -715, push)} shake={3} seed={1406}>
        <Stage overflow>
          <Counter t={t} cctv={<CctvView t={t} />} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S07: he leans over the counter: "you look tired". A badge glints under his coat for a few frames */
export const Lean: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.lean;
  const lean = prog(t, B.lean, B.tired, easeInOut);
  const glint = Math.abs(t - (B.tired + 0.35)) < 0.12 ? 1 : 0;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1 + lean * 0.5 + lt * 0.02} y={-120} shake={3} seed={1407}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#1a1e24" />
          <rect x={-100} y={-80} width={260} height={18} fill="#e8f0f4" />
          <HollywoodVampire x={mix(640, 560, lean)} y={mix(960, 900, lean)} s={mix(1.0, 1.25, lean)} t={t} warm={0} rose={false} />
          {/* the staff badge under the coat: "R. — NIGHT MANAGER" */}
          <g transform={`translate(${mix(520, 380, lean)},${mix(1330, 1360, lean)}) rotate(-6)`}>
            <rect x={-80} y={-26} width={160} height={52} rx={6} fill="#c8ccd2" />
            <text x={0} y={-2} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontWeight={700} fontSize={18} fill="#1a1e24">R.</text>
            <text x={0} y={18} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={13} fill="#1a1e24">NIGHT MANAGER</text>
            <circle cx={60} cy={-14} r={16} fill="#fff" opacity={glint * 0.9} style={{filter: 'blur(4px)'}} />
          </g>
          <path d="M-400,1500 L1480,1500 L1480,2100 L-400,2100 Z" fill="#3a3a40" />
          <path d="M-400,1500 L1480,1500" stroke="#e8f0f4" strokeOpacity={0.35} strokeWidth={4} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S09: you wake on the floor; the wall clock says 3:33 */
export const Wake: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.wake;
  const open = track(t, [
    [B.wake, 0],
    [B.wake + 0.35, 0.55],
    [B.wake + 0.6, 0.45],
    [B.wake + 1.0, 0.8],
    [B.wake + 1.15, 0.2],
    [B.wake + 1.5, 0.95],
  ]);
  const sit = prog(t, B.till - 0.3, B.till + 0.6, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.3, 1.0, sit) + lt * 0.01} rot={mix(-78, 0, sit)} y={mix(300, 60, sit)} shake={3} seed={1409}>
        <Stage overflow>
          <Counter t={t}>
            <rect x={-400} y={-600} width={1880} height={600} fill="#1a1e24" />
            <Clock x={300} y={-240} s={0.9} t={t} hour={3} minute={33} lit={0.8} />
          </Counter>
        </Stage>
      </Camera>
      <Eyelids open={open} />
    </AbsoluteFill>
  );
};

const RICE = scatter(140, 120, 1250, 840, 520, 91);

/* S10: rice everywhere, and your hands counting it into tens */
export const Counting: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.count;
  const piles = Array.from({length: 8}, (_, i) => pileOf10(240 + (i % 4) * 200, 1150 + Math.floor(i / 4) * 170, 500 + i));
  const shown = Math.min(piles.length, 1 + Math.floor(lt * 2.4));
  const hx = 240 + ((shown - 1) % 4) * 200;
  const hy = 1150 + Math.floor((shown - 1) / 4) * 170;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.2 + lt * 0.03} y={200} shake={3} seed={1410}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#2a2e34" />
          {Array.from({length: 8}, (_, i) => (
            <path key={i} d={`M${-400 + i * 260},800 L${-700 + i * 330},2100`} stroke="#000" strokeOpacity={0.25} strokeWidth={3} />
          ))}
          {RICE.map((g, i) => (
            <Grain key={i} x={g.x} y={g.y + 160} rot={g.rot} s={1.2} lit={0.6} />
          ))}
          {piles.slice(0, shown).map((p, i) => p.map((g, k) => <Grain key={`${i}-${k}`} x={g.x} y={g.y} rot={g.rot} s={1.25} lit={0.9} />))}
          <Hand id="cn-h" x={hx + tremble(t, 3, 2)} y={hy + 160 + Math.abs(Math.sin(t * 6)) * 16} rot={-8} scale={1.15} style={YOU} pose={POSES.point} light={0.9} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S11: you decide you dozed off: mopping the floor, the shop quiet */
export const Mop: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.dozed;
  const sw = Math.sin(lt * 2.4);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.02} y={80} shake={3} seed={1411}>
        <Stage>
          <ShopDoors id="m" t={t} />
          <g transform={`translate(${540 + sw * 140},0)`}>
            <path d={`M${60},2000 L${-60 + sw * 30},1050`} stroke="#8a6a3a" strokeWidth={22} />
            <path d={`M${-200 + sw * 30},1080 L${80 + sw * 30},1080 L${60 + sw * 30},1140 L${-180 + sw * 30},1140 Z`} fill="#c8c4b8" />
            <Hand id="m-l" x={-10} y={1560} rot={-30} scale={1.0} style={YOU} pose={POSES.fist} mirror light={0.8} />
            <Hand id="m-r" x={40} y={1820} rot={-30} scale={1.0} style={YOU} pose={POSES.fist} light={0.8} />
          </g>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S12: the coffee smells like burning hair; your hand jerks back */
export const Coffee: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.five;
  const reach = prog(t, B.five + 0.1, B.coffee + 0.2, easeOut);
  const recoil = prog(t, B.coffee + 0.5, B.coffee + 0.8, easeIn);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.2 + lt * 0.03} y={-60} shake={3 + recoil * 6} seed={1412}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#22262c" />
          <rect x={-400} y={1060} width={1880} height={1000} fill="#3a3a40" />
          <CoffeeMachine x={540} y={1060} s={1.2} t={t} />
          <Hand id="cf-h" x={mix(800, 640, reach) + recoil * 200} y={mix(1700, 1000, reach) + recoil * 400} rot={-20} scale={1.2} style={YOU} pose={recoil > 0 ? lerpPose(POSES.reach, POSES.fist, recoil) : POSES.reach} light={0.9} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S13: through the window, a man at pump four. You can hear his heartbeat; the frame pulses with it */
export const Pump: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.pump;
  const beat = Math.max(0, Math.sin(lt * Math.PI * 2.2)) ** 6;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.4 + lt * 0.08 + beat * 0.015} x={290} y={-60} shake={3} seed={1413}>
        <Stage overflow>
          <Forecourt id="p" t={t} y={-100}>
            <Watcher id="p-w" t={t} x={870} y={860} s={0.28} bothArms noTorch rim="#e8f0f4" rimA={0.8} />
          </Forecourt>
          {/* the shop window frame */}
          <rect x={-400} y={-600} width={1880} height={200} fill="#22262c" />
          <rect x={-400} y={1300} width={1880} height={800} fill="#22262c" />
          <rect x={-400} y={-600} width={1880} height={2700} fill="#9fb4cf" opacity={0.05} />
        </Stage>
      </Camera>
      <AbsoluteFill style={{boxShadow: `inset 0 0 ${200 + beat * 160}px rgba(140,10,16,${0.25 + beat * 0.35})`}} />
    </AbsoluteFill>
  );
};

/* S14: the sky greys over the forecourt; the back of your hand on the counter starts to smoke */
export const DawnHand: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.dawn;
  const dawn = prog(t, B.dawn, B.ends, easeInOut);
  const smoke = prog(t, B.smoke - 0.2, B.smoke + 0.8);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.03} y={40} shake={3 + smoke * 3} seed={1414}>
        <Stage overflow>
          <Forecourt id="d" t={t} y={-150} dawn={dawn * 0.8} />
          <rect x={-400} y={1000} width={1880} height={1100} fill="#3a3a40" />
          <path d="M-400,1000 L1480,1000" stroke="#e8f0f4" strokeOpacity={0.3} strokeWidth={4} />
          <path d="M-400,1000 L1480,1000 L1480,1300 L-400,1300 Z" fill="#e8b890" opacity={0.15 * dawn} />
          <Hand id="d-h" x={560 + tremble(t, 5, smoke * 5)} y={1300} rot={-8} scale={1.4} style={YOU} pose={lerpPose(POSES.flat, POSES.claw, smoke * 0.6)} light={1} />
          <Smoke x={560} y={1140} t={t} a={smoke} w={180} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S15: the wall clock: five to six. Sunrise is six twelve */
export const ShiftClock: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.ends;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.6 + lt * 0.06} y={-100} shake={3} seed={1415}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#22262c" />
          <ellipse cx={540} cy={860} rx={500} ry={500} fill="#e8b890" opacity={0.08} />
          <Clock x={540} y={860} s={1.6} t={t} hour={5} minute={55 + Math.min(4, lt * 1.0)} lit={1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S16: his receipt in your hands: rice, cash, 02:47, and in red ink: Call me. — R. and a number */
export const ReceiptShot: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.receipt;
  const reveal = prog(t, B.number - 0.2, B.number + 0.5, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.15 + lt * 0.05} y={-40} shake={3} seed={1416}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#1a1e24" />
          <ellipse cx={540} cy={800} rx={520} ry={600} fill="#e8b890" opacity={0.08} />
          <Receipt x={540} y={820} s={1.1} rot={-3} note="Call me. — R." number="07700 900 413" reveal={reveal} />
          <Hand id="r-l" x={250} y={1320} rot={25} scale={1.1} style={YOU} pose={POSES.relaxed} mirror light={0.8} />
          <Hand id="r-r" x={830} y={1330} rot={-25} scale={1.1} style={YOU} pose={POSES.relaxed} light={0.8} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

