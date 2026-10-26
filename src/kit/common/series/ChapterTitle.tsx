import React from 'react';
import {AbsoluteFill} from 'remotion';
import {theme} from '../theme';
import {lin, prog} from '../util';
import {useFormat} from '../format';

export type Chapter = {t: number; title: string; label?: string}; // t: global second the chapter's first scene starts

/**
 * Subtle chapter marker for long-form: a small letter-spaced line (e.g. "CHAPTER II") over the chapter name,
 * upper left, fading in just after the scene change and out again after a few seconds. No slide, no black.
 */
export const ChapterTitle: React.FC<{t: number; chapters: Chapter[]; hold?: number}> = ({t, chapters, hold = 4.2}) => {
  const {W, H} = useFormat();
  const c = [...chapters].reverse().find((ch) => t >= ch.t);
  if (!c || t > c.t + hold + 1.2) return null;
  const inK = prog(t, c.t + 0.6, c.t + 1.6);
  const out = 1 - lin(t, c.t + hold, c.t + hold + 1.2);
  const a = inK * out;
  const pad = Math.round(Math.min(W, H) * 0.075);
  return (
    <AbsoluteFill style={{padding: `${pad}px ${pad * 1.2}px`, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
      <div style={{opacity: a, transform: `translateX(${(1 - inK) * -14}px)`, textShadow: '0 0 14px rgba(0,0,0,0.9)'}}>
        {c.label && (
          <div style={{fontFamily: theme.fonts.caption, fontWeight: 600, fontSize: Math.round(H * 0.02), letterSpacing: 9, color: '#8a8478'}}>{c.label}</div>
        )}
        <div style={{fontFamily: theme.fonts.caption, fontStyle: 'italic', fontWeight: 600, fontSize: Math.round(H * 0.036), color: '#cfc6b2', marginTop: 4}}>
          {c.title}
        </div>
        <div style={{width: 60 * inK, height: 1, background: theme.blood, marginTop: 10, opacity: 0.8}} />
      </div>
    </AbsoluteFill>
  );
};
