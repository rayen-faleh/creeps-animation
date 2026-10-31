import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage} from '../../../../kit/common/fx';
import {Hand, HandStyle, POSES, STYLES, lerpPose, lerpStyle} from '../../../../kit/common/art/Hand';
import {Phone} from '../../../../kit/common/art/Modern';
import {CouncilTable, Eyes, VoteStone, WineGlass, tablePt} from '../../../../kit/common/art/Council';
import {Her, HerEyes, HerMouth} from '../../../../kit/common/puppet/Her';
import {easeIn, easeInOut, easeOut, mix, noise1, prog} from '../../../../kit/common/util';
import {Selfie, StoryView} from '../../my-type/scenes/Story';
import beats from '../beats.json';

/** Shot boundaries and sync points (global seconds), derived from timing.json by beats.py. */
export const B = beats.B;

const WARM = '#ffb45a';
const ME_DEAD: HandStyle = {...lerpStyle(STYLES.adult, STYLES.vamp, 0.6), sleeve: '#16181e', cuff: '#22252c'};
const HER: HandStyle = {...STYLES.vamp, skin: '#e4e6ee', shade: '#8a94a8', rim: '#9fb4cf', sleeve: '#0a0a0e', cuff: '#16161c', nailLen: 6, nail: '#9a0c1c'};
const ELDER: HandStyle = {...lerpStyle(STYLES.gran, STYLES.vamp, 0.7), sleeve: '#0a0809', cuff: '#16121a', nailLen: 12};
const PIZZA: HandStyle = {...STYLES.adult, skin: '#c89a7a', shade: '#6a4a3a', sleeve: '#c4161c', cuff: '#a01014'};
const F = 'Helvetica, Arial, sans-serif';

const bg = (fill: string) => <rect x={-600} y={-800} width={2280} height={3200} fill={fill} />;
const bob = (t: number, seed: number, amp = 1.6) => noise1(t * 0.55, seed) * amp;
const blinking = (t: number, seed: number) => ((t + seed * 1.37) % 3.9) < 0.13;
const herEyes = (t: number, seed: number, open: HerEyes = 'open'): HerEyes => (blinking(t, seed) ? 'closed' : open);

/** Her face, close (the rigged character), against a backdrop. */
const HerClose: React.FC<{t: number; seed: number; eyes: HerEyes; mouth: HerMouth; brows?: 'none' | 'neutral' | 'raised' | 'angry'; look?: number; tilt?: number}> = ({t, seed, eyes, mouth, brows = 'neutral', look = 2, tilt = 0}) => (
  <Her x={700} y={3720} s={2.45} t={t} headTilt={bob(t, seed) + tilt} eyes={eyes} look={look} mouth={mouth} brows={brows} />
);

/* S01 hook: three weeks ago, at the bar: her, the full glass she never touched; her eyes slide to us */
export const Bar: React.FC<{t: number}> = ({t}) => {
  const look = prog(t, B.girl + 0.6, B.girl + 1.2, easeInOut) * 4;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.15 + t * 0.03} x={60} y={-20} shake={3} seed={2201}>
        <Stage overflow>
          {bg('#0a0610')}
          <ellipse cx={540} cy={500} rx={800} ry={420} fill="#7a3aff" opacity={0.16} />
          {[300, 560].map((sy) => (
            <g key={sy}>
              <rect x={-400} y={sy} width={1880} height={14} fill="#2a1a3a" />
              {Array.from({length: 14}, (_, i) => (
                <path key={i} d={`M${-300 + i * 110},${sy} l0,-110 c0,-20 12,-30 12,-50 l0,-30 l18,0 l0,30 c0,20 12,30 12,50 l0,110 Z`} fill={i % 3 ? '#140c1e' : '#1e1028'} stroke="#a070ff" strokeOpacity={0.25} strokeWidth={2} />
              ))}
            </g>
          ))}
          <Her x={700} y={1790} s={1.02} t={t} headTilt={bob(t, 3)} eyes={herEyes(t, 3)} look={look} mouth="closed" brows="neutral" />
          <path d="M-400,1000 L1480,1000 L1480,2200 L-400,2200 Z" fill="#140a08" />
          <path d="M-400,1000 L1480,1000" stroke={WARM} strokeOpacity={0.3} strokeWidth={5} />
          <WineGlass x={360} y={1220} s={1.1} fill={0.85} warm={0} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S02: last night the council voted; three each; her hand sets down the white stone. Spare */
export const Vote: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.vote;
  const hover = prog(t, B.vote + 0.3, B.spare - 0.2, easeOut);
  const drop = prog(t, B.spare, B.spare + 0.35, easeIn);
  const lift = prog(t, B.spare + 0.6, B.terms, easeIn);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.02} y={60} shake={3} seed={2202}>
        <Stage>
          {bg('#120709')}
          <ellipse cx={540} cy={800} rx={700} ry={600} fill={WARM} opacity={0.08 + noise1(t * 6, 3) * 0.01} />
          {[0, 1, 2].map((i) => <VoteStone key={`w${i}`} x={330} y={480 + i * 170} s={1.2} white />)}
          {[0, 1, 2].map((i) => <VoteStone key={`b${i}`} x={750} y={480 + i * 170} s={1.2} white={false} />)}
          <text x={330} y={360} textAnchor="middle" fontFamily="CountCaption, serif" fontStyle="italic" fontSize={46} fill="#d8d2c4" opacity={0.6}>spare</text>
          <text x={750} y={360} textAnchor="middle" fontFamily="CountCaption, serif" fontStyle="italic" fontSize={46} fill="#8a8478" opacity={0.6}>stake</text>
          {/* her stone, carried in and set down at the bottom of the spare column */}
          <VoteStone x={330} y={mix(1150, 990, drop)} s={1.2 + (1 - drop) * 0.15} white />
          <Hand id="vt-her" x={mix(900, 470, hover) + lift * 300} y={mix(1700, 1180, hover) + lift * 600} rot={-40} scale={1.1} style={HER} pose={lerpPose(POSES.relaxed, POSES.flat, drop)} light={1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S03: on one condition: by sunrise the selfie never happened. The eldest's grey hand on the table */
export const Terms: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.terms;
  const [ex, ey] = tablePt(0.1, 1.6);
  const tap = [B.sunrise, B.selfie].reduce((m, c) => m + Math.exp(-Math.abs(t - c) * 14), 0);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.25 + lt * 0.04} x={ex - 540} y={ey - 960 - 80} shake={3} seed={2203}>
        <Stage overflow>
          <CouncilTable t={t}>
            <Hand id="tm-el" x={ex + 40} y={ey + 220 - tap * 20} rot={-6} scale={0.85} style={ELDER} pose={lerpPose(POSES.relaxed, POSES.point, 0.6)} light={0.8} />
          </CouncilTable>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S04: she wasn't in it; three hundred and twelve people saw it */
export const StoryShot: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.story;
  const views = Math.round(312 * prog(t, B.saw, B.saw + 1.2, easeOut));
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1 + lt * 0.03} y={60} shake={3} seed={2204}>
        <Stage>
          {bg('#07060a')}
          <ellipse cx={540} cy={860} rx={600} ry={700} fill="#bcd0ff" opacity={0.08} />
          <Phone id="st-ph" t={t} x={330} y={420} s={1} from="" clock="" msgs={[]} skin={ME_DEAD.skin} shade={ME_DEAD.shade} nail={ME_DEAD.nail} sleeve={ME_DEAD.sleeve} screen={<StoryView t={t} views={views} />} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

const HANDLES = ['1.  Mum  ♥', '2.  @dazza_88', '3.  @lil.morgue', '4.  @crypt_kicker', '5.  Uncle Pete', '6.  @gothdad1979', '7.  my landlord'];

/** The council's list: Instagram handles in copperplate on cream paper. lastLine shows the bottom of the scroll instead. */
const ListPaper: React.FC<{t: number; ticks?: number; lastLine?: boolean; highlight?: number}> = ({t, ticks = 0, lastLine = false, highlight = 0}) => (
  <g>
    <path d="M140,120 H940 V1250 H140 Z" fill="#e8dcc0" />
    <path d="M140,120 H940 V1250 H140 Z" fill="none" stroke="#8a7050" strokeWidth={6} />
    {/* the scroll rolls on below, out of reach of the captions */}
    <rect x={120} y={1240} width={840} height={60} rx={30} fill="#c8b890" stroke="#8a7050" strokeWidth={6} />
    <ellipse cx={540} cy={900} rx={520} ry={900} fill="#8a7050" opacity={0.08} />
    {!lastLine ? (
      <g>
        <text x={540} y={230} textAnchor="middle" fontFamily="CountCaption, serif" fontStyle="italic" fontSize={56} fill="#3a1a14">To be forgotten by sunrise</text>
        <path d="M260,262 H820" stroke="#7a0e14" strokeWidth={3} />
        {HANDLES.map((h, i) => (
          <g key={i}>
            {i === 0 && <rect x={190} y={300 + i * 135 - 64} width={700} height={92} fill="#ffd84a" opacity={0.35 * highlight} />}
            <text x={220} y={320 + i * 135} fontFamily="CountCaption, serif" fontStyle="italic" fontSize={62} fill="#2a1a14">{h}</text>
            {i < ticks && <path d={`M800,${300 + i * 135} l22,24 l44,-56`} stroke="#7a0e14" strokeWidth={9} fill="none" strokeLinecap="round" />}
          </g>
        ))}
      </g>
    ) : (
      <g>
        {['309.  @spookyspice', '310.  @ravenhaired.rach', '311.  my dentist'].map((h, i) => (
          <g key={i}>
            <text x={220} y={420 + i * 150} fontFamily="CountCaption, serif" fontStyle="italic" fontSize={62} fill="#2a1a14">{h}</text>
            <path d={`M800,${400 + i * 150} l22,24 l44,-56`} stroke="#7a0e14" strokeWidth={9} fill="none" strokeLinecap="round" />
          </g>
        ))}
        <text x={220} y={870} fontFamily="CountCaption, serif" fontStyle="italic" fontSize={62} fill="#2a1a14">312.</text>
        <path d="M360,880 H760" stroke="#2a1a14" strokeWidth={4} strokeDasharray="10 12" />
      </g>
    )}
  </g>
);

/* S05-06: they handed me a list. Every viewer. In fountain pen. Number one: my mum. She'd liked it */
export const List: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.list;
  const toMum = prog(t, B.mum - 0.2, B.mum + 0.6, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.0 + lt * 0.02, 2.0, toMum)} x={mix(0, -90, toMum)} y={mix(-60, 300 - 960 + 60, toMum)} shake={2.5} seed={2205}>
        <Stage overflow>
          {bg('#120709')}
          <ListPaper t={t} highlight={prog(t, B.liked, B.liked + 0.4)} />
          <Hand id="ls-l" x={110} y={1560} rot={20} scale={1.0} style={ME_DEAD} pose={POSES.relaxed} light={0.7} mirror />
          <Hand id="ls-r" x={970} y={1560} rot={-20} scale={1.0} style={ME_DEAD} pose={POSES.relaxed} light={0.7} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S07: she taught me on the walk home. Eye contact (eyes wide). Slowly (half). Forget (red, mouth open) */
export const Teach: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.teach;
  let eyes: HerEyes = herEyes(t, 5);
  let mouth: HerMouth = 'closed';
  if (t >= B.eye) eyes = 'wide';
  if (t >= B.slowly) eyes = 'half';
  if (t >= B.forget) eyes = 'red';
  if (t >= B.forget && t < B.forget + 0.5) mouth = t < B.forget + 0.22 ? 'oh' : 'ah';
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.05} shake={2.5} seed={2206}>
        <Stage overflow>
          {bg('#05070b')}
          {/* street lamps passing behind her as you walk */}
          {[0, 1, 2].map((i) => {
            const x = ((i * 520 - lt * 260) % 1560 + 1560) % 1560 - 240;
            return <ellipse key={i} cx={x} cy={420} rx={160} ry={160} fill="#ffcf8a" opacity={0.1} />;
          })}
          <HerClose t={t} seed={5} eyes={eyes} mouth={mouth} brows={t >= B.forget ? 'angry' : 'neutral'} look={4} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S08: first try, the pizza guy forgot his own name: dazed eyes under a cap, a badge with a question mark */
export const Pizza: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.pizza;
  const daze = prog(t, B.name - 0.2, B.name + 0.6, easeOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1 + lt * 0.03} y={-40} shake={3} seed={2207}>
        <Stage>
          {bg('#0a0c10')}
          {/* his doorway: a porch light, the open door */}
          <rect x={160} y={160} width={760} height={1500} fill="#3a2a1c" />
          <ellipse cx={540} cy={240} rx={300} ry={160} fill="#ffcf8a" opacity={0.25} />
          {/* the delivery guy: a red shirt, a cap, eyes going glassy */}
          <path d="M260,1700 C270,1260 380,1120 540,1110 C700,1120 810,1260 820,1700 Z" fill="#c4161c" />
          <ellipse cx={540} cy={860} rx={170} ry={210} fill="#c89a7a" />
          <path d="M360,760 C380,640 700,640 720,760 Z" fill="#c4161c" />
          <path d="M360,760 L820,780 L800,810 L360,790 Z" fill="#8a0c10" />
          <g transform={`translate(540,860)`}>
            <Eyes x={0} y={0} s={2.2} gap={56} glow="#f4f0e8" pupil={mix(6, 2, daze)} look={Math.sin(t * 3) * daze * 1.5} blink={daze * 0.35} />
          </g>
          <path d={`M490,${980 + daze * 6} Q540,${990 - daze * 4} 590,${980 + daze * 6}`} stroke="#5a3020" strokeWidth={8} fill="none" />
          {/* name badge */}
          <g transform="translate(690,1200) rotate(-5)">
            <rect x={-120} y={-60} width={240} height={120} rx={12} fill="#fff" />
            <text x={0} y={-22} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={22} fill="#c4161c">HELLO MY NAME IS</text>
            <text x={0} y={42} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={56} fill="#1a1a1e" opacity={daze}>?</text>
          </g>
          {/* the pizza box held out, sagging as he forgets */}
          <g transform={`translate(540,${1460 + daze * 30}) rotate(${daze * 4})`}>
            <rect x={-300} y={-60} width={600} height={120} rx={8} fill="#d8c09a" stroke="#8a7050" strokeWidth={6} />
            <text x={0} y={18} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={44} fill="#c4161c">PIZZA</text>
          </g>
          <Hand id="pz-l" x={250} y={1680 + daze * 30} rot={30} scale={1.0} style={PIZZA} pose={POSES.relaxed} light={0.8} mirror />
          <Hand id="pz-r" x={830} y={1680 + daze * 30} rot={-30} scale={1.0} style={PIZZA} pose={POSES.relaxed} light={0.8} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

const DOORS = ['#2a4a6a', '#6a2a2a', '#2a5a3a', '#4a3a6a', '#6a5a2a'];

/* S09: by four a.m., two hundred people had forgotten: doors, one after another, the list ticking down */
export const Montage: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.montage;
  const i = Math.min(DOORS.length - 1, Math.floor(lt / 0.95));
  const flash = 1 - Math.min(1, (lt - i * 0.95) / 0.15);
  if (lt > 0.95 * 4) {
    return (
      <AbsoluteFill>
        <Camera t={t} zoom={1.15} shake={3} seed={2209}>
          <Stage overflow>
            {bg('#120709')}
            <ListPaper t={t} ticks={Math.min(7, Math.floor((lt - 3.8) * 12))} />
          </Stage>
        </Camera>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.08 + (lt % 0.95) * 0.08} x={(i % 2 ? 30 : -30)} shake={3} seed={2208 + i}>
        <Stage>
          {bg('#07080c')}
          <rect x={260} y={300} width={560} height={1240} fill={DOORS[i]} stroke="#1a1410" strokeWidth={20} />
          <rect x={300} y={360} width={480} height={420} fill="#000" opacity={0.25} />
          <rect x={300} y={860} width={480} height={600} fill="#000" opacity={0.25} />
          <circle cx={760} cy={960} r={16} fill="#c8b070" />
          <text x={540} y={260} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={70} fill="#c8ccd4">{[14, 27, 3, 91, 58][i]}</text>
          <ellipse cx={540} cy={220} rx={240} ry={120} fill="#ffcf8a" opacity={0.15} />
          <rect x={-600} y={-800} width={2280} height={3200} fill="#fff" opacity={flash * 0.15} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S10: and at every door, she said sorry (and once, we hear her) */
export const Sorry: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.door;
  const w = t - B.sorry;
  const mouth: HerMouth = w >= 0 && w < 0.25 ? 'oh' : w >= 0.25 && w < 0.6 ? 'ah' : 'sad';
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.03} shake={2.5} seed={2210}>
        <Stage overflow>
          {bg('#0a0806')}
          {/* a doorway's warm light on her */}
          <rect x={-200} y={-200} width={360} height={2400} fill="#ffcf8a" opacity={0.12} />
          <ellipse cx={300} cy={760} rx={500} ry={700} fill="#ffcf8a" opacity={0.08} />
          <HerClose t={t} seed={7} eyes={herEyes(t, 7, 'half')} mouth={mouth} brows="raised" look={-3} tilt={-2} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S11: then I got to number three hundred and twelve: the last line, blank */
export const LastLine: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.last;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.3 + lt * 0.08} y={-60} shake={2.5} seed={2211}>
        <Stage overflow>
          {bg('#120709')}
          <ListPaper t={t} lastLine />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** A blank profile: no name, no photo, joined three weeks ago. */
const BlankProfile: React.FC = () => (
  <g>
    <rect x={14} y={14} width={392} height={832} fill="#0c0c10" />
    <circle cx={210} cy={220} r={80} fill="#2a2d34" />
    <circle cx={210} cy={200} r={30} fill="#3a3e46" />
    <path d="M150,280 C160,240 260,240 270,280 Z" fill="#3a3e46" />
    <text x={210} y={360} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={30} fill="#eef0f4">@____</text>
    <text x={210} y={404} textAnchor="middle" fontFamily={F} fontSize={22} fill="#8a8e96">0 posts · 0 followers · 1 following</text>
    <text x={210} y={460} textAnchor="middle" fontFamily={F} fontSize={22} fill="#c4161c">Joined 3 weeks ago</text>
    <rect x={60} y={520} width={300} height={60} rx={12} fill="#1e2028" />
    <text x={210} y={560} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={24} fill="#eef0f4">Message</text>
  </g>
);

/* S12: no name, no photo, the account made the night I was bitten */
export const Profile: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.profile;
  const toJoined = prog(t, B.made - 0.2, B.made + 0.8, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1 + lt * 0.02 + toJoined * 0.5} y={mix(0, -40, toJoined)} shake={2.5} seed={2212}>
        <Stage>
          {bg('#07060a')}
          <ellipse cx={540} cy={860} rx={600} ry={700} fill="#bcd0ff" opacity={0.07} />
          <Phone id="pf-ph" t={t} x={330} y={420} s={1} from="" clock="" msgs={[]} skin={ME_DEAD.skin} shade={ME_DEAD.shade} nail={ME_DEAD.nail} sleeve={ME_DEAD.sleeve} screen={<BlankProfile />} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** The DM thread: the screenshot of my story, typing dots, then the message. */
const Thread: React.FC<{t: number}> = ({t}) => {
  const shot = prog(t, B.dm + 0.3, B.dm + 0.8, easeOut);
  const typing = t > B.message && t < B.know;
  const msg = prog(t, B.know - 0.05, B.know + 0.2, easeOut);
  return (
    <g>
      <rect x={14} y={14} width={392} height={832} fill="#0c0c10" />
      <rect x={14} y={14} width={392} height={90} fill="#14161c" />
      <circle cx={60} cy={60} r={24} fill="#2a2d34" />
      <text x={100} y={68} fontFamily={F} fontWeight={700} fontSize={24} fill="#eef0f4">@____</text>
      {/* the screenshot, as an image message */}
      <g opacity={shot} transform={`translate(40,${140 - (1 - shot) * 20})`}>
        <rect x={0} y={0} width={220} height={380} rx={16} fill="#1e2028" />
        <g transform="translate(6,6) scale(0.5)">
          <clipPath id="th-clip"><rect x={14} y={14} width={392} height={720} rx={20} /></clipPath>
          <g clipPath="url(#th-clip)"><Selfie t={t} /></g>
        </g>
      </g>
      {typing && [0, 1, 2].map((i) => <circle key={i} cx={70 + i * 26} cy={570} r={9} fill="#8a8e96" opacity={0.4 + 0.6 * Math.max(0, Math.sin(t * 8 - i))} />)}
      {msg > 0 && (
        <g opacity={msg} transform={`translate(0,${(1 - msg) * 16})`}>
          <rect x={40} y={540} width={330} height={120} rx={26} fill="#2a2d34" />
          <text x={64} y={590} fontFamily={F} fontSize={28} fill="#eef0f4">I know what she is.</text>
          <text x={64} y={632} fontFamily={F} fontSize={28} fill="#eef0f4">Do you?</text>
        </g>
      )}
    </g>
  );
};

/* S13: they screenshotted my story and sent one message: I know what she is. Do you? */
export const Dm: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.dm;
  const push = prog(t, B.know - 0.3, B.shoulder, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1 + lt * 0.02 + push * 0.45} y={mix(0, 120, push)} shake={2.5} seed={2213}>
        <Stage>
          {bg('#07060a')}
          <ellipse cx={540} cy={860} rx={600} ry={700} fill="#bcd0ff" opacity={0.07} />
          <Phone id="dm-ph" t={t} x={330} y={420} s={1} from="" clock="" msgs={[]} buzz={[B.know]} skin={ME_DEAD.skin} shade={ME_DEAD.shade} nail={ME_DEAD.nail} sleeve={ME_DEAD.sleeve} screen={<Thread t={t} />} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S14: she read it over my shoulder, and stopped apologising: sad, then perfectly still; eyes half, then red */
export const Still: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.shoulder;
  const stop = t >= B.stopped + 0.4;
  const red = t >= B.stopped + 1.2;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.0 + lt * 0.06} shake={stop ? 1.5 : 2.5} seed={2214}>
        <Stage overflow>
          {bg('#030305')}
          {/* the phone's glow on her face from below */}
          <ellipse cx={540} cy={1500} rx={700} ry={500} fill="#bcd0ff" opacity={0.1} />
          <Her x={700} y={3720} s={2.45} t={t} headTilt={stop ? 0 : bob(t, 9) - 2} eyes={red ? 'red' : stop ? 'half' : herEyes(t, 9, 'half')} look={stop ? 0 : -3} mouth={stop ? 'closed' : 'sad'} brows={stop ? 'neutral' : 'raised'} breathe={stop ? 0 : 1} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};
