import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage} from '../../../../kit/common/fx';
import {Hand, HandStyle, POSES, STYLES, lerpPose, lerpStyle} from '../../../../kit/common/art/Hand';
import {Candle, Clock, Duvet, Mirror} from '../../../../kit/common/art/Props';
import {Floor, Grain, Wall, pileOf10, scatter} from '../../../../kit/common/art/Room';
import {KitchenTable} from '../../../../kit/common/art/Interior';
import {Tiles} from '../../../../kit/common/art/Kitchen';
import {Rose} from '../../../../kit/common/art/Cottage';
import {Phone} from '../../../../kit/common/art/Modern';
import {PedestalBasin} from '../../../../kit/common/art/Home';
import {CapedFigure, FolkloreVampire, HollywoodVampire, SoilCrate} from '../../../../kit/common/art/Vampires';
import {DoorWall} from '../../../../kit/portrait/sets/DoorWall';
import {WindowWall, WIN, SILL_Y} from '../../../../kit/portrait/sets/WindowWall';
import {easeIn, easeInOut, easeOut, mix, noise1, prog} from '../../../../kit/common/util';
import beats from '../beats.json';

/** Shot boundaries and sync points (global seconds), derived from timing.json by beats.py. */
export const B = beats.B;

/** You: a woman's hand, red nails, a plum cardigan sleeve. */
const YOU: HandStyle = {...STYLES.adult, skin: '#e0c0aa', shade: '#6a4a3a', nail: '#a8202c', nailLen: 4, thin: 0.92, sleeve: '#4a2030', cuff: '#5a2a3a'};
/** Him: grey, clawed, a black velvet sleeve with a white cuff. */
const HIM: HandStyle = {...STYLES.vamp, sleeve: '#0e0a12', cuff: '#d8d0c4'};

const tremble = (t: number, seed: number, amp = 3) => noise1(t * 9, seed) * amp;

/* S01 hook: the split frame. Hollywood in candlelight on the left, folklore in moonlight on the right */
export const Split: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <Camera t={t} zoom={1.0 + t * 0.02} shake={3} seed={1301}>
      <Stage>
        <rect x={0} y={0} width={540} height={1920} fill="#1a0a06" />
        <ellipse cx={270} cy={800} rx={420} ry={600} fill="#ffb45a" opacity={0.14} />
        <rect x={540} y={0} width={540} height={1920} fill="#06080e" />
        <ellipse cx={810} cy={800} rx={420} ry={600} fill="#6f86a6" opacity={0.14} />
        <HollywoodVampire x={300} y={900} s={0.7} t={t} />
        <FolkloreVampire x={810} y={880} s={0.6} t={t} />
        <rect x={536} y={0} width={8} height={1920} fill="#000" />
        <text x={270} y={330} textAnchor="middle" fontFamily="CountCaption, serif" fontWeight={600} fontSize={44} letterSpacing={8} fill="#e8c890" opacity={0.85}>HOLLYWOOD</text>
        <text x={810} y={330} textAnchor="middle" fontFamily="CountCaption, serif" fontWeight={600} fontSize={44} letterSpacing={8} fill="#b8c8dc" opacity={0.85}>FOLKLORE</text>
      </Stage>
    </Camera>
  </AbsoluteFill>
);

/* S02: Hollywood, close: the profile, the collar, the rose, in candlelight */
export const Hollywood: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.hollywood;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.2 + lt * 0.05} y={-60} shake={3} seed={1302}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#140604" />
          <ellipse cx={400} cy={700} rx={600} ry={700} fill="#ffb45a" opacity={0.16} />
          <Candle x={150} y={1300} t={t} s={0.8} />
          <HollywoodVampire x={600} y={900} s={1.2} t={t} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S03: whip to folklore: the swollen, ruddy corpse in its shroud. On "last Tuesday" he waves */
export const Folklore: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.folklore;
  const whip = prog(t, B.folklore, B.folklore + 0.3, easeOut);
  const wave = prog(t, B.tuesday - 0.1, B.tuesday + 0.3, easeOut);
  return (
    <AbsoluteFill style={{filter: whip < 0.98 ? `blur(${(1 - whip) * 22}px)` : undefined}}>
      <Camera t={t} zoom={1.1 + lt * 0.03} x={(1 - whip) * 600} y={-40} shake={3} seed={1303}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#05070c" />
          <ellipse cx={540} cy={760} rx={600} ry={700} fill="#6f86a6" opacity={0.16} />
          <FolkloreVampire x={520} y={860} s={1.1} t={t} wave={wave} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S04: "let's say you date one anyway": your hand takes his */
export const HoldHands: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.anyway;
  const k = prog(t, B.anyway + 0.1, B.anyway + 1.2, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.25 + lt * 0.04} shake={3} seed={1304}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#120604" />
          <ellipse cx={540} cy={900} rx={600} ry={500} fill="#ffb45a" opacity={0.12} />
          <Hand id="hh-him" x={mix(760, 620, k)} y={mix(600, 820, k)} rot={200} scale={1.35} style={HIM} pose={lerpPose(POSES.relaxed, POSES.reach, k)} light={0.9} />
          <Hand id="hh-you" x={mix(320, 470, k)} y={mix(1500, 1100, k)} rot={20} scale={1.3} style={YOU} pose={lerpPose(POSES.relaxed, POSES.reach, k)} light={1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S05 Day one: your front door open on the night; he waits on the step, not coming in */
export const Doorway: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.day1;
  const beyond = (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill="#0a1020" />
      <CapedFigure x={540} y={1500} s={0.95} t={t} rimA={0.6} />
    </g>
  );
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.03} y={-40} shake={3} seed={1305}>
        <Stage>
          <DoorWall id="dw" t={t} mode="candle" open={0.85} beyond={beyond} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S06: four a.m. in your kitchen: the clock, the fridge light, his shape */
export const Kitchen: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.expire;
  const reveal = prog(t, B.kitchen - 0.2, B.kitchen + 0.6, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1 + lt * 0.04} y={20} shake={3} seed={1306}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#05070b" />
          <Tiles id="kt" x={-400} y={200} w={1880} h={900} lit={0.3} />
          <rect x={-400} y={-600} width={1880} height={2700} fill="#000" opacity={0.5} />
          <Clock x={300} y={420} s={0.9} t={t} hour={4} minute={0} lit={0.8} />
          {/* the fridge, door open, its light spilling */}
          <rect x={600} y={500} width={360} height={1000} rx={20} fill="#1a1e26" />
          <rect x={620} y={520} width={320} height={960} fill="#dfe8f5" opacity={0.85 * reveal} />
          <path d="M600,500 L380,620 L380,1400 L600,1500 Z" fill="#2a2e36" opacity={reveal} />
          <ellipse cx={640} cy={1550} rx={500} ry={90} fill="#dfe8f5" opacity={0.12 * reveal} />
          <g opacity={reveal}>
            <CapedFigure x={780} y={1560} s={0.9} t={t} rim="#dfe8f5" rimA={0.9} />
          </g>
          <rect x={-400} y={1500} width={1880} height={600} fill="#0a0c10" />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** the selfie on your phone: your silhouette, and a rose floating where his face should be */
const Selfie: React.FC<{t: number; flash: number}> = ({t, flash}) => (
  <g>
    <rect x={14} y={14} width={392} height={832} fill="#2a1a24" />
    <rect x={14} y={14} width={392} height={832} fill="#ffb45a" opacity={0.12} />
    {/* you: head and shoulders, hair down */}
    <path d="M60,846 C60,700 110,640 170,620 L160,580 C120,560 110,500 118,460 C126,400 170,370 210,372 C260,374 296,410 296,466 C296,510 280,546 260,566 L254,620 C310,640 340,700 340,846 Z" fill="#14080e" />
    <path d="M118,460 C126,400 170,370 210,372 C260,374 296,410 296,466" stroke="#ffb45a" strokeOpacity={0.5} strokeWidth={3} fill="none" />
    <path d="M150,470 C160,520 240,520 260,470" stroke="#3a1a24" strokeWidth={2} fill="none" />
    {/* a rose in mid-air beside you, held by nobody */}
    <g transform={`translate(330,${470 + Math.sin(t * 2) * 4})`}>
      <path d="M0,0 C4,60 -4,120 2,180" stroke="#1e3a1a" strokeWidth={6} fill="none" />
      <circle r={26} fill="#7a0a12" />
      <path d="M-14,-6 C-6,-20 10,-18 14,-4 C6,-10 -6,-10 -14,-6 Z" fill="#c4161c" />
    </g>
    <text x={210} y={70} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={20} fill="#e6e8ee" opacity={0.8}>us ♥</text>
    <rect x={14} y={14} width={392} height={832} fill="#fff" opacity={flash} />
  </g>
);

/* S07 Day two: a couple photo on your phone. Just you, and a floating rose */
export const Photo: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.day2;
  const raise = prog(t, B.day2, B.day2 + 0.35, easeOut);
  const flash = Math.max(0, 1 - Math.abs(t - (B.day2 + 0.6)) / 0.15);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.03} y={-60} shake={3} seed={1307}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#0c0608" />
          <Phone id="ph" t={t} x={330} y={mix(1300, 380, raise)} s={1} rot={-3} from="" clock="" msgs={[]} skin={YOU.skin} shade={YOU.shade} nail={YOU.nail} sleeve={YOU.sleeve} screen={<Selfie t={t} flash={flash} />} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S08 Day three: candlelit dinner. Your plate, his empty one, his eyes across the table; they drop to your neck */
export const Dinner: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.day3;
  const drop = prog(t, B.neck - 0.1, B.neck + 0.4, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.15 + lt * 0.04} y={-40} shake={3} seed={1308}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#0a0503" />
          <ellipse cx={540} cy={900} rx={520} ry={420} fill="#ffb45a" opacity={0.12} />
          {/* his shape across the table and two eyes catching the candle */}
          <path d="M260,1000 C270,820 360,740 430,724 L420,660 C390,640 384,580 392,550 C400,500 450,480 520,482 C590,484 640,510 646,560 C650,600 640,640 610,660 L600,724 C690,740 790,820 800,1000 Z" fill="#050306" />
          <g transform={`translate(0,${drop * 24})`}>
            <ellipse cx={490} cy={580} rx={10} ry={5} fill="#c4161c" />
            <ellipse cx={560} cy={580} rx={10} ry={5} fill="#c4161c" />
          </g>
          <KitchenTable y={980}>
            {/* his plate, untouched; your plate, half-eaten; the candle between you, off to one side */}
            <ellipse cx={500} cy={1010} rx={150} ry={34} fill="#d8d0c4" />
            <ellipse cx={500} cy={1010} rx={100} ry={22} fill="#c8c0b4" />
            <Candle x={760} y={1160} t={t} s={0.6} glow={0.9} />
            <ellipse cx={540} cy={1460} rx={260} ry={60} fill="#d8d0c4" />
            <ellipse cx={540} cy={1460} rx={180} ry={40} fill="#8a3a2a" />
            <Hand id="dn-you" x={820} y={1520} rot={-40} scale={1.0} style={YOU} pose={POSES.relaxed} light={1} />
          </KitchenTable>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

const RICE = scatter(160, 120, 1250, 840, 520, 77);

/* S09 Day four: the bag drops; rice bounces across the floor */
export const RiceDrop: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.day4;
  const spill = prog(t, B.drop + 0.2, B.drop + 1.0, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1 + lt * 0.04} y={160} shake={3} seed={1309}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#0a0806" />
          <Floor id="rd" x={-400} y={900} w={1880} h={1200} lit={0.7} />
          <ellipse cx={540} cy={1300} rx={600} ry={300} fill="#ffb45a" opacity={0.08} />
          {/* the bag, falling then split */}
          <g transform={`translate(540,${mix(500, 1180, prog(t, B.drop - 0.1, B.drop + 0.2, easeIn))}) rotate(${spill * 70})`}>
            <path d="M-80,-120 L80,-120 L100,100 L-100,100 Z" fill="#d8ccb0" />
            <text x={0} y={10} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontWeight={700} fontSize={34} fill="#5a3a2a">RICE</text>
          </g>
          {RICE.slice(0, Math.floor(RICE.length * spill)).map((g, i) => (
            <Grain key={i} x={mix(540, g.x, spill)} y={mix(1180, g.y, spill) - Math.abs(Math.sin((t + i) * 9)) * 20 * (1 - spill)} rot={g.rot} s={1.2} lit={0.8} />
          ))}
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S10: his clawed hands count the rice into piles of ten; at nine thousand he loses his place and sweeps them together */
export const Counting: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.count;
  const sweep = prog(t, B.lost + 0.2, B.lost + 0.7, easeIn);
  const piles = Array.from({length: 12}, (_, i) => pileOf10(220 + (i % 4) * 210, 1120 + Math.floor(i / 4) * 170, 300 + i));
  const shown = Math.min(piles.length, 2 + Math.floor(lt * 2.6));
  const handX = 220 + ((shown - 1) % 4) * 210;
  const handY = 1120 + Math.floor((shown - 1) / 4) * 170;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.2 + lt * 0.03} y={180} shake={3} seed={1310}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#0a0806" />
          <Floor id="ct" x={-400} y={800} w={1880} h={1300} lit={0.7} />
          <ellipse cx={540} cy={1300} rx={600} ry={400} fill="#ffb45a" opacity={0.08} />
          <Candle x={950} y={960} t={t} s={0.5} glow={0.7} />
          {piles.slice(0, shown).map((p, i) =>
            p.map((g, k) => <Grain key={`${i}-${k}`} x={mix(g.x, 540, sweep)} y={mix(g.y, 1300, sweep)} rot={g.rot} s={1.2} lit={0.85} />),
          )}
          {RICE.slice(0, 90).map((g, i) => (
            <Grain key={`r${i}`} x={g.x} y={g.y + 200} rot={g.rot} s={1.2} lit={0.6} />
          ))}
          <Hand id="ct-h" x={sweep > 0 ? mix(handX, 300, sweep) : handX + tremble(t, 3, 2)} y={sweep > 0 ? 1150 : handY - 120 + Math.abs(Math.sin(t * 6)) * 20} rot={sweep > 0 ? 80 : 170} scale={1.1} style={HIM} pose={sweep > 0 ? POSES.flat : POSES.point} light={0.9} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S11 Day five: your bed, and a crate of grave soil beside it */
export const Soil: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.day5;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.03} y={60} shake={3} seed={1311}>
        <Stage>
          <Wall id="sl" x={-400} y={-600} w={1880} h={2000} lit={0.45} />
          <rect x={-400} y={-600} width={1880} height={2700} fill="#000" opacity={0.35} />
          <Duvet y={1400} t={t} grip={0} />
          <SoilCrate x={760} y={1250} s={1.2} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S12 Day six: a sunny morning through the window (the book: he'd go out at noon) */
export const Sunny: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.day6;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.03} y={-40} shake={3} seed={1312}>
        <Stage>
          <WindowWall id="sn" t={t} mode="dawn" dawn={1} cloudCover={0.1} beam={2.2} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S13: the curtains taped shut with black tape; a lump under the duvet */
export const Taped: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.film;
  const tape = prog(t, B.taped - 0.2, B.taped + 0.5, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.03} y={-40} shake={3} seed={1313}>
        <Stage>
          <WindowWall id="tp" t={t} mode="night" cloudCover={0.9} beam={0} />
          {/* curtains drawn across the window */}
          <rect x={WIN.cx - WIN.w / 2 - 80} y={-500} width={WIN.w / 2 + 80} height={SILL_Y + 560} fill="#3a0a10" />
          <rect x={WIN.cx} y={-500} width={WIN.w / 2 + 80} height={SILL_Y + 560} fill="#300810" />
          {Array.from({length: 8}, (_, i) => (
            <path key={i} d={`M${WIN.cx - WIN.w / 2 - 60 + i * 90},-500 L${WIN.cx - WIN.w / 2 - 60 + i * 90},${SILL_Y + 60}`} stroke="#1a0408" strokeWidth={14} opacity={0.6} />
          ))}
          {/* black tape: down the middle seam and round the edges */}
          <g opacity={tape}>
            {[[WIN.cx - 18, -500, 36, SILL_Y + 560], [WIN.cx - WIN.w / 2 - 90, -500, 36, SILL_Y + 560], [WIN.cx + WIN.w / 2 + 54, -500, 36, SILL_Y + 560], [WIN.cx - WIN.w / 2 - 90, SILL_Y + 20, WIN.w + 180, 36]].map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} fill="#6a6a72" />
            ))}
            <path d={`M${WIN.cx - 18},300 L${WIN.cx + 18},300`} stroke="#3a3a40" strokeWidth={2} />
          </g>
          <rect x={-400} y={SILL_Y + 60} width={1880} height={1200} fill="#05060a" />
          <Duvet y={1500} t={t} grip={0} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S14 Day seven: your hand in the candlelight, paler than it was */
export const Pale: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.day7;
  const pale = prog(t, B.day7, B.marks, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.25 + lt * 0.04} y={60} shake={3} seed={1314}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#0a0503" />
          <ellipse cx={540} cy={900} rx={520} ry={520} fill="#ffb45a" opacity={0.12} />
          <Candle x={300} y={1100} t={t} s={0.7} />
          <Hand id="pl-you" x={620} y={1150} rot={-10} scale={1.4} style={lerpStyle(YOU, {...YOU, skin: '#d0ccc8', shade: '#6a6a70'}, pale)} pose={POSES.relaxed} light={1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S15: two small marks: a slow push onto the side of your pale neck */
export const Marks: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.marks;
  const push = prog(t, B.marks, B.mirror, easeInOut);
  const pulse = 0.85 + Math.sin(t * 3) * 0.15;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.0, 1.9, push)} x={mix(0, 70, push)} y={mix(-430, 120, push)} shake={2} seed={1315}>
        <Stage overflow>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#0a0503" />
          <defs>
            <linearGradient id="nk-skin" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#7a6a64" />
              <stop offset="0.45" stopColor="#e2d4ca" />
              <stop offset="1" stopColor="#a8968c" />
            </linearGradient>
          </defs>
          {/* jaw and ear at the top, the neck running down to the collarbone */}
          <path d="M120,-200 C200,180 260,520 300,820 C330,1080 300,1360 220,1620 L1000,1620 C960,1380 900,1100 880,860 C860,620 900,360 980,160 L980,-200 Z" fill="url(#nk-skin)" />
          {/* the cheek and the side of the face above the jaw */}
          <path d="M60,-900 L1000,-900 L980,160 C520,300 260,140 120,-200 Z" fill="#d8c8be" />
          <path d="M60,-900 L120,-200" stroke="#7a6a64" strokeOpacity={0.5} strokeWidth={10} />
          {/* shadow under the jaw */}
          <path d="M150,-130 C280,190 520,330 980,190 L980,330 C560,450 320,360 200,120 Z" fill="#5a4a44" opacity={0.35} style={{filter: 'blur(12px)'}} />
          <path d="M120,-200 C260,140 520,300 980,160" stroke="#6a6460" strokeOpacity={0.6} strokeWidth={6} fill="none" />
          <ellipse cx={820} cy={60} rx={70} ry={110} fill="#d0beb4" />
          <path d="M770,0 C800,-40 870,-30 880,40 C890,110 840,170 800,160" stroke="#8a827c" strokeWidth={6} fill="none" />
          {/* a tendon and the shadow under the jaw */}
          <path d="M420,320 C480,640 560,980 620,1360" stroke="#9a948e" strokeWidth={20} opacity={0.35} fill="none" />
          <path d="M300,820 C330,1080 300,1360 220,1620" stroke="#ffb45a" strokeOpacity={0.35} strokeWidth={4} fill="none" />
          {/* dark hair falling behind the ear */}
          <path d="M980,-900 L980,-200 C940,200 900,500 940,900 L1300,900 L1300,-900 Z" fill="#1a0e0a" />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${960 - i * 12},-180 C${920 - i * 10},200 ${890 - i * 8},520 ${930 - i * 6},880`} stroke="#3a2418" strokeWidth={4} fill="none" />
          ))}
          {/* the cardigan collar */}
          <path d="M180,1500 C400,1440 760,1440 1020,1520 L1100,2100 L100,2100 Z" fill="#4a2030" />
          <path d="M180,1500 C400,1440 760,1440 1020,1520" stroke="#ffb45a" strokeOpacity={0.3} strokeWidth={4} fill="none" />
          {/* the two marks, a faint flush round each */}
          {[[560, 800], [610, 790]].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={20} fill="#c06060" opacity={0.25 * pulse} />
              <circle cx={cx} cy={cy} r={7} fill="#7a0a10" />
              <circle cx={cx - 2} cy={cy - 2} r={2} fill="#e8a0a0" opacity={0.6} />
            </g>
          ))}
          <ellipse cx={300} cy={600} rx={500} ry={700} fill="#ffb45a" opacity={0.06} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S16: the bathroom mirror. In front of it, your hand holds his rose. In the glass: the room, and the rose, floating */
export const MirrorRose: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.mirror;
  const push = prog(t, B.mirror, B.cut, (x) => x);
  const lift = prog(t, B.mirror + 0.2, B.mirror + 1.0, easeOut);
  const roseY = mix(1700, 1250, lift);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.08 + push * 0.22} y={mix(80, 20, push)} shake={3} seed={1316}>
        <Stage>
          <rect x={-400} y={-600} width={1880} height={2700} fill="#07090d" />
          <Tiles id="mr-t" x={-400} y={-600} w={1880} h={2700} lit={0.5} />
          <rect x={-400} y={-600} width={1880} height={2700} fill="#000" opacity={0.35} />
          <ellipse cx={900} cy={1000} rx={520} ry={620} fill="#ff9a3c" opacity={0.07} />
          <Mirror id="mr-m" x={290} y={240} w={500} h={680} lit={0.8}>
            <rect x={0} y={0} width={500} height={680} fill="#0b0d12" />
            <Tiles id="mr-rt" x={-60} y={-40} w={620} h={760} lit={0.35} />
            <rect x={0} y={0} width={500} height={680} fill="#000" opacity={0.3} />
            <path d="M150,620 L150,250 C150,190 250,170 250,170 C250,170 350,190 350,250 L350,620 Z" fill="#020305" stroke="#1a1d24" strokeWidth={12} />
            {/* the rose's reflection, held by nothing */}
            <g transform={`translate(${250 + noise1(t, 3) * 4},${mix(760, 470, lift)}) scale(1.6)`}>
              <path d="M0,0 C4,60 -4,120 2,180" stroke="#1e3a1a" strokeWidth={5} fill="none" />
              <Rose x={0} y={0} s={0.9} light="dusk" />
            </g>
          </Mirror>
          <PedestalBasin x={540} y={1180} lit={0.8} />
          <Candle x={940} y={980} t={t} s={0.6} glow={0.8} />
          {/* your hand in front of the glass, holding the rose */}
          <g transform={`translate(760,${roseY - 120})`}>
            <path d="M0,0 C4,80 -4,160 2,240" stroke="#1e3a1a" strokeWidth={8} fill="none" />
            <Rose x={0} y={0} s={1.3} light="dusk" />
          </g>
          <Hand id="mr-you" x={760} y={roseY + 120} rot={0} scale={1.3} style={{...YOU, skin: '#d0ccc8', shade: '#6a6a70'}} pose={POSES.fist} light={1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};
