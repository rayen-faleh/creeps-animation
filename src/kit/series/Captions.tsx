import React from 'react';
import {AbsoluteFill} from 'remotion';
import {theme} from '../theme';
import {lin} from '../util';

/** Shape of timing.json written by tts/narrate.py. Times are global seconds. */
export type TimingLine = {
  id: string;
  text: string;
  start: number;
  end: number;
  whisper: boolean;
  phrases: {text: string; start: number; end: number}[];
};
export type Timing = {unit: string; total: number; lines: TimingLine[]};

type Phrase = {text: string; start: number; end: number; whisper: boolean};
export const phrasesOf = (timing: Timing): Phrase[] =>
  timing.lines.flatMap((l) => l.phrases.map((p) => ({...p, whisper: !!l.whisper})));

/**
 * Burned-in phrase captions. One phrase at a time, fade + 10 px rise in, never overlapping the next.
 * redWords: exact words (with punctuation) drawn in blood red — at most one per beat.
 */
export const Captions: React.FC<{t: number; timing: Timing; redWords?: string[]; top?: number}> = ({t, timing, redWords = [], top = 1330}) => {
  const phrases = phrasesOf(timing);
  const red = new Set(redWords);
  const idx = phrases.findIndex(
    (p, i) => t >= p.start - 0.05 && t < Math.max(p.end + 0.25, p.start + 0.6) && (i === phrases.length - 1 || t < phrases[i + 1].start - 0.05),
  );
  if (idx < 0) return null;
  const p = phrases[idx];
  const inP = lin(t, p.start - 0.05, p.start + 0.12);
  const out = 1 - lin(t, p.end + 0.12, p.end + 0.25);
  const words = p.text.split(' ');
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: top}}>
      <div
        style={{
          width: 900,
          textAlign: 'center',
          fontFamily: theme.fonts.caption,
          fontWeight: 600,
          fontStyle: p.whisper ? 'italic' : 'normal',
          fontSize: p.whisper ? 70 : 78,
          lineHeight: 1.08,
          color: p.whisper ? '#c9b8b0' : theme.caption,
          opacity: inP * out * (p.whisper ? 0.85 : 1),
          transform: `translateY(${(1 - inP) * 10}px)`,
          textShadow: '0 0 18px rgba(0,0,0,0.95), 0 4px 6px rgba(0,0,0,0.9), 0 0 2px #000',
          letterSpacing: p.whisper ? 3 : 0.5,
        }}
      >
        {words.map((w, i) => (
          <span key={i} style={{color: red.has(w) ? theme.bloodBright : undefined}}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
