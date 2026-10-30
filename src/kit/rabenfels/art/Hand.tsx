import React from 'react';
import {theme} from '../theme';

/**
 * Articulated hand seen from the back (dorsal view), wrist at (0,0), fingers toward -y.
 * Finger curl is faked by foreshortening: projected segment length = L * cos(cumulative curl).
 */
export type HandStyle = {
  skin: string;
  shade: string;
  rim: string;
  nail: string;
  nailLen: number; // px beyond fingertip (vampire claws ~ 26)
  thin: number; // 1 = normal, <1 bonier
  fingerLen?: number;
  veins?: boolean;
  wrinkles?: boolean;
  sleeve?: string;
  sleeveLen?: number;
  cuff?: string;
};

const BASE_STYLES: Record<'vamp' | 'adult' | 'gran' | 'child', HandStyle> = {
  vamp: {
    skin: theme.vampSkin,
    shade: theme.vampSkinShade,
    rim: '#c9d4e2',
    nail: '#0c0d10',
    nailLen: 30,
    thin: 0.82,
    fingerLen: 1.2,
    veins: true,
    sleeve: '#0b0c10',
    sleeveLen: 520,
    cuff: '#1a1c22',
  },
  adult: {
    skin: theme.adultSkin,
    shade: '#4c3a31',
    rim: '#c5d2e4',
    nail: '#d8c0b0',
    nailLen: 2,
    thin: 1,
    sleeve: '#15171c',
    sleeveLen: 520,
    cuff: '#22252c',
  },
  gran: {
    skin: theme.granSkin,
    shade: theme.granSkinShade,
    rim: '#ffd3a0',
    nail: '#e8cdb8',
    nailLen: 3,
    thin: 0.88,
    wrinkles: true,
    veins: true,
    sleeve: '#3a1f19',
    sleeveLen: 460,
    cuff: '#4e2a20',
  },
  child: {
    skin: theme.childSkin,
    shade: '#7a4e3a',
    rim: '#f1c9a0',
    nail: '#f2d7c6',
    nailLen: 1,
    thin: 1.05,
    sleeve: '#2b3448',
    sleeveLen: 300,
    cuff: '#3a4560',
  },
};

/**
 * Hand looks. creature = grey, long black claws, veins (alias vamp). adult = ordinary man, dark sleeve.
 * elder = old woman, wrinkles, burgundy sleeve (alias gran). child = small, blue pyjama sleeve.
 * Make a new look by spreading one: {...STYLES.adult, skin: '#...', sleeve: '#...'}.
 */
export const STYLES = {
  ...BASE_STYLES,
  creature: BASE_STYLES.vamp,
  elder: BASE_STYLES.gran,
};

type Pt = [number, number];
const FINGERS = [
  // base x, base y, splay (deg), segment lengths, width
  {bx: -40, by: -118, splay: -9, segs: [50, 31, 24], w: 25}, // index
  {bx: -13, by: -126, splay: -2, segs: [55, 35, 26], w: 26}, // middle
  {bx: 14, by: -122, splay: 5, segs: [51, 32, 24], w: 24}, // ring
  {bx: 39, by: -108, splay: 13, segs: [40, 25, 21], w: 21}, // pinky
];

export type HandPose = {
  curls: [number, number, number, number, number]; // thumb, index, middle, ring, pinky (radians, 0 = straight)
  spread?: number; // multiplies splay
  thumbOut?: number; // radians extra thumb abduction
};

const outline = (pts: Pt[], widths: number[]) => {
  const L: Pt[] = [];
  const R: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    let dx = b[0] - a[0];
    let dy = b[1] - a[1];
    const n = Math.hypot(dx, dy) || 1;
    dx /= n;
    dy /= n;
    const hw = widths[i] / 2;
    L.push([pts[i][0] + dy * hw, pts[i][1] - dx * hw]);
    R.push([pts[i][0] - dy * hw, pts[i][1] + dx * hw]);
  }
  const last = pts.length - 1;
  const tipR = widths[last] / 2;
  let d = `M${R[0][0]},${R[0][1]} L${L[0][0]},${L[0][1]}`;
  for (let i = 1; i <= last; i++) d += ` L${L[i][0]},${L[i][1]}`;
  d += ` A${tipR},${tipR} 0 0 1 ${R[last][0]},${R[last][1]}`;
  for (let i = last - 1; i >= 0; i--) d += ` L${R[i][0]},${R[i][1]}`;
  return {d: d + ' Z', L, R};
};

const seg = (p: Pt, ang: number, len: number): Pt => [p[0] + Math.sin(ang) * len, p[1] - Math.cos(ang) * len];

export const Hand: React.FC<{
  x: number;
  y: number;
  rot?: number; // degrees, direction fingers point (0 = up)
  scale?: number;
  style: HandStyle;
  pose: HandPose;
  mirror?: boolean; // left hand
  light?: number; // 0..1 rim light strength
  id: string;
  showSleeve?: boolean;
}> = ({x, y, rot = 0, scale = 1, style, pose, mirror = false, light = 1, id, showSleeve = true}) => {
  const k = style.thin;
  const spread = pose.spread ?? 1;
  const palm = `M${-40 * k},70 C${-44 * k},30 ${-62 * k},-10 ${-62 * k},-50 C${-62 * k},-90 ${-56 * k},-112 ${-48 * k},-122 C${-30 * k},-136 ${30 * k},-136 ${46 * k},-116
    C${58 * k},-90 ${60 * k},-50 ${54 * k},-14 C${48 * k},20 ${40 * k},40 ${38 * k},70 Z`;

  const fingerEls = FINGERS.map((f, i) => {
    const curl = pose.curls[i + 1];
    let p: Pt = [f.bx * k, f.by];
    const ang = (f.splay * spread * Math.PI) / 180;
    const pts: Pt[] = [p];
    let cum = 0;
    f.segs.forEach((L, j) => {
      cum += curl * (j === 0 ? 0.8 : 1.05);
      const proj = L * (style.fingerLen ?? 1) * Math.max(0.06, Math.cos(Math.min(cum, 1.5)));
      p = seg(p, ang, proj);
      pts.push(p);
    });
    const wBase = f.w * k;
    const tip = pts[pts.length - 1];
    const tipCurl = Math.min(cum, 1.5);
    const nailL = style.nailLen * Math.max(0.05, Math.cos(tipCurl));
    const nailTip = seg(tip, ang, nailL + 4);
    const nw = wBase * 0.42;
    const perp: Pt = [Math.cos(ang), Math.sin(ang)];
    const curledDark = Math.min(1, cum / 2.2);
    return (
      <g key={i}>
        {(() => {
          const widths = pts.map((_, j) => wBase * (1 - j * 0.11) * (j === 0 ? 1.08 : 1));
          const o = outline(pts, widths);
          const hl = o.L.map((q, j) => [q[0] + (pts[j][0] - q[0]) * 0.3, q[1] + (pts[j][1] - q[1]) * 0.3]);
          const sh = o.R.map((q, j) => [q[0] + (pts[j][0] - q[0]) * 0.25, q[1] + (pts[j][1] - q[1]) * 0.25]);
          return (
            <g>
              <path d={o.d} fill={style.shade} stroke={style.shade} strokeWidth={4} strokeLinejoin="round" />
              <path d={o.d} fill={style.skin} />
              <polyline points={sh.map((q) => q.join(',')).join(' ')} stroke={style.shade} strokeOpacity={0.7} strokeWidth={wBase * 0.28} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points={hl.map((q) => q.join(',')).join(' ')} stroke={style.rim} strokeOpacity={0.4 * light} strokeWidth={Math.max(1.5, wBase * 0.14)} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {pts.slice(1, -1).map((q, j) => (
                <ellipse key={j} cx={q[0]} cy={q[1]} rx={wBase * 0.34} ry={wBase * 0.2} fill={style.rim} opacity={(style.thin < 0.9 ? 0.22 : 0.1) * light} transform={`rotate(${(ang * 180) / Math.PI} ${q[0]} ${q[1]})`} />
              ))}
            </g>
          );
        })()}
        {/* knuckle creases */}
        {pts.slice(1, -1).map((q, j) => (
          <path
            key={j}
            d={`M${q[0] - perp[0] * wBase * 0.3},${q[1] - perp[1] * wBase * 0.3} q${-Math.sin(ang) * 4},${Math.cos(ang) * 4} ${perp[0] * wBase * 0.6},${perp[1] * wBase * 0.6}`}
            stroke={style.shade}
            strokeWidth={style.wrinkles ? 2.4 : 1.6}
            fill="none"
            opacity={0.8}
          />
        ))}
        {/* darkening when curled under */}
        <line
          x1={pts[1][0]}
          y1={pts[1][1]}
          x2={tip[0]}
          y2={tip[1]}
          stroke="#000"
          strokeOpacity={curledDark * 0.45}
          strokeWidth={wBase}
          strokeLinecap="round"
        />
        {/* nail */}
        <path
          d={`M${tip[0] - perp[0] * nw},${tip[1] - perp[1] * nw} Q${nailTip[0] - perp[0] * nw * 0.4},${nailTip[1] - perp[1] * nw * 0.4} ${nailTip[0]},${nailTip[1]} Q${nailTip[0] + perp[0] * nw * 0.4},${nailTip[1] + perp[1] * nw * 0.4} ${tip[0] + perp[0] * nw},${tip[1] + perp[1] * nw} Q${tip[0]},${tip[1] + 6} ${tip[0] - perp[0] * nw},${tip[1] - perp[1] * nw} Z`}
          fill={style.nail}
          stroke="#000"
          strokeOpacity={0.5}
          strokeWidth={1}
        />
        {style.nailLen > 10 && (
          <path
            d={`M${tip[0] - perp[0] * nw * 0.4},${tip[1] - perp[1] * nw * 0.4} L${nailTip[0]},${nailTip[1]}`}
            stroke={style.rim}
            strokeOpacity={0.5 * light}
            strokeWidth={1.4}
          />
        )}
      </g>
    );
  });

  // thumb from side of palm (left side for a right hand seen from back)
  const tc = pose.curls[0];
  const tAng = -0.62 - (pose.thumbOut ?? 0) + tc * 0.55;
  let tp: Pt = [-36 * k, -8];
  const tpts: Pt[] = [tp];
  [58, 36].forEach((L, j) => {
    tp = seg(tp, tAng + j * 0.25 + tc * 0.4, L * Math.max(0.2, Math.cos(tc * (j + 1) * 0.6)));
    tpts.push(tp);
  });
  const tperp: Pt = [Math.cos(tAng), Math.sin(tAng)];
  const tTip = tpts[2];
  const tNail = seg(tTip, tAng + 0.25, style.nailLen * 0.8 + 4);

  const tendon = FINGERS.map((f, i) => (
    <path
      key={i}
      d={`M${f.bx * k * 0.5},-10 Q${f.bx * k * 0.8},-60 ${f.bx * k},${f.by + 6}`}
      stroke={style.shade}
      strokeOpacity={0.5}
      strokeWidth={style.thin < 0.9 ? 3 : 2}
      fill="none"
    />
  ));

  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${mirror ? -scale : scale},${scale})`}>
      <defs>
        <linearGradient id={`${id}-palm`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={style.rim} stopOpacity={0.4 * light} />
          <stop offset="0.25" stopColor={style.skin} />
          <stop offset="1" stopColor={style.shade} />
        </linearGradient>
      </defs>
      {/* thumb, rooted inside the palm */}
      {(() => {
        const o = outline(tpts, [42 * k, 30 * k, 23 * k]);
        return (
          <g>
            <path d={o.d} fill={style.shade} stroke={style.shade} strokeWidth={4} strokeLinejoin="round" />
            <path d={o.d} fill={style.skin} />
            <path
              d={`M${tTip[0] - tperp[0] * 8},${tTip[1] - tperp[1] * 8} Q${tNail[0]},${tNail[1]} ${tTip[0] + tperp[0] * 8},${tTip[1] + tperp[1] * 8} Z`}
              fill={style.nail}
            />
          </g>
        );
      })()}
      <path d={palm} fill={style.shade} transform="translate(0,3) scale(1.03)" />
      <path d={palm} fill={`url(#${id}-palm)`} />
      {tendon}
      {style.veins && (
        <path
          d={`M${-20 * k},2 C${-26 * k},-30 ${-6 * k},-50 ${-18 * k},-82 M${-6 * k},-50 C${10 * k},-70 ${16 * k},-80 ${22 * k},-104 M${14 * k},4 C${18 * k},-26 ${30 * k},-46 ${34 * k},-70`}
          stroke={style.nailLen > 10 ? '#2b3550' : '#7a4f62'}
          strokeOpacity={style.nailLen > 10 ? 0.8 : 0.45}
          strokeWidth={3}
          fill="none"
        />
      )}
      {style.wrinkles && (
        <g stroke={style.shade} strokeOpacity={0.55} strokeWidth={1.4} fill="none">
          <path d="M-36,-96 q8,-4 16,0 M-10,-104 q8,-4 16,0 M18,-100 q8,-4 14,0" />
          <path d="M-30,-20 q20,6 40,-2 M-24,-8 q16,4 30,0" />
        </g>
      )}
      {/* knuckle bumps */}
      {FINGERS.map((f, i) => (
        <ellipse key={i} cx={f.bx * k} cy={f.by + 8} rx={f.w * k * 0.5} ry={7} fill={style.rim} opacity={0.12 * light} />
      ))}
      {fingerEls}
      {showSleeve && style.sleeve && (
        <g>
          <path
            d={`M${-80},60 C${-100},${style.sleeveLen! * 0.5} ${-110},${style.sleeveLen} ${-120},${style.sleeveLen! + 40} L${120},${style.sleeveLen! + 40} C${110},${style.sleeveLen} ${104},${style.sleeveLen! * 0.5} ${84},40 Z`}
            fill={style.sleeve}
          />
          <path d={`M${-84},54 Q0,78 ${86},54 L${86},82 Q0,106 ${-84},82 Z`} fill={style.cuff} />
          <path d={`M${-84},54 Q0,78 ${86},54`} stroke={style.rim} strokeOpacity={0.2 * light} strokeWidth={2} fill="none" />
        </g>
      )}
    </g>
  );
};

export const POSES = {
  flat: {curls: [0.1, 0.05, 0.05, 0.08, 0.1], spread: 1} as HandPose,
  relaxed: {curls: [0.3, 0.35, 0.4, 0.5, 0.55], spread: 0.9} as HandPose,
  point: {curls: [0.5, 0.0, 1.1, 1.2, 1.25], spread: 0.8} as HandPose,
  claw: {curls: [0.4, 0.7, 0.75, 0.8, 0.85], spread: 1.5} as HandPose,
  fist: {curls: [0.9, 1.45, 1.5, 1.5, 1.45], spread: 0.7} as HandPose,
  reach: {curls: [0.2, 0.15, 0.12, 0.2, 0.28], spread: 1.35, thumbOut: 0.2} as HandPose,
};

export const lerpPose = (a: HandPose, b: HandPose, t: number): HandPose => ({
  curls: a.curls.map((c, i) => c + (b.curls[i] - c) * t) as HandPose['curls'],
  spread: (a.spread ?? 1) + ((b.spread ?? 1) - (a.spread ?? 1)) * t,
  thumbOut: (a.thumbOut ?? 0) + ((b.thumbOut ?? 0) - (a.thumbOut ?? 0)) * t,
});

/** Local (pre-transform) position of the index nail tip for a given style/pose. */
export const indexTip = (style: HandStyle, pose: HandPose): [number, number] => {
  const k = style.thin;
  const f = FINGERS[0];
  const ang = (f.splay * (pose.spread ?? 1) * Math.PI) / 180;
  let p: [number, number] = [f.bx * k, f.by];
  let cum = 0;
  f.segs.forEach((L, j) => {
    cum += pose.curls[1] * (j === 0 ? 0.8 : 1.05);
    const proj = L * (style.fingerLen ?? 1) * Math.max(0.06, Math.cos(Math.min(cum, 1.5)));
    p = [p[0] + Math.sin(ang) * proj, p[1] - Math.cos(ang) * proj];
  });
  const nl = style.nailLen * Math.max(0.05, Math.cos(Math.min(cum, 1.5))) + 4;
  return [p[0] + Math.sin(ang) * nl, p[1] - Math.cos(ang) * nl];
};

/** World position of the wrist so that the index nail tip lands on (tx, ty). */
export const wristFor = (tx: number, ty: number, rotDeg: number, scale: number, style: HandStyle, pose: HandPose, mirror = false): [number, number] => {
  const [lx0, ly] = indexTip(style, pose);
  const lx = mirror ? -lx0 : lx0;
  const a = (rotDeg * Math.PI) / 180;
  const wx = (lx * Math.cos(a) - ly * Math.sin(a)) * scale;
  const wy = (lx * Math.sin(a) + ly * Math.cos(a)) * scale;
  return [tx - wx, ty - wy];
};
