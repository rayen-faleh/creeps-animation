import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage} from '../../../../kit/common/fx';
import {Hand, HandStyle, POSES, STYLES, lerpPose} from '../../../../kit/common/art/Hand';
import {Candle} from '../../../../kit/common/art/Props';
import {KitchenTable} from '../../../../kit/common/art/Interior';
import {Phone} from '../../../../kit/common/art/Modern';
import {MoorStreet} from '../../../../kit/common/art/Street';
import {DoorWall} from '../../../../kit/portrait/sets/DoorWall';
import {easeInOut, easeOut, mix, noise1, prog} from '../../../../kit/common/util';
import beats from '../beats.json';

/** Shot boundaries and sync points (global seconds), derived from timing.json by beats.py. */
export const B = beats.B;

/** Your friend: a little too pale, otherwise ordinary. A dark green jumper sleeve. */
const FRIEND: HandStyle = {...STYLES.adult, skin: '#d8d2d0', shade: '#7a7276', nail: '#d0c8cc', sleeve: '#1e2a22', cuff: '#26342a'};
/** You: an ordinary hand, a mustard jumper sleeve. */
const YOU: HandStyle = {...STYLES.adult, sleeve: '#8a6a24', cuff: '#9a7a2c'};

const WARM = '#ffb45a';

/** A friend in a pub photo: head and shoulders, smiling, hair styles vary. Origin at the chin. */
const Pal: React.FC<{x: number; y: number; s?: number; hair: 'short' | 'long' | 'curly'; skin: string; top: string}> = ({x, y, s = 1, hair, skin, top}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-110,200 C-100,110 -60,80 -30,74 L-26,40 L26,40 L30,74 C60,80 100,110 110,200 Z" fill={top} />
    <ellipse cx={0} cy={-20} rx={50} ry={62} fill={skin} />
    {hair === 'long' && <path d="M-56,-30 C-60,-90 -20,-100 0,-100 C30,-100 60,-80 56,-30 L60,70 L40,60 L40,-40 C20,-60 -20,-60 -40,-40 L-40,60 L-60,70 Z" fill="#3a2414" />}
    {hair === 'short' && <path d="M-50,-30 C-52,-80 -20,-92 0,-92 C30,-92 54,-76 50,-30 C40,-56 -40,-56 -50,-30 Z" fill="#1a1410" />}
    {hair === 'curly' && Array.from({length: 9}, (_, i) => <circle key={i} cx={-44 + i * 11} cy={-70 - Math.abs(i - 4) * -2} r={18} fill="#2a1a10" />)}
    <path d="M-18,0 C-8,12 8,12 18,0" stroke="#3a1a14" strokeWidth={4} fill="none" />
    <circle cx={-18} cy={-26} r={4} fill="#1a1010" />
    <circle cx={18} cy={-26} r={4} fill="#1a1010" />
  </g>
);

/** The group selfie on screen: three friends in a warm pub, squeezed to one side, and nobody holding the camera. */
const Selfie: React.FC<{flash?: number}> = ({flash = 0}) => (
  <g>
    <rect x={14} y={14} width={392} height={832} fill="#3a1e10" />
    <ellipse cx={210} cy={300} rx={260} ry={300} fill={WARM} opacity={0.25} />
    <rect x={14} y={14} width={392} height={160} fill="#1a0e08" />
    {[60, 150, 240, 330].map((lx) => (
      <circle key={lx} cx={lx} cy={90} r={14} fill={WARM} opacity={0.8} />
    ))}
    <Pal x={110} y={520} s={0.8} hair="long" skin="#e0b89a" top="#6a2a3a" />
    <Pal x={210} y={500} s={0.85} hair="curly" skin="#8a5a3a" top="#2a4a6a" />
    <Pal x={300} y={530} s={0.78} hair="short" skin="#d8a888" top="#8a6a24" />
    <text x={210} y={70} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={20} fill="#fff" opacity={0.7}>●  REC</text>
    <rect x={14} y={14} width={392} height={832} fill="#fff" opacity={flash} />
  </g>
);

/* S0 hook: a group selfie: three friends, and a pale hand holding the phone that isn't in the picture */
export const Hook: React.FC<{t: number}> = ({t}) => {
  const flash = Math.max(0, 1 - Math.abs(t - 2.2) / 0.12);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + t * 0.04} y={-60} shake={3} seed={1501}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#1a0c06" />
          <ellipse cx={540} cy={700} rx={700} ry={700} fill={WARM} opacity={0.1} />
          <Phone id="hk-ph" t={t} x={330} y={360} s={1} rot={3} from="" clock="" msgs={[]} skin={FRIEND.skin} shade={FRIEND.shade} nail={FRIEND.nail} sleeve={FRIEND.sleeve} screen={<Selfie flash={flash} />} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S1: "they always offer to take the group photo": their pale hand takes your phone */
export const TakePhoto: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.s1;
  const take = prog(t, B.s1b, B.s1b + 0.8, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.2 + lt * 0.04} shake={3} seed={1502}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#1a0c06" />
          <ellipse cx={540} cy={800} rx={600} ry={600} fill={WARM} opacity={0.12} />
          <g transform={`translate(${mix(0, 220, take)},${mix(0, -260, take)}) rotate(${mix(-12, 6, take)},540,1000)`}>
            <rect x={440} y={800} width={200} height={400} rx={28} fill="#0b0c0f" stroke="#3a3d45" strokeWidth={3} />
            <rect x={452} y={812} width={176} height={376} rx={20} fill="#2a1a10" />
          </g>
          <Hand id="tp-you" x={mix(420, 360, take)} y={mix(1300, 1500, take)} rot={20} scale={1.2} style={YOU} pose={lerpPose(POSES.fist, POSES.relaxed, take)} light={0.9} />
          <Hand id="tp-fr" x={mix(1100, 820, take)} y={mix(900, 850, take)} rot={-110 + take * 40} scale={1.2} style={FRIEND} pose={lerpPose(POSES.reach, POSES.fist, take)} light={0.9} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** your friend, standing: jeans, a jumper, hands in pockets, a polite smile. Feet at the origin, ~1000 tall. */
const FriendFigure: React.FC<{x: number; y: number; s?: number; t: number; rim?: string}> = ({x, y, s = 1, t, rim = WARM}) => {
  const sway = Math.sin(t * 1.2) * 3;
  return (
    <g transform={`translate(${x + sway},${y}) scale(${s})`}>
      <path d="M-70,0 L-60,-440 L60,-440 L70,0 L20,0 L0,-360 L-20,0 Z" fill="#141a26" />
      <path d="M-150,-420 C-150,-640 -110,-720 -40,-740 L40,-740 C110,-720 150,-640 150,-420 Z" fill="#1e2a22" />
      <path d="M-30,-740 L-24,-790 L24,-790 L30,-740 Z" fill="#d8d2d0" />
      <ellipse cx={0} cy={-860} rx={64} ry={80} fill="#d8d2d0" />
      <path d="M-64,-880 C-66,-940 -20,-956 0,-956 C30,-956 66,-936 64,-880 C50,-910 -50,-910 -64,-880 Z" fill="#1a1410" />
      <path d="M-22,-830 C-8,-818 8,-818 22,-830" stroke="#3a1a14" strokeWidth={4} fill="none" />
      <circle cx={-22} cy={-866} r={5} fill="#1a1010" />
      <circle cx={22} cy={-866} r={5} fill="#1a1010" />
      <path d="M-150,-420 C-150,-640 -110,-720 -40,-740" stroke={rim} strokeOpacity={0.5} strokeWidth={4} fill="none" />
      <path d="M64,-880 C66,-820 40,-790 0,-780" stroke={rim} strokeOpacity={0.4} strokeWidth={3} fill="none" />
    </g>
  );
};

/* S2: at your door, they wait to be invited in. Every single time */
export const Door: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.s2;
  const beyond = (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill="#0a1020" />
      <FriendFigure x={690} y={1500} s={0.85} t={t} rim="#9fb4cf" />
    </g>
  );
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.03} y={-40} shake={3} seed={1503}>
        <Stage>
          <DoorWall id="dr" t={t} mode="candle" open={0.95} beyond={beyond} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S3: the garlic bread arrives; their chair is empty and still turning */
export const Garlic: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.s3;
  const gone = t >= B.loo - 0.1;
  const spin = gone ? Math.sin((t - B.loo) * 6) * Math.exp(-(t - B.loo) * 1.5) * 20 : 0;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1 + lt * 0.04} y={-20} shake={3} seed={1504}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#140804" />
          <ellipse cx={540} cy={900} rx={600} ry={500} fill={WARM} opacity={0.12} />
          {/* their chair across the table */}
          <g transform={`translate(540,700) rotate(${spin})`}>
            <rect x={-130} y={-260} width={260} height={300} rx={20} fill="#3a1e10" />
            <rect x={-140} y={40} width={280} height={40} rx={10} fill="#2a1408" />
          </g>
          {!gone && <FriendFigure x={540} y={1300} s={0.7} t={t} />}
          <KitchenTable y={980}>
            <Candle x={820} y={1120} t={t} s={0.6} />
            {/* the basket of garlic bread */}
            <g transform="translate(480,1130)">
              <ellipse cx={0} cy={40} rx={220} ry={60} fill="#5a3a1a" />
              {[-120, -40, 40, 120].map((bx, i) => (
                <g key={i} transform={`translate(${bx},${-10 + (i % 2) * 10}) rotate(${(i - 1.5) * 12})`}>
                  <ellipse cx={0} cy={0} rx={60} ry={34} fill="#d8a858" />
                  <ellipse cx={0} cy={-6} rx={46} ry={22} fill="#f0d898" />
                  {[-20, 0, 20].map((g) => <circle key={g} cx={g} cy={-8} r={4} fill="#5a8a3a" />)}
                </g>
              ))}
            </g>
          </KitchenTable>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S4: their pale fingers line up sugar sachets in rows, then count them again */
export const Sugar: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.s4;
  const n = Math.min(20, Math.floor(lt * 5));
  const again = t >= B.twice;
  const k = again ? Math.min(19, Math.floor((t - B.twice) * 10)) : n - 1;
  const sx = (i: number) => 220 + (i % 5) * 160;
  const sy = (i: number) => 900 + Math.floor(i / 5) * 140;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.2 + lt * 0.03} y={120} shake={3} seed={1505}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#140804" />
          <KitchenTable y={700}>
            {Array.from({length: Math.max(0, n)}, (_, i) => (
              <g key={i} transform={`translate(${sx(i)},${sy(i)})`}>
                <rect x={-50} y={-30} width={100} height={60} rx={6} fill={i === k && again ? '#ffe8a8' : '#ece4d4'} />
                <text x={0} y={8} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontWeight={700} fontSize={20} fill="#8a3a2a">SUGAR</text>
              </g>
            ))}
          </KitchenTable>
          <Hand id="sg-h" x={sx(Math.max(0, k)) + 10} y={sy(Math.max(0, k)) + 180 + Math.abs(Math.sin(t * 8)) * 12} rot={-6} scale={1.1} style={FRIEND} pose={POSES.point} light={0.9} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S5: your hand in theirs; frost creeps out from their fingertips */
export const ColdHands: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.s5;
  const frost = prog(t, B.s5b, B.s6 - 0.2, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.25 + lt * 0.04} shake={3} seed={1506}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#0e0a0a" />
          <ellipse cx={540} cy={900} rx={600} ry={500} fill={WARM} opacity={0.1} />
          <Hand id="ch-fr" x={620} y={820} rot={200} scale={1.35} style={FRIEND} pose={POSES.reach} light={0.9} />
          <Hand id="ch-you" x={470} y={1100} rot={20} scale={1.3} style={YOU} pose={POSES.reach} light={1} />
          {/* frost: fine white branches spreading over your fingers */}
          <g opacity={frost} stroke="#e8f4ff" strokeWidth={2} fill="none">
            {Array.from({length: 14}, (_, i) => {
              const a = (i / 14) * Math.PI * 2;
              const r = 40 + frost * 150;
              const cx = 540 + noise1(i, 3) * 20, cy = 940 + noise1(i, 7) * 20;
              return <path key={i} d={`M${cx},${cy} l${Math.cos(a) * r * 0.5},${Math.sin(a) * r * 0.5} l${Math.cos(a + 0.4) * r * 0.3},${Math.sin(a + 0.4) * r * 0.3} M${cx + Math.cos(a) * r * 0.5},${cy + Math.sin(a) * r * 0.5} l${Math.cos(a - 0.5) * r * 0.25},${Math.sin(a - 0.5) * r * 0.25}`} />;
            })}
          </g>
          <ellipse cx={540} cy={940} rx={60 + frost * 160} ry={50 + frost * 120} fill="#cfe4ff" opacity={0.12 * frost} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S6: their street at night: you've never been inside. Every window dark */
export const TheirPlace: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.s6;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.2 + lt * 0.06} y={30} shake={3} seed={1507}>
        <Stage>
          <MoorStreet id="tp" t={t} light="night" moon={[800, 520]} moonR={50} windowsLit={0} lamp={0.3} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** this video, as a link preview in a message: the selfie thumbnail and the title */
const Thread: React.FC<{t: number}> = ({t}) => {
  const typing = t >= B.s7b + 1.0;
  return (
    <g>
      <rect x={14} y={14} width={392} height={832} fill="#111216" />
      <rect x={14} y={70} width={392} height={84} fill="#17181d" />
      <circle cx={210} cy={104} r={22} fill="#4a5a4e" />
      <text x={210} y={146} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={18} fill="#a6a9b2">Jules</text>
      {/* the link card */}
      <g transform="translate(28,190)">
        <rect width={300} height={330} rx={20} fill="#2b2d33" />
        <g transform="scale(0.72) translate(0,0)">
          <rect x={0} y={0} width={416} height={300} rx={20} fill="#3a1e10" />
          <ellipse cx={208} cy={150} rx={220} ry={160} fill={WARM} opacity={0.25} />
          <Pal x={110} y={210} s={0.7} hair="long" skin="#e0b89a" top="#6a2a3a" />
          <Pal x={210} y={200} s={0.75} hair="curly" skin="#8a5a3a" top="#2a4a6a" />
          <Pal x={300} y={215} s={0.68} hair="short" skin="#d8a888" top="#8a6a24" />
        </g>
        <text x={18} y={262} fontFamily="Helvetica, Arial, sans-serif" fontSize={20} fontWeight={700} fill="#eceef2">7 signs your friend</text>
        <text x={18} y={290} fontFamily="Helvetica, Arial, sans-serif" fontSize={20} fontWeight={700} fill="#eceef2">is a vampire</text>
      </g>
      <g transform="translate(28,540)">
        <rect width={200} height={56} rx={24} fill="#2b2d33" />
        <text x={20} y={37} fontFamily="Helvetica, Arial, sans-serif" fontSize={26} fill="#eceef2">thought of you x</text>
      </g>
      {typing && (
        <g transform="translate(28,616)">
          <rect width={96} height={52} rx={26} fill="#2b2d33" />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={28 + k * 20} cy={26} r={6} fill="#9a9ca3" opacity={0.4 + 0.6 * Math.max(0, Math.sin(t * 9 - k))} />
          ))}
        </g>
      )}
    </g>
  );
};

/* S7: your phone: a message from them with this video in it. Then: typing */
export const SentYou: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.s7;
  const raise = prog(t, B.s7, B.s7 + 0.4, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.08} y={-60} shake={3} seed={1508}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#0a0806" />
          <Phone id="sy-ph" t={t} x={330} y={mix(1300, 380, raise)} s={1} rot={-2} from="" clock="" msgs={[]} buzz={[B.s7 + 0.5]} skin={YOU.skin} shade={YOU.shade} nail={YOU.nail} sleeve={YOU.sleeve} screen={<Thread t={t} />} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};
