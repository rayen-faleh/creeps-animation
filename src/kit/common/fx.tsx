import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {noise1} from './util';
import {useFormat} from './format';

/** First-person camera: zoom/pan/roll around a focal point plus handheld drift. */
export const Camera: React.FC<{
  t: number;
  zoom?: number;
  x?: number; // world-space offset in px (positive moves view right)
  y?: number;
  rot?: number; // degrees
  shake?: number; // handheld amplitude px
  seed?: number;
  children: React.ReactNode;
}> = ({t, zoom = 1, x = 0, y = 0, rot = 0, shake = 6, seed = 1, children}) => {
  const hx = noise1(t * 0.9, seed) * shake;
  const hy = noise1(t * 0.75, seed + 3) * shake * 0.8;
  const hr = noise1(t * 0.6, seed + 9) * shake * 0.04;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transformOrigin: '50% 50%',
          transform: `scale(${zoom}) rotate(${rot + hr}deg) translate(${-x + hx}px, ${-y + hy}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{frame: number; opacity?: number}> = ({frame, opacity = 0.16}) => {
  const {W, H, textures} = useFormat();
  const i = Math.floor(frame / 2) % 8;
  const ox = ((frame * 37) % 7) * 10;
  return (
    <AbsoluteFill style={{mixBlendMode: 'overlay', opacity, pointerEvents: 'none'}}>
      <Img
        src={staticFile(`${textures}/grain${i}.png`)}
        style={{width: W + 80, height: H + 80, marginLeft: -ox, marginTop: -ox * 0.6, imageRendering: 'auto'}}
      />
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{strength?: number; color?: string}> = ({strength = 0.85, color = '0,0,0'}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 72% 58% at 50% 46%, rgba(${color},0) 40%, rgba(${color},${strength * 0.6}) 75%, rgba(${color},${strength}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

/** Slow luminance flicker, like an old projector / candle unsteadiness. */
export const Flicker: React.FC<{t: number; amount?: number}> = ({t, amount = 0.05}) => {
  const f = (noise1(t * 9, 4) * 0.5 + 0.5) * amount;
  return <AbsoluteFill style={{background: '#000', opacity: f, pointerEvents: 'none'}} />;
};

/** Eyelids closing/opening; open=0 fully shut, 1 fully open. */
export const Eyelids: React.FC<{open: number}> = ({open}) => {
  const {W, H} = useFormat();
  const o = Math.max(0, Math.min(1, open));
  const gap = o * H * 0.6; // half-height of the visible lens
  const curve = 260 * (1 - o * 0.4);
  const top = H / 2 - gap;
  const bot = H / 2 + gap;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <filter id="lidblur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={40 - o * 18} />
          </filter>
        </defs>
        <g filter="url(#lidblur)">
          <path d={`M-200,-200 H${W + 200} V${top} Q${W / 2},${top + curve} -200,${top} Z`} fill="#000" />
          <path d={`M-200,${H + 200} H${W + 200} V${bot} Q${W / 2},${bot - curve} -200,${bot} Z`} fill="#000" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Full-frame SVG stage in the current format's units (1080x1920 or 1920x1080). Set h for taller worlds (camera tilts). */
export const Stage: React.FC<{children: React.ReactNode; h?: number; overflow?: boolean}> = ({children, h, overflow}) => {
  const {W, H} = useFormat();
  const hh = h ?? H;
  // overflow: draw world content outside 0..W / 0..h too (for pans and zooms that look past the frame edge)
  return (
    <svg width={W} height={hh} viewBox={`0 0 ${W} ${hh}`} style={{position: 'absolute', left: 0, top: 0, overflow: overflow ? 'visible' : 'hidden'}}>
      {children}
    </svg>
  );
};

/**
 * Phone-torch / lantern darkness: everything black except a soft disc at screen position (x, y).
 * Render it AFTER the Camera (it is in screen space). ambient 0.06–0.14 keeps the room faintly readable.
 */
export const Torch: React.FC<{x: number; y: number; r?: number; ambient?: number; tint?: string}> = ({
  x,
  y,
  r = 380,
  ambient = 0.12,
  tint = '210,225,255',
}) => (
  <>
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle ${r * 1.6}px at ${x}px ${y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,${0.35 - ambient}) 45%, rgba(0,0,0,${1 - ambient}) 100%)`,
      }}
    />
    <AbsoluteFill
      style={{
        mixBlendMode: 'screen',
        background: `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(${tint},0.16) 0%, rgba(${tint},0.05) 55%, rgba(0,0,0,0) 100%)`,
      }}
    />
  </>
);
