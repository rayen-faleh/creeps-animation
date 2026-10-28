import React from 'react';
import {AbsoluteFill} from 'remotion';
import {theme} from '../theme';
import {lin, noise1, prog} from '../util';
import {useFormat} from '../format';

/* The "Would you survive?" format: a day counter in the corner and an end card that asks the question
   back and invites a comment. Reuse for any monster: change `subtitle`, `prompt` and the days. */

export type Day = {t: number; n: number}; // t: global second the day's first shot starts

/**
 * Upper-left day counter ("DAY 2  of 7") that changes on each new day and fades out at `until`.
 * The number lands with a small drop; a short blood rule underlines it.
 */
export const DayTag: React.FC<{t: number; days: Day[]; of?: number; until: number; label?: string}> = ({t, days, of = 7, until, label = 'DAY'}) => {
  const {W, H} = useFormat();
  const d = [...days].reverse().find((x) => t >= x.t);
  if (!d || t >= until) return null;
  const first = days[0].t;
  const a = prog(t, first + 0.05, first + 0.4) * (1 - lin(t, until - 0.25, until));
  const land = prog(t, d.t + 0.02, d.t + 0.3);
  const pad = Math.round(Math.min(W, H) * 0.075);
  return (
    <AbsoluteFill style={{padding: `${pad * 1.4}px ${pad * 1.1}px`, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
      <div style={{opacity: a, textShadow: '0 0 16px rgba(0,0,0,0.95)'}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
          <span style={{fontFamily: theme.fonts.caption, fontWeight: 600, fontSize: Math.round(H * 0.026), letterSpacing: 10, color: '#8a8478'}}>{label}</span>
          <span
            style={{
              fontFamily: theme.fonts.caption,
              fontWeight: 600,
              fontSize: Math.round(H * 0.062),
              color: '#ece4d2',
              display: 'inline-block',
              transform: `translateY(${(1 - land) * -18}px)`,
              opacity: land,
            }}
          >
            {d.n}
          </span>
          <span style={{fontFamily: theme.fonts.caption, fontStyle: 'italic', fontWeight: 600, fontSize: Math.round(H * 0.022), color: '#8a8478'}}>of {of}</span>
        </div>
        <div style={{width: 90 * land, height: 2, background: theme.blood, marginTop: 4}} />
      </div>
    </AbsoluteFill>
  );
};

/**
 * End card on black: the question (blackletter, blood red), the monster underneath, then the comment
 * prompt with a small downward chevron. Timings follow TitleCard: title from t0 + 1.0 s.
 */
export const SurviveCard: React.FC<{t: number; t0: number; title?: string; subtitle: string; prompt: string; cta?: string}> = ({
  t,
  t0,
  title = 'Would You Survive?',
  subtitle,
  prompt,
  cta = 'TELL ME IN THE COMMENTS',
}) => {
  const ti = prog(t, t0 + 1.0, t0 + 2.0);
  const sub = prog(t, t0 + 1.6, t0 + 2.3);
  const pr = prog(t, t0 + 2.5, t0 + 3.2);
  const ct = prog(t, t0 + 3.0, t0 + 3.6);
  const bob = Math.sin((t - t0) * 4) * 6 * ct;
  const flick = 0.85 + noise1(t * 14, 9) * 0.15;
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <div style={{marginTop: -160, maxWidth: 960}}>
        <div
          style={{
            fontFamily: theme.fonts.title,
            fontSize: 150,
            lineHeight: 1.02,
            color: theme.blood,
            opacity: ti * flick,
            letterSpacing: 3,
            textShadow: `0 0 40px rgba(196,22,28,${0.35 * ti})`,
            transform: `scale(${1.06 - ti * 0.06})`,
          }}
        >
          {title}
        </div>
        <div style={{fontFamily: theme.fonts.caption, fontSize: 48, color: '#8a8478', opacity: sub, letterSpacing: 16, marginTop: 18}}>{subtitle}</div>
        <div style={{width: 120 * pr, height: 2, background: theme.blood, margin: '70px auto 0', opacity: 0.8}} />
        <div style={{fontFamily: theme.fonts.caption, fontStyle: 'italic', fontWeight: 600, fontSize: 76, color: '#ece4d2', opacity: pr, marginTop: 50, transform: `translateY(${(1 - pr) * 12}px)`}}>
          {prompt}
        </div>
        <div style={{fontFamily: theme.fonts.caption, fontWeight: 600, fontSize: 34, letterSpacing: 9, color: '#8a8478', opacity: ct, marginTop: 34}}>{cta}</div>
        <svg width={60} height={40} style={{opacity: ct, marginTop: 18, transform: `translateY(${bob}px)`}}>
          <path d="M8,8 L30,30 L52,8" stroke="#c4161c" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

export type Stamp = {t: number; time: string}; // t: global second the clock tag changes to `time`

/** Upper-left clock tag ("02:47") for night-shift stories; changes on each stamp, a red rule underneath. */
export const ClockTag: React.FC<{t: number; stamps: Stamp[]; until: number; label?: string}> = ({t, stamps, until, label = 'NIGHT SHIFT'}) => {
  const {W, H} = useFormat();
  const st = [...stamps].reverse().find((x) => t >= x.t);
  if (!st || t >= until) return null;
  const a = prog(t, stamps[0].t + 0.05, stamps[0].t + 0.4) * (1 - lin(t, until - 0.25, until));
  const land = prog(t, st.t + 0.02, st.t + 0.3);
  const pad = Math.round(Math.min(W, H) * 0.075);
  return (
    <AbsoluteFill style={{padding: `${pad * 1.4}px ${pad * 1.1}px`, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
      <div style={{opacity: a, textShadow: '0 0 16px rgba(0,0,0,0.95)'}}>
        <div style={{fontFamily: theme.fonts.caption, fontWeight: 600, fontSize: Math.round(H * 0.018), letterSpacing: 9, color: '#8a8478'}}>{label}</div>
        <div style={{fontFamily: 'Courier New, monospace', fontWeight: 700, fontSize: Math.round(H * 0.04), color: '#ece4d2', opacity: land, transform: `translateY(${(1 - land) * -12}px)`}}>{st.time}</div>
        <div style={{width: 90 * land, height: 2, background: theme.blood, marginTop: 4}} />
      </div>
    </AbsoluteFill>
  );
};

/**
 * Poll end card for interactive series: the question (blackletter), the series and part, two lettered options, and a
 * prompt to vote in the comments. Timings follow SurviveCard (question from t0 + 1.0 s).
 */
export const PollCard: React.FC<{t: number; t0: number; question?: string; series: string; a: string; b: string; prompt?: string}> = ({
  t,
  t0,
  question = 'What Do You Do?',
  series,
  a,
  b,
  prompt = 'COMMENT A OR B',
}) => {
  const q = prog(t, t0 + 1.0, t0 + 2.0);
  const sub = prog(t, t0 + 1.5, t0 + 2.1);
  const oa = prog(t, t0 + 2.2, t0 + 2.7);
  const ob = prog(t, t0 + 2.7, t0 + 3.2);
  const pr = prog(t, t0 + 3.3, t0 + 3.9);
  const flick = 0.85 + noise1(t * 14, 9) * 0.15;
  const opt = (letter: string, text: string, p: number) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 28, opacity: p, transform: `translateX(${(1 - p) * -20}px)`, marginTop: 34, textAlign: 'left'}}>
      <div style={{width: 92, height: 92, borderRadius: 46, border: `3px solid ${theme.blood}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: theme.fonts.caption, fontWeight: 600, fontSize: 58, color: '#ece4d2', flexShrink: 0}}>{letter}</div>
      <div style={{fontFamily: theme.fonts.caption, fontWeight: 600, fontSize: 56, color: '#ece4d2', lineHeight: 1.1}}>{text}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{marginTop: -120, maxWidth: 900, textAlign: 'center'}}>
        <div style={{fontFamily: theme.fonts.title, fontSize: 140, lineHeight: 1.02, color: theme.blood, opacity: q * flick, textShadow: `0 0 40px rgba(196,22,28,${0.35 * q})`, transform: `scale(${1.06 - q * 0.06})`}}>{question}</div>
        <div style={{fontFamily: theme.fonts.caption, fontSize: 40, letterSpacing: 14, color: '#8a8478', opacity: sub, marginTop: 16}}>{series}</div>
        <div style={{marginTop: 50, display: 'inline-block'}}>
          {opt('A', a, oa)}
          {opt('B', b, ob)}
        </div>
        <div style={{fontFamily: theme.fonts.caption, fontWeight: 600, fontSize: 36, letterSpacing: 9, color: '#8a8478', opacity: pr, marginTop: 60}}>{prompt}</div>
      </div>
    </AbsoluteFill>
  );
};
