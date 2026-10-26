import React from 'react';
import {AbsoluteFill} from 'remotion';
import {theme} from '../theme';
import {noise1, prog} from '../util';

/**
 * End card on pure black. The title fades in from t0 + 1.0 s with candle flicker and a 1.06 -> 1.00 settle;
 * the subtitle (e.g. "PART II", or a tagline) follows 0.7 s later. Long titles shrink to fit.
 */
export const TitleCard: React.FC<{t: number; t0: number; title: string; subtitle?: string}> = ({t, t0, title, subtitle}) => {
  const ti = prog(t, t0 + 1.0, t0 + 2.0);
  const sub = prog(t, t0 + 1.7, t0 + 2.4);
  const flick = 0.85 + noise1(t * 14, 9) * 0.15;
  const size = Math.min(190, Math.floor(1700 / Math.max(6, title.length)));
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: theme.fonts.title,
          fontSize: size,
          color: theme.blood,
          opacity: ti * flick,
          letterSpacing: 4,
          textAlign: 'center',
          maxWidth: 980,
          lineHeight: 1.05,
          textShadow: `0 0 40px rgba(196,22,28,${0.35 * ti})`,
          transform: `scale(${1.06 - ti * 0.06})`,
          marginTop: -120,
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div style={{fontFamily: theme.fonts.caption, fontSize: 48, color: '#8a8478', opacity: sub, letterSpacing: 18, marginTop: 10, textAlign: 'center'}}>
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
