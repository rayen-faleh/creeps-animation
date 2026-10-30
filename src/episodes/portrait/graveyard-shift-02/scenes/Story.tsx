import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera, Stage} from '../../../../kit/common/fx';
import {Hand, HandStyle, POSES, STYLES, lerpPose} from '../../../../kit/common/art/Hand';
import {Smoke} from '../../../../kit/common/art/Home';
import {Phone} from '../../../../kit/common/art/Modern';
import {Watcher} from '../../../../kit/common/art/Watcher';
import {Eyes} from '../../../../kit/common/art/Council';
import {Counter, Forecourt, OldCoin, ShopDoors} from '../../../../kit/portrait/sets/PetrolStation';
import {easeIn, easeInOut, easeOut, mix, noise1, prog, rng} from '../../../../kit/common/util';
import beats from '../beats.json';

/** Shot boundaries and sync points (global seconds), derived from timing.json by beats.py. */
export const B = beats.B;

/** You: a night-shift worker's hands, navy uniform sleeve (as in Part 1); greying as you turn. */
const YOU: HandStyle = {...STYLES.adult, sleeve: '#1e3a5a', cuff: '#26486e'};
const YOU_TURNING: HandStyle = {...STYLES.adult, skin: '#b8aea6', shade: '#5a5258', sleeve: '#1e3a5a', cuff: '#26486e', nailLen: 4};
/** Dave's hand on the glass. */
const DAVE: HandStyle = {...STYLES.adult, skin: '#c89a7a', shade: '#6a4a3a', sleeve: '#3a3a30', cuff: '#4a4a3e'};
const DAWN = '#e8b890';
const bg = (fill: string) => <rect x={-600} y={-800} width={2280} height={3200} fill={fill} />;
/** A soft pool of light (no hard edge). */
const Glow: React.FC<{id: string; cx: number; cy: number; rx: number; ry: number; color: string; a: number}> = ({id, cx, cy, rx, ry, color, a}) => (
  <g>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor={color} stopOpacity={a} />
        <stop offset="0.6" stopColor={color} stopOpacity={a * 0.35} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id})`} />
  </g>
);

/** The call screen: R., connected, the timer running from the moment he picked up. */
const CallScreen: React.FC<{t: number; dim?: number}> = ({t, dim = 0}) => {
  const secs = Math.max(0, Math.floor(t - B.ring));
  const connected = t >= B.ring;
  const mm = String(Math.floor(secs / 60)).padStart(2, '0'), ss = String(secs % 60).padStart(2, '0');
  const F = 'Helvetica, Arial, sans-serif';
  return (
    <g>
      <rect x={14} y={14} width={392} height={832} fill="#0c0f14" />
      <circle cx={210} cy={290} r={86} fill="#2a2f38" />
      <text x={210} y={318} textAnchor="middle" fontFamily={F} fontSize={86} fill="#c8ccd4">R</text>
      <text x={210} y={440} textAnchor="middle" fontFamily={F} fontSize={44} fill="#eef0f4">R.</text>
      <text x={210} y={488} textAnchor="middle" fontFamily={F} fontSize={26} fill={connected ? '#7ad07a' : '#8a8e96'}>
        {connected ? `${mm}:${ss}` : 'calling…'}
      </text>
      {[0, 1, 2].map((i) => <circle key={i} cx={110 + i * 100} cy={680} r={38} fill="#1e232c" />)}
      <circle cx={210} cy={780} r={40} fill="#c4161c" />
      <rect x={14} y={14} width={392} height={832} fill="#000" opacity={dim} />
    </g>
  );
};

/* S01 hook: your hand, greying and starting to smoke, holds the phone: R., connected at 00:01 */
export const Call: React.FC<{t: number}> = ({t}) => {
  const ringPulse = t < B.ring ? Math.max(0, Math.sin(t * 9)) : 0;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.08 + t * 0.03} y={-40} shake={3} seed={2001}>
        <Stage>
          {bg('#1a1e24')}
          <ellipse cx={540} cy={760} rx={620} ry={700} fill={DAWN} opacity={0.1} />
          <Phone id="call-ph" t={t} x={330} y={330} s={1} rot={-3} from="" clock="" msgs={[]} buzz={[0.2, 0.9]} skin={YOU_TURNING.skin} shade={YOU_TURNING.shade} nail="#8a8088" sleeve={YOU.sleeve} screen={<CallScreen t={t} />} />
          <Smoke x={640} y={1180} t={t} a={0.35} w={140} />
          <circle cx={540} cy={640} r={260 + ringPulse * 40} fill="none" stroke="#7ad07a" strokeOpacity={0.12 * ringPulse} strokeWidth={10} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S02 recap: the coins from 1790 on the counter; then your hand smoking in the grey light */
export const Recap: React.FC<{t: number}> = ({t}) => {
  if (t < B.bydawn) {
    const lt = t - B.recap;
    return (
      <AbsoluteFill>
        <Camera t={t} zoom={2.1 + lt * 0.05} x={60} y={300} shake={3} seed={2002}>
          <Stage>
            <Counter t={t}>
              <OldCoin x={560} y={1150} s={0.9} date="1790" />
              <OldCoin x={700} y={1170} s={0.75} date="1788" />
            </Counter>
          </Stage>
        </Camera>
      </AbsoluteFill>
    );
  }
  const lt = t - B.bydawn;
  const smoke = prog(t, B.smoking - 0.3, B.smoking + 0.6);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1 + lt * 0.04} y={40} shake={3 + smoke * 2} seed={2003}>
        <Stage overflow>
          <Forecourt id="rc" t={t} y={-150} dawn={0.55} />
          <rect x={-400} y={1000} width={1880} height={1100} fill="#3a3a40" />
          <path d="M-400,1000 L1480,1000 L1480,1300 L-400,1300 Z" fill={DAWN} opacity={0.12} />
          <Hand id="rc-h" x={560 + noise1(t * 9, 5) * smoke * 4} y={1300} rot={-8} scale={1.4} style={YOU_TURNING} pose={lerpPose(POSES.flat, POSES.claw, smoke * 0.5)} light={1} />
          <Smoke x={560} y={1140} t={t} a={smoke} w={180} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S03: he said your name. Your badge just says TRAINEE */
export const Badge: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.name;
  const push = prog(t, B.badge - 0.2, B.badge + 0.6, easeInOut);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1 + lt * 0.03 + push * 0.35} y={mix(0, 60, push)} shake={3} seed={2004}>
        <Stage>
          {bg('#1e3a5a')}
          {/* the uniform: a polo front, a placket, a breast pocket */}
          <rect x={-600} y={-800} width={2280} height={3200} fill="#1e3a5a" />
          <path d="M540,-200 V700" stroke="#16304c" strokeWidth={14} />
          {[300, 520].map((y) => <circle key={y} cx={540} cy={y} r={14} fill="#c8ccd4" opacity={0.6} />)}
          <path d="M620,820 H900 V1100 Q760,1130 620,1100 Z" fill="#1a3452" stroke="#14283e" strokeWidth={8} />
          <ellipse cx={540} cy={700} rx={700} ry={600} fill={DAWN} opacity={0.08} />
          {/* the badge */}
          <g transform="translate(760,800) rotate(-4)">
            <rect x={-170} y={-70} width={340} height={140} rx={16} fill="#eef0f4" />
            <rect x={-170} y={-70} width={340} height={44} rx={16} fill="#c4161c" />
            <rect x={-170} y={-40} width={340} height={14} fill="#c4161c" />
            <text x={0} y={-38} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontWeight={700} fontSize={26} fill="#fff">FUEL & GO</text>
            <text x={0} y={42} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontWeight={700} fontSize={52} fill="#1a1e24" letterSpacing={4}>TRAINEE</text>
          </g>
          <ellipse cx={760} cy={800} rx={260} ry={180} fill="#fff" opacity={0.05} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S04: fourteen minutes to sunrise; the sky over the forecourt is already paling. He sounds bored */
export const Sky: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.sunrise;
  const dawn = mix(0.65, 0.9, prog(t, B.sunrise, B.stock));
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1 + lt * 0.03} y={-80} shake={3} seed={2005}>
        <Stage overflow>
          <Forecourt id="sk" t={t} y={260} dawn={dawn} />
          <rect x={-400} y={-600} width={1880} height={200} fill="#22262c" />
          <rect x={-400} y={1300} width={1880} height={800} fill="#22262c" />
          <rect x={-400} y={-600} width={1880} height={2700} fill="#9fb4cf" opacity={0.05} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** The shop seen down the centre aisle: shelves both sides, the STAFF ONLY door at the end. light 0..1 brings the sun in. */
const Aisle: React.FC<{t: number; light?: number; door?: number}> = ({t, light = 0, door = 0}) => {
  const r = rng(31);
  const shelf = (side: number) => (
    <g>
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 520 + i * 230;
        const xNear = side < 0 ? -200 : 1280, xFar = side < 0 ? 400 : 680;
        return (
          <g key={i}>
            <path d={`M${xNear},${y + i * 40 - 200} L${xFar},${560 + i * 70} L${xFar},${590 + i * 70} L${xNear},${y + i * 40 - 140} Z`} fill="#3a3e46" />
            {Array.from({length: 7}, (_, k) => {
              const u = k / 7, x = mix(xNear, xFar, u + 0.05), yy = mix(y + i * 40 - 200, 560 + i * 70, u + 0.05);
              const h = mix(110, 26, u), w = mix(70, 18, u);
              return <rect key={k} x={x - w / 2} y={yy - h} width={w} height={h} fill={['#c4161c', '#e8b030', '#3a6ab0', '#2a8a5a'][Math.floor(r() * 4)]} opacity={0.7} />;
            })}
          </g>
        );
      })}
    </g>
  );
  return (
    <g>
      {bg('#14171c')}
      {/* the floor running back to the stockroom door */}
      <path d="M-400,2100 L400,720 L680,720 L1480,2100 Z" fill="#2a2e34" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${-400 + i * 0},${2100 - i * 0} L400,720`} stroke="none" />)}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const y = 720 + Math.pow(i / 8, 1.8) * 1380;
        return <path key={i} d={`M${mix(400, -400, (y - 720) / 1380)},${y} L${mix(680, 1480, (y - 720) / 1380)},${y}`} stroke="#1e2228" strokeWidth={4} />;
      })}
      {/* the back wall and the door */}
      <rect x={380} y={300} width={320} height={420} fill="#2a2e34" />
      <rect x={455} y={400} width={170} height={320} fill="#1a1c20" stroke="#0e1014" strokeWidth={8} />
      <rect x={470} y={430} width={140} height={34} fill="#c4161c" />
      <text x={540} y={455} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontWeight={700} fontSize={20} fill="#fff">STAFF ONLY</text>
      <circle cx={605} cy={580} r={7} fill="#8a8e96" />
      {door > 0 && <rect x={455} y={400} width={170 * door} height={320} fill="#000" />}
      {shelf(-1)}
      {shelf(1)}
      {/* strip lights */}
      <path d="M500,120 L580,120 M470,40 L610,40" stroke="#e8f0f4" strokeWidth={10} opacity={0.7} />
      {/* the sun from the front windows, spreading down the aisle */}
      {light > 0 && <path d={`M-400,2100 L${mix(-400, 300, light)},${mix(2100, 900, light)} L${mix(1480, 780, light)},${mix(2100, 900, light)} L1480,2100 Z`} fill={DAWN} opacity={0.22} />}
    </g>
  );
};

/* S05: the stockroom has no windows. Stay in the shadows. Down the aisle to STAFF ONLY */
export const Stockroom: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.stock;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.05 + lt * 0.06} y={-60} shake={3} seed={2006}>
        <Stage overflow>
          <Aisle t={t} light={prog(t, B.shadows, B.crawl) * 0.3} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S06: the sun crawling across the floor, aisle by aisle; you crawl in the shelf shadows. A fingertip strays and smokes */
export const Crawl: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.crawl;
  const sun = prog(t, B.crawl, B.van, easeInOut);
  const crawl = prog(t, B.crawl, B.van);
  const stray = prog(t, B.aisle - 0.1, B.aisle + 0.3, easeOut) * (1 - prog(t, B.aisle + 0.6, B.aisle + 0.9));
  const burn = prog(t, B.aisle + 0.1, B.aisle + 0.5);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.1} y={mix(80, -60, crawl)} shake={3 + stray * 3} seed={2007}>
        <Stage overflow>
          {/* the shop floor from above: tiles */}
          {bg('#2a2e34')}
          {Array.from({length: 18}, (_, i) => <path key={`h${i}`} d={`M-400,${-200 + i * 140} H1480`} stroke="#1e2228" strokeWidth={5} />)}
          {Array.from({length: 14}, (_, i) => <path key={`v${i}`} d={`M${-400 + i * 140},-600 V2200`} stroke="#1e2228" strokeWidth={5} />)}
          {/* shelf bases down both sides */}
          <rect x={-400} y={-600} width={520} height={2800} fill="#3a3e46" />
          <rect x={960} y={-600} width={520} height={2800} fill="#3a3e46" />
          {/* sunlight slats from the windows on the right, sliding left across the floor */}
          {[0, 1, 2, 3].map((i) => {
            const x = mix(1500, 360, sun) + i * 210;
            return <path key={i} d={`M${x},-600 L${x + 120},-600 L${x - 40},2200 L${x - 160},2200 Z`} fill={DAWN} opacity={0.28} />;
          })}
          {/* the strip of shadow you keep to, along the left shelves */}
          <rect x={120} y={-600} width={200} height={2800} fill="#000" opacity={0.35} />
          {/* your hands crawling up the shadow */}
          <Hand id="cr-l" x={200} y={mix(1700, 1300, crawl) + Math.sin(lt * 5) * 30} rot={-5} scale={1.1} style={YOU_TURNING} pose={POSES.flat} light={0.6} mirror />
          <Hand id="cr-r" x={330 + stray * 160} y={mix(1500, 1100, crawl) - Math.sin(lt * 5) * 30} rot={10 + stray * 25} scale={1.1} style={YOU_TURNING} pose={lerpPose(POSES.flat, POSES.claw, burn)} light={0.6} />
          <Smoke x={330 + stray * 160 + 40} y={mix(1500, 1100, crawl) - 260} t={t} a={burn * (1 - prog(t, B.aisle + 1.2, B.van))} w={120} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/* S07-08: headlights; Dave, the day manager, early. He bangs on the glass and wants to come in */
export const Dave: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.van;
  const lights = prog(t, B.van + 0.1, B.van + 1.0, easeOut) * (1 - prog(t, B.dave + 0.8, B.early));
  const walk = prog(t, B.dave, B.bang, easeInOut);
  const bangs = [0.15, 0.55, 0.95, 1.6, 2.0].map((d) => B.bang + d);
  const hit = bangs.reduce((m, b) => m + Math.exp(-Math.abs(t - b) * 22), 0);
  if (t < B.bang) {
    return (
      <AbsoluteFill>
        <Camera t={t} zoom={1.0 + lt * 0.03} y={60} shake={3} seed={2008}>
          <Stage>
            <ShopDoors id="dv" t={t} dawn={0.7} outside={
              <g>
                {/* the van pulling onto the forecourt, its headlights in the glass */}
                <rect x={-200} y={1100} width={600} height={280} rx={30} fill="#d8dce2" opacity={0.85} />
                <circle cx={340} cy={1290} r={40} fill="#fff8d8" opacity={0.6 + lights * 0.4} />
                <ellipse cx={420} cy={1290} rx={400 * lights} ry={140 * lights} fill="#fff8d8" opacity={0.3 * lights} />
                <Watcher id="dv-w" t={t} x={mix(300, 540, walk)} y={1470} s={0.6} bothArms noTorch rim={DAWN} rimA={0.9} />
              </g>
            } />
          </Stage>
        </Camera>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.3 + (t - B.bang) * 0.04} y={-40} shake={3 + hit * 6} seed={2009}>
        <Stage>
          <ShopDoors id="dv2" t={t} dawn={0.8} outside={
            <g>
              <Watcher id="dv2-w" t={t} x={540} y={1470} s={0.75} bothArms noTorch rim={DAWN} rimA={1} />
              {/* his palm flat on the other side of the glass, slapping it */}
              <Hand id="dv-palm" x={450 + hit * 6} y={1220 - hit * 10} rot={-6} scale={1.15 - hit * 0.04} style={DAVE} pose={POSES.flat} light={1} />
            </g>
          } />
          <rect x={-400} y={-600} width={1880} height={2700} fill="#9fb4cf" opacity={0.06} />
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};

/** The stockroom in the dark: crates and shelving, a blade of dawn under and beside the door, the phone's glow. */
const DarkRoom: React.FC<{t: number; glow?: number; blade?: number; children?: React.ReactNode}> = ({t, glow = 0.6, blade = 1, children}) => (
  <g>
    {bg('#050608')}
    {/* the door, ajar on the right: a blade of light down its edge and under it */}
    <rect x={930} y={200} width={26} height={1400} fill={DAWN} opacity={0.75 * blade} />
    <Glow id={`dr-blade-${Math.round(blade * 100)}`} cx={940} cy={900} rx={260} ry={800} color={DAWN} a={0.12 * blade} />
    <path d="M950,1600 L1480,1700 L1480,1760 L950,1620 Z" fill={DAWN} opacity={0.18 * blade} />
    {/* crates stacked against the back */}
    {[[80, 900, 380, 300], [120, 600, 300, 300], [520, 1050, 340, 260], [-200, 1150, 300, 320]].map(([x, y, w, h], i) => (
      <g key={i}>
        <rect x={x} y={y} width={w} height={h} fill="#241d16" stroke="#0a0806" strokeWidth={8} />
        <path d={`M${x},${y} L${x + w},${y + h} M${x + w},${y} L${x},${y + h}`} stroke="#0a0806" strokeWidth={10} />
        <path d={`M${x},${y} H${x + w}`} stroke={DAWN} strokeOpacity={0.08 * blade} strokeWidth={4} />
      </g>
    ))}
    <Glow id={`dr-glow-${Math.round(glow * 100)}`} cx={560} cy={1400} rx={700} ry={620} color="#9fd0ff" a={0.16 * glow} />
    {children}
  </g>
);

/* S09: from the stockroom you can hear his heartbeat */
export const Heartbeat: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.heart;
  const beat = t > B.hear ? Math.max(0, Math.sin((t - B.hear) * Math.PI * 2.4)) ** 6 : 0;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.15 + lt * 0.05 + beat * 0.02} x={180} y={-40} shake={3} seed={2010}>
        <Stage overflow>
          <DarkRoom t={t} glow={0.8}>
            {/* Dave's shadow passing the gap */}
            <rect x={930} y={300 + Math.sin(t * 2) * 30} width={20} height={400} fill="#000" opacity={0.6} />
          </DarkRoom>
        </Stage>
      </Camera>
      <AbsoluteFill style={{boxShadow: `inset 0 0 ${220 + beat * 160}px rgba(140,10,16,${0.2 + beat * 0.4})`}} />
    </AbsoluteFill>
  );
};

/* S10: through the phone he offers everything, every rule, for a price; then: invite me into your home */
export const Offer: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.offer;
  const price = prog(t, B.price, B.price + 0.4);
  const voice = t > B.invite && t < B.inviteEnd + 0.5 ? 0.5 + 0.5 * Math.abs(Math.sin(t * 22)) : 0;
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={1.15 + lt * 0.035} y={-30} shake={3} seed={2011}>
        <Stage>
          <DarkRoom t={t} glow={1} blade={0.6}>
            <Phone id="of-ph" t={t} x={330} y={420} s={1} rot={4} from="" clock="" msgs={[]} skin={YOU_TURNING.skin} shade={YOU_TURNING.shade} nail="#8a8088" sleeve={YOU.sleeve} screen={<CallScreen t={t} />} />
            {/* his voice in the speaker */}
            {voice > 0 && [0, 1, 2].map((i) => <circle key={i} cx={540} cy={460} r={60 + i * 50 + voice * 20} fill="none" stroke="#c4161c" strokeOpacity={0.25 - i * 0.07} strokeWidth={6} />)}
          </DarkRoom>
        </Stage>
      </Camera>
      <AbsoluteFill style={{boxShadow: `inset 0 0 260px rgba(140,10,16,${0.15 + price * 0.25})`}} />
    </AbsoluteFill>
  );
};

/* S11-12: his voice twice: on the phone, and behind you. Two eyes open behind the crates. The invitation doesn't expire */
export const Behind: React.FC<{t: number}> = ({t}) => {
  const lt = t - B.twice;
  const turn = prog(t, B.behind - 0.25, B.behind + 0.35, easeInOut);
  const open = prog(t, B.behind + 0.1, B.behind + 0.5, easeOut);
  const push = prog(t, B.behind + 0.4, B.cut, easeIn);
  const glint = Math.max(0, 1 - Math.abs(t - (B.expire + 0.6)) / 0.12);
  return (
    <AbsoluteFill>
      <Camera t={t} zoom={mix(1.15, 1.3, turn) + push * 1.2} x={mix(0, -15, turn)} y={mix(0, -200, turn) - push * 20} shake={3 + turn * 2} seed={2012}>
        <Stage overflow>
          <DarkRoom t={t} glow={1 - turn * 0.4} blade={0.4}>
            {/* the phone, held low, lighting the dark behind the crates */}
            {turn < 0.95 && <g opacity={1 - turn}><Phone id="bh-ph" t={t} x={420} y={1150} s={0.7} rot={-8} from="" clock="" msgs={[]} skin={YOU_TURNING.skin} shade={YOU_TURNING.shade} nail="#8a8088" sleeve={YOU.sleeve} screen={<CallScreen t={t} dim={0.3} />} /></g>}
            {/* the gap between the crate stacks, darker than anything else in the room */}
            <rect x={470} y={640} width={110} height={440} fill="#000" />
            <Glow id="bh-eyes-glow" cx={525} cy={760} rx={240} ry={200} color="#9fd0ff" a={0.05 + turn * 0.05} />
            {/* the eyes, behind the crates */}
            <g opacity={open}>
              <Eyes x={525} y={740} s={1.5} gap={48} glow="#d8d2c4" blink={1 - open} pupil={6} />
            </g>
            {/* one glint: an old staff badge under his coat */}
            <g transform="translate(545,850) rotate(-6) scale(0.7)" opacity={0.2 + glint * 0.8}>
              <rect x={-38} y={-14} width={76} height={28} rx={4} fill="#3a3c42" />
              <rect x={-38} y={-14} width={76} height={9} rx={3} fill="#5a1a1c" />
              <path d="M-30,6 H30" stroke="#8a8e96" strokeWidth={4} />
            </g>
            <ellipse cx={545} cy={850} rx={22} ry={10} fill="#fff" opacity={glint * 0.6} />
          </DarkRoom>
        </Stage>
      </Camera>
    </AbsoluteFill>
  );
};
