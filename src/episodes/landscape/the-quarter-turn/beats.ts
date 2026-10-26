import timing from './timing.json';
import {Chapter} from '../../../kit/common/series/ChapterTitle';

/** Line timing helpers: every cut in this film is placed from the measured narration (timing.json). */
type Line = {id: string; start: number; end: number; chapter?: string[]};
const LINES = (timing as {lines: Line[]}).lines;
const byId = new Map(LINES.map((l) => [l.id, l]));
export const at = (id: string) => {
  const l = byId.get(id);
  if (!l) throw new Error(`no line ${id}`);
  return l.start;
};
export const end = (id: string) => {
  const l = byId.get(id);
  if (!l) throw new Error(`no line ${id}`);
  return l.end;
};

/** A chapter's first shot opens this long before its first line (in the held silence). */
export const LEAD = 2.2;
export const CHAPTERS: Chapter[] = LINES.filter((l) => l.chapter).map((l) => ({t: l.start - LEAD, label: l.chapter![0], title: l.chapter![1]}));

/** Title card after the cold open; the end of the film. */
export const TITLE = {start: end('C0_03') + 0.7, end: at('C1_01') - LEAD};
export const DRIP_T0 = 0.9; // a drop lands at DRIP_T0 + k * 2 s, shared with cues.py
