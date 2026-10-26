#!/usr/bin/env python3
"""Write an episode's burned-in caption phrases (from timing.json) as an .srt file for upload.

usage: python3 tts/make_srt.py src/episodes/<slug>      -> src/episodes/<slug>/<slug>.srt
Cues end 0.25 s after the phrase (like the on-screen captions) but never overlap the next one.
"""
import json, os, sys

def ts(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

story = os.path.normpath(sys.argv[1]); slug = os.path.basename(story)
ph = [p for l in json.load(open(os.path.join(story, 'timing.json')))['lines'] for p in l['phrases']]
cues = []
for k, p in enumerate(ph):
    end = p['end'] + 0.25 if k + 1 == len(ph) else min(p['end'] + 0.25, ph[k + 1]['start'] - 0.05)
    cues.append(f"{k + 1}\n{ts(p['start'])} --> {ts(end)}\n{p['text']}\n")
open(os.path.join(story, f'{slug}.srt'), 'w').write('\n'.join(cues))
print(f'{len(cues)} cues -> {story}/{slug}.srt')
