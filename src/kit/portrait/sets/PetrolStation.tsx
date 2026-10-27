import React from 'react';
import {lerpColor, noise1, rng} from '../../common/util';

/* A 24-hour petrol station at night: the shop floor facing the glass doors, the forecourt beyond with its canopy and
   numbered pumps, and the counter (till, CCTV monitor). dawn 0..1 greys the sky for the end of the shift. */

const STRIP = '#e8f0f4';

/** Flickering fluorescent strip light value. */
export const stripFlicker = (t: number) => (noise1(t * 3, 7) > 0.92 ? 0.6 : 1) * (0.95 + noise1(t * 30, 2) * 0.05);

/** The forecourt seen through glass: sky, canopy with lights, pumps numbered 1–4, a dark road. */
export const Forecourt: React.FC<{id: string; t: number; dawn?: number; x?: number; y?: number; s?: number; children?: React.ReactNode}> = ({id, t, dawn = 0, x = 0, y = 0, s = 1, children}) => {
  const sky0 = lerpColor('#04060c', '#3a4558', dawn);
  const sky1 = lerpColor('#0c1424', '#c89a7a', dawn);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky0} />
          <stop offset="1" stopColor={sky1} />
        </linearGradient>
      </defs>
      <rect x={-400} y={0} width={1880} height={900} fill={`url(#${id}-sky)`} />
      {/* far hedge and road */}
      <rect x={-400} y={820} width={1880} height={80} fill={lerpColor('#05070a', '#2a2a2e', dawn)} />
      <rect x={-400} y={900} width={1880} height={900} fill={lerpColor('#101318', '#3a3c42', dawn)} />
      {/* canopy */}
      <rect x={-300} y={380} width={1680} height={70} fill="#1e2a3a" />
      <rect x={-300} y={380} width={1680} height={16} fill="#c4161c" />
      {[-100, 220, 540, 860, 1180].map((lx) => (
        <g key={lx}>
          <rect x={lx - 60} y={450} width={120} height={14} fill={STRIP} opacity={0.95 * (1 - dawn * 0.5)} />
          <path d={`M${lx - 60},464 L${lx - 260},1100 L${lx + 260},1100 L${lx + 60},464 Z`} fill={STRIP} opacity={0.05 * (1 - dawn)} />
        </g>
      ))}
      {[40, 1040].map((px) => (
        <rect key={px} x={px - 16} y={464} width={32} height={500} fill="#2a3444" />
      ))}
      {/* pumps */}
      {[1, 2, 3, 4].map((n, i) => {
        const px = 120 + i * 280;
        return (
          <g key={n}>
            <rect x={px - 50} y={780} width={100} height={180} rx={8} fill="#d8dce2" />
            <rect x={px - 40} y={800} width={80} height={46} fill="#1a2a1a" />
            <text x={px} y={834} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={26} fontWeight={700} fill="#7af07a">{(12.5 + i * 3.1).toFixed(2)}</text>
            <circle cx={px} cy={890} r={24} fill="#c4161c" />
            <text x={px} y={900} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={28} fontWeight={700} fill="#fff">{n}</text>
            <path d={`M${px + 50},860 C${px + 90},860 ${px + 90},930 ${px + 70},960`} stroke="#14161a" strokeWidth={8} fill="none" />
          </g>
        );
      })}
      <rect x={-400} y={960} width={1880} height={20} fill="#e8e0b0" opacity={0.15} />
      {children}
    </g>
  );
};

/** Inside the shop, facing the double glass doors. open 0..1 slides the doors apart; sensor 0..1 = its red LED. */
export const ShopDoors: React.FC<{id: string; t: number; open?: number; sensor?: number; dawn?: number; outside?: React.ReactNode; children?: React.ReactNode}> = ({
  id,
  t,
  open = 0,
  sensor = 1,
  dawn = 0,
  outside,
  children,
}) => {
  const fl = stripFlicker(t);
  const r = rng(12);
  const D = {x: 290, y: 520, w: 500, h: 960};
  const slide = open * (D.w / 2 - 10);
  return (
    <g>
      {/* the forecourt beyond the glass */}
      <Forecourt id={`${id}-fc`} t={t} dawn={dawn} y={-100} />
      {outside}
      {/* shop walls either side of the doorway, shelves of snacks */}
      <rect x={-400} y={-600} width={690} height={2700} fill="#d8dcd4" opacity={0.1} />
      <rect x={-400} y={-600} width={690} height={2700} fill="#22262c" />
      <rect x={790} y={-600} width={690} height={2700} fill="#22262c" />
      {[[-380, 200], [820, 200]].map(([sx], k) => (
        <g key={k}>
          {Array.from({length: 5}, (_, row) => (
            <g key={row}>
              <rect x={sx} y={420 + row * 210} width={640} height={14} fill="#8a9098" />
              {Array.from({length: 12}, (_, c) => (
                <rect key={c} x={sx + 10 + c * 52} y={420 + row * 210 - 70 - r() * 30} width={44} height={70 + r() * 30} fill={['#c4161c', '#e8b030', '#2a6ab0', '#3a8a3a', '#d8d0c4'][Math.floor(r() * 5)]} opacity={0.75} />
              ))}
            </g>
          ))}
        </g>
      ))}
      {/* door frame and the two glass leaves */}
      <rect x={D.x - 30} y={D.y - 60} width={D.w + 60} height={60} fill="#3a4250" />
      <rect x={D.x - 30} y={D.y} width={30} height={D.h} fill="#3a4250" />
      <rect x={D.x + D.w} y={D.y} width={30} height={D.h} fill="#3a4250" />
      {[0, 1].map((k) => {
        const lx = k === 0 ? D.x - slide : D.x + D.w / 2 + slide;
        return (
          <g key={k}>
            <rect x={lx} y={D.y} width={D.w / 2} height={D.h} fill="#9fb4cf" opacity={0.08} />
            <rect x={lx} y={D.y} width={D.w / 2} height={D.h} fill="none" stroke="#5a6270" strokeWidth={10} />
            <path d={`M${lx + 30},${D.y + 40} L${lx + 90},${D.y + 200}`} stroke="#fff" strokeOpacity={0.15} strokeWidth={6} />
            <rect x={lx + (k === 0 ? D.w / 2 - 30 : 14)} y={D.y + 440} width={16} height={120} rx={6} fill="#8a9098" />
          </g>
        );
      })}
      {/* the sensor above the door, its LED */}
      <rect x={D.x + D.w / 2 - 50} y={D.y - 110} width={100} height={40} rx={8} fill="#14161a" />
      <circle cx={D.x + D.w / 2 + 30} cy={D.y - 90} r={7} fill={sensor > 0.5 ? '#ff2a2a' : '#2aff6a'} />
      <circle cx={D.x + D.w / 2 + 30} cy={D.y - 90} r={18} fill={sensor > 0.5 ? '#ff2a2a' : '#2aff6a'} opacity={0.25} />
      {/* strip lights and the shiny floor */}
      {[-200, 200, 600, 1000].map((lx) => (
        <rect key={lx} x={lx} y={-80} width={220} height={18} fill={STRIP} opacity={fl} />
      ))}
      <rect x={-400} y={D.y + D.h} width={1880} height={800} fill="#2a2e34" />
      {Array.from({length: 8}, (_, i) => (
        <path key={i} d={`M${-400 + i * 260},${D.y + D.h} L${-700 + i * 330},2100`} stroke="#000" strokeOpacity={0.25} strokeWidth={3} />
      ))}
      <ellipse cx={540} cy={D.y + D.h + 120} rx={500} ry={60} fill={STRIP} opacity={0.05 * fl} />
      <rect x={-400} y={-600} width={1880} height={2700} fill="#d8e8f0" opacity={0.03 * fl} />
      {children}
    </g>
  );
};
export const DOORS = {x: 290, y: 520, w: 500, h: 960};

/** The counter from behind it: worktop, till, card machine, a scratch-card rack, the CCTV monitor up on the left. */
export const Counter: React.FC<{t: number; cctv?: React.ReactNode; children?: React.ReactNode}> = ({t, cctv, children}) => {
  const fl = stripFlicker(t);
  return (
    <g>
      <rect x={-400} y={-600} width={1880} height={2700} fill="#1a1e24" />
      {/* the shop beyond the counter, dim */}
      <rect x={-400} y={200} width={1880} height={700} fill="#2a2e36" />
      {Array.from({length: 3}, (_, row) => (
        <rect key={row} x={-400} y={360 + row * 180} width={1880} height={12} fill="#6a7078" />
      ))}
      <rect x={-200} y={-80} width={260} height={18} fill={STRIP} opacity={fl} />
      <rect x={700} y={-80} width={260} height={18} fill={STRIP} opacity={fl} />
      {/* CCTV monitor */}
      <g transform="translate(60,120)">
        <rect x={0} y={0} width={340} height={250} rx={10} fill="#0e1014" />
        <rect x={14} y={14} width={312} height={222} fill="#0a140e" />
        <g transform="translate(14,14)">{cctv}</g>
        <text x={24} y={40} fontFamily="Courier New, monospace" fontSize={18} fill="#9aff9a" opacity={0.8}>CAM 2  02:47:13</text>
        {Array.from({length: 28}, (_, i) => (
          <rect key={i} x={14} y={14 + i * 8} width={312} height={2} fill="#000" opacity={0.25} />
        ))}
      </g>
      {/* worktop */}
      <path d="M-400,1000 L1480,1000 L1480,2100 L-400,2100 Z" fill="#3a3a40" />
      <path d="M-400,1000 L1480,1000" stroke={STRIP} strokeOpacity={0.35 * fl} strokeWidth={4} />
      <rect x={-400} y={1000} width={1880} height={30} fill="#4a4a52" />
      {/* till */}
      <g transform="translate(820,780)">
        <rect x={-120} y={0} width={240} height={160} rx={10} fill="#d8dce2" />
        <rect x={-100} y={20} width={200} height={90} fill="#0a1a2a" />
        <text x={0} y={76} textAnchor="middle" fontFamily="Courier New, monospace" fontSize={30} fill="#7ad0ff">£1.20</text>
        <rect x={-140} y={160} width={280} height={60} fill="#b8bcc2" />
      </g>
      {children}
    </g>
  );
};

/** A thermal till receipt with a handwritten note at the bottom. */
export const Receipt: React.FC<{x: number; y: number; s?: number; rot?: number; note: string; number: string; reveal?: number}> = ({x, y, s = 1, rot = 0, note, number, reveal = 1}) => {
  const f = 'Courier New, monospace';
  const lines = ['NIGHT & DAY FUEL', 'STORE 0413', '', 'RICE 1KG        1.20', '', 'TOTAL           1.20', 'CASH            1.20', '', '02:47   THANK YOU'];
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <path d="M-200,-400 L200,-400 L200,400 L180,416 L160,400 L140,416 L120,400 L100,416 L80,400 L60,416 L40,400 L20,416 L0,400 L-20,416 L-40,400 L-60,416 L-80,400 L-100,416 L-120,400 L-140,416 L-160,400 L-180,416 L-200,400 Z" fill="#ecebe6" />
      {lines.map((l, i) => (
        <text key={i} x={-170} y={-340 + i * 44} fontFamily={f} fontSize={28} fill="#3a3a40" style={{whiteSpace: 'pre'}}>
          {l}
        </text>
      ))}
      <g opacity={reveal}>
        <text x={-160} y={150} fontFamily="CountCaption, serif" fontStyle="italic" fontWeight={600} fontSize={52} fill="#5a0a10" transform="rotate(-4,-160,150)">
          {note}
        </text>
        <text x={-160} y={240} fontFamily="CountCaption, serif" fontStyle="italic" fontWeight={600} fontSize={50} fill="#5a0a10" transform="rotate(-3,-160,240)">
          {number}
        </text>
      </g>
    </g>
  );
};

/** An old copper coin face-up, with a legible date. */
export const OldCoin: React.FC<{x: number; y: number; s?: number; date: string; lit?: number}> = ({x, y, s = 1, date, lit = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={80} fill="#7a4a24" />
    <circle r={80} fill="none" stroke="#c8884a" strokeOpacity={0.7 * lit} strokeWidth={6} />
    <circle r={66} fill="none" stroke="#4a2a14" strokeWidth={3} />
    <path d="M-30,-20 C-30,-50 30,-50 30,-20 C30,10 10,20 0,30 C-10,20 -30,10 -30,-20 Z" fill="#5a3418" />
    <text x={0} y={58} textAnchor="middle" fontFamily="CountCaption, serif" fontWeight={600} fontSize={28} fill="#e8b878">{date}</text>
  </g>
);

/** A coffee machine with a cup under the spout, steaming. */
export const CoffeeMachine: React.FC<{x: number; y: number; s?: number; t: number}> = ({x, y, s = 1, t}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-200} y={-500} width={400} height={600} rx={20} fill="#1a1c22" />
    <rect x={-170} y={-470} width={340} height={120} rx={10} fill="#2a2e36" />
    <text x={0} y={-400} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={34} fontWeight={700} fill="#e8b030">HOT DRINKS</text>
    <rect x={-60} y={-260} width={120} height={60} fill="#3a3e46" />
    <rect x={-80} y={-60} width={160} height={20} fill="#3a3e46" />
    <path d="M-50,-180 L50,-180 L40,-60 L-40,-60 Z" fill="#e8e0d4" />
    <rect x={-50} y={-188} width={100} height={14} fill="#8a3a1a" />
    <g style={{filter: 'blur(4px)'}}>
      {[0, 1, 2].map((k) => {
        const life = ((t * 0.8 + k * 0.33) % 1);
        return <path key={k} d={`M${-10 + k * 10},-200 C${-30 + noise1(t + k, k) * 40},-260 ${20},-300 ${noise1(t * 1.2 + k, 9 + k) * 30},${-320 - life * 80}`} stroke="#d8d8d8" strokeOpacity={0.4 * (1 - life)} strokeWidth={10} fill="none" />;
      })}
    </g>
  </g>
);
