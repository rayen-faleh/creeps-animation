import {Easing, interpolate} from 'remotion';

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const sec = (s: number) => Math.round(s * FPS);

/** Seeded PRNG (mulberry32). */
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Smooth deterministic 1D noise in [-1,1] from summed incommensurate sines. */
export const noise1 = (t: number, seed = 0) =>
  (Math.sin(t * 1.13 + seed * 12.9) * 0.5 +
    Math.sin(t * 2.71 + seed * 4.1) * 0.3 +
    Math.sin(t * 5.37 + seed * 7.7) * 0.2);

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const C = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

/** Eased 0..1 progress between two times in seconds, given a time t in seconds. */
export const prog = (
  t: number,
  a: number,
  b: number,
  ease: (x: number) => number = Easing.bezier(0.45, 0, 0.2, 1),
) => interpolate(t, [a, b], [0, 1], {...C, easing: ease});

export const lin = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], C);

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Multi-key track with per-segment easing (times in seconds). */
export const track = (
  t: number,
  keys: Array<[number, number]>,
  ease: (x: number) => number = easeInOut,
) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1];
      const [t1, v1] = keys[i];
      return mix(v0, v1, ease((t - t0) / (t1 - t0)));
    }
  }
  return keys[keys.length - 1][1];
};

/** Hex color lerp. */
export const lerpColor = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (p: number, s: number) => (p >> s) & 255;
  const r = Math.round(mix(ch(pa, 16), ch(pb, 16), t));
  const g = Math.round(mix(ch(pa, 8), ch(pb, 8), t));
  const bl = Math.round(mix(ch(pa, 0), ch(pb, 0), t));
  return `#${((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1)}`;
};
