import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage} from '../../../../kit/common/fx';
import {Hand, HandStyle, POSES, STYLES, armPoint, lerpPose, lerpStyle} from '../../../../kit/common/art/Hand';
import {Phone} from '../../../../kit/common/art/Modern';
import {FitnessWatch, WatchText} from '../../../../kit/common/art/Home';
import {BlackEnvelope, Boots, CallingCard, CouncilTable, Eyes, OldTelly, VoteStone, WineGlass, tablePt} from '../../../../kit/common/art/Council';
import {easeIn, easeInOut, easeOut, mix, noise1, prog, track} from '../../../../kit/common/util';
import beats from '../beats.json';

/** Shot boundaries and sync points (global seconds), derived from timing.json by beats.py. */
export const B = beats.B;

const WARM = '#ffb45a';
const ME: HandStyle = {...STYLES.adult, sleeve: '#16181e', cuff: '#22252c'};
const ME_DEAD: HandStyle = {...lerpStyle(STYLES.adult, STYLES.vamp, 0.6), sleeve: '#16181e', cuff: '#22252c'};
const ME_ARM: HandStyle = {...ME, forearm: 300};
const ME_DEAD_ARM: HandStyle = {...ME_DEAD, forearm: 300};
const HER: HandStyle = {...STYLES.vamp, sleeve: '#050507', cuff: '#2a2630', nailLen: 6, nail: '#3a0a12'};
const ELDER: HandStyle = {...lerpStyle(STYLES.gran, STYLES.vamp, 0.7), sleeve: '#0a0809', cuff: '#16121a', nailLen: 12};
const KID: HandStyle = {...STYLES.child, sleeve: '#3a2a4a', cuff: '#4a3a5a'};

const bg = (fill: string) => <rect x={-600} y={-800} width={2280} height={3200} fill={fill} />;

/** A lace edge drawn over a black cuff (scallops), placed along a wrist. */
const Lace: React.FC<{x: number; y: number; rot: number; s?: number}> = ({x, y, rot, s = 1}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    {Array.from({length: 7}, (_, i) => (
      <circle key={i} cx={-66 + i * 22} cy={0} r={13} fill="none" stroke="#3a3440" strokeWidth={4} />
    ))}
  </g>
);

/** Her: a stylised screen vampire (the telly, the profiles): black hair, pale face, red lips, high collar. */
const Siren: React.FC<{x: number; y: number; s?: number; shades?: boolean; lace?: boolean; t?: number}> = ({x, y, s = 1, shades = false, lace = false, t = 0}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-150,60 C-170,-120 -120,-230 0,-232 C120,-230 170,-120 150,60 L150,260 L-150,260 Z" fill="#0a0a0e" />
    <path d="M-210,330 C-200,180 -120,130 -40,120 L40,120 C120,130 200,180 210,330 Z" fill="#14060c" />
    <path d="M-90,130 L-160,10 L-40,110 Z M90,130 L160,10 L40,110 Z" fill="#2a0c16" />
    {lace && Array.from({length: 9}, (_, i) => <circle key={i} cx={-80 + i * 20} cy={128} r={11} fill="none" stroke="#3a3440" strokeWidth={4} />)}
    <rect x={-26} y={60} width={52} height={70} fill="#d8dce6" />
    <ellipse cx={0} cy={-30} rx={92} ry={118} fill="#e4e6ee" />
    <path d="M-92,-40 C-90,-150 -40,-160 0,-162 C40,-160 90,-150 92,-40 C70,-110 -70,-110 -92,-40 Z" fill="#0a0a0e" />
    {shades ? (
      <path d="M-74,-44 L-8,-44 L-14,-6 L-66,-6 Z M8,-44 L74,-44 L66,-6 L14,-6 Z M-8,-38 L8,-38" fill="#050506" stroke="#050506" strokeWidth={6} />
    ) : (
      <g>
        <path d="M-62,-28 C-50,-44 -22,-44 -12,-28 C-24,-18 -50,-18 -62,-28 Z" fill="#1a1016" />
        <path d="M62,-28 C50,-44 22,-44 12,-28 C24,-18 50,-18 62,-28 Z" fill="#1a1016" />
        <circle cx={-36} cy={-30} r={5} fill="#c4161c" opacity={0.3 + 0.2 * Math.sin(t * 2)} />
        <circle cx={36} cy={-30} r={5} fill="#c4161c" opacity={0.3 + 0.2 * Math.sin(t * 2)} />
      </g>
    )}
    <path d="M-26,40 C-12,32 12,32 26,40 C12,54 -12,54 -26,40 Z" fill="#9a0c1c" />
    <path d="M-92,-30 C-92,40 -50,86 0,88" stroke="#9fb4cf" strokeOpacity={0.3} strokeWidth={4} fill="none" />
  </g>
);

/* S01 hook: the council table, six pairs of eyes, my pale hands flat on the near end */
export const Hook: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    <Camera t={t} zoom={track(t, [[0, 1.0], [B.hollywood, 1.12]])} y={track(t, [[0, 60], [B.hollywood, 20]])} shake={3} seed={1701}>
      <Stage overflow>
        <CouncilTable t={t}>
          <Hand id="hk-l" x={330} y={1980} rot={8} scale={1.05} style={ME_DEAD} pose={POSES.flat} light={0.8} />
          <Hand id="hk-r" x={750} y={1980} rot={-8} scale={1.05} style={ME_DEAD} pose={POSES.flat} light={0.8} mirror />
        </CouncilTable>
      </Stage>
    </Camera>
  </AbsoluteFill>
);

/* S02: Hollywood started it: a warm living room, the old telly, a screen vampire; a kid's hand on the remote */
export const Telly: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.hollywood;
  const push = prog(t, B.hottest - 0.3, B.type, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.02 + push * 0.35} y={mix(0, -140, push)} shake={3} seed={1702}>
        <Stage overflow>
          {bg('#1a0e08')}
          <ellipse cx={540} cy={830} rx={700} ry={600} fill="#9fb4cf" opacity={0.1 + noise1(t * 5, 2) * 0.03} />
          <rect x={-600} y={1300} width={2280} height={1200} fill="#2a1a10" />
          <OldTelly id="tv" x={240} y={600} s={1} t={t}>
            <rect x={0} y={0} width={600} height={460} fill="#1a0a14" />
            <circle cx={470} cy={110} r={50} fill="#e8e2d4" opacity={0.8} />
            <Siren x={300} y={250} s={0.85} t={t} />
          </OldTelly>
          <g transform="translate(560,1700)">
            <rect x={-60} y={-260} width={120} height={300} rx={30} fill="#1a1a1e" transform="rotate(-14)" />
            {[0, 1, 2].map((i) => <circle key={i} cx={-30 + i * 30} cy={-200} r={10} fill="#c4161c" opacity={0.6} transform="rotate(-14)" />)}
          </g>
          <Hand id="tv-k" x={600} y={1980} rot={-14} scale={1.0} style={KID} pose={POSES.fist} light={0.7} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** A dating profile card (phone-screen coords). */
const Profile: React.FC<{name: string; line: string; tint: string; shades?: boolean; lace?: boolean; t: number}> = ({name, line, tint, shades, lace, t}) => (
  <g>
    <rect x={30} y={130} width={360} height={600} rx={24} fill={tint} />
    <circle cx={300} cy={220} r={34} fill="#e8e2d4" opacity={0.7} />
    <g clipPath="url(#pf-clip)">
      <Siren x={210} y={470} s={0.9} shades={shades} lace={lace} t={t} />
    </g>
    <rect x={30} y={600} width={360} height={130} fill="#000" opacity={0.55} />
    <text x={54} y={652} fontFamily="Helvetica, Arial, sans-serif" fontSize={34} fontWeight={700} fill="#fff">{name}</text>
    <text x={54} y={698} fontFamily="Helvetica, Arial, sans-serif" fontSize={24} fill="#ddd">{line}</text>
  </g>
);

const PROFILES = [
  {name: 'Morgana, 26', line: 'pale and proud', tint: '#2a2e44'},
  {name: 'Lilith, 29', line: 'black lace only', tint: '#3a1424', lace: true},
  {name: 'Raven, 27', line: 'not a morning person', tint: '#141a2a', shades: true},
  {name: 'Nyx, 25', line: 'night owl', tint: '#24142e'},
];

const Swipes: React.FC<{t: number}> = ({t}) => {
  const marks = [B.pale, B.lace, B.mornings, B.goth];
  return (
    <g>
      <rect x={14} y={14} width={392} height={832} fill="#0c0c10" />
      <defs>
        <clipPath id="pf-clip">
          <rect x={30} y={130} width={360} height={600} rx={24} />
        </clipPath>
      </defs>
      <text x={210} y={90} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={26} fill="#c4161c">♥ nightmatch</text>
      {PROFILES.map((p, i) => {
        const out = prog(t, marks[i] - 0.25, marks[i] + 0.1, easeIn);
        if (out >= 1) return null;
        return (
          <g key={i} transform={`translate(${out * 520},${out * 40}) rotate(${out * 18},210,700)`} style={{}}>
            <Profile {...p} t={t} />
          </g>
        );
      }).reverse()}
      <circle cx={130} cy={790} r={36} fill="#1a1a20" />
      <circle cx={290} cy={790} r={36} fill="#1a1a20" />
      <text x={290} y={803} textAnchor="middle" fontSize={34} fill="#c4161c">♥</text>
      <text x={130} y={802} textAnchor="middle" fontSize={30} fill="#888">✕</text>
    </g>
  );
};

/* S03: so that became my type: swiping right on every pale profile */
export const MyTypeShot: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.type;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.06 + lt * 0.02} shake={3} seed={1703}>
        <Stage>
          {bg('#0c0a10')}
          <ellipse cx={540} cy={900} rx={600} ry={700} fill="#bcd0ff" opacity={0.08} />
          <Phone id="ty-ph" t={t} x={330} y={360} s={1} rot={-2} from="" clock="" msgs={[]} skin={ME.skin} shade={ME.shade} nail={ME.nail} sleeve={ME.sleeve} screen={<Swipes t={t} />} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S04: eight years of goth nights: UV light, strobes, entry stamps piling up my forearm. "Nothing." */
export const GothNights: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.goth;
  const dead = prog(t, B.nothing, B.nothing + 0.25);
  const strobe = (1 - dead) * (Math.sin(t * 31) > 0.6 ? 1 : 0);
  const n = Math.floor(mix(2, 26, prog(t, B.goth, B.nothing, easeOut)));
  const x = 600, y = 1250, rot = -28, sc = 1.3;
  const marks = ['✝', '☾', '✦', '☠', '♰', '✶'];
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1 + lt * 0.03} shake={3 + strobe * 2} seed={1704}>
        <Stage overflow>
          {bg('#08040e')}
          <ellipse cx={540} cy={600} rx={800} ry={600} fill="#7a3aff" opacity={0.2 * (1 - dead * 0.7)} />
          {[200, 540, 880].map((bx, i) => (
            <path key={bx} d={`M${bx},-200 L${bx - 260 + i * 60},1400 L${bx + 200 + i * 40},1400 Z`} fill="#a070ff" opacity={(0.06 + 0.08 * Math.max(0, Math.sin(t * 2 + i * 2))) * (1 - dead)} />
          ))}
          <rect x={-600} y={-800} width={2280} height={3200} fill="#fff" opacity={strobe * 0.08} />
          <Hand id="gn-h" x={x} y={y} rot={rot} scale={sc} style={{...ME_ARM, skin: '#8a7aa6', shade: '#3a2a5a', rim: '#c8a8ff'}} pose={POSES.relaxed} light={1} />
          {Array.from({length: n}, (_, i) => {
            const [sx, sy] = armPoint(x, y, rot, sc, 90 + (i % 5) * 52);
            const off = (Math.floor(i / 5) - 2.5) * 22;
            return (
              <text key={i} x={sx + off + ((i * 37) % 30) - 15} y={sy + ((i * 23) % 26) - 13} textAnchor="middle" fontSize={50} fill="#d8ff6a" opacity={0.75} transform={`rotate(${((i * 53) % 50) - 25},${sx},${sy})`}>
                {marks[i % marks.length]}
              </text>
            );
          })}
          <rect x={-600} y={-800} width={2280} height={3200} fill="#000" opacity={dead * 0.45} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S05: three weeks ago, at the bar: a pale hand in a lace cuff beside a full glass she never touches */
export const Bar: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.then;
  const push = prog(t, B.drinking - 0.2, B.door, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1 + lt * 0.02 + push * 0.4} x={mix(0, 120, push)} y={mix(0, -40, push)} shake={3} seed={1705}>
        <Stage overflow>
          {bg('#0a0610')}
          {/* back bar: shelves of bottles in purple light */}
          <ellipse cx={540} cy={500} rx={800} ry={420} fill="#7a3aff" opacity={0.16} />
          {[300, 560].map((sy) => (
            <g key={sy}>
              <rect x={-400} y={sy} width={1880} height={14} fill="#2a1a3a" />
              {Array.from({length: 14}, (_, i) => (
                <path key={i} d={`M${-300 + i * 110},${sy} l0,-110 c0,-20 12,-30 12,-50 l0,-30 l18,0 l0,30 c0,20 12,30 12,50 l0,110 Z`} fill={i % 3 ? '#140c1e' : '#1e1028'} stroke="#a070ff" strokeOpacity={0.25} strokeWidth={2} />
              ))}
            </g>
          ))}
          {/* the bar top */}
          <path d="M-400,1000 L1480,1000 L1480,2200 L-400,2200 Z" fill="#140a08" />
          <path d="M-400,1000 L1480,1000" stroke="#ffb45a" strokeOpacity={0.3} strokeWidth={5} />
          <ellipse cx={600} cy={1180} rx={500} ry={120} fill="#7a3aff" opacity={0.08} />
          <WineGlass x={720} y={1220} s={1.1} fill={0.85} warm={0} lipstick={false} />
          <Hand id="br-h" x={250} y={1230} rot={78} scale={1.05} style={HER} pose={POSES.relaxed} light={1} />
          <Lace {...(() => { const [lx, ly] = armPoint(250, 1230, 78, 1.05, 78); return {x: lx, y: ly}; })()} rot={78 + 90} s={1.05} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S06: my doorstep from inside: her boots stop exactly at the mat. She waits to be asked */
export const Door: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.door;
  const step = Math.max(0, Math.sin(prog(t, B.invite + 0.2, B.invite + 1.0) * Math.PI)) * 0.6;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.025} y={260} shake={3} seed={1706}>
        <Stage overflow>
          {bg('#05070b')}
          {/* night outside, through the open door */}
          <rect x={160} y={200} width={760} height={1300} fill="#070b14" />
          <ellipse cx={780} cy={420} rx={300} ry={300} fill="#ffcf8a" opacity={0.08} />
          <circle cx={780} cy={420} r={16} fill="#ffe2b0" opacity={0.8} />
          <rect x={774} y={436} width={12} height={760} fill="#0a0c10" />
          {/* her legs and the lace hem above the boots */}
          <path d="M392,620 L476,620 L470,1080 L410,1080 Z" fill="#9aa0b0" />
          <path d="M604,620 L688,620 L670,1080 L610,1080 Z" fill="#9aa0b0" />
          <path d="M476,620 L470,1080 M688,620 L670,1080" stroke="#c8d3e3" strokeOpacity={0.5} strokeWidth={3} />
          <path d="M330,600 L750,600 L760,700 L320,700 Z" fill="#050507" />
          {Array.from({length: 20}, (_, i) => <circle key={i} cx={330 + i * 22} cy={700} r={12} fill="none" stroke="#3a3440" strokeWidth={4} />)}
          <rect x={160} y={200} width={760} height={420} fill="#070b14" />
          <path d="M160,200 L160,1500 M920,200 L920,1500" stroke="#2a1a10" strokeWidth={60} />
          {/* the doorstep outside */}
          <path d="M160,1350 L920,1350 L920,1500 L160,1500 Z" fill="#1a1e26" />
          <Boots x={540} y={1440} s={0.85} step={step} lit={1.6} />
          {/* my warm hall floor and the mat */}
          <path d="M-400,1500 L1480,1500 L1480,2200 L-400,2200 Z" fill="#3a2414" />
          <ellipse cx={540} cy={1900} rx={700} ry={400} fill={WARM} opacity={0.12} />
          <rect x={170} y={1500} width={740} height={26} fill="#c8a070" opacity={0.6} />
          <path d="M240,1540 L840,1540 L900,1760 L180,1760 Z" fill="#5a3a1a" />
          <path d="M240,1540 L840,1540 L900,1760 L180,1760 Z" fill="none" stroke="#2a1a0c" strokeWidth={10} strokeDasharray="14 10" />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** The selfie on my phone: me grinning with a glass, and a second glass in mid-air with lipstick on the rim. */
const Selfie: React.FC<{t: number; flash?: number}> = ({t, flash = 0}) => (
  <g>
    <rect x={14} y={14} width={392} height={832} fill="#3a1e10" />
    <ellipse cx={210} cy={360} rx={300} ry={360} fill={WARM} opacity={0.22} />
    <rect x={14} y={640} width={392} height={206} fill="#2a1408" />
    {/* me, grinning, on the left */}
    <g transform="translate(130,560) scale(1.15)">
      <path d="M-110,200 C-100,110 -60,80 -30,74 L-26,40 L26,40 L30,74 C60,80 100,110 110,200 Z" fill="#22252c" />
      <ellipse cx={0} cy={-20} rx={50} ry={62} fill="#d8a888" />
      <path d="M-50,-30 C-52,-80 -20,-92 0,-92 C30,-92 54,-76 50,-30 C40,-56 -40,-56 -50,-30 Z" fill="#1a1410" />
      <path d="M-24,4 C-10,22 10,22 24,4 Z" fill="#fff" stroke="#3a1a14" strokeWidth={3} />
      <path d="M-24,-30 C-20,-36 -12,-36 -8,-30 M8,-30 C12,-36 20,-36 24,-30" stroke="#1a1010" strokeWidth={4} fill="none" />
    </g>
    <WineGlass x={210} y={600} s={0.45} rot={12} fill={0.5} />
    {/* the other glass, raised to clink, held by nobody */}
    <WineGlass x={300} y={590} s={0.45} rot={-14} fill={0.5} lipstick />
    <rect x={14} y={14} width={392} height={832} fill="#fff" opacity={flash} />
  </g>
);

/* S07: I opened the wine (the selfie: two glasses, only me), then the glass broke in my hand */
export const Wine: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.wine;
  const flash = Math.max(0, 1 - Math.abs(t - (B.wine + 0.6)) / 0.1);
  if (t < B.broke) {
    return (
      <AbsoluteFill>
        <Camera t={t} zoom={1.0 + lt * 0.03} y={-40} shake={3} seed={1707}>
          <Stage>
            {bg('#1a0c06')}
            <ellipse cx={540} cy={700} rx={700} ry={700} fill={WARM} opacity={0.12} />
            {/* her pale hand with the other glass, just outside the phone */}
            <Hand id="wn-her" x={1010} y={560} rot={-60} scale={0.95} style={HER} pose={lerpPose(POSES.relaxed, POSES.fist, 0.5)} light={1} mirror />
            <WineGlass x={880} y={470} s={0.75} rot={-14} fill={0.5} lipstick />
            <Phone id="wn-ph" t={t} x={250} y={420} s={1} rot={2} from="" clock="" msgs={[]} skin={ME.skin} shade={ME.shade} nail={ME.nail} sleeve={ME.sleeve} screen={<Selfie t={t} flash={flash} />} />
          </Stage>
        </Camera>
      </AbsoluteFill>
    );
  }
  const k = prog(t, B.broke, B.broke + 0.5, easeOut);
  const jolt = 0.06 * Math.exp(-(t - B.broke) * 7);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.35 + (t - B.broke) * 0.05 + jolt} y={-120} shake={4 + jolt * 60} seed={1708}>
        <Stage>
          {bg('#1a0c06')}
          <ellipse cx={540} cy={800} rx={600} ry={600} fill={WARM} opacity={0.14} />
          <WineGlass x={540} y={1170} s={1.2} fill={0.5} broken={k} />
          <Hand id="wn-me" x={540} y={1430} rot={0} scale={1.15} style={ME} pose={lerpPose(POSES.fist, POSES.flat, k)} light={1} />
          {/* the cut across my palm */}
          <path d="M470,1250 C510,1236 560,1240 610,1226" stroke="#8a0c18" strokeWidth={8 * k} strokeLinecap="round" fill="none" />
          {[0, 1, 2].map((i) => {
            const dp = prog(t, B.broke + 0.4 + i * 0.35, B.broke + 1.4 + i * 0.35, easeIn);
            return dp > 0 && dp < 1 ? <ellipse key={i} cx={520 + i * 40} cy={1250 + dp * 500} rx={9} ry={13} fill="#8a0c18" /> : null;
          })}
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S08: she said sorry: her eyes in the dark, pupils going wide; then black */
export const Sorry: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.sorry;
  const wide = prog(t, B.sorry + 0.2, B.alot, easeInOut);
  const blink = Math.max(0, 1 - Math.abs(t - (B.alot + 0.5)) / 0.12);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.05} shake={3} seed={1709}>
        <Stage>
          {bg('#030305')}
          <ellipse cx={540} cy={820} rx={500} ry={260} fill="#9fb4cf" opacity={0.05} />
          <Eyes x={540} y={820} s={9} gap={52} pupil={mix(3, 9, wide)} blink={blink} glow="#e4e6ee" />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S09: I woke at sunset; my watch couldn't find a pulse */
export const Wake: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.woke;
  const x = 300, y = 880, rot = -70, sc = 1.6;
  const [wx, wy] = armPoint(x, y, rot, sc, 210);
  const search = t < B.pulse;
  const dots = '.'.repeat(1 + (Math.floor(t * 3) % 3));
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1 + lt * 0.04} x={60} y={0} shake={3} seed={1710}>
        <Stage>
          {bg('#0a0608')}
          {/* sunset burning round the curtain edge */}
          <rect x={860} y={-200} width={40} height={1500} fill="#ff7a2a" opacity={0.55} />
          <path d="M880,-200 L1480,-200 L1480,1500 L880,1300 Z" fill="#ff7a2a" opacity={0.06} />
          <path d="M-400,1100 C200,1040 700,1080 1480,1060 L1480,2200 L-400,2200 Z" fill="#2a2430" />
          <Hand id="wk-h" x={x} y={y} rot={rot} scale={sc} style={ME_DEAD_ARM} pose={POSES.relaxed} light={0.8} />
          <FitnessWatch
            id="wk-w"
            x={wx}
            y={wy}
            rot={rot + 90}
            s={sc * 0.62}
            t={t}
            buzz={[B.pulse + 0.3]}
            screen={
              search ? (
                <WatchText y0={-6} lines={[{text: '♥', size: 30, color: '#666'}, {text: `searching${dots}`, size: 16, color: '#aaa'}]} />
              ) : (
                <WatchText y0={-10} lines={[{text: '-- bpm', size: 30, bold: true}, {text: 'no pulse found', size: 15, color: '#ff6b6b'}]} />
              )
            }
          />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S10: under the door, a black envelope; the card: made without permission, present yourself */
export const Envelope: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.envelope;
  const slide = prog(t, B.envelope + 0.1, B.envelope + 1.2, easeOut);
  const card = prog(t, B.made - 0.35, B.made, easeInOut);
  if (card <= 0 || t < B.made - 0.35) {
    return (
      <AbsoluteFill>
        <Camera t={t} zoom={1.1 + lt * 0.04} y={-80} shake={3} seed={1711}>
          <Stage>
            {bg('#0c0a0a')}
            {/* the door bottom and the gap under it, from above */}
            <rect x={-400} y={-800} width={1880} height={1360} fill="#1e140c" />
            <rect x={-400} y={540} width={1880} height={20} fill="#000" />
            <path d="M-400,560 L1480,560 L1480,2200 L-400,2200 Z" fill="#3a2414" />
            <ellipse cx={540} cy={1100} rx={600} ry={500} fill={WARM} opacity={0.06} />
            <BlackEnvelope x={540} y={mix(400, 900, slide)} s={1.15} rot={mix(0, -6, slide)} />
            <rect x={-400} y={-800} width={1880} height={1340} fill="#1e140c" />
            <path d="M-400,540 L1480,540" stroke="#ffb45a" strokeOpacity={0.15} strokeWidth={3} />
          </Stage>
        </Camera>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + (t - B.made) * 0.03} y={-60} shake={3} seed={1712}>
        <Stage>
          {bg('#0c0a0a')}
          <ellipse cx={540} cy={860} rx={600} ry={500} fill={WARM} opacity={0.08} />
          <CallingCard x={540} y={860} s={1.3} rot={-3} lines={['Made without', 'permission.', 'Present yourself.']} reveal={prog(t, B.made, B.present + 0.4)} />
          <Hand id="ev-h" x={170} y={1310} rot={50} scale={1.1} style={ME_DEAD} pose={lerpPose(POSES.relaxed, POSES.fist, 0.4)} light={0.8} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** The phone lying on the table, face up, screen-local Selfie; used small in the slide shot. */
const PhoneFlat: React.FC<{x: number; y: number; s: number; rot?: number; t: number}> = ({x, y, s, rot = 0, t}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s}) translate(-210,-430)`}>
    <rect x={0} y={0} width={420} height={860} rx={56} fill="#0a0a0c" />
    <rect x={0} y={0} width={420} height={860} rx={56} fill="none" stroke="#c8d3e3" strokeOpacity={0.3} strokeWidth={4} />
    <clipPath id="pfl-clip">
      <rect x={14} y={14} width={392} height={832} rx={44} />
    </clipPath>
    <g clipPath="url(#pfl-clip)">
      <Selfie t={t} />
    </g>
  </g>
);

/* S11: they have rules: back at the table; on "no one finds out" push to the eldest's hand on a covered shape */
export const Rules: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.rules;
  const push = prog(t, B.finds - 0.2, B.eldest, easeInOut);
  const [ex, ey] = tablePt(0.55, 1.75);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.015 + push * 0.9} x={mix(0, ex - 540, push)} y={mix(-20, ey - 960 - 60, push)} shake={3} seed={1713}>
        <Stage overflow>
          <CouncilTable t={t}>
            {/* a cloth over something phone-sized */}
            <path d={`M${ex - 110},${ey + 40} C${ex - 100},${ey - 30} ${ex + 100},${ey - 30} ${ex + 110},${ey + 40} Z`} fill="#2a2228" />
            <path d={`M${ex - 100},${ey + 10} C${ex - 60},${ey - 26} ${ex + 60},${ey - 26} ${ex + 100},${ey + 10}`} stroke="#ffb45a" strokeOpacity={0.25} strokeWidth={4} fill="none" />
            <Hand id="ru-el" x={ex + 220} y={ey + 30} rot={-80} scale={0.5} style={ELDER} pose={POSES.relaxed} light={0.8} />
          </CouncilTable>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S12: the eldest slid my phone across the table to me */
export const Slide: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.eldest;
  const k = prog(t, B.eldest + 0.3, B.story - 0.3, easeInOut);
  const [px, py] = [mix(600, 540, k), mix(1050, 1560, k)];
  const sc = mix(0.22, 0.42, k);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.25 + lt * 0.03} y={160} shake={3} seed={1714}>
        <Stage overflow>
          <CouncilTable t={t}>
            <PhoneFlat x={px} y={py} s={sc} rot={mix(10, 0, k)} t={t} />
            <Hand id="sl-el" x={px + 40 * (sc / 0.3)} y={py - 250 * (sc / 0.3)} rot={180} scale={sc * 2.6} style={ELDER} pose={POSES.flat} light={0.8} />
            <Hand id="sl-me" x={540} y={2050} rot={0} scale={1.0} style={ME_DEAD} pose={POSES.relaxed} light={0.7} />
          </CouncilTable>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** The story view: progress bars, the selfie, and the viewer count. */
const StoryView: React.FC<{t: number; views: number}> = ({t, views}) => (
  <g>
    <Selfie t={t} />
    {[0, 1, 2].map((i) => <rect key={i} x={30 + i * 124} y={34} width={112} height={6} rx={3} fill="#fff" opacity={i === 1 ? 0.9 : 0.4} />)}
    <circle cx={52} cy={78} r={20} fill="#22252c" stroke="#c4161c" strokeWidth={3} />
    <text x={84} y={86} fontFamily="Helvetica, Arial, sans-serif" fontSize={22} fontWeight={700} fill="#fff">me · 3w</text>
    {views > 0 && (
      <g>
        <rect x={14} y={760} width={392} height={86} fill="#000" opacity={0.55} />
        <text x={44} y={814} fontFamily="Helvetica, Arial, sans-serif" fontSize={30} fontWeight={700} fill="#fff">👁 Seen by {views}</text>
      </g>
    )}
  </g>
);

/* S13: my story from that night: two glasses, nobody next to me; three hundred people watched it */
export const StoryShot: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.story;
  const toGlasses = prog(t, B.glasses - 0.2, B.glasses + 0.6, easeInOut);
  const back = prog(t, B.watched - 0.2, B.watched + 0.5, easeInOut);
  const views = Math.round(312 * prog(t, B.watched, B.watched + 1.4, easeOut));
  const z = 1.05 + lt * 0.02 + toGlasses * 0.7 - back * 0.7;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={z} x={mix(0, 60, toGlasses) * (1 - back)} y={mix(0, 120, toGlasses) * (1 - back) + back * 120} shake={3} seed={1715}>
        <Stage>
          {bg('#07060a')}
          <ellipse cx={540} cy={860} rx={600} ry={700} fill="#bcd0ff" opacity={0.08} />
          <Phone id="st-ph" t={t} x={330} y={420} s={1} rot={0} from="" clock="" msgs={[]} skin={ME_DEAD.skin} shade={ME_DEAD.shade} nail={ME_DEAD.nail} sleeve={ME_DEAD.sleeve} screen={<StoryView t={t} views={views} />} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** Her pale hands folded at the far end of the table, the lace cuffs. */
const HerHands: React.FC<{s: number; x: number; y: number; t: number; open?: number}> = ({s, x, y, t, open = 0}) => (
  <g>
    <Hand id="hh-l" x={x - 90 * s} y={y + 130 * s} rot={70} scale={s} style={HER} pose={lerpPose(POSES.relaxed, POSES.flat, open)} light={1} />
    <Hand id="hh-r" x={x + 90 * s} y={y + 130 * s} rot={-70} scale={s} style={HER} pose={POSES.relaxed} light={1} mirror />
  </g>
);

/** Her, at the far end: long black hair, head bowed, a sliver of pale face; no eyes for me. */
const HerFigure: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x},${y}) scale(${1 / 4.2})`}>
    <ellipse cx={0} cy={-500} rx={420} ry={420} fill="#ffb45a" opacity={0.07} />
    <path d="M-230,40 C-220,-260 -160,-420 -100,-460 L100,-460 C160,-420 220,-260 230,40 Z" fill="#050507" />
    {Array.from({length: 12}, (_, i) => <circle key={i} cx={-130 + i * 24} cy={-440} r={13} fill="none" stroke="#3a3440" strokeWidth={5} />)}
    <rect x={-30} y={-540} width={60} height={90} fill="#c8ccd8" />
    <ellipse cx={0} cy={-610} rx={84} ry={104} fill="#d8dce6" transform="rotate(8,0,-610)" />
    <path d="M-110,-560 C-130,-760 -40,-790 0,-790 C60,-790 140,-760 110,-560 L120,-380 L60,-400 L66,-600 C40,-680 -40,-680 -66,-600 L-60,-400 L-120,-380 Z" fill="#0a0a0e" />
    <path d="M-66,-600 C-40,-680 40,-680 66,-600 C40,-650 -40,-650 -66,-600 Z" fill="#0a0a0e" />
    <path d="M-20,-560 C-8,-566 8,-566 20,-560" stroke="#9a0c1c" strokeWidth={10} strokeLinecap="round" />
    <path d="M-110,-560 C-130,-760 -40,-790 0,-790" stroke="#ffb45a" strokeOpacity={0.25} strokeWidth={8} fill="none" />
  </g>
);

/* S14: she's at the far end; she hasn't looked at me once. The camera travels down the table to her */
export const FarEnd: React.FC<{t: number}> = ({t}) => {
  const k = prog(t, B.far, B.each - 0.1, easeInOut);
  const [fx, fy] = tablePt(0, 4.2);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.1, 3.2, k)} x={0} y={mix(0, fy - 960 - 40, k)} shake={3} seed={1716}>
        <Stage overflow>
          <CouncilTable t={t} depths={[2.6, 1.9]} far={<HerFigure x={fx} y={fy} />} atFar={<HerHands s={0.3} x={fx} y={fy - 40} t={t} />} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S15-16: three votes each, stones dropping onto the cloth; then her hand over the last two. Hard cut */
export const Votes: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.each;
  const drops = [0, 1, 2, 3, 4, 5].map((i) => B.each + 0.15 + i * 0.22);
  const hers = t >= B.hers;
  const hover = prog(t, B.hers + 0.1, B.hers + 0.8, easeOut);
  const sway = Math.sin((t - B.hers) * 2.2) * 60 * hover;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={(hers ? 1.25 : 1.05) + lt * 0.03} y={hers ? -40 : 0} shake={3} seed={1717}>
        <Stage>
          {bg('#0a0406')}
          <rect x={-400} y={-800} width={1880} height={3200} fill="#120709" />
          <ellipse cx={540} cy={800} rx={700} ry={600} fill={WARM} opacity={0.08 + noise1(t * 6, 3) * 0.01} />
          {/* two rows of three: white on the left, black on the right */}
          {drops.map((d, i) => {
            const p = prog(t, d, d + 0.18, easeIn);
            if (t < d) return null;
            const white = i % 2 === 0;
            const col = Math.floor(i / 2);
            return <VoteStone key={i} x={(white ? 330 : 750) + (col - 1) * 0} y={480 + col * 170 - (1 - p) * 120} s={1.2 + (1 - p) * 0.3} white={white} />;
          })}
          <text x={330} y={360} textAnchor="middle" fontFamily="CountCaption, serif" fontStyle="italic" fontSize={46} fill="#d8d2c4" opacity={0.6}>spare</text>
          <text x={750} y={360} textAnchor="middle" fontFamily="CountCaption, serif" fontStyle="italic" fontSize={46} fill="#8a8478" opacity={0.6}>stake</text>
          {hers && (
            <g>
              {/* her two stones, near, and her hand hovering between them */}
              <VoteStone x={400} y={1060} s={1.3} white />
              <VoteStone x={680} y={1060} s={1.3} white={false} />
              <Hand id="vt-her" x={540 + sway} y={mix(-200, 760, hover)} rot={180} scale={1.15} style={HER} pose={lerpPose(POSES.relaxed, POSES.reach, 0.5 + 0.2 * Math.sin(t * 5))} light={1} />
            </g>
          )}
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};
